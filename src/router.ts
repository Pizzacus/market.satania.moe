import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "./views/Home.vue";
import Product from "./views/Product.vue";

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "Home",
		component: Home,
	},
	{
		path: "/product/:id",
		name: "Product",
		component: Product,
		props: true,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition;
		} else {
			return { top: 0, left: 0 };
		}
	},
});

export default router;
