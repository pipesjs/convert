"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require("@pipes/core");

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Exports
// export {
// };

// Default exports
var fns = {};

// Export to window
if (typeof window !== "undefined") window.Pipes = window.Pipes || _core2.default;
Object.assign(window.Pipes, {
  conver: fns
});

exports.default = fns;