// @flow

import { ReadableStream, TransformStream } from "@pipes/core/streams";
import pipe from "@pipes/core/pipe";

/**
 * This function takes an iterable and returns a readable stream
 * that queues the iterated values sequentially.
 *
 * @example
 * let
 *   input = [1,2,3,4,5],
 *   // input = function* gen() { yield* input; },
 *   // input = input.join("");
 *
 * let writable, res=[];
 *
 * // Create test streams
 * writable = createTestWritable( c => res.push( c ));
 *
 * // Connect the streams
 * connect(
 *   fromIterable( input ),
 *   writable
 * ); // res == input
 */
export default function fromIterable<T>(iterable: Iterable<T>): ReadableStream {

  let stream: TransformStream = new pipe(
    runIterator.bind( null, iterable ), {
      init: null
    });

  return stream.readable;

}

function* runIterator( iterable: Iterable<any> ) {
  yield* iterable;
  return pipe.eos;
}

// Browserify compat
if ( typeof module !== "undefined" )
  // $FlowFixMe
  module.exports = fromIterable;
