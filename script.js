function test() {
	/* 
	//FUNCTION: smilesToCarbonSkeleton(smilesInput)
	var smiles = document.getElementById("SMILES").value;
	out = smilesToCarbonSkeleton(smiles);
	console.log(out);
	*/
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
		// *****  Finding the carbon bonded behind *****
		if (i === 0) {	// If i=0, there is no previous carbon. 
			// Do nothing.
		}
		else if (smilesInput.charAt(ithCIndex-1) !== ')') {	// Not ) --> no branch, need last mentioned carbon.
			indexOfLastC = smilesInput.lastIndexOf('C', ithCIndex-1);
			labelOfAdjCarbon = carbonIndices.indexOf(indexOfLastC);
			adjacencyList[i].push(labelOfAdjCarbon);
		}
		else if (smilesInput.charAt(ithCIndex-1) === ')') {	// If previous carbon has branching.  Here we assume that no carbon has >4 bonds
			branchEnd = carbonIndices[i] - 1;
			branchBegin = smilesInput.lastIndexOf('(', branchEnd);
			if (smilesInput.charAt(branchBegin - 1) === ')') { // There is another branch
				branchEnd = branchBegin - 1;
				branchBegin = smilesInput.lastIndexOf('(', branchEnd);
			} 	// There can be no more than two branches in between ith carbon and its prev bonded carbon.
			if (smilesInput.charAt(branchBegin-1) !== ')') { // Not ) --> no branch, need last mentioned carbon.
				indexOfLastC = smilesInput.lastIndexOf('C',branchBegin-1);
				labelOfAdjCarbon = carbonIndices.indexOf(indexOfLastC);
				adjacencyList[i].push(labelOfAdjCarbon);
			}
			else { alert('ERROR 01: Could not construct carbon skeleton.'); }
		}
		// *****  Finding the carbon(s) bonded after *****
		nextCarbon = smilesInput.indexOf('C', ithCIndex+1); // Index of next carbon
		// **Find Closest Parentheses in either direction**
		prevOpenParentheses = smilesInput.lastIndexOf('(', ithCIndex);
		prevCloseParentheses = smilesInput.lastIndexOf(')', ithCIndex);
		nextOpenParentheses = smilesInput.indexOf('(', ithCIndex);
		nextCloseParentheses = smilesInput.indexOf(')', ithCIndex);
		if (nextCarbon === -1) { // Last carbon can't be bonded to anything after it.
			// Do nothing.
		}	
		else if (prevOpenParentheses > prevCloseParentheses && nextCloseParentheses < nextOpenParentheses && nextCloseParentheses < nextCarbon) { // Next carbon is outside of ith carbon's branch. ith carbon is the end of a branch.
			// Do nothing.
		}
		else {
			labelOfAdjCarbon = carbonIndices.indexOf(nextCarbon); // ith carbon must be bonded to the first carbon after it.
			adjacencyList[i].push(labelOfAdjCarbon);
		}
		if (smilesInput.charAt(nextCarbon-1) === '(') {
			branchEnd = smilesInput.indexOf(')', nextCarbon-1);
			nextCarbon = smilesInput.indexOf('C', branchEnd);
			labelOfAdjCarbon = carbonIndices.indexOf(nextCarbon);
			adjacencyList[i].push(labelOfAdjCarbon);
			if (smilesInput.charAt(nextCarbon-1) === '(') { // Max of three carbons bonded after. This should be the last one.
				branchEnd = smilesInput.indexOf(')', nextCarbon-1);
				nexCarbon = smilesInput.indexOf('C', branchEnd);
				labelOfAdjCarbon = carbonIndices.indexOf(nextCarbon);
				adjacencyList[i].push(labelOfAdjCarbon);
			}
		}
	}
	// *****  Add ring bonds  ***** 
	// need to add this
	return adjacencyList;
}

function longestPath(adjList) {

}