const grid = [];
let cellsHidden = [];
let firstClick = false;

const startPosX = 32;
const startPosY = 32;
const sqrX = 5;
const sqrY = 5;
const numOfMines = 4;
const clickStates = {
  REVEAL : "reveal",
  FLAG : "flag"
};
const gameStates = {
  PLAYING : "playing",
  WIN : "win",
  LOSE : "lose"
};

const clicks = [];
const flags = [];
const mines = [];
const mineChar = -1;
const mineClicked = -2;
let gameState = gameStates.PLAYING;
let currentClickState = clickStates.REVEAL;

function preload() {
  imgFlag = loadImage("images/flag.png");
  imgMine = loadImage("images/mine.png");
  imgMineRed = loadImage("images/mine_red.png");
  imgDigits = [null, loadImage("images/digit1.png"),
  loadImage("images/digit2.png"),
  loadImage("images/digit3.png"),
  loadImage("images/digit4.png"),
  loadImage("images/digit5.png"),
  loadImage("images/digit6.png"),
  loadImage("images/digit7.png"),
  loadImage("images/digit8.png")];
  imgCellHidden = loadImage("images/cell_hidden.png");
  imgCellRevealed = loadImage("images/cell_revealed.png");



}
function setup() {
  createCanvas(640, 1024);
  noStroke();
  for (let hi = 0; hi < sqrY; hi++) {
    let vector = [];
    for (let wi = 0; wi < sqrX; wi++) {
      vector.push(0);
      cellsHidden.push(hi * sqrY + wi);
    }
    grid.push(vector);
  }

  //[grid, cellsHidden] = generateMines(7, sqrY, sqrX);
  console.log(grid);

}

function draw() {

  if (gameState === gameStates.PLAYING) {
  drawGrid(startPosX, startPosY, sqrY, sqrX);
  drawButtons(startPosX + 500, startPosY + 200, 100, 25);
} else if (gameState === gameStates.WIN) {
  //drawGrid(startPosX, startPosY, sqrY, sqrX)
  fill(150,150,150);
  rect(startPosX + 500, startPosY + 200, 100, 25);
  fill(0,255,0);
  text("YOU WON!", startPosX + 500, startPosY + 212);
} else if (gameState === gameStates.LOSE) {
  drawGrid(startPosX, startPosY, sqrY, sqrX);
  fill(150,150,150);
  rect(startPosX + 500, startPosY + 200, 100, 25);
  fill(255,0,0);
  text("GAME OVER", startPosX + 500, startPosY + 212);
}

if (clicks.length === ((sqrY * sqrX) - numOfMines) && gameState === gameStates.PLAYING) {
  gameState = gameStates.WIN;
  console.log(clicks);
}
  //drawMines(32, 32, 32, 32, 480, 480);



}






function highlightSquare(x, y, a, b, w, h) {
  if (mouseX > x && mouseX < x+w && mouseY > y && mouseY < y+h) {
    //console.log("aaaah ", mouseX, mouseY);
    let snapX = Math.floor((mouseX-x) /(w/b));
    let snapY = Math.floor((mouseY-y)/(h/a));
    console.log(snapX, snapY);
    //drawSquare(x + snapX * (w/b), y + snapY * (h/a), color(0, 0, 255),  w/b, h/a);
    let u = snapX + (snapY * a);

    // from (i, j) -> k
    // k = i*b + j
    //    i = k//b
    //    j = k % a
    //console.log(u);
    if (mouseIsPressed && !firstClick) {
      firstClick = true;
      cellsHidden = generateMines(numOfMines, grid, a, b, u);
    }

    if (mouseIsPressed && currentClickState === clickStates.REVEAL && !(clicks.includes(u)) ) {
      clicks.push( u );
      if (flags.includes(u)) {
        flags.splice(flags.indexOf(u), 1);
      }
      if (cellsHidden.includes(u)) {
        cellsHidden.splice(cellsHidden.indexOf(u), 1);
      }
      if (grid[snapY][snapX] === 0) {
        drawAllContiguousEmptySquares(snapX, snapY, a, b);
      } else if (grid[snapY][snapX] === mineChar) {
        grid[snapY][snapX] = mineClicked;
        cellsHidden = [];
        gameState = gameStates.LOSE;
        while (clicks.length > 0) clicks.pop();
        for (let i = 0; i < a*b; i++) clicks.push(i);

      }
      //console.log(clicks);
    }

    else if (mouseIsPressed && currentClickState === clickStates.FLAG
      && !(clicks.includes(u)) && !(flags.includes(u))) {
        flags.push( u );
      }


  }
}

