/****** DRAWING SERVER *****
 this part takes the processed coords/etc data and produces
 the video file and forwards the data to the student client
 side code which draws the livestream
 ***************************/

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket) {
    console.log('made connection');
    socket.on('processedData', function(data) {
	console.log(data);
	// forward to studentside livestream
	//@Gabe this you

	//generate video file
    });
});

http.listen(7000, function() {
    console.log('listening on port 7000');
});
