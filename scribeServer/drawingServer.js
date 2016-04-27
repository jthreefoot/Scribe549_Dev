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
var bodyParser = require('body-parser');
//var PythonShell = require('python-shell');
var child = require('child_process');

var drawingStarted = false;
var recordFile = 'recordedData.txt';

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname+'/clientCanvas.html'));
});

app.use(express.static('public'));

var dragStart = 0 
var dragEnd = 0 


app.post('/', function(req, res) {
    if (drawingStarted != true) { //first data point
	drawingStarted = true;
	var x1 = parseFloat(req.body.x);
	var y1 = parseFloat(req.body.y);
        console.log(x1);
	fs.appendFile(recordFile, x1 + ',' + y1 + '\n', function(err) {
	    if(err) return console.log(err);
	});
	io.sockets.emit('draw', {
	    x: x1,
	    y: y1,
	    type: "start"
	});
    }
    var stop = parseInt(req.body.stop);
    if (stop == 0) {
	var x1 = parseFloat(req.body.x);
	var y1 = parseFloat(req.body.y);
        console.log("HERE\n");
	console.log("x: " + x1 + " y: " + y1);
	fs.appendFile(recordFile, x1 + ',' + y1 + '\n', function(err) {
	    if(err) return console.log(err);
	});
	
	io.sockets.emit('draw', {
	    x: x1,
	    y: y1,
	    type: "drawing"
	});
    } else { //pen lifted so stopped drawing
	console.log("stop");
	var x1 = parseFloat(req.body.x);
	var y1 = parseFloat(req.body.y);
        console.log("here for some reason.. \n");
	fs.appendFile(recordFile, x1 + ',' + y1 + '\nend\n', function(err) {
	    if(err) return console.log(err);
	});
	io.sockets.emit('draw', {
	    x: x1,
	    y: y1,
	    type: "end"
	});
    }
    res.send('ok'); // so curl won't hang forever and crash the edison
});

app.post('/clear', function(req, res){
    fs.appendFile(recordFile, 'clear\n', function(err) {
	if(err) return console.log(err);
    });
    io.sockets.emit('clear',{});
    console.log("CLEARED CLEARED CLEARED");
    res.send('ok');
});

app.post('/done', function(req, res){
   console.log("Tried to done");
   io.sockets.emit('done',{}); 
   console.log("DONE DONE DONE");
   res.send('ok');
}); 

app.get('/downloadvideo', function(req, res){
    console.log("am I h ere?");
    /*PythonShell.run('videoscript.py', function(err) {
	if (err) throw err;
	console.log('finished');
    });*/
    child.execSync('python videoscript.py');
    /*child.on('exit', function(){
	process.exit();
    });*/

    var file = __dirname + '/demo.mp4';
    res.download(file);
    //res.send('done');
});

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