function clickedSquares(x, y, a, b, w, h) {
  for (let i = 0; i < clicks.length; i++) {
    let xx = ~~(clicks[i] % b);
    let yy = ~~(clicks[i] / a);
    //debugger;
    image(imgCellRevealed, x + xx * (w/b), y + yy * (h/a), w/b, h/a);
    if (grid[yy][xx] === mineChar) {
      // fill(255, 0, 0);
      // rect(x + xx * (w/b), y + yy * (h/a), w/b, h/a);
      image(imgMine, x + xx * (w/b), y + yy * (h/a), w/b, h/a);
    } else if (grid[yy][xx] === mineClicked) {
      image(imgMineRed, x + xx * (w/b), y + yy * (h/a), w/b, h/a);
      // fill(255,0,0);
      // rect(x + xx * (w/b), y + yy * (h/a), w/b, h/a);
      // image(imgMine, x + xx * (w/b), y + yy * (h/a), w/b, h/a);
    } else if (grid[yy][xx] > 0) {
      // fill(255, 0, 255);
      // text(grid[yy][xx], x + (xx + 1/2) * (w/b), y + (yy + 1) * (h/a));
      image(imgDigits[grid[yy][xx]], x + xx * (w/b), y + yy * (h/a), w/b, h/a);
    } else if (grid[yy][xx] === 0) {
      //drawSquare(x + xx * (w/b), y + yy * (h/a), color(60, 255, 0),  w/b, h/a);
    }
    //
  }
}

function drawSquare(x, y, c, w, h) {
  fill(c);
  rect(x, y, w, h)
}

function drawGrid(x, y, a=1, b=1, w=480, h=480) {
  if (mouseX > x && mouseX < x+w && mouseY > y && mouseY < y+h) {
    // fill(color(255, 255, 255));
    // rect(x, y, w, h);

    highlightSquare(x, y, a, b, w, h);

    // for (let i = 0; i <= a; i++) {
    //   line(x, y + i * (h / a), x+w, y + i * (h / a));
    // }
    // for (let i = 0; i <= b; i++) {
    //   line(x + i * (w / b), y, x + i * (w / b), y + h);
    // }
    clickedSquares(x, y, a, b, w, h);
    drawHiddenCells(x, y, a, b, w, h);
    drawFlags(x, y, a, b, w, h);
    //drawMines(x, y, a, b, w, h);
  }

}
// need to rewrite all of it for a 2D array

// function generateMines(nMines, a, b) {
//   let listOfMines = [];
//   let randomMap = [];
//   for (let i = 0; i < a*b; i++) {
//     listOfMines.push(0);
//     randomMap.push(i);
//   }
//   for (let i = 0; i < nMines; i++) {
//     let j = Math.floor(Math.random() * (randomMap.length + 1));
//     let _rj = randomMap[j];
//     listOfMines[_rj] = -1;
//     let _rjx = ~~(_rj % b);
//     let _rjy = ~~(_rj / a);
//     if (_rjy + 1 < a && listOfMines[_rj + 1] !== -1) {
//         listOfMines[_rj + 1] += 1;
//       }
//
//     randomMap.splice(j, 1);
//     //console.log(j);
//   }
//   return listOfMines;
//
// }
// // same shit asshole
// function drawMines(x, y, a, b, w, h) {
//   //console.log(grid.length);
//   for (let j = 0; j < grid.length; j++) {
//     if (grid[j] === -1) {
//       fill(color(255, 0, 0));
//       rect(x + ( ~~(j % b)) * (w/b), y + ( ~~(j / a)) * (h/a), w/b, h/a);
//     } else if (grid[j] !== 0) {
//       fill(color(128, 0, 0));
//       text(grid[j], x + ( ~~(j % b)) * (w/b), y + ( ~~(j / a)) * (h/a));
//     }
//
//   }
// }

function generateMines(nMines, listOfMines, a, b, exclusion) {
  //const listOfMines = [];
  const randomMap = [];
  const ch = []; //cells hidden
  const pattern = [-1, 0, 1, -1, 1, 0, -1, 1];

  for (let i = 0; i < a; i++) {
    let sub = [];
    for (let j = 0; j < b; j++) {
      sub.push(0);
      let u = i * a + j;
      if (u !== exclusion && exclusion % b !== 0 && u !== exclusion-1
    && (exclusion+1) % b !== 0 && u !== exclusion + 1
  && exclusion >= sqrX && u !== exclusion-sqrX && exclusion < sqrX * (sqrY - 2) && u !== exclusion + sqrX) randomMap.push(u);
      ch.push(i * a + j);
    }
    //listOfMines.push(sub);
  }
  for (let i = 0; i < nMines; i++) {
    let rIndex = Math.floor(Math.random() * (randomMap.length + 1));
    let j = randomMap[rIndex];
    console.log("MINE", j);
    let curX = j % b;
    let curY = ~~(j / a); // int cast is a double NOT
    listOfMines[curY][curX] = mineChar;
    //debugger;
    for (let i = 0; i < 8; i++) {
      let dx = curX + pattern[i];
      let dy = curY + pattern[(i + 2) % 8];
      //console.log("STATS", dy, dx);
      if (dy >= 0 && dy < a && dx >= 0 && dx < b && listOfMines[dy][dx] !== mineChar) {
           listOfMines[dy][dx] += 1;
           //console.log(dy, dx, listOfMines[dy][dx]);
         }
    }

    randomMap.splice(rIndex, 1);
  }
  console.log("done");
  for (let i = 0; i < a; i++) {
    console.log(listOfMines[i]);
  }
  return ch;
}

