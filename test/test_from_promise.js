import "babel-polyfill";
import assert from "assert";
import connect from "@pipes/core/connect";

import fromPromise from "../src/from/promise";
import {
  createTestWritable,
  broker
} from "./utils";

suite("promise");

let
  input = 42;

test.only("check promise", done => {
  let promise = new Promise( resolve => resolve( input ) ),
    writable;

  // Create test streams
  writable = createTestWritable( c => assert.equal( c, input ));

  // End case
  broker.on( writable.signals.close, () => done() );

  // Connect the streams
  assert.doesNotThrow( () => {
    connect(
      fromPromise( promise ),
      writable
    );
  });
});
