/*
 * Primary file for the API
 *
 */

// Dependencies
var http = require('http');
var url = require('url');
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

    // Send the response
    res.end("Hello World! \n");

    // Log the request path
    console.log("requested path " + trimmedPath + " with method: " + httpMethod + " and with these query string parameters: ", queryStringObject);
});

// Start the server, and have it listen on port 3000
server.listen(3000, function(){
    console.log("Server listening on port 3000");
});