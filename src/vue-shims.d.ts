declare module "*.vue" {
	import { defineComponent } from "vue";
	const component: ReturnType<typeof defineComponent>;
	export default component;
}

declare module "*?worker" {
	class WrappedWorker extends Worker {
		constructor();
	}

	export default WrappedWorker;
}

declare module "*.css" {
	const classes: Record<string, string>;

	export default classes;
}