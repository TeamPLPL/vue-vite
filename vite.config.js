import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: '../backend/src/main/resources/static' // 빌드 결과물 저장 디렉토리
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 백엔드 프로젝트에서 지정한 주소
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // `/api`를 제거하고 Spring Boot로 전달
      },
      // '/api/payment/reward': {
      //   target: 'http://localhost:8080',
      //   changeOrigin: true
      // }
      // '/login': {
      //   target: 'http://localhost:8080',  // 스프링 부트 백엔드 주소
      //   changeOrigin: true,
      // },
      // '/signup': {
      //   target: 'http://localhost:8080',  // 스프링 부트 백엔드 주소
      //   changeOrigin: true,
      // },
      // '/user': {
      //   target: 'http://localhost:8080',
      //   changeOrigin: true,
      // },
      // '/logout': {
      //   target: 'http://localhost:8080',
      //   changeOrigin: true,
      // }
    }
  }
})
