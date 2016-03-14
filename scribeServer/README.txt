HOW TO RUN THING
to test drawing stuff, run the gpServer in drawingTestData and drawingServer here
for actual real things, you'd run drawingServer and processingServer
(node filename.js to run things, in case you aren't familiar with running node stuff)

ARCHITECTURE INFO
drawingServer.js and processingServer.js will run simultaneously on the same machine
the edison (or whatever) will send the tcp packets (or whatever) to processingServer to be processed
processing Server then sends start/stop draw/erase and coords to drawingServer via socket

drawingServer hosts this socket connection so that the test bed can be hooked up to send coords to it in place of processingServer, since I can't find a way to tell a clientside browser script where to connect to, it automatically does so to whatever server served it apparently

drawingServer will forward these coords,etc to the student client side script which will draw the livestreamed animation on an html5 canvas

it will also eventually forward the lecturer's speaking audio to the same client
it will also eventually generate the video file for the lecture archive
it will also probably handle student/course registration stuff eventually


NOTE: 
I included a bunch of modules we should probably get rid of when I was working over break, sorry Jane :X 

