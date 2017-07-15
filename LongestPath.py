# Interpret graph as an adjacency matrix
# Key:
# 0 : no bond between atoms i & j
# 1 : single bond between atoms i & j
# 2 : double bond between atoms i & j
# 3 : triple bond between atoms i & j
# Need to figure out how to represent stereochemistry with this method...

# Valid assumptions about the graph:
# - Maximum of 4 edges coming out of/into any one atom (Each row and column should add up to at most 4)
# - No cycles. Cycles will be detected before this. 
# - Only carbon atoms. Functional groups will be detected before this.
# - Only single bonds. For now, I will just consider this simpler problem. 
#   In the future, I'll have to figure out how to use this in the context of included double & triple bonds. 

# For now, we will consider a saturated hydrocarbon with 10 carbon atoms. 
# Input some graph and number each carbon from 0 to 9 to get an adjacency list:
graph = [ [1], 		# atom 0 is bonded only to atom 1.
		  [0, 2, 3], # atom 1 is bonded to atoms 0, 2, 3.
		  [1], 		# atom 2 is bonded only to atom 1.
		  [1, 4, 5], # atom 3 is bonded to atoms 1, 4, 5.
		  [3, 8],	# atom 4 is bonded to atoms 3, 8.
		  [3, 6, 7], # atom 5 is bonded to atoms 3, 6, 7
		  [5, 9],	# atom 6 is bonded to atoms 5, 9.
		  [5],		# atom 7 is bonded only to atom 5.
		  [4],		# atom 8 is bonded only to atom 4. 
		  [6]		# atom 9 is bonded only to atom 6. 
		] 

# Now, we start by finding all the end points of the graph.  These are the nodes with only one edge.
# Next, we use a shortest path algorithm to find the distance between each pair of end points. 
# Then we can find the longest path by comparing the distances between end points.  
# In case of a tie, we will have to look at branching & preference of substituents.

# Find end points:
endPoints = []
for i in range(0,len(graph)):
	if len(graph[i]) == 1:
		endPoints.append(i)

# Shortest Path Algorithm (Breadth-first search):
longestPath = 0
for i in endPoints:
	pathLengths = [-1] * len(graph)
	searched = [i]
	distance = 0
	pathLengths[i] = 0
	while len(searched) < len(graph):
		distance += 1
		newNodes = []
		for j in searched:
			for k in graph[j]:
				if k not in newNodes and k not in searched:
					newNodes.append(k)
				if pathLengths[k] == -1:
					pathLengths[k] = distance
		searched.extend(newNodes)
	longestPath = max(longestPath, max(pathLengths))


print(longestPath)

