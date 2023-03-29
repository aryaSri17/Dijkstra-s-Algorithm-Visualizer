import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';

import './PathfindingVisualizer.css';

//defining maximum row and column size of grid
let row_max_length=20;
let col_max_length=40;

//defining the initial position od starting and ending node
let START_NODE_ROW=9;
let START_NODE_COL=8;
let FINISH_NODE_ROW=9;
let FINISH_NODE_COL=31;

export default class PathfindingVisualizer extends Component {
    constructor(props) {
      super(props);
      this.state = {
            grid: [],
            mouseIsPressed: false,
            topMessage: "Dijkstra Algorithm",
            weight: 1,
            changeWeight: false,
            distanceToBeTraveled: 0,
      };
    }

    // Creating grid
    componentDidMount() {
        const grid = getInitialGrid();
        this.setState({ grid });
    }
    
    //on pressing mouse down
    handleMouseDown(row,col){
        if(this.state.topMessage !== "Dijkstra Algorithm") return;
        let newGrid=[];
        if(this.state.changeWeight){
            newGrid=getNewGridWithWeightToggled(
                this.state.grid,
                row,
                col,
                this.state.weight
            );
        }
        else{
            newGrid=getNewGridWithWallToggled(this.state.grid,row,col);
        }
        this.setState({grid: newGrid,mouseIsPressed: true});
    }
    //on entering mouse
    handleMouseEnter(row,col){
        if(this.state.topMessage !== "Dijkstra Algorithm") return;
        if(!this.state.mouseIsPressed) return;
        let newGrid=[];
        if(this.state.changeWeight){
            newGrid=getNewGridWithWeightToggled(
                this.state.grid,
                row,
                col,
                this.state.weight
            );
        }
        else{
            newGrid=getNewGridWithWallToggled(this.state.grid,row,col);
        }
        this.setState({grid: newGrid,mouseIsPressed: true});
    }
    //when mouse is released
    handleMouseUp(){
        if(this.state.topMessage !== "Dijkstra Algorithm") return;
        this.setState({mouseIsPressed:false});
    }

