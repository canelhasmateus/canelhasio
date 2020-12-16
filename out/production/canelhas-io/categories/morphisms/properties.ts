import type { Displaceable, Fadable, Fade, Place, Shapable, Shape } from "../objects/measurements";
import { mergeObjects } from "./javascript";

export function resize( element: Shapable, size: Shape ): Shapable {
	return mergeObjects( element, size )
}

export function displace( element: Displaceable, position: Place ): Displaceable {
	return mergeObjects( element, position )
}

export function fade( element: Fadable, fade: Fade ): Fadable {
	return mergeObjects( element, fade )

}
