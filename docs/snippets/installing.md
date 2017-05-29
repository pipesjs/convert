### For browsers

The library depends on [@pipes/core](https://github.com/pipesjs/core), so make sure you include it in before including the library.

You can use either of the builds from the `dist` folder:

```html
    <script src="path/to/web-streams-polyfill.js"></script>
    <script src="path/to/pipes.convert.js"></script>
```

And in your code, all the functions will be available on the `window.Pipes.convert` variable.

```javascript

    let { toNodeStream, fromIterable } = window.Pipes.convert;
```

### For browserify users

The library has a [peer-dependency](https://nodejs.org/en/blog/npm/peer-dependencies/) on [@pipes/core](https://github.com/pipesjs/core), so to install it:

```bash

    npm install @pipes/core @pipes/convert

```

The library is split up into modules, so you can both require the whole library or only parts of it:

```javascript

    let { fromIterable } = require("@pipes/convert");
    let fromIterable = require("@pipes/convert/fromIterable");

    let fromIterable = require("@pipes/convert/from/iterable");
```

### For ES6 and Rollup users

If you want, you can directly import the es6 modules like so:

```javascript

    import pipesConvert from "@pipes/convert/src";
    import { fromIterable } from "@pipes/convert/src";
    import fromIterable from "@pipes/convert/src/fromIterable";

    import fromIterable from "@pipes/convert/src/from/iterable";
```
