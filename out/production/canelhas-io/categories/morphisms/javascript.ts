export type Morphism<T, K = any> = ( value: T ) => ( K )
export type IsoMorphism<T> = Morphism<T, T>

export function identity<T>( obj: T ): T {
	return obj
}

const a : Morphism<number,number> = identity(2);

export function toEntries( obj ) {

	return Object.entries( obj ).map( ( [ key, value ], i ) => [ key, value ] )

}


export function fromEntries( arr: ArrayLike<any> ): Object {
	return Object.assign( {},
						  ...Array.from( arr,
										 ( [ k, v ] ) => ( { [ k ]: v } )
						  )
	);

}

export function mapObject<T, K, V, k in T, v = T[k]>
( obj: T, keyFn: Morphism<k, K> = identity, valueFn: Morphism<v, V> = identity ): {
	return fromEntries( toEntries( obj ).map(
	( key, value ) => ( [ keyFn( key ), valueFn( value ) ] ) )

}

export function mergeObjects<T, V>( base: T, property: V ): T & V {

	return {
		...base,
		...property
	}

}
