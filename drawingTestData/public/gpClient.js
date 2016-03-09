var socket = io();

var can = $('#can');
var offset = can.offset();
var c = can[0];
var ctx = c.getContext('2d');
c.addEventListener('mousemove', getCurrCoord, false);
c.addEventListener('mousedown', getMD, false);
c.addEventListener('mouseup', getMU, false);

var recording = false; //will only send data/draw when this true

var drawing = false; // are you changing the canvas?

var DRAW_ID = true;
var ERASE_ID = false;
var drawOrErase = DRAW_ID; // are you drawing or erasing when you change the canvas?
var PEN_WIDTH = 1;
var ERASER_WIDTH = 20;

var NO_DATA = -1;
var xy = [NO_DATA, NO_DATA];

// want 20 coords per sec
// .05 sec per coord > 50ms for interval
var INTLEN = 50 //ms

//on time, if drawing, get mouse pos & send
var intvl = setInterval(function() {
    if (recording == true) {
	if (drawing == true) {
	    //send
	    sendPoint(xy);
	} else {
	    //send no data for pause
	    sendPoint([NO_DATA, NO_DATA]);
	}
    }
}, INTLEN);

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

// on mousemove
function getCurrCoord(event) {
    if (drawing == true) {
	xy = getXY(event);

	// draw on screen
	if (recording == true) {
	    ctx.lineTo(xy[0], xy[1]);
	    ctx.stroke();
	}
    }
}

function getMD(event) {
    drawing = true;
    xy = getXY(event);

    if (recording == true) {
	socket.emit('client_data', {'coord': 'start'});

	//draw
	ctx.beginPath();
	if (drawOrErase == DRAW_ID) {
	    ctx.strokeStyle='black';
	    ctx.lineWidth=PEN_WIDTH;
	} else {
	    ctx.strokeStyle='white';
	    ctx.lineWidth=ERASER_WIDTH;
	}
	ctx.moveTo(xy[0], xy[1]);
    }
}

function getMU(event) {
    drawing = false;
    xy = getXY(event);

    if (recording == true) {
	socket.emit('client_data', {'coord': 'end'});

	//draw
	ctx.lineTo(xy[0],xy[1]);
	ctx.stroke();
    }
}

function toggleRecord() {
    recording = !recording;
    
    //update button to new state
    var recbtn = $('#toggleRecord');
    if (recording == true) {
	recbtn.text('stop recording data');
    } else {
	recbtn.text('start recording data');
    }
}

function toggleDrawErase() {
    drawOrErase = !drawOrErase;
    
    // update btn
    var doebtn = $('#toggleDrawErase');
    if (drawOrErase == DRAW_ID) {
	doebtn.text('eraser');
    } else {
	doebtn.text('pen');
    }
}

function saveCanvas() {
    if (recording == true) {
	var canData = c.toDataURL('image/png');
	$.post('/savecanvas', { candata: canData });
    }
}
