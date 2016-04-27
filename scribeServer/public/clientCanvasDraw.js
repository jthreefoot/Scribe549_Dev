var socket = io();

var can = $('#can');
var offset = can.offset();
var c = can[0];
var ctx = c.getContext('2d');
var App;

App = {};
App.socket = io.connect('http://45.55.185.21:7000');

c = document.getElementById('can');
ctx = c.getContext("2d");
//ctx.translate(-500, 0);
ctx.strokeStyle=("red");


function draw(x,y, type){
    if (type === "start") {
        ctx.beginPath();
        console.log("new Shape")
        return ctx.moveTo(x, y);
    } else if (type === "drawing") {
        ctx.lineTo(x, y);
        return ctx.stroke();
    }/*else if(x == -1){
    	console.log("I'm here")
    	ctx.beginPath();
    	//ctx.closePath();
    } */
    else 
    {
    	ctx.beginPath();
        //return ctx.closePath();
    }

}

function clear(){
    ctx.beginPath();
    ctx.clearRect(0,0, 1000,1000);
    ctx.clearRect(0,0, 1000, 1000);
    ctx.closePath();
}

function done(){
//enable download button;
console.log("done\n");
$('#nav_list').append('<a class = "mdl-navigation__link" href = "/downloadvideo" ><i class = "mdl-color-text--blue-grey-400 material-icons">file_download</i>Download</a>');


}


App.socket.on('draw', function(data) {
  console.log("got draw");
  console.log(data.x);
  return draw(data.x, data.y,data.type);
});

App.socket.on('clear', function(data){
    console.log("got clear");
    return clear();
});

App.socket.on('done',function(data){
    console.log("got done");
    return done();
});
