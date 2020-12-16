import type { Functor } from "../objects/functors";

export function identity<T>( obj: T ): T {
	return obj

}

export function compose<A, B, C>( f: Functor<A, B>, g: Functor<B, C> ): Functor<A, C> {
	return ( arg ) => {
		return g( f( arg ) )
	}
}

export function merge<T, V>( base: T, merger: V ): T & V {
	return {
		...base,
		...merger
	}

}


