import "babel-polyfill";
import assert from "assert";
import connect from "@pipes/core/connect";

import Observable from "../src/shim/observable";

import toObservable from "../src/to/observable.js";

import {
  createTestReadable,
  broker
} from "./utils";

suite("to/observable");

test("check promise", done => {
  let input = [1,2,3],
    output = [],
    readable;

  // Create test streams
  readable = createTestReadable( input );

  // Test the promise
  toObservable( readable )
    .subscribe({
        next (val) { output.push( val ); },
        complete () {
          assert.deepEqual( input, output );
          done();
        }
    });
});
