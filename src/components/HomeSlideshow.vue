<template>
	<div class="embla" ref="emblaNode">
		<div class="embla__container">
			<div
				class="embla__slide"
				v-for="slide in slides"
				key="slide.id"
				@click.left="handleSlideClick"
			>
				<div class="inner-slide" :style="{
					'--image': slide.background,
				}">
					<div class="slide-info">
						<div class="product-name">
							<h1>{{ slide.title }}</h1>
							<p v-html="slide.description" />
						</div>

						<div class="product-actions">
							<div class="product-price">{{ slide.price }}</div>

							<button :class="buttons.greenButton">OwO</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<button class="slide-controls prev-slide" @click.left="embla?.scrollPrev()">
			<img src="/assets/prev-slide.svg" alt="Previous slide" />
		</button>

		<button class="slide-controls next-slide" @click.left="embla?.scrollNext()">
			<img src="/assets/next-slide.svg" alt="Next slide" />
		</button>
	</div>
</template>

<script setup lang="ts">
import { defineComponent, onMounted, ref, watch, shallowRef } from "vue";
import buttons from "../styles/buttons.module.css";
import type { Ref } from "vue";
import EmblaCarousel from "embla-carousel";

interface SlideEntry {
	id: string;
	background: string;
	title: string;
	description: string;
	price: string;
}

const emblaNode: Ref<null | HTMLDivElement> = ref(null);
const slides: Ref<SlideEntry[]> = ref([
	{
		id: "test-item-1",
		background: "url(https://picsum.photos/1000/500?unique1)",
		title: "100% devilish",
		description: "Black unisex <b>T-shirt</b>, 100% cotton<br/>Made by <b>Deesco#1939</b>",
		price: "US $24",
	},
	{
		id: "test-item-2",
		background: "url(https://picsum.photos/1000/500?unique2)",
		title: "100% devilish",
		description: "Black unisex <b>T-shirt</b>, 100% cotton<br/>Made by <b>Deesco#1939</b>",
		price: "US $24",
	},
	{
		id: "test-item-3",
		background: "url(https://picsum.photos/1000/500?unique3)",
		title: "100% devilish",
		description: "Black unisex <b>T-shirt</b>, 100% cotton<br/>Made by <b>Deesco#1939</b>",
		price: "US $24",
	},
	{
		id: "test-item-4",
		background: "url(https://picsum.photos/1000/500?unique4)",
		title: "100% devilish",
		description: "Black unisex <b>T-shirt</b>, 100% cotton<br/>Made by <b>Deesco#1939</b>",
		price: "US $24",
	},
]);

let embla: Ref<ReturnType<typeof EmblaCarousel> | null> = shallowRef(null);

function handleSlideClick(event: MouseEvent) {
	const slide = event.currentTarget as HTMLDivElement;

	if (embla.value && !slide.classList.contains("is-selected") && embla.value.clickAllowed()) {
		const slideNum = embla.value.slideNodes().indexOf(slide);
		embla.value.scrollTo(slideNum);
		event.preventDefault();
		event.stopPropagation();
	}
}

onMounted(() => {
	if (emblaNode.value) {
		embla.value = EmblaCarousel(emblaNode.value, {
			loop: true,
			inViewThreshold: 1,
		});
	}
});

watch(slides, () => {
	embla.value?.reInit();
});
</script>

<style scoped>
.embla {
	touch-action: pan-y;
	overflow: hidden;
	-webkit-tap-highlight-color: transparent;
	tap-highlight-color: transparent;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	margin: -40px 0;
	padding: 40px 0;
	position: relative;
}

.embla__container {
	display: flex;
}

.embla__slide {
	position: relative;
	flex: none;
	width: 100vw;
	max-width: 1000px;
	height: 500px;
}

.inner-slide {
	width: 100vw;
	max-width: 1000px;
	height: 500px;
	border-radius: 20px;
	overflow: hidden;
	position:relative;
	box-shadow: var(--thick-shadow);
	transition: transform 0.25s, opacity 0.25s;
	background-color: #eee;
	background-image:
		linear-gradient(180deg, #0000 60%, #000 100%),
		var(--image);
}

.embla__slide:not(.is-selected) {
	cursor: pointer;
}

.embla__slide:not(.is-selected) .inner-slide {
	transform: scale(0.92);
	opacity: 0.5;
}

.slide-info {
	position: absolute;
	bottom: 40px;
	left: 40px;
	right: 40px;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.product-name h1 {
	font-size: 48px;
	margin: 0;
}

.product-name p {
	font-size: 18px;
	color: rgba(255, 255, 255, 0.8);
	margin: 0;
}

.product-name p:deep(b) {
	color: #fff;
}

.product-price {
	font-size: 36px;
	font-weight: bold;
	margin-right: 30px;
}

.product-actions {
	display: flex;
}

.slide-controls {
	background: transparent;
	border: none;
	position: absolute;
	top: 50%;
}

.slide-controls img {
	filter: drop-shadow(0px 1px 5px rgba(0, 0, 0, 0.5));
}

.next-slide {
	right: 25px;
}

.prev-slide {
	left: 25px;
}
</style>