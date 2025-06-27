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
app.mount("#app");
