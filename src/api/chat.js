// 실제 백엔드(API Gateway -> Lambda -> Bedrock Knowledge Base RetrieveAndGenerate) 호출.
// CloudFront가 "/chat" 경로를 API Gateway로 라우팅하므로 배포 환경에서는 상대 경로만으로 충분하다.
// 별도 API 도메인을 쓰고 싶으면 .env에 VITE_CHAT_API_URL을 지정하면 그 값을 우선 사용한다.
const CHAT_ENDPOINT = import.meta.env.VITE_CHAT_API_URL || '/chat';

/**
 * Lambda 응답 포맷이 아직 확정되지 않았을 수 있어서, 두 가지 모양을 모두 받아들인다.
 *  1) 이미 가공된 형태:      { answer: string, sources: [{ title, url }] }
 *  2) Bedrock KB 원본 그대로: { output: { text }, citations: [{ retrievedReferences: [{ metadata }] }] }
 */
function normalizeResponse(data) {
  if (!data || typeof data !== 'object') {
    return { answer: String(data ?? ''), sources: [] };
  }

  const answer =
    data.answer ??
    data.response ??
    data.message ??
    data.output?.text ??
    '';

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
        const uri =
          meta.url ||
          meta.source_url ||
          meta['x-amz-bedrock-kb-source-uri'] ||
          ref.location?.s3Location?.uri ||
          null;
        return {
          title: meta.title || meta.source || uri || '출처',
          url: uri,
        };
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

export async function askChatbot(message, { signal } = {}) {
  const res = await fetch(CHAT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
    signal,
  });

  if (!res.ok) {
    let detail = '';
    try {
      detail = (await res.json())?.message || '';
    } catch {
      /* 응답이 JSON이 아니어도 무시 */
    }
    throw new Error(detail || `챗봇 서버 오류 (status ${res.status})`);
  }

  const data = await res.json();
  return normalizeResponse(data);
}
