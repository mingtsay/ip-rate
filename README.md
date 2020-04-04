# Koa IP Rate Limitation

IP rate limitation middleware for Koa

## Example

```js
var ipRate = require('ip-rate')
var Koa = require('koa')

var app = new Koa()
app.use(ipRate({
  filter: function (ctx) {
    return !/^(127\.|10\.0\.)/i.test(ctx.ip)
  },
  threshold: 2000,
  windowMs: 60000 // 1 minute
}))
```

## Options

### filter

An optional function that checks the request to decide whether to limit.
By default, it limits all requests.

### store

The storage to use when persisting rate limit attempts.
By default, the `memory-store.js` is used.

You may also create your own store. It must implement the following in order to function:

```js
const MyCustomStore = () => {
  /**
   * Increments the value in the underlying store for the given key.
   * @method function
   * @param {string} key - The key to use as the unique identifier passed down from RateLimit.
   * @param {Function} cb - The callback issued when the underlying store is finished.
   *
   * The callback should be called with three values:
   *  - error (usually null)
   *  - hitCount for this IP
   *  - resetTime - JS Date object
   */
  this.increment = (key, cb) => {
    // increment storage
    cb(null, hits, resetTime);
  }
}
```

### threshold

Maximum allowed IPs per window.
Default `1000` IPs or `1k`.

### windowMs

The period of a window.
Default `3600000` (1 hour).

## Remote Address

If you are running your app behind nginx, enable `app.proxy` in your app:
```js
app.proxy = true
```

Also set the `X-Forwarded-For` header in nginx:

```
location / {
    proxy_pass http://app;
    proxy_set_header Host $host:$server_port;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```
