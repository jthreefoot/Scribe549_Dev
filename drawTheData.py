#This will allow us to draw the testpoints to a custom canvas. 

from Tkinter import *
import time



#f = open('drawingTestData/datafiles/gabe.txt','r')
#print f

class drawer(object):
	def __init__(self):
		self.root = Tk()
		Label(text = "Animation of Coordinates Test").pack()
		holder = Frame(self.root, height = 2, bd = 1, relief = SUNKEN)
		holder.pack()
		iframe =  Frame(holder,bd=2)
		b = Button(iframe, text = "Draw!",command = self.callAnimate)
		b.pack()
		self.canvas = Canvas(iframe, bg='white', width = 400, height = 400)
		self.canvas.pack()
		holder.pack()
		iframe.pack()
		#self.root.after(0, self.animate)
		self.root.mainloop()
	
	def callAnimate(self):
		self.canvas.delete("all")
		self.root.after(0, self.animate)
	
	def animate(self):
		f = open('drawingTestData/datafiles/speed.txt','r') # change this based on
		#the file that you want 
		print f
		oldx2 = 0
		oldy2 = 0  
		while True:
			line1 = f.readline()	
			line2 = f.readline()
			if ((line1 == "end\n" or line2 == "end\n") or 
				(line1 =="start\n" or line2 == "start\n")) : 
				#we are starting a new drawing! 
				print "A start?"
				print "Oh wow, an end!"
				oldx2 = 0 
				oldy2 = 0
				#reset the backlog 
				continue
			if not line2:
				break
			line1 = line1.translate(None, "()")
			line1 = line1.split(',')
			x1 = int(line1[0])
			y1 = int(line1[1])
			if(oldx2 != 0 or oldy2 != 0):
				self.canvas.create_line(oldx2, oldy2, x1, y1, width = 2)
			line2 = line2.translate(None,"()")
			line2 = line2.split(',')
			x2 = int(line2[0])
			y2 = int(line2[1])
			self.canvas.create_line(x1,y1,x2,y2, width = 2)
			oldx2 = x2
			oldy2 = y2
			time.sleep(0.04)
			self.canvas.update()

drawer()


### THE GENERAL DRAWING CODE ###
### This is just how to draw from coordinates in tkinter ### 
"""
root = Tk()
canvas = Canvas(root, width = 4000, height = 4000)
canvas.pack()
oldx2 = 0
oldy2 = 0  
while True:
	line1 = f.readline()	
	line2 = f.readline()
	if ((line1 == "end\n" or line2 == "end\n") or 
		(line1 =="start\n" or line2 == "start\n")) : 
		#we are starting a new drawing! 
		print "A start?"
		print "Oh wow, an end!"
		oldx2 = 0 
		oldy2 = 0
		#reset the backlog 
		continue
	if not line2:
		break
	line1 = line1.translate(None, "()")
	line1 = line1.split(',')
	x1 = int(line1[0])
	y1 = int(line1[1])
	if(oldx2 != 0 or oldy2 != 0):
		canvas.create_line(oldx2, oldy2, x1, y1, width = 2)
	line2 = line2.translate(None,"()")
	line2 = line2.split(',')
	x2 = int(line2[0])
	y2 = int(line2[1])
	canvas.create_line(x1,y1,x2,y2, width = 2)
	oldx2 = x2
	oldy2 = y2
	print line1
	print line2

root.mainloop()
"""
#canvas.create_line(0, 0, 200, 100)
#canvas.create_line(0, 100, 200, 0, fill="red", dash=(4, 4))

#canvas.create_rectangle(50, 25, 150, 75, fill="blue")
#while(1):
#	print "she's here"
