import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// CloudFront가 "/" 는 S3(정적 사이트)로, "/chat" 은 API Gateway로 라우팅하는 구조이므로
// 프런트엔드에서는 같은 도메인의 상대 경로("/chat")로만 호출하면 되고, 별도 CORS 설정이 필요 없다.
// 로컬 개발 중에는 아래 proxy로 /chat 요청을 실제 API 엔드포인트로 흘려보낼 수 있다.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/chat': {
        target: process.env.VITE_CHAT_API_ORIGIN || 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
