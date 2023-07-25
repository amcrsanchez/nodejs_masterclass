/*
 * Primary file for the API
 *
 */

// Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

// The server should respond to all request with a string
var server = http.createServer(function(req,res){
    
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
            res.end("Hello World!");

            // Log the request path
            console.log('returning this response:', statusCode, payloadString);
        });

    })

});


// Start the server, and have it listen on port 3000
server.listen(3000, function(){
    console.log("Server listening on port 3000");
});

// Define the handlers
var handlers = {};

// Sample handler
handlers.sample = function(data, callback){
    // Callback a http status code, and a payload object
    callback(406, {'name': 'Sample handler'});
}

// Not found handler
handlers.notFound = function(data, callback){
    callback(404);
}

// Define a request router
var router = {
    "sample": handlers.sample
}