function test() {
	/*//FUNCTION: smilesToCarbonSkeleton(smilesInput)
	var smiles = document.getElementById("SMILES").value;
	out = smilesToCarbonSkeleton(smiles);
	console.log(out);
	
	
	//FUNCTION: findLongestPath(adjList)
	var smiles = document.getElementById("SMILES").value;
	graph = smilesToCarbonSkeleton(smiles);
	out = findLongestPath(graph);
	console.log(out);

	//FUNCTION: findBranches(skel)
	var smiles = document.getElementById("SMILES").value;
	graph = smilesToCarbonSkeleton(smiles);
	b = findBranches(graph);
	console.log(b);
	
	//FUNCTION: nameBranches(branchGraphs)
	var smiles = document.getElementById("SMILES").value;
	graph = smilesToCarbonSkeleton(smiles);
	b = findBranches(graph);
	out = nameBranches(b);
	console.log(out);*/

	//FUNCTION : name();
	x = name(drawnGraph, false);
	alert(x);
}



var numToPrefix = {
	1: "meth",
	2: "eth",
	3: "prop",
	4: "but",
	5: "pent",
	6: "hex",
	7: "hept",
	8: "oct",
	9: "non",
	10: "dec",
	11: "undec",
	12: "dodec",
	13: "tridec",
	14: "tetradec",
	15: "pentadec",
	16: "hexadec",
	17: "heptadec",
	18: "octadec",
	19: "nonadec",
	20: "icos",
	21: "henicos",
	22: "docos",
	23: "tricos",
	24: "tetracos",
	25: "pentacos",
	26: "hexacos",
	27: "heptacos",
	28: "octacos",
	29: "nonacos",
	30: "triacont",
	31: "hentriacont",
	32: "dotriacont",
	33: "tritriacont",
}

var numToNumTerm = {
	1: '', // I don't think 'mono' is ever necessary?
	2: 'di',
	3: 'tri',
	4: 'tetra',
	5: 'penta',
	6: 'hexa',
	7: 'hepta',
	8: 'octa',
	9: 'nona',
	10: 'deca'
}

var numToMultTerm = {
	1: '',
	2: 'bis',
	3: 'tris',
	4: 'tetrakis',
	5: 'pentakis',
	6: 'hexakis',
	7: 'heptakis',
	8: 'octakis',
	9: 'nonakis',
	10: 'decakis'
}

function getMaxOfArray(numArray) {
	return Math.max.apply(null, numArray);
}

function arrayContains(arr1, arr2) { // Returns true if arr1 contains every element of arr2. Returns false otherwise.
	for (var i = 0; i < arr2.length; i++) {
		if (arr1.indexOf(arr2[i]) === -1) {
			return false;
		}
	}
	return true;
}

function arrayAdd(arr1, arr2) {	// Creates a new array with all elements of arr1 and arr2, but without repeating any elements.
	newArr = arr1;
	for (var i = 0; i < arr2.length; i++) {
		if (newArr.indexOf(arr2[i]) === -1) {
			newArr.push(arr2[i]);
		}
	}
	return newArr;
}

