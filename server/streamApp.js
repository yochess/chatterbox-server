var stream = require('stream');

var requestHandler = function(request, response) {
  var body = 'test';
  request.setEncoding('utf8');

  request.on('data', function(chunk) {
    body += chunk;
  });

  request.on('end', function() {
    try {
      var data = body;
    } catch (err) {
      response.statusCode = 400;
      return response.end('error: ' + err.message);
    }

    response.write('test');
    response.end();
  });
};

exports.handler = requestHandler;