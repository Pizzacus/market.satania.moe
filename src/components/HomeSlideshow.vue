<template>
	<div class="embla" ref="emblaNode">
		<div class="embla__container" @mouseover="slideManager.stop()" @mouseout="slideManager.start()">
			<div
				class="embla__slide"
				v-for="product in products"
				:key="product.id"
				@click.left="handleSlideClick"
			>
				<div class="inner-slide" :style="{
					'--image': `url(${ getFeaturedImage(product) })`,
				}">
					<div class="slide-info">
						<div class="product-name">
							<h1>{{ product.name }}</h1>
							<p v-html="product.description" />
						</div>

						<div class="product-actions">
							<div class="product-price">
								{{ formatPrice(product.price, state.currency) }}
							</div>

							<button :class="buttons.greenButton">
								<img
									src="/assets/shopping-cart.svg"
									alt=""
									role="presentation"
									class="add-to-cart-icon"
								/>
								Add to cart
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div @mouseover="slideManager.stop()" @mouseout="slideManager.start()">
			<button class="slide-controls prev-slide" @click.left="embla?.scrollPrev()">
				<img src="/assets/prev-slide.svg" alt="Previous slide" />
			</button>

			<button class="slide-controls next-slide" @click.left="embla?.scrollNext()">
				<img src="/assets/next-slide.svg" alt="Next slide" />
			</button>
		</div>

		<div class="mobile-slide-nav">
			<button
				v-for="i in totalSlides"
				class="slide-button"
				:class="{ selected: currentSlide === i - 1 }"
				@click.left="absoluteScrollTo(i - 1)"
			/>
		</div>

		<div class="desktop-slide-nav">
			<button
				v-for="i in totalSlides"
				class="slide-button"
				:class="{ selected: currentSlide === i - 1 }"
				:style="{
					// There was a 1 frame flicker on the buttons when the slide switched
					// because the slide would switch but progressToSlide wasn't yet set to zero yet.
					// The fix is to set the --progress to 0% when progressToSlide is over 1 (100%)
					// because when progressToSlide is over 1, it means the slide has
					// already switched and the variable just hasn't been set to 0 yet.
					'--progress': currentSlide > i - 1
						? '100%'
						: currentSlide === i - 1 && progressToSlide < 1
							? Math.round(progressToSlide * 100) + '%'
							: '0%',
				}"
				@click.left="absoluteScrollTo(i - 1)"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, shallowRef, onUnmounted, inject } from "vue";
import buttons from "../styles/buttons.module.css";
import type { Ref } from "vue";
import EmblaCarousel from "embla-carousel";
import formatPrice from "../utils/format-price";
import type { Product } from "../products.types";
import stateKey from "../state";
const state = inject(stateKey);

if (!state) {
	throw new TypeError("State not defined.");
}

import products from "../../public/products.json";

function getFeaturedImage(product: Product) {
	return product.metadata.detailedImages[product.metadata.featuredImageIndex];
}

const emblaNode: Ref<null | HTMLDivElement> = ref(null);
const embla: Ref<null | ReturnType<typeof EmblaCarousel>> = shallowRef(null);

const currentSlide: Ref<number> = ref(0);
const totalSlides: Ref<number> = ref(0);

const slideManager = {
	playing: false,
	timeout: null as null | number,
	slideTime: null as null | number,
	delay: 5000,
	start() {
		if (!this.playing) {
			this.playing = true;
			this.resetDelay();
		}
	},
	stop() {
		if (this.playing) {
			this.playing = false;
			this._clearTimeout();
		}
	},
	resetDelay() {
		const nextSlide = () => {
			// Reportedly, that helps with the slideshow getting messed up
			// when the tab is left inactive for a while
			window.requestAnimationFrame(() => {
				embla.value?.scrollNext();
				this.resetDelay();
			});
		}

		if (this.playing) {
			this._clearTimeout();
			this.timeout = window.setTimeout(nextSlide.bind(this), this.delay);
			this.slideTime = performance.now() + this.delay;
		}
	},
	_clearTimeout() {
		if (this.timeout != null) {
			window.clearTimeout(this.timeout);
			this.timeout = null;
			this.slideTime = null;
		}
	},
	timeUntilSlide(): null | number {
		if (this.slideTime != null) {
			return this.slideTime - performance.now();
		} else {
			return null;
		}
	},
	progressToSlide(): number {
		const time = this.timeUntilSlide();

		if (time != null) {
			return 1 - (time / this.delay);
		} else {
			return 0;
		}
	}
}

