import "babel-polyfill";
import assert from "assert";
import connect from "@pipes/core/connect";

import fromIterable from "../src/from/iterable";
import {
  createTestWritable,
  broker
} from "./utils";

suite("iterable");

let
  inputArray = [1,2,3,4,5],
  inputGenerator = function* gen() { yield* inputArray; },
  inputString = inputArray.join("");

test("check array", done => {
  let writable, res=[];

  // Create test streams
  writable = createTestWritable( c => res.push( c ));

  // End case
  broker.on(writable.signals.close, () => {
    // Make sure result array
    assert.deepEqual( res, inputArray );

    done();
  });

  // Connect the streams
  assert.doesNotThrow( () => {
    connect(
      fromIterable( inputArray ),
      writable
    );
  });
});

test("check string", done => {
  let writable, res=[];

  // Create test streams
  writable = createTestWritable( c => res.push( c ));

  // End case
  broker.on(writable.signals.close, () => {
    // Make sure result array
    assert.deepEqual( res, inputArray.map( String ) );

    done();
  });

  // Connect the streams
  assert.doesNotThrow( () => {
    connect(
      fromIterable( inputString ),
      writable
    );
  });
});

test("check generator", done => {
  let writable, res=[];

  // Create test streams
  writable = createTestWritable( c => res.push( c ));

  // End case
  broker.on(writable.signals.close, () => {
    // Make sure result array
    assert.deepEqual( res, inputArray );

    done();
  });

  // Connect the streams
  assert.doesNotThrow( () => {
    connect(
      fromIterable( inputGenerator() ),
      writable
    );
  });
});
