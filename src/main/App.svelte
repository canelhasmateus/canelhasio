

<script lang='ts'>

	import type { Writable } from "svelte/store";
	import { get, writable } from "svelte/store";
	import type { Fade, Place, Shape } from "./categories/objects/measurements";
	import { defaultFadeIn, defaultFadeOut, defaultPosition, defaultShapeIn, defaultShapeOut, toPercent, toPixels, toTranslate } from "./framework/objects/properties";
	import { updateStore } from "./framework/objects/stores";
	import { mapValues } from "./categories/morphisms/javascript";
	import Canvas from "./components/Canvas.svelte"
	import { spring } from "svelte/motion";


	const hoverTransparency: Writable<Fade> = writable( defaultFadeOut )
	const hoverCoordinates: Writable<Place> = spring( defaultPosition )
	const hoverSize: Writable<Shape>        = writable( defaultShapeIn )

	$: style = toTranslate( $hoverCoordinates )
	function fillHover( event: MouseEvent ) {

		updateStore( hoverTransparency,
					 mapValues( toPercent,
								defaultFadeIn ) )
	}

	function fadeHover( event: MouseEvent ) {
		updateStore( hoverTransparency,
					 mapValues( toPercent,
								defaultFadeOut ) )
	}

	function increaseHover( event: MouseEvent ) {
		updateStore( hoverSize,
					 mapValues( toPixels,
								defaultShapeOut )
		)

	}

	function decreaseHover( event: MouseEvent ) {
		updateStore( hoverSize,
					 mapValues( toPixels,
								defaultShapeIn )
		)
	}

	function displaceHover( event: MouseEvent ) {

		updateStore( hoverCoordinates,
					 {
						 x: event.x,
						 y: event.y
					 }
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
					style={style}
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
		will-change: transform, opacity;
		transition-property: opacity;
		transition-duration: 300ms;
		position: absolute;
		border-radius: 50%;
		fill: #222;
	}


</style>
