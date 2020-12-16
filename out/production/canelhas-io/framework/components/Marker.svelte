<svelte:options immutable={true}/>

<script lang="ts">

	import type { Writable } from "svelte/store";
	import { writable } from "svelte/store";
	import type { Fade, Measurer, Place, Shape, Unit } from "../../categories/objects/measurements";
	import type { Numerical } from "../../categories/objects/numericals";
	import { mapObject } from "../../categories/morphisms/javascript";

	export let fadeUnit: Writable<Measurer>  = writable( ( value: Unit ) => `${ value }%` )
	export let sizeUnit: Writable<Measurer>  = writable( ( value: Unit ) => `${ value }px` )
	export let coordUnit: Writable<Measurer> = writable( ( value: Unit ) => `${ value }px` )

	export let fadeStore: Writable<Fade>         = writable( { opacity: 90 as Numerical } )
	export let coordinatesStore: Writable<Place> = writable( { cx: 0 as Numerical, cy: 0 as Numerical } )
	export let sizeStore: Writable<Shape>        = writable( { r: 0 as Numerical } )

	$: fade = mapObject( $fadeStore, $fadeUnit )
	$: coordinates = mapObject( $coordinatesStore, $coordUnit )
	$: size = mapObject( $sizeStore, $sizeUnit )

</script>

<circle
		class="svgMarker"
		{...fade}
		{...size}
		{...coordinates}>
</circle>

<style>

	.svgMarker {
		will-change: cx, cy, r, opacity;
		position: absolute;
		border-radius: 50%;
		fill: #222;
	}

</style>