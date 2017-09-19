const ENTITIES = {
	VOID: 	0,
	PACMAN: 1,
	WALL: 	2,
	FOOD: 	3,
	GHOST: 	4,
}

const CONTROLS = {
	ARROW_UP: 38,
	ARROW_DOWN: 40,
	ARROW_LEFT: 37,
	ARROW_RIGHT: 39,
}

const POINTS_PER_FOOD = 10;
const GHOST_DAMAGE = 10;

const mapElement = document.getElementById('map');
const msgElement = document.getElementById('msg');
const scoreElement = document.getElementById('score');

const player = {
	posX: 1,
	posY: 7,
	hitpoints: 10,
	score: 0,
}

let gameOver = false;

const map = [
	[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	[2, 0, 0, 2, 0, 0, 0, 2, 0, 0, 2],
	[2, 0, 0, 2, 0, 0, 0, 2, 0, 0, 2],
	[2, 0, 0, 2, 0, 3, 0, 2, 0, 0, 2],
	[2, 0, 0, 2, 0, 3, 0, 2, 0, 0, 2],
	[2, 0, 0, 2, 0, 3, 0, 2, 0, 0, 2],
	[2, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2],
	[2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2],
	[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
	[2, 0, 0, 0, 0, 0, 2, 2, 0, 0, 2],
	[2, 0, 0, 0, 0, 0, 2, 2, 0, 0, 2],
	[2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2],
	[2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2],
	[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
];

var mapEngine = (function() {

	buildBlock = function(entity) {
		return '<div class="' + entity + ' entity"></div>';
	};

	addToMap = function(element) {
		mapElement.innerHTML += element;
	};

	resetMapLine = function() {
		mapElement.innerHTML += '<br>';
	};

	clearMap = function() {
		mapElement.innerHTML = '';
	};

	return {
		render: function() {
			clearMap();
			for (let y = 0; y < map.length; y++) {
				for (let x = 0; x < map[y].length; x++) {
					const tile = utils.getTile(map[y][x]);
					const block = buildBlock(tile);
					addToMap(block);
				}
				resetMapLine();
			}
		}
	};
}());

var movingEntity = (function() {

	triggerUpMovement = function(e) {
		return e.keyCode === CONTROLS.ARROW_UP;
	};
	triggerDownMovement = function(e) {
		return e.keyCode === CONTROLS.ARROW_DOWN;
	};
	triggerLeftMovement = function(e) {
		return e.keyCode === CONTROLS.ARROW_LEFT;
	};
	triggerRightMovement = function(e) {
		return e.keyCode === CONTROLS.ARROW_RIGHT;
	};

	hitAWall = function(pos) {
		return map[pos.y][pos.x] === ENTITIES.WALL;
	};
	hitAGhost = function(pos) {
		return map[pos.y][pos.x] === ENTITIES.GHOST;
	};
	hitAFood = function(pos) {
		return map[pos.y][pos.x] === ENTITIES.FOOD;
	};

	canMove = function(pos) {
		return !willCollide(pos);
	}

	willCollide = function(pos) {
		if (hitAFood(pos)) {
			player.score += POINTS_PER_FOOD;
			UIManager.updateScore();
			UIManager.updateMessage('You ate food!');
		}

		const wallHit = hitAWall(pos);
		if (wallHit) {
			UIManager.updateMessage('You hit a wall!');
		}

		const ghostHit = hitAGhost(pos);
		if (ghostHit) {
			player.hitpoints -= GHOST_DAMAGE;
			UIManager.updateMessage('You hit a ghost!');
			gameOver = checkGameOver();
			if (gameOver) {
				//endGame();
			}
		}
		return wallHit || ghostHit;
	};

	moveUp = function() {
		const newPos = { y: player.posY - 1, x: player.posX };
		if (canMove(newPos)) {
			map[player.posY][player.posX] = ENTITIES.VOID;
			player.posY = player.posY - 1;
			map[player.posY][player.posX] = ENTITIES.PACMAN;
		}
	};

	moveDown = function() {
		const newPos = { y: player.posY + 1, x: player.posX };
		if (canMove(newPos)) {
			map[player.posY][player.posX] = ENTITIES.VOID;
			player.posY = player.posY + 1;
			map[player.posY][player.posX] = ENTITIES.PACMAN;
		}
	};

	moveLeft = function() {
		const newPos = { y: player.posY, x: player.posX - 1 };
		if (canMove(newPos)) {
			map[player.posY][player.posX] = ENTITIES.VOID;
			player.posX = player.posX - 1;
			map[player.posY][player.posX] = ENTITIES.PACMAN;
		}
	};

	moveRight = function() {
		const newPos = { y: player.posY, x: player.posX + 1 };
		if (canMove(newPos)) {
			map[player.posY][player.posX] = ENTITIES.VOID;
			player.posX = player.posX + 1;
			map[player.posY][player.posX] = ENTITIES.PACMAN;
		}
	};

	document.onkeyup = function(e) {
		if (triggerUpMovement(e)) {
			moveUp();
		} else if (triggerDownMovement(e)) {
			moveDown();
		} else if (triggerLeftMovement(e)) {
			moveLeft();
		} else if (triggerRightMovement(e)) {
			moveRight();
		}
		mapEngine.render();
	}
}());

const UIManager = {
	updateScore: function(points) {
		scoreElement.innerHTML = 'Score: ' + player.score;
	},

	updateHitpoints: function() {
	},

	updateMessage: function(msg) {
		msgElement.innerHTML = 'Status: ' + msg;
	},
}

const utils = {
	getTile: function(tile) {
		switch (tile) {
			case ENTITIES.VOID:
				return 'void';
			case ENTITIES.WALL:
				return 'wall';
			case ENTITIES.PACMAN:
				return 'pacman';
			case ENTITIES.FOOD:
				return 'food';
			case ENTITIES.GHOST:
				return 'ghost';
		}
	},

	checkGameOver: function() {
		return player.hitpoints <= 0;
	}
}


mapEngine.render();