function test() {
	if (checkForRings(drawnGraph)) {
		alert('Cyclic hydrocarbons not currently supported :(');
		return false;
	}
	if (!checkForConnectivity(drawnGraph)) {
		alert('Only input one molecule at a time');
		return false;
	}
	else{
		x = name(drawnGraph, false);
		alert(x);
	}
	console.log('done');
}

function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var q = 0, len = obj.length; q < len; q++) {
        	copy[q] = clone(obj[q]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

function stringArray(arr) {
    x = '';
    if (arr instanceof Array) {
        x += '[';
        for (var i = 0; i < arr.length; i++) {
            if (i > 0 ) {
                x += ',';
            }
            x += stringArray(arr[i]);            
        }
        x += ']';
        return x;
    }
    return x += arr;
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

function getMinOfArray(numArray) {
	return Math.min.apply(null, numArray);
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

function getAllIndices(arr, val) {
	var indices = [];
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] === val) {
			indices.push(i);
		}
	}
	return indices;
}

function isItemInArray(array, item) { // for use in the longest path algorithm
	for (var i = 0; i < array.length; i++) {
		if (array[i][0] === item[0] && array[i][1] === item[1]) {
			return true;
		}
	}
	return false;
}

function checkForRings(adjList) { // returns true if there is a ring in the structure; returns false if not.
	adjListCopy = clone(adjList);
	endPoints = [];
	for (var a = 0; a < adjListCopy.length; a++) {
		if (adjListCopy[a].length === 1) {
			endPoints.push(a);
		}
	}
	while (endPoints.length > 0) {
		// delete end points from graph: 
		for (var a = 0; a < endPoints.length; a++) {
			for (var b = 0; b < adjListCopy.length; b++) {
				if (b === endPoints[a]) {
					adjListCopy[b] = []; //remove edges from endpoint
				}
				else {
					x = adjListCopy[b].indexOf(endPoints[a]);
					if (x !== -1) {
						adjListCopy[b].splice(x,1); //remove edge to end point
					}
				}
			}
		}
		// find new end points: 
		endPoints = [];
		for (var a = 0; a < adjListCopy.length; a++) {
			if (adjListCopy[a].length === 1) {
				endPoints.push(a);
			}
		}
	}
	numEdges = 0;
	for (var a = 0; a < adjListCopy.length; a++) {
		numEdges += adjListCopy[a].length;
	}
	if (numEdges === 0) {
		return false;
	}
	else {
		return true;
	}
}

function checkForConnectivity(adjList) { // returns true if the graph is strongly connected; returns false if not.
	discovered = [];
	newNodes = [0];
	while (newNodes.length !== 0) {
		discovered = arrayAdd(discovered, newNodes);
		newNodes = [];
		for (var k = 0; k < discovered.length; k++) {
			Ck = discovered[k];
			for (var h = 0; h < adjList[Ck].length; h++) {
				Ch = adjList[Ck][h];
				if (discovered.indexOf(Ch) === -1) {
					newNodes.push(Ch);
				}
			}
		}
	}
	if (discovered.length === adjList.length) {
		return true;
	}
	else if (discovered.length > adjList.length) {
		alert('ERROR');
		return false;
	}
	else {
		return false;
	}
}

function findLongestPath(adjList) { // returns length of longest path possible without repeating nodes
	endPts = []; // list of nodes with only one edge
	for (var i = 0; i < adjList.length; i++) {
		if (adjList[i].length === 1) {
			endPts.push(i);
		}
	}

	competingPaths = []; // each element in competingPaths is a pair of points: the start and end point of a longest path.
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
		inds = getAllIndices(pathLengths, getMaxOfArray(pathLengths));
		if (getMaxOfArray(pathLengths) > longestPathLength) {
			carbon1 = endPts[i];
			competingPaths = [];
			for (var j = 0; j < inds.length; j++) {
				newPath = [carbon1, inds[j]];
				newPath = newPath.sort(function(a,b) {return a-b});
				if (!isItemInArray(competingPaths, newPath)) {
					competingPaths.push(newPath);
				}
			}
		}
		if (getMaxOfArray(pathLengths) === longestPathLength) {
			carbon1 = endPts[i];
			for (var j = 0; j < inds.length; j++) {
				newPath = [carbon1, inds[j]];
				newpath = newPath.sort(function(a,b) {return a-b});
				if (!isItemInArray(competingPaths, newPath)) {
					competingPaths.push(newPath);
				}
			}
		}
		longestPathLength = Math.max(longestPathLength, getMaxOfArray(pathLengths));
	}

	// Deal with methane:
	if (adjList.length === 1) {
		return [0];
	}

	// Find the actual path, not just the length:
	for (var i = 0; i < competingPaths.length; i++) {
		carbon1 = competingPaths[i][0];
		endCarbon = competingPaths[i][1];
		discovered = clone(endPts);
		discovered.splice(discovered.indexOf(endCarbon), 1);
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
		competingPaths[i] = testPath;
	}
	// Rule 2.6a: Pick the chain with the greatest number of side chains.
	competingPathsSideChains = new Array(competingPaths.length).fill(0);
	for (var i = 0; i < competingPaths.length; i++) {
		for (var j = 0; j < competingPaths[i].length; j++) {
			for (var k = 0; k < adjList[competingPaths[i][j]].length; k++) {
				if (competingPaths[i].indexOf(adjList[competingPaths[i][j]][k]) === -1) {
					competingPathsSideChains[i]++;
				}
			}
		}
	}
	mostSideChains = getAllIndices(competingPathsSideChains, getMaxOfArray(competingPathsSideChains));
	copy2 = clone(competingPaths);
	competingPaths = [];
	for (var i = 0; i < mostSideChains.length; i++) {
		competingPaths.push(copy2[mostSideChains[i]]);
	}
	
	// Rule 2.6b: Pick the chain whose side chains have the lowest-numbered locants.
	competingPathsLocants = [];
	for (var i = 0; i < competingPaths.length; i++) {
		competingPathsLocants.push([]);
	}
	for (var i = 0; i < competingPaths.length; i++) {
		bone = competingPaths[i];
		for (var j = 0; j < bone.length; j++) {
			Cj = bone[j];
			for (var k = 0; k < adjList[Cj].length; k++) {
				Ck = adjList[Cj][k];
				if (bone.indexOf(Ck) === -1) {
					competingPathsLocants[i].push(j);
				}
			}
		}
	}
	for (var i = 0; i < competingPathsLocants.length; i++) {
		competingPathsLocants[i].sort(function(a,b){return a-b});
	}
	// Check the backwards numbering to see if it is better:
	for (var i = 0; i < competingPathsLocants.length; i++) {
		locants1 = clone(competingPathsLocants[i]);
		locants2 = [];
		for (var j = 0; j < locants1.length; j++) {
			newLocant = competingPaths[0].length - 1 - locants1[locants1.length - j - 1];
			locants2.push(newLocant);
		}
		if (stringArray(locants2) < stringArray(locants1)) {
			competingPathsLocants[i] = locants2;
		}
	}

	inferiorPaths = [];
	for (var i = 1; i < competingPaths.length; i++) {
		if (stringArray(competingPathsLocants[i-1]) < stringArray(competingPathsLocants[i])) {
			inferiorPaths.push(i);
		}
		else if (stringArray(competingPathsLocants[i]) < stringArray(competingPathsLocants[i-1])) {
			inferiorPaths.push(i-1);
		}
	}
	while (inferiorPaths.length > 0) {
		copyPaths = clone(competingPaths);
		competingPaths = [];
		copyLocants = clone(competingPathsLocants);
		competingPathsLocants = [];
		for (var i = 0; i < copyPaths.length; i++) {
			if (inferiorPaths.indexOf(i) === -1) {
				competingPaths.push(copyPaths[i]);
				competingPathsLocants.push(copyLocants[i]);	
			}
		}
		inferiorPaths = [];
		for (var i = 1; i < competingPaths.length; i++) {
			if (stringArray(competingPathsLocants[i-1]) < stringArray(competingPathsLocants[i])) {
				inferiorPaths.push(i);
			}
			else if (stringArray(competingPathsLocants[i]) < stringArray(competingPathsLocants[i-1])) {
				inferiorPaths.push(i-1);
			}
		}
	}

	// Rule A-2.6c: Pick the chain having the greatest number of carbon atoms in the smaller chains.
	maxChainSizes = [];
	for (var i = 0; i < competingPaths.length; i++) {
		sizes = [];
		pathsBranches = findBranchesUtil(adjList, competingPaths[i]);
		for (var j = 0; j < pathsBranches.length; j++) {
			sizes.push(pathsBranches[j][1].length);
		}
		maxChainSizes.push(getMaxOfArray(sizes));
	}
	bestPaths = getAllIndices(maxChainSizes, getMinOfArray(maxChainSizes));
	copy2 = clone(competingPaths);
	competingPaths = [];
	for (var i = 0; i < bestPaths.length; i++) {
		competingPaths.push(copy2[bestPaths[i]]);
	}

	// Rule A-2.6d: Pick the chain with the least number of branched side chains.
	numOfBranchedBranches = [];
	for (var i = 0; i < competingPaths.length; i++) {
		numOfBranchedBranches.push(0);
		pathsBranches = findBranchesUtil(adjList, competingPaths[i]);
		pathsBranches = checkForBranchedBranch(pathsBranches);
		for (var j = 0; j < pathsBranches.length; j++) {
			if (pathsBranches[j][2] === true) {
				numOfBranchedBranches[i]++;
			}
		}
	}
	bestPaths = getAllIndices(numOfBranchedBranches, getMinOfArray(numOfBranchedBranches));
	copy2 = clone(competingPaths);
	competingPaths = [];
	for (var i = 0; i < bestPaths.length; i++) {
		competingPaths.push(copy2[bestPaths[i]]);
	}


	return competingPaths[0];
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

function findBranchesUtil(skel, backbone) { 	
	//backbone = findLongestPath(skel); // backbone actually renumbers the carbons to how they will be numbered in the name output.
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

function xParenth(s) {	
	// This function replaces segments of a string in between '(' and ')' with '...xxxx...' (Both '(' and ')' are necessary)
	while (s.indexOf(')') !== -1 && s.indexOf('(') !== -1) { // until there are no more ')'
		closeP = s.lastIndexOf(')');
		openP = s.lastIndexOf('(',closeP); //closest '('
		closeP = s.indexOf(')', openP); //closest ')'. Now have the innermost set of ()
		x = 'x'.repeat(closeP - openP + 1);
		replaceThis = s.substring(openP, closeP + 1);
		s = s.replace(replaceThis, x);
	}
	return s;
}

function getLocantsFromName(str) {
	str = xParenth(str);
	x = str.match(/[0-9]+/g);
	if (x != null) {
		var matches = str.match(/[0-9]+/g).map(function(n){return +(n);});	
	}
	else {
		matches = [];
	}
	return matches;
}

function arrayGreaterThan(arr1, arr2) { // returns true if arr1 > arr2, returns false otherwise.
	for (var i = 0; i < arr1.length; i++) {
		if (arr1[i] === arr2[i]) {
			continue;
		}
		if (arr1[i] < arr2[i]) {
			return false;
		}
		if (arr1[i] > arr2[i]) {
			return true;
		}
	}
	return false;
}

function findBranches(skel) { // numbers the backbone such that the side chains have the lowest numbers possible (Rule A-2.2)
	backbone1 = findLongestPath(skel);
	backbone2 = [];
	for (var i = 0; i < backbone1.length; i++) {
		backbone2[i] = backbone1[backbone1.length-i-1];
	}
	branches1 = findBranchesUtil(skel, backbone1);
	branches2 = findBranchesUtil(skel, backbone2);
	numbers1 = [];
	numbers2 = [];
	for (var i = 0; i < branches1.length; i++) {
		numbers1.push(branches1[i][0]);
	}
	for (var i = 0; i < branches2.length; i++) {
		numbers2.push(branches2[i][0]);
	}
	numbers1.sort(function(a,b) {return a-b});
	numbers2.sort(function(a,b) {return a-b});
	for (var i = 0; i < numbers1.length; i++) {
		if (numbers1[i] < numbers2[i]) {
			return {
				backbone: backbone1,
				branchOutput: branches1
			};
		}
		if (numbers2[i] < numbers1[i]) {
			return {
				backbone: backbone2,
				branchOutput: branches2
			};
		}
	}
	// Rule A-2.4: If the substituents are in equivalent positions:
	skel1 = clone(skel); //renumber skeleton so we can name from 0 position of backbone1
	backCopy = clone(backbone1);
	skel1[0] = clone(skel[backCopy[0]]);
	skel1[backCopy[0]] = clone(skel[0]);
	for (var i = 0; i < skel1.length; i++) {
		for (var j = 0; j < skel1[i].length; j++) {
			if (skel1[i][j] === 0) {
				skel1[i][j] = backCopy[0];
			}
			else if (skel1[i][j] === backCopy[0]) {
				skel1[i][j] = 0;
			}
		}
	}
	skel2 = clone(skel);
	backCopy = clone(backbone2);
	skel2[0] = clone(skel[backCopy[0]]);
	skel2[backCopy[0]] = clone(skel[0]);
	for (var i = 0; i < skel2.length; i++) {
		for (var j = 0; j < skel2[i].length; j++) {
			if (skel2[i][j] == 0) {
				skel2[i][j] = backCopy[0];
			}
			else if (skel2[i][j] === backCopy[0]) {
				skel2[i][j] = 0;
			}
		}
	}
	name1 = name(skel1, true);
	name2 = name(skel2, true);
	locants1 = getLocantsFromName(name1);
	locants2 = getLocantsFromName(name2);
	if (arrayGreaterThan(locants2, locants1)) {
		return {
			backbone: backbone1,
			branchOutput: branches1
		};
	}
	if (arrayGreaterThan(locants1, locants2)) {
		return {
			backbone: backbone2,
			branchOutput: branches2
		};
	}

	return {
		backbone: backbone1,
		branchOutput: branches1
	};
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
		}
		else if (branchGraphs[y][2]) { // ALTER SO THAT IT CAN NAME INFINITELY BRANCHED STRUCTURES
			yStore.push(y);
			brStore.push(namedBranches);
			x = name(branchGraphs[y][1], true);
			y = yStore.pop();
			namedBranches = brStore.pop();
			namedBranches[y][1] = '(' + x + ')';
		}
	}
	return namedBranches;
}

