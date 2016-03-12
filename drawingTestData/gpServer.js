var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var drawingServSock = require('socket.io-client').connect('http://localhost:7000');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var datadir = 'datafiles/';
var filename = 'tmp'; //default if user doesn't set a fn

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname+'/nameData.html'));
});

app.post('/name', function(req, res) {
    filename = req.body.filename;
    res.sendFile(path.join(__dirname+'/getPoints.html'));
});

app.post('/savecanvas', function(req, res) {
    var canData = req.body.candata;
    //following from stackoverflow.com/questions/5867534/how-to-save-canvas-data-to-file
    var strippedCanData = canData.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer(strippedCanData, 'base64');
    var pngname = datadir + filename + '.png';
    fs.writeFile(pngname, buf);
});

io.on('connection', function(socket) {
    console.log('a user connected\n');
    socket.on('client_data', function(data) {
	var txtname = datadir + filename + '.txt';
	fs.appendFile(txtname, data.coord+'\n', function(err) {
	    if (err) return console.log(err);
	});
	drawingServSock.emit('processedData', data.coord+'\n');
    });
});

http.listen(8080, function() {
    console.log('listening on port 8080');
});
