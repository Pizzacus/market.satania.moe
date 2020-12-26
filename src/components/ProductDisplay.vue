<template>
	<a :href="'/product/' + props.product.id" class="product">
		<div class="product-image" role="presentation">
			<img
				:src="props.product.image"
				alt=""
				class="main-image"
			/>
			<img
				:src="props.product.metadata.closeupImage"
				alt=""
				class="closeup-image"
			/>
		</div>

		<div class="product-details">
			<div class="product-name-wrapper">
				<h1>{{ props.product.name }}</h1>

				<div class="product-price">
					{{ formatPrice(props.product.price, state.currency) }}
				</div>
			</div>

			<p v-html="props.product.description" />
		</div>
	</a>
</template>

<script setup lang="ts">
import { defineProps, inject } from "vue";
import formatPrice from "../utils/format-price";
import stateKey from "../state";
import type { PropType } from "vue";
import type { Product } from "src/products.types";

const state = inject(stateKey);

if (!state) {
	throw new TypeError("State not defined.");
}

const props = defineProps({
	product: {
		type: Object as PropType<Product>,
		required: true,
	},
});
</script>

<style scoped>
.product {
	width: 310px;
	background: #fff;
	border-radius: 5px;
	display: inline-flex;
	color: inherit;
	text-decoration: none;
	flex-direction: column;
	box-shadow: var(--small-shadow);
}

.product-details {
	width: 100%;
	flex: none;
	padding: 15px 20px;
}


.product-details h1 {
	font-weight: 600;
	font-size: 18px;
	margin: 0;
	flex: 1;
}

.product-details p {
	font-size: 14px;
	margin: 0;
	color: var(--dim-text);
	line-height: 1.35;
}

.product-details p:deep(b) {
	color: var(--text);
}

.product-name-wrapper {
	display: flex;
	align-items: baseline;
}

.product-image {
	overflow: hidden;
	border-radius: 5px;
	position: relative;
}

.product-image .main-image, .product-image .closeup-image {
	width: 100%;
	object-fit: cover;
}

.product-image .closeup-image {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%) scale(0.95);
	transition: opacity 0.2s ease-out, transform 0.1s ease-out;
	z-index: 6;
	visibility: hidden;
	opacity: 0;
}

.product:hover .closeup-image {
	transform: translate(-50%, -50%) scale(1);
	opacity: 1;
	visibility: visible;
}

.product-price {
	font-weight: bold;
	font-size: 16px;
}

@media (max-width: 767.98px) {
	.product {
		width: 260px;
	}
}

@media (max-width: 575.98px) {
	.product {
		width: 100%;
		background: none;
		box-shadow: none;
	}

	.product-details {
		padding: 8px 0;
	}

	.product-details h1, .product-details p, .product-price {
		font-size: 3.5vw;
	}
}
</style>
