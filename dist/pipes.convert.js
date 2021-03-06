(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromPromise = exports.fromObservable = exports.fromIterable = undefined;

var _core = require("@pipes/core");

var _core2 = _interopRequireDefault(_core);

var _iterable = require("./iterable");

var _iterable2 = _interopRequireDefault(_iterable);

var _observable = require("./observable");

var _observable2 = _interopRequireDefault(_observable);

var _promise = require("./promise");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Exports
exports.fromIterable = _iterable2.default;
exports.fromObservable = _observable2.default;
exports.fromPromise = _promise2.default;

// Default exports

var fns = {
  fromIterable: _iterable2.default,
  fromObservable: _observable2.default,
  fromPromise: _promise2.default
};

exports.default = fns;
},{"./iterable":2,"./observable":3,"./promise":4,"@pipes/core":10}],2:[function(require,module,exports){
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
function fromIterable(iterable) {

  var stream = new _pipe2.default(runIterator.bind(null, iterable), {
    init: null
  });

  return stream.readable;
}

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

// Browserify compat
if (typeof module !== "undefined")
  // $FlowFixMe
  module.exports = fromIterable;
},{"@pipes/core/pipe":12,"@pipes/core/streams":17}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fromObservable;

var _observable = require("../shim/observable");

var _observable2 = _interopRequireDefault(_observable);

var _streams = require("@pipes/core/streams");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

function fromObservable(observable) {
  var readableController = void 0,
      readable = new _streams.ReadableStream({
    start: function start(controller) {
      readableController = controller;
    }
  });

  // TODO: Add backpressure support
  // Wire up stream with observable
  observable.subscribe({
    next: readableController && readableController.enqueue.bind(readableController),
    error: readableController && readableController.error.bind(readableController),
    complete: readableController && readableController.close.bind(readableController)
  });

  return readable;
}

// Browserify compat


if (typeof module !== "undefined")
  // $FlowFixMe
  module.exports = fromObservable;
},{"../shim/observable":22,"@pipes/core/streams":17}],4:[function(require,module,exports){
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
},{"@pipes/core/streams":17}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromPromise = exports.fromObservable = exports.fromIterable = exports.toPromise = exports.toObservable = undefined;

var _core = require("@pipes/core");

var _core2 = _interopRequireDefault(_core);

var _from = require("./from");

var _to = require("./to");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Exports
exports.toObservable = _to.toObservable;
exports.toPromise = _to.toPromise;
exports.fromIterable = _from.fromIterable;
exports.fromObservable = _from.fromObservable;
exports.fromPromise = _from.fromPromise;

// Default exports

var fns = {
  toObservable: _to.toObservable,
  toPromise: _to.toPromise,
  fromIterable: _from.fromIterable,
  fromObservable: _from.fromObservable,
  fromPromise: _from.fromPromise
};

// Export to window
if (typeof window !== "undefined") {
  window.Pipes = window.Pipes || _core2.default;
  window.Pipes.convert = window.Pipes.convert || {};
  Object.assign(window.Pipes.convert, fns);
}

exports.default = fns;
},{"./from":1,"./to":23,"@pipes/core":10}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = accumulate;

var _streams = require("./streams");

var _utils = require("./utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var compatibilityError = "\n    accumulate takes a reducing function\n  ";

/**
 * This function takes a reducer function and an optional initial value and
 * returns a transformstream that accumulates the values of any stream piped to it.
 *
 * @param {function} reducer a function that takes sequential values and reduces them
 *
 * @returns {TransformStream} a ReadableWritable that consumes piped
 * stream, combining the values with the reducer and enqueues the result.
 *
 * @example
 * let readable, accumulator, accumulated, total;
 *
 *   // Create streams
 *   readable = createTestReadable( [1,2,3] );
 *
 *   // Connect the streams
 *   accumulator = accumulate( (a, b) => a+b, 4 );
 *   accumulated = readable.pipeThrough( new accumulator );    // 10
 */
function accumulate(reducer, init) {
  // check if reducer is a function
  if (!(0, _utils.isFunction)(reducer)) throw new Error(compatibilityError);

  var ReadableWritableBlueprint = function ReadableWritableBlueprint() {
    _classCallCheck(this, ReadableWritableBlueprint);

    // Init
    var result = init,
        readable = void 0,
        writable = void 0,
        done = void 0,
        resolved = void 0,
        rejected = void 0,
        cancelled = false;

    // Create done promise
    done = new Promise(function (resolve, reject) {
      resolved = resolve;
      rejected = reject;
    });

    // writable
    writable = new _streams.WritableStream({
      start: function start(err) {
        // Reject if error
        done.catch(rejected);
      },
      write: function write(chunk) {
        // if init not passed, set result as chunk
        if (result === void 0) {
          result = chunk;
          return;
        }

        // else, reduce and set result
        result = reducer(result, chunk);
      },
      close: function close() {
        resolved(result);
      },


      abort: rejected
    });

    // readable
    readable = new _streams.ReadableStream({
      start: function start(controller) {

        // Chain enqueue and done
        var finished = done.then(
        // Enqueue value if stream not cancelled
        function (val) {
          if (!cancelled) controller.enqueue(val);
        }, controller.error.bind(controller));

        // Close when finished
        finished.then(controller.close.bind(controller));
      },
      cancel: function cancel(reason) {
        // Set flag
        cancelled = true;

        // Close writable
        writable && writable.close();

        // Resolve promise
        resolved(reason);
      }
    });

    // Return { readable, writable } pair
    Object.assign(this, {
      readable: readable, writable: writable
    });
  };

  // Return ReadableWritable blueprint if not instance


  if (this instanceof accumulate) return new ReadableWritableBlueprint();else return ReadableWritableBlueprint;
}

// Browserify compat
if (typeof module !== "undefined")
  // $FlowFixMe
  module.exports = accumulate;
},{"./streams":17,"./utils":18}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = chain;

var _connect2 = require("./connect");

var _utils = require("./utils");

var compatibilityError = "\n    Only transform streams and readable-writable pairs can be chained\n  ";

/**
 * This function takes one or more transform streams / { readable, writable } pairs
 * connects them to each other. Then takes the readable of the end and the writable
 * of the head and returns the { readable, writable } pair that is
 * compatible with `ReadableStream::pipeThrough`.
 *
 * @example
 * // Pure funtion example
 * let negator = pipe( n => -n ),
 *   doubler = pipe( n => 2*n ),
 *   composed = chain( new negator, new doubler ),
 *   rIn = createReadable(),
 *   rOut;
 *
 * rOut = rIn.pipeThrough( composed );  // -2, -4, -6
 */


function chain(origin) {

  // Check that origin is a transform stream / { readable, writable }
  if (!(0, _utils.isTransform)(origin)) throw new Error(compatibilityError);

  // connect the streams

  for (var _len = arguments.length, streams = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    streams[_key - 1] = arguments[_key];
  }

  var writable = origin.writable,
      readable = _connect2._connect.apply(undefined, [origin].concat(streams));

  // Check if null stream
  if (!(0, _utils.isReadable)(readable)) throw new Error(compatibilityError);

  // return readable-writable pair
  return {
    readable: readable,
    writable: writable
  };
}

// Browserify compat
if (typeof module !== "undefined")
  // $FlowFixMe
  module.exports = chain;
},{"./connect":8,"./utils":18}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._connect = undefined;
exports.default = connect;

var _streams = require("./streams");

var _utils = require("./utils");

/**
 * This function takes any number of `transform streams` with an optional `readable` at the head and a `writable` at the tail.
 * It connects them together by applying `pipeThrough` recursively and returns the resulting `readable` that acts as a composition of the input `streams`.
 *
 * In case, a `writable` is passed at the tail, the resulting `readable` is `pipeTo`d and the resulting `promise` is returned.
 *
 * @example
 * let readable = createReadable(),
 *   writable = createWritable(),
 *   passThrough = pipe( k => k );
 *
 * let promise = connect( readable, passThrough, writable );   // 1, 2, 3
 */
function connect(origin) {

  // Check origin
  if (!origin) throw new Error("No streams passed");

  var sink = void 0,
      end = void 0;

  // Get the last stream

  for (var _len = arguments.length, streams = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    streams[_key - 1] = arguments[_key];
  }

  sink = streams.pop();

  // if origin is a transform$, take it's readable part
  if (origin instanceof _streams.ReadableStream) {
    end = origin;
  } else {
    end = origin.readable;
  }

  // Connect the streams
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = streams[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var stream = _step.value;


      // Check for transform streams
      if (!(0, _utils.isTransform)(stream)) throw new Error("Only transform streams allowed in the center");

      // piping through a transform returns it's readable part
      end = end.pipeThrough(stream);
    }

    // Handle sink
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  if ((0, _utils.isWritable)(sink)) end = end.pipeTo(sink);else if ((0, _utils.isTransform)(sink)) end = end.pipeThrough(sink);else throw new Error("Only writable and transform streams allowed at the end.");

  // Return result
  return end;
}

// FIXME: Internal flow.js resolution problem workaround


var _connect = exports._connect = connect;
connect._connect = connect;

// Browserify compat
if (typeof module !== "undefined")
  // $FlowFixMe
  module.exports = connect;
},{"./streams":17,"./utils":18}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = flatten;

var _streams = require("./streams");

var _utils = require("./utils");

/**
 * This function takes one or more streams and returns a readable combining
 * the streams, returning chunks as they arrive in combined streams.
 *
 * @example
 * let r1 = createReadable([1,2,3]),
 *   r2 = createReadable([4,5,6]),
 *   writable = createWritable(),
 *   flattened = flatten(r1,r2);
 *
 * flattened.pipeTo( writable );   // 1,4,2,5,3,6   (order depends on order received so may vary)
 */
function flatten() {
  for (var _len = arguments.length, streams = Array(_len), _key = 0; _key < _len; _key++) {
    streams[_key] = arguments[_key];
  }

  var flattenedStream = void 0,
      writers = [];

  return flattenedStream = new _streams.ReadableStream({
    start: function start(controller) {

      // Create writers for each stream
      while (writers.length < streams.length) {
        writers.push(new _streams.WritableStream({
          // write incoming to flattenedStream
          write: controller.enqueue.bind(controller)
        }));
      } // Connect streams to writers
      var connect = function connect(r, w) {
        return r.pipeTo(w);
      },
          pipedAll = void 0;

      try {
        pipedAll = (0, _utils.zipWith)(connect, streams, writers);
      } catch (e) {
        throw new Error("Only readable streams can be flattened.");
      }

      // Set up closing
      return Promise.all(pipedAll).then(controller.close.bind(controller), controller.error.bind(controller));
    },
    cancel: function cancel() {
      // If cancelled, cancel all streams
      streams.forEach(function (stream) {
        return stream.cancel();
      });
    }
  });
}

;

// Browserify compat
if (typeof module !== "undefined")
  // $FlowFixMe
  module.exports = flatten;
},{"./streams":17,"./utils":18}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.split = exports.pipe = exports.merge = exports.flatten = exports.chain = exports.connect = exports.accumulate = undefined;

var _accumulate = require("./accumulate");

var _accumulate2 = _interopRequireDefault(_accumulate);

var _connect = require("./connect");

var _connect2 = _interopRequireDefault(_connect);

var _chain = require("./chain");

var _chain2 = _interopRequireDefault(_chain);

var _flatten = require("./flatten");

var _flatten2 = _interopRequireDefault(_flatten);

var _merge = require("./merge");

var _merge2 = _interopRequireDefault(_merge);

var _pipe = require("./pipe");

var _pipe2 = _interopRequireDefault(_pipe);

var _split = require("./split");

var _split2 = _interopRequireDefault(_split);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Exports
exports.accumulate = _accumulate2.default;
exports.connect = _connect2.default;
exports.chain = _chain2.default;
exports.flatten = _flatten2.default;
exports.merge = _merge2.default;
exports.pipe = _pipe2.default;
exports.split = _split2.default;

// Default exports

var fns = {
  accumulate: _accumulate2.default,
  connect: _connect2.default,
  chain: _chain2.default,
  flatten: _flatten2.default,
  merge: _merge2.default,
  pipe: _pipe2.default,
  split: _split2.default
};

// Export to window
if (typeof window !== "undefined") Object.assign(window, {
  Pipes: fns
});

exports.default = fns;
},{"./accumulate":6,"./chain":7,"./connect":8,"./flatten":9,"./merge":11,"./pipe":12,"./split":16}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._merge = undefined;
exports.default = merge;

var _streams = require("./streams");

// Parses arrays of {value, done} pairs to final pair
function parseResults(results) {
  var ended = false,
      values = [];

  // Accumulate values
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = results[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var result = _step.value;

      if (result == null) break;

      var value = result.value,
          done = result.done;

      ended = ended || done;
      values.push(value);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return {
    value: values,
    done: ended
  };
}

/**
 * This function takes one or more streams and returns a readable combining
 * the streams, such that it gathers chunks from all streams into an array and
 * then pushes them onto the combined stream, by waiting for all streams to
 * have pushed a chunk.
 *
 * @example
 * let r1 = createReadable([1,2,3]),
 *   r2 = createReadable([4,5,6,7]),
 *   writable = createWritable(),
 *   merged = merge(r1,r2);
 *
 * merged.pipeTo( writable );   // [1,4], [2,5], [3,6]
 */

function merge() {
  for (var _len = arguments.length, streams = Array(_len), _key = 0; _key < _len; _key++) {
    streams[_key] = arguments[_key];
  }

  var readers = void 0,
      mergedStream = void 0,
      merger = void 0;

  // Get readers
  try {
    readers = streams.map(function (stream) {
      return stream.getReader();
    });

    // Check for transform streams
  } catch (e) {

    throw new Error("Only ReadableStreams can be flattened");
  }

  // Merging function
  merger = function merger(controller) {
    var
    // Get read promises
    promises = readers.map(function (r) {
      return r.read();
    }),
        merged = void 0,
        push = void 0;

    // Read values and push them onto the stream
    push = function push(obj) {
      var value = obj.value,
          done = obj.done;


      if (done) return controller.close();

      controller.enqueue(value);
      return obj;
    };

    // Combine values into an array
    merged = Promise.all(promises).then(parseResults).then(push, controller.error.bind(controller));

    return merged;
  };

  return mergedStream = new _streams.ReadableStream({
    start: merger,
    pull: merger,

    cancel: function cancel() {
      // If cancelled, cancel all streams
      streams.forEach(function (stream) {
        return stream.cancel();
      });
    }
  });
};

// FIXME: Internal flow.js resolution problem workaround
var _merge = exports._merge = merge;
merge._merge = merge;

// Browserify compat
if (typeof module !== "undefined")
  // $FlowFixMe
  module.exports = merge;
},{"./streams":17}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pipe;

var _utils = require("./utils");

var _pipeAsync = require("./pipeAsync");

