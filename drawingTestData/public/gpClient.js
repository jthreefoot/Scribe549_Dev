var socket = io();

var can = $('#can');
var offset = can.offset();
var c = can[0];
var ctx = c.getContext('2d');
c.addEventListener('mousemove', getCurrCoord, false);
c.addEventListener('mousedown', getMD, false);
c.addEventListener('mouseup', getMU, false);

var recording = false; //will only send data/draw when this true

var drawing = false;
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

	//sendPoint(xy); //now only sending on interval to get right #pts
	
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
    }
    //sendPoint(xy);

    // draw
    if (recording == true) {
	ctx.beginPath();
	ctx.moveTo(xy[0], xy[1]);
    }
}

function getMU(event) {
    drawing = false;
    
    if (recording == true) {
	socket.emit('client_data', {'coord': 'end'});
    }

    //draw
    xy = getXY(event);
    if (recording == true) {
	ctx.lineTo(xy[0],xy[1]);
	ctx.stroke();
    }
}

function toggleRecord() {
   recording = !recording;

    //update button to new state
    var togbtn = $('#toggleRecord');
    if (recording == true) {
	togbtn.text('stop recording data');
    } else {
	togbtn.text('start recording data');
    }
}

function saveCanvas() {
    if (recording == true) {
	var canData = c.toDataURL('image/png');
	$.post('/savecanvas', { candata: canData });
    }
}
