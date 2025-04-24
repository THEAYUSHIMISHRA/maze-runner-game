// A* algorithm function to find the shortest path from start to goal
export function aStar(start, goal, walls, gridSize) {
    // openSet: Nodes to be evaluated (nodes to visit)
    const openSet = [start]; 
  
    // cameFrom: Tracks the best path (previous node)
    const cameFrom = {}; 
  
    // gScore: Stores the cost to reach each node
    const gScore = {}; 
  
    // fScore: Stores the estimated cost to goal (f = g + heuristic)
    const fScore = {}; 
  
    // Helper function to create a unique key from position (x, y)
    const key = (pos) => `${pos.x},${pos.y}`;
  
    // Initialize gScore and fScore for the starting position
    gScore[key(start)] = 0;
    fScore[key(start)] = heuristic(start, goal); // Estimate the cost to reach goal
  
    // Start the algorithm's main loop
    while (openSet.length > 0) {
      // Sort openSet based on fScore (lowest fScore comes first)
      openSet.sort((a, b) => fScore[key(a)] - fScore[key(b)]);
      
      // Get the node with the lowest fScore
      const current = openSet.shift();
  
      // If we have reached the goal, reconstruct and return the path
      if (current.x === goal.x && current.y === goal.y) {
        return reconstructPath(cameFrom, current); // Reconstruct the shortest path
      }
  
      // For each neighbor of the current node, calculate the cost
      for (const neighbor of getNeighbors(current, walls, gridSize)) {
        const tempG = gScore[key(current)] + 1; // Calculate gScore (cost to reach neighbor)
  
        // If this path to the neighbor is better, update the scores
        if (tempG < (gScore[key(neighbor)] || Infinity)) {
          cameFrom[key(neighbor)] = current; // Mark current as the best way to reach neighbor
          gScore[key(neighbor)] = tempG; // Update the gScore for neighbor
          fScore[key(neighbor)] = tempG + heuristic(neighbor, goal); // Update the fScore
  
          // If the neighbor is not in openSet, add it to openSet
          if (!openSet.find((p) => p.x === neighbor.x && p.y === neighbor.y)) {
            openSet.push(neighbor);
          }
        }
      }
    }
  
    // Return an empty array if no path is found
    return []; 
  }
  
  // Heuristic function to estimate the cost from the current node to the goal
  // Manhattan distance (sum of absolute differences in x and y coordinates)
  function heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y); // Simple heuristic for grid movement
  }
  
  // Get all possible neighbors of a given node (left, right, up, down) within the grid
  // Neighbors are valid if they are within grid bounds and not a wall
  function getNeighbors(pos, walls, gridSize) {
    const dirs = [
      { x: 0, y: -1 }, // Up
      { x: 1, y: 0 },  // Right
      { x: 0, y: 1 },  // Down
      { x: -1, y: 0 }  // Left
    ];
  
    // Filter neighbors that are within the grid and not a wall
    return dirs
      .map((d) => ({ x: pos.x + d.x, y: pos.y + d.y })) // Get all neighboring positions
      .filter(
        (p) =>
          p.x >= 0 && // Check if within grid bounds
          p.y >= 0 &&
          p.x < gridSize &&
          p.y < gridSize &&
          !walls.has(`${p.x},${p.y}`) // Check if it's not a wall
      );
  }
  
  // Reconstruct the shortest path from the goal to the start using the cameFrom object
  function reconstructPath(cameFrom, current) {
    const key = (pos) => `${pos.x},${pos.y}`;
    
    const path = [current]; // Start with the current (goal) node
    
    // Trace the path from goal to start
    while (cameFrom[key(current)]) {
      current = cameFrom[key(current)]; // Move backwards along the path
      path.push(current); // Add each node to the path
    }
    
    return path.reverse(); // Reverse the path to start from the start node
  }
  