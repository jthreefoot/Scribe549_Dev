
var socket = io();

var c = document.getElementById("can");
var ctx = c.getContext("2d");
c.addEventListener("mousemove", getCurrCoord, false);
c.addEventListener("mousedown", getMD, false);
c.addEventListener("mouseup", getMU, false);

var drawing = false;

function getCurrCoord(event) {
    if (drawing == true) {
        var c_x = event.clientX;
        var c_y = event.clientY;
        ctx.font = "15pt Arial";
        var msg = "(" + c_x + "," + c_y + ")";
        ctx.clearRect(0, 0, 400, 400);
        ctx.fillText(msg, 20, 20);
        socket.emit("client_data", {"coord": msg});
    }
}

function getCoord(event, dir) {
    var c_x = event.clientX;
    var c_y = event.clientY;
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
}

function getMU(event) {
    drawing = false;
    var msg = getCoord(event, "up");
    document.getElementById("up").innerHTML = msg;
    socket.emit("client_data", {"coord": "end"});
}
