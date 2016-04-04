#include <stdio.h>
#include <stdlib.h>
#include <math.h>

// change these to match board
float MAX_WIDTH = 400;
float MAX_HEIGHT = 200;

struct Point {
  float x;
  float y;
};

// y = mx + b slope-intercept form
struct Line {
  float yIntercept;
  float slope;
};

struct Circle {
  struct Point center;
  float radius;
};

/* gets distance between centers of two circles */
float getCenterDist(struct Circle *c1, struct Circle *c2){
  float xDif = c1->center.x - c2->center.x;
  float yDif = c1->center.y - c2->center.y;
  return sqrt(powf(xDif, 2) + powf(yDif, 2));
}

/* checks if the pair of circles intersects
 * takes radii r1, r2, and the distance btwn
 * the circle centers
 * return 0/1 for true/false */
int checkCircleIntersection(struct Circle *c1, struct Circle *c2) {
  return c1->radius + c2->radius >= getCenterDist(c1, c2);
}

/* given two lines, returns the point
 * where they intersect */
struct Point *getLineIntersection(struct Line *l1, struct Line *l2){
  float x = (l1->yIntercept - l2->yIntercept) / (l1->slope - l2->slope);
  float y = l1->slope * x + l1->yIntercept;
  struct Point *newPt = malloc(sizeof(struct Point));
  newPt->x = x;
  newPt->y = y;
  return newPt;
}

/* gets the "radical line" of two non-intersecting circles */
struct Line *getCircleLineFromNonIntersection(struct Circle *c1, struct Circle *c2){
  
  return 0;
}

/* given two intersecting circles, returns the point or points
 * where they intersect 
 * returns an array of points (will be either one or two points) */
//@TODO tangent single intersection stuff
struct Point **getCircleIntersectionPoints(struct Circle *c1, struct Circle *c2){
  // paulbourke.net/geometry/circlesphere/
  // "source code" example under circle intersections
  return 0;
}

/* gets the radical line of two intersecting circles */
struct Line *getCircleLineFromIntersection(struct Circle *c1, struct Circle *c2){
  //@TODO add handling for tangent circles
  struct Point **intersections = getCircleIntersectionPoints(c1, c2);
  struct Point *p1 = intersections[0];
  struct Point *p2 = intersections[1];
  float slope = (p2->y - p1->y) / (p2->x - p1->x);
  float yInt = -slope * p1->x + p1->y;
  struct Line *newLine = malloc(sizeof(struct Line));
  newLine->slope = slope;
  newLine->yIntercept = yInt;
  return newLine;
}

/* given two circles which may or may not
 * intersect, gives the line that either
 * goes through their intersection points
 * (the actual radical line) or
 * the line perpendicular to the line
 * connecting their centers which falls
 * between the end points of the radii
 * on that line */
struct Line *getCirclesRadicalLine(struct Circle *c1, struct Circle *c2){
  if (checkCircleIntersection(c1, c2)) {
    return getCircleLineFromIntersection(c1, c2);
  } else {
    return getCircleLineFromNonIntersection(c1, c2);
  }
}

/* trilaterates based on the given four circles */
struct Point *trilaterate(struct Circle **circles){
  return 0;
}

int main() {
  return 0;
}
