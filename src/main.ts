import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "bootstrap/dist/css/bootstrap-reboot.min.css";
import "./index.css";

createApp(App).use(router).mount('#app')
