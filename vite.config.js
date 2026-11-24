import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// CloudFront가 "/*" 는 S3(정적 사이트, OAC)로, "/api/*" 는 API Gateway로 라우팅하는 구조이므로
// 프런트엔드에서는 같은 도메인의 상대 경로("/api/chat")로만 호출하면 되고, 별도 CORS 설정이 필요 없다.
// 로컬 개발 중에는 아래 proxy가 /api 요청을 배포된 CloudFront로 넘겨 실제 Bedrock 답변을 받는다.
//   다른 대상을 쓰려면: VITE_DEV_API_TARGET=https://... npm run dev
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_DEV_API_TARGET || 'https://d3d4mgek5e8eo7.cloudfront.net',
        changeOrigin: true,
      },
    },
  },
});
