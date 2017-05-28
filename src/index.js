import Pipes from "@pipes/core";

// Exports
// export {
// };

// Default exports
const fns = {
};

// Export to window
if ( typeof window !== "undefined")
  window.Pipes = window.Pipes || Pipes;
  Object.assign( window.Pipes, {
    conver: fns
  });

export default fns;
