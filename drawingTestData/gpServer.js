var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname+'/getPoints.html'));
});

io.on('connection', function(socket) {
    process.stdout.write('a user connected\n');
    socket.on('client_data', function(data) {
	process.stdout.write(data.coord + '\n');
    });
});

http.listen(7000, function() {
    console.log('listening on port 7000');
});
