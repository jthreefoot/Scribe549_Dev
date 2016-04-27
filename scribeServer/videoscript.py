import matplotlib.pyplot as plt
import matplotlib.animation as animation

### CONSTANTS ###
# file stuff
#DATADIR = "../drawingTestData/datafiles/"
#FILENAME = "actualtestfile.txt"
# colors/line width/etc options
BGCOLOR = "white"
LINECOLOR = "k" #in matplotlib this for black lines
LINEWIDTH = 1
# video deets
FRAMEINT = 50 #ms, so 20 fps
FRAMERATE = 20 #fps
VIDBITRATE = -1 #-1 means the underlying utility decides the output bitrate for us
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
datafile = open('recordedData.txt', "r") #was DATADIR + FILENAME

x = []
y = []

fig = plt.figure()
ax = fig.add_subplot(1,1,1)
axes = plt.gca()
axes.set_xlim([-500,500])
axes.set_ylim([1000,0]) #bc lidar setup draws w y=0 at top of board and inc y draws down to 1000
axes.axes.get_xaxis().set_visible(False)
axes.axes.get_yaxis().set_visible(False)
Writer = animation.writers['ffmpeg']
writer = Writer(fps=FRAMERATE, metadata=dict(artist="me"), bitrate=VIDBITRATE)

# doing the animatey thing
def animate(i):
    #global drawing
    # get next data
    data = datafile.readline()
    if ((data != "") and (data != "\n")):
        if (data[0] == 'e'): #found end
            x.append(None)
            y.append(None)
            ax.plot(x,y,'b-')
        elif (data[0] == 'c'): #found clear
            pass #dwi later
        else: #point. is of form x,y
            #if (drawing == True):
            data = data.split(',')
            x.append(int(data[0]))
            y.append(int(data[1]))
            ax.plot(x,y,'b-')
    
ani = animation.FuncAnimation(fig, animate, interval=FRAMEINT)
ani.save('demo.mp4', writer=writer)

# the outro business
#datafile.close()
#plt.show()
