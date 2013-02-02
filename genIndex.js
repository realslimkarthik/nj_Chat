var express = require('express');
var fs = require('fs');
var mysql = require('mysql');
var Mustache = require('./public/js/mustache');

var app = express(),
	http = require('http'),
	server = http.createServer(app),
	io = require('socket.io').listen(server);

server.listen(8888);

var connection = mysql.createConnection({
    host: '',
    user: '',
    password: '',
    database: ''
});

app.use(express.bodyParser());

app.get('/', function(req, res) {
		res.sendfile('./index.html');
		console.log("Request receieved: " + req.route);
	});

app.get('/static', function(req, res) {
	console.log("File Requested: " + req.param('file'));
	if(req.param('file').indexOf('.css') + 1)
		res.sendfile('./public/css/' + req.param('file'));
	else if(req.param('file').indexOf('.js') + 1)
		res.sendfile('./public/js/' + req.param('file'));
});

app.get('/check', function(req, res) {
	var uname = req.param('username');
	console.log(uname);
	var data = {username: uname};
	connection.query('SELECT * FROM user where username = ?', data['username'], function(err, rows) {
		if(err) throw err;
		console.log(rows[0]);
		var yon;
		if(rows[0] == undefined)
			yon = 0;
		else
			yon = 1;
		console.log("Request received to check username");
		console.log("Username found?" + yon);
		res.json({yn: yon});
	});
});

app.get('/welcome', function(req, res) {
	var name = fs.readFileSync("./welcome.html");
	var data = {username: req.param('username')};

	var html = Mustache.render(String(name), data);
	res.send(html);
});

app.post('/createUser', function(req, res) {
	var data = {username: req.param('username')};

	connection.query('INSERT INTO user SET ?', data);

	connection.query('SELECT * from rooms', function(err, rows) {
        if(err) throw err;
        console.log("the available rooms are " + rows[0]['roomname']);
        if(rows[0]!=undefined) {
            roomName = [];
            rows.forEach(function(row) {
                roomName.push(row['roomname']);
            });
            data = {username: data['username'], rooms: roomName};
        }
        else
            data = {username: data['username'], rooms: ""};
        console.log("this is received: " + data);
	});
	res.redirect('/welcome?username=' + data['username']);
});

app.post('/createRoom', function(req, res) {
	var data = {roomname: req.param('cRoom')};

	connection.query('INSET INTO rooms SET?', data);
});
