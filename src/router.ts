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
});

export default router;
