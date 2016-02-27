var socket = io();

var can = $('#can');
var offset = can.offset();
var c = can[0];
var ctx = c.getContext('2d');
c.addEventListener('mousemove', getCurrCoord, false);
c.addEventListener('mousedown', getMD, false);
c.addEventListener('mouseup', getMU, false);

var drawing = false;

function getXY(event) {
    var x = Math.floor(event.clientX - offset.left);
    var y = Math.floor(event.clientY - offset.top);
    return [x,y]
}

function sendPoint(xy) {
    var d = new Date();
    var t = d.getTime();
    var msg = '(' + xy[0] + ',' + xy[1] + "," + t + ')';
    socket.emit('client_data', {'coord': msg});
}

function getCurrCoord(event) {
    if (drawing == true) {
	var xy = getXY(event);

	sendPoint(xy);
	
	// draw on screen
	ctx.lineTo(xy[0], xy[1]);
	ctx.stroke();
    }
}

function getMD(event) {
    drawing = true;
    var xy = getXY(event);

    socket.emit('client_data', {'coord': 'start'});
    sendPoint(xy);

    // draw
    ctx.beginPath();
    ctx.moveTo(xy[0], xy[1]);
}

function getMU(event) {
    drawing = false;
    
    socket.emit('client_data', {'coord': 'end'});

    //draw
    var xy = getXY(event);
    ctx.lineTo(xy[0],xy[1]);
    ctx.stroke();
}
