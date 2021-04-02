import type { Numerical } from "./numericals";

export type Cartesian = {

	readonly x: Numerical
	readonly y: Numerical

}

export type Polar = {

	readonly r: Numerical
	readonly theta: Numerical

}

export type ReferenceFrame = Cartesian | Polar | {}
