import Pipes from "@pipes/core";

import fromIterable from "./iterable";
import fromObservable from "./observable";
import fromPromise from "./promise";

// Exports
export {
  fromIterable,
  fromObservable,
  fromPromise
};

// Default exports
const fns = {
  fromIterable,
  fromObservable,
  fromPromise
};

export default fns;
