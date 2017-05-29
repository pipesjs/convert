// @flow

import type { ReadableStreamController } from "@pipes/core/streams";
import { ReadableStream } from "@pipes/core/streams";

/**
 * This function takes any promise and returns a readable stream
 * that queues the resolved value or errors on rejection.
 *
 * @example
 * let
 *   input = 42;
 *   promise = new Promise( resolve => resolve( input ) ),
 *   writable;
 *
 * // Create test streams
 * writable = createTestWritable( c => assert.equal( c, input ));
 *
 * connect(
 *   fromPromise( promise ),
 *   writable
 * ); // 42
 */

export default function fromPromise<T>(promise: Promise<T>): ReadableStream {
  let
    stream: ReadableStream = new ReadableStream({
      start ( controller: ReadableStreamController ) {
        promise
          .then( (value: T) => {
            controller.enqueue( value );
            controller.close();
          })
          .catch( error => controller.error( error ));
      }
    });

  return stream;
}

// Browserify compat
if ( typeof module !== "undefined" )
  // $FlowFixMe
  module.exports = fromPromise;
