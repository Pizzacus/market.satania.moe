import { CurrencyString } from "./state";

export interface Product {
	// based on SnipCart's ProductDefinition
	// https://docs.snipcart.com/v3/sdk/reference#core-models-ProductDefinition
	id: string;
	name: string;
	price: Record<CurrencyString, number>;
	url: string;
	description: string;
	image: string;
	shippable: boolean;
	metadata: {
		// We can store any data we want here
		htmlDescription: string;
		detailedImages: string[];
		featuredImageIndex: number;
		productType: "hoodie" | "shirt";
		closeupImage: string;
	};
	customFields: {
		name: string;
		options: string;
		type: string;
		required: boolean;
	}[];
}