const progressToSlide: Ref<number> = ref(0);

window.requestAnimationFrame(function loop () {
	progressToSlide.value = slideManager.progressToSlide();
	window.requestAnimationFrame(loop);
});

function visibilityListener() {
	if (document.hidden) {
		slideManager.stop();
	} else {
		slideManager.start();
	}
}

document.addEventListener("visibilitychange", visibilityListener);

onUnmounted(() => {
	slideManager.stop();
	document.removeEventListener("visibilitychange", visibilityListener);
	embla.value?.destroy();
});

function handleSlideClick(event: MouseEvent) {
	const slide = event.currentTarget as HTMLDivElement;

	// This scrolls to unselected slides when they are clicked
	if (embla.value && !slide.classList.contains("is-selected") && embla.value.clickAllowed()) {
		const slideNum = embla.value.slideNodes().indexOf(slide);
		embla.value.scrollTo(slideNum);

		event.preventDefault();
		event.stopPropagation();
	}
}

let slideCap = true;

function absoluteScrollTo(slideNum : number) {
	// This is pretty hacky, the "select" event listener checks this variable
	// and it is used tot ell it to not cap the scroll.
	// A better way to do this would be to determine if the scroll was caused
	// by a drag or by a button, but I didnt't figure it out.
	slideCap = false;
	embla.value?.scrollTo(slideNum);
	slideCap = true;

	slideManager.resetDelay();
}

