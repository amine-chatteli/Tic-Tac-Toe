import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';   

const Square =(props)=> {

      return (
        <button
        className="square"
        onClick={props.onClick}
      >
        {props.value}
      </button>
      );
    
  }
  
  class Board extends React.Component {

    renderSquare(i) {
      return <Square value={this.props.squares[i]} onClick={()=>this.props.onClick(i)} />;
    }
  
    render() {
           return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
        }],
        xIsNext: true,
        stepNumber: 0,
       place:[0],
       // selected: 1
      };
    }

  
  handleClick(i) {
    //let coor =['(1,1)','(2,1)','(3,1)','(1,2)','(2,2)','(3,2)','(1,3)','(2,3)','(3,3)'] 
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current=history[history.length-1];
    const squares=current.squares.slice();
    if(calculateWinner(squares)||squares[i])return;
    squares[i]=this.state.xIsNext?'X':'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    // place:this.state.place.concat(coor[i]),
    // selected:history.length,
        place:this.state.place.concat(i)
       })
    
  }
  
  jumpTo(step) {

    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      //selected:step,
    });
  }
    render() {
      
      
      
      const history = this.state.history;
      const place =this.state.place
      const current = history[this.state.stepNumber];
      const winner=calculateWinner(current.squares);
      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move+ getCurrentSquarePosition(place[move])//+place[move-1] 
          :'Go to game start';
          let button;
            button =<button className={this.state.stepNumber===move?'selected':''} onClick={() => this.jumpTo(move)}>{desc}</button>
        
        return (
          <li key={move}>
            {button}
          </li>
        );
      });

      let status;
      if (winner){
        status='winner: '+winner;
      }else{
        status='Next Player'+(this.state.xIsNext?'X':'O');
      }
      return (
        <div className="game">
          <div className="game-board">
            <Board squares={current.squares} onClick={(i)=>this.handleClick(i)}/>
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  

  function calculateWinner(squares){
    const lines=[
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i=0;i<lines.length;i++){
      const [a,b,c]=lines[i]
      if(squares[a]&&squares[a]===squares[b]&&squares[b]===squares[c]){
          return squares[a];
      }
    }
      return null
  }
  function getCurrentSquarePosition(currentSquare) {
    const col = currentSquare % 3;
    const row = Math.floor(currentSquare / 3);
    return `(${col}, ${row})`
  }