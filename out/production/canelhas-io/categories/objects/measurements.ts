import type { ReferenceFrame } from "./position";
import type { Form, Transparency } from "./properties";

export type Pixel = string
export type Percentual = string
export type Admensional = string

export type Unit = Pixel | Percentual | Admensional
export type Measurer = ( value: Unit ) => string
export type Conversor = ( value: Unit ) => Unit


export type Place = ReferenceFrame
export type Displaceable = Object & Place;


export type Fade = Transparency
export type Fadable = Object & Fade


export type Shape = Form
export type Shapable = Object & Shape