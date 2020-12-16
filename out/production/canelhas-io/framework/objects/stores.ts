import type { Readable, Writable } from "svelte/store";

export type Store<T> = Readable<T> | Writable<T>
export type StoreMapping<T, V> = ( store: Store<T> ) => ( data: V ) => void
