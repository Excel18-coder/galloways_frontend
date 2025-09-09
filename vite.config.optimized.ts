import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          'vendor-ui': ['lucide-react', '@tanstack/react-query'],
          
          // Component chunks
          'admin-components': [
            './src/components/admin/AdminDashboard',
            './src/components/admin/AdminClaims',
            './src/components/admin/AdminConsultations',
            './src/components/admin/AdminDiaspora',
            './src/components/admin/AdminOutsourcing',
            './src/components/admin/AdminQuotes',
            './src/components/admin/AdminUsers',
            './src/components/admin/AdminSettings',
            './src/components/admin/AdminTopbar'
          ],
          
          // Page chunks 
          'pages-main': [
            './src/pages/Index',
            './src/pages/Products',
            './src/pages/Claims',
            './src/pages/Quotes'
          ],
          'pages-services': [
            './src/pages/Consultancy',
            './src/pages/Outsourcing',
            './src/pages/Diaspora'
          ],
          'pages-admin': [
            './src/pages/Admin',
            './src/pages/Resources',
            './src/pages/Downloads'
          ],
          'pages-payment': [
            './src/pages/Payment',
            './src/pages/PaymentSuccess',
            './src/pages/PaymentFailure',
            './src/pages/PaymentCallback'
          ]
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true
      }
    }
  },
  // Server options (no gzip compression available here)
  server: {
  }
})
