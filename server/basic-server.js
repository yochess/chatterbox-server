var http = require('http');
var handleRequest = require('./request-handler');
// for use with stream -> var handleRequest = require('./streamApp');
var port = 3000;
var ip = '127.0.0.1';

var server = http.createServer(handleRequest.handler);
console.log('Listening on http://' + ip + ':' + port);
server.listen(port, ip);
