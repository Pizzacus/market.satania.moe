<template>
    <top-bar />

    <main>
        <router-view />
    </main>
</template>

<script setup lang="ts">
import { provide, reactive, watch } from "vue";
import TopBar from "./components/TopBar.vue";
import stateKey, { CurrencyEnum } from "./state";
import type { GlobalState } from "./state";
import getCountry from "./utils/get-country";
import getCurrency from "./utils/get-currency";
import storageAvailable from "./utils/storage-available";

// This state is shared by the entire app
// this is simpler than using Vuex it saves me time pls understand
const data: GlobalState = reactive({
    currency: "usd",
    country: "us",
});

if (storageAvailable()) {
    const storedCurrency = window.localStorage.getItem("currency");
    const storedCountry = window.localStorage.getItem("country");

    if (storedCountry !== null) {
        data.country = storedCountry;
    }

    if (storedCurrency !== null && storedCurrency in CurrencyEnum) {
        data.currency = storedCurrency as keyof typeof CurrencyEnum;
    }
    watch(data, () => {
        window.localStorage.setItem("currency", data.currency);
        window.localStorage.setItem("country", data.country);
    });
}

getCountry().then((country) => {
    if (country) {
        data.country = country;
        data.currency = getCurrency(country);
    }
});

provide(stateKey, data);
</script>
