import Pipes from "@pipes/core";

import toObservable from "./observable";
import toPromise from "./promise";

// Exports
export {
  toObservable,
  toPromise
};

// Default exports
const fns = {
  toObservable,
  toPromise
};

export default fns;
