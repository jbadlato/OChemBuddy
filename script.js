function test() {

	//FUNCTION: smilesToCarbonSkeleton(smilesInput)
	var smiles = document.getElementById("SMILES").value;
	out = smilesToCarbonSkeleton(smiles);
	console.log(out);
	
	
	//FUNCTION: findLongestPath(adjList)
	var smiles = document.getElementById("SMILES").value;
	graph = smilesToCarbonSkeleton(smiles);
	out = findLongestPath(graph);
	console.log(out);
	
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
	20: "eicos"
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

function findLongestPath(adjList) { // returns length of longest path possible without repeating nodes

	// ********** NOTE: THIS RETURNS THE LENGTH OF THE PATH. THIS TRANSLATES TO THE NUMBER OF BONDS, NOT NUMBER OF CARBONS ALONG THE PATH. ************


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

function smilesToCarbonSkeleton(smilesInput) {
	smilesInput = smilesInput + '()'; // Needed for branch detection.

	/* For now, assuming that there are no rings. (Therefore no aromatic rings & no lowercase letters)
	Also assume for now that there is only carbons.

	Carbon Index refers to where the carbon is within the SMILES string.
	Carbon Label refers to the number we assign to the carbon to keep track of it within the graph.
	*/
	adjacencyList = []; // Stores adjacency lists for each node
	carbonIndices = [];	// Labels each carbon numerically and stores their positions in SMILES string
	for (var i = 0; i < smilesInput.length; i++) { // Count the carbons & generate empty adjacency matrix
		if (smilesInput.charAt(i) === 'C') {
			adjacencyList.push([]); // Create new node
			carbonIndices.push(i); // Label the carbon & Store its position in the SMILES string
		}
	}
	for (var i = 0; i < carbonIndices.length; i++) { // For each iteration, find the adjacencies for the ith carbon.
		ithCIndex = carbonIndices[i];
		// -----  Finding the carbon bonded behind -----
		if (i === 0) {	// If i=0, there is no previous carbon. 
			// Do nothing.
		}
		else {
			befiC = smilesInput.substring(0,ithCIndex); // string up to ith C
			xedOut = xParenth(befiC);
			adjCIndex = xedOut.lastIndexOf('C');
			adjCLabel = carbonIndices.indexOf(adjCIndex);
			adjacencyList[i].push(adjCLabel);
		}


		// -----  Finding the carbon(s) bonded after -----
		if (i === carbonIndices.length - 1) { // This would be the last carbon. Nothing after it.
			continue;
		}
		else { 
			// Find C that is not branched:
			aftiC = smilesInput.substring(ithCIndex+1, smilesInput.length);
			if (aftiC.indexOf(')') < aftiC.indexOf('C')) { // This is the end of a branch.
				continue;
			}
			xedOut = xParenth(aftiC);
			unbranchedCIndex = xedOut.indexOf('C');
			unbranchedCIndex += ithCIndex + 1;
			unbranchedCLabel = carbonIndices.indexOf(unbranchedCIndex);
			adjacencyList[i].push(unbranchedCLabel);

			// Find branched connection(s), if they exist: 
			if (aftiC.indexOf('(') === -1) { // There isn't any branching at all after this carbon, let alone on this carbon.
				continue;
			}
			firstopenP = aftiC.indexOf('(') + ithCIndex + 1;
			if (firstopenP < unbranchedCIndex) { // This means there is at least one branched connection.
				firstopenP = aftiC.indexOf('(');
				branchedCIndex = aftiC.indexOf('C', firstopenP) + ithCIndex + 1;
				branchedCLabel = carbonIndices.indexOf(branchedCIndex);
				adjacencyList[i].push(branchedCLabel);
				// Look for a second branched connection: (There is a max of two for nearly all organic molecules)
				// Find end of first branch: 
				openCount = 0;
				closeCount = 0;
				for (var j = 0; j < aftiC.length; j++) {
					if (aftiC.charAt(j) === '(') {
						openCount++;
					}
					if (aftiC.charAt(j) === ')') {
						closeCount++;
					}
					if (openCount === closeCount) {
						break;	// At the first instance of # of open parentheses equaling # of close parentheses, this is the end of the first branch.
						// When the loop breaks, j will equal the index of the last close parentheses of the branch.
					}
				}
				branchEnd = j;
				if (aftiC.indexOf('(', branchEnd) === 1) { // No more branching in the molecule at all.
					continue;
				}
				firstopenP = aftiC.indexOf('(', branchEnd) + ithCIndex + 1;
				if (firstopenP < unbranchedCIndex) { // This means there is a second branch from ith Carbon.
					firstopenP = aftiC.indexOf('(', branchEnd);
					branchedCIndex = aftiC.indexOf('C', firstopenP) + ithCIndex + 1;
					branchedCLabel = carbonIndices.indexOf(branchedCIndex);
					adjacencyList[i].push(branchedCLabel);
				}
			}
		}
	}
	// -----  Add ring bonds  ----- 
	// May or may not have to do this here depending on structure of the rest of the program.
	return adjacencyList;
}

function findBranches(skel) {
	longChain = findLongestPath(skel) + 1;

}

function name() {
	var input = document.getElementById("SMILES").value;
	skeleton = smilesToCarbonSkeleton(input);
	longestChain = findLongestPath(skeleton) + 1;
	
}
