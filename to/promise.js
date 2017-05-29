"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toPromise;

var _streams = require("@pipes/core/streams");

var _accumulate = require("@pipes/core/accumulate");

var _accumulate2 = _interopRequireDefault(_accumulate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

function reducer(array, value) {
  array.unshift(value);
  return array;
}

function toPromise(stream) {
  var accumulator = new _accumulate2.default(reducer, []),
      readable = stream.pipeThrough(accumulator),


  // Get new stream's reader
  reader = readable.getReader();

  // Wait for stream to finish
  return reader.read().then(function (_ref) {
    var value = _ref.value;

    reader.releaseLock();

    // Preserve arrival order
    return value.reverse();
  });
}

// Browserify compat
if (typeof module !== "undefined")
  // $FlowFixMe
  module.exports = toPromise;