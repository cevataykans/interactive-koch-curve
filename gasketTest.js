var canvas;
var gl;

var points = [];
var colors = [];

var NumTimesToSubdivide = 2;

function sayHelloWorld() {
	var convexShape = new ConvexShape();
	convexShape.addPoint(20, 30);
	var pointList = convexShape.getPoints();

	alert(pointList[0][0] + "   " + pointList[0][1]);
}
