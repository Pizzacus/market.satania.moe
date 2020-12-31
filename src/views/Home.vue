<template>
	<div class="home">
		<home-slideshow />
		<region-selector />

		<section class="intro">
			<h1>Exclusive merchandise</h1>
			<h2>from the <span class="red">Satania Dropout</span> community</h2>

			<p>
				After all the positive feedback we got from our first edition in 2019,
				Satania Market is back!
			</p>
				
			<p>
				This year, we've invited members of the community to
				contribute their designs and get a share of the revenues
				made from the event!
				
				Thank you so much to everyone who will support the
				community, and these members, too!
			</p>

			<div class="products">
				<product-display v-for="product in products" :product="product" />
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import HomeSlideshow from "../components/HomeSlideshow.vue";
import RegionSelector from "../components/RegionSelector.vue";
import ProductDisplay from "../components/ProductDisplay.vue";

import products from "../../public/products.json";
</script>

<style scoped>
.intro {
	width: 100%;
	max-width: 1000px;
	margin: auto;
}
.intro h1, .intro h2 {
	line-height: 1;
	margin: 0;
	text-align: center;
}

.intro h1 {
	font-size: 48px;
}

.intro h2 {
	font-size: 36px;
	margin-bottom: 36px;
}

.intro .red {
	color: var(--red);
}

.intro p {
	max-width: 655px;
	font-size: 18px;
	margin: auto;
	margin-bottom: 8px;
}

.intro .products {
	display: grid;
	grid-template-columns: repeat(2, auto);
	gap: 35px;
	align-items: top;
	justify-content: center;
	margin-top: 35px;
}

@media (max-width: 575.98px) {
	.intro {
		padding: 0 8px;
	}
	.intro h1 {
		font-size: 8.5vw;
		margin-bottom: 5px;
	}

	.intro h2 {
		font-size: 5.25vw;
		margin-bottom: 18px;
	}

	.intro p {
		font-size: 14px;
	}

	.intro .products {
		padding: 0 8px;
		gap: 16px;
		grid-template-columns: repeat(2, 1fr);
	}
}
</style>