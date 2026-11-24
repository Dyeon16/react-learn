// react-learn RAG 챗봇 API Lambda (Node.js 22, AWS SDK v3는 런타임 내장)
// CloudFront(/api/*) → API Gateway(HTTP API, Throttling) → 이 함수 → Bedrock Knowledge Bases
//
//   POST /api/chat  { "question": "..." }
//     → RetrieveAndGenerate (S3 Vectors 검색 + Claude Haiku 4.5 생성)
//     ← { "answer": "...", "sources": [{ "title", "url" }], "grounded": true|false }
//
// 상태 코드: 200 정상 / 400 입력 오류 / 429 요청 제한 / 500 서버 오류
// (404는 CloudFront의 SPA 오류 페이지 매핑과 겹치므로 사용하지 않는다. 403은 직접 접근 차단에만 사용)
import {
  BedrockAgentRuntimeClient,
  RetrieveAndGenerateCommand,
} from '@aws-sdk/client-bedrock-agent-runtime';

const KNOWLEDGE_BASE_ID = process.env.KNOWLEDGE_BASE_ID;
const MODEL_ARN = process.env.MODEL_ARN;
const NUMBER_OF_RESULTS = Number(process.env.NUMBER_OF_RESULTS || 4);
const MAX_QUESTION_LENGTH = 500;
const ORIGIN_VERIFY_SECRET = process.env.ORIGIN_VERIFY_SECRET;

export const FALLBACK =
  '죄송해요, 제가 가진 React 학습 문서에서는 그 질문에 대한 근거를 찾지 못했어요. ' +
  '컴포넌트·Props, State(useState), Effect(useEffect), 이벤트 핸들링, 조건부·리스트 렌더링에 대해 물어봐 주세요.';

// 생성 모델 프롬프트: 검색 결과에만 근거해 쉬운 설명 + 짧은 코드 예시를 작성하도록 제한
const PROMPT_TEMPLATE = `당신은 React 입문 개발자를 돕는 학습 도우미입니다.
아래 검색 결과(React 공식 문서 react.dev를 재구성한 학습 자료)에만 근거해서 사용자의 질문에 답하세요.

규칙:
- 한국어로, 입문자도 이해할 수 있게 쉽고 짧게 설명하세요.
- 도움이 되면 검색 결과에 근거한 간단한 코드 예시를 \`\`\`jsx 코드 블록으로 하나 넣으세요.
- 검색 결과에 답의 근거가 없거나 React와 관계없는 질문이면, 외부 지식으로 추측하지 말고 정확히 "NO_ANSWER" 한 단어만 출력하세요.
- 검색 결과에 없는 API나 동작을 지어내지 마세요.

검색 결과:
$search_results$

$output_format_instructions$`;

const client = new BedrockAgentRuntimeClient({});

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  },
  body: JSON.stringify(body),
});

const log = (fields) => console.log(JSON.stringify({ service: 'react-learn-api', ...fields }));

function parseBody(event) {
  if (!event.body) return {};
  const raw = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body;
  return JSON.parse(raw);
}

// 인용된 문서를 title+url 기준으로 중복 제거
function extractSources(citations = []) {
  const seen = new Map();
  for (const c of citations) {
    for (const ref of c.retrievedReferences ?? []) {
      const md = ref.metadata ?? {};
      const url = md.source_url || ref.location?.s3Location?.uri || '';
      const title = md.title || md.topic || '참고 문서';
      const key = `${title}|${url}`;
      if (!seen.has(key)) seen.set(key, { title, url });
    }
  }
  return [...seen.values()];
}

async function chat(question) {
  const started = Date.now();
  try {
    const res = await client.send(
      new RetrieveAndGenerateCommand({
        input: { text: question },
        retrieveAndGenerateConfiguration: {
          type: 'KNOWLEDGE_BASE',
          knowledgeBaseConfiguration: {
            knowledgeBaseId: KNOWLEDGE_BASE_ID,
            modelArn: MODEL_ARN,
            retrievalConfiguration: {
              vectorSearchConfiguration: { numberOfResults: NUMBER_OF_RESULTS },
            },
            generationConfiguration: {
              promptTemplate: { textPromptTemplate: PROMPT_TEMPLATE },
              inferenceConfig: { textInferenceConfig: { maxTokens: 1024, temperature: 0.2 } },
            },
          },
        },
      })
    );

    const text = (res.output?.text ?? '').trim();
    const sources = extractSources(res.citations);
    const refused =
      !text ||
      text.includes('NO_ANSWER') ||
      /unable to assist|cannot assist|답변할 수 없/i.test(text) ||
      sources.length === 0;

    log({
      event: 'bedrock_call',
      outcome: 'success',
      grounded: !refused,
      sourceCount: sources.length,
      latencyMs: Date.now() - started,
      questionLength: question.length,
    });

    return refused
      ? { answer: FALLBACK, sources: [], grounded: false }
      : { answer: text, sources, grounded: true };
  } catch (err) {
    log({
      event: 'bedrock_call',
      outcome: 'failure',
      errorName: err.name,
      errorMessage: err.message,
      latencyMs: Date.now() - started,
    });
    throw err;
  }
}

export const handler = async (event) => {
  // API Gateway는 CloudFront(/api/*)를 통해서만 받는다 (기획서).
  // HTTP API는 리소스 정책이 없으므로 CloudFront가 붙이는 오리진 커스텀 헤더로 검증한다.
  // 이 403은 execute-api 주소로 직접 호출할 때만 발생하므로 CloudFront 오류 매핑과 겹치지 않는다.
  if (ORIGIN_VERIFY_SECRET && event.headers?.['x-origin-verify'] !== ORIGIN_VERIFY_SECRET) {
    log({ event: 'direct_access_blocked', sourceIp: event.requestContext?.http?.sourceIp });
    return json(403, { message: 'Forbidden' });
  }

  const method = event.requestContext?.http?.method;
  const path = event.rawPath;

  if (method !== 'POST' || path !== '/api/chat') {
    return json(400, { message: '지원하지 않는 요청입니다.' });
  }

  let body;
  try {
    body = parseBody(event);
  } catch {
    return json(400, { message: '요청 형식이 올바르지 않습니다.' });
  }

  const question = typeof body.question === 'string' ? body.question.trim() : '';
  if (!question) {
    return json(400, { message: '질문을 입력해 주세요.' });
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    return json(400, { message: `질문은 ${MAX_QUESTION_LENGTH}자 이내로 입력해 주세요.` });
  }

  try {
    return json(200, await chat(question));
  } catch (err) {
    if (err.name === 'ThrottlingException' || err.name === 'ServiceQuotaExceededException') {
      return json(429, { message: '요청이 많아 잠시 후 다시 시도해 주세요.' });
    }
    return json(500, { message: '답변을 생성하는 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.' });
  }
};
