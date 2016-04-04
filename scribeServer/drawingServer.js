/****** DRAWING SERVER *****
 this part takes the processed coords/etc data and produces
 the video file and forwards the data to the student client
 side code which draws the livestream
 ***************************/

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var fs = require('fs');

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname+'/clientCanvas.html'));
});

app.use(express.static('public'));

//ctx.beginPath();
//      ctx.rect(0,0,400,400);
//      ctx.fillStyle="white";
//      ctx.fill();
var dragStart = 0 
var dragEnd = 0 
io.on('connection', function(socket) {
    console.log('made connection');
    socket.on('processedData', function(data) {
	var n = data.localeCompare("start draw\n")
	var c = data.localeCompare("end\n")
	console.log(data)

	if( n == 0 ){
		console.log(n)
		console.log("we are starting")
		// we are starting a drawing 
		dragStart = 1

	} else if(c == 0 ){
		console.log(data)
		console.log("end triggered")
		dragEnd = 1 

	}else{
		var newDat = data.match(/\(([^)]+)\)/)[1]
		//console.log(newDat)
		var newerDat = newDat.split(",")
		//console.log(newerDat)
		var firstDat = newerDat[0]
		var secondDat = newerDat[1]
		var x1 = parseInt(newerDat[0])
		var y1 = parseInt(newerDat[1])

		
		if(dragStart == 1){
			dragStart = 0
			console.log("Did I EVER GET HERE")
			socket.broadcast.emit('draw', {
				x: x1,
				y: y1,
				type: "start"
			}
			);
		}else if(dragStart == 0 && dragEnd ==0){
			socket.broadcast.emit('draw', {
				x: x1,
				y: y1,
				type: "drawing"
			}
			);
		}else if(dragEnd == 1){
			dragEnd = 0
			console.log("I found an end")
			socket.broadcast.emit('draw', {
				x: x1,
				y: y1,
				type: "end"
			}
			);
		}else{

		}
	}
	// forward to studentside livestream
	//@Gabe this you
	// first connect to canvas file
	//Listen for incoming points 
	//Incomming points come from processedData 

	//generate video file
    });
});

http.listen(7000, function() {
    console.log('listening on port 7000');
});
