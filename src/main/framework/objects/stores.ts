import type { Readable, Writable } from "svelte/store"
import { get } from "svelte/store"
import { mutate } from "../../categories/morphisms/functional"

export type Store<T> = Readable<T> | Writable<T>

export function updateStore<T> ( store: Writable<T>, state: T ): void {
  store?.set( mutate( readStore( store ), state ) )
}

export function readStore<T> ( store: Writable<T> ): T {
  return get( store )
}