function drawMines(x, y, a, b, w, h) {
  for (let i = 0; i < a; i++) {
    for (let j = 0; j < b; j++) {
      console.log(i, j, "hmm");
      if (grid[i][j] === mineChar) {
        fill(255, 0, 0);
        rect(x + j * (w/b), y + i * (h/a), w/b, h/a);
      } else if (grid[i][j] > 0) {
        fill(255, 0, 255);
        text(grid[i][j], x + (j + 1/2) * (w/b), y + (i + 1) * (h/a));
      }
    }
  }
}

function drawAllContiguousEmptySquares(x, y, a, b) {
  const pattern = [-1, 0, 1, -1, 1, 0, -1, 1];
  const searched = [];
  const stack = [];
  stack.push(y * a + x);
  searched.push(y * a + x);
  while (stack.length > 0) {
    let currentSpot = stack.pop();
    let curX = currentSpot % b;
    let curY = ~~(currentSpot / a);
    for (let i = 0; i < 8; i++) {
      let dx = curX + pattern[i];
      let dy = curY + pattern[(i + 2) % 8];
      if (dy >= 0 && dy < a && dx >= 0 && dx < b && !(searched.includes(dy * a + dx))) {
        if (grid[dy][dx] === 0) {
          stack.push(dy * a + dx);
        } else {
          if (!(clicks.includes(dy * a + dx))) clicks.push(dy * a + dx);
          if (cellsHidden.includes(dy * a + dx)) cellsHidden.splice(cellsHidden.indexOf(dy * a + dx), 1);
        }

        searched.push(dy * a + dx);

        //clicks.push(dy * a + dx);
      }
    }
    //searched.push(currentSpot);
    if (flags.includes(currentSpot)) {
      flags.splice(flags.indexOf(currentSpot), 1);
    }
    if (cellsHidden.includes(currentSpot)) {
      cellsHidden.splice(cellsHidden.indexOf(currentSpot), 1);
    }
    if (!(clicks.includes(currentSpot))) clicks.push(currentSpot);
  }
}

// draw all buttons
function drawButtons(x, y, w, h, hMargin=0, vMargin=0) {
  flagButton(x, y, w, h);
  revealButton(x, y+100, w, h)
}

function flagButton(x, y, w, h) {
  // if button has already been clicked
  if (currentClickState === clickStates.FLAG ) {
    fill(64,64,64);
    rect(x, y, w, h);
  } else {
    fill(128,128,128);
    rect(x, y, w, h);
    fill(0,0,0);
    text("Flag", x+w/2,y+h/2);
  }
  if (mouseX > x && mouseX < x+w && mouseY > y && mouseY < y+h) {
    if (mouseIsPressed && currentClickState === clickStates.REVEAL) {
      currentClickState = clickStates.FLAG;
    }
  }
}

function revealButton(x, y, w, h) {
  if (currentClickState === clickStates.REVEAL ) {
    fill(64,64,64);
    rect(x, y, w, h);
  } else {
    fill(128,128,128);
    rect(x, y, w, h);
    fill(0,0,0);
    text("Reveal", x+w/2,y+h/2);
  }
  if (mouseX > x && mouseX < x+w && mouseY > y && mouseY < y+h) {
    if (mouseIsPressed && currentClickState === clickStates.FLAG) {
      currentClickState = clickStates.REVEAL;
    }
  }
}

function drawFlags(x, y, a, b, w, h) {
  for (let i = 0; i < flags.length; i++) {
    let xx = ~~(flags[i] % b);
    let yy = ~~(flags[i] / a);
    image(imgFlag, x + xx * (w/b), y + yy * (h/a), w/b, h/a);
  }
}

function drawHiddenCells(x, y, a, b, w, h) {
  for (let i = 0; i < cellsHidden.length; i++) {
    let xx = ~~(cellsHidden[i] % b);
    let yy = ~~(cellsHidden[i] / a);
    image(imgCellHidden, x + xx * (w/b), y + yy * (h/a), w/b, h/a);
  }
}
