<template>
	<button
		class="snipcart-checkout"
		:class="{ hidden: itemCount <= 0 }"
		id="cart-button"
	>
		<img src="/assets/shopping-cart.svg" alt="Go to Cart" />
		{{ itemCount.toLocaleString() }}
	</button>

	<div class="dark-cart-background" />
</template>

<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import snipcartReady from "../utils/snipcart-ready";

declare var Snipcart: any;

const itemCount = ref(0);

const snipcartNode = document.getElementById("snipcart") as HTMLDivElement;

if (!snipcartNode) {
	throw new Error("Couldn't find the Snipcart node");
}

let unsubscribeFromAdding: null | (() => void) = null;
let unsubscribeFromAdded: null | (() => void) = null;
let unsubscribeFromUpdated: null | (() => void) = null;
let unsubscribeFromRemoved: null | (() => void) = null;

function updateCount() {
	itemCount.value = Snipcart.store.getState().cart.items.count;
}

snipcartReady().then(() => {
	updateCount();

	unsubscribeFromAdding = Snipcart.events.on("item.adding", () => {
		itemCount.value++;
	});

	unsubscribeFromAdded = Snipcart.events.on("item.added", updateCount);
	unsubscribeFromUpdated = Snipcart.events.on("item.updated", updateCount);
	unsubscribeFromRemoved = Snipcart.events.on("item.removed", updateCount);
});

onUnmounted(() => {
	if (unsubscribeFromAdding != null) {
		unsubscribeFromAdding();
	}

	if (unsubscribeFromAdded != null) {
		unsubscribeFromAdded();
	}

	if (unsubscribeFromUpdated != null) {
		unsubscribeFromUpdated();
	}

	if (unsubscribeFromRemoved != null) {
		unsubscribeFromRemoved();
	}
});
</script>

<style scoped>
button {
	display: flex;
	position: fixed;
	top: 30%;
	right: 0;
	z-index: 9;
	background: var(--red);
	border: none;
	padding: 8px 16px;
	color: #fff;
	font-size: 24px;
	font-weight: bold;
	border-bottom-left-radius: 5px;
	border-top-left-radius: 5px;
	transform: translate(0, 0);
	transition: padding ease-out 0.1s, transform ease-out 0.25s;
	box-shadow: var(--large-shadow);
}

button.hidden {
	transform: translate(100%, 0);
	box-shadow: none;
}

button:hover {
	padding: 8px 24px 8px 16px;
}

img {
	width: 24px;
	margin-right: 8px;
}

.dark-cart-background {
	content: "";
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background: #0008;
	z-index: 9;
	display: none;
}

html.snipcart-sidecart--opened .dark-cart-background {
	display: block;
}
</style>
