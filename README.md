# Koa IP Rate Limitation

IP rate limitation middleware for Koa

## Example

```js
var ipRate = require('ip-rate')
var Koa = require('koa')

var app = new Koa()
app.use(ipRate({
  filter: function (ip) {
    return !/^(fe80::|10.0.)/i.test(ip)
  },
  threshold: 2000
}))
```

## Options

### filter

An optional function that checks the remote address to decide whether to limit.
By default, it limits all requests.

### threshold

Maximum allowed IPs per hour.
Default `1000` IPs or `1k`.

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
