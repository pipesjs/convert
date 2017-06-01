// @flow

import type { ReadableStreamController } from "@pipes/core/streams";

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
 *   observable, writable;
 *
 * // Create test streams
 * writable = createTestWritable( i => output.push( i ));
 *
 * // Test the promise
 * return fromObservable( Observable.from( input ) )
 *   .pipeTo( writable );
 */

export default function fromObservable(observable: Observable): ReadableStream {
  let
    readableController: ReadableStreamController,
    readable: ReadableStream = new ReadableStream({
      start ( controller ) { readableController = controller; }
    });

  // TODO: Add backpressure support
  // Wire up stream with observable
  observable.subscribe({
    next: readableController && readableController.enqueue.bind( readableController ),
    error: readableController && readableController.error.bind( readableController ),
    complete: readableController && readableController.close.bind( readableController )
  });

  return readable;
}

// Browserify compat
if ( typeof module !== "undefined" )
  // $FlowFixMe
  module.exports = fromObservable;
