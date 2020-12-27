<template>
    <top-bar />

    <main>
        <router-view />
    </main>
</template>

<script setup lang="ts">
import { provide, reactive, watch, ref } from "vue";
import type { Ref } from "vue";
import TopBar from "./components/TopBar.vue";
import stateKey, { CurrencyEnum } from "./state";
import type { GlobalState } from "./state";
import getIpCountry from "./utils/get-country";
import getCurrency from "./utils/get-currency";
import storageAvailable from "./utils/storage-available";

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

provide(stateKey, data);
</script>
