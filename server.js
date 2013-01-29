var http = require("http");
var url = require("url");
var io = require("socket.io");

function start(route, handle) {
	function onRequest(request, response) {
		var pathName = url.parse(request.url).pathname;
		var getData = "";

		console.log("Request received for " + pathName);

		if(url.parse(request.url).query != null)
		{
			getData = url.parse(request.url).query;
            console.log(getData);
		}
		request.setEncoding("utf-8");
        route(handle, pathName, response, getData);
	}

	var app = http.createServer(onRequest).listen(8888);
	console.log("Server started");

	io = io.listen(app);

	io.sockets.on("connect", function(socket) {
		console.log("Connection established");
		socket.on("receive", function(data) {
			console.log(data + " received");
			io.sockets.emit("chat", data);
		});
	});

}

exports.start = start;