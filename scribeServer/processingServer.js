var express = require('express');
var app = express();
var http = require('http').Server(app);
var client = require('socket.io-client');
var drawServSocket = client.connect('http://localhost:7000'); //connection to drawingServer
var io = require('socket.io')(http); //connection to hw

//listen for raw data from hw
io.on('connection', function(socket){
    console.log('made connection');
    socket.on('rawData', function(data) {
	console.log(data);
	//process the data
	//@Nitsan it you
	

	/* drawing server expects:
	    start {draw, erase}
	      then
	    coords (in the form (x,y,t))
	      then
	    end

	    and (-1,-1,t) for not-drawing/erasing to fill out
	      time in the animation for cases like draw a thing,
	      wait a bit, draw another thing
	 */
	var pData = Math.random(); //placeholder to test the connections
	drawServSocket.emit('processedData', pData);
    });
});

http.listen(8000, function() {
    console.log('listening on port 8000');
});
