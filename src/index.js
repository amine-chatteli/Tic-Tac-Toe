import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = (props) => {

if(props.highlight){
 return <button  className="square highlight" onClick={props.onClick} >
  {props.value}
</button>
}
  return (
    <button  className="square" onClick={props.onClick} >
      {props.value}
    </button>
  );

}

class Board extends React.Component {


  renderSquare(i) {
    let winSquare=this.props.winSquare
    if(winSquare&& winSquare.indexOf(i)!==-1){
      return <Square value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}     
          highlight={true}
          i={i}
        />;
    }
  
  return <Square value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)} 
          highlight={false}
          i={i}
        />;
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
      toggle:false
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        position:i
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  toggle(){
    this.setState({
      toggle:!this.state.toggle
    })
  }
  render() {
    let winSquare=null;
    const history = this.state.history;
    let current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    
    let moves = history.map((step, move) => {

      const desc = move ?
        'Go to move #' + move+position(step.position):
        'Go to game start';
      return (
        <li key={move} >
          <button onClick={() => this.jumpTo(move)} className={move===this.state.stepNumber?'bold':''}>{desc}</button>
        </li>
      );
    });
    if(this.state.toggle){
      moves.reverse()
    }
    let status;
    if (winner) {
      status = 'Winner: ' + winner[0];
     winSquare =winner[1]
    }
     else if(!winner&&this.state.stepNumber===9){
      status='this matchis draw'
    }
      else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }


    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winSquare={winSquare}
          />
        <button onClick={()=>this.toggle()}>Toggle</button>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol >{moves}</ol>
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

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    let arr=[]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      arr.push(squares[a],lines[i])
      
      return  arr
    }
  }
  return null;
}

function position(position){
  let col=position%3
  let row=Math.floor(position/3)
  return `(${col},${row})`
}