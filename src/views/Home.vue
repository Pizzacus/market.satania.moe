<template>
	<div class="home">
		<home-slideshow />
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HomeSlideshow from "../components/HomeSlideshow.vue";

export default defineComponent({
	name: "Home",
	components: {
		HomeSlideshow,
	},
});
</script>
