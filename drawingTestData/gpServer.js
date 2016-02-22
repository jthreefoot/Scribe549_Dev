var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var fs = require('fs');

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname+'/getPoints.html'));
});

io.on('connection', function(socket) {
    console.log('a user connected\n');
    socket.on('client_data', function(data) {
	//console.log(data.coord);
	fs.appendFile('tmp.txt', data.coord+'\n', function(err) {
	    if (err) return console.log(err);
	});
    });
});

http.listen(7000, function() {
    console.log('listening on port 7000');
});
