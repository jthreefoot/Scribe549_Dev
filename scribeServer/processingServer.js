var express = require('express');
var app = express();
var http = require('http').Server(app);
var client = require('socket.io-client');

var socket = client.connect('http://localhost:7000');

socket.on('test', function(data) {
    console.log(data);
});

socket.emit('data', Math.random());
