<template>
	<!-- Supporting more than one custom field would be pain -->
	<!--

		class="snipcart-add-item"
		:data-item-id="props.product.id"
		:data-item-name="props.product.name"
		:data-item-price="JSON.stringify(props.product.price)"
		data-item-url="/products.json"
		:data-item-description="props.product.description"
		:data-item-image="props.product.image"
		:data-item-metadata="JSON.stringify(props.product.metadata)"
		:data-item-custom1-name="props.product.customFields[0].name"
		:data-item-custom1-options="props.product.customFields[0].options"
		:data-item-custom1-type="props.product.customFields[0].type"
		-->
	<button :class="buttons.greenButton" @click.left.prevent="onclick">
		<template v-if="inCart">
			<img
				src="/assets/in-cart.svg"
				alt=""
				role="presentation"
				class="add-to-cart-icon"
			/>
			In cart!
		</template>
		<template v-else>
			<img
				src="/assets/shopping-cart-add.svg"
				alt=""
				role="presentation"
				class="add-to-cart-icon"
			/>
			Add to cart
		</template>
	</button>
</template>

<script setup lang="ts">
import { defineProps, inject, onUnmounted, ref } from "vue";
import stateKey from "../state";
import type { PropType, Ref } from "vue";
import type { Product } from "src/products.types";
import buttons from "../styles/buttons.module.css";
import snipcartReady from "../utils/snipcart-ready";

declare var Snipcart: any;

const state = inject(stateKey);

if (!state) {
	throw new TypeError("State not defined.");
}

const props = defineProps({
	product: {
		type: Object as PropType<Product>,
		required: true,
	},
	customFieldValues: {
		type: Array as PropType<string[]>,
		default: [],
	}
});

const inCart: Ref<boolean> = ref(false);

const ready: Promise<void> = snipcartReady()
	.then(() => {
		inCart.value = Snipcart.store
			.getState()
			.cart.items.items.some(
				(item: any) => item.id === props.product.id
			);
	});

let unsubscribeFromAdding: null | (() => void) = null;
let unsubscribeFromRemoved: null | (() => void) = null;

ready.then(() => {
	unsubscribeFromAdding = Snipcart.events.on(
		"item.adding",
		(item: any) => {
			if (item.id === props.product.id) {
				inCart.value = true;
			}
		}
	);

	unsubscribeFromRemoved = Snipcart.events.on(
		"item.removed",
		(item: any) => {
			if (item.id === props.product.id) {
				inCart.value = false;
			}
		}
	);
});

onUnmounted(() => {
	if (unsubscribeFromAdding != null) {
		unsubscribeFromAdding();
	}

	if (unsubscribeFromRemoved != null) {
		unsubscribeFromRemoved();
	}
});

let clickedOnce = false; // Prevents multi-click

async function onclick() {
	if (clickedOnce) {
		return;
	}

	clickedOnce = true;

	await ready;

	if (!inCart.value) {
		// Sets the custom field values
		await Snipcart.api.cart.items.add({
			...props.product,
			customFields: props.product.customFields.map((customField, i) => ({
				...customField,
				value: props.customFieldValues[i],
			}))
		});
	}

	// No API to open the side modal, improvising
	// And calling directly makes it close immediately because of the click
	window.requestAnimationFrame(
		() => document.getElementById("cart-button")?.click()
	);

	clickedOnce = false;
}
</script>

<style scoped>
.add-to-cart-icon {
	width: 32px;
	height: 32px;
	margin-right: 12px;
	filter: var(--very-small-shadow-filter);
}

@media (max-width: 767.98px) {
	.add-to-cart-icon {
		width: 24px;
		height: 24px;
		margin-right: 8px;
	}
}
</style>
