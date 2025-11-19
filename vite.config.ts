import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React y dependencias core
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules/react-router")
          ) {
            return "react-vendor";
          }

          // Three.js - separado porque es muy grande
          if (
            id.includes("node_modules/three") ||
            id.includes("node_modules/@react-three")
          ) {
            return "three-vendor";
          }

          // Radix UI components
          if (id.includes("node_modules/@radix-ui")) {
            return "ui-vendor";
          }

          // Formularios y validación
          if (
            id.includes("node_modules/react-hook-form") ||
            id.includes("node_modules/@hookform") ||
            id.includes("node_modules/zod")
          ) {
            return "form-vendor";
          }

          // Carousels y animaciones
          if (
            id.includes("node_modules/embla") ||
            id.includes("node_modules/lucide-react")
          ) {
            return "ui-components";
          }

          // Utilidades
          if (
            id.includes("node_modules/axios") ||
            id.includes("node_modules/clsx") ||
            id.includes("node_modules/tailwind-merge") ||
            id.includes("node_modules/class-variance-authority")
          ) {
            return "utils-vendor";
          }

          // Sonner (toast notifications)
          if (id.includes("node_modules/sonner")) {
            return "ui-components";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false, // Desactivar sourcemaps en producción para reducir tamaño
    minify: "esbuild", // Usar esbuild para minificación más rápida
    cssCodeSplit: true, // Dividir CSS en chunks separados
    reportCompressedSize: true, // Reportar tamaños comprimidos
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: false,
  },
});
