<svelte:options immutable={true}/>

<svg class="svgCanvas">
	<slot/>
</svg>

<style>

	svg {

		contain: strict;
		background-color: transparent;
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		z-index: -1;

	}

</style>
