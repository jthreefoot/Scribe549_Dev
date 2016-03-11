var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket) {
    console.log('made connection');
    socket.emit('test', 'testing 1 2 3');
    socket.on('data', function(data) {
	console.log(data);
    });
});

http.listen(7000, function() {
    console.log('listening on port 7000');
});