function findLongestPath(adjList) { // returns length of longest path possible without repeating nodes

	endPts = []; // list of nodes with only one edge
	for (var i = 0; i < adjList.length; i++) {
		if (adjList[i].length === 1) {
			endPts.push(i);
		}
	}

	longestPathLength = 0;
	for (var i = 0; i < endPts.length; i++) {
		startPt = endPts[i];
		pathLengths = new Array(adjList.length).fill(-1);
		searched = [startPt];
		distance = 0;
		pathLengths[startPt] = 0;
		while (searched.length < adjList.length) {
			distance++;
			newNodes = [];
			for (var j = 0; j < searched.length; j++) {
				for (var k = 0; k < adjList[searched[j]].length; k++) {
					h = adjList[searched[j]][k];
					if (newNodes.indexOf(h) === -1 && searched.indexOf(h) === -1) {
						newNodes.push(h);
					}
					if (pathLengths[h] === -1) {
						pathLengths[h] = distance;
					}

				}
			}
			searched = searched.concat(newNodes);
		}
		if (getMaxOfArray(pathLengths) > longestPathLength) {
			carbon1 = endPts[i];
			carbonLast = pathLengths.indexOf(getMaxOfArray(pathLengths));
		}
		longestPathLength = Math.max(longestPathLength, getMaxOfArray(pathLengths));
	}

	// Deal with methane:
	if (adjList.length === 1) {
		carbon1 = 0;
	}

	// Find the actual path, not just the length:
	discovered = [carbon1];
	testPath = [carbon1];
	currNode = carbon1;
	while (testPath.length < longestPathLength+1) {
		for (var k = 1; k < (testPath.length - 1); k++) { // Delete nodes from test path except the end point and the start point
			ind = discovered.indexOf(testPath[k]);
			discovered.splice(ind, 1);
		}
		testPath = [carbon1];
		currNode = carbon1;
		while (!arrayContains(discovered, adjList[currNode])) { // While there is an undiscovered node connected to current node THIS LOOP IS INFINITE	
			for (var j = 0; j < adjList[currNode].length; j++) {
				x = adjList[currNode][j];
				if (discovered.indexOf(x) === -1) { // Only if we haven't used the node yet
					discovered.push(x);
					testPath.push(x);
					currNode = x;
					break;
				}
			}
		}
	}
	return testPath;
}

function findLongestPathFromZero(adjList) {
// Copied & Pasted from findLongestPath(adjList). (Just did one iteration of for loop. startPt = 0.)
// Can definitely be simplified a little bit, but didn't feel like messing with it.
	endPts = []; // list of nodes with only one edge
	for (var i = 0; i < adjList.length; i++) {
		if (adjList[i].length === 1) {
			endPts.push(i);
		}
	}

	longestPathLength = 0;
	startPt = 0;
	pathLengths = new Array(adjList.length).fill(-1);
	searched = [startPt];
	distance = 0;
	pathLengths[startPt] = 0;
	while (searched.length < adjList.length) {
		distance++;
		newNodes = [];
		for (var j = 0; j < searched.length; j++) {
			for (var k = 0; k < adjList[searched[j]].length; k++) {
				h = adjList[searched[j]][k];
				if (newNodes.indexOf(h) === -1 && searched.indexOf(h) === -1) {
					newNodes.push(h);
				}
				if (pathLengths[h] === -1) {
					pathLengths[h] = distance;
				}

			}
		}
		searched = searched.concat(newNodes);
	}
	if (getMaxOfArray(pathLengths) > longestPathLength) {
		carbon1 = 0;
		carbonLast = pathLengths.indexOf(getMaxOfArray(pathLengths));
	}
	longestPathLength = Math.max(longestPathLength, getMaxOfArray(pathLengths));

	// Deal with methane:
	if (adjList.length === 1) {
		carbon1 = 0;
	}

	// Find the actual path, not just the length:
	discovered = [carbon1];
	testPath = [carbon1];
	currNode = carbon1;
	while (testPath.length < longestPathLength+1) {
		for (var k = 1; k < (testPath.length - 1); k++) { // Delete nodes from test path except the end point and the start point
			ind = discovered.indexOf(testPath[k]);
			discovered.splice(ind, 1);
		}
		testPath = [carbon1];
		currNode = carbon1;
		while (!arrayContains(discovered, adjList[currNode])) { // While there is an undiscovered node connected to current node
			for (var j = 0; j < adjList[currNode].length; j++) {
				x = adjList[currNode][j];
				if (discovered.indexOf(x) === -1) { // Only if we haven't used the node yet
					discovered.push(x);
					testPath.push(x);
					currNode = x;
					break;
				}
			}
		}
	}
	return testPath;
}

