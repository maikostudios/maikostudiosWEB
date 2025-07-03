import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

// DESACTIVAMOS ESTO TEMPORALMENTE
// import Components from "unplugin-vue-components/vite";
// import AutoImport from "unplugin-auto-import/vite";
// import { VuetifyResolver } from "unplugin-vue-components/resolvers";

export default defineConfig({
  optimizeDeps: {
    include: ['vee-validate'],
  },
  plugins: [
    vue(),
    // Si más adelante quieres auto-import, puedes reactivarlo aquí:
    /*
    AutoImport({
      imports: ["vue", "vue-router", "pinia"],
      dts: "src/auto-imports.d.ts",
      resolvers: [VuetifyResolver()],
    }),

    Components({
      dts: "src/components.d.ts",
      resolvers: [VuetifyResolver()],
    }),
    */
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      deleteOriginFile: false,
    }),
    visualizer({ filename: 'dist/bundle-report.html', open: false })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 800,
    sourcemap: true,
    manifest: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
  },
  server: {
    port: 5173,
    open: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
  },
});
