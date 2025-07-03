import "vuetify/styles";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia"; // <- Esta línea es vital
import vuetify from "./plugins/vuetify";
import "./style.css";
const app = createApp(App);

app.use(createPinia()); // <- Aquí se inicializa y se aplica
app.use(router);
app.use(vuetify);
<<<<<<< Updated upstream
app.mount("#app");
=======

// Directiva global para lazy-loading de imágenes
import lazy from '@/directives/lazy'
app.directive('lazy', lazy);

// Esperar autenticación anónima antes de montar la app
authService
  .autenticarAnonimo()
  .then((res) => {
    if (res.success) {
      app.mount("#app");
    } else {
      console.warn("⚠️ App montada sin sesión anónima.");
      app.mount("#app"); // Opcional: puedes montar igual
    }
  })
  .catch((err) => {
    console.error("🔥 Error crítico al autenticar anónimamente:", err);
    app.mount("#app"); // Montar igual si decides permitirlo
  });
>>>>>>> Stashed changes
