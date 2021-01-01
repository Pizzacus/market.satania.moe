/*!

This compiled code includes portions of many open-source libraries, which are
released under various license with different terms and conditions. Some of
which require attribution.

You may find those terms and attributions at
https://github.com/Pizzacus/market.satania.moe/blob/master/LICENSE-THIRD-PARTY

Further copyright notices:
https://github.com/Pizzacus/market.satania.moe/blob/master/COPYRIGHT

*/

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "bootstrap/dist/css/bootstrap-reboot.min.css";
import "source-sans-pro/source-sans-pro.css";
import "source-sans-pro/source-sans-variable.css";
import "@fontsource/asap/600.css";
import "./styles/index.css";

createApp(App).use(router).mount('#app')
