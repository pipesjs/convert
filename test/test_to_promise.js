import "babel-polyfill";
import assert from "assert";
import connect from "@pipes/core/connect";

import toPromise from "../src/to/promise";
import {
  createTestReadable,
  broker
} from "./utils";

suite("to/promise");

test("check promise", done => {
  let input = [1,2,3],
    output = [1,2,3],
    readable;

  // Create test streams
  readable = createTestReadable( input );

  // Test the promise
  toPromise( readable )
    .then( result => {
      assert.deepEqual( result, output );
      done();
    });
});
