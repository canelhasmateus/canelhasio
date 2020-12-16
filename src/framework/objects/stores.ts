import type { Readable, Writable } from "svelte/store";
import { get } from "svelte/store";
import { merge } from "../../categories/morphisms/functional";

export type Store<T> = Readable<T> | Writable<T>
export type StoreMapping<T, V> = ( store: Store<T> ) => ( data: V ) => void


export function mergeStore<T>( store: Writable<T>, state: T ): void {

	store?.set( merge( get( store ),
					   state ) )

}