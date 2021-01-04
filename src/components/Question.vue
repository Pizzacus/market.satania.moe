<template>
	<div class="question" @click.left="unfolded = !unfolded" :class="{ unfolded }">
		<h4 v-html="props.question.title" />
		<p v-html="props.question.content" />
	</div>
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue";
import type { PropType } from "vue";

interface Question {
	title: string;
	content: string;
}

let unfolded = ref(false);

const props = defineProps({
	question: {
		type: Object,
		required: true,
	}
});
</script>

<style scoped>
.question {
	width: 100%;
	max-width: 600px;
	background: var(--gray);
	padding: 10px 20px;
	margin: auto;
	cursor: pointer;
	filter: brightness(1);
}

.question:hover, .question.unfolded {
	filter: brightness(0.95);
}

.question.unfolded:hover {
	filter: brightness(0.9);
}

.question:not(:first-of-type) {
	border-top: 2px solid #0002;
}

.question:first-of-type {
	border-top-left-radius: 5px;
	border-top-right-radius: 5px;
}

.question:last-of-type {
	border-bottom-left-radius: 5px;
	border-bottom-right-radius: 5px;
}

h4 {
	font-size: 20px;
}

p {
	display: none;
	margin-bottom: none;
}

.unfolded p {
	display: block;
}

@media (max-width: 575.98px) {
	.question h4 {
		font-size: 5vw;
	}
}
</style>