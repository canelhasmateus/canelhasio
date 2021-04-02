import { add, complete, cycle, suite } from "benny";
import { createPool } from "../../main/categories/morphisms/javascript";
import { spring } from "svelte/motion";
import { readable, writable } from "svelte/store";
import { noop } from "svelte/internal";

const sampledAdd = ( name, test ) => {
	return add( name, test, { minSamples: 100 } )
}

const obj         = { a: 1 }
const another     = { b: 2 }
const pool        = [ { b: 3 }, { b: 4 } ]
const createdPool = createPool( pool )

const springable    = spring( obj, { precision: 0.9 } )
const writableStore = writable( another )
const readableStore = readable( obj, noop )
let baseline        = suite( "Store",


							 // sampledAdd( "Readable get", () => {
							 //  get( readableStore )
							 // } ),
							 //
							 // sampledAdd( "Writable get", () => {
							 //
							 //  get( writableStore )
							 // } ),
							 //
							 // sampledAdd( "Springable set", () => {
							 //  springable.set( obj )
							 // } ),

							 sampledAdd( "Writable set", () => {
								 writableStore.set( another )
							 } ),

							 sampledAdd( "Writable set new", () => {
								 writableStore.set( { b: 1 } )
							 } ),

							 sampledAdd( "Writable set from pool", () => {
								 writableStore.set( createdPool() )
							 } ),
							 //
							 // sampledAdd( "Springable get", () => {
							 //  get( springable )
							 // } ),
							 // sampledAdd( "Draw from Pool", () => {
							 //  createdPool()
							 // } ),

							 cycle(),
							 complete(),
							 // save()
)


