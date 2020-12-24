<template>
    <top-bar />

    <main>
        <router-view />
    </main>
</template>

<script setup lang="ts">
import { provide, reactive } from "vue";
import TopBar from "./components/TopBar.vue";
import stateKey from "./state";
import type { GlobalState } from "./state";

// This state is shared by the entire app
// this is simpler than using Vuex it saves me time pls understand
const data: GlobalState = reactive({
    currency: "EUR",
    country: "fr",
});

provide(stateKey, data);
</script>
