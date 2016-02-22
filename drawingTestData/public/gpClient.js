var socket = io();

var c = document.getElementById("can");
var can = $("#can");
var offset = can.offset();
var ctx = c.getContext("2d");
c.addEventListener("mousemove", getCurrCoord, false);
c.addEventListener("mousedown", getMD, false);
c.addEventListener("mouseup", getMU, false);

var drawing = false;


function getCurrCoord(event) {
    if (drawing == true) {
        var c_x = event.clientX - offset.left;
        var c_y = event.clientY - offset.top;
        //ctx.font = "15pt Arial";
        var msg = "(" + c_x + "," + c_y + ")";
        //ctx.clearRect(0, 0, 400, 400);
        //ctx.fillText(msg, 20, 20);
        socket.emit("client_data", {"coord": msg});
	
	//draw
	ctx.lineTo(c_x,c_y);
	ctx.stroke();
    }
}

function getCoord(event, dir) {
    var c_x = event.clientX - offset.left;
    var c_y = event.clientY - offset.top;
    //return dir + " at: " + c_x + "," + c_y;
    return "(" + c_x + "," + c_y + ")";
}

function getMD(event) {
    drawing = true;
    var msg = getCoord(event, "down");
    document.getElementById("down").innerHTML = msg;
    socket.emit("client_data", {"coord": "start"});
    // make sure to record first point where user clicks
    socket.emit("client_data", {"coord": msg});
    //draw
    ctx.beginPath();
    var c_x = event.clientX - offset.left;
    var c_y = event.clientY - offset.top;
    ctx.moveTo(c_x, c_y);
}

function getMU(event) {
    drawing = false;
    var msg = getCoord(event, "up");
    document.getElementById("up").innerHTML = msg;
    socket.emit("client_data", {"coord": "end"});
    //draw
    var x = event.clientX - offset.left;
    var y = event.clientY - offset.top;
    ctx.lineTo(x,y);
    ctx.stroke();
}
