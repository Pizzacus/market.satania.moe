<template>
	<div class="button-wrapper">
		<button
			:class="buttons.greenButton"
			:disabled="props.disabled && !inCart"
			@click.left.prevent="onclick"
		>
			<template v-if="inCart">
				<img
					src="/assets/in-cart.svg"
					alt=""
					role="presentation"
					class="add-to-cart-icon"
				/>
				In cart!
			</template>
			<template v-else-if="!disabled">
				<img
					src="/assets/shopping-cart-add.svg"
					alt=""
					role="presentation"
					class="add-to-cart-icon"
				/>
				Add to cart
			</template>
			<template v-else>
				Select an option
			</template>
		</button>

		<a
			v-if="inCart"
			class="add-another"
			:class="{ disabled: props.disabled }"
			@click.left.prevent="onclickanother"
		>
			<template v-if="disabled">
				Select an option to add another one
			</template>
			<template v-else>
				Add another one to cart →
			</template>
		</a>
	</div>
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
	},
	disabled: {
		type: Boolean,
		default: false,
	},
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

	if (props.disabled && !inCart.value) {
		return;
	}

	clickedOnce = true;

	await ready;

	if (!inCart.value && !props.disabled) {
		await addToCart();
	}

	await openCart();

	clickedOnce = false;
}

async function onclickanother() {
	if (clickedOnce) {
		return;
	}

	if (props.disabled) {
		return;
	}

	clickedOnce = true;

	await ready;
	await addToCart();
	await openCart();

	clickedOnce = false;
}

async function addToCart(): Promise<void> {
	// Sets the custom field values
	return Snipcart.api.cart.items.add({
		...props.product,
		customFields: props.product.customFields.map((customField, i) => ({
			...customField,
			value: props.customFieldValues[i],
		}))
	});
}

function openCart(): Promise<void> {
	return new Promise((resolve) => {
		// No API to open the side modal, improvising
		// And calling directly makes it close immediately because of the click
		window.requestAnimationFrame(() => {
			document.getElementById("cart-button")?.click();
			resolve();
		});
	});
}
</script>

<style scoped>
button {
	width: 100%;
}

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

.add-another {
	text-align: center;
	margin-top: 5px;
	color: var(--red);
	font-weight: bold;
	display: block;
	cursor: pointer;
}

.add-another.disabled {
	cursor: default;
	opacity: 0.5;
}
</style>
