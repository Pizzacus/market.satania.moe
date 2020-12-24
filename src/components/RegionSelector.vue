<template>
	<div class="region-selector">
		<div class="region-selector-content">
			<img src="/assets/map-pin.svg" alt="" role="presentation" />
			
			<p>
				<label for="country-select">Ship to</label>
				<select name="country" id="country-select">
					<option value="wip">WIP</option>
					<option value="owo">OwO</option>
					<option value="uwu">UwU</option>
				</select>
			</p>

			<div class="separator"/>

			<p>
				<label for="currency-select">Pay with</label>
				<select name="currency" id="currency-select">
					<option value="wip">WIP</option>
					<option value="owo">OwO</option>
					<option value="uwu">UwU</option>
				</select>
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useContext, inject } from "vue";
import stateKey from "../state";

const state = inject(stateKey);

if (!state) {
	throw new TypeError("State not defined.");
}
</script>

<style scoped>
.region-selector {
	height: 80px;
	background: var(--gray);
	margin-top: 20px;
	border-top: 1px solid rgba(0, 0, 0, 0.3);
	border-bottom: 1px solid rgba(0, 0, 0, 0.3);
}

.region-selector-content {
	max-width: 1000px;
	width: 100%;
	height: 100%;
	margin: auto;
	display: flex;
	align-items: center;
}

.region-selector-content > *:not(:last-child) {
	margin-right: 16px;
}

label {
	display: block;
	font-weight: 600;
	font-size: 18px;
	margin: 0;
}

select {
	padding: 6px;
	padding-right: 24px;
	background: #fff;
	border: 1px solid rgba(0, 0, 0, 0.3);
	border-radius: 3px;
	min-width: 150px;
}

.separator {
	width: 2px;
	height: 64px;
	background: #C4C4C4;
}

p {
	margin: 0;
}
</style>