onMounted(() => {
	if (emblaNode.value) {
		embla.value = EmblaCarousel(emblaNode.value, {
			loop: true,
			inViewThreshold: 1,
		});

		function handleInit() {
			if (embla.value) {
				slideManager.start();
				currentSlide.value = embla.value.selectedScrollSnap();
				totalSlides.value = embla.value.scrollSnapList().length;
			}
		}

		embla.value.on("init", handleInit);
		embla.value.on("reInit", handleInit);

		embla.value.on("select", () => {
			if (embla.value) {
				// This code is meant to help with accidentally strong flicks,
				// where the user drags the slide too hard and ends up skipping a slide

				// CAVEAT: The "select" event does not trigger if the slidehow loops
				// and ends up on the same slide it started with.
				// So we cannot prevent flicks that are so strong yet precise that they
				// loop the whole carousel around and end on the same slide.

				// CAVEAT: Another unrelated caveat of this code is that it doesn't
				// prevent the "loop around" animation from playing, so if the user
				// flicks so hard they loop the whole carousel, it'll still end up
				// on the right index, capped by this code, but it will loop the
				// entire thing to get to it.

				// I tested, it is possible to do both on the website, but very hard.
				// It wouldn't happen accidentally.
				const engine = embla.value.dangerouslyGetEngine();

				// Direction of the cursor at the time the button was released
				// 0 no direction, -1 backward, 1 forward
				// Note that the carousel scrolls with the cursor, and therefore
				// the indexes move in the opposite direction,
				// so if the direction is -1, the index should increase
				const direction = engine.scrollBody.direction();

				if (direction !== 0 && slideCap) {
					// It is possible the cursor had no direction at the end of
					// the flick if the user stops their cursor right before the end
					// In this case, we don't do anything because it was likely
					// a slow slide, so it was probably precise enough

					let newSlide = embla.value.selectedScrollSnap();
					let oldSlide = currentSlide.value;

					// We must take looping into account, for instance, the user can
					// go forward and still end up on a slide with a lower index if
					// the carousel looped around

					if (direction <= -1) {
						// If the cursor was moving backward, the index should have increased
						while (newSlide < oldSlide) {
							newSlide += totalSlides.value;
						}
					} else if (direction >= 1) {
						// If the cursor was moving forward, the index should have decreased
						while (newSlide > oldSlide) {
							newSlide -= totalSlides.value;
						}
					}

					// Then finally, we can know how many slides were scrolled
					// If we hadn't normalised the newSlide value, then our code
					// would think the entire carousel was travelled when it loops!
					let slideChange = newSlide - oldSlide;

					if (Math.abs(slideChange) >= 2) {
						slideChange = Math.max(-1, Math.min(1, slideChange));
						embla.value.scrollTo((oldSlide + slideChange) % totalSlides.value);
					}
				}

				currentSlide.value = embla.value.selectedScrollSnap();
			}
		});
	}
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
	width: 100%;
	max-width: 1000px;
	height: 500px;
	border-radius: 20px;
	overflow: hidden;
	position:relative;
	box-shadow: var(--large-shadow);
	transition: transform 0.25s, opacity 0.25s;
	background-color: #eee;
	background-size: cover;
	background-image:
		linear-gradient(180deg, #0000 60%, #000 100%),
		var(--image);
	background-position: center;
}

.embla__slide:not(.is-selected) {
	cursor: pointer;
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

.product-name {
	flex: 1;
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

.add-to-cart-icon {
	width: 32px;
	height: 32px;
	margin-right: 12px;
	filter: var(--very-small-shadow-filter);
}

.product-actions {
	display: flex;
}

.slide-controls {
	background: transparent;
	border: none;
	position: absolute;
	bottom: 50%;
}

.slide-controls img {
	filter: var(--large-shadow-filter);
}

.next-slide {
	right: 25px;
}

.prev-slide {
	left: 25px;
}

.mobile-slide-nav {
	height: 20px;
	background: #000;
	display: none;
	justify-content: center;
	align-items: flex-start;
}

.mobile-slide-nav .slide-button {
	width: 10px;
	height: 10px;
	background: rgba(255, 255, 255, 0.45);
	margin: 0 5px;
	border-radius: 100%;
	border: none;
	padding: 0;
}

.mobile-slide-nav .slide-button.selected {
	background: #fff;
}

.desktop-slide-nav {
	display: flex;
	justify-content: center;
	padding-top: 15px;
	padding-bottom: 5px;
}

.desktop-slide-nav .slide-button {
	width: 50px;
	height: 15px;
	background: var(--text);
	background: linear-gradient(
		90deg,
		var(--text) 0%,
		var(--text) var(--progress),
		var(--background) var(--progress)
	);
	border: 3px solid var(--text);
	padding: 0;
	margin: 0 5px;
	border-radius: 4px;
}

.desktop-slide-nav .slide-button.selected {
	box-shadow: 0 0 4px 1px var(--text);
}

@media (min-width: 1950px) {
	.embla__slide, .inner-slide {
		max-width: none;
		width: 50vw;
		height: 25vw;
	}
}

@media (max-width: 1300px) {
	.slide-controls {
		background: #0006;
		padding: 8px 4px;
	}

	.slide-controls img {
		filter: none;
	}

	.next-slide {
		right: 0;
	}

	.prev-slide {
		left: 0;
	}
}

@media (min-width: 1080.02px) {
	.embla__slide:not(.is-selected) .inner-slide {
		transform: scale(0.92);
		opacity: 0.5;
	}
}

@media (max-width: 1080px) {
	.embla__slide, .inner-slide {
		max-width: none;
		width: 100%;
		border-radius: 0;
	}
}

@media (max-width: 767.98px) {
	.slide-info {
		left: 8px;
		right: 8px;
		bottom: 8px;
		align-items: flex-end;
	}
	.embla__slide, .inner-slide {
		height: 100vw;
		min-height: 360px;
		box-shadow: none;
	}
	.product-name h1 {
		font-size: 24px;
	}

	.product-name p {
		font-size: 12px;
	}

	.product-actions {
		flex-direction: column;
	}

	.product-price {
		font-size: 24px;
		text-align: end;
		margin: 0;
	}

	.slide-controls {
		display: none;
	}

	.add-to-cart-icon {
		width: 24px;
		height: 24px;
		margin-right: 8px;
	}

	.mobile-slide-nav {
		display: flex;
	}

	.desktop-slide-nav {
		display: none;
	}
}
</style>