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

struct Vector {
  float x;
  float y;
};

// y = mx + b slope-intercept form
struct Line {
  float b;
  float m;
};

struct Circle {
  struct Point center;
  float radius;
};

/* get midpoint between two points */
void getMidpoint(struct Point *p1, struct Point *p2, struct Point *mid) {
  mid->x = (p1->x + p2->x) / 2;
  mid->y = (p1->y + p2->y) / 2;
}

/* get vector from p1 to p2 */
void getVector(struct Point *p1, struct Point *p2, struct Vector *v) {
  v->x = p2->x - p1->x;
  v->y = p2->y - p1->y;
}

/* get magnitude of vector */
float getVectorLength(struct Vector *v) {
  return sqrt(powf(v->x, 2) + powf(v->y, 2));
}

/* get line from point and slope */
void getLineFromPointSlope(struct Point *p, float m, struct Line *l) {
  l->m = m;
  l->b = p->y - m*(p->x);
}

/* scale vector to have length mag */
void scaleVector(struct Vector *v, float mag) {
  float len = getVectorLength(v);
  v->x = v->x / len * mag;
  v->y = v->y / len * mag;
}

/* derive a point from p in the magnitude and direction of v */
void getPointFromVector(struct Point *p, struct Vector *v, struct Point *newPoint) {
  newPoint->x = p->x + v->x;
  newPoint->y = p->y + v->y;
}

/* given two lines, returns the point
 * where they intersect */
void getLineIntersection(struct Line *l1, struct Line *l2, struct Point *p) {
  p->x = (l2->b - l1->b) / (l1->m - l2->m);
  p->y = l1->m * p->x + l1->b;
}

void getLineBetweenPoints(struct Point *p1, struct Point *p2, struct Line *l) {
  float m = (p2->y - p1->y) / (p2->x - p1->x);
  float b = p2->y - m*(p2->x);
  l->m = m;
  l->b = b;
}

/* gets distance between centers of two circles */
float getCenterDist(struct Circle *c1, struct Circle *c2){
  float xDif = c1->center.x - c2->center.x;
  float yDif = c1->center.y - c2->center.y;
  return sqrt(powf(xDif, 2) + powf(yDif, 2));
}

/* checks if the pair of circles intersects
 * returns 1 for true, 0 for false. */
int checkCircleIntersection(struct Circle *c1, struct Circle *c2) {
  return c1->radius + c2->radius >= getCenterDist(c1, c2);
}

/* gets the "radical line" of two non-intersecting circles */
void getCircleLineFromNonIntersection(struct Circle *c1, struct Circle *c2, struct Line *l){
  struct Vector v1, v2;
  struct Line line;
  getLineBetweenPoints(&c1->center, &c2->center, &line);
  getVector(&c1->center, &c2->center, &v1);
  getVector(&c2->center, &c1->center, &v2);
  scaleVector(&v1, c1->radius);
  scaleVector(&v2, c2->radius);
  struct Point p1, p2;
  getPointFromVector(&c1->center, &v1, &p1);
  getPointFromVector(&c2->center, &v2, &p2);
  struct Point mid;
  getMidpoint(&p1, &p2, &mid);
  float perp = -1 / line.m;
  getLineFromPointSlope(&mid, perp, l);
}

/* given two intersecting circles, returns the point or points
 * where they intersect
 * returns an array of points (will be either one or two points) */
//@TODO tangent single intersection stuff
void getCircleIntersectionPoints(struct Circle *c1, struct Circle *c2, struct Point *intersections) {
  // paulbourke.net/geometry/circlesphere/
  // "source code" example under circle intersections
  float a, dx, dy, d, h, rx, ry;
  float x2, y2;
  dx = c2->center.x - c1->center.x;
  dy = c2->center.y - c1->center.y;
  d = getCenterDist(c1, c2);
  if (d == (c1->radius + c2->radius)) {
    return;
  }
  a = ((c1->radius * c1->radius) - (c2->radius * c2->radius) + (d*d)) / (2 * d);
  x2 = c1->center.x + (dx * a/d);
  y2 = c1->center.y + (dy * a/d);
  h = sqrt(c1->radius * c1->radius - a*a);
  rx = -dy * (h/d);
  ry = dx * (h/d);
  intersections[0].x = x2 + rx;
  intersections[0].y = y2 + ry;
  intersections[1].x = x2 - rx;
  intersections[1].y = y2 - ry;
}

/* gets the radical line of two intersecting circles */
void getCircleLineFromIntersection(struct Circle *c1, struct Circle *c2, struct Line *l) {
  //@TODO add handling for tangent circles
  struct Point intersections[2];
  getCircleIntersectionPoints(c1, c2, intersections);
  struct Point p1 = intersections[0];
  struct Point p2 = intersections[1];
  float slope = (p2.y - p1.y) / (p2.x - p1.x);
  float yInt = -slope * p1.x + p1.y;
  l->m = slope;
  l->b = yInt;
}

/* given two circles which may or may not
 * intersect, gives the line that either
 * goes through their intersection points
 * (the actual radical line) or
 * the line perpendicular to the line
 * connecting their centers which falls
 * between the end points of the radii
 * on that line */
