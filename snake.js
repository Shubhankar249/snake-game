let canvas, pen, snake, W, H, gameOver, cellSize=50, foodX, foodY, occupiedCells, currScore=0,  foodImg, trophyImg;

function init() {
    canvas = document.getElementById('change');
    canvas.width=W=37*cellSize;
    canvas.height=H=18*cellSize;

    pen = canvas.getContext('2d');  // Context object used to draw on canvas

    snake={
        len:2,
        color:"black",
        cells:[],
        direction:"right",
        createSnake:function () {
            for (let i=0; i<this.len; i++)
                this.cells.push({x:i, y:0});
        }
    };

    foodImg=new Image();
    foodImg.src="assets/apple.png";

    trophyImg=new Image();
    trophyImg.src="assets/trophy.png";

    snake.createSnake();
    gameOver=false;
    getFood();

    window.addEventListener('keydown', (key)=> {
        if (key.code==="Space") clearInterval(game);
        else if ((key.code==="ArrowRight" || key.key==="d") && (snake.direction==="up" || snake.direction==="down"))    snake.direction="right";
        else if ((key.code==="ArrowDown" || key.key==="s") && (snake.direction==="left" || snake.direction==="right"))    snake.direction="down";
        else if ((key.code==="ArrowLeft" ||  key.key==="a") && (snake.direction==="up" || snake.direction==="down"))    snake.direction="left";
        else if ((key.code==="ArrowUp" || key.key==="w") && (snake.direction==="left" || snake.direction==="right"))    snake.direction="up";
    });
}

function draw() {
    pen.clearRect(0, 0, W, H);
    drawFood();

    pen.drawImage(trophyImg, 18, 20, cellSize, cellSize);
    pen.fillStyle="white";
    pen.font="20px Roboto";
    pen.fillText(String(currScore), 37, 46);

    pen.fillStyle=snake.color;
    for (let i=0; i<snake.len-1; i++)
        pen.fillRect(snake.cells[i].x*cellSize, snake.cells[i].y*cellSize, cellSize, cellSize);

    pen.fillStyle="blue";
    pen.fillRect(snake.cells[snake.len-1].x*cellSize, snake.cells[snake.len-1].y*cellSize, cellSize, cellSize);
}

function update(direction) {
    if (snake.cells[snake.len-1].x===foodX && snake.cells[snake.len-1].y===foodY) {
        getFood();
        currScore++;
        snake.len++;
    }
    else snake.cells.shift();

    switch (direction) {
        case "right":
            snake.cells.push({x:snake.cells[snake.len-2].x+1, y:snake.cells[snake.len-2].y});
            break;

        case "left":
            snake.cells.push({x:snake.cells[snake.len-2].x-1, y:snake.cells[snake.len-2].y});
            break;

        case "down":
            snake.cells.push({x:snake.cells[snake.len-2].x, y:snake.cells[snake.len-2].y+1});
            break;

        case "up":
            snake.cells.push({x:snake.cells[snake.len-2].x, y:snake.cells[snake.len-2].y-1});
            break;
    }
}

function shouldStop() {
    if (snake.cells[snake.len - 1].x < 0 || snake.cells[snake.len - 1].y < 0 || snake.cells[snake.len - 1].x*cellSize > W-cellSize || snake.cells[snake.len - 1].y*cellSize-cellSize >= H-cellSize

    ) return true;
}

function getFood() {
    foodX=Math.floor(Math.random()*(W-cellSize)/cellSize);
    foodY=Math.floor(Math.random()*(H-cellSize)/cellSize);
}

function drawFood() {
    pen.fillStyle="red";
    pen.drawImage(foodImg, foodX*cellSize, foodY*cellSize, cellSize, cellSize);
}

function gameLoop() {
    draw();
    update(snake.direction);

    if (shouldStop()) {
        clearInterval(game);
        alert("YOU LOSE!!");
    }
}

init();

let game=setInterval(gameLoop, 130); // To call gameLoop function every 100ms use setInterval function
