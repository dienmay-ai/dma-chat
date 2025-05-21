import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'DMAChatWidget', // Đổi từ 'JustChat'
      fileName: (format) => `dma-chat-widget.${format}.js` // Đổi từ 'just-chat'
    },
    rollupOptions: {
      output: {
        globals: {
          // Add any external dependencies here if needed
        }
      }
    }
  }
});