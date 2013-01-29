var url = require('url');

function route(handle, pathName, response, getData) {
	console.log("Routing a request for " + pathName);
	if(typeof(handle[pathName]) === "function")
        handle[pathName](response, getData);
    else if(pathName.indexOf(".js")!=-1)
        handle['/js'](response, pathName);
    else if(pathName.indexOf(".css")!=-1)
        handle['/css'](response, pathName);
    else {
        console.log("No request handler found for " + pathName);
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404\nPage Not Found");
        response.end();
    }
}

exports.route = route;