void getCirclesRadicalLine(struct Circle *c1, struct Circle *c2, struct Line *l){
  if (checkCircleIntersection(c1, c2)) {
    getCircleLineFromIntersection(c1, c2, l);
  } else {
    getCircleLineFromNonIntersection(c1, c2, l);
  }
}

/* given a point checks if it's actually on the board
 * return 0/1 for false/true
 */
int isOnBoard(struct Point pt) {
  if ((0 <= pt.x && pt.x <= MAX_WIDTH) &&
      (0 <= pt.y && pt.y <= MAX_HEIGHT)) {
    return 1;
  } else {
    return 0;
  }
}

/* trilaterates based on the given four circles */
/* circles are in the array in the order:
 * top left, top right, bottom left, bottom right */
void trilaterate(struct Circle *circles, int numCircles, struct Point *drawPt){
  switch (numCircles) {
  case 4:
    // find the intersection of two diagonals
    break;
  case 3:
    // find midpoint of hypotenuse:
    // find three lines, get three intersections, get distances b/w three intersections,
    // pick biggest segment, find midpoint between those two points
    break;
  case 2:
    // find two intersections, throw out the one outside the board.
    if (checkCircleIntersection(&circles[0], &circles[1])){
      struct Point points[2];
      getCircleIntersectionPoints(&circles[0], &circles[1], points);
      if (isOnBoard(points[0])) {
	drawPt->x = points[0].x;
	drawPt->y = points[0].y;
      } else if (isOnBoard(points[1])){
	drawPt->x = points[1].x;
	drawPt->y = points[1].y;
      } else {
	printf("something hecked up\n");
      }
    } else {
      printf("bad data\n");
    }
    break;
  default:
    break;
  }
}

int main() {
  // getMidpoint tests
  struct Point p1, p2, mid;
  p1.x = 0;
  p1.y = 2;
  p2.x = 2;
  p2.y = 5;
  getMidpoint(&p1, &p2, &mid);
  printf("Midpoint between (%f, %f) and (%f, %f) is (%f, %f)\n", p1.x, p1.y, p2.x, p2.y, mid.x, mid.y);

  // getVector tests
  struct Vector v;
  getVector(&p1, &p2, &v);
  printf("Vector from (%f, %f) to (%f, %f) is (%f, %f)\n", p1.x, p1.y, p2.x, p2.y, v.x, v.y);

  getVector(&p2, &p1, &v);
  printf("Vector from (%f, %f) to (%f, %f) is <%f, %f>\n", p2.x, p2.y, p1.x, p1.y, v.x, v.y);

  // getVectorLength tests
  float mag = getVectorLength(&v);
  printf("Length of vector <%f, %f> is %f\n", v.x, v.y, mag);

  // getLineFromPointSlope tests
  struct Line l;
  float m = 3;
  getLineFromPointSlope(&p2, m, &l);
  printf("Line from point (%f, %f) with slope %f has y-intercept %f\n", p2.x, p2.y, m, l.b);

  // scaleVector tests
  struct Vector v_saved = v;
  scaleVector(&v, 2);
  printf("Vector in the direction of <%f, %f> of magnitude %d is <%f, %f>\n", v_saved.x, v_saved.y, 2, v.x, v.y);

  // getPointFromVector tests
  struct Point newPoint;
  getPointFromVector(&p1, &v, &newPoint);
  printf("Point from (%f, %f) in the direction of <%f, %f> is (%f, %f)\n", p1.x, p1.y, v.x, v.y, newPoint.x, newPoint.y);

  // getLineIntersection tests;
  struct Line l2;
  struct Point intersection;
  l2.m = 2;
  l2.b = 5;
  getLineIntersection(&l, &l2, &intersection);
  printf("Lines y = %fx + %f and y = %fx + %f intersect at (%f, %f)\n", l.m, l.b, l2.m, l2.b, intersection.x, intersection.y);

  // getLineBetweenPoints tests
  struct Line l3;
  getLineBetweenPoints(&intersection, &p1, &l3);
  printf("The line between (%f, %f) and (%f, %f) is y = %fx + %f\n", intersection.x, intersection.y, p1.x, p1.y, l3.m, l3.b);

  // intersect at 116, 104
  struct Circle c1, c2;
  c1.center.x = 0;
  c1.center.y = MAX_HEIGHT;
  c1.radius = 150;
  c2.center.x = MAX_WIDTH;
  c2.center.y = MAX_HEIGHT;
  c2.radius = 300;

  // getCenterDist tests
  printf("Center between c1 and c2 is %f\n", getCenterDist(&c1, &c2));

  if (checkCircleIntersection(&c1, &c2)) {
    printf("These circles intersect!\n");
  } else {
    printf("These circles do not intersect.\n");
  }

  // assuming circles intersect
  // getCircleIntersectionPoints tests
  struct Point intersections[2];
  getCircleIntersectionPoints(&c1, &c2, intersections);
  printf("c1 and c2 intersect at (%f, %f) and (%f, %f)\n", intersections[0].x, intersections[0].y, intersections[1].x, intersections[1].y);

  // trilaterate test
  struct Circle circles[2];
  circles[0] = c1;
  circles[1] = c2;
  int numCircles = 2;
  struct Point circIntersection;
  trilaterate(circles, numCircles, &circIntersection);
  printf("The two circles intersect on the board at (%f, %f)\n", circIntersection.x, circIntersection.y);
}