function findBranches(skel) { 	
	backbone = findLongestPath(skel); // backbone actually renumbers the carbons to how they will be numbered in the name output.
	allBranches = []; // Will contain all the subgraphs representing branches.
	for (var i = 0; i < backbone.length; i++) { // Ci is the carbon in the backbone at which we are looking for branches.
		Ci = backbone[i];
		adjCs = skel[Ci];
		if (!arrayContains(backbone, adjCs)) { // If Ci is bonded to a carbon not in the backbone
			// There is a branch! Let's graph it.
			for (var j = 0; j < adjCs.length; j++) {
				Cj = adjCs[j]; // Cj is potentially the start of a branch. (max 2 per Ci)
				branch = [];	// will contain two elements: 	(1) index of Ci (which is just i), where the branch connects
							 	//								(2) the graph of the branch. Cj will have index 0.
				branch.push(i); // where the branch is located on the backbone
				subgraph = []; // adjacency list for the branch
				subgraph.push([]); // adjacencies of Cj
				branchInd = 0; // counter to reindex carbons in branch. Cj has index 0.
				if (backbone.indexOf(Cj) === -1) { // Now we know Cj is a start of a branch.
					discovered = [];
					newNodes = [Ci, Cj];
					while (newNodes.length !== 0) {
						discovered = arrayAdd(discovered, newNodes);
						newNodes = [];
						for (var k = 1; k < discovered.length; k++) { // Ck is discovered in the branch.
							Ck = discovered[k];
							for (var h = 0; h < skel[Ck].length; h++) { // Ch is connected to Ck
								Ch = skel[Ck][h];
								if (discovered.indexOf(Ch) === -1) {
									newNodes.push(Ch);
									branchInd += 1;
									subgraph.push([]);
									subgraph[k-1].push(branchInd);
									subgraph[branchInd].push(k-1);
								}
							}
						}
					}
					branch.push(subgraph);
					allBranches.push(branch);
				}
			}
		}
	}

	return allBranches;
}

function findBrBranches(skel) {
	backbone = findLongestPathFromZero(skel); // backbone actually renumbers the carbons to how they will be numbered in the name output.
	allBranches = []; // Will contain all the subgraphs representing branches.
	for (var i = 0; i < backbone.length; i++) { // Ci is the carbon in the backbone at which we are looking for branches.
		Ci = backbone[i];
		adjCs = skel[Ci];
		if (!arrayContains(backbone, adjCs)) { // If Ci is bonded to a carbon not in the backbone
			// There is a branch! Let's graph it.
			for (var j = 0; j < adjCs.length; j++) {
				Cj = adjCs[j]; // Cj is potentially the start of a branch. (max 2 per Ci)
				branch = [];	// will contain two elements: 	(1) index of Ci (which is just i), where the branch connects
							 	//								(2) the graph of the branch. Cj will have index 0.
				branch.push(i); // where the branch is located on the backbone
				subgraph = []; // adjacency list for the branch
				subgraph.push([]); // adjacencies of Cj
				branchInd = 0; // counter to reindex carbons in branch. Cj has index 0.
				if (backbone.indexOf(Cj) === -1) { // Now we know Cj is a start of a branch.
					discovered = [];
					newNodes = [Ci, Cj];
					while (newNodes.length !== 0) {
						discovered = arrayAdd(discovered, newNodes);
						newNodes = [];
						for (var k = 1; k < discovered.length; k++) { // Ck is discovered in the branch.
							Ck = discovered[k];
							for (var h = 0; h < skel[Ck].length; h++) { // Ch is connected to Ck
								Ch = skel[Ck][h];
								if (discovered.indexOf(Ch) === -1) {
									newNodes.push(Ch);
									branchInd += 1;
									subgraph.push([]);
									subgraph[k-1].push(branchInd);
									subgraph[branchInd].push(k-1);
								}
							}
						}
					}
					branch.push(subgraph);
					allBranches.push(branch);
				}
			}
		}
	}

	return allBranches;
}

