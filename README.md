# React 학습 도우미

클로드 디자인 캔버스 시안(시작하기 / 컴포넌트와 Props / useState / 이벤트 핸들링 /
조건부·리스트 렌더링 / useEffect, 총 6페이지)을 기반으로 구현한 React 앱.

- 왼쪽 사이드바, 가운데 학습 콘텐츠는 모두 **하드코딩**된 정적 콘텐츠입니다.
- 오른쪽 챗봇(`ChatPanel`)만 **실제 백엔드 API(`/chat`)를 호출**합니다. 하드코딩된 답변은
  없고, `src/api/chat.js`가 매번 fetch로 실서버에 질문을 보냅니다.

## 실행

```bash
npm install
npm run dev
```

## 챗봇 백엔드 연결

- 배포 환경(CloudFront가 `/`는 S3, `/chat`은 API Gateway로 라우팅)에서는 그대로 두면
  상대 경로 `/chat`으로 같은 도메인에 요청이 가서 별도 설정이 필요 없습니다.
- 로컬에서 실제 AWS 백엔드 없이 UI만 테스트하려면:
  ```bash
  node mock-server.js        # 포트 4000에 가짜 /chat 서버 실행
  npm run dev                 # vite.config.js의 proxy가 /chat을 위 서버로 전달
  ```
- 다른 API 도메인을 쓰고 싶다면 `.env.example`을 참고해 `.env.local`에
  `VITE_CHAT_API_URL`을 지정하세요.

## 기대하는 `/chat` API 계약

**요청**
```json
POST /chat
{ "message": "useState는 왜 비동기처럼 동작해요?" }
```

**응답** (아래 두 형태 중 하나를 받으면 됩니다. `src/api/chat.js`가 둘 다 처리합니다)
```json
{ "answer": "...", "sources": [{ "title": "...", "url": "..." }] }
```
또는 Bedrock Knowledge Base `RetrieveAndGenerate`의 원본 응답을 그대로 전달해도 됩니다:
```json
{ "output": { "text": "..." }, "citations": [{ "retrievedReferences": [{ "metadata": { "url": "..." } }] }] }
```

## 폴더 구조

```
src/
  api/chat.js              실제 /chat API 호출 + 응답 정규화
  components/
    Sidebar.jsx             좌측 커리큘럼 네비게이션
    ChatPanel.jsx           우측 챗봇 (하드코딩 아님)
    CodeTokens.jsx          코드 블록 문법 하이라이팅용 토큰 컴포넌트
  pages/                    6개 학습 페이지 (전부 하드코딩된 콘텐츠)
  data/                     커리큘럼 목록, 페이지별 추천 질문 칩
  hooks/useHashRoute.js      외부 라우터 없이 #해시로 탭 전환
  styles/                   디자인 토큰(tokens.css) + 전역 스타일(global.css)
```
