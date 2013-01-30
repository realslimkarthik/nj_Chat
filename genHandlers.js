var fs = require('fs');
var Mustache = require("./public/js/mustache");
var querystring = require("querystring");
var socket = require("socket.io");
var fs = require("fs");
var path = require("path");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: '',
    user: '',
    password: '',
    database: ''
});

//var index = fs.welcomeFileSync("index.html");
var chat_body = "<html>" +
    "<head>" +
    "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />" +
    "</head>" +
    "<body>" +
    "<p>{{hello}}</p>" +
    "</body>" +
    "</html>";


function start(response, getData) {
    call();
    
        response.writeHead(200, {"Content-Type": "text/html"});
        var index = fs.readFile("./index.html", function(error, content) {
            if(error) {
                response.writeHead(500);
                response.end();
            } else {
                response.writeHead(200, {"Content-Type": "text/html"});
                response.end(content, "utf-8");
            }
        });
}

function check(response, getData) {
    call();

    getData = querystring.parse(getData);
    var yon;
    connection.query("SELECT * from user WHERE username = ?", getData['username'] , function(err, rows) {
        if (err) throw err;
        if(rows[0] == undefined)
            yon = 0;
        else
            yon = 1;
        console.log(yon);
        var data = {};
        data = {yn: yon};
        data = JSON.stringify(data);
        console.log("Request received to check username");

        response.writeHead(200, {"Content-Type": "text/json"});
        response.end(data, "utf-8");
    });
}

function welcome(response, getData) {
    call();
    var name;
    name = fs.readFileSync("./welcome.html");

    getData = querystring.parse(getData);
    var data = {};
    connection.query('INSERT INTO user SET?', getData);

    connection.query('SELECT * from rooms', function(err, rows) {
        if(err) throw err;
        console.log("the available rooms are " + rows[0]['roomname']);
        if(rows[0]!=undefined) {
            roomName = [];
            rows.forEach(function(row) {
                roomName.push(row['roomname']);
            });
            data = {username: getData['username'], rooms: roomName};
        }
        else
            data = {username: getData['username'], rooms: ""};
        var html = Mustache.render(String(name), data);
        console.log("this is received: " + getData);

        response.writeHead(200, {"Content-Type": "text/html"});
        response.end(html, "utf-8");
    });
}

function converse(response, getData) {
    call();
    getData = querystring.parse(getData);
    response.writeHead(200, {"Content-Type": "text/html"});
    var contents = fs.readFileSync("./converse.html");
    var html = Mustache.to_html(String(contents), getData)
    response.end(html, "utf-8");
}

function chat(response, getData) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    getData = querystring.parse(getData);
}

function talk(response, getData) {
    call();

    response.writeHead(200, {"Content-Type": "text/plain"});
    getData = querystring.parse(getData);
    var json = "{ \"sender\": \"" + getData["sender"] + "\", \"message\": \"" + getData["message"] + "\" }";
    response.end(json, "utf-8");
    console.log("this is sent:" + json);
}

function js(response, fileName) {
    call();
    
    response.writeHead(200, {"Content-Type": "text/javascript"});
    fileName = "." + fileName;
    response.write(fs.readFileSync(fileName));
    response.end();
}

function css(response, fileName) {
    call();
    
    response.writeHead(200, {"Content-Type": "text/css"});
    fileName = "." + fileName;
    response.write(fs.readFileSync(fileName));
    response.end();
}

function call() {
    console.log("Request handler '" + call.caller.name + "' was called");
}

exports.start = start;
exports.welcome = welcome;
exports.js = js;
exports.css = css;
exports.talk = talk;
exports.converse = converse;
exports.check = check;