var _pipeAsync2 = _interopRequireDefault(_pipeAsync);

var _pipeFn = require("./pipeFn");

var _pipeFn2 = _interopRequireDefault(_pipeFn);

var _pipeGen = require("./pipeGen");

var _pipeGen2 = _interopRequireDefault(_pipeGen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This function takes any normal/generator func and returns a transform stream.
 * @param {function} fn a function or a generator that returns transformed values
 * @param {object} opts containing config options
 *
 * @returns {TransformStream}
 *
 * @example
 *   // Pure funtion example
 *   let negator = pipe( n => -n ),
 *     rIn = createReadable(),
 *     rOut;
 *
 *   rOut = rIn.pipeThrough( new negator );  // -1, -2, -3
 *
 *   // Basic generator example
 *   let doubler = pipe( function* (v) {
 *       yield v;
 *       yield v;
 *   }),
 *   rIn = createReadable(),
 *   rOut;
 *
 *   rOut = rIn.pipeThrough( new doubler );  // 1, 1, 2, 2, 3, 3
 *
 * @example
 *   // Infinite generator example
 *
 *   let inf = pipe( function* (v) {
 *       // Close on shutdown signal
 *       while( !( yield v ));
 *   }, {
 *       init: 1
 *   });
 *
 *   new inf;    // 1, 1, 1, 1...
 */
function pipe(fn, opts) {
  var blueprint = void 0;

  // Route to appropriate function
  if ((0, _utils.isGeneratorFn)(fn)) blueprint = (0, _pipeGen2.default)(fn, opts);else if ((0, _utils.isFunction)(fn)) blueprint = (0, _pipeFn2.default)(fn, opts);else throw new Error("Invalid argument");

  // Return Transform blueprint if not instance
  if (this instanceof pipe) return new blueprint();else return blueprint;
}

/**
 * This function takes any async func and returns a transform stream.
 * @name pipe.async
 * @param {function} asyncFunction an async function that returns a Promise
 * @param {object} opts containing config options
 *
 * @returns TransformStream
 *
 * @example
 * // Basic async example
 * let serverTalker = pipe.async( async function (msg) {
 *     let response = await sendToServer( msg );
 *     return response;
 *   }),
 *   rIn = createReadable(),
 *   rOut;
 *
 * rOut = rIn.pipeThrough( new serverTalker );  // {response}, {response}, {response}
 *
 * @example
 * // Basic promise example
 * let serverTalker = pipe.async( function (msg) {
 *     let response = new Promise( resolve => {
 *       sendToServer( msg, resolve );
 *     });
 *     return response;
 *   }),
 *   rIn = createReadable(),
 *   rOut;
 *
 * rOut = rIn.pipeThrough( new serverTalker );  // {response}, {response}, {response}
 */
pipe.async = _pipeAsync2.default;

/**
 * "End of Stream" This is the equivalent of `EOF` char in UNIX systems, if a `pipe` `function` returns
 * this at any point, the streams are gracefully closed.
 *
 * @name pipe.eos
 * @example
 */
pipe.eos = _utils.EOS;

// Browserify compat
if (typeof module !== "undefined") module.exports = pipe;
},{"./pipeAsync":13,"./pipeFn":14,"./pipeGen":15,"./utils":18}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pipeAsync;

var _streams = require("./streams");

var _utils = require("./utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// pipeAsync :: Async Function -> Opts {} -> TransformBlueprint
// pipeAsync takes an async function and wraps it into
// a transform streams. Waits till completion, before enqueuing.
//
// Returns a blueprint class that can be used to
// instantiate above streams.
//

function pipeAsync(fn) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      init = _ref.init,
      readableStrategy = _ref.readableStrategy,
      writableStrategy = _ref.writableStrategy;

  // Prepare transformer
  var transformer = {
    // Store awaiting functions
    _unfulfilledFutures: [],

    // Run function and enqueue result
    transform: function transform(chunk, controller) {
      // Run async fn
      var future = fn(chunk),
          condEnqueue = function condEnqueue(v) {

        // Check for EOS
        if (v === _utils.EOS) {
          controller.close();
          return;
        }

        if (v !== void 0) controller.enqueue(v);
      },


      // Get index of current future
      findex = transformer._unfulfilledFutures.length;

      // Add to executing futures list
      transformer._unfulfilledFutures.push(future);

      // Proceed to enqueue
      future.then(condEnqueue, function () {
        // Signal error to stream
        throw new Error();
      })

      // Remove itself from the _unfulfilledFutures list
      .then(function () {
        return transformer._unfulfilledFutures.splice(findex, 1);
      });

      return future;
    },
    flush: function flush(controller) {
      var condEnqueue = function condEnqueue(v) {
        if (v !== void 0) controller.enqueue(v);
      };

      // Check if anything is left
      Promise.all(transformer._unfulfilledFutures).then(function (vs) {
        return vs.map(condEnqueue);
      });
    },


    // if passed
    readableStrategy: readableStrategy,
    writableStrategy: writableStrategy
  };

  // Wrap in blueprint class

  var TransformBlueprint = function (_TransformStream) {
    _inherits(TransformBlueprint, _TransformStream);

    function TransformBlueprint() {
      var _this, _ret;

      _classCallCheck(this, TransformBlueprint);

      // Make stream
      var stream = (_this = _possibleConstructorReturn(this, (TransformBlueprint.__proto__ || Object.getPrototypeOf(TransformBlueprint)).call(this, transformer)), _this),
          writer = void 0;

      // If init, push chunk
      if (init !== void 0) {
        writer = stream.writable.getWriter();
        writer.write(init);

        // Release lock so other writers can start writing
        writer.releaseLock();
      }

      return _ret = stream, _possibleConstructorReturn(_this, _ret);
    }

    return TransformBlueprint;
  }(_streams.TransformStream);

  // Return Transform blueprint if not instance


  if (this instanceof pipeAsync) return new TransformBlueprint();else return TransformBlueprint;
}
},{"./streams":17,"./utils":18}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pipeFn;

var _streams = require("./streams");

var _utils = require("./utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// pipeFn :: Function -> Opts {} -> TransformBlueprint
// pipeFn takes a function and wraps it into
// a transform streams.
// Returns a blueprint class that can be used to
// instantiate above streams.
//

function pipeFn(fn) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      init = _ref.init,
      readableStrategy = _ref.readableStrategy,
      writableStrategy = _ref.writableStrategy;

  // Prepare transformer
  var transformer = {
    _unfulfilledFutures: [],
    // Run function and enqueue result
    transform: function transform(chunk, controller) {
      var v = fn(chunk);

      // Check for EOS
      if (v === _utils.EOS) {
        controller.close();
        return;
      }

      if (v !== void 0) controller.enqueue(v);
    },


    // if passed
    readableStrategy: readableStrategy,
    writableStrategy: writableStrategy
  };

  // Wrap in blueprint class

  var TransformBlueprint = function (_TransformStream) {
    _inherits(TransformBlueprint, _TransformStream);

    function TransformBlueprint() {
      var _this, _ret;

      _classCallCheck(this, TransformBlueprint);

      // Make stream
      var stream = (_this = _possibleConstructorReturn(this, (TransformBlueprint.__proto__ || Object.getPrototypeOf(TransformBlueprint)).call(this, transformer)), _this),
          writer = void 0;

      // If init, push chunk
      if (init !== void 0) {
        writer = stream.writable.getWriter();
        writer.write(init);

        // Release lock so other writers can start writing
        writer.releaseLock();
      }

      return _ret = stream, _possibleConstructorReturn(_this, _ret);
    }

    return TransformBlueprint;
  }(_streams.TransformStream);

  return TransformBlueprint;
}
},{"./streams":17,"./utils":18}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pipeGen;

var _streams = require("./streams");

var _utils = require("./utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// pipeGen :: Generator Function -> Opts {} -> ReadableWritableBlueprint
// pipeGen takes a generator function and wraps it into
// a transform streams. Waits till completion, before enqueuing.
// All yields are enqueued, back-pressure is respected and
// the generator paused if queue getting back-pressured.
//
// Returns a blueprint class that can be used to
// instantiate above streams.
//

var readyEvt = (0, _utils.uuid)(),
    closedProp = (0, _utils.uuid)();

// Pump function that runs the generator and adds produced values
// to the transform stream.
function pump(gen, controller, resolve) {

  // Clear queue
  _utils.events.off(readyEvt);

  // Check stream state
  var backpressure = controller.desiredSize <= 0;

  // Wait for backpressure to ease
  if (backpressure) {
    return _utils.events.on(readyEvt, function () {
      pump(gen, controller, resolve);
    });
  }

  // Ready? proceed

  // Check readable status
  var step = controller[closedProp] ? gen.return(true) : gen.next(false),
      done = step.done,
      value = step.value;

  // Check for EOS and enqueue
  if (value === _utils.EOS) {
    controller.close();
    done = true;
  } else {
    // Enqueue
    controller.enqueue(value);
  }

  // Generator exhausted? resolve promise
  if (done) {
    return resolve && resolve();
  }

  // Else rinse, repeat
  return pump(gen, controller, resolve);
}

function pipeGen(fn) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      init = _ref.init,
      readableStrategy = _ref.readableStrategy,
      writableStrategy = _ref.writableStrategy;

  return function ReadableWritableBlueprint() {
    _classCallCheck(this, ReadableWritableBlueprint);

    // Init
    var readable = void 0,
        writable = void 0,
        readableReady = void 0,
        readableReady_resolve = void 0,
        readableController = void 0;

    // create promise that awaits both streams to start
    readableReady = new Promise(function (resolve) {
      readableReady_resolve = resolve;
    });

    // writable
    writable = new _streams.WritableStream({
      start: function start() {
        return readableReady;
      },
      write: function write(chunk, controller) {
        var promise = void 0,
            _resolve = void 0;

        promise = new Promise(function (resolve) {
          _resolve = resolve;
        });

        // Start pump
        var gen = fn(chunk);
        pump(gen, readableController, _resolve);

        return promise;
      },
      close: function close() {
        // Close readable stream
        try {
          readableController.close();
        } catch (e) {
          if (e instanceof TypeError) {
            // Oops, closed already. Ignore
          } else {
            throw e;
          }
        } finally {
          // Signal generator to stop
          readableController[closedProp] = true;
        }
      }
    }, writableStrategy);

    // readable
    readable = new _streams.ReadableStream({
      start: function start(controller) {
        readableController = controller;
        readableController[closedProp] = false;

        // Signal writable to start
        readableReady_resolve();
      },
      pull: function pull() {
        _utils.events.trigger(readyEvt);
      },
      cancel: function cancel(reason) {
        // Close writable
        writable._write.close();

        // Tell gen to stop
        readableController[closedProp] = true;
      }
    }, readableStrategy);

    // If init, push chunk
    if (init !== void 0) {
      var writer = writable.getWriter();
      writer.write(init);

      // Release lock so other writers can start writing
      writer.releaseLock();
    }

    // Return { readable, writable } pair
    this.readable = readable;
    this.writable = writable;
  };
}
},{"./streams":17,"./utils":18}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = split;

var _streams = require("./streams");

/**
 * This function takes a readable stream and a number and returns an array of
 * tee'd readable streams, with a `cancelAll` function that cancels all the tee'd
 * streams and in turn the original stream.
 *
 * @example
 * let readable = createReadable([1,2,3]),
 *   [r1, r2] = split( readable ),
 *   w1 = createWritable(),
 *   w2 = createWritable();
 *
 * r1.pipeTo( w1 );   // 1, 2, 3
 * r2.pipeTo( w2 );   // 1, 2, 3
 */
function split(stream) {
  var parts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;


  // Check for readable stream
  if (!stream.tee) throw new Error("Only readable streams can be split");

  // Decls
  var result = void 0,
      cancelFns = void 0,
      cancelAll = void 0;

  // Generate parts
  result = [stream];

  while (parts > result.length) {
    // Take last part
    var s = result.pop();

    // Add new parts after tee'ing
    result = result.concat(s.tee());
  }

  // Take cancel functions
  cancelFns = result.map(function (s) {
    return s.cancel.bind(s);
  });

  // Gen cancelAll
  cancelAll = function cancelAll() {
    return cancelFns.forEach(function (c) {
      return c();
    });
  };

  // Add cancelAll to all the parts
  result.forEach(function (s) {
    s.cancelAll = cancelAll;
  });

  return result;
}

// Browserify compat


if (typeof module !== "undefined")
  // $FlowFixMe
  module.exports = split;
},{"./streams":17}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});


// Access stream interface

var interfaces = void 0,

// $FlowFixMe
global = global || {};

if (typeof window !== 'undefined') global = window;

if (!!global.ReadableStream) {

  interfaces = {
    ReadableStream: global.ReadableStream,
    WritableStream: global.WritableStream,
    ByteLengthQueuingStrategy: global.ByteLengthQueuingStrategy,
    CountQueuingStrategy: global.CountQueuingStrategy,
    TransformStream: global.TransformStream
  };
} else {

  try {
    interfaces = require("web-streams-polyfill");
    console.log(JSON.stringify(interfaces, null, 4));
  } catch (e) {

    throw new Error("No Stream implementation found");
  }
}

var ReadableStream = exports.ReadableStream = interfaces.ReadableStream,
    WritableStream = exports.WritableStream = interfaces.WritableStream,
    ByteLengthQueuingStrategy = exports.ByteLengthQueuingStrategy = interfaces.ByteLengthQueuingStrategy,
    CountQueuingStrategy = exports.CountQueuingStrategy = interfaces.CountQueuingStrategy,
    TransformStream = exports.TransformStream = interfaces.TransformStream;

exports.default = interfaces;

//*** Flow types


//*** Flow interfaces

;

;

;

;
},{"web-streams-polyfill":19}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isGeneratorFn = exports.isGenerator = exports.isFunction = exports.isWritable = exports.isReadable = exports.isTransform = exports.events = exports.Events = exports.EOS = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.zipWith = zipWith;
exports.uuid = uuid;

var _streams = require("./streams");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Consts
var EOS = exports.EOS = Symbol.for("pipe.eos");

// Events

var Events = exports.Events = function () {
  function Events() {
    _classCallCheck(this, Events);

    this._events = {};
  }

  _createClass(Events, [{
    key: "trigger",
    value: function trigger(name) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (name in this._events) {
        // Trigger all handlers
        this._events[name].forEach(function (fn) {
          return fn.apply(undefined, args);
        });
      }
    }
  }, {
    key: "on",
    value: function on(name, fn) {
      this._events[name] = this._events[name] || [];
      this._events[name].push(fn);
    }
  }, {
    key: "off",
    value: function off(name) {
      this._events[name] = [];
    }
  }]);

  return Events;
}();

// Utils


