import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { resolve } from 'path'

const localPreviewPlugin = (): Plugin => {
  return {
    name: 'local-preview',
    transformIndexHtml: {
      order: 'post',
      handler(html: string) {
        // Remove type="module" and move script to body
        let result = html.replace(
          /<script type="module" crossorigin/g,
          '<script'
        )
        
        // Move script tag from head to body
        const scriptMatch = result.match(/<script[^>]*src="[^"]*"[^>]*><\/script>/)
        if (scriptMatch) {
          const scriptTag = scriptMatch[0]
          result = result.replace(scriptTag, '')
          result = result.replace('</body>', `  ${scriptTag}\n</body>`)
        }
        
        return result
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localPreviewPlugin()],
  base: './',
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      overlay: false,
      port: 24678
    },
    watch: {
      usePolling: true,
      interval: 100
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@reduxjs/toolkit',
      'axios',
      'dayjs'
    ]
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: false,
    rollupOptions: {
      input: {
        main: './index.html'
      },
      output: {
        format: 'iife',
        manualChunks: undefined,
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
})
