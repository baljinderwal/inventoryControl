import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'mui-core': ['@mui/material', '@emotion/react', '@emotion/styled'],
          'mui-icons': ['@mui/icons-material'],
          'charts': ['recharts'],
          'motion': ['framer-motion'],
          'pdf': ['jspdf', 'jspdf-autotable'],
          'barcode': ['@zxing/library', 'react-zxing'],
          'query': ['@tanstack/react-query'],
          'csv': ['@json2csv/plainjs']
        }
      }
    },
    chunkSizeWarningLimit: 500
  }
})
