/* Ideas for improvement
- Make it possible to hold down a key and move multiple times in the same direction
- Check for win is only checking if all the pac-dots are removed and not the total score (this removes power-pellet score hack for winning the game)
*/

document.addEventListener('DOMContentLoaded', function () {
	const grid = document.querySelector('.grid');
	const scoreDisplay = document.getElementById('score');
	const width = 28;
	let score = 0;

	// layout grid and what is in the squares
	// 0 - pac-dot
	// 1 - wall
	// 2 - ghost-lair
	// 3 - power-pellet
	// 4 - empty

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
      1,1,1,1,1,1,0,1,1,4,2,2,2,2,2,2,2,2,4,1,1,0,1,1,1,1,1,1,
      1,1,1,1,1,1,0,1,1,4,2,2,2,2,2,2,2,2,4,1,1,0,1,1,1,1,1,1,
      4,4,4,4,4,4,0,0,0,4,2,2,2,2,2,2,2,2,4,0,0,0,4,4,4,4,4,4,
      1,1,1,1,1,1,0,1,1,4,2,2,2,2,2,2,2,2,4,1,1,0,1,1,1,1,1,1,
      1,1,1,1,1,1,0,1,1,4,2,2,2,2,2,2,2,2,4,1,1,0,1,1,1,1,1,1,
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

	const squares = [];

	// grad the grid and render it
	function createBoard() {
		for (let i = 0; i < layout.length; i++) {
			const square = document.createElement('div');
			grid.appendChild(square);
			squares.push(square);

			// Add layout to the board
			if (layout[i] === 0) {
				squares[i].classList.add('pac-dot');
			} else if (layout[i] === 1) {
				squares[i].classList.add('wall');
			} else if (layout[i] === 2) {
				squares[i].classList.add('ghost-lair');
			} else if (layout[i] === 3) {
				squares[i].classList.add('power-pellet');
			}
		}
	}
	createBoard();

	// starting position for pacman
	let pacmanCurrentIndex = 490;

	// position pac-man at current index on the game board
	squares[pacmanCurrentIndex].classList.add('pac-man');

	function movePacman(event) {
		squares[pacmanCurrentIndex].classList.remove('pac-man');
		switch (event.keyCode) {
			case 37: // left key
				// first statement checks if a move left is at all possible, second statement checks for walls
				if (
					pacmanCurrentIndex % width !== 0 &&
					!squares[pacmanCurrentIndex - 1].classList.contains('wall') &&
					!squares[pacmanCurrentIndex - 1].classList.contains('ghost-lair')
				) {
					pacmanCurrentIndex -= 1;
				}
				// Checks if pacman is at the left exit
				if (pacmanCurrentIndex - 1 === 363) {
					pacmanCurrentIndex = 391;
				}
				break;
			case 38: // up key
				if (
					pacmanCurrentIndex - width >= 0 &&
					!squares[pacmanCurrentIndex - width].classList.contains('wall') &&
					!squares[pacmanCurrentIndex - width].classList.contains('ghost-lair')
				) {
					pacmanCurrentIndex -= width;
				}
				break;
			case 39: // right key
				if (
					pacmanCurrentIndex % width < width - 1 &&
					!squares[pacmanCurrentIndex + 1].classList.contains('wall') &&
					!squares[pacmanCurrentIndex + 1].classList.contains('ghost-lair')
				) {
					pacmanCurrentIndex += 1;
				}
				// Checks if pacman is at the right exit
				if (pacmanCurrentIndex + 1 === 392) {
					pacmanCurrentIndex = 364;
				}
				break;
			case 40: // down key
				if (
					pacmanCurrentIndex + width < width * width &&
					!squares[pacmanCurrentIndex + width].classList.contains('wall') &&
					!squares[pacmanCurrentIndex + width].classList.contains('ghost-lair')
				) {
					pacmanCurrentIndex += width;
				}
				break;
		}

		squares[pacmanCurrentIndex].classList.add('pac-man');

		pacDotEaten();
		powerPelletEaten();
		checkForGameOver();
		checkForWin();
	}

	document.addEventListener('keyup', movePacman);

	// Get the coordinates on the board for both pacman and ghost
	// THe coordinates are used to calculate the shortest route available
	function getCoordinates(index) {
		return [index % width, Math.floor(index / width)];
	}

	function pacDotEaten() {
		if (squares[pacmanCurrentIndex].classList.contains('pac-dot')) {
			score++;
			scoreDisplay.innerHTML = score;
			squares[pacmanCurrentIndex].classList.remove('pac-dot');
		}
	}

	// What happens when pac-man eat a power-pallet
	function powerPelletEaten() {
		if (squares[pacmanCurrentIndex].classList.contains('power-pellet')) {
			score += 10;
			ghosts.forEach((ghost) => (ghost.isScared = true));
			setTimeout(unscareGhosts, 10000);
			squares[pacmanCurrentIndex].classList.remove('power-pellet');
		}
	}

	// function to unscare the ghosts again
	function unscareGhosts() {
		ghosts.forEach((ghost) => (ghost.isScared = false));
	}

	// Create our ghosts
	class Ghost {
		constructor(className, startIndex, speed) {
			this.className = className;
			this.startIndex = startIndex;
			this.speed = speed;
			this.currentIndex = startIndex;
			this.timerId = NaN;
		}
	}

	ghosts = [new Ghost('blinky', 348, 100), new Ghost('pinky', 376, 400), new Ghost('inky', 351, 300), new Ghost('clyde', 379, 500)];

	//draw the ghosts onto the game grid
	ghosts.forEach(function (ghost) {
		squares[ghost.currentIndex].classList.add(ghost.className);
		squares[ghost.currentIndex].classList.add('ghost');
	});

	ghosts.forEach((ghost) => moveGhost(ghost));

	function moveGhost(ghost) {
		const directions = [-1, +1, width, -width];
		let direction = directions[Math.floor(Math.random() * directions.length)];

		ghost.timerId = setInterval(function () {
			console.log(direction);
			// if the next square your ghost is going to does not contain a wall and does not contain a ghost, you can go there
			if (!squares[ghost.currentIndex + direction].classList.contains('wall') && !squares[ghost.currentIndex + direction].classList.contains('ghost')) {
				// Yeppedidep, you can go here let's move the ghost
				// remove all ghost related class
				squares[ghost.currentIndex].classList.remove(ghost.className);
				squares[ghost.currentIndex].classList.remove('ghost', 'scared-ghost');

				// get coordinates for ghost
				const [ghostX, ghostY] = getCoordinates(ghost.currentIndex);
				const [pacManX, pacManY] = getCoordinates(pacmanCurrentIndex);
				const [ghostNextX, ghostNextY] = getCoordinates(ghost.currentIndex + direction);

				if (direction === 1) {
					console.log('moving right');
					if (ghostX < pacManX && ghostNextX > ghostX) {
						// move the ghost
						ghost.currentIndex += direction;
					}
				} else if (direction === -1) {
					console.log('moving left');
					if (ghostX > pacManX && ghostNextX < ghostX) {
						// yay - we can move the ghost
						ghost.currentIndex += direction;
					}
				} else if (direction === 28) {
					console.log('moving down');
					if (ghostY < pacManY && ghostNextY > ghostY) {
						// move the ghost
						ghost.currentIndex += direction;
					}
				} else if (direction === -28) {
					console.log('moving up');
					if (ghostY > pacManY && ghostNextY < ghostY) {
						// move the ghost
						ghost.currentIndex += direction;
					}
				}

				// redraw the ghost whether or not it could move
				squares[ghost.currentIndex].classList.add(ghost.className, 'ghost');
				// get a new direction for next round
				direction = directions[Math.floor(Math.random() * directions.length)];
			} else {
				// else find a new direction and start over this loop
				direction = directions[Math.floor(Math.random() * directions.length)];
			}

			if (ghost.isScared) {
				squares[ghost.currentIndex].classList.add('scared-ghost');
			}

			if (ghost.isScared && squares[ghost.currentIndex].classList.contains('pac-man')) {
				squares[ghost.currentIndex].classList.remove(ghost.className, 'ghost', 'scared-ghost');
				ghost.currentIndex = ghost.startIndex;
				score += 100;
				squares[ghost.currentIndex].classList.add(ghost.classname, 'ghost');
			}
			checkForGameOver();
		}, ghost.speed);
	}

	// check for game over
	function checkForGameOver() {
		if (squares[pacmanCurrentIndex].classList.contains('ghost') && !squares[pacmanCurrentIndex].classList.contains('scared-ghost')) {
			ghosts.forEach(function (ghost) {
				clearInterval(ghost.timerId);
			});
			document.removeEventListener('keyup', movePacman);
			setTimeout(function () {
				alert('Game over!');
			}, 500);
		}
	}

	function checkForWin() {
		if (score === 274) {
			ghosts.forEach(function (ghost) {
				clearInterval(ghost.timerId);
			});
			document.removeEventListener('keyup', movePacman);
			setTimeout(function () {
				alert('You won!');
			}, 500);
		}
	}
});
