import { identity } from "../../categories/morphisms/functional";

const obj     = { a: 1 }
const another = { b: 2 }


let i: number = 0;
let a;
for ( i; i <= 10000000; i++ ) {
	a = identity( i % 2 ? obj : another )
}