import type { Functor } from "../objects/functors";
import { identity } from "./functional";
import type { Numerical } from "../objects/numericals";

export function fromEntries( arr: ArrayLike<any> ): Object {
	return Object.assign( {},
						  ...Array.from( arr,
										 ( [ k, v ] ) => ( { [ k ]: v } )
						  )
	);

}

export function mapObject( keyFn: Functor, valueFn: Functor, obj: any ): any {

	return fromEntries( Object.entries( obj )
							.map( ( [ key, value ], i ) =>
									  ( [ keyFn( key ), valueFn( value ) ] )
							)
	)


}

export function mapKeys( fn: Functor, obj: any ): any {

	return mapObject( fn, identity, obj )


}


export function mapValues( fn: Functor, obj: any ): any {

	return mapObject( identity, fn, obj )

}

export function createPool<T>( pool: Array<T> ): () => T {

	let count: Numerical = -1;
	let cycle: Numerical = pool.length

	return function objectPool() {

		count = ( count + 1 ) % cycle
		return pool[ count ];
	}

}