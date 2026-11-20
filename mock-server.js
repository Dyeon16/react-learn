// 로컬 개발용 가짜 /chat 서버. 실제 Bedrock Knowledge Base 백엔드가 아직 배포되지 않았을 때
// 챗봇 UI를 테스트하기 위한 용도다. (node mock-server.js 로 실행, 포트 4000)
// vite.config.js의 proxy 설정이 이 서버로 /chat 요청을 그대로 넘겨준다.
import http from 'node:http';

const PORT = 4000;

const server = http.createServer(async (req, res) => {
  if (req.method !== 'POST' || req.url !== '/chat') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'not found' }));
    return;
  }

  let body = '';
  for await (const chunk of req) body += chunk;

  let message = '';
  try {
    message = JSON.parse(body).message || '';
  } catch {
    /* ignore */
  }

  // 실제 Bedrock KB RetrieveAndGenerate 응답 모양을 흉내낸다.
  await new Promise((r) => setTimeout(r, 500));

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      answer: `(모의 응답) "${message}"에 대한 답변이에요. 실제 배포 후에는 Bedrock Knowledge Base가 react.dev 문서를 검색해서 답변을 생성해요.`,
      sources: [
        { title: 'react.dev - Learn React', url: 'https://react.dev/learn' },
      ],
    })
  );
});

server.listen(PORT, () => {
  console.log(`mock /chat server listening on http://localhost:${PORT}`);
});
