import Pipes from "@pipes/core";

import {
  fromIterable,
  fromObservable,
  fromPromise
} from "./from";

import {
  toObservable,
  toPromise
} from "./to";

// Exports
export {
  toObservable,
  toPromise,
  fromIterable,
  fromObservable,
  fromPromise
};

// Default exports
const fns = {
  toObservable,
  toPromise,
  fromIterable,
  fromObservable,
  fromPromise
};

// Export to window
if ( typeof window !== "undefined") {
  window.Pipes = window.Pipes || Pipes;
  window.Pipes.convert = window.Pipes.convert || {};
  Object.assign( window.Pipes.convert, fns );
}

export default fns;
