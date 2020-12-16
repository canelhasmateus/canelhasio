import type { Writable } from "svelte/store";
import { get } from "svelte/store";
import { displace, fade, resize } from "../../categories/morphisms/properties";
import type { Displaceable, Fadable, Fade, Place, Shapable, Shape } from "../../categories/objects/measurements";
import { StoreMapping } from "./stores";


export function displaceStore( store: Writable<Displaceable>, coordinates: Place ): void {

	let mapping: StoreMapping<> = ( store ) => {
		( coordinates ) => void
	}

	return mapping( store )

	return ( coordinates ) => {
		displace( store, coordinates )
	};

	store?.set( displace( get( store ),
						  coordinates ) )
}

export function fadeStore( store: Writable<Fadable>, opacity: Fade ): void {

	setStore()
	store?.set( fade( get( store ),
					  opacity ) )

}

export function reshapeStore( store: Writable<Shapable>, size: Shape ): void {
	store?.set( resize( get( store ),
						size )
	)

}