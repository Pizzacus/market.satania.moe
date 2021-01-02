<template>
	<top-bar />

	<cart-button />

	<main>
		<router-view />
	</main>

	<footer>
		<a href="https://github.com/Pizzacus/market.satania.moe" target="blank" rel="noopener" class="github-notice">
			<img class="github-logo" src="/assets/github.svg" alt="" role="presentation">
			<div>This website is open-source!<br/>Check the code out on GitHub.</div>
		</a>

		<h3>Have any questions? Requests? Issues?</h3>
		<h4>Tell us in <span class="channel">#satania-market</span> on Satania&nbsp;Dropout!</h4>
	</footer>
</template>

<script setup lang="ts">
import { provide, reactive, watch } from "vue";
import TopBar from "./components/TopBar.vue";
import CartButton from "./components/CartButton.vue";
import stateKey, { CurrencyEnum } from "./state";
import type { GlobalState } from "./state";
import getIpCountry from "./utils/get-country";
import getCurrency from "./utils/get-currency";
import storageAvailable from "./utils/storage-available";
import snipcartReady from "./utils/snipcart-ready";

declare var Snipcart: any;

// This state is shared by the entire app
// this is simpler than using Vuex it saves me time pls understand
const data: GlobalState = reactive({
	currency: "usd",
	country: "us",
	ipCountry: null,
});

// This variable (later pulled from localStorage) rememebers whether the user
// previously chose a different country from the one of their IP address
// It determines what to do if the IP's country is different
// from the one selected in localStorage
// If the country was previously overwritten, it stays that way, and the IP check result is ignored
// If it wasn't overwritten, it is updated with the new IP check result
let ipCountryOverwritten: Boolean = false;

if (storageAvailable()) {
	const storedCurrency = window.localStorage.getItem("currency");
	const storedCountry = window.localStorage.getItem("country");
	const storedIpCountryOverwritten = window.localStorage.getItem("ipCountryOverwritten");

	if (storedCountry !== null) {
		data.country = storedCountry;
	}

	if (storedCurrency !== null && storedCurrency in CurrencyEnum) {
		data.currency = storedCurrency as keyof typeof CurrencyEnum;
	}

	if (storedIpCountryOverwritten !== null) {
		ipCountryOverwritten = storedIpCountryOverwritten === "true";
	}

	watch(data, () => {
		window.localStorage.setItem("currency", data.currency);
		window.localStorage.setItem("country", data.country);

		if (typeof Snipcart !== "undefined") {
			Snipcart.api.session.setCurrency(data.currency);
		}

		if (data.ipCountry !== null) {
			window.localStorage.setItem(
				"ipCountryOverwritten",
				data.country !== data.ipCountry
					? "true"
					: "false"
			);
		}
	});
}

getIpCountry().then((country) => {
	data.ipCountry = country;

	if (country && !ipCountryOverwritten) {
		data.country = country;
		data.currency = getCurrency(country);
	}
});

snipcartReady().then(() => {
	Snipcart.api.session.setCurrency(data.currency);
})

provide(stateKey, data);
</script>

<style scoped>
footer {
	text-align: center;
	padding: 0 8px;
}

.github-notice {
	background: var(--gray);
	border-radius: 10000px;
	display: inline-flex;
	margin: 64px 0;
	padding: 16px;
	font-size: 18px;
	font-weight: 600;
	line-height: 1.2;
	align-items: center;
	color: inherit;
	text-decoration: none;
}

.github-logo {
	width: 48px;
	margin-right: 16px;
}

.channel {
	background: rgba(114,137,218,.1);
	color: #7289da;
}

@media (max-width: 767.98px) {
	.github-notice {
		font-size: 16px;
	}
}
</style>