var canvas = document.getElementById("sketchPad");
var ctx = canvas.getContext("2d");
/*ctx.beginPath();
ctx.arc(100,100,3,0,2*Math.PI);
ctx.fillStyle = "#000000";	
ctx.fill();
ctx.stroke();*/

var mousePosStore;
var mousPos;
var carbonPositions = [];
var drawnGraph = [];

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

function getDist(pt1, pt2) {
	var a = pt1.x - pt2.x;
	var b = pt1.y - pt2.y;
	var c = Math.sqrt( a*a + b*b);
	return c;
}

function drawCarbon(p) { 
	var minD = 99999999; 
	var d;
	for (var i = 0; i < carbonPositions.length; i++) {
		d = getDist(p, carbonPositions[i]);
		if (d < minD) {
			minD = d;
		}
	}
	if (minD < 20) {
		return false; // don't draw carbons too close to each other.
	}
	ctx.moveTo(p.x,p.y);
	ctx.arc(p.x,p.y,3,0,2*Math.PI);
	ctx.fillStyle = "#000";
	ctx.fill();
	ctx.stroke();
	carbonPositions.push(p);
	drawnGraph.push([]);
}

function drawBond(start, end) {
	var startC;
	var d;
	var minD = 99999999;
	for (var i = 0; i < carbonPositions.length; i++) {
		d = getDist(start, carbonPositions[i]);
		if (d < minD) {
			minD = d;
			startC = carbonPositions[i];
		}
	}
	console.log(minD);
	if (minD > 10) {
		return false; //don't draw bond
	}
	var endC;
	var minD = 99999999;
	for (var i = 0; i < carbonPositions.length; i++) {
		d = getDist(end, carbonPositions[i]);
		if (d < minD) {
			minD = d;
			endC = carbonPositions[i];
		}
	}
	console.log(minD);
	if (minD > 10) {
		return false; //don't draw bond
	}
	if (getDist(startC,endC) === 0) {
		return false; //don't draw bond
	}
	ctx.beginPath();
	ctx.moveTo(startC.x, startC.y);
	ctx.lineTo(endC.x, endC.y);
	ctx.fillStyle = "#000";
	ctx.fill();
	ctx.stroke();

	startInd = carbonPositions.indexOf(startC);
	endInd = carbonPositions.indexOf(endC);
	drawnGraph[startInd].push(endInd);
	drawnGraph[endInd].push(startInd);
	console.log(graph);
}

canvas.addEventListener('mousemove', function(evt) {
	mousePos = getMousePos(canvas, evt);
}, false);

canvas.addEventListener('mousedown', function(evt) {
	mousePosStore = getMousePos(canvas,evt);
}, false)

canvas.addEventListener('mouseup', function(evt) {
	mousePos = getMousePos(canvas, evt);
	d = getDist(mousePos, mousePosStore);
	if (d < 3) {
		drawCarbon(mousePosStore);
	}
	else {
		drawBond(mousePosStore, mousePos);
	}
}, false)