var events = exports.events = new Events(),
    isTransform = exports.isTransform = function isTransform(s) {
  return s && s.writable && s.readable;
},
    isReadable = exports.isReadable = function isReadable(s) {
  return s instanceof _streams.ReadableStream && s.pipeThrough;
},
    isWritable = exports.isWritable = function isWritable(s) {
  return s instanceof _streams.WritableStream && s.getWriter;
},


// Inspired by code from @tj/co library
isFunction = exports.isFunction = function isFunction(f) {
  return typeof f === "function";
},
    isGenerator = exports.isGenerator = function isGenerator(o) {
  return o && isFunction(o.next);
},
    isGeneratorFn = exports.isGeneratorFn = function isGeneratorFn(_ref) {
  var constructor = _ref.constructor;

  return constructor && (constructor.name === "GeneratorFunction" || constructor.displayName === "GeneratorFunction");
};

// Zips together two arrays using given fn
function zipWith(fn, arr1, arr2) {

  var res = [];

  // Pop values, push zipped values
  while (arr1.length && arr2.length) {
    res.push(fn(arr1.pop(), arr2.pop()));
  }return res;
}

// Generate uuids
// From: https://gist.github.com/jed/982883
function uuid(a) {
  // $FlowFixMe
  return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);
}
},{"./streams":17}],19:[function(require,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.default = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _require=_dereq_("./spec/reference-implementation/lib/readable-stream"),ReadableStream=_require.ReadableStream,_require2=_dereq_("./spec/reference-implementation/lib/writable-stream"),WritableStream=_require2.WritableStream,ByteLengthQueuingStrategy=_dereq_("./spec/reference-implementation/lib/byte-length-queuing-strategy"),CountQueuingStrategy=_dereq_("./spec/reference-implementation/lib/count-queuing-strategy"),TransformStream=_dereq_("./spec/reference-implementation/lib/transform-stream").TransformStream;exports.ByteLengthQueuingStrategy=ByteLengthQueuingStrategy,exports.CountQueuingStrategy=CountQueuingStrategy,exports.TransformStream=TransformStream,exports.ReadableStream=ReadableStream,exports.WritableStream=WritableStream;var interfaces={ReadableStream:ReadableStream,WritableStream:WritableStream,ByteLengthQueuingStrategy:ByteLengthQueuingStrategy,CountQueuingStrategy:CountQueuingStrategy,TransformStream:TransformStream};exports.default=interfaces,"undefined"!=typeof window&&Object.assign(window,interfaces);

},{"./spec/reference-implementation/lib/byte-length-queuing-strategy":3,"./spec/reference-implementation/lib/count-queuing-strategy":4,"./spec/reference-implementation/lib/readable-stream":7,"./spec/reference-implementation/lib/transform-stream":8,"./spec/reference-implementation/lib/writable-stream":9}],2:[function(_dereq_,module,exports){

},{}],3:[function(_dereq_,module,exports){
"use strict";function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function e(e,r){for(var t=0;t<r.length;t++){var a=r[t];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(r,t,a){return t&&e(r.prototype,t),a&&e(r,a),r}}(),_require=_dereq_("./helpers.js"),createDataProperty=_require.createDataProperty;module.exports=function(){function e(r){var t=r.highWaterMark;_classCallCheck(this,e),createDataProperty(this,"highWaterMark",t)}return _createClass(e,[{key:"size",value:function(e){return e.byteLength}}]),e}();

},{"./helpers.js":5}],4:[function(_dereq_,module,exports){
"use strict";function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function e(e,r){for(var t=0;t<r.length;t++){var a=r[t];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(r,t,a){return t&&e(r.prototype,t),a&&e(r,a),r}}(),_require=_dereq_("./helpers.js"),createDataProperty=_require.createDataProperty;module.exports=function(){function e(r){var t=r.highWaterMark;_classCallCheck(this,e),createDataProperty(this,"highWaterMark",t)}return _createClass(e,[{key:"size",value:function(){return 1}}]),e}();

},{"./helpers.js":5}],5:[function(_dereq_,module,exports){
"use strict";function _toConsumableArray(e){if(Array.isArray(e)){for(var r=0,t=Array(e.length);r<e.length;r++)t[r]=e[r];return t}return Array.from(e)}function IsPropertyKey(e){return"string"==typeof e||"symbol"===("undefined"==typeof e?"undefined":_typeof(e))}function Call(e,r,t){if("function"!=typeof e)throw new TypeError("Argument is not a function");return Function.prototype.apply.call(e,r,t)}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};exports.typeIsObject=function(e){return"object"===("undefined"==typeof e?"undefined":_typeof(e))&&null!==e||"function"==typeof e},exports.createDataProperty=function(e,r,t){Object.defineProperty(e,r,{value:t,writable:!0,enumerable:!0,configurable:!0})},exports.createArrayFromList=function(e){return e.slice()},exports.ArrayBufferCopy=function(e,r,t,o,n){new Uint8Array(e).set(new Uint8Array(t,o,n),r)},exports.CreateIterResultObject=function(e,r){var t={};return Object.defineProperty(t,"value",{value:e,enumerable:!0,writable:!0,configurable:!0}),Object.defineProperty(t,"done",{value:r,enumerable:!0,writable:!0,configurable:!0}),t},exports.IsFiniteNonNegativeNumber=function(e){return!Number.isNaN(e)&&(e!==1/0&&!(e<0))},exports.InvokeOrNoop=function(e,r,t){var o=e[r];if(void 0!==o)return Call(o,e,t)},exports.PromiseInvokeOrNoop=function(e,r,t){try{return Promise.resolve(exports.InvokeOrNoop(e,r,t))}catch(e){return Promise.reject(e)}},exports.PromiseInvokeOrPerformFallback=function(e,r,t,o,n){var i=void 0;try{i=e[r]}catch(e){return Promise.reject(e)}if(void 0===i)return o.apply(void 0,_toConsumableArray(n));try{return Promise.resolve(Call(i,e,t))}catch(e){return Promise.reject(e)}},exports.PromiseInvokeOrFallbackOrNoop=function(e,r,t,o,n){return exports.PromiseInvokeOrPerformFallback(e,r,t,exports.PromiseInvokeOrNoop,[e,o,n])},exports.SameRealmTransfer=function(e){return e},exports.ValidateAndNormalizeHighWaterMark=function(e){if(e=Number(e),Number.isNaN(e)||e<0)throw new RangeError("highWaterMark property of a queuing strategy must be non-negative and non-NaN");return e},exports.ValidateAndNormalizeQueuingStrategy=function(e,r){if(void 0!==e&&"function"!=typeof e)throw new TypeError("size property of a queuing strategy must be a function");return r=exports.ValidateAndNormalizeHighWaterMark(r),{size:e,highWaterMark:r}};

},{}],6:[function(_dereq_,module,exports){
"use strict";var _require=_dereq_("./helpers.js"),IsFiniteNonNegativeNumber=_require.IsFiniteNonNegativeNumber;exports.DequeueValue=function(e){var t=e.shift();return e._totalSize-=t.size,t.value},exports.EnqueueValueWithSize=function(e,t,i){if(i=Number(i),!IsFiniteNonNegativeNumber(i))throw new RangeError("Size must be a finite, non-NaN, non-negative number.");e.push({value:t,size:i}),void 0===e._totalSize&&(e._totalSize=0),e._totalSize+=i},exports.GetTotalQueueSize=function(e){return void 0===e._totalSize&&(e._totalSize=0),e._totalSize},exports.PeekQueueValue=function(e){var t=e[0];return t.value};

},{"./helpers.js":5}],7:[function(_dereq_,module,exports){
"use strict";function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function AcquireReadableStreamBYOBReader(e){return new ReadableStreamBYOBReader(e)}function AcquireReadableStreamDefaultReader(e){return new ReadableStreamDefaultReader(e)}function IsReadableStream(e){return!!typeIsObject(e)&&!!Object.prototype.hasOwnProperty.call(e,"_readableStreamController")}function IsReadableStreamDisturbed(e){return e._disturbed}function IsReadableStreamLocked(e){return void 0!==e._reader}function ReadableStreamTee(e,r){var t=AcquireReadableStreamDefaultReader(e),a={closedOrErrored:!1,canceled1:!1,canceled2:!1,reason1:void 0,reason2:void 0};a.promise=new Promise(function(e){a._resolve=e});var l=create_ReadableStreamTeePullFunction();l._reader=t,l._teeState=a,l._cloneForBranch2=r;var o=create_ReadableStreamTeeBranch1CancelFunction();o._stream=e,o._teeState=a;var n=create_ReadableStreamTeeBranch2CancelFunction();n._stream=e,n._teeState=a;var i=Object.create(Object.prototype);createDataProperty(i,"pull",l),createDataProperty(i,"cancel",o);var d=new ReadableStream(i),s=Object.create(Object.prototype);createDataProperty(s,"pull",l),createDataProperty(s,"cancel",n);var u=new ReadableStream(s);return l._branch1=d._readableStreamController,l._branch2=u._readableStreamController,t._closedPromise.catch(function(e){a.closedOrErrored!==!0&&(ReadableStreamDefaultControllerError(l._branch1,e),ReadableStreamDefaultControllerError(l._branch2,e),a.closedOrErrored=!0)}),[d,u]}function create_ReadableStreamTeePullFunction(){function e(){var r=e._reader,t=e._branch1,a=e._branch2,l=e._teeState;return ReadableStreamDefaultReaderRead(r).then(function(e){var r=e.value,o=e.done;if(o===!0&&l.closedOrErrored===!1&&(l.canceled1===!1&&ReadableStreamDefaultControllerClose(t),l.canceled2===!1&&ReadableStreamDefaultControllerClose(a),l.closedOrErrored=!0),l.closedOrErrored!==!0){var n=r,i=r;l.canceled1===!1&&ReadableStreamDefaultControllerEnqueue(t,n),l.canceled2===!1&&ReadableStreamDefaultControllerEnqueue(a,i)}})}return e}function create_ReadableStreamTeeBranch1CancelFunction(){function e(r){var t=e._stream,a=e._teeState;if(a.canceled1=!0,a.reason1=r,a.canceled2===!0){var l=createArrayFromList([a.reason1,a.reason2]),o=ReadableStreamCancel(t,l);a._resolve(o)}return a.promise}return e}function create_ReadableStreamTeeBranch2CancelFunction(){function e(r){var t=e._stream,a=e._teeState;if(a.canceled2=!0,a.reason2=r,a.canceled1===!0){var l=createArrayFromList([a.reason1,a.reason2]),o=ReadableStreamCancel(t,l);a._resolve(o)}return a.promise}return e}function ReadableStreamAddReadIntoRequest(e){var r=new Promise(function(r,t){var a={_resolve:r,_reject:t};e._reader._readIntoRequests.push(a)});return r}function ReadableStreamAddReadRequest(e){var r=new Promise(function(r,t){var a={_resolve:r,_reject:t};e._reader._readRequests.push(a)});return r}function ReadableStreamCancel(e,r){if(e._disturbed=!0,"closed"===e._state)return Promise.resolve(void 0);if("errored"===e._state)return Promise.reject(e._storedError);ReadableStreamClose(e);var t=e._readableStreamController[InternalCancel](r);return t.then(function(){})}function ReadableStreamClose(e){e._state="closed";var r=e._reader;if(void 0!==r){if(IsReadableStreamDefaultReader(r)===!0){var t=!0,a=!1,l=void 0;try{for(var o,n=r._readRequests[Symbol.iterator]();!(t=(o=n.next()).done);t=!0){var i=o.value._resolve;i(CreateIterResultObject(void 0,!0))}}catch(e){a=!0,l=e}finally{try{!t&&n.return&&n.return()}finally{if(a)throw l}}r._readRequests=[]}defaultReaderClosedPromiseResolve(r)}}function ReadableStreamError(e,r){e._state="errored",e._storedError=r;var t=e._reader;if(void 0!==t){if(IsReadableStreamDefaultReader(t)===!0){var a=!0,l=!1,o=void 0;try{for(var n,i=t._readRequests[Symbol.iterator]();!(a=(n=i.next()).done);a=!0){var d=n.value;d._reject(r)}}catch(e){l=!0,o=e}finally{try{!a&&i.return&&i.return()}finally{if(l)throw o}}t._readRequests=[]}else{var s=!0,u=!1,c=void 0;try{for(var b,R=t._readIntoRequests[Symbol.iterator]();!(s=(b=R.next()).done);s=!0){var m=b.value;m._reject(r)}}catch(e){u=!0,c=e}finally{try{!s&&R.return&&R.return()}finally{if(u)throw c}}t._readIntoRequests=[]}defaultReaderClosedPromiseReject(t,r),t._closedPromise.catch(function(){})}}function ReadableStreamFulfillReadIntoRequest(e,r,t){var a=e._reader,l=a._readIntoRequests.shift();l._resolve(CreateIterResultObject(r,t))}function ReadableStreamFulfillReadRequest(e,r,t){var a=e._reader,l=a._readRequests.shift();l._resolve(CreateIterResultObject(r,t))}function ReadableStreamGetNumReadIntoRequests(e){return e._reader._readIntoRequests.length}function ReadableStreamGetNumReadRequests(e){return e._reader._readRequests.length}function ReadableStreamHasBYOBReader(e){var r=e._reader;return void 0!==r&&IsReadableStreamBYOBReader(r)!==!1}function ReadableStreamHasDefaultReader(e){var r=e._reader;return void 0!==r&&IsReadableStreamDefaultReader(r)!==!1}function IsReadableStreamBYOBReader(e){return!!typeIsObject(e)&&!!Object.prototype.hasOwnProperty.call(e,"_readIntoRequests")}function IsReadableStreamDefaultReader(e){return!!typeIsObject(e)&&!!Object.prototype.hasOwnProperty.call(e,"_readRequests")}function ReadableStreamReaderGenericInitialize(e,r){e._ownerReadableStream=r,r._reader=e,"readable"===r._state?defaultReaderClosedPromiseInitialize(e):"closed"===r._state?defaultReaderClosedPromiseInitializeAsResolved(e):(defaultReaderClosedPromiseInitializeAsRejected(e,r._storedError),e._closedPromise.catch(function(){}))}function ReadableStreamReaderGenericCancel(e,r){var t=e._ownerReadableStream;return ReadableStreamCancel(t,r)}function ReadableStreamReaderGenericRelease(e){"readable"===e._ownerReadableStream._state?defaultReaderClosedPromiseReject(e,new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")):defaultReaderClosedPromiseResetToRejected(e,new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")),e._closedPromise.catch(function(){}),e._ownerReadableStream._reader=void 0,e._ownerReadableStream=void 0}function ReadableStreamBYOBReaderRead(e,r){var t=e._ownerReadableStream;return t._disturbed=!0,"errored"===t._state?Promise.reject(t._storedError):ReadableByteStreamControllerPullInto(t._readableStreamController,r)}function ReadableStreamDefaultReaderRead(e){var r=e._ownerReadableStream;return r._disturbed=!0,"closed"===r._state?Promise.resolve(CreateIterResultObject(void 0,!0)):"errored"===r._state?Promise.reject(r._storedError):r._readableStreamController[InternalPull]()}function IsReadableStreamDefaultController(e){return!!typeIsObject(e)&&!!Object.prototype.hasOwnProperty.call(e,"_underlyingSource")}function ReadableStreamDefaultControllerCallPullIfNeeded(e){var r=ReadableStreamDefaultControllerShouldCallPull(e);if(r!==!1){if(e._pulling===!0)return void(e._pullAgain=!0);e._pulling=!0;var t=PromiseInvokeOrNoop(e._underlyingSource,"pull",[e]);t.then(function(){if(e._pulling=!1,e._pullAgain===!0)return e._pullAgain=!1,ReadableStreamDefaultControllerCallPullIfNeeded(e)},function(r){ReadableStreamDefaultControllerErrorIfNeeded(e,r)}).catch(rethrowAssertionErrorRejection)}}function ReadableStreamDefaultControllerShouldCallPull(e){var r=e._controlledReadableStream;if("closed"===r._state||"errored"===r._state)return!1;if(e._closeRequested===!0)return!1;if(e._started===!1)return!1;if(IsReadableStreamLocked(r)===!0&&ReadableStreamGetNumReadRequests(r)>0)return!0;var t=ReadableStreamDefaultControllerGetDesiredSize(e);return t>0}function ReadableStreamDefaultControllerClose(e){var r=e._controlledReadableStream;e._closeRequested=!0,0===e._queue.length&&ReadableStreamClose(r)}function ReadableStreamDefaultControllerEnqueue(e,r){var t=e._controlledReadableStream;if(IsReadableStreamLocked(t)===!0&&ReadableStreamGetNumReadRequests(t)>0)ReadableStreamFulfillReadRequest(t,r,!1);else{var a=1;if(void 0!==e._strategySize)try{a=e._strategySize(r)}catch(r){throw ReadableStreamDefaultControllerErrorIfNeeded(e,r),r}try{EnqueueValueWithSize(e._queue,r,a)}catch(r){throw ReadableStreamDefaultControllerErrorIfNeeded(e,r),r}}ReadableStreamDefaultControllerCallPullIfNeeded(e)}function ReadableStreamDefaultControllerError(e,r){var t=e._controlledReadableStream;e._queue=[],ReadableStreamError(t,r)}function ReadableStreamDefaultControllerErrorIfNeeded(e,r){"readable"===e._controlledReadableStream._state&&ReadableStreamDefaultControllerError(e,r)}function ReadableStreamDefaultControllerGetDesiredSize(e){var r=GetTotalQueueSize(e._queue);return e._strategyHWM-r}function IsReadableByteStreamController(e){return!!typeIsObject(e)&&!!Object.prototype.hasOwnProperty.call(e,"_underlyingByteSource")}function IsReadableStreamBYOBRequest(e){return!!typeIsObject(e)&&!!Object.prototype.hasOwnProperty.call(e,"_associatedReadableByteStreamController")}function ReadableByteStreamControllerCallPullIfNeeded(e){var r=ReadableByteStreamControllerShouldCallPull(e);if(r!==!1){if(e._pulling===!0)return void(e._pullAgain=!0);e._pulling=!0;var t=PromiseInvokeOrNoop(e._underlyingByteSource,"pull",[e]);t.then(function(){e._pulling=!1,e._pullAgain===!0&&(e._pullAgain=!1,ReadableByteStreamControllerCallPullIfNeeded(e))},function(r){"readable"===e._controlledReadableStream._state&&ReadableByteStreamControllerError(e,r)}).catch(rethrowAssertionErrorRejection)}}function ReadableByteStreamControllerClearPendingPullIntos(e){ReadableByteStreamControllerInvalidateBYOBRequest(e),e._pendingPullIntos=[]}function ReadableByteStreamControllerCommitPullIntoDescriptor(e,r){var t=!1;"closed"===e._state&&(t=!0);var a=ReadableByteStreamControllerConvertPullIntoDescriptor(r);"default"===r.readerType?ReadableStreamFulfillReadRequest(e,a,t):ReadableStreamFulfillReadIntoRequest(e,a,t)}function ReadableByteStreamControllerConvertPullIntoDescriptor(e){var r=e.bytesFilled,t=e.elementSize;return new e.ctor(e.buffer,e.byteOffset,r/t)}function ReadableByteStreamControllerEnqueueChunkToQueue(e,r,t,a){e._queue.push({buffer:r,byteOffset:t,byteLength:a}),e._totalQueuedBytes+=a}function ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(e,r){var t=r.elementSize,a=r.bytesFilled-r.bytesFilled%t,l=Math.min(e._totalQueuedBytes,r.byteLength-r.bytesFilled),o=r.bytesFilled+l,n=o-o%t,i=l,d=!1;n>a&&(i=n-r.bytesFilled,d=!0);for(var s=e._queue;i>0;){var u=s[0],c=Math.min(i,u.byteLength),b=r.byteOffset+r.bytesFilled;ArrayBufferCopy(r.buffer,b,u.buffer,u.byteOffset,c),u.byteLength===c?s.shift():(u.byteOffset+=c,u.byteLength-=c),e._totalQueuedBytes-=c,ReadableByteStreamControllerFillHeadPullIntoDescriptor(e,c,r),i-=c}return d}function ReadableByteStreamControllerFillHeadPullIntoDescriptor(e,r,t){ReadableByteStreamControllerInvalidateBYOBRequest(e),t.bytesFilled+=r}function ReadableByteStreamControllerHandleQueueDrain(e){0===e._totalQueuedBytes&&e._closeRequested===!0?ReadableStreamClose(e._controlledReadableStream):ReadableByteStreamControllerCallPullIfNeeded(e)}function ReadableByteStreamControllerInvalidateBYOBRequest(e){void 0!==e._byobRequest&&(e._byobRequest._associatedReadableByteStreamController=void 0,e._byobRequest._view=void 0,e._byobRequest=void 0)}function ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(e){for(;e._pendingPullIntos.length>0;){if(0===e._totalQueuedBytes)return;var r=e._pendingPullIntos[0];ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(e,r)===!0&&(ReadableByteStreamControllerShiftPendingPullInto(e),ReadableByteStreamControllerCommitPullIntoDescriptor(e._controlledReadableStream,r))}}function ReadableByteStreamControllerPullInto(e,r){var t=e._controlledReadableStream,a=1;r.constructor!==DataView&&(a=r.constructor.BYTES_PER_ELEMENT);var l=r.constructor,o={buffer:r.buffer,byteOffset:r.byteOffset,byteLength:r.byteLength,bytesFilled:0,elementSize:a,ctor:l,readerType:"byob"};if(e._pendingPullIntos.length>0)return o.buffer=SameRealmTransfer(o.buffer),e._pendingPullIntos.push(o),ReadableStreamAddReadIntoRequest(t);if("closed"===t._state){var n=new r.constructor(r.buffer,r.byteOffset,0);return Promise.resolve(CreateIterResultObject(n,!0))}if(e._totalQueuedBytes>0){if(ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(e,o)===!0){var i=ReadableByteStreamControllerConvertPullIntoDescriptor(o);return ReadableByteStreamControllerHandleQueueDrain(e),Promise.resolve(CreateIterResultObject(i,!1))}if(e._closeRequested===!0){var d=new TypeError("Insufficient bytes to fill elements in the given buffer");return ReadableByteStreamControllerError(e,d),Promise.reject(d)}}o.buffer=SameRealmTransfer(o.buffer),e._pendingPullIntos.push(o);var s=ReadableStreamAddReadIntoRequest(t);return ReadableByteStreamControllerCallPullIfNeeded(e),s}function ReadableByteStreamControllerRespondInClosedState(e,r){r.buffer=SameRealmTransfer(r.buffer);for(var t=e._controlledReadableStream;ReadableStreamGetNumReadIntoRequests(t)>0;){var a=ReadableByteStreamControllerShiftPendingPullInto(e);ReadableByteStreamControllerCommitPullIntoDescriptor(t,a)}}function ReadableByteStreamControllerRespondInReadableState(e,r,t){if(t.bytesFilled+r>t.byteLength)throw new RangeError("bytesWritten out of range");if(ReadableByteStreamControllerFillHeadPullIntoDescriptor(e,r,t),!(t.bytesFilled<t.elementSize)){ReadableByteStreamControllerShiftPendingPullInto(e);var a=t.bytesFilled%t.elementSize;if(a>0){var l=t.byteOffset+t.bytesFilled,o=t.buffer.slice(l-a,l);ReadableByteStreamControllerEnqueueChunkToQueue(e,o,0,o.byteLength)}t.buffer=SameRealmTransfer(t.buffer),t.bytesFilled-=a,ReadableByteStreamControllerCommitPullIntoDescriptor(e._controlledReadableStream,t),ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(e)}}function ReadableByteStreamControllerRespondInternal(e,r){var t=e._pendingPullIntos[0],a=e._controlledReadableStream;if("closed"===a._state){if(0!==r)throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");ReadableByteStreamControllerRespondInClosedState(e,t)}else ReadableByteStreamControllerRespondInReadableState(e,r,t)}function ReadableByteStreamControllerShiftPendingPullInto(e){var r=e._pendingPullIntos.shift();return ReadableByteStreamControllerInvalidateBYOBRequest(e),r}function ReadableByteStreamControllerShouldCallPull(e){var r=e._controlledReadableStream;return"readable"===r._state&&(e._closeRequested!==!0&&(e._started!==!1&&(!!(ReadableStreamHasDefaultReader(r)&&ReadableStreamGetNumReadRequests(r)>0)||(!!(ReadableStreamHasBYOBReader(r)&&ReadableStreamGetNumReadIntoRequests(r)>0)||ReadableByteStreamControllerGetDesiredSize(e)>0))))}function ReadableByteStreamControllerClose(e){var r=e._controlledReadableStream;if(e._totalQueuedBytes>0)return void(e._closeRequested=!0);if(e._pendingPullIntos.length>0){var t=e._pendingPullIntos[0];if(t.bytesFilled>0){var a=new TypeError("Insufficient bytes to fill elements in the given buffer");throw ReadableByteStreamControllerError(e,a),a}}ReadableStreamClose(r)}function ReadableByteStreamControllerEnqueue(e,r){var t=e._controlledReadableStream,a=r.buffer,l=r.byteOffset,o=r.byteLength,n=SameRealmTransfer(a);if(ReadableStreamHasDefaultReader(t)===!0)if(0===ReadableStreamGetNumReadRequests(t))ReadableByteStreamControllerEnqueueChunkToQueue(e,n,l,o);else{var i=new Uint8Array(n,l,o);ReadableStreamFulfillReadRequest(t,i,!1)}else ReadableStreamHasBYOBReader(t)===!0?(ReadableByteStreamControllerEnqueueChunkToQueue(e,n,l,o),ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(e)):ReadableByteStreamControllerEnqueueChunkToQueue(e,n,l,o)}function ReadableByteStreamControllerError(e,r){var t=e._controlledReadableStream;ReadableByteStreamControllerClearPendingPullIntos(e),e._queue=[],ReadableStreamError(t,r)}function ReadableByteStreamControllerGetDesiredSize(e){return e._strategyHWM-e._totalQueuedBytes}function ReadableByteStreamControllerRespond(e,r){if(r=Number(r),IsFiniteNonNegativeNumber(r)===!1)throw new RangeError("bytesWritten must be a finite");ReadableByteStreamControllerRespondInternal(e,r)}function ReadableByteStreamControllerRespondWithNewView(e,r){var t=e._pendingPullIntos[0];if(t.byteOffset+t.bytesFilled!==r.byteOffset)throw new RangeError("The region specified by view does not match byobRequest");if(t.byteLength!==r.byteLength)throw new RangeError("The buffer of view has different capacity than byobRequest");t.buffer=r.buffer,ReadableByteStreamControllerRespondInternal(e,r.byteLength)}function streamBrandCheckException(e){return new TypeError("ReadableStream.prototype."+e+" can only be used on a ReadableStream")}function readerLockException(e){return new TypeError("Cannot "+e+" a stream using a released reader")}function defaultReaderBrandCheckException(e){return new TypeError("ReadableStreamDefaultReader.prototype."+e+" can only be used on a ReadableStreamDefaultReader")}function defaultReaderClosedPromiseInitialize(e){e._closedPromise=new Promise(function(r,t){e._closedPromise_resolve=r,e._closedPromise_reject=t})}function defaultReaderClosedPromiseInitializeAsRejected(e,r){e._closedPromise=Promise.reject(r),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0}function defaultReaderClosedPromiseInitializeAsResolved(e){e._closedPromise=Promise.resolve(void 0),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0}function defaultReaderClosedPromiseReject(e,r){e._closedPromise_reject(r),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0}function defaultReaderClosedPromiseResetToRejected(e,r){e._closedPromise=Promise.reject(r)}function defaultReaderClosedPromiseResolve(e){e._closedPromise_resolve(void 0),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0}function byobReaderBrandCheckException(e){return new TypeError("ReadableStreamBYOBReader.prototype."+e+" can only be used on a ReadableStreamBYOBReader")}function defaultControllerBrandCheckException(e){return new TypeError("ReadableStreamDefaultController.prototype."+e+" can only be used on a ReadableStreamDefaultController")}function byobRequestBrandCheckException(e){return new TypeError("ReadableStreamBYOBRequest.prototype."+e+" can only be used on a ReadableStreamBYOBRequest")}function byteStreamControllerBrandCheckException(e){return new TypeError("ReadableByteStreamController.prototype."+e+" can only be used on a ReadableByteStreamController")}var _createClass=function(){function e(e,r){for(var t=0;t<r.length;t++){var a=r[t];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(r,t,a){return t&&e(r.prototype,t),a&&e(r,a),r}}(),_require=_dereq_("./helpers.js"),ArrayBufferCopy=_require.ArrayBufferCopy,CreateIterResultObject=_require.CreateIterResultObject,IsFiniteNonNegativeNumber=_require.IsFiniteNonNegativeNumber,InvokeOrNoop=_require.InvokeOrNoop,PromiseInvokeOrNoop=_require.PromiseInvokeOrNoop,SameRealmTransfer=_require.SameRealmTransfer,ValidateAndNormalizeQueuingStrategy=_require.ValidateAndNormalizeQueuingStrategy,ValidateAndNormalizeHighWaterMark=_require.ValidateAndNormalizeHighWaterMark,_require2=_dereq_("./helpers.js"),createArrayFromList=_require2.createArrayFromList,createDataProperty=_require2.createDataProperty,typeIsObject=_require2.typeIsObject,_require3=_dereq_("./utils.js"),rethrowAssertionErrorRejection=_require3.rethrowAssertionErrorRejection,_require4=_dereq_("./queue-with-sizes.js"),DequeueValue=_require4.DequeueValue,EnqueueValueWithSize=_require4.EnqueueValueWithSize,GetTotalQueueSize=_require4.GetTotalQueueSize,_require5=_dereq_("./writable-stream.js"),AcquireWritableStreamDefaultWriter=_require5.AcquireWritableStreamDefaultWriter,IsWritableStream=_require5.IsWritableStream,IsWritableStreamLocked=_require5.IsWritableStreamLocked,WritableStreamAbort=_require5.WritableStreamAbort,WritableStreamDefaultWriterCloseWithErrorPropagation=_require5.WritableStreamDefaultWriterCloseWithErrorPropagation,WritableStreamDefaultWriterRelease=_require5.WritableStreamDefaultWriterRelease,WritableStreamDefaultWriterWrite=_require5.WritableStreamDefaultWriterWrite,InternalCancel=Symbol("[[Cancel]]"),InternalPull=Symbol("[[Pull]]"),ReadableStream=function(){function e(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},a=t.size,l=t.highWaterMark;_classCallCheck(this,e),this._state="readable",this._reader=void 0,this._storedError=void 0,this._disturbed=!1,this._readableStreamController=void 0;var o=r.type,n=String(o);if("bytes"===n)void 0===l&&(l=0),this._readableStreamController=new ReadableByteStreamController(this,r,l);else{if(void 0!==o)throw new RangeError("Invalid type is specified");void 0===l&&(l=1),this._readableStreamController=new ReadableStreamDefaultController(this,r,a,l)}}return _createClass(e,[{key:"cancel",value:function(e){return IsReadableStream(this)===!1?Promise.reject(streamBrandCheckException("cancel")):IsReadableStreamLocked(this)===!0?Promise.reject(new TypeError("Cannot cancel a stream that already has a reader")):ReadableStreamCancel(this,e)}},{key:"getReader",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=e.mode;if(IsReadableStream(this)===!1)throw streamBrandCheckException("getReader");if("byob"===r){if(IsReadableByteStreamController(this._readableStreamController)===!1)throw new TypeError("Cannot get a ReadableStreamBYOBReader for a stream not constructed with a byte source");return AcquireReadableStreamBYOBReader(this)}if(void 0===r)return AcquireReadableStreamDefaultReader(this);throw new RangeError("Invalid mode is specified")}},{key:"pipeThrough",value:function(e,r){var t=e.writable,a=e.readable;return this.pipeTo(t,r),a}},{key:"pipeTo",value:function(e){var r=this,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},a=t.preventClose,l=t.preventAbort,o=t.preventCancel;if(IsReadableStream(this)===!1)return Promise.reject(streamBrandCheckException("pipeTo"));if(IsWritableStream(e)===!1)return Promise.reject(new TypeError("ReadableStream.prototype.pipeTo's first argument must be a WritableStream"));if(a=Boolean(a),l=Boolean(l),o=Boolean(o),IsReadableStreamLocked(this)===!0)return Promise.reject(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream"));if(IsWritableStreamLocked(e)===!0)return Promise.reject(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream"));var n=AcquireReadableStreamDefaultReader(this),i=AcquireWritableStreamDefaultWriter(e),d=!1,s=Promise.resolve();return new Promise(function(t,u){function c(){return s=Promise.resolve(),d===!0?Promise.resolve():i._readyPromise.then(function(){return ReadableStreamDefaultReaderRead(n).then(function(e){var r=e.value,t=e.done;if(t!==!0)return s=WritableStreamDefaultWriterWrite(i,r)})}).then(c)}function b(e,r,t){"errored"===e._state?t(e._storedError):r.catch(t).catch(rethrowAssertionErrorRejection)}function R(e,r,t){"closed"===e._state?t():r.then(t).catch(rethrowAssertionErrorRejection)}function m(){return s.catch(function(){})}function f(e,r,t){d!==!0&&(d=!0,m().then(function(){return e().then(function(){return S(r,t)},function(e){return S(!0,e)})}).catch(rethrowAssertionErrorRejection))}function h(e,r){d!==!0&&(d=!0,m().then(function(){S(e,r)}).catch(rethrowAssertionErrorRejection))}function S(e,r){WritableStreamDefaultWriterRelease(i),ReadableStreamReaderGenericRelease(n),e?u(r):t(void 0)}b(r,n._closedPromise,function(r){l===!1?f(function(){return WritableStreamAbort(e,r)},!0,r):h(!0,r)}),b(e,i._closedPromise,function(e){o===!1?f(function(){return ReadableStreamCancel(r,e)},!0,e):h(!0,e)}),R(r,n._closedPromise,function(){a===!1?f(function(){return WritableStreamDefaultWriterCloseWithErrorPropagation(i)}):h()}),"closing"!==e._state&&"closed"!==e._state||!function(){var e=new TypeError("the destination writable stream closed before all data could be piped to it");o===!1?f(function(){return ReadableStreamCancel(r,e)},!0,e):h(!0,e)}(),c().catch(function(e){s=Promise.resolve(),rethrowAssertionErrorRejection(e)})})}},{key:"tee",value:function(){if(IsReadableStream(this)===!1)throw streamBrandCheckException("tee");var e=ReadableStreamTee(this,!1);return createArrayFromList(e)}},{key:"locked",get:function(){if(IsReadableStream(this)===!1)throw streamBrandCheckException("locked");return IsReadableStreamLocked(this)}}]),e}();module.exports={ReadableStream:ReadableStream,IsReadableStreamDisturbed:IsReadableStreamDisturbed,ReadableStreamDefaultControllerClose:ReadableStreamDefaultControllerClose,ReadableStreamDefaultControllerEnqueue:ReadableStreamDefaultControllerEnqueue,ReadableStreamDefaultControllerError:ReadableStreamDefaultControllerError,ReadableStreamDefaultControllerGetDesiredSize:ReadableStreamDefaultControllerGetDesiredSize};var ReadableStreamDefaultReader=function(){function e(r){if(_classCallCheck(this,e),IsReadableStream(r)===!1)throw new TypeError("ReadableStreamDefaultReader can only be constructed with a ReadableStream instance");if(IsReadableStreamLocked(r)===!0)throw new TypeError("This stream has already been locked for exclusive reading by another reader");ReadableStreamReaderGenericInitialize(this,r),this._readRequests=[]}return _createClass(e,[{key:"cancel",value:function(e){return IsReadableStreamDefaultReader(this)===!1?Promise.reject(defaultReaderBrandCheckException("cancel")):void 0===this._ownerReadableStream?Promise.reject(readerLockException("cancel")):ReadableStreamReaderGenericCancel(this,e)}},{key:"read",value:function(){return IsReadableStreamDefaultReader(this)===!1?Promise.reject(defaultReaderBrandCheckException("read")):void 0===this._ownerReadableStream?Promise.reject(readerLockException("read from")):ReadableStreamDefaultReaderRead(this)}},{key:"releaseLock",value:function(){if(IsReadableStreamDefaultReader(this)===!1)throw defaultReaderBrandCheckException("releaseLock");if(void 0!==this._ownerReadableStream){if(this._readRequests.length>0)throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");ReadableStreamReaderGenericRelease(this)}}},{key:"closed",get:function(){return IsReadableStreamDefaultReader(this)===!1?Promise.reject(defaultReaderBrandCheckException("closed")):this._closedPromise}}]),e}(),ReadableStreamBYOBReader=function(){function e(r){if(_classCallCheck(this,e),!IsReadableStream(r))throw new TypeError("ReadableStreamBYOBReader can only be constructed with a ReadableStream instance given a byte source");if(IsReadableStreamLocked(r))throw new TypeError("This stream has already been locked for exclusive reading by another reader");ReadableStreamReaderGenericInitialize(this,r),this._readIntoRequests=[]}return _createClass(e,[{key:"cancel",value:function(e){return IsReadableStreamBYOBReader(this)?void 0===this._ownerReadableStream?Promise.reject(readerLockException("cancel")):ReadableStreamReaderGenericCancel(this,e):Promise.reject(byobReaderBrandCheckException("cancel"))}},{key:"read",value:function(e){return IsReadableStreamBYOBReader(this)?void 0===this._ownerReadableStream?Promise.reject(readerLockException("read from")):ArrayBuffer.isView(e)?0===e.byteLength?Promise.reject(new TypeError("view must have non-zero byteLength")):ReadableStreamBYOBReaderRead(this,e):Promise.reject(new TypeError("view must be an array buffer view")):Promise.reject(byobReaderBrandCheckException("read"))}},{key:"releaseLock",value:function(){if(!IsReadableStreamBYOBReader(this))throw byobReaderBrandCheckException("releaseLock");if(void 0!==this._ownerReadableStream){if(this._readIntoRequests.length>0)throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");ReadableStreamReaderGenericRelease(this)}}},{key:"closed",get:function(){return IsReadableStreamBYOBReader(this)?this._closedPromise:Promise.reject(byobReaderBrandCheckException("closed"))}}]),e}(),ReadableStreamDefaultController=function(){function e(r,t,a,l){if(_classCallCheck(this,e),IsReadableStream(r)===!1)throw new TypeError("ReadableStreamDefaultController can only be constructed with a ReadableStream instance");if(void 0!==r._readableStreamController)throw new TypeError("ReadableStreamDefaultController instances can only be created by the ReadableStream constructor");this._controlledReadableStream=r,this._underlyingSource=t,this._queue=[],this._started=!1,this._closeRequested=!1,this._pullAgain=!1,this._pulling=!1;var o=ValidateAndNormalizeQueuingStrategy(a,l);this._strategySize=o.size,this._strategyHWM=o.highWaterMark;var n=this,i=InvokeOrNoop(t,"start",[this]);Promise.resolve(i).then(function(){n._started=!0,ReadableStreamDefaultControllerCallPullIfNeeded(n)},function(e){ReadableStreamDefaultControllerErrorIfNeeded(n,e)}).catch(rethrowAssertionErrorRejection)}return _createClass(e,[{key:"close",value:function(){if(IsReadableStreamDefaultController(this)===!1)throw defaultControllerBrandCheckException("close");if(this._closeRequested===!0)throw new TypeError("The stream has already been closed; do not close it again!");var e=this._controlledReadableStream._state;if("readable"!==e)throw new TypeError("The stream (in "+e+" state) is not in the readable state and cannot be closed");ReadableStreamDefaultControllerClose(this)}},{key:"enqueue",value:function(e){if(IsReadableStreamDefaultController(this)===!1)throw defaultControllerBrandCheckException("enqueue");if(this._closeRequested===!0)throw new TypeError("stream is closed or draining");var r=this._controlledReadableStream._state;if("readable"!==r)throw new TypeError("The stream (in "+r+" state) is not in the readable state and cannot be enqueued to");return ReadableStreamDefaultControllerEnqueue(this,e)}},{key:"error",value:function(e){if(IsReadableStreamDefaultController(this)===!1)throw defaultControllerBrandCheckException("error");var r=this._controlledReadableStream;if("readable"!==r._state)throw new TypeError("The stream is "+r._state+" and so cannot be errored");ReadableStreamDefaultControllerError(this,e)}},{key:InternalCancel,value:function(e){return this._queue=[],PromiseInvokeOrNoop(this._underlyingSource,"cancel",[e])}},{key:InternalPull,value:function(){var e=this._controlledReadableStream;if(this._queue.length>0){var r=DequeueValue(this._queue);return this._closeRequested===!0&&0===this._queue.length?ReadableStreamClose(e):ReadableStreamDefaultControllerCallPullIfNeeded(this),Promise.resolve(CreateIterResultObject(r,!1))}var t=ReadableStreamAddReadRequest(e);return ReadableStreamDefaultControllerCallPullIfNeeded(this),t}},{key:"desiredSize",get:function(){if(IsReadableStreamDefaultController(this)===!1)throw defaultControllerBrandCheckException("desiredSize");return ReadableStreamDefaultControllerGetDesiredSize(this)}}]),e}(),ReadableStreamBYOBRequest=function(){function e(r,t){_classCallCheck(this,e),this._associatedReadableByteStreamController=r,this._view=t}return _createClass(e,[{key:"respond",value:function(e){if(IsReadableStreamBYOBRequest(this)===!1)throw byobRequestBrandCheckException("respond");if(void 0===this._associatedReadableByteStreamController)throw new TypeError("This BYOB request has been invalidated");ReadableByteStreamControllerRespond(this._associatedReadableByteStreamController,e)}},{key:"respondWithNewView",value:function(e){if(IsReadableStreamBYOBRequest(this)===!1)throw byobRequestBrandCheckException("respond");if(void 0===this._associatedReadableByteStreamController)throw new TypeError("This BYOB request has been invalidated");if(!ArrayBuffer.isView(e))throw new TypeError("You can only respond with array buffer views");ReadableByteStreamControllerRespondWithNewView(this._associatedReadableByteStreamController,e)}},{key:"view",get:function(){return this._view}}]),e}(),ReadableByteStreamController=function(){function e(r,t,a){if(_classCallCheck(this,e),IsReadableStream(r)===!1)throw new TypeError("ReadableByteStreamController can only be constructed with a ReadableStream instance given a byte source");if(void 0!==r._readableStreamController)throw new TypeError("ReadableByteStreamController instances can only be created by the ReadableStream constructor given a byte source");
this._controlledReadableStream=r,this._underlyingByteSource=t,this._pullAgain=!1,this._pulling=!1,ReadableByteStreamControllerClearPendingPullIntos(this),this._queue=[],this._totalQueuedBytes=0,this._closeRequested=!1,this._started=!1,this._strategyHWM=ValidateAndNormalizeHighWaterMark(a);var l=t.autoAllocateChunkSize;if(void 0!==l&&(Number.isInteger(l)===!1||l<=0))throw new RangeError("autoAllocateChunkSize must be a positive integer");this._autoAllocateChunkSize=l,this._pendingPullIntos=[];var o=this,n=InvokeOrNoop(t,"start",[this]);Promise.resolve(n).then(function(){o._started=!0,ReadableByteStreamControllerCallPullIfNeeded(o)},function(e){"readable"===r._state&&ReadableByteStreamControllerError(o,e)}).catch(rethrowAssertionErrorRejection)}return _createClass(e,[{key:"close",value:function(){if(IsReadableByteStreamController(this)===!1)throw byteStreamControllerBrandCheckException("close");if(this._closeRequested===!0)throw new TypeError("The stream has already been closed; do not close it again!");var e=this._controlledReadableStream._state;if("readable"!==e)throw new TypeError("The stream (in "+e+" state) is not in the readable state and cannot be closed");ReadableByteStreamControllerClose(this)}},{key:"enqueue",value:function(e){if(IsReadableByteStreamController(this)===!1)throw byteStreamControllerBrandCheckException("enqueue");if(this._closeRequested===!0)throw new TypeError("stream is closed or draining");var r=this._controlledReadableStream._state;if("readable"!==r)throw new TypeError("The stream (in "+r+" state) is not in the readable state and cannot be enqueued to");if(!ArrayBuffer.isView(e))throw new TypeError("You can only enqueue array buffer views when using a ReadableByteStreamController");ReadableByteStreamControllerEnqueue(this,e)}},{key:"error",value:function(e){if(IsReadableByteStreamController(this)===!1)throw byteStreamControllerBrandCheckException("error");var r=this._controlledReadableStream;if("readable"!==r._state)throw new TypeError("The stream is "+r._state+" and so cannot be errored");ReadableByteStreamControllerError(this,e)}},{key:InternalCancel,value:function(e){if(this._pendingPullIntos.length>0){var r=this._pendingPullIntos[0];r.bytesFilled=0}return this._queue=[],this._totalQueuedBytes=0,PromiseInvokeOrNoop(this._underlyingByteSource,"cancel",[e])}},{key:InternalPull,value:function(){var e=this._controlledReadableStream;if(0===ReadableStreamGetNumReadRequests(e)){if(this._totalQueuedBytes>0){var r=this._queue.shift();this._totalQueuedBytes-=r.byteLength,ReadableByteStreamControllerHandleQueueDrain(this);var t=void 0;try{t=new Uint8Array(r.buffer,r.byteOffset,r.byteLength)}catch(e){return Promise.reject(e)}return Promise.resolve(CreateIterResultObject(t,!1))}var a=this._autoAllocateChunkSize;if(void 0!==a){var l=void 0;try{l=new ArrayBuffer(a)}catch(e){return Promise.reject(e)}var o={buffer:l,byteOffset:0,byteLength:a,bytesFilled:0,elementSize:1,ctor:Uint8Array,readerType:"default"};this._pendingPullIntos.push(o)}}var n=ReadableStreamAddReadRequest(e);return ReadableByteStreamControllerCallPullIfNeeded(this),n}},{key:"byobRequest",get:function(){if(IsReadableByteStreamController(this)===!1)throw byteStreamControllerBrandCheckException("byobRequest");if(void 0===this._byobRequest&&this._pendingPullIntos.length>0){var e=this._pendingPullIntos[0],r=new Uint8Array(e.buffer,e.byteOffset+e.bytesFilled,e.byteLength-e.bytesFilled);this._byobRequest=new ReadableStreamBYOBRequest(this,r)}return this._byobRequest}},{key:"desiredSize",get:function(){if(IsReadableByteStreamController(this)===!1)throw byteStreamControllerBrandCheckException("desiredSize");return ReadableByteStreamControllerGetDesiredSize(this)}}]),e}();

},{"./helpers.js":5,"./queue-with-sizes.js":6,"./utils.js":2,"./writable-stream.js":9}],8:[function(_dereq_,module,exports){
"use strict";function _classCallCheck(r,e){if(!(r instanceof e))throw new TypeError("Cannot call a class as a function")}function TransformStreamCloseReadable(r){if(r._errored===!0)throw new TypeError("TransformStream is already errored");if(r._readableClosed===!0)throw new TypeError("Readable side is already closed");TransformStreamCloseReadableInternal(r)}function TransformStreamEnqueueToReadable(r,e){if(r._errored===!0)throw new TypeError("TransformStream is already errored");if(r._readableClosed===!0)throw new TypeError("Readable side is already closed");var a=r._readableController;try{ReadableStreamDefaultControllerEnqueue(a,e)}catch(e){throw r._readableClosed=!0,TransformStreamErrorIfNeeded(r,e),r._storedError}var t=ReadableStreamDefaultControllerGetDesiredSize(a),o=t<=0;o===!0&&r._backpressure===!1&&TransformStreamSetBackpressure(r,!0)}function TransformStreamError(r,e){if(r._errored===!0)throw new TypeError("TransformStream is already errored");TransformStreamErrorInternal(r,e)}function TransformStreamCloseReadableInternal(r){try{ReadableStreamDefaultControllerClose(r._readableController)}catch(r){}r._readableClosed=!0}function TransformStreamErrorIfNeeded(r,e){r._errored===!1&&TransformStreamErrorInternal(r,e)}function TransformStreamErrorInternal(r,e){r._errored=!0,r._storedError=e,r._writableDone===!1&&WritableStreamDefaultControllerError(r._writableController,e),r._readableClosed===!1&&ReadableStreamDefaultControllerError(r._readableController,e)}function TransformStreamReadableReadyPromise(r){return r._backpressure===!1?Promise.resolve():r._backpressureChangePromise}function TransformStreamSetBackpressure(r,e){void 0!==r._backpressureChangePromise&&r._backpressureChangePromise_resolve(e),r._backpressureChangePromise=new Promise(function(e){r._backpressureChangePromise_resolve=e}),r._backpressureChangePromise.then(function(r){}),r._backpressure=e}function TransformStreamDefaultTransform(r,e){var a=e._controlledTransformStream;return TransformStreamEnqueueToReadable(a,r),Promise.resolve()}function TransformStreamTransform(r,e){r._transforming=!0;var a=r._transformer,t=r._transformStreamController,o=PromiseInvokeOrPerformFallback(a,"transform",[e,t],TransformStreamDefaultTransform,[e,t]);return o.then(function(){return r._transforming=!1,TransformStreamReadableReadyPromise(r)},function(e){return TransformStreamErrorIfNeeded(r,e),Promise.reject(e)})}function IsTransformStreamDefaultController(r){return!!typeIsObject(r)&&!!Object.prototype.hasOwnProperty.call(r,"_controlledTransformStream")}function IsTransformStream(r){return!!typeIsObject(r)&&!!Object.prototype.hasOwnProperty.call(r,"_transformStreamController")}function defaultControllerBrandCheckException(r){return new TypeError("TransformStreamDefaultController.prototype."+r+" can only be used on a TransformStreamDefaultController")}function streamBrandCheckException(r){return new TypeError("TransformStream.prototype."+r+" can only be used on a TransformStream")}var _createClass=function(){function r(r,e){for(var a=0;a<e.length;a++){var t=e[a];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(r,t.key,t)}}return function(e,a,t){return a&&r(e.prototype,a),t&&r(e,t),e}}(),_require=_dereq_("./helpers.js"),InvokeOrNoop=_require.InvokeOrNoop,PromiseInvokeOrPerformFallback=_require.PromiseInvokeOrPerformFallback,PromiseInvokeOrNoop=_require.PromiseInvokeOrNoop,typeIsObject=_require.typeIsObject,_require2=_dereq_("./readable-stream.js"),ReadableStream=_require2.ReadableStream,ReadableStreamDefaultControllerClose=_require2.ReadableStreamDefaultControllerClose,ReadableStreamDefaultControllerEnqueue=_require2.ReadableStreamDefaultControllerEnqueue,ReadableStreamDefaultControllerError=_require2.ReadableStreamDefaultControllerError,ReadableStreamDefaultControllerGetDesiredSize=_require2.ReadableStreamDefaultControllerGetDesiredSize,_require3=_dereq_("./writable-stream.js"),WritableStream=_require3.WritableStream,WritableStreamDefaultControllerError=_require3.WritableStreamDefaultControllerError,TransformStreamSink=function(){function r(e,a){_classCallCheck(this,r),this._transformStream=e,this._startPromise=a}return _createClass(r,[{key:"start",value:function(r){var e=this._transformStream;return e._writableController=r,this._startPromise.then(function(){return TransformStreamReadableReadyPromise(e)})}},{key:"write",value:function(r){var e=this._transformStream;return TransformStreamTransform(e,r)}},{key:"abort",value:function(){var r=this._transformStream;r._writableDone=!0,TransformStreamErrorInternal(r,new TypeError("Writable side aborted"))}},{key:"close",value:function(){var r=this._transformStream;r._writableDone=!0;var e=PromiseInvokeOrNoop(r._transformer,"flush",[r._transformStreamController]);return e.then(function(){return r._errored===!0?Promise.reject(r._storedError):(r._readableClosed===!1&&TransformStreamCloseReadableInternal(r),Promise.resolve())}).catch(function(e){return TransformStreamErrorIfNeeded(r,e),Promise.reject(r._storedError)})}}]),r}(),TransformStreamSource=function(){function r(e,a){_classCallCheck(this,r),this._transformStream=e,this._startPromise=a}return _createClass(r,[{key:"start",value:function(r){var e=this._transformStream;return e._readableController=r,this._startPromise.then(function(){return e._backpressure===!0?Promise.resolve():e._backpressureChangePromise})}},{key:"pull",value:function(){var r=this._transformStream;return TransformStreamSetBackpressure(r,!1),r._backpressureChangePromise}},{key:"cancel",value:function(){var r=this._transformStream;r._readableClosed=!0,TransformStreamErrorInternal(r,new TypeError("Readable side canceled"))}}]),r}(),TransformStreamDefaultController=function(){function r(e){if(_classCallCheck(this,r),IsTransformStream(e)===!1)throw new TypeError("TransformStreamDefaultController can only be constructed with a TransformStream instance");if(void 0!==e._transformStreamController)throw new TypeError("TransformStreamDefaultController instances can only be created by the TransformStream constructor");this._controlledTransformStream=e}return _createClass(r,[{key:"enqueue",value:function(r){if(IsTransformStreamDefaultController(this)===!1)throw defaultControllerBrandCheckException("enqueue");TransformStreamEnqueueToReadable(this._controlledTransformStream,r)}},{key:"close",value:function(){if(IsTransformStreamDefaultController(this)===!1)throw defaultControllerBrandCheckException("close");TransformStreamCloseReadable(this._controlledTransformStream)}},{key:"error",value:function(r){if(IsTransformStreamDefaultController(this)===!1)throw defaultControllerBrandCheckException("error");TransformStreamError(this._controlledTransformStream,r)}},{key:"desiredSize",get:function(){if(IsTransformStreamDefaultController(this)===!1)throw defaultControllerBrandCheckException("desiredSize");var r=this._controlledTransformStream,e=r._readableController;return ReadableStreamDefaultControllerGetDesiredSize(e)}}]),r}(),TransformStream=function(){function r(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};_classCallCheck(this,r),this._transformer=e;var a=e.readableStrategy,t=e.writableStrategy;this._transforming=!1,this._errored=!1,this._storedError=void 0,this._writableController=void 0,this._readableController=void 0,this._transformStreamController=void 0,this._writableDone=!1,this._readableClosed=!1,this._backpressure=void 0,this._backpressureChangePromise=void 0,this._backpressureChangePromise_resolve=void 0,this._transformStreamController=new TransformStreamDefaultController(this);var o=void 0,n=new Promise(function(r){o=r}),s=new TransformStreamSource(this,n);this._readable=new ReadableStream(s,a);var l=new TransformStreamSink(this,n);this._writable=new WritableStream(l,t);var i=ReadableStreamDefaultControllerGetDesiredSize(this._readableController);TransformStreamSetBackpressure(this,i<=0);var m=this,f=InvokeOrNoop(e,"start",[m._transformStreamController]);o(f),n.catch(function(r){m._errored===!1&&(m._errored=!0,m._storedError=r)})}return _createClass(r,[{key:"readable",get:function(){if(IsTransformStream(this)===!1)throw streamBrandCheckException("readable");return this._readable}},{key:"writable",get:function(){if(IsTransformStream(this)===!1)throw streamBrandCheckException("writable");return this._writable}}]),r}();module.exports={TransformStream:TransformStream};

},{"./helpers.js":5,"./readable-stream.js":7,"./writable-stream.js":9}],9:[function(_dereq_,module,exports){
"use strict";function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function AcquireWritableStreamDefaultWriter(e){return new WritableStreamDefaultWriter(e)}function IsWritableStream(e){return!!typeIsObject(e)&&!!Object.prototype.hasOwnProperty.call(e,"_writableStreamController")}function IsWritableStreamLocked(e){return void 0!==e._writer}function WritableStreamAbort(e,r){var t=e._state;if("closed"===t)return Promise.resolve(void 0);if("errored"===t)return Promise.reject(e._storedError);var i=new TypeError("Aborted");WritableStreamError(e,i);var o=e._writableStreamController;if(o._writing===!0||o._inClose===!0){var a=new Promise(function(r,t){var i={_resolve:r,_reject:t};e._pendingAbortRequest=i});return o._writing===!0?a.then(function(){return WritableStreamDefaultControllerAbort(e._writableStreamController,r)}):a}return WritableStreamDefaultControllerAbort(e._writableStreamController,r)}function WritableStreamAddWriteRequest(e){var r=new Promise(function(r,t){var i={_resolve:r,_reject:t};e._writeRequests.push(i)});return r}function WritableStreamError(e,r){var t=e._state;e._state="errored",e._storedError=r;var i=e._writableStreamController;(void 0===i||i._writing===!1&&i._inClose===!1)&&WritableStreamRejectPromisesInReactionToError(e);var o=e._writer;void 0!==o&&("writable"===t&&WritableStreamDefaultControllerGetBackpressure(e._writableStreamController)===!0?defaultWriterReadyPromiseReject(o,r):defaultWriterReadyPromiseResetToRejected(o,r),o._readyPromise.catch(function(){}))}function WritableStreamFinishClose(e){"closing"===e._state?(defaultWriterClosedPromiseResolve(e._writer),e._state="closed"):(defaultWriterClosedPromiseReject(e._writer,e._storedError),e._writer._closedPromise.catch(function(){})),void 0!==e._pendingAbortRequest&&(e._pendingAbortRequest._resolve(),e._pendingAbortRequest=void 0)}function WritableStreamRejectPromisesInReactionToError(e){var r=e._storedError,t=!0,i=!1,o=void 0;try{for(var a,l=e._writeRequests[Symbol.iterator]();!(t=(a=l.next()).done);t=!0){var n=a.value;n._reject(r)}}catch(e){i=!0,o=e}finally{try{!t&&l.return&&l.return()}finally{if(i)throw o}}e._writeRequests=[],void 0!==e._pendingCloseRequest&&(e._pendingCloseRequest._reject(r),e._pendingCloseRequest=void 0);var s=e._writer;void 0!==s&&(defaultWriterClosedPromiseReject(s,r),s._closedPromise.catch(function(){}))}function WritableStreamUpdateBackpressure(e,r){var t=e._writer;void 0!==t&&(r===!0?defaultWriterReadyPromiseReset(t):defaultWriterReadyPromiseResolve(t))}function IsWritableStreamDefaultWriter(e){return!!typeIsObject(e)&&!!Object.prototype.hasOwnProperty.call(e,"_ownerWritableStream")}function WritableStreamDefaultWriterAbort(e,r){var t=e._ownerWritableStream;return WritableStreamAbort(t,r)}function WritableStreamDefaultWriterClose(e){var r=e._ownerWritableStream,t=r._state;if("closed"===t||"errored"===t)return Promise.reject(new TypeError("The stream (in "+t+" state) is not in the writable state and cannot be closed"));var i=new Promise(function(e,t){var i={_resolve:e,_reject:t};r._pendingCloseRequest=i});return WritableStreamDefaultControllerGetBackpressure(r._writableStreamController)===!0&&defaultWriterReadyPromiseResolve(e),r._state="closing",WritableStreamDefaultControllerClose(r._writableStreamController),i}function WritableStreamDefaultWriterCloseWithErrorPropagation(e){var r=e._ownerWritableStream,t=r._state;return"closing"===t||"closed"===t?Promise.resolve():"errored"===t?Promise.reject(r._storedError):WritableStreamDefaultWriterClose(e)}function WritableStreamDefaultWriterGetDesiredSize(e){var r=e._ownerWritableStream,t=r._state;return"errored"===t?null:"closed"===t?0:WritableStreamDefaultControllerGetDesiredSize(r._writableStreamController)}function WritableStreamDefaultWriterRelease(e){var r=e._ownerWritableStream,t=new TypeError("Writer was released and can no longer be used to monitor the stream's closedness"),i=r._state;"writable"===i||"closing"===i||void 0!==r._pendingAbortRequest?defaultWriterClosedPromiseReject(e,t):defaultWriterClosedPromiseResetToRejected(e,t),e._closedPromise.catch(function(){}),"writable"===i&&WritableStreamDefaultControllerGetBackpressure(r._writableStreamController)===!0?defaultWriterReadyPromiseReject(e,t):defaultWriterReadyPromiseResetToRejected(e,t),e._readyPromise.catch(function(){}),r._writer=void 0,e._ownerWritableStream=void 0}function WritableStreamDefaultWriterWrite(e,r){var t=e._ownerWritableStream,i=t._state;if("closed"===i||"errored"===i)return Promise.reject(new TypeError("The stream (in "+i+" state) is not in the writable state and cannot be written to"));var o=WritableStreamAddWriteRequest(t);return WritableStreamDefaultControllerWrite(t._writableStreamController,r),o}function WritableStreamDefaultControllerAbort(e,r){e._queue=[];var t=PromiseInvokeOrFallbackOrNoop(e._underlyingSink,"abort",[r],"close",[e]);return t.then(function(){})}function WritableStreamDefaultControllerClose(e){EnqueueValueWithSize(e._queue,"close",0),WritableStreamDefaultControllerAdvanceQueueIfNeeded(e)}function WritableStreamDefaultControllerGetDesiredSize(e){var r=GetTotalQueueSize(e._queue);return e._strategyHWM-r}function WritableStreamDefaultControllerWrite(e,r){var t=e._controlledWritableStream,i=1;if(void 0!==e._strategySize)try{i=e._strategySize(r)}catch(r){return void WritableStreamDefaultControllerErrorIfNeeded(e,r)}var o={chunk:r},a=WritableStreamDefaultControllerGetBackpressure(e);try{EnqueueValueWithSize(e._queue,o,i)}catch(r){return void WritableStreamDefaultControllerErrorIfNeeded(e,r)}if("writable"===t._state){var l=WritableStreamDefaultControllerGetBackpressure(e);a!==l&&WritableStreamUpdateBackpressure(t,l)}WritableStreamDefaultControllerAdvanceQueueIfNeeded(e)}function IsWritableStreamDefaultController(e){return!!typeIsObject(e)&&!!Object.prototype.hasOwnProperty.call(e,"_underlyingSink")}function WritableStreamDefaultControllerAdvanceQueueIfNeeded(e){if("closed"!==e._controlledWritableStream._state&&"errored"!==e._controlledWritableStream._state&&e._started!==!1&&e._writing!==!0&&0!==e._queue.length){var r=PeekQueueValue(e._queue);"close"===r?WritableStreamDefaultControllerProcessClose(e):WritableStreamDefaultControllerProcessWrite(e,r.chunk)}}function WritableStreamDefaultControllerErrorIfNeeded(e,r){"writable"!==e._controlledWritableStream._state&&"closing"!==e._controlledWritableStream._state||WritableStreamDefaultControllerError(e,r)}function WritableStreamDefaultControllerProcessClose(e){var r=e._controlledWritableStream;DequeueValue(e._queue),e._inClose=!0;var t=PromiseInvokeOrNoop(e._underlyingSink,"close",[e]);t.then(function(){e._inClose=!1,"closing"!==r._state&&"errored"!==r._state||(r._pendingCloseRequest._resolve(void 0),r._pendingCloseRequest=void 0,WritableStreamFinishClose(r))},function(t){e._inClose=!1,r._pendingCloseRequest._reject(t),r._pendingCloseRequest=void 0,void 0!==r._pendingAbortRequest&&(r._pendingAbortRequest._reject(t),r._pendingAbortRequest=void 0),WritableStreamDefaultControllerErrorIfNeeded(e,t)}).catch(rethrowAssertionErrorRejection)}function WritableStreamDefaultControllerProcessWrite(e,r){e._writing=!0;var t=e._controlledWritableStream;t._pendingWriteRequest=t._writeRequests.shift();var i=PromiseInvokeOrNoop(e._underlyingSink,"write",[r,e]);i.then(function(){var r=t._state;if(e._writing=!1,t._pendingWriteRequest._resolve(void 0),t._pendingWriteRequest=void 0,"errored"===r)return WritableStreamRejectPromisesInReactionToError(t),void(void 0!==t._pendingAbortRequest&&(t._pendingAbortRequest._resolve(),t._pendingAbortRequest=void 0));var i=WritableStreamDefaultControllerGetBackpressure(e);if(DequeueValue(e._queue),"closing"!==r){var o=WritableStreamDefaultControllerGetBackpressure(e);i!==o&&WritableStreamUpdateBackpressure(e._controlledWritableStream,o)}WritableStreamDefaultControllerAdvanceQueueIfNeeded(e)},function(r){e._writing=!1,t._pendingWriteRequest._reject(r),t._pendingWriteRequest=void 0,"errored"===t._state&&(t._storedError=r,WritableStreamRejectPromisesInReactionToError(t)),void 0!==t._pendingAbortRequest&&(t._pendingAbortRequest._reject(r),t._pendingAbortRequest=void 0),WritableStreamDefaultControllerErrorIfNeeded(e,r)}).catch(rethrowAssertionErrorRejection)}function WritableStreamDefaultControllerGetBackpressure(e){var r=WritableStreamDefaultControllerGetDesiredSize(e);return r<=0}function WritableStreamDefaultControllerError(e,r){var t=e._controlledWritableStream;WritableStreamError(t,r),e._queue=[]}function streamBrandCheckException(e){return new TypeError("WritableStream.prototype."+e+" can only be used on a WritableStream")}function defaultWriterBrandCheckException(e){return new TypeError("WritableStreamDefaultWriter.prototype."+e+" can only be used on a WritableStreamDefaultWriter")}function defaultWriterLockException(e){return new TypeError("Cannot "+e+" a stream using a released writer")}function defaultWriterClosedPromiseInitialize(e){e._closedPromise=new Promise(function(r,t){e._closedPromise_resolve=r,e._closedPromise_reject=t})}function defaultWriterClosedPromiseInitializeAsRejected(e,r){e._closedPromise=Promise.reject(r),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0}function defaultWriterClosedPromiseInitializeAsResolved(e){e._closedPromise=Promise.resolve(void 0),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0}function defaultWriterClosedPromiseReject(e,r){e._closedPromise_reject(r),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0}function defaultWriterClosedPromiseResetToRejected(e,r){e._closedPromise=Promise.reject(r)}function defaultWriterClosedPromiseResolve(e){e._closedPromise_resolve(void 0),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0}function defaultWriterReadyPromiseInitialize(e){e._readyPromise=new Promise(function(r,t){e._readyPromise_resolve=r,e._readyPromise_reject=t})}function defaultWriterReadyPromiseInitializeAsResolved(e){e._readyPromise=Promise.resolve(void 0),e._readyPromise_resolve=void 0,e._readyPromise_reject=void 0}function defaultWriterReadyPromiseReject(e,r){e._readyPromise_reject(r),e._readyPromise_resolve=void 0,e._readyPromise_reject=void 0}function defaultWriterReadyPromiseReset(e){e._readyPromise=new Promise(function(r,t){e._readyPromise_resolve=r,e._readyPromise_reject=t})}function defaultWriterReadyPromiseResetToRejected(e,r){e._readyPromise=Promise.reject(r)}function defaultWriterReadyPromiseResolve(e){e._readyPromise_resolve(void 0),e._readyPromise_resolve=void 0,e._readyPromise_reject=void 0}var _createClass=function(){function e(e,r){for(var t=0;t<r.length;t++){var i=r[t];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(r,t,i){return t&&e(r.prototype,t),i&&e(r,i),r}}(),_require=_dereq_("./helpers.js"),InvokeOrNoop=_require.InvokeOrNoop,PromiseInvokeOrNoop=_require.PromiseInvokeOrNoop,PromiseInvokeOrFallbackOrNoop=_require.PromiseInvokeOrFallbackOrNoop,ValidateAndNormalizeQueuingStrategy=_require.ValidateAndNormalizeQueuingStrategy,typeIsObject=_require.typeIsObject,_require2=_dereq_("./utils.js"),rethrowAssertionErrorRejection=_require2.rethrowAssertionErrorRejection,_require3=_dereq_("./queue-with-sizes.js"),DequeueValue=_require3.DequeueValue,EnqueueValueWithSize=_require3.EnqueueValueWithSize,GetTotalQueueSize=_require3.GetTotalQueueSize,PeekQueueValue=_require3.PeekQueueValue,WritableStream=function(){function e(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=t.size,o=t.highWaterMark,a=void 0===o?1:o;_classCallCheck(this,e),this._state="writable",this._storedError=void 0,this._writer=void 0,this._writableStreamController=void 0,this._writeRequests=[],this._pendingWriteRequest=void 0,this._pendingCloseRequest=void 0,this._pendingAbortRequest=void 0;var l=r.type;if(void 0!==l)throw new RangeError("Invalid type is specified");this._writableStreamController=new WritableStreamDefaultController(this,r,i,a)}return _createClass(e,[{key:"abort",value:function(e){return IsWritableStream(this)===!1?Promise.reject(streamBrandCheckException("abort")):IsWritableStreamLocked(this)===!0?Promise.reject(new TypeError("Cannot abort a stream that already has a writer")):WritableStreamAbort(this,e)}},{key:"getWriter",value:function(){if(IsWritableStream(this)===!1)throw streamBrandCheckException("getWriter");return AcquireWritableStreamDefaultWriter(this)}},{key:"locked",get:function(){if(IsWritableStream(this)===!1)throw streamBrandCheckException("locked");return IsWritableStreamLocked(this)}}]),e}();module.exports={AcquireWritableStreamDefaultWriter:AcquireWritableStreamDefaultWriter,IsWritableStream:IsWritableStream,IsWritableStreamLocked:IsWritableStreamLocked,WritableStream:WritableStream,WritableStreamAbort:WritableStreamAbort,WritableStreamDefaultControllerError:WritableStreamDefaultControllerError,WritableStreamDefaultWriterCloseWithErrorPropagation:WritableStreamDefaultWriterCloseWithErrorPropagation,WritableStreamDefaultWriterRelease:WritableStreamDefaultWriterRelease,WritableStreamDefaultWriterWrite:WritableStreamDefaultWriterWrite};var WritableStreamDefaultWriter=function(){function e(r){if(_classCallCheck(this,e),IsWritableStream(r)===!1)throw new TypeError("WritableStreamDefaultWriter can only be constructed with a WritableStream instance");if(IsWritableStreamLocked(r)===!0)throw new TypeError("This stream has already been locked for exclusive writing by another writer");this._ownerWritableStream=r,r._writer=this;var t=r._state;"writable"===t||"closing"===t?defaultWriterClosedPromiseInitialize(this):"closed"===t?defaultWriterClosedPromiseInitializeAsResolved(this):(defaultWriterClosedPromiseInitializeAsRejected(this,r._storedError),this._closedPromise.catch(function(){})),"writable"===t&&WritableStreamDefaultControllerGetBackpressure(r._writableStreamController)===!0?defaultWriterReadyPromiseInitialize(this):defaultWriterReadyPromiseInitializeAsResolved(this,void 0)}return _createClass(e,[{key:"abort",value:function(e){return IsWritableStreamDefaultWriter(this)===!1?Promise.reject(defaultWriterBrandCheckException("abort")):void 0===this._ownerWritableStream?Promise.reject(defaultWriterLockException("abort")):WritableStreamDefaultWriterAbort(this,e)}},{key:"close",value:function(){if(IsWritableStreamDefaultWriter(this)===!1)return Promise.reject(defaultWriterBrandCheckException("close"));var e=this._ownerWritableStream;return void 0===e?Promise.reject(defaultWriterLockException("close")):"closing"===e._state?Promise.reject(new TypeError("cannot close an already-closing stream")):WritableStreamDefaultWriterClose(this)}},{key:"releaseLock",value:function(){if(IsWritableStreamDefaultWriter(this)===!1)throw defaultWriterBrandCheckException("releaseLock");var e=this._ownerWritableStream;void 0!==e&&WritableStreamDefaultWriterRelease(this)}},{key:"write",value:function(e){if(IsWritableStreamDefaultWriter(this)===!1)return Promise.reject(defaultWriterBrandCheckException("write"));var r=this._ownerWritableStream;return void 0===r?Promise.reject(defaultWriterLockException("write to")):"closing"===r._state?Promise.reject(new TypeError("Cannot write to an already-closed stream")):WritableStreamDefaultWriterWrite(this,e)}},{key:"closed",get:function(){return IsWritableStreamDefaultWriter(this)===!1?Promise.reject(defaultWriterBrandCheckException("closed")):this._closedPromise}},{key:"desiredSize",get:function(){if(IsWritableStreamDefaultWriter(this)===!1)throw defaultWriterBrandCheckException("desiredSize");if(void 0===this._ownerWritableStream)throw defaultWriterLockException("desiredSize");return WritableStreamDefaultWriterGetDesiredSize(this)}},{key:"ready",get:function(){return IsWritableStreamDefaultWriter(this)===!1?Promise.reject(defaultWriterBrandCheckException("ready")):this._readyPromise}}]),e}(),WritableStreamDefaultController=function(){function e(r,t,i,o){if(_classCallCheck(this,e),IsWritableStream(r)===!1)throw new TypeError("WritableStreamDefaultController can only be constructed with a WritableStream instance");if(void 0!==r._writableStreamController)throw new TypeError("WritableStreamDefaultController instances can only be created by the WritableStream constructor");this._controlledWritableStream=r,this._underlyingSink=t,this._queue=[],this._started=!1,this._writing=!1,this._inClose=!1;var a=ValidateAndNormalizeQueuingStrategy(i,o);this._strategySize=a.size,this._strategyHWM=a.highWaterMark;var l=WritableStreamDefaultControllerGetBackpressure(this);l===!0&&WritableStreamUpdateBackpressure(r,l);var n=this,s=InvokeOrNoop(t,"start",[this]);Promise.resolve(s).then(function(){n._started=!0,WritableStreamDefaultControllerAdvanceQueueIfNeeded(n)},function(e){WritableStreamDefaultControllerErrorIfNeeded(n,e)}).catch(rethrowAssertionErrorRejection)}return _createClass(e,[{key:"error",value:function(e){if(IsWritableStreamDefaultController(this)===!1)throw new TypeError("WritableStreamDefaultController.prototype.error can only be used on a WritableStreamDefaultController");var r=this._controlledWritableStream._state;if("closed"===r||"errored"===r)throw new TypeError("The stream is "+r+" and so cannot be errored");WritableStreamDefaultControllerError(this,e)}}]),e}();

},{"./helpers.js":5,"./queue-with-sizes.js":6,"./utils.js":2}]},{},[1])(1)
});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],20:[function(require,module,exports){
module.exports = require("./zen-observable.js").Observable;

},{"./zen-observable.js":21}],21:[function(require,module,exports){
'use strict'; (function(fn, name) { if (typeof exports !== 'undefined') fn(exports, module); else if (typeof self !== 'undefined') fn(name === '*' ? self : (name ? self[name] = {} : {})); })(function(exports, module) { // === Symbol Support ===

function hasSymbol(name) {
  return typeof Symbol === "function" && Boolean(Symbol[name]);
}

function getSymbol(name) {
  return hasSymbol(name) ? Symbol[name] : "@@" + name;
}

// Ponyfill Symbol.observable for interoperability with other libraries
if (typeof Symbol === "function" && !Symbol.observable) {
  Symbol.observable = Symbol("observable");
}

// === Abstract Operations ===

function getMethod(obj, key) {
  var value = obj[key];

  if (value == null)
    return undefined;

  if (typeof value !== "function")
    throw new TypeError(value + " is not a function");

  return value;
}

function getSpecies(obj) {
  var ctor = obj.constructor;
  if (ctor !== undefined) {
    ctor = ctor[getSymbol("species")];
    if (ctor === null) {
      ctor = undefined;
    }
  }
  return ctor !== undefined ? ctor : Observable;
}

function addMethods(target, methods) {
  Object.keys(methods).forEach(function(k) {
    var desc = Object.getOwnPropertyDescriptor(methods, k);
    desc.enumerable = false;
    Object.defineProperty(target, k, desc);
  });
}

function cleanupSubscription(subscription) {
  // Assert:  observer._observer is undefined

  var cleanup = subscription._cleanup;

  if (!cleanup)
    return;

  // Drop the reference to the cleanup function so that we won't call it
  // more than once
  subscription._cleanup = undefined;

  // Call the cleanup function
  cleanup();
}

function subscriptionClosed(subscription) {
  return subscription._observer === undefined;
}

function closeSubscription(subscription) {
  if (subscriptionClosed(subscription))
    return;

  subscription._observer = undefined;
  cleanupSubscription(subscription);
}

function cleanupFromSubscription(subscription) {
  return function() { subscription.unsubscribe() };
}

function Subscription(observer, subscriber) {
  // Assert: subscriber is callable

  // The observer must be an object
  if (Object(observer) !== observer)
    throw new TypeError("Observer must be an object");

  this._cleanup = undefined;
  this._observer = observer;

  var start = getMethod(observer, "start");

  if (start)
    start.call(observer, this);

  if (subscriptionClosed(this))
    return;

  observer = new SubscriptionObserver(this);

  try {
    // Call the subscriber function
    var cleanup$0 = subscriber.call(undefined, observer);

    // The return value must be undefined, null, a subscription object, or a function
    if (cleanup$0 != null) {
      if (typeof cleanup$0.unsubscribe === "function")
        cleanup$0 = cleanupFromSubscription(cleanup$0);
      else if (typeof cleanup$0 !== "function")
        throw new TypeError(cleanup$0 + " is not a function");

      this._cleanup = cleanup$0;
    }
  } catch (e) {
    // If an error occurs during startup, then attempt to send the error
    // to the observer
    observer.error(e);
    return;
  }

  // If the stream is already finished, then perform cleanup
  if (subscriptionClosed(this))
    cleanupSubscription(this);
}

addMethods(Subscription.prototype = {}, {
  get closed() { return subscriptionClosed(this) },
  unsubscribe: function() { closeSubscription(this) },
});

function SubscriptionObserver(subscription) {
  this._subscription = subscription;
}

addMethods(SubscriptionObserver.prototype = {}, {

  get closed() { return subscriptionClosed(this._subscription) },

  next: function(value) {
    var subscription = this._subscription;

    // If the stream is closed, then return undefined
    if (subscriptionClosed(subscription))
      return undefined;

    var observer = subscription._observer;
    var m = getMethod(observer, "next");

    // If the observer doesn't support "next", then return undefined
    if (!m)
      return undefined;

    // Send the next value to the sink
    return m.call(observer, value);
  },

  error: function(value) {
    var subscription = this._subscription;

    // If the stream is closed, throw the error to the caller
    if (subscriptionClosed(subscription))
      throw value;

    var observer = subscription._observer;
    subscription._observer = undefined;

    try {
      var m$0 = getMethod(observer, "error");

      // If the sink does not support "error", then throw the error to the caller
      if (!m$0)
        throw value;

      value = m$0.call(observer, value);
    } catch (e) {
      try { cleanupSubscription(subscription) }
      finally { throw e }
    }

    cleanupSubscription(subscription);
    return value;
  },

  complete: function(value) {
    var subscription = this._subscription;

    // If the stream is closed, then return undefined
    if (subscriptionClosed(subscription))
      return undefined;

    var observer = subscription._observer;
    subscription._observer = undefined;

    try {
      var m$1 = getMethod(observer, "complete");

      // If the sink does not support "complete", then return undefined
      value = m$1 ? m$1.call(observer, value) : undefined;
    } catch (e) {
      try { cleanupSubscription(subscription) }
      finally { throw e }
    }

    cleanupSubscription(subscription);
    return value;
  },

});

function Observable(subscriber) {
  // The stream subscriber must be a function
  if (typeof subscriber !== "function")
    throw new TypeError("Observable initializer must be a function");

  this._subscriber = subscriber;
}

addMethods(Observable.prototype, {

  subscribe: function(observer) { for (var args = [], __$0 = 1; __$0 < arguments.length; ++__$0) args.push(arguments[__$0]); 
    if (typeof observer === 'function') {
      observer = {
        next: observer,
        error: args[0],
        complete: args[1],
      };
    }

    return new Subscription(observer, this._subscriber);
  },

  forEach: function(fn) { var __this = this; 
    return new Promise(function(resolve, reject) {
      if (typeof fn !== "function")
        return Promise.reject(new TypeError(fn + " is not a function"));

      __this.subscribe({
        _subscription: null,

        start: function(subscription) {
          if (Object(subscription) !== subscription)
            throw new TypeError(subscription + " is not an object");

          this._subscription = subscription;
        },

        next: function(value) {
          var subscription = this._subscription;

          if (subscription.closed)
            return;

          try {
            return fn(value);
          } catch (err) {
            reject(err);
            subscription.unsubscribe();
          }
        },

        error: reject,
        complete: resolve,
      });
    });
  },

  map: function(fn) { var __this = this; 
    if (typeof fn !== "function")
      throw new TypeError(fn + " is not a function");

    var C = getSpecies(this);

    return new C(function(observer) { return __this.subscribe({
      next: function(value) {
        if (observer.closed)
          return;

        try { value = fn(value) }
        catch (e) { return observer.error(e) }

        return observer.next(value);
      },

      error: function(e) { return observer.error(e) },
      complete: function(x) { return observer.complete(x) },
    }); });
  },

  filter: function(fn) { var __this = this; 
    if (typeof fn !== "function")
      throw new TypeError(fn + " is not a function");

    var C = getSpecies(this);

    return new C(function(observer) { return __this.subscribe({
      next: function(value) {
        if (observer.closed)
          return;

        try { if (!fn(value)) return undefined }
        catch (e) { return observer.error(e) }

        return observer.next(value);
      },

      error: function(e) { return observer.error(e) },
      complete: function() { return observer.complete() },
    }); });
  },

  reduce: function(fn) { var __this = this; 
    if (typeof fn !== "function")
      throw new TypeError(fn + " is not a function");

    var C = getSpecies(this);
    var hasSeed = arguments.length > 1;
    var hasValue = false;
    var seed = arguments[1];
    var acc = seed;

    return new C(function(observer) { return __this.subscribe({

      next: function(value) {
        if (observer.closed)
          return;

        var first = !hasValue;
        hasValue = true;

        if (!first || hasSeed) {
          try { acc = fn(acc, value) }
          catch (e) { return observer.error(e) }
        } else {
          acc = value;
        }
      },

      error: function(e) { observer.error(e) },

      complete: function() {
        if (!hasValue && !hasSeed) {
          observer.error(new TypeError("Cannot reduce an empty sequence"));
          return;
        }

        observer.next(acc);
        observer.complete();
      },

    }); });
  },

  flatMap: function(fn) { var __this = this; 
    if (typeof fn !== "function")
      throw new TypeError(fn + " is not a function");

    var C = getSpecies(this);

    return new C(function(observer) {
      var completed = false;
      var subscriptions = [];

      // Subscribe to the outer Observable
      var outer = __this.subscribe({

        next: function(value) {
          if (fn) {
            try {
              value = fn(value);
            } catch (x) {
              observer.error(x);
              return;
            }
          }

          // Subscribe to the inner Observable
          Observable.from(value).subscribe({
            _subscription: null,

            start: function(s) { subscriptions.push(this._subscription = s) },
            next: function(value) { observer.next(value) },
            error: function(e) { observer.error(e) },

            complete: function() {
              var i = subscriptions.indexOf(this._subscription);

              if (i >= 0)
                subscriptions.splice(i, 1);

              closeIfDone();
            }
          });
        },

        error: function(e) {
          return observer.error(e);
        },

        complete: function() {
          completed = true;
          closeIfDone();
        }
      });

      function closeIfDone() {
        if (completed && subscriptions.length === 0)
          observer.complete();
      }

      return function() {
        subscriptions.forEach(function(s) { return s.unsubscribe(); });
        outer.unsubscribe();
      };
    });
  },

});

Object.defineProperty(Observable.prototype, getSymbol("observable"), {
  value: function() { return this },
  writable: true,
  configurable: true,
});

addMethods(Observable, {

  from: function(x) {
    var C = typeof this === "function" ? this : Observable;

    if (x == null)
      throw new TypeError(x + " is not an object");

    var method = getMethod(x, getSymbol("observable"));

    if (method) {
      var observable$0 = method.call(x);

      if (Object(observable$0) !== observable$0)
        throw new TypeError(observable$0 + " is not an object");

      if (observable$0.constructor === C)
        return observable$0;

      return new C(function(observer) { return observable$0.subscribe(observer); });
    }

    if (hasSymbol("iterator") && (method = getMethod(x, getSymbol("iterator")))) {
      return new C(function(observer) {
        for (var __$0 = (method.call(x))[Symbol.iterator](), __$1; __$1 = __$0.next(), !__$1.done;) { var item$0 = __$1.value; 
          observer.next(item$0);
          if (observer.closed)
            return;
        }

        observer.complete();
      });
    }

    if (Array.isArray(x)) {
      return new C(function(observer) {
        for (var i$0 = 0; i$0 < x.length; ++i$0) {
          observer.next(x[i$0]);
          if (observer.closed)
            return;
        }

        observer.complete();
      });
    }

    throw new TypeError(x + " is not observable");
  },

  of: function() { for (var items = [], __$0 = 0; __$0 < arguments.length; ++__$0) items.push(arguments[__$0]); 
    var C = typeof this === "function" ? this : Observable;

    return new C(function(observer) {
      for (var i$1 = 0; i$1 < items.length; ++i$1) {
        observer.next(items[i$1]);
        if (observer.closed)
          return;
      }

      observer.complete();
    });
  },

});

Object.defineProperty(Observable, getSymbol("species"), {
  get: function() { return this },
  configurable: true,
});

exports.Observable = Observable;


}, "*");
},{}],22:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var errStr = "No Observable implementation found";
function noop() {}

