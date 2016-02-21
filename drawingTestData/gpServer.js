var express = require('express');
var app = express();
var path = require("path");

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname+'/getPoints.html'));
});

app.listen(7000, function() {
    console.log('listening p7000');
});
