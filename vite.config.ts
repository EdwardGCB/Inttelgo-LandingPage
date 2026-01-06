import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// Plugin para agregar font-display: swap a todas las fuentes
function fontDisplaySwap() {
  return {
    name: "font-display-swap",
    generateBundle(_options: any, bundle: any) {
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (
          fileName.endsWith(".css") &&
          chunk &&
          typeof chunk === "object" &&
          "type" in chunk &&
          chunk.type === "asset" &&
          "source" in chunk
        ) {
          let css = chunk.source as string;
          css = css.replace(/@font-face\s*\{([^}]*)\}/g, (match, content) => {
            if (content.includes("font-display")) {
              return match;
            }
            return `@font-face {${content}  font-display: swap;\n}`;
          });
          (chunk as { source: string }).source = css;
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), fontDisplaySwap()],
  base: "/", // IMPORTANTE: Asegurar que la base es correcta
  esbuild: {
    drop: ["console", "debugger"],
    legalComments: "none",
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    treeShaking: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      treeshake: {
        moduleSideEffects: "no-external",
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
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

          // Three.js core
          if (
            id.includes("node_modules/three") &&
            !id.includes("@react-three")
          ) {
            return "three-core";
          }

          // React Three Fiber
          if (id.includes("node_modules/@react-three/fiber")) {
            return "r3f-core";
          }

          // React Three Drei
          if (id.includes("node_modules/@react-three/drei")) {
            return "r3f-drei";
          }

          // Radix UI
          if (id.includes("node_modules/@radix-ui")) {
            const match = id.match(/@radix-ui\/([^/]+)/);
            if (match) {
              const componentName = match[1];
              if (
                ["react-slot", "react-label", "react-separator"].includes(
                  componentName
                )
              ) {
                return "radix-base";
              }
              return `radix-${componentName}`;
            }
            return "radix-other";
          }

          // Formularios y validación
          if (
            id.includes("node_modules/react-hook-form") ||
            id.includes("node_modules/@hookform") ||
            id.includes("node_modules/zod")
          ) {
            return "form-vendor";
          }

          // UI components
          if (
            id.includes("node_modules/embla") ||
            id.includes("node_modules/lucide-react") ||
            id.includes("node_modules/sonner")
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
        },
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split(".") || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        compact: true,
        generatedCode: {
          constBindings: true,
          objectShorthand: true,
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    minify: "esbuild",
    cssCodeSplit: true,
    reportCompressedSize: true,
    target: "es2015",
    assetsInlineLimit: 4096,
    cssMinify: "esbuild",
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: false,
  },
});
