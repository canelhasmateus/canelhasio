<svelte:options immutable={true}/>
<svelte:head>

	<title>Canelhas</title>


</svelte:head>
<script lang='typescript'>

	import type { Writable } from "svelte/store";
	import { writable } from "svelte/store";
	import type { Fade, Place, Shape } from "../../categories/objects/measurements";
	import { defaultFadeIn, defaultFadeOut, defaultPosition, defaultShapeIn, defaultShapeOut, toPercent, toPixels } from "../objects/properties";
	import Canvas from "../components/Canvas.svelte";
	import { mergeStore } from "../objects/stores";
	import { mapValues } from "../../categories/morphisms/javascript";


	const hoverTransparency: Writable<Fade> = writable( defaultFadeOut )
	const hoverCoordinates: Writable<Place> = writable( defaultPosition )
	const hoverSize: Writable<Shape>        = writable( defaultShapeIn )


	async function fillHover( event: MouseEvent ) {
		mergeStore( hoverTransparency,
					mapValues( toPercent,
							   defaultFadeIn ) )
	}

	async function fadeHover( event: MouseEvent ) {
		mergeStore( hoverTransparency,
					mapValues( toPercent,
							   defaultFadeOut ) )
	}

	async function increaseHover( event: MouseEvent ) {
		mergeStore( hoverSize,
					mapValues( toPixels,
							   defaultShapeOut )
		)

	}

	async function decreaseHover( event: MouseEvent ) {
		mergeStore( hoverSize,
					mapValues( toPixels,
							   defaultShapeIn )
		)
	}

	async function displaceHover( event: MouseEvent ) {

		mergeStore( hoverCoordinates,
					mapValues( toPixels,
							   {
								   cx: event.x,
								   cy: event.y
							   } )
		)

	}


</script>

<main
		class="flex-row flex-center">

	<div
			class="flex-row flex-center"
			on:mouseenter={ fillHover }
			on:mouseleave={ fadeHover }
			on:mousedown={ increaseHover }
			on:mouseup={ decreaseHover }
			on:mousemove={ displaceHover }
	>

		<h1>Coming Soon&trade</h1>

		<Canvas>
			<circle
					{...$hoverTransparency}
					{...$hoverSize}
					{...$hoverCoordinates}
			>

			</circle>
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


	circle {
		will-change: cx, cy, r, opacity;
		position: absolute;
		border-radius: 50%;
		fill: #222;
	}


</style>
