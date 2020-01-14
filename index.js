
// Get JSON response from URL.
function getJson(url, opt) {
  return new Promise((fres, frej) => {
    getBody(url, opt, (err, ans) => err? frej(err):fres(JSON.parse(ans)));
  });
}
// Get text response (body) from URL.
function getBody(url, opt, fn) {
  var req = https.request(url, opt||{}, res => {
    var code = res.statusCode, body = '';
    if(code>=400) { res.resume(); return fn(new Error(`Request to ${url} returned ${code}`)); }
    if(code>=300 && code<400) return getBody(res.headers.location, opt, fn);
    res.on('error', fn);
    res.on('data', b => body+=b);
    res.on('end', () => fn(null, body));
  });
  req.on('error', fn);
  req.end();
}
