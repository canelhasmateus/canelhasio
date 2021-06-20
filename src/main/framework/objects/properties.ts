import type { Fade, Measurement, Measurer, Place, Shape } from "../../categories/objects/measurements"
import type { Numerical } from "../../categories/objects/numericals"
import type { Cartesian } from "../../categories/objects/position"


export const defaultFadeIn: Fade = { opacity: 90 as Numerical }
export const defaultFadeOut: Fade = { opacity: 0 as Numerical }
export const defaultPosition: Place = { x: 0 as Numerical, y: 0 as Numerical }
export const defaultShapeIn: Shape = { r: 15 as Numerical }
export const defaultShapeOut: Shape = { r: 30 as Numerical }


export const toPercent: Measurer = ( value: Measurement & Numerical ) => `${ value }%`
export const toPixels: Measurer = ( value: Measurement & Numerical ) => `${ value }px`
export const toTranslate: Measurer = ( value: Measurement & Cartesian ) => `transform: translate(${ value.x }px,${ value.y }px)`
