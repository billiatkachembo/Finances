import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  // Base path for GitHub Pages
  base: "/Finances/",
  
  server: {
    host: "::",
    port: 8080,
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
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
    cssCodeSplit: true,
    rollupOptions: {
      // Ignore eval warnings for gapi-script
      onwarn(warning, defaultHandler) {
        if (warning.code === "EVAL" && warning.id && warning.id.includes("gapi-script")) {
          return;
        }
        defaultHandler(warning);
      },
      output: {
        // Code splitting: vendor chunk
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "assets/css/[name]-[hash][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },

  css: {
    postcss: "./postcss.config.js",
    modules: {
      localsConvention: "camelCase",
    },
  },

  esbuild: {
    legalComments: "none",
    treeShaking: true,
  },
}));
