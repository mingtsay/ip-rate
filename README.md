# Koa IP Rate Limitation

IP rate limitation middleware for Koa

## Example

```js
var ipRate = require('ip-rate')
var Koa = require('koa')

var app = new Koa()
app.use(ipRate({
  filter: function (content_type) {
  	return /text/i.test(content_type)
  },
  threshold: 2000
}))
```

## Options

### filter

An optional function that checks the response content type to decide whether to limit.
By default, it limits all requests.

### threshold

Maximum allowed IPs per hour.
Default `1000` IPs or `1k`.

## Manually turning limitation on and off

You can always enable limitation by setting `this.limit = true`.
You can always disable limitation by setting `this.limit = false`.
This bypasses the filter check.

```js
app.use((ctx, next) => {
  ctx.limit = true
  ctx.body = fs.createReadStream(file)
})
```
