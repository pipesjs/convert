The `convert` library consists of the following functions:

**Set up code for examples**

```javascript

  // Setup
  let createReadable = data => new ReadableStream({
      start (controller) {
      this.data = data || [1,2,3];

      // Kickstart stream
      controller.enqueue( this.data.pop() );
      },
      pull (controller) {
      if ( !this.data.length )
          return controller.close()

      controller.enqueue( this.data.pop() );
      }
  }),
  createWritable = () => new WritableStream({
      write (chunk) {
      console.log( chunk );
      }
  });
```
