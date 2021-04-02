import { add, complete, cycle, suite } from "benny";
import { identity } from "../../main/categories/morphisms/functional";
import { createPool, fromEntries, mapKeys, mapObject, mapValues } from "../../main/categories/morphisms/javascript";

const sampledAdd  = ( name, test ) => {
	return add( name, test, { minSamples: 100 } )
}
const obj         = { a: 1 }
const another     = { b: 2 }
const pool        = [ obj, another ]
const createdPool = createPool( pool )
const entries     = Object.entries( obj )
let baseline      = suite( "Javascript",


						   sampledAdd( "Map Keys", () => {
							   mapKeys( identity, obj )
						   } ),

						   sampledAdd( "Map Values", () => {

							   mapValues( identity, obj )
						   } ),

						   sampledAdd( "From Entries", () => {
							   fromEntries( entries )
						   } ),

						   sampledAdd( "Map Object", () => {
							   mapObject( identity, identity, obj )
						   } ),
						   sampledAdd( "Create Pool", () => {
							   createPool( pool )
						   } ),
						   sampledAdd( "Draw from Pool", () => {
							   createdPool()
						   } ),

						   cycle(),
						   complete(),
						   // save()
)


