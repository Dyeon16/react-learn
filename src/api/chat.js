// 실제 백엔드 호출: CloudFront(/api/*) → API Gateway(HTTP API) → Lambda → Bedrock Knowledge Base
// (RetrieveAndGenerate). 프런트엔드와 API가 같은 도메인이라 상대 경로만으로 충분하고 CORS 설정도 필요 없다.
// 로컬 개발 중에는 vite.config.js 의 proxy 가 /api 요청을 배포된 CloudFront로 전달한다.
const CHAT_ENDPOINT = '/api/chat';
const TIMEOUT_MS = 35000;

// 백엔드(Lambda)와 같은 제한. 넘으면 서버가 400을 돌려준다.
export const MAX_QUESTION_LENGTH = 500;

export class ChatApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ChatApiError';
    this.status = status;
  }
}

/**
 * 응답 계약 (backend/api/index.mjs):
 *   200 { answer: string, sources: [{ title, url }], grounded: boolean }
 *   400 { message }  입력 오류 · 429 요청 제한 · 500 { message } 서버 오류
 * 혹시 Bedrock KB 원본 모양({ output: { text }, citations })이 와도 처리할 수 있게 둔다.
 */
function normalizeResponse(data) {
  if (!data || typeof data !== 'object') {
    return { answer: String(data ?? ''), sources: [] };
  }

  const answer = data.answer ?? data.output?.text ?? '';

  let sources = [];

  if (Array.isArray(data.sources)) {
    sources = data.sources
      .map((s) => ({
        title: s.title || s.name || s.url || '출처',
        url: s.url || s.uri || null,
      }))
      .filter((s) => s.url);
  } else if (Array.isArray(data.citations)) {
    sources = data.citations
      .flatMap((c) => c.retrievedReferences || [])
      .map((ref) => {
        const meta = ref.metadata || {};
        const uri = meta.source_url || meta.url || ref.location?.s3Location?.uri || null;
        return { title: meta.title || uri || '출처', url: uri };
      })
      .filter((s) => s.url);
  }

  // 같은 url이 여러 번 인용되면 하나로 합친다.
  const seen = new Set();
  sources = sources.filter((s) => {
    if (seen.has(s.url)) return false;
    seen.add(s.url);
    return true;
  });

  return { answer: answer || '답변을 받지 못했어요.', sources };
}

export async function askChatbot(question, { signal } = {}) {
  // 호출한 쪽의 취소(signal)와 타임아웃을 함께 처리
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  signal?.addEventListener('abort', onAbort);
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, TIMEOUT_MS);

  let res;
  try {
    res = await fetch(CHAT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err.name === 'AbortError' && !timedOut) throw err; // 사용자가 취소한 경우
    throw new ChatApiError(
      timedOut
        ? '응답이 너무 오래 걸려요. 잠시 후 다시 시도해주세요.'
        : '서버에 연결하지 못했어요. 인터넷 연결을 확인해주세요.',
    );
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onAbort);
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* 응답이 JSON이 아니어도 아래 상태 코드로 처리 */
  }

  if (res.status === 429) {
    throw new ChatApiError(
      '질문이 너무 빠르게 이어지고 있어요. 몇 초만 기다렸다가 다시 물어봐 주세요.',
      429,
    );
  }
  if (!res.ok) {
    throw new ChatApiError(
      data?.message || '답변을 가져오지 못했어요. 잠시 후 다시 시도해주세요.',
      res.status,
    );
  }

  return normalizeResponse(data);
}
