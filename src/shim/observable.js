// @flow

const errStr = "No Observable implementation found";
function noop () {}

let _global = {},
  // Default defj
  _Observable = function _Observable() {
    throw new Error( errStr );
  };

_Observable.prototype.subscribe = noop;
_Observable.prototype.of = noop;
_Observable.prototype.from = noop;

if ( typeof window !== "undefined" && !!window.Observable ) {
  _global = window;
  _Observable = window.Observable;

  // Assume node or browserify-like environment
} else if ( !!global.Observable ) {

  _global = global;
  _Observable = global.Observable;
}

if ( !(_global.Observable = _Observable) ) {
  // Try loading a shim
  try {
    _Observable = require("zen-observable");

  } catch (e) {
    console.log( errStr );
    global.Observable = _Observable;
  }
}

export default _Observable;
