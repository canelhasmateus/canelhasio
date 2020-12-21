<svelte:options immutable={true}/>
<svelte:head>

	<title>Canelhas</title>


</svelte:head>
<script lang='typescript'>

	import { writable } from "svelte/store";

	let styleList = Array( 100 ).fill( 0 )
			.map( ( k, i ) => {
				return writable( { x: 0, y: 8 * i + 75 } )
			} )

	let circle: HTMLElement

	function translate( node: HTMLElement ) {

		console.log( "aa" )
		node.style.setProperty( "transform", "translate(500px,500px)" )

	}


</script>

<main
		class="flex-row flex-center">

	<div
			class="flex-row flex-center"
	>

		<h1>Coming Soon&trade</h1>

		<svg>
			{#each styleList as circleStore, index}

				<circle
						bind:this={circle}
						on:mouseenter={ translate(circle) }
						r={30}
				>

				</circle>
			{/each}
		</svg>

	</div>
</main>


<style>

	h1 {

		font-size: 10em;
		font-weight: 700;
		font-family: "Baloo Da 2", monospace;
		font-style: normal;

	}

	@keyframes translate {
		from {

			transform: translate(0px , 0px);
		}
		to {
			transform: translate(500px, 500px);
		}

	}

	circle {
		will-change: transform, opacity;
		animation: translate 1s 0s alternate infinite;
		position: absolute;
		border-radius: 50%;
		fill: #222;
	}

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
