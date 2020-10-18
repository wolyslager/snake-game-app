const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');
let snakeBlocks = [];
let snakeHead;
let appleX;
let appleY;
let appleWidth = 2;
let appleHeight = 2;
let score = -1;

class SnakeBlock {
	constructor(xPosition, xSpeed, yPosition, ySpeed){
		this.xPosition = xPosition;
		this.xSpeed = xSpeed;
		this.yPosition = yPosition;
		this.ySpeed = ySpeed;
		this.snakeWidth = 5;
		this.snakeHeight = 5;
		this.turnPoint = null;
	}
}

window.onload = function() {
	//call random apple generator function to initialize 
	snakeGrower();
    snakeHead = snakeBlocks[0];
    appleGenerator();
	setInterval(drawEverything, 1);
}

const snakeGrower = () => {
	if(snakeBlocks.length == 0){
		snakeBlock = new SnakeBlock(10, .5 , 10, 0);
		snakeBlocks.push(snakeBlock);
	} else {
		snakeTail = snakeBlocks[snakeBlocks.length - 1];
		snakeBlockAdder();
		snakeBlocks.push(snakeBlock);
	}
}

const snakeBlockAdder = () => {
	//finds direction of snake's tail to add new block in the correct place
	let snakeTailVertical = snakeTail.xSpeed == 0 ? true : false;
	if(snakeTailVertical){
		let snakeGoingDown = snakeTail.ySpeed > 0 ? true : false;
		if(snakeGoingDown){
			snakeBlock = new SnakeBlock(snakeTail.xPosition, snakeTail.xSpeed, snakeTail.yPosition - 3,  snakeTail.ySpeed);
		} else {
			snakeBlock = new SnakeBlock(snakeTail.xPosition, snakeTail.xSpeed, snakeTail.yPosition + 2, snakeTail.ySpeed);
		}
	} else {
		let snakeGoingRight = snakeTail.xSpeed > 0 ? true : false;
		if(snakeGoingRight){
			snakeBlock = new SnakeBlock(snakeTail.xPosition - 2, snakeTail.xSpeed, snakeTail.yPosition , snakeTail.ySpeed);
		} else {
			snakeBlock = new SnakeBlock(snakeTail.xPosition + 2, snakeTail.xSpeed, snakeTail.yPosition, snakeTail.ySpeed);
		}	
	}
}

const checkTurnPoints = (block) => {
	let currentBlockIndex = snakeBlocks.indexOf(block);
	let blockAhead = snakeBlocks[currentBlockIndex-1];
	if(block.xPosition == blockAhead.turnPoint || block.yPosition == blockAhead.turnPoint){
		//change the direction
		block.xSpeed = blockAhead.xSpeed;
		block.ySpeed = blockAhead.ySpeed;
		//ensure the block accelerates
		block.xPosition = block.xPosition + block.xSpeed;
		block.yPosition = block.yPosition + block.ySpeed;
		//set turnpoint for following block to reference
		block.turnPoint = blockAhead.turnPoint;
		//erase turnpoint for block ahead
		blockAhead.turnPoint = null;
	} else {
		block.xPosition = block.xPosition + block.xSpeed;
		block.yPosition = block.yPosition + block.ySpeed;
	}

	canvasContext.fillStyle = 'green';
	canvasContext.fillRect(block.xPosition, block.yPosition, block.snakeWidth, block.snakeHeight);
}

const checkForCollision = () => {
	//snake intersection
	let leadBlock = snakeBlocks[0];
	snakeBlocks.forEach((block, index) => {
		if(index!=0){
			if(Math.round(block.xPosition) == Math.round(leadBlock.xPosition) && Math.round(block.yPosition) == Math.round(leadBlock.yPosition)){
				alert('Game Over! Try Again');
				clearInterval();
				location.reload();

			}
		}
	});

	//wall intersection
	if(leadBlock.xPosition == -1 || leadBlock.xPosition == canvas.width -5 || leadBlock.yPosition == -1 || leadBlock.yPosition == canvas.height -5){
		alert('Game over! Try again');
		clearInterval();
		location.reload();
	} 
}

