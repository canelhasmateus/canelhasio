import type { Displaceable, Fadable, Fade, Place, Shapable, Shape } from "../objects/measurements";
import { merge } from "./functional";

export function resize( element: Shapable, size: Shape ): Shapable {
	return merge( element, size )
}

export function displace( element: Displaceable, position: Place ): Displaceable {
	return merge( element, position )
}

export function fade( element: Fadable, fade: Fade ): Fadable {
	return merge( element, fade )

}
