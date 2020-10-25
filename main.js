var canvas;
var gl;
var program;

var convexShape;
var programData;

window.onresize = function()
{
	var min = innerWidth;

	if ( innerHeight < min)
	{
		min = innerHeight;
	}

	if ( min < canvas.width || min < canvas.height)
	{
		gl.viewport( 0, canvas.height - min, min, min);
	}
};

//*********************  Color
var bgColor = vec4( 0.0, 0.0, 0.0, 1.0);
var curveColor = vec4(0.5, 0.5, 0.5, 1.0);

function hexToRGBVector( color)
{
	// Found: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
	var result = color.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,(m, r, g, b) => '#' + r + r + g + g + b + b).substring(1).match(/.{2}/g).map(x => parseInt(x, 16))
	
	let colorVec4 = vec4( result[ 0] * 1 / 255, result[ 1] * 1 / 255, result[ 2] * 1 / 255, 1.0);
	return colorVec4;
};

function RGBtoHexColor( colorVec)
{
	// Found : https://www.codegrepper.com/code-examples/javascript/Javascript+Rgb+To+Hex
	return "#" + ((1 << 24) + ( (colorVec[ 0] * 255) << 16) + ( (colorVec[ 1] * 255) << 8) + (colorVec[ 2] * 255)).toString(16).slice(1);
}

function changeBackGroundColor(event)
{
	bgColor = hexToRGBVector( event.target.value);
	render();
};

function changeCurveColor( event)
{
	curveColor = hexToRGBVector( event.target.value);
	render();
};
//****************************


function changeIterationCount(event)
{
	convexShape.iterationCount = event.target.value;
};

function handleKochButtonClick(event)
{
	if ( convexShape.isConvexShape())
	{
		convexShape.applyKochRule();
		render();
	}
	else
	{
		alert( "You have not drawn a convex shape yet!");
	}
};

//****************************** */

function handleClearShapeButtonClick(event)
{
	convexShape.clear();
	render();
};

//****************************** */

function handleDownloadButtonClick( event)
{
	let fileName = document.getElementById( "saveDataTextID").value;
	programData.shapeData = convexShape;
	programData.bgColorData = bgColor;
	programData.curveColorData = curveColor;
	programData.saveJSON( fileName + ".txt");
};

function handleUploadButtonClick( event)
{
	let fileReader = new FileReader();
	fileReader.onload = () =>
	{
		programData = JSON.parse( fileReader.result);
		convexShape.loadData( programData.shapeData);
		bgColor = convertArrayToVec4( programData.bgColorData);
		curveColor = convertArrayToVec4( programData.curveColorData);
		
		// Update UI to display new data and render again
		document.getElementById( "backgroundColorID").value = RGBtoHexColor( bgColor);
		document.getElementById( "curveColorPickerID").value = RGBtoHexColor( curveColor);
		let slider = document.getElementById( "kochSliderID");
		slider.value = convexShape.iterationCount;
		document.getElementById( "kochLabelID").innerHTML = slider.value;
		render();
	};
	fileReader.readAsText( event.target.files[ 0]);
};

function convertArrayToVec4( arr)
{
	return vec4( arr[ 0], arr[ 1], arr[ 2], arr[3]);
};

window.onload = function init() 
{
	canvas = document.getElementById("gl-canvas");

	// Initialize core logic
	convexShape = new ConvexShape();
	programData = new ProgramData();

	// Configure colors UI
	let backGroundColorPicker = document.getElementById( "backgroundColorID");
	backGroundColorPicker.addEventListener("change", changeBackGroundColor, false);
	bgColor = hexToRGBVector( backGroundColorPicker.value);

	let curveColorPicker = document.getElementById( "curveColorPickerID");
	curveColorPicker.addEventListener( "change", changeCurveColor, false);
	curveColor = hexToRGBVector( curveColorPicker.value);

	// Configure Koch Curve UI
	let kochSliderValue = document.getElementById( "kochSliderID");
	kochSliderValue.addEventListener( "input", changeIterationCount, false);
	convexShape.iterationCount = kochSliderValue.value;

	let kochApplyButton = document.getElementById( "kochcurveApplyButtonID");
	kochApplyButton.addEventListener( "click", handleKochButtonClick, false);

	// Configure File Save/Load UI
	let downloadButton = document.getElementById( "downloadFileID");
	downloadButton.addEventListener( "click", handleDownloadButtonClick, false);

	let uploadButton = document.getElementById( "uploadFileID");
	uploadButton.addEventListener( "input", handleUploadButtonClick, false);

	// Configure shape options
	let shapeClearButton = document.getElementById( "clearShapeButtonID");
	shapeClearButton.addEventListener( "click", handleClearShapeButtonClick, false);

	// Click on the canvas to add a point
	canvas.onclick = function (event) {
		if ( !convexShape.isConvexShape())
		{
			convexShape.addPoint(event.clientX, event.clientY, this);
			if ( convexShape.isConvexShape())
			{
				render();
			}
		}
	};

	// Constantly display where the new point is
	canvas.onmousemove = function (event) {
		const points = convexShape.getPoints();
		if ( !convexShape.isConvexShape() && points.length > 0) 
		{
			const points = convexShape.getPoints();
			let lastPoint = vec2(
				-1 + 2 * event.x / canvas.width,
				-1 * (-1 + 2 * event.y / canvas.height)
			);
			points.push( lastPoint);
			render();
			points.pop();
		}
	};
	
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) {
		alert("WebGL isn't available");
	}

	//
	//  Configure WebGL
	//
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor( bgColor[0], bgColor[1], bgColor[2], 1.0);

	// enable hidden-surface removal
	gl.enable(gl.DEPTH_TEST);

	//  Load shaders and initialize attribute buffers
	program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};


function render() {
	
	// Render background
	gl.clearColor( bgColor[ 0], bgColor[ 1], bgColor[ 2], 1.0);

	let pointsToRender = convexShape.getPoints();

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData( gl.ARRAY_BUFFER, flatten( pointsToRender), gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	var u_color = gl.getUniformLocation(program, "u_curveColor");
	gl.uniform4fv( u_color, curveColor);

	if ( convexShape.isConvexShape() && !convexShape.isRuleApplied)
	{
		gl.drawArrays( gl.LINE_LOOP, 0, pointsToRender.length);
	}
	else
	{
		gl.drawArrays( gl.LINE_STRIP, 0, pointsToRender.length);
	}
};