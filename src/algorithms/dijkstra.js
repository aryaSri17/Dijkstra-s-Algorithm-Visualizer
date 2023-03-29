//importing priority queue in order to calculate shortest distance between start node and end node
import PriorityQueue from "priorityqueuejs"
const dijkstra =(grid,startNode,endNode)=>{
    //an array to stroe all nodes that are visited
    const visitedNodesInOrder=[];
    //creating a priority queue to sort the nodes to be visited in ascendding order
    let nodesToVisit=new PriorityQueue((a,b)=>-(a.distance-b.distance));
    //marking startnode distance to be zero
    startNode.distance=0;
    //inserting start node in priority queue
    nodesToVisit.enq({row:startNode.row,col:startNode.col,distance:0});
    while(nodesToVisit.size()>0){
        const {row,col,distance}=nodesToVisit.deq();
        let currentNode=grid[row][col];
        // If the distance in the pq element is greater than the current distance skip it
        if (distance > grid[row][col].distance) continue;
        currentNode.isVisisted=true;
        visitedNodesInOrder.push(currentNode);
        //checking if we have reached the end node then return from here
        if(currentNode===endNode) return visitedNodesInOrder;
        const x=[1,-1,0,0];
        const y=[0,0,1,-1];
        //traversing in 4 possible direction from current node to all its neigbhiurs
        for(let i=0;i<4;i++){
            let neighbourRow=row+x[i];
            let neighbourCol=col+y[i];
            //validating if new row and column belongs to grid and not and whether they are already visited and also checking for if that grid at that point has wall or not
            if(neighbourRow>=0 && neighbourCol>=0 && neighbourRow<grid.length && neighbourCol<grid[0].length && !grid[neighbourRow][neighbourCol].isVisited && !grid[neighbourRow][neighbourCol].isWall){
                let neighbour=grid[neighbourRow][neighbourCol];
                //detecting wheather to include neighbour or not 
                if(currentNode.distance+neighbour.weight+1<neighbour.distance){
                    neighbour.distance=currentNode.distance+neighbour.weight+1;
                    //in order to remember the path from wher we reached this neigbhour node
                    //this will help in tracing the shortest route from start to end node
                    neighbour.previousNode=currentNode;
                    //inserting neighbour in priority queue
                    nodesToVisit.enq({row:neighbour.row,col:neighbour.col,distance:neighbour.distance});
                }
            }
        }
    }
    //we cannot reach end node , so return the visited nodes
    return visitedNodesInOrder;
};
//now in order to trace the shortest route ( if existes ) between start and end node
const getNodesInShortestPathOrder=(endNode)=>{
    const nodesInShortestPathOrder=[];
    let currentNode=endNode;
    while(currentNode!==null){
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode=currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
};
export {dijkstra,getNodesInShortestPathOrder};