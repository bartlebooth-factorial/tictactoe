import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// class Square extends React.Component {
//   render() {
//     return (
//       <button
// 				className="square" 
// 				onClick={() => this.props.onClick()}
// 			>
// 				{this.props.value}
//       </button>
//     );
//   }
// }

/*
 * Function component (used for component with only render func, no private state)
 */
function Square(props) {
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
    return (
			<Square
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
			/>
		);
  }

  render() {
    // return (
    //   <div>
    //     <div className="board-row">
    //       {this.renderSquare(0)}
    //       {this.renderSquare(1)}
    //       {this.renderSquare(2)}
    //     </div>
    //     <div className="board-row">
    //       {this.renderSquare(3)}
    //       {this.renderSquare(4)}
    //       {this.renderSquare(5)}
    //     </div>
    //     <div className="board-row">
    //       {this.renderSquare(6)}
    //       {this.renderSquare(7)}
    //       {this.renderSquare(8)}
    //     </div>
    //   </div>
    // );
		let arr = [];
		for (let i = 0; i < 3; i++) {
			arr.push(i);
		}
		const squares = arr.map((elem) => {
			const row = arr.map((i) => {
				return this.renderSquare(elem * 3 + i);
			});
			return (
				<div className="board-row">
				{row}
				</div>
			);
		});
		return (
			<div>
			{squares}
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
				coords: Array(2).fill(0),
			}],
			stepNumber: 0,
			xIsNext: true,
		};
	}

	calculateWinner(squares) {
		const lines = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		]

		for (let i = 0; i < lines.length; i++) {
			const [a, b, c] = lines[i];
			if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
				return squares[a];
			}
		}
		return null;
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
		});
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		const coords = current.coords.slice();
		if (squares[i] || this.calculateWinner(squares)) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';

		coords[0] = (i % 3) + 1;
		coords[1] = Math.floor(i / 3) + 1;

		this.setState({
			history: history.concat([{
				squares: squares,
				coords: coords,
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		});
	}

  render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = this.calculateWinner(current.squares);

		const moves = history.map((step, move) => {
			let desc;
			if (move === 0) {
				desc = 'Go to game start (' + this.state.history[move].coords[0] + ', ' + this.state.history[move].coords[1] + ')';
			} else {
				desc = 'Go to move #' + move + ' (' + this.state.history[move].coords[0] + ', ' + this.state.history[move].coords[1] + ')';
			}

			/* Bold move button if it is the current move */
			if (move === this.state.stepNumber) {
				return (
					<li key={move}>
						<button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
					</li>
				);
			} else {
				return (
					<li key={move}>
						<button onClick={() => this.jumpTo(move)}>{desc}</button>
					</li>
				);
			}
		});

		let status;
		if (winner) {
			status = 'Winner: ' + winner;
		} else if (!current.squares.includes(null)) {
				status = 'Draw';
		} else {
				status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		}

    return (
      <div className="game">
        <div className="game-board">
          <Board
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
					/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol start="0">{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