function lettersOnly(string) {
	firstLetter = string.match(/[a-z]/i)[0];
	ind = string.indexOf(firstLetter);
	letters = string.substring(ind, string.length);
	return letters;
}

var backboneStore = [];
function name(skeleton, side) { // side=true for branches, side=false for molecules
	if (side === true) {
		branches = findBrBranches(skeleton);
		branches = nameBranches(branches);
		backbone = findLongestPathFromZero(skeleton);
	}	
	else if (side === false) {
		x = findBranches(skeleton);
		backbone = x.backbone;
		branches = x.branchOutput;
		backboneStore.push(backbone);
		branches = nameBranches(branches);
		backbone = backboneStore.pop();
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
	copyP = clone(subsPositions);
	subsPositions = new Array(copyP.length).fill('');
	for (var k = 0; k < copyP.length; k++) {
		for (var h = 0; h < copyP[k].length; h++) {
			subsPositions[k] = subsPositions[k] + (copyP[k][h]+ 1) + ',';
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
		if (lettersOnly(a[0]) === lettersOnly(b[0])) {
			if (a[0] > b[0]) return -1;
			if (a[0] < b[0]) return 1;
		}
		if (lettersOnly(a[0]) > lettersOnly(b[0])) return -1;
		if (lettersOnly(a[0]) < lettersOnly(b[0])) return 1;
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
