import "babel-polyfill";
import assert from "assert";
import connect from "@pipes/core/connect";

import Observable from "../src/shim/observable";

import fromObservable from "../src/from/observable.js";

import {
  createTestWritable,
  broker
} from "./utils";

suite("from/observable");

test("check observable", done => {
  let input = [1,2,3],
    output = [],
    writable;

  // Create test streams
  writable = createTestWritable( i => output.push( i ));

  // Test the promise
  return fromObservable( Observable.from( input ) )
    .pipeTo( writable )
    .then( _ => {
      assert.deepEqual( input, output );
      done();
    });
});
