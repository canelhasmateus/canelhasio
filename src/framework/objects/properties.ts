import type { Fade, Measurer, Place, Shape, Unit } from "../../categories/objects/measurements";
import type { Numerical } from "../../categories/objects/numericals";


export const defaultFadeIn: Fade    = { opacity: 90 as Numerical }
export const defaultFadeOut: Fade   = { opacity: 0 as Numerical }
export const defaultPosition: Place = { cx: 0 as Numerical, cy: 0 as Numerical }
export const defaultShapeIn: Shape  = { r: 15 as Numerical }
export const defaultShapeOut: Shape = { r: 30 as Numerical }


export const toPercent: Measurer = ( value: Unit ) => `${ value }%`
export const toPixels: Measurer  = ( value: Unit ) => `${ value }px`