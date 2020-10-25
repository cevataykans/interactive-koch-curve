function ConvexShape() {
	this.points = [];
	this.isConvex = false;
	
	this.kochPoints = [];
	this.isRuleApplied = false;
	this.iterationCount = 0;
};

ConvexShape.prototype.isConvexShape = function ()
{
	return this.isConvex;
};

ConvexShape.prototype.getPoints = function () 
{
	if ( this.isRuleApplied)
	{
		return this.kochPoints;
	}
	return this.points;
};

ConvexShape.prototype.addPoint = function (x, y, canvas) 
{
	var newPoint = vec2( 
		2 * x / canvas.width - 1,
		(2 * (canvas.height - y) / canvas.height) - 1 );

	if ( this.points.length > 0)
	{
		if ( length( subtract( this.points[ 0], newPoint) ) < 0.1 )
		{
			this.isConvex = true;
			return;
		}
	}
	this.points.push( newPoint);
};

ConvexShape.prototype.applyKochRule = function () 
{
	this.kochPoints = generateKochPoints( this.points, this.iterationCount);
	this.isRuleApplied = true;
};

ConvexShape.prototype.clear = function () 
{
	this.kochPoints = [];
	this.points = [];
	this.isConvex = false;
	this.isRuleApplied = false;
};

ConvexShape.prototype.saveJSON = function (filename) 
{
	const a = document.createElement('a');

	// var jsonData = 
	// {
	// 	points: this.points,
	// 	kochPoints: this.kochPoints,

	// 	isRuleApplied: this.isRuleApplied,

	// };

	let jsonData = JSON.stringify( this, null, 4);
  	const file = new Blob([ jsonData], {type: "text/plain"});
  
  	a.href= URL.createObjectURL( file);
  	a.download = filename;
  	a.click();

	URL.revokeObjectURL(a.href);
};

ConvexShape.prototype.loadData = function ( shapeData) 
{
	this.points = shapeData.points;
	this.kochPoints = shapeData.kochPoints;

	this.isRuleApplied = shapeData.isRuleApplied;
	this.isConvex = shapeData.isConvex;
	this.iterationCount = shapeData.iterationCount;
};