const snakeHeadDirection = (block) => {
	//loop through all of the blocks and check to see that none of them intersect with the head
	block.xPosition = block.xPosition + block.xSpeed;
	block.yPosition = block.yPosition + block.ySpeed;
	canvasContext.fillStyle = 'green';
	canvasContext.fillRect(block.xPosition, block.yPosition, block.snakeWidth, block.snakeHeight);
}

const drawEverything = () => {
	//draw canvas
	canvasContext.fillStyle = 'black';
	canvasContext.fillRect(0,0, canvas.width, canvas.height);
	//draw apple
	canvasContext.fillStyle = 'red';
	canvasContext.fillRect(appleX ,appleY ,appleWidth ,appleHeight);
	snakeBlocks.forEach((block, index) => {
		if(index == 0){
			checkForCollision();
			checkForAppleContact();
			//checkForAppleContact()
			snakeHeadDirection(block);
		} else {
			checkTurnPoints(block);
		}	
	})
}

//Event listener to control arrow keydown events 
document.addEventListener('keydown', function(e){
  switch(e.keyCode){
  	case 40:
  		if(snakeHead.ySpeed == 0){
  			snakeHead.ySpeed = .5;
  			snakeHead.xSpeed = 0;
  			snakeHead.turnPoint = snakeHead.xPosition;
  		}
  		break;
  	case 38:
  		if(snakeHead.ySpeed == 0){
  			snakeHead.ySpeed = -.5;
  			snakeHead.xSpeed = 0;
  			snakeHead.turnPoint = snakeHead.xPosition;
  		}
  		break;
  	case 37:
  		if(snakeHead.xSpeed == 0){
  			snakeHead.xSpeed = -.5;
  			snakeHead.ySpeed = 0;
  			snakeHead.turnPoint = snakeHead.yPosition;
  		}
  		break;
  	case 39:
  		if(snakeHead.xSpeed == 0){
  			snakeHead.xSpeed = .5;
  			snakeHead.ySpeed = 0;
  			snakeHead.turnPoint = snakeHead.yPosition;
  		}
  		break;
  }
})

const xGenerator = (max, min, snakeXPositions) => {
	//check that x coordinate generated is not occupied by a snakeblock
	let xCoordinate = Math.floor(Math.random() * (max - min + 1) + min);
	return (snakeXPositions.includes(xCoordinate)) ? xGenerator(max, min) : xCoordinate;
}

const yGenerator = (max, min, snakeYPositions) => {
	//check that y coordinate generated is not occupied by a snakeblock
	let yCoordinate = Math.floor(Math.random() * (max - min + 1) + min);
	return (snakeYPositions.includes(yCoordinate)) ? yGenerator(max, min) : yCoordinate;	
}

const checkForAppleContact = () => {
	//check that snakeHead has not collided with apple
	if((appleX >= snakeHead.xPosition - 3 && appleX <= (snakeHead.xPosition + 3)) && (appleY >= snakeHead.yPosition - 3 && appleY <= (snakeHead.yPosition + 3))){
		snakeGrower();
		appleGenerator();
	}
}

const appleGenerator = () => {
	score+=1;
	let scoreText = document.querySelector('.score');
	scoreText.innerText = "Score : " + score;
	let snakeXPositions = [];
	let snakeYPositions = [];
	let maxX = canvas.width - 5;
	let minX = 0;
	let maxY = canvas.height -5;
	let minY = 0;
	snakeBlocks.forEach((block) => {
		snakeXPositions.push(block.xPosition);
		snakeYPositions.push(block.yPosition);
	})

	 appleX = xGenerator(maxX, minX, snakeXPositions);
	 appleY = yGenerator(maxY, minY, snakeYPositions);

}
