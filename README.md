# react-learn

React 공식 문서(react.dev) 기반 학습 도우미 챗봇 — 프론트엔드.

## 개발

```bash
npm install
npm run dev
```

## 빌드 / 배포

```bash
npm run build
```

`dist/` 폴더가 생기면 S3(웹사이트 버킷)에 업로드하고 CloudFront로 서빙합니다.

## 디자인

디자인 토큰은 `src/styles/tokens.css`에 있습니다. 메인 컬러는 React 로고 블루를 기반으로 한
`--primary-600` / `--primary-700`이고, 로고 컬러(`--primary-300`)는 장식용으로만 씁니다.
