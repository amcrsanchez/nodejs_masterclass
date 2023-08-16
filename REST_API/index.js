/*
 * Primary file for the API
 *
 */

// Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var fs = require('fs');
var _data = require('./lib/data')

// @TODO delete this
_data.delete('test','newFile',function(err, data){
    console.log("this was the error: " + err);
});

// The server should respond to all request with a string
var httpServer = http.createServer(function(req,res){
    serverLogic(req,res);
});


var httpsOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
};
var httpsServer = https.createServer(httpsOptions, function(req,res){
    serverLogic(req, res);
});

var serverLogic =  function(req, res){
    // Get the url and parse it
    var parsedUrl = url.parse(req.url, true);

    // Get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,"");

    // Get the HTTP method
    var httpMethod = req.method.toLowerCase();

    // Get query string parameters
    var queryStringObject = parsedUrl.query;

    // Get the headers
    var headers = req.headers;

    // Get the payload if any
    var decoder = new StringDecoder('utf-8')
    var buffer = ''
    req.on('data', function(data){
        buffer = decoder.write(data)
    })

    req.on('end', function(){

        // Choose the handler this request should to go to
        // If one is not found, use the not found handler
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound


        //Construct the data object to send to the handler
        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': httpMethod,
            'headers': headers,
            'payload': buffer
        };

        // Route the request to the handler specified in the router
        chosenHandler(data, function(statusCode, payload){
            // Use the status code called back by the handler, or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // Use the payload called back by the handler, or default to empty object
            payload = typeof(payload) == 'object' ? payload : {};

            // Convert the payload to a string
            var payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log the request path
            console.log('returning this response:', statusCode, payloadString);
        });

    })
};

// Start the HTTP server
httpServer.listen(config.httpPort, function(){
    console.log(`Server listening on port ${config.httpPort} on ${config.envName} mode`);
});

// Start the HTTPS server
httpsServer.listen(config.httpsPort, function(){
    console.log(`Server listening on port ${config.httpsPort} on ${config.envName} mode`);
});

// Define the handlers
var handlers = {};

// Sample handler
handlers.ping = function(data, callback){
    // 200 status code response to check if server is alive
    callback(200);
}

// Not found handler
handlers.notFound = function(data, callback){
    callback(404);
}

// Define a request router
var router = {
    "ping": handlers.ping
}