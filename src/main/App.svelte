<script lang="ts">
	import type { Writable } from "svelte/store";
	import { get, writable } from "svelte/store";
	import type { Fade, Place, Shape } from "./categories/objects/measurements";
	import {
		defaultFadeIn,
		defaultFadeOut,
		defaultPosition,
		defaultShapeIn,
		defaultShapeOut,
		toPercent,
		toPixels,
		toTranslate,
	} from "./framework/objects/properties";
	import { updateStore } from "./framework/objects/stores";
	import { mapValues } from "./categories/morphisms/javascript";
	import Canvas from "./components/Canvas.svelte";
	import { spring } from "svelte/motion";

	const hoverTransparency: Writable<Fade> = writable(defaultFadeOut);

	const hoverCoordinates: Writable<Place> = spring(defaultPosition);
	const hoverSize: Writable<Shape> = writable(defaultShapeIn);

	$: style = toTranslate($hoverCoordinates);

	function fillHover(event: MouseEvent) {
		let a = toPercent( defaultShapeIn)
		updateStore(hoverTransparency, mapValues(toPercent, defaultFadeIn));
	}

	function fadeHover(event: MouseEvent) {
		updateStore(hoverTransparency, mapValues(toPercent, defaultFadeOut));
	}

	function increaseHover(event: MouseEvent) {
		updateStore(hoverSize, mapValues(toPixels, defaultShapeOut));
	}

	function decreaseHover(event: MouseEvent) {
		updateStore(hoverSize, mapValues(toPixels, defaultShapeIn));
	}

	function displaceHover(event: MouseEvent) {
		updateStore(hoverCoordinates, {
			x: event.x,
			y: event.y,
		});
	}

</script>

<main class="flex-row flex-center">
	<div
		class="flex-row flex-center"
		on:mouseenter={fillHover}
		on:mouseleave={fadeHover}
		on:mousedown={increaseHover}
		on:mouseup={decreaseHover}
		on:mousemove={displaceHover}
	>
		<h1>Coming Soon&trade</h1>

		<Canvas>
			<circle {...$hoverTransparency} {...$hoverSize} {style} />
		</Canvas>
	</div>
</main>

<style>
	h1 {
		font-size: 10em;
		font-weight: 700;
		font-family: "Baloo Da 2", monospace;
		font-style: normal;
	}

	@font-face {
		font-family: "Baloo Da 2";
		font-style: normal;
		font-weight: 700;
		font-display: fallback;
		src: url(/assets/balooda2.woff2) format("woff2");
		unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
			U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
			U+2212, U+2215, U+FEFF, U+FFFD;
	}

	:global(html > body) {
		height: 100vh;
		overflow: hidden;

		display: flex;
		flex-direction: column;

		color: rgb(197, 79, 10);
		background-color: #1a1618;
	}

	circle {
		will-change: transform, opacity;
		transition-property: opacity;
		transition-duration: 300ms;
		position: absolute;
		border-radius: 50%;
		fill: rgb(197, 79, 10);
	}

	.flex-col {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		flex-shrink: 0;
	}

	.flex-row {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: row;
		flex-grow: 1;
		flex-shrink: 0;
	}

	.flex-center {
		justify-content: center;
		align-items: center;
	}

</style>
