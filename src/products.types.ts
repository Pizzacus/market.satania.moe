import { Currency } from "./state";

export interface Product {
	// based on SnipCart's ProductDefinition
	// https://docs.snipcart.com/v3/sdk/reference#core-models-ProductDefinition
	id: string;
	name: string;
	price: Record<Currency, number>;
	url: string;
	description: string;
	image: string;
	metadata: {
		// We can store any data we want here
		detailedImages: string[];
		featuredImageIndex: number;
		productType: "hoodie" | "shirt";
		closeupImage: string;
	};
	customFields: {
		name: string;
		options: string;
		type: string;
	}[];
}