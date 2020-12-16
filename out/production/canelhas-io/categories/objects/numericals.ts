export type Numerical = () => number
export type Positive = () => Numerical
export type Bounded<Low = any, High = Low> = ( low, high ) => Bounded<typeof low, typeof high>

export type Value<T = any> = ( ...T ) => Value<typeof T>
export type Zero<T = any> = ( ...T ) => Zero<typeof T>

export type Infinite<T = any> = ( ...T ) => Infinite<typeof T>
