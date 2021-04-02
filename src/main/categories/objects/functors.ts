export type Finish = () => void;
export type Functor<K = any, V = any> = ( arg: K ) => V
export type Composition<K, V> = Functor<Functor<K, any>, V>