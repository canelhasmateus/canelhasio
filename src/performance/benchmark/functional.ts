import { add, complete, cycle, suite } from "benny";
import { assign, compose, identity, mutate, spread } from "../../main/categories/morphisms/functional";

const sampledAdd = ( name, test ) => {
	return add( name, test, { minSamples: 100 } )
}
const obj        = { a: 1 }
const another    = { b: 2 }

let baseline = suite( "Functionals",

					  sampledAdd( "Identity", () => {
						  identity( obj )
					  } ),

					  sampledAdd( "Compose", () => {
						  compose( identity, identity )( obj )
					  } ),

					  sampledAdd( "Spread", () => {
						  spread( obj, another )
					  } ),

					  sampledAdd( "Assign", () => {

						  assign( obj, another )
					  } ),

					  sampledAdd( "Mutate", () => {
						  mutate( obj, another )
					  } ),

					  cycle(),
					  complete(),
					  // save()
)


