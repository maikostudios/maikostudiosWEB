// src/plugins/vuetify.js
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import "@mdi/font/css/materialdesignicons.css";

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: "dark",
    themes: {
      dark: {
        colors: {
          primary: "#0066ff",
          secondary: "#00cccc",
          accent: "#00a5a5",
          background: "#0a0a0a",
          surface: "#1a1a1a",
          "surface-variant": "rgba(255, 255, 255, 0.05)",
          "on-surface": "#ffffff",
          "on-surface-variant": "#cccccc",
          success: "#4caf50",
          warning: "#ff9800",
          error: "#f44336",
          info: "#2196f3",
        },
      },
    },
  },
  defaults: {
    VBtn: {
      style: "text-transform: none;",
      ripple: true,
    },
    VCard: {
      elevation: 2,
    },
    VTextField: {
      variant: "outlined",
      density: "comfortable",
    },
    VTextarea: {
      variant: "outlined",
      density: "comfortable",
    },
    VSelect: {
      variant: "outlined",
      density: "comfortable",
    },
  },
});

export default vuetify;
