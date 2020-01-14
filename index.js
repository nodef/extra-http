const http = require('http');
const https = require('https');


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

function get(url, opt, fn) {
  var protocol = getProtocol(url, opt);
  return protocol==='http:'? http.get(url, opt, fn) : https.get(url, opt, fn);
}

function request(url, opt, fn) {
  var protocol = getProtocol(url, opt);
  return protocol==='http:'? http.request(url, opt, fn) : https.request(url, opt, fn);
}

function getProtocol(url, opt) {
  if(typeof opt==='object' && opt) return opt.protocol;
  if(typeof url==='object') return url.protocol;
  if(url.includes(':')) return url.substring(0, url.indexOf(':')+1);
  return 'http:';
}
module.exports = Object.assign({}, http, {request, get});
