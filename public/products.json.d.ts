import type { Product } from "../src/products.types";

declare module "products.json" {
	const products: Product[];
	export default products;
}