var _global = {},

// Default defj
_Observable = function _Observable() {
  throw new Error(errStr);
};

_Observable.prototype.subscribe = noop;
_Observable.prototype.of = noop;
_Observable.prototype.from = noop;

if (typeof window !== "undefined" && !!window.Observable) {
  _global = window;
  _Observable = window.Observable;

  // Assume node or browserify-like environment
} else if (!!global.Observable) {

  _global = global;
  _Observable = global.Observable;
}

if (!(_global.Observable = _Observable)) {
  // Try loading a shim
  try {
    _Observable = require("zen-observable");
  } catch (e) {
    console.log(errStr);
    global.Observable = _Observable;
  }
}

exports.default = _Observable;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"zen-observable":20}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toPromise = exports.toObservable = undefined;

var _core = require("@pipes/core");

var _core2 = _interopRequireDefault(_core);

var _observable = require("./observable");

var _observable2 = _interopRequireDefault(_observable);

var _promise = require("./promise");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Exports
exports.toObservable = _observable2.default;
exports.toPromise = _promise2.default;

// Default exports

var fns = {
  toObservable: _observable2.default,
  toPromise: _promise2.default
};

exports.default = fns;
},{"./observable":24,"./promise":25,"@pipes/core":10}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toObservable;

var _observable = require("../shim/observable");

var _observable2 = _interopRequireDefault(_observable);

var _streams = require("@pipes/core/streams");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
function toObservable(stream) {
  var pump = observablePump.bind(null, stream),
      observable = new _observable2.default(pump);

  return observable;
}

function observablePump(stream, observer) {
  var reader = stream.getReader();

  // Start pump
  pump();

  // When observable is cancelled, cancel upstream readable
  return function (_) {
    reader.releaseLock();
    stream.cancel("Downstream observable cancelled");
  };

  function pump() {
    return reader.read().then(function (_ref) {
      var value = _ref.value,
          done = _ref.done;

      if (done) {
        return observer.complete();
      }

      // Enqueue and repeat
      observer.next(value);
      pump();
    });
  }
}

// Browserify compat
if (typeof module !== "undefined")
  // $FlowFixMe
  module.exports = toObservable;
},{"../shim/observable":22,"@pipes/core/streams":17}],25:[function(require,module,exports){
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

function reducer(array, value) {
  array.unshift(value);
  return array;
}

// Browserify compat
if (typeof module !== "undefined")
  // $FlowFixMe
  module.exports = toPromise;
},{"@pipes/core/accumulate":6,"@pipes/core/streams":17}]},{},[5]);
