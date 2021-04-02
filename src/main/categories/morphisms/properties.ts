import type { Displaceable, Fadable, Fade, Place, Shapable, Shape } from "../objects/measurements";
import { spread } from "./functional";

export function resize( element: Shapable, size: Shape ): Shapable {
	return spread( element, size )
}

export function displace( element: Displaceable, position: Place ): Displaceable {
	return spread( element, position )
}

export function fade( element: Fadable, fade: Fade ): Fadable {
	return spread( element, fade )

}
