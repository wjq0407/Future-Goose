import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import { traeBadgePlugin } from 'vite-plugin-trae-solo-badge';

export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : process.env.GITHUB_PAGES === 'true' ? '/未来鹅/' : '/',
  build: {
    sourcemap: 'hidden',
    target: 'es2015',
    rollupOptions: {
      input: './index.html',
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'chart-vendor': ['chart.js', 'react-chartjs-2'],
          'markdown-vendor': ['react-markdown', 'remark-gfm', 'react-syntax-highlighter'],
          'utils-vendor': ['clsx', 'tailwind-merge', 'zustand', 'web-vitals'],
          'dompurify-vendor': ['dompurify'],
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    reportCompressedSize: false,
  },
  server: {
    proxy: {
      '/api/chat': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/tencent-api': {
        target: 'https://careers.tencent.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tencent-api/, '/tencentcareer/api'),
        secure: true,
      },
      '/tencent-campus': {
        target: 'https://join.qq.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tencent-campus/, '/api/v1'),
        secure: true,
      },
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    traeBadgePlugin({
      variant: 'dark',
      position: 'bottom-right',
      prodOnly: true,
      clickable: true,
      clickUrl: 'https://www.trae.ai/solo?showJoin=1',
      autoTheme: true,
      autoThemeTarget: '#root'
    }), 
    tsconfigPaths()
  ],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
}))
