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

		<hr />

		<section class="print-quality">
			<h1>We did our best to <br/> improve our print quality</h1>

			<p>
				Last year, the print quality did not match our expectations
				(and the claims of the supplier) and fixing that was the number
				one priority. We changed to a different supplier, they cost
				about 2x more to us, but the samples we received looked much
				better.
			</p>

			<p><b>Take a look at this real-life photo!</b></p>

			<a href="/assets/print-quality/full.jpg" class="quality-link" target="_blank" rel="noopener">
				<picture class="quality-pic">
					<source
						srcset="/assets/print-quality/1000w.webp 1000w, /assets/print-quality/2000w.webp 2000w"
						type="image/webp"
					/>
					<source
						srcset="/assets/print-quality/1000w.jpg 1000w, /assets/print-quality/2000w.jpg 2000w"
						type="image/jpeg"
					/>
					<img src="/assets/print-quality/1000w.jpg" alt="" />
				</picture>

				<div class="full-quality-badge">Click to see full resolution</div>
			</a>
		</section>

		<p class="samples-notice">
			<img src="/assets/info.svg" alt="" role="presentation" />
			<div>
				Due to shipping complications, we were only able to receive samples
				for <b>Retro Demon</b> (the one on the picture). However, since the
				other products are printed by the same supplier on similar garments,
				we expect the quality to be on par.
			</div>
		</p>

		<hr />

		<section class="q-a">
			<h1>Q&amp;A</h1>

			<div class="question" v-for="category in questions">
				<h2 class="question-section" id="QnA">{{ category.title }}</h2>

				<Question v-for="question in category.content" :question="question" />	
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import HomeSlideshow from "../components/HomeSlideshow.vue";
import RegionSelector from "../components/RegionSelector.vue";
import ProductDisplay from "../components/ProductDisplay.vue";
import Question from "../components/Question.vue";

import products from "../../public/products.json";
import questions from "../questions.json";
</script>

<style scoped>
.intro {
	width: 100%;
	max-width: 1000px;
	margin: auto;
}

h1, h2 {
	line-height: 1;
	margin: 0;
	text-align: center;
}

h1 {
	font-size: 48px;
}

h2 {
	font-size: 36px;
}

.intro h2, .print-quality h1 {
	margin-bottom: 1em;
}

.intro .red {
	color: var(--red);
}

.intro p, .print-quality p {
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

.print-quality {
	width: 100%;
	max-width: 1000px;
	margin: auto;
}

.quality-link {
	display: block;
	position: relative;
	margin: 36px 0;
}

.quality-pic img {
	width: 100%;
	border-radius: 20px;
	box-shadow: var(--medium-shadow);
}

.full-quality-badge {
	position: absolute;
	bottom: 10px;
	left: 50%;
	transform: translateX(-50%);
	padding: 5px;
	background: #fffc;
	color: #444;
}

.samples-notice {
	width: 100%;
	max-width: 600px;
	margin: auto;
	background: var(--gray);
	display: flex;
	align-items: center;
	padding: 10px;
	border-radius: 5px;
}

.samples-notice img {
	height: 48px;
	margin-right: 10px;
}

hr {
	margin: 50px 0;
	border: none;
	height: 2px;
	background: #ccc;
}

.question-section {
	margin: 1em 0;
}

@media (max-width: 1000px) {
	.quality-pic img {
		border-radius: 0;
		box-shadow: none;
	}
}

@media (max-width: 575.98px) {
	.intro, .print-quality {
		padding: 0 8px;
	}
	
	h1 {
		font-size: 8.5vw;
		margin-bottom: 5px;
	}

	h2 {
		font-size: 5.25vw;
		margin-bottom: 18px;
	}

	p {
		font-size: 14px;
	}

	.intro .products {
		padding: 0 8px;
		gap: 32px 16px;
		grid-template-columns: repeat(2, 1fr);
	}

	.full-quality-badge {
		font-size: 14px;
	}
}
</style>