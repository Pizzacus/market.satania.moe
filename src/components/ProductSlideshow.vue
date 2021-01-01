<template>
	<div class="product-slideshow">
		<div class="embla main-carousel">
			<div class="embla__viewport" ref="mainCarouselView">
				<div class="embla__container">
					<div class="embla__slide" v-for="image in props.images">
						<div class="embla__slide__inner">
							<img class="embla__slide__img" :src="image" @load="imagesLoaded++" />
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="embla embla--thumb">
			<div class="embla__viewport" ref="thumbCarouselView">
				<div class="embla__container embla__container--thumb">
					<div class="embla__slide embla__slide--thumb" v-for="image in props.images">
						<button
							class="embla__slide__inner embla__slide__inner--thumb"
							type="button"
						>
							<img class="embla__slide__thumbnail" :src="image" />
						</button>
					</div>
				</div>
			</div>
		</div>

		<div class="hidden-owo" :hidden="imagesLoaded < props.images.length">
			OwO,<br />
			what's this?
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref } from "vue";
import type { PropType, Ref } from "vue";
import EmblaCarousel from "embla-carousel";

const props = defineProps({
	images: {
		type: Array as PropType<string[]>,
		required: true,
	},
});

// Based off the "thumbnail" demo from https://davidcetinkaya.github.io/embla-carousel/examples

function onThumbClick(
	mainCarousel: ReturnType<typeof EmblaCarousel>,
	thumbCarousel: ReturnType<typeof EmblaCarousel>,
	index: number,
) {
	return () => {
		if (!thumbCarousel.clickAllowed()) return;
		mainCarousel.scrollTo(index);
	};
};

function followMainCarousel(
	mainCarousel: ReturnType<typeof EmblaCarousel>,
	thumbCarousel: ReturnType<typeof EmblaCarousel>,
) {
	return () => {
		thumbCarousel.scrollTo(mainCarousel.selectedScrollSnap());
		selectThumbBtn(mainCarousel, thumbCarousel);
	};
}

function selectThumbBtn (
	mainCarousel: ReturnType<typeof EmblaCarousel>,
	thumbCarousel: ReturnType<typeof EmblaCarousel>,
) {
	const previous = mainCarousel.previousScrollSnap();
	const selected = mainCarousel.selectedScrollSnap();
	thumbCarousel.slideNodes()[previous].classList.remove("is-selected");
	thumbCarousel.slideNodes()[selected].classList.add("is-selected");
}

const mainCarouselView: Ref<null | HTMLDivElement> = ref(null);
const thumbCarouselView: Ref<null | HTMLDivElement> = ref(null);

// Keeps track of the number of images loaded, the OwO easter egg only appears
// when all images are loaded, to avoid people seeing it through the loading images
let imagesLoaded = ref(0);

onMounted(() => {
	if (!mainCarouselView.value || !thumbCarouselView.value) {
		throw new Error("A ref was not found");
	}

	const mainCarousel = EmblaCarousel(mainCarouselView.value, {
		selectedClass: "",
		loop: false,
	});

	const thumbCarousel = EmblaCarousel(thumbCarouselView.value, {
		selectedClass: "",
		containScroll: "keepSnaps",
		align: "start",
	});
	
	thumbCarousel.slideNodes().forEach((thumbNode, index) => {
		const onClick = onThumbClick(mainCarousel, thumbCarousel, index);
		thumbNode.addEventListener("click", onClick, false);
	});
	
	const syncThumbCarousel = followMainCarousel(mainCarousel, thumbCarousel);
	mainCarousel.on("select", syncThumbCarousel);
	thumbCarousel.on("init", syncThumbCarousel);
});
</script>

<style scoped>
.product-slideshow {
	background: var(--gray);
	border-radius: 5px;
	position: relative;
}

.embla {
	position: relative;
	z-index: 2;
}

.embla__viewport {
	overflow: hidden;
	width: 100%;
}

.embla__viewport.is-draggable {
	cursor: move;
	cursor: grab;
}

.embla__viewport.is-dragging {
	cursor: grabbing;
}

.embla__container {
	display: flex;
	user-select: none;
	-webkit-touch-callout: none;
	touch-action: pan-y;
	-webkit-tap-highlight-color: transparent;
	tap-highlight-color: transparent;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}

.embla__slide {
	position: relative;
}

.main-carousel .embla__viewport {
	border-radius: 5px;
}

.main-carousel .embla__slide {
	min-width: 100%;
}

.embla__slide__img {
	width: 100%;
}

.embla--thumb {
	padding-top: 0;
}

.embla__container--thumb {
	cursor: default;
	padding: 5px;
}

.embla__slide--thumb {
	margin-right: 5px;
}

.embla__slide__inner--thumb {
	touch-action: manipulation;
	cursor: pointer;
	border: 0;
	outline: 0;
	margin: 0;
	padding: 0;
	background-color: transparent;
	position: relative;
	display: block;
	overflow: hidden;
	border: 2px solid transparent;
	border-radius: 4px;
	overflow: hidden;
}

.embla__slide__thumbnail {
	height: 70px;
	transition: opacity 0.2s;
	border: 2px solid #000;
	border-radius: 4px;
}

.embla__slide--thumb.is-selected .embla__slide__inner--thumb {
	border: 2px solid var(--red);
	box-shadow: 0 0 5px var(--red);
}

.embla__slide--thumb.is-selected .embla__slide__thumbnail {
	border: 2px solid #fff;
}

.hidden-owo {
	position: absolute;
	left: 50px;
	top: 50%;
	z-index: 1;
	text-align: center;
}
</style>
