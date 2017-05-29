"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fromPromise;

var _streams = require("@pipes/core/streams");

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

function fromPromise(promise) {
  var stream = new _streams.ReadableStream({
    start: function start(controller) {
      promise.then(function (value) {
        controller.enqueue(value);
        controller.close();
      }).catch(function (error) {
        return controller.error(error);
      });
    }
  });

  return stream;
}

// Browserify compat
if (typeof module !== "undefined")
  // $FlowFixMe
  module.exports = fromPromise;