<template>
	<div class="region-selector">
		<div class="region-selector-content">
			<img class="pin-icon" src="/assets/map-pin.svg" alt="" role="presentation" />

			<!--
				These hidden blocks were from back when I thought I'd let people
				select their country to get shipping rates previews, but then
				realised it would be too hard to implement.
			-->
			
			<p hidden>
				<label for="country-select">Ship to</label>
				<select
					name="country"
					id="country-select"
					v-model="state.country"
					@change="state.currency = getCurrency(state.country)"
				>
					<option v-for="country in sortedCountries" :value="country.id.toLowerCase()">
						{{ country.name }}
					</option>
				</select>
			</p>

			<div class="separator" hidden />

			<p>
				<label for="currency-select">Pay with</label>
				<select name="currency" id="currency-select" v-model="state.currency">
					<option value="aud">Australian dollar (AU$)</option>
					<option value="cad">Canadian dollar (CA$)</option>
					<option value="gbp">British pound (£)</option>
					<option value="eur">Euro (€)</option>
					<option value="nzd">New Zealand dollar (NZ$)</option>
					<option value="sgd">Singapore dollar (SG$)</option>
					<option value="usd">US dollar (US$)</option>
				</select>
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { inject } from "vue";
import stateKey from "../state";
import { countries } from "countries-list";
import getCurrency from "../utils/get-currency";

const sortedCountries = Object.entries(countries)
	.map(([id, country]) => ({
		id,
		...country
	}))
	.sort((a, b) => a.name.localeCompare(b.name));

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
	margin-bottom: 40px;
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
	width: 225px;
	text-overflow: ellipsis;
}

.separator {
	width: 2px;
	height: 64px;
	background: #C4C4C4;
}

p {
	margin: 0;
}

@media (max-width: 767.98px) {
	.region-selector {
		height: 48px;
		margin-top: 0;
	}

	.region-selector-content {
		display: flex;
	}

	.pin-icon {
		display: none;
	}

	.separator {
		flex: none;
		height: 32px;
	}

	.region-selector-content > *:not(:last-child) {
		margin-right: 0;
	}

	p {
		position: relative;
		flex: 1;
		width: 100%;
		height: 100%;
	}

	label {
		position: absolute;
		top: 8px;
		left: 10px;
		font-weight: 600;
		font-size: 12px;
	}

	select {
		width: 100%;
		height: 100%;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		background: transparent url("/assets/triangle.svg") no-repeat right 12px center/8px 10px;
		font-weight: bold;
		font-size: 14px;
		border: none;
		padding-left: 10px;
		padding-top: 20px;
	}
}
</style>