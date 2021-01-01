<template>
	<div class="wrapper">
		<div class="main-container">
			<div class="slideshow"></div>

			<div class="product-details">
				<h3>Satania Dropout</h3>
				<div class="name-wrapper">
					<h1>{{ product.name }}</h1>
					<div class="price">{{ formatPrice(product.price, state.currency) }}</div>
				</div>
				<p class="desc" v-html="product.metadata.htmlDescription" />

				<hr class="large-margin" />

				<div class="custom-field-section">
					<img
						v-if="product.metadata.productType === 'hoodie'"
						src="/assets/product-icons/hoodie.svg"
						alt=""
						role="presentation"
						class="product-icon"
					/>

					<img
						v-if="product.metadata.productType === 'shirt'"
						src="/assets/product-icons/shirt.svg"
						alt=""
						role="presentation"
						class="product-icon"
					/>

					<div class="custom-field-container">
						<div class="custom-field" v-for="(field, i) in product.customFields">
							<div class="label-wrapper">
								<label :for="field.name + '-select'">{{ field.name }}</label>

								<button v-if="field.name.toLowerCase() === 'size'" class="size-info-button">
									<img src="/assets/size-info.svg" alt="" role="presentation" />
									Size guide
								</button>
							</div>

							<select name="size" :id="field.name + '-select'" v-model="customFieldValues[i]">
								<option :value="undefined" disabled>Select a {{ field.name }}</option>
								<option
									v-for="option in field.options.split('|')"
									:value="option">{{ option }}</option>
							</select>
						</div>
					</div>
				</div>

				<div class="button-wrapper">
					<buy-button 
						class="buy-button" 
						:product="product" 
						:disabled="!allStrings(customFieldValues)"
						:customFieldValues="allStrings(customFieldValues) ? customFieldValues : []"
					/>
				</div>

				<div v-if="product.metadata.notice" v-html="product.metadata.notice" class="notice" />

				<div class="feature-list">
					<div class="feature">
						<img src="/assets/shipping.svg" alt="" class="feature-img" role="presentation" />

						<div class="feature-text">
							Ship internationally, pay in <b>US Dollars</b>
						</div>
					</div>

					<div class="feature">
						<img src="/assets/payment-card.svg" alt="" class="feature-img" role="presentation" />

						<div class="feature-text">
							Pay with <b>card</b> or <b>PayPal</b>
						</div>
					</div>

					<div class="feature">
						<img src="/assets/return.svg" alt="" class="feature-img" role="presentation" />

						<div class="feature-text">
							<b>Full refund</b> if returned within 4 weeks
						</div>
					</div>

				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineProps, inject, ref } from "vue";
import type { Ref } from "vue";
import formatPrice from "../utils/format-price";
import stateKey from "../state";
import BuyButton from "../components/BuyButton.vue";

import products from "../../public/products.json";

const state = inject(stateKey);

if (!state) {
	throw new TypeError("State not defined.");
}

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
});

function allStrings(arr: any[]): arr is string[] {
	return arr.every(val => typeof val === "string");
}

const product = products.find(product => product.id === props.id);

if (product == null) {
	// TODO: 404 page
	throw new Error("Product not found");
}

const customFieldValues: Ref<(undefined | string)[]> = ref(Array(product.customFields.length).fill(undefined));
</script>

<style scoped>
.wrapper {
	text-align: center;
}
.main-container {
	background: #fff;
	display: inline-grid;
	margin: auto;
	grid-template-columns: 720px 350px;
	gap: 20px;
	padding: 20px;
	text-align: start;
}

.product-details h3, .product-details h1 {
	margin: 0;
	line-height: 1;
}

.product-details h3 {
	font-weight: 600;
	font-size: 18px;
	font-variant: small-caps;
	text-transform: lowercase;
	color: var(--dim-text);
}

.product-details .price {
	font-weight: 600;
	font-size: 24px;
	line-height: 100%;
}

.name-wrapper {
	display: flex;
	align-items: baseline;
	margin-bottom: 5px;
}

.name-wrapper h1 {
	flex: auto;
}

.product-details .desc {
	color: var(--dim-text);
	line-height: 1.25;
}

.product-details .desc :deep(b) {
	color: var(--text);
}

hr {
	border: none;
	height: 2px;
	background: #C4C4C4;
	margin: 5px 0;
}

hr.large-margin {
	margin-top: 15px;
	margin-bottom: 20px;
}

.product-icon {
	border-radius: 3px;
	width: 64px;
	margin-right: 10px;
}

.custom-field-section {
	display: flex;
	align-items: flex-start;
}

.custom-field-container {
	flex: auto;
}

.custom-field .label-wrapper {
	display: flex;
	align-items: flex-start;
	width: 100%;
}

.custom-field label {
	font-weight: 600;
	font-size: 18px;
	margin: 0;
	flex: auto;
	font-variant: small-caps;
	text-transform: lowercase;
}

.custom-field select {
	padding: 6px 12px;
	width: 100%;
	border-radius: 3px;
	border: 1px solid rgba(0, 0, 0, 0.3);
}

.size-info-button {
	background: none;
	border: none;
	border-radius: 3px;
}

.size-info-button:hover {
	background: #0002;
}

.product-details .button-wrapper {
	margin: 20px 0;
}

.product-details :deep(.buy-button) {
	width: 100%;
}

.feature {
	display: flex;
	padding: 5px;
	align-items: center;
	margin-bottom: 5px;
	font-size: 14px;
}

.feature-img {
	width: 24px;
	margin-right: 10px;
}

.price-feature {
	display: flex;
	width: 100%;
}

.price-feature .label {
	flex: auto;
}

.price-feature .feature-price {
	font-weight: bold;
}

.feature-info {
	background: #F5F5F5;
	font-size: 12px;
	line-height: 1.25;
}

.notice {
	background: #ea03;
	padding: 10px;
	border: #ea0 solid 3px;
	font-size: 14px;
	margin-bottom: 20px;
	border-radius: 5px;
}
</style>