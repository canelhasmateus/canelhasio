import type { ReferenceFrame } from "./position";
import type { Form, Transparency } from "./properties";
import type { Functor } from "./functors";


export type Measurement = {  }
export type Measurer = Functor<Measurement, String>
export type Conversor = Functor<Measurement, Measurement>


export type Place = ReferenceFrame
export type Displaceable = Object & Place;


export type Fade = Transparency
export type Fadable = Object & Fade


export type Shape = Form
export type Shapable = Object & Shape