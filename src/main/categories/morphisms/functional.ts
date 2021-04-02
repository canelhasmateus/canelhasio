import type { Functor } from "../objects/functors";

export function identity<T>( obj: T ): T {
	return obj

}

export function compose<A, B, C>( f: Functor<A, B>, g: Functor<B, C> ): Functor<A, C> {
	return function composable( arg ) {
		return g( f( arg ) )
	}
}

export function spread<T, V>( base: T, merger: V ): T & V {
	return {
		...base,
		...merger
	}

}

export function assign<T, V>( base: T, merger: V ): T & V {
	return Object.assign( {}, base, merger )

}

export function mutate<T, V>( base: T, merger: V ): T & V {

	const newObj = {}

	for ( const attrname in base ) {
		// @ts-ignore
		newObj[ attrname ] = base[ attrname ];
	}

	for ( const attrname in merger ) {
		// @ts-ignore
		newObj[ attrname ] = merger[ attrname ];
	}

	return newObj as T & V
}
