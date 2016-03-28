import matplotlib.pyplot as plt
import matplotlib.animation as animation

### CONSTANTS ###
# file stuff
DATADIR = "../drawingTestData/datafiles/"
FILENAME = "actualtestfile.txt"
# colors/line width/etc options
BGCOLOR = "white"
LINECOLOR = "k" #in matplotlib this for black lines
LINEWIDTH = 1
# video deets
FRAMEINT = 50 #ms, so 20 fps
VIDWIDTH = 30 #placeholder val idk what i'm doing
VIDHEIGHT = 20 #also arbitrary for now
# draw/erase notation constants so i can change implentation later if need-be
ISDRAWING = True
ISERASING = False


### VARS ###
# drawing stuff
drawing = False # drawing/erasing or not
drawOrErase = ISDRAWING # drawing vs erasing

# setup
datafile = open(DATADIR + FILENAME, "r")

x = []
y = []

fig = plt.figure()
ax = fig.add_subplot(1,1,1)

# doing the animatey thing
def animate(i):
    global drawing
    # get next data
    data = datafile.readline()
    if (data[0] == '('):
        #coord
        data = data.translate(None, '()')
        data = data.split(',')
        x.append(int(data[0]))
        y.append(int(data[1]))
    if (data[0] == 's'): #start
        drawing = True
        line = data.split(' ');
        if (data[1] == "draw"):
            drawOrErase = ISDRAWING
        elif (data[1] == "erase"):
            drawOrErase = ISERASING
    if (data[0] == 'e'): #end
        drawing = False
    # now draw the new point
    if ((drawing == True) and (x != -1) and (y != -1)):
        ax.plot(x,y)
    
ani = animation.FuncAnimation(fig, animate, interval=FRAMEINT)

# the outro business
#datafile.close()
plt.show()