    visulaizeDijkstra(){
        this.setState({topMessage:"Creator : Arya"});
        const {grid}=this.state;
        const startNode=grid[START_NODE_ROW][START_NODE_COL];
        const endNode=grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder=dijkstra(grid,startNode,endNode);
        const nodesInShortestPathOrder=getNodesInShortestPathOrder(endNode);
        this.animateDijkstra(visitedNodesInOrder,nodesInShortestPathOrder);
    }
    animateDijkstra(visitedNodesInOrder,nodesInShortestPathOrder){
        for(let i=1;i<=visitedNodesInOrder.length;i++){
            //when we reach last element in visitedNodesInOrder
            if(i===visitedNodesInOrder.length){
                setTimeout(() => {
                    this.setState({topMessage:"Shortest Path"});
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, 10*i);
                return;
            }
            if(i===visitedNodesInOrder.length-1) continue;
            setTimeout(() => {
                const node=visitedNodesInOrder[i];
                if(node.isWeight){
                    document.getElementById(`node-${node.row}-${node.col}`).className="node node-visitedWeight";
                }
                else{
                    document.getElementById(`node-${node.row}-${node.col}`).className="node node-visited";
                }
            }, 10*i);
        }
    }
    animateShortestPath(nodesInShortestPathOrder){
        let timeTaken=0;
        for(let i=1;i<nodesInShortestPathOrder.length-1;i++){
            setTimeout(() => {
                const node=nodesInShortestPathOrder[i];
                if(node.isWeight){
                    document.getElementById(`node-${node.row}-${node.col}`).className="node node-path-weight";
                }
                else{
                    document.getElementById(`node-${node.row}-${node.col}`).className="node node-path";
                }  
            }, 50*i);
        }
        timeTaken=nodesInShortestPathOrder[nodesInShortestPathOrder.length-1].distance;
        this.setState({distanceToBeTraveled: timeTaken});
    }
    //validating whether the entered start node and finish node ie on grid or not
    isNotValid=()=>{
        const node_start_row=parseInt(document.getElementById("start_row").value);
        const node_start_col=parseInt(document.getElementById("start_col").value);
        const end_start_row=parseInt(document.getElementById("end_row").value);
        const end_start_col=parseInt(document.getElementById("end_col").value);
        if(isNaN(node_start_row)||isNaN(node_start_col)||isNaN(end_start_row)||isNaN(end_start_col)) return true;
        if(node_start_row>row_max_length || node_start_col>col_max_length) return true;
        if(node_start_row<0 || node_start_col<0) return true;
        if(end_start_row>row_max_length || end_start_col>col_max_length) return true;
        if(end_start_row<0 || end_start_col<0) return true;
        return false;
    };
    weightChangeHandler=(event)=>{
        this.setState({weight:event.target.value});
    };
    toggleWeight=()=>{
        const temp=this.state.changeWeight;
        this.setState({changeWeight:!temp});
            if(this.state.changeWeight===true){
                document.getElementById("switch").style.backgroundColor="#48c9b0";
            }
            else{
                document.getElementById("switch").style.backgroundColor="#DF2E38";
            }
    };
    pointChangeHandler=()=>{
        //if entered row and col does not lie in grid then return
        if(this.isNotValid()) return;
        document.getElementById(`node-${START_NODE_ROW}-${START_NODE_COL}`).className="node";
        document.getElementById(`node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`).className="node";
        //intializing new start row and column
        START_NODE_ROW=parseInt(document.getElementById("start_row").value);
        START_NODE_COL=parseInt(document.getElementById("start_col").value);
        //intializing new end row and column
        FINISH_NODE_ROW=parseInt(document.getElementById("end_row").value);
        FINISH_NODE_COL=parseInt(document.getElementById("end_col").value);
        document.getElementById(`node-${START_NODE_ROW}-${START_NODE_COL}`).className="node node-start";
        document.getElementById(`node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`).className="node node-finish";
    };
    render(){
        const {
            grid,
            mouseIsPressed,
            topMessage,
            distanceToBeTraveled
        }=this.state;

        let button_task=(
            <p className='btn' onClick={()=>this.visulaizeDijkstra()}>
                Start Dijkstra Algorithm
            </p>
        );

        if(topMessage==="Shortest Path"){
            button_task=(
                <h2
                className='btn'
                href="#"
                onClick={()=>window.location.reload(false)}>
                    Reset <br />
                    Time: {distanceToBeTraveled} 
                    <small> [1 Block = 1 Time = 1 Weight]</small>
                </h2>
            );
        }
        else if(topMessage==="Creator : Arya"){
            button_task=<h3 className='running'>Running...</h3>
        }

        let textBox=(
            <div className='textBox'>

                <div className='weightContainer'>
                    <label htmlFor="quantity">Toggle or Set Weight</label>
                    <input 
                    type="number"
                    id="quantity"
                    name='quantity'
                    min="1"
                    max="5"
                    onChange={this.weightChangeHandler}
                    defaultValue="1"
                    />
                    <button id="switch" onClick={()=>this.toggleWeight()}>Switch</button>
                </div>

                <div className='startPointContainer'>
                    <label htmlFor="ponit">Start Point :</label>
                    <input 
                    type="number"
                    name='point'
                    id='start_row'
                    min="0"
                    max={row_max_length-1}
                    onChange={this.pointChangeHandler}
                    defaultValue="9" 
                    />
                    <input 
                    type="number"
                    name='point'
                    id='start_col'
                    min="0"
                    max={col_max_length-1}
                    onChange={this.pointChangeHandler}
                    defaultValue="8" 
                    />
                </div>

                <div className='endPointContainer'>
                    <label htmlFor="ponit">End Point :</label>
                    <input 
                    type="number"
                    name='point'
                    id='end_row'
                    min="0"
                    max={row_max_length-1}
                    onChange={this.pointChangeHandler}
                    defaultValue="9" 
                    />
                    <input 
                    type="number"
                    name='point'
                    id='end_col'
                    min="0"
                    max={col_max_length-1}
                    onChange={this.pointChangeHandler}
                    defaultValue="31" 
                    />
                </div>

                <div className='buttonContainer'>{button_task}</div>

            </div>
        );
        
        if(topMessage=="Creator : Arya"){
            textBox=(
                <div className='buttonContainer' style={{width:"30%",margin:"0 auto"}}>
                    {button_task}
                </div>
            );
        }
        else if(topMessage==="Shortest Path"){
            textBox=(
                <div className='buttonContainer' style={{width:"30%",margin:"0 auto"}}>
                    {button_task}
                </div>
            );
        }

        return (
            <div className="pathfindingVisualizer">
                <div className='container'>
                    <div className='heading'>
                        <h2>Search Visualizer</h2>
                        <h2>{topMessage}</h2>
                    </div>
                    {textBox} 
                    <p>
                     Dijkstra's algorithm is an algorithm for finding the shortest paths between nodes in a weighted graph.{" "}
                     <span className='ref'></span>
                    </p>
                </div>

                <div className='visualGridContainer'>
                    <div className='gridBox'>
                        <table className='grid' style={{borderSpacing:"0"}}>
                            <tbody>
                                {grid.map((row,rowIndex)=>{
                                    return(
                                        <tr key={rowIndex}>
                                            {row.map((node,nodeIndex)=>{
                                                const {isStart,isFinish,isWall,isWeight}=node;
                                                return(
                                                    <Node
                                                    row={rowIndex}
                                                    col={nodeIndex}
                                                    key={rowIndex+"-"+nodeIndex}
                                                    isStart={isStart}
                                                    isFinish={isFinish}
                                                    isWall={isWall}
                                                    isWeight={isWeight}
                                                    mouseIsPressed={mouseIsPressed}
                                                    onMouseDown={(row,col)=>this.handleMouseDown(row,col)}
                                                    onMouseEnter={(row,col)=>this.handleMouseEnter(row,col)}
                                                    onMouseUp={()=>this.handleMouseUp()}
                                                    ></Node>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}
const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < row_max_length; row++) {
      const currentRow = [];
      for (let col = 0; col < col_max_length; col++) {
        currentRow.push(createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  };
  
  const createNode = (col, row) => {
    return {
      col,
      row,
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      isWeight: false,
      previousNode: null,
      weight: 0,
    };
  };
  const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = [...grid];
    const node = newGrid[row][col];
    const newNode = {
      ...node, // copying other properties of the node
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };
  
  const getNewGridWithWeightToggled = (grid, row, col, weight) => {
    const newGrid = [...grid];
    const node = newGrid[row][col];
    const newNode = {
      ...node, // copying other properties of the node
      isWeight: !node.isWeight,
      weight: parseInt(weight),
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };
  