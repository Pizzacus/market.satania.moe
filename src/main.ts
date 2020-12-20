import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "./index.css";
import "bootstrap/dist/css/bootstrap-reboot.min.css";

createApp(App).use(router).mount('#app')