function checkForBranchedBranch(branchGraphs) { // adds third element to each branch in branchGraphs: true if the branch has branches, false if not.
	for (var i = 0; i < branchGraphs.length; i++) {
		subgraph = branchGraphs[i][1];
		branchGraphs[i][2] = false;
		for (var j = 0; j < subgraph.length; j++) {
			if (j === 0 && subgraph[j].length > 1) {
				branchGraphs[i][2] = true;
				break;
			}
			if (subgraph[j].length > 2) {
				branchGraphs[i][2] = true;
				break;
			}
		}
	}
	return branchGraphs;
}

var yStore = [];
var brStore = [];
function nameBranches(branchGraphs) { // runs infinitely as of now
	namedBranches = branchGraphs;
	branchGraphs = checkForBranchedBranch(branchGraphs);
	for (var y = 0; y < branchGraphs.length; y++) {
		if (!branchGraphs[y][2]) {
			namedBranches[y][1] = numToPrefix[branchGraphs[y][1].length] + 'yl';
			console.log(namedBranches[y][1]);
		}
		else if (branchGraphs[y][2]) { // ALTER SO THAT IT CAN NAME INFINITELY BRANCHED STRUCTURES
			console.log(y);
			console.log(namedBranches[y][1]);
			yStore.push(y);
			brStore.push(namedBranches);
			x = name(branchGraphs[y][1], true);
			y = yStore.pop();
			namedBranches = brStore.pop();
			namedBranches[y][1] = '(' + x + ')';
			console.log(namedBranches[y][1]);
		}
	}
	return namedBranches;
}

function name(skeleton, side) { // side=true for branches, side=false for molecules
	if (side === true) {
		branches = findBrBranches(skeleton);
		branches = nameBranches(branches);
		backbone = findLongestPathFromZero(skeleton);
	}	
	else if (side === false) {
		branches = findBranches(skeleton);
		branches = nameBranches(branches);
		backbone = findLongestPath(skeleton);
	}


	subsTypes = [];
	subsCount = [];
	subsPositions = [];
	for (var i = 0; i < branches.length; i++) {
		subInd = subsTypes.indexOf(branches[i][1]);
		if (subInd !== -1) {
			subsCount[subInd]++;
			subsPositions[subInd].push(branches[i][0]);
		}
		if (subInd === -1) {
			subsTypes.push(branches[i][1]);
			subsCount.push(1);
			subsPositions.push([]);
			subsPositions[subsPositions.length - 1].push(branches[i][0]);
		}
	}
	copy = subsPositions;
	subsPositions = new Array(copy.length).fill('');
	for (var k = 0; k < copy.length; k++) {
		for (var h = 0; h < copy[k].length; h++) {
			subsPositions[k] = subsPositions[k] + (copy[k][h]+ 1) + ',';
		}
		subsPositions[k] = subsPositions[k].substring(0,subsPositions[k].length - 1);
	}

	subs = [];
	for (var i = 0; i < subsTypes.length; i++) {
		subs.push([]);
		subs[i].push(subsTypes[i]);
		subs[i].push(subsCount[i]);
		subs[i].push(subsPositions[i]);
	}
	subs.sort(function(a,b) {
		if (a[0] > b[0]) return -1;
		if (a[0] < b[0]) return 1;
	});

	if (side === true) {
		output = numToPrefix[backbone.length] + 'yl';
	}
	if (side === false) {
		output = numToPrefix[backbone.length] + 'ane';
	}
	for (var j = 0; j < subs.length; j++) {
		if (subs[j][0].charAt(0) === '(') {
			output = '-' + subs[j][2] + '-' + numToMultTerm[subs[j][1]] + subs[j][0] + output;
		}
		else {
			output = '-' + subs[j][2] + '-' + numToNumTerm[subs[j][1]] + subs[j][0] + output;
		}
	}
	if (output.charAt(0) === '-') {
		output = output.substring(1,output.length);
	}

	return output;
}
