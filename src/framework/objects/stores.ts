import type { Readable, Writable } from "svelte/store";
import { get } from "svelte/store";

export type Store<T> = Readable<T> | Writable<T>


export function updateStore<T>( store: Writable<T>, state: T ): void {

	store?.set( state )

}

export function readStore<T>( store: Writable<T> ): T {

	return get( store )

}