import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/service-worker.ts',  // path in your project
          dest: '.'                      // copy to dist root
        }
      ]
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        serviceWorker: 'src/service-worker.ts',
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
  }
})
