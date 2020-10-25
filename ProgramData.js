function ProgramData() {
    this.shapeData = {};
    this.bgColorData = [];
    this.curveColorData = [];
};

ProgramData.prototype.saveJSON = function (filename) 
{
	const a = document.createElement('a');

	let jsonData = JSON.stringify( this, null, 4);
  	const file = new Blob([ jsonData], {type: "text/plain"});
  
  	a.href= URL.createObjectURL( file);
  	a.download = filename;
  	a.click();

	URL.revokeObjectURL(a.href);
};

ProgramData.prototype.loadJSON = function () 
{
	//
};
