var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var datadir = 'datafiles/';
var filename = 'tmp';

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname+'/nameTest.html'));
});

app.post('/name', function(req, res) {
    filename = req.body.filename;
    //console.log(filename);
    res.sendFile(path.join(__dirname+'/getPoints.html'));
});

io.on('connection', function(socket) {
    console.log('a user connected\n');
    socket.on('client_data', function(data) {
	//console.log(data.coord);
	var txtname = datadir + filename + '.txt';
	fs.appendFile(txtname, data.coord+'\n', function(err) {
	    if (err) return console.log(err);
	});
    });
});

http.listen(7000, function() {
    console.log('listening on port 7000');
});
