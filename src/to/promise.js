// @flow

import type { ReadableStreamReader } from "@pipes/core/streams";

import { ReadableStream, TransformStream } from "@pipes/core/streams";
import accumulate from "@pipes/core/accumulate";

/**
 * This function takes any `ReadableStream` and returns a promise
 * that resolves with an `Array` of the stream's contents when
 * the stream closes.
 *
 * @example
 * let input = [1,2,3],
 *   output = [1,2,3],
 *   readable;
 *
 * // Create test streams
 * readable = createTestReadable( input );
 *
 * // Test the promise
 * toPromise( readable )
 *   .then( result => {
 *     assert.deepEqual( result, output );
 *     done();
 *   });
 */

export default function toPromise<T>(stream: ReadableStream): Promise<Array<T>> {
  let
    accumulator: TransformStream = new accumulate( reducer, [] ),
    readable: ReadableStream = stream.pipeThrough( accumulator ),

    // Get new stream's reader
    reader: ReadableStreamReader = readable.getReader();

    // Wait for stream to finish
    return reader.read().then( ({ value }) => {
      reader.releaseLock();

      // Preserve arrival order
      return value.reverse();
    });
}

function reducer( array: Array<any>, value: ?mixed ): Array<any> {
  array.unshift( value );
  return array;
}

// Browserify compat
if ( typeof module !== "undefined" )
  // $FlowFixMe
  module.exports = toPromise;
