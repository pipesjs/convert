"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fromIterable;

var _streams = require("@pipes/core/streams");

var _pipe = require("@pipes/core/pipe");

var _pipe2 = _interopRequireDefault(_pipe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [runIterator].map(regeneratorRuntime.mark);

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
function runIterator(iterable) {
  return regeneratorRuntime.wrap(function runIterator$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.delegateYield(iterable, "t0", 1);

        case 1:
          return _context.abrupt("return", _pipe2.default.eos);

        case 2:
        case "end":
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

function fromIterable(iterable) {

  var stream = new _pipe2.default(runIterator.bind(null, iterable), {
    init: null
  });

  return stream.readable;
}

// Browserify compat
if (typeof module !== "undefined")
  // $FlowFixMe
  module.exports = fromIterable;