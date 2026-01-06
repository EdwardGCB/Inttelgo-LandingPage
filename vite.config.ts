import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

// Plugin para agregar font-display: swap a todas las fuentes
function fontDisplaySwap() {
  return {
    name: "font-display-swap",
    generateBundle(_options: any, bundle: any) {
      // Modificar archivos CSS para agregar font-display: swap
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

          // Agregar font-display: swap a todas las reglas @font-face que no lo tengan
          css = css.replace(/@font-face\s*\{([^}]*)\}/g, (match, content) => {
            // Si ya tiene font-display, no modificar
            if (content.includes("font-display")) {
              return match;
            }
            // Agregar font-display: swap antes del cierre
            return `@font-face {${content}  font-display: swap;\n}`;
          });

          (chunk as { source: string }).source = css;
        }
      }
    },
  };
}

// Plugin para agregar preload de CSS y JS críticos al HTML
function preloadCriticalAssets() {
  return {
    name: "preload-critical-assets",
    transformIndexHtml(html: string) {
      // Esta función se ejecutará durante el build
      // El HTML ya tiene los preloads de imágenes que agregamos manualmente
      return html;
    },
    generateBundle(_options: any, bundle: any) {
      // Recopilar archivos CSS y JS críticos durante el build
      const cssFiles: string[] = [];
      const jsFiles: string[] = [];

      for (const fileName of Object.keys(bundle)) {
        if (fileName.endsWith(".css")) {
          cssFiles.push(fileName);
        } else if (
          fileName.endsWith(".js") &&
          (fileName.includes("index") || fileName.includes("main"))
        ) {
          jsFiles.push(fileName);
        }
      }

      // Guardar para usar en writeBundle
      (this as any).cssFiles = cssFiles;
      (this as any).jsFiles = jsFiles;
    },
    writeBundle(options: any) {
      // Se ejecuta después de que todos los archivos se han escrito
      const cssFiles = (this as any).cssFiles || [];
      const jsFiles = (this as any).jsFiles || [];
      const htmlPath = resolve(options.dir || "dist", "index.html");

      try {
        let html = readFileSync(htmlPath, "utf-8");

        // Ordenar: CSS primero (más crítico)
        cssFiles.sort();
        jsFiles.sort();

        // Agregar preloads para CSS (más crítico - bloquea renderizado)
        cssFiles.forEach((file: string) => {
          const preloadTag = `    <link rel="preload" href="/${file}" as="style" />\n`;
          // Insertar después del viewport meta tag
          if (!html.includes(`href="/${file}"`)) {
            html = html.replace(
              /(<meta name="viewport"[^>]*>)/,
              `$1\n${preloadTag}`
            );
          }
        });

        // Agregar modulepreload para JS crítico (solo el primero)
        if (jsFiles.length > 0) {
          const mainJs = jsFiles[0];
          const modulepreloadTag = `    <link rel="modulepreload" href="/${mainJs}" />\n`;
          if (!html.includes(`href="/${mainJs}"`)) {
            // Insertar después del último preload
            html = html.replace(
              /(<link rel="preload"[^>]*>)/,
              `$1\n${modulepreloadTag}`
            );
          }
        }

        writeFileSync(htmlPath, html);
      } catch (error) {
        // Si hay error, continuar sin modificar
        console.warn("No se pudo modificar index.html para preloads:", error);
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), fontDisplaySwap(), preloadCriticalAssets()],
  esbuild: {
    // Optimización: eliminar console.log en producción
    drop: ["console", "debugger"],
  },
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
        // Optimización: nombres de archivos más cortos y con hash para mejor caché
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
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false, // Desactivar sourcemaps en producción para reducir tamaño
    minify: "esbuild", // Usar esbuild para minificación más rápida
    cssCodeSplit: true, // Dividir CSS en chunks separados
    reportCompressedSize: true, // Reportar tamaños comprimidos
    // Optimización: mejorar la compresión
    target: "es2015", // Compatibilidad con navegadores modernos
    assetsInlineLimit: 4096, // Inlinear assets pequeños (<4KB) para reducir requests
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: false,
  },
});
