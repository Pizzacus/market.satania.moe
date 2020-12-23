<template>
	<header>
		<router-link to="/">
			<img class="desktop-logo" src="/assets/logo.svg" alt="Satania Market 2020" />
			<img class="mobile-logo" src="/assets/logo-mobile.svg" alt="Satania Market 2020" />
		</router-link>
	</header>
</template>

<style scoped>
header {
	height: 120px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.mobile-logo {
	display: none;
	position: absolute;
	left: 8px;
	top: 8px;
	z-index: 666;
	filter: var(--thick-shadow-filter);
}

@media (max-width: 767.98px) {
	header {
		height: auto;
	}
	.mobile-logo {
		display: block;
	}

	.desktop-logo {
		display: none;
	}
}
</style>