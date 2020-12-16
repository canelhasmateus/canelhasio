import type { Numerical } from "./numericals";

export type Opacity = {

	readonly opacity: Numerical

}

export type Transparency = Opacity | {}

export type Retangular = {

	readonly width: Numerical
	readonly lenght: Numerical

}

export type Circular = {
	readonly radius: Numerical

}

export type Ratio = {
	readonly scale: Numerical
}

export type Form = Retangular | Circular | Ratio | {}