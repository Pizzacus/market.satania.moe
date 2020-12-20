<template>
    <top-bar />

    <main>
        <router-view />
    </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TopBar from "./components/TopBar.vue";

export default defineComponent({
    name: "App",
    components: {
        TopBar,
    },
});
</script>
