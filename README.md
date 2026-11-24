# React 학습 도우미

클로드 디자인 캔버스 시안(시작하기 / 컴포넌트와 Props / useState / 이벤트 핸들링 /
조건부·리스트 렌더링 / useEffect, 총 6페이지)을 기반으로 구현한 React 앱.

- 왼쪽 사이드바, 가운데 학습 콘텐츠는 모두 **하드코딩**된 정적 콘텐츠입니다 (기획서: React 소개는 하드코딩, RAG 대상 아님).
- 오른쪽 챗봇(`ChatPanel`)만 **실제 백엔드 API(`/api/chat`)를 호출**합니다. 하드코딩된 답변이나
  목업 서버는 없고, `src/api/chat.js`가 매번 fetch로 실서버에 질문을 보냅니다.

- 서비스 주소: https://d3d4mgek5e8eo7.cloudfront.net
- 아키텍처: CloudFront → S3(정적, OAC) / `/api/*` → API Gateway → Lambda → Bedrock Knowledge Bases(S3 Vectors) + Claude Haiku 4.5
- 백엔드 리소스·운영 방법: [`backend/README.md`](backend/README.md)
- RAG 원천 문서: [`rag-documents/`](rag-documents/) (Markdown 5개 + `.metadata.json` 5개)

## 실행

```bash
npm ci
npm run dev   # vite proxy가 /api 요청을 배포된 CloudFront로 전달 → 실제 Bedrock 답변
```

## 배포

`main`에 push하면 GitHub Actions(`.github/workflows/deploy.yml`)가 빌드 → `s3 sync` → CloudFront 무효화를 수행한다.
필요한 GitHub Secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID` (워크플로가 값 앞뒤 공백을 제거)

## `/api/chat` API 계약

**요청**
```json
POST /api/chat
{ "question": "useState는 왜 비동기처럼 동작해요?" }
```
질문은 1~500자.

**응답**
```json
200 { "answer": "...", "sources": [{ "title": "...", "url": "..." }], "grounded": true }
```
- 근거 문서가 없으면 `grounded: false`와 고정 안내 문구
- 400 입력 오류 · 429 요청 제한(화면에 안내 문구 표시) · 500 서버 오류

## 폴더 구조

```
src/
  api/chat.js              실제 /api/chat 호출 + 오류(429 등) 처리 + 응답 정규화
  components/
    Sidebar.jsx             좌측 커리큘럼 네비게이션
    ChatPanel.jsx           우측 챗봇 (하드코딩 아님)
    CodeTokens.jsx          코드 블록 문법 하이라이팅용 토큰 컴포넌트
    RichText.jsx            챗봇 답변의 코드 블록/인라인 코드/굵게 렌더링
  pages/                    6개 학습 페이지 (전부 하드코딩된 콘텐츠)
  data/curriculum.js        사이드바 커리큘럼 목록 (추천 질문 칩은 각 페이지에 직접 작성)
  hooks/useHashRoute.js      외부 라우터 없이 #해시로 탭 전환
  styles/                   디자인 토큰(tokens.css) + 전역 스타일(global.css)
```
