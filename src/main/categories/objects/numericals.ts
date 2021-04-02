export type Numerical = number
export type Positive = () => Numerical
export type Bounded<Low = any, High = Low> = ( low, high ) => Bounded<typeof low, typeof high>


export type Value<T> = ( T ) => Value<T>
export type Zero<T> = ( T ) => Zero<T>
export type Infinite<T> = ( T ) => Infinite<T>
