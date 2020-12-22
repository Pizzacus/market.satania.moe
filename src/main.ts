import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "bootstrap/dist/css/bootstrap-reboot.min.css";
import "source-sans-pro/source-sans-pro.css";
import "source-sans-pro/source-sans-variable.css";
import "fontsource-asap/600.css";
import "./styles/index.css";

createApp(App).use(router).mount('#app')
