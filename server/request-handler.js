var dataStorage = [];
var fs = require('fs');
var util = require('util');
var storageFilename = 'storage.txt';
var loadStorage = function () {
  var flags = 'r';

  fs.exists(storageFilename, function(exists) {
    if (exists) {
      fs.stat(storageFilename, function(err, stats) {
        fs.open(storageFilename, flags, function(err, fd) {
          var buffer = new Buffer(stats.size);

          // Read from local file
          fs.read(fd, buffer, 0, buffer.length, null, function (err, bytesRead, buffer) {
            if (buffer.length !== 0) {
              var data = buffer.toString('utf8', 0, buffer.length);
              dataStorage = JSON.parse(data);
            }
            fs.close(fd, function(err) {
              if (err) {
                console.log(err);
              }
            });
          });
        });
      });
    }
  });
}(); 

var requestHandler = function(request, response) {
  var getFile = function(filename, contentType) {  
    var statusCode = 200;
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = contentType;
    response.writeHead(statusCode, headers);

    fs.exists(storageFilename, function(exists) {
      if (exists) {
        fs.stat(filename, function(err, stats) {
          if (stats.isFile()) {
            var statsString = util.inspect(stats);

            fs.open(filename, flags, function(err, fd) {
              var buffer = new Buffer(stats.size);

              fs.read(fd, buffer, 0, buffer.length, null, function(err, bytesRead, buffer) {
                var data = buffer.toString('utf8', 0, buffer.length);
                response.write(data);   
                response.end();
                
                fs.close(fd, function(err) {
                  if (err) {
                    console.log(err);
                  } 
                }); //end fs.read()
              });
              
            });//end fs.open() 
          }//end stats.isFile()
        });//end fs.stats()
      }
    });
  };
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  if (request.url === '/') {
    var filename = '../client/index.html';
    var flags = 'r';

    getFile(filename, 'text/html');
  
  } else if (request.url.match(/^\/styles/)) {
    var filename = '../client' + request.url;
    var flags = 'r';

    getFile(filename, 'text/css');
  } else if (request.url.match(/^\/bower_components/)) {
    var filename = '../client' + request.url;
    var flags = 'r';

    getFile(filename, 'application/javascript');

  } else if (request.url.match(/^\/scripts/)) {
    var filename = '../client' + request.url;
    var flags = 'r';

    getFile(filename, 'application/javascript');

  } else if (request.url.match(/^\/images/)) {
    var filename = '../client' + request.url;
    var flags = 'r';

    getFile(filename, 'image/gif');

  } else if (request.url.match(/^\/classes\/messages/)) {
    if (request.method === 'GET' || request.method === 'OPTIONS') {
      var statusCode = 200;
      var headers = defaultCorsHeaders;
      headers['Content-Type'] = 'application/json';
      var obj = {
        results: dataStorage
      };

      response.writeHead(statusCode, headers);
      response.write(JSON.stringify(obj));
      response.end();
    } else if (request.method === 'POST') {

      var statusCode = 201;
      var headers = defaultCorsHeaders;
      headers['Content-Type'] = 'application/json';
      response.writeHead(statusCode, headers);

      var body = [];
      request.on('data', function(chunk) {
        body.push(chunk);
      }).on('end', function() {
        body = Buffer.concat(body).toString();
        dataStorage.push(JSON.parse(body));

        // If the storage file does not exist
        fs.open(storageFilename, 'w', function(err, fd) {
          // Append data to storageFile
          fs.write(fd, JSON.stringify(dataStorage), function(err) {
            if (err) {
              console.log(err);
            }
            fs.close(fd, function(err) {
              if (err) {
                console.log(err);
              }
            });
          });
        }); 
      });
      response.end();
    }
  } else {
    var statusCode = 404;
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = 'application/json';

    response.writeHead(statusCode, headers);    
    response.end();
  }
};


var requestHandlerStub = function(request, response) {
  // Check url routing for classess/message
  if (request.url === '/classes/messages') {
    if (request.method === 'GET') {
      var statusCode = 200;
      var headers = defaultCorsHeaders;
      headers['Content-Type'] = 'application/json';
      var obj = {
        results: dataStorage
      };
      
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(obj));
    } else if (request.method === 'POST') { 
      var statusCode = 201;
      var headers = defaultCorsHeaders;
      headers['Content-Type'] = 'application/json';
      response.writeHead(statusCode, headers);
      var body = [];
      request.on('data', function(chunk) {
        body.push(chunk);
      });
      request.on('end', function(chunk) {
        body = Buffer.concat(body).toString();
        dataStorage.push(JSON.parse(body));
      });
      response.end('Success');
    }
  } else if (request.url === '/classes/room') {
    if (request.method === 'GET') {
      var statusCode = 200;
      var headers = defaultCorsHeaders;
      headers['Content-Type'] = 'application/json';
      var obj = {
        results: dataStorage
      };
      
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(obj));
    } else if (request.method === 'POST') {
      var statusCode = 201;
      var headers = defaultCorsHeaders;
      headers['Content-Type'] = 'application/json';
      response.writeHead(statusCode, headers);

      var body = [];
      request.on('data', function(chunk) {
        body.push(chunk);
      });
      request.on('end', function() {
        body = Buffer.concat(body).toString();
        dataStorage.push(JSON.parse(body));
      });
      response.end();

    }
  } else {
    var statusCode = 404;
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = 'application/json';

    response.writeHead(statusCode, headers);    
    response.end();
  }
};

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

exports.requestHandler = requestHandlerStub;
exports.handler = requestHandler;

