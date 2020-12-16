<svelte:options immutable={true}/>
<svelte:head>

	<title>Canelhas</title>


</svelte:head>
<script lang='typescript'>

	import Canvas from '../framework/components/Canvas.svelte'
	import Marker from '../framework/components/Marker.svelte'
	import type { Writable } from "svelte/store";
	import { spring } from "svelte/motion";
	import { displaceStore, fadeStore, reshapeStore } from "../framework/morphisms";
	import type { Numerical } from "../categories/objects/numericals";
	import type { Fade, Place, Shape } from "../categories/objects/measurements";


	const hoverTransparency: Writable<Fade> = spring( { opacity: 90 as Numerical } );
	const hoverCoordinates: Writable<Place> = spring( { cx: 0 as Numerical, cy: 0 as Numerical } );
	const hoverSize: Writable<Shape>        = spring( { r: 0 as Numerical } );

	async function fillHover( event: MouseEvent ) {
		fadeStore( hoverTransparency,
				   {
					   opacity: 90 as Numerical,
				   } )
	}

	async function fadeHover( event: MouseEvent ) {
		fadeStore( hoverTransparency,
				   {
					   opacity: 0 as Numerical,
				   } )
	}

	async function increaseHover( event: MouseEvent ) {
		reshapeStore( hoverSize,
					  {
						  r: 30 as Numerical,
					  } )
	}

	async function decreaseHover( event: MouseEvent ) {
		reshapeStore( hoverSize,
					  {
						  r: 15 as Numerical,
					  } )
	}

	async function displaceHover( event: MouseEvent ) {
		displaceStore( hoverCoordinates,
					   {
						   cx: event.x as Numerical,
						   cy: event.y as Numerical,
					   } )
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
			<Marker
					fadeStore={hoverTransparency}
					sizeStore={hoverSize}
					coordinatesStore={hoverCoordinates}>
			</Marker>
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

</style>
