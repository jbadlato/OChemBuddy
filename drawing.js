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
var cursorType = 'draw';

document.getElementById("sketchPad").onmousedown = function() {
	return false;
};

function clrScrn() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
}

function changeToErase() {
	cursorType = 'erase';
}

function changeToDraw() {
	cursorType = 'draw';
}

function eraseAll() {
	clrScrn();
	carbonPositions = [];
	drawnGraph = [];
	cursorType = 'draw';
	drawGraph();
}

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

function findClosestCarbon(p) {
	var minD = 99999999; 
	var d;
	var closestCarbon;
	for (var i = 0; i < carbonPositions.length; i++) {
		d = getDist(p, carbonPositions[i]);
		if (d < minD) {
			minD = d;
			closestCarbon = carbonPositions[i];
		}
	}
	return {
		position: closestCarbon,
		distance: minD
	}
}

function drawGraph() {
	//var c = ;
	//var c1 = -2;
	//var c2 = -2;
	clrScrn();
	// draw carbons:
	for (var i = 0; i < carbonPositions.length; i++) {
		//c = carbonPositions[i];
		drawCarbon(carbonPositions[i]);
	}
	// draw bonds:
	for (var i = 0; i < drawnGraph.length; i++) {
		//c1 = carbonPositions[i];
		for (var j = 0; j < drawnGraph[i].length; j++) {
			//c2 = carbonPositions[drawnGraph[i][j]];
			drawBond(carbonPositions[i], carbonPositions[drawnGraph[i][j]]);
		}
	}
}

function drawCarbon(p) { 
	ctx.moveTo(p.x,p.y);
	ctx.arc(p.x,p.y,3,0,2*Math.PI);
	ctx.fillStyle = '#000';
	ctx.fill();
	ctx.stroke();
}

function createCarbon(p) {
	closeC = findClosestCarbon(p);
	if (closeC.distance < 20) {
		return false; // don't draw carbons too close to each other.
	}
	carbonPositions.push(p);
	drawnGraph.push([]);
}

function drawBond(start, end) {
	var closeCstart = findClosestCarbon(start);
	if (closeCstart.distance > 10) {
		return false; //don't draw bond
	}
	var closeCend = findClosestCarbon(end);
	if (closeCend.distance > 10) {
		return false; //don't draw bond
	}
	if (closeCstart.position === closeCend.position) {
		return false; //don't draw bond
	}
	ctx.beginPath();
	ctx.moveTo(closeCstart.position.x, closeCstart.position.y);
	ctx.lineTo(closeCend.position.x, closeCend.position.y);
	ctx.fillStyle = '#000';
	ctx.fill();
	ctx.stroke();
}

function createBond(start, end) {
	startInd = carbonPositions.indexOf(start);
	endInd = carbonPositions.indexOf(end);
	for (var i = 0; i < drawnGraph[startInd].length; i++) {
		if (drawnGraph[startInd][i] === endInd) {
			return false;
		}
	}
	drawnGraph[startInd].push(endInd);
	drawnGraph[endInd].push(startInd);
}

function deleteCarbon(p) {
	cInd = carbonPositions.indexOf(p);
	carbonPositions.splice(cInd, 1);
	drawnGraph.splice(cInd, 1);
	for (var i = 0; i < drawnGraph.length; i++) {
		for (var j = 0; j < drawnGraph[i].length; j++) {
			if (drawnGraph[i][j] === cInd) {
				x = drawnGraph[i].indexOf(cInd);
				drawnGraph[i].splice(x, 1);
			}
			if (drawnGraph[i][j] > cInd) {
				drawnGraph[i][j]--;
			}
		}
	}
}

canvas.addEventListener('mousemove', function(evt) {
	mousePos = getMousePos(canvas, evt);
}, false);

canvas.addEventListener('mousedown', function(evt) {
	mousePosStore = getMousePos(canvas,evt);
}, false);

canvas.addEventListener('mouseup', function(evt) {
	mousePos = getMousePos(canvas, evt);
	if (cursorType === 'draw') {
		d = getDist(mousePos, mousePosStore);
		if (d < 3) {
			createCarbon(mousePosStore);
			clrScrn();
			drawGraph();
		}
		else {
			start = findClosestCarbon(mousePosStore);
			end = findClosestCarbon(mousePos);
			if (start.position !== end.position && start.distance < 15 && end.distance < 15) {
				createBond(start.position, end.position);
				clrScrn();
				drawGraph();
			}
		}
	}
	else if (cursorType === 'erase') {
		c = findClosestCarbon(mousePos);
		if (c.distance < 10) {
			deleteCarbon(c.position);
			clrScrn();
			drawGraph();
		}
	}
}, false);
