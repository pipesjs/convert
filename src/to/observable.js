// @flow

import type { anyFn } from "@pipes/core/utils";
import type { ReadableStreamReader } from "@pipes/core/streams";

import Observable from "../shim/observable";
import { ReadableStream } from "@pipes/core/streams";

/**
 * This function takes any `ReadableStream` and returns an `Observable`
 * that emits chunks to `subscribers` when
 * they arrive.
 *
 * @example
 * let input = [1,2,3],
 *   output = [],
 *   readable;
 *
 * // Create test streams
 * readable = createTestReadable( input );
 *
 * // Test the promise
 * toObservable( readable )
 *   .subscribe({
 *       next (val) { output.push( val ); },
 *       complete () {
 *         assert.deepEqual( input, output );
 *       }
 *   });
 */

function observablePump ( stream, observer ) {
  let
    reader: ReadableStreamReader = stream.getReader();

    // Start pump
  pump();

  return _=> {
      reader.releaseLock();
      stream.cancel("Downstream observable cancelled");
  };

  function pump() {
    return reader.read().then( ({ value, done }) => {
      if ( done ) {
        return observer.complete();
      }

      // Enqueue and repeat
      observer.next( value );
      pump();
    });
  }
}

export default function toObservable(stream: ReadableStream): Observable {
  let
    pump: anyFn = observablePump.bind( null, stream ),
    observable: Observable = new Observable( pump );

  return observable;
}

// Browserify compat
if ( typeof module !== "undefined" )
  // $FlowFixMe
  module.exports = toObservable;
