var socket = io();

var can = $('#can');
var offset = can.offset();
var c = can[0];
var ctx = c.getContext('2d');
var App;

App = {};
App.socket = io.connect('http://localhost:7000');

c = document.getElementById('can');
ctx = c.getContext("2d");
ctx.strokeStyle=("red");


function draw(x,y, type){
	if (type === "start") {
        ctx.beginPath();
        console.log("new Shape")
        return ctx.moveTo(x, y);
    } else if (type === "drawing") {
        ctx.lineTo(x, y);
        return ctx.stroke();
    }else if(x == -1){
    	console.log("I'm here")
    	ctx.beginPath();
    	//ctx.closePath();
    } 
    else 
    {
    	ctx.beginPath();
        //return ctx.closePath();
    }

}
App.socket.on('draw', function(data) {
  return draw(data.x, data.y,data.type);
});
