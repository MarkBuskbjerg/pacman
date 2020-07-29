document.addEventListener('DOMContentLoaded', () => {
	const width = 28;
	const grid = document.querySelector('.grid');

	// prettier-ignore
	const layout = [
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,3,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,3,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,4,4,4,4,4,4,4,4,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,1,1,2,2,1,1,1,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
    4,4,4,4,4,4,0,0,0,4,1,2,2,2,2,2,2,1,4,0,0,0,4,4,4,4,4,4,
    1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
    1,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,3,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,3,1,
    1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
    1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
    1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1,
    1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
    1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
  ]
	// 0 - pac-dots
	// 1 - wall
	// 2 - ghost-lair
	// 3 - power-pellet
	// 4 - empty

	const squares = [];

	//create your board
	function createBoard() {
		for (let i = 0; i < layout.length; i++) {
			const square = document.createElement('div');
			grid.appendChild(square);
			squares.push(square);

			//add layout to the board
			if (layout[i] === 1) {
				squares[i].classList.add('wall');
			}
		}
	}
	createBoard();

	//draw pacman onto the board
	let pacmanCurrentIndex = 105;
	squares[pacmanCurrentIndex].classList.add('pac-man');

	//draw blinky on the board
	let blinkyCurrentIndex = 197;
	squares[blinkyCurrentIndex].classList.add('blinky');

	//get the coordinates of pacman or blinky on the grid with X and Y axis
	function getCoordinates(index) {
		return [index % width, Math.floor(index / width)];
	}

	//move blinky
	function moveBlinky() {
		const directions = [-1, +1, +width, -width];
		let ghostimerId = NaN;
		let direction = directions[Math.floor(Math.random() * directions.length)];

		ghostimerId = setInterval(function () {
			if (!squares[blinkyCurrentIndex + direction].classList.contains('wall')) {
				//remove the ghosts classes
				squares[blinkyCurrentIndex].classList.remove('blinky');
				//move into that space
				const [blinkyX, blinkyY] = getCoordinates(blinkyCurrentIndex);
				const [pacManX, pacManY] = getCoordinates(pacmanCurrentIndex);
				const [blinkyNextX, blinkyNextY] = getCoordinates(blinkyCurrentIndex + direction);
				console.log('new move');
				if (direction === 1) {
					console.log('moving right');
					if (blinkyX < pacManX && blinkyNextX > blinkyX) {
						// move the blinky
						blinkyCurrentIndex += direction;
						// repaint the blinky
						squares[blinkyCurrentIndex].classList.add('blinky');
					} else {
						// repaint the blinky and try again
						squares[blinkyCurrentIndex].classList.add('blinky');
						direction = directions[Math.floor(Math.random() * directions.length)];
					}
				} else if (direction === -1) {
					console.log('moving left');
					if (blinkyX > pacManX && blinkyNextX < blinkyX) {
						// move the blinky
						blinkyCurrentIndex += direction;
						// repaint the blinky
						squares[blinkyCurrentIndex].classList.add('blinky');
					} else {
						// repaint the blinky and try again
						squares[blinkyCurrentIndex].classList.add('blinky');
						direction = directions[Math.floor(Math.random() * directions.length)];
					}
				} else if (direction === 28) {
					console.log('moving down');
					if (blinkyY < pacManY && blinkyNextY > blinkyY) {
						// move the blinky
						blinkyCurrentIndex += direction;
						// repaint the blinky
						squares[blinkyCurrentIndex].classList.add('blinky');
						direction = directions[Math.floor(Math.random() * directions.length)];
					} else {
						// repaint the blinky and try again
						squares[blinkyCurrentIndex].classList.add('blinky');
						direction = directions[Math.floor(Math.random() * directions.length)];
					}
				} else if (direction === -28) {
					console.log('moving up');
					if (blinkyY > pacManY && blinkyNextY < blinkyY) {
						// move the blinky
						blinkyCurrentIndex += direction;
						// repaint the blinky
						squares[blinkyCurrentIndex].classList.add('blinky');
						direction = directions[Math.floor(Math.random() * directions.length)];
					}
				} else {
					direction = directions[Math.floor(Math.random() * directions.length)];
					squares[blinkyCurrentIndex].classList.add('blinky');
				}
			} else {
				console.log('hit a wall - try a new direction');
				direction = directions[Math.floor(Math.random() * directions.length)];
			}

			if (squares[blinkyCurrentIndex].classList.contains('pac-man')) clearInterval(ghostimerId);
		}, 300);
	}

	moveBlinky();
});
