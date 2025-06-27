import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// DESACTIVAMOS ESTO TEMPORALMENTE
// import Components from "unplugin-vue-components/vite";
// import AutoImport from "unplugin-auto-import/vite";
// import { VuetifyResolver } from "unplugin-vue-components/resolvers";

export default defineConfig({
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
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
