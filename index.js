var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/welcome"] = requestHandlers.welcome;
handle["/js"] = requestHandlers.js;
handle["/css"] = requestHandlers.css;
handle["/converse"] = requestHandlers.converse;
handle["/talk"] = requestHandlers.talk;
handle["/check"] = requestHandlers.check;

server.start(router.route, handle);