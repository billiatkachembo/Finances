import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/Finances/",
  server: {
    host: "::",
    port: 8080,
  },
  headers: {
    // Correctly allow unsafe-eval for trusted scripts
    'Content-Security-Policy': "script-src 'self' 'unsafe-eval' 'eval' https://apis.google.com https://www.gstatic.com;"
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Disable sourcemaps to hide eval() warning from gapi-script
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('react')) {
              return 'react';
            }
            return 'vendor';
          }
        },
      },
    },
  },
}));