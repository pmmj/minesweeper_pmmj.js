let grid;

const startPosX = 32;
const startPosY = 32;
const sqrX = 10;
const sqrY = 10;
const clickStates = {
  REVEAL : "reveal",
  FLAG : "flag"
};
let currentClickState = clickStates.REVEAL;

function preload() {
  imgFlag = loadImage("images/flag.png");
  imgMine = loadImage("images/mine.png");
  imgDigits = [null, loadImage("images/digit1.png"),
  loadImage("images/digit2.png"),
  loadImage("images/digit3.png"),
  loadImage("images/digit4.png"),
  loadImage("images/digit5.png"),
  loadImage("images/digit6.png"),
  loadImage("images/digit7.png"),
  loadImage("images/digit8.png")];


}

function setup() {
  createCanvas(640, 1024);
  grid = generateMines(10, sqrY, sqrX);
  console.log(grid);

}

function draw() {
  drawGrid(startPosX, startPosY, sqrY, sqrX);
  drawButtons(startPosX + 500, startPosY + 200, 100, 25);
  //drawMines(32, 32, 32, 32, 480, 480);


}

const clicks = [];
const flags = [];
const mines = [];
const cellsHidden = [];
const mineChar = -1;




function highlightSquare(x, y, a, b, w, h) {
  if (mouseX > x && mouseX < x+w && mouseY > y && mouseY < y+h) {
    //console.log("aaaah ", mouseX, mouseY);
    let snapX = Math.floor((mouseX-x) /(w/b));
    let snapY = Math.floor((mouseY-y)/(h/a));
    console.log(snapX, snapY);
    drawSquare(x + snapX * (w/b), y + snapY * (h/a), color(0, 0, 255),  w/b, h/a);
    let u = snapX + (snapY * a);

    // from (i, j) -> k
    // k = i*b + j
    //    i = k//b
    //    j = k % a
    //console.log(u);
    if (mouseIsPressed && currentClickState === clickStates.REVEAL && !(clicks.includes(u)) ) {
      clicks.push( u );
      if (flags.includes(u)) {
        flags.splice(flags.indexOf(u), 1);
      }
      if (grid[snapY][snapX] === 0) {
        drawAllContiguousEmptySquares(snapX, snapY, a, b);
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

    if (grid[yy][xx] === mineChar) {
      // fill(255, 0, 0);
      // rect(x + xx * (w/b), y + yy * (h/a), w/b, h/a);
      image(imgMine, x + xx * (w/b), y + yy * (h/a), w/b, h/a);
    } else if (grid[yy][xx] > 0) {
      // fill(255, 0, 255);
      // text(grid[yy][xx], x + (xx + 1/2) * (w/b), y + (yy + 1) * (h/a));
      image(imgDigits[grid[yy][xx]], x + xx * (w/b), y + yy * (h/a), w/b, h/a);
    } else if (grid[yy][xx] === 0) {
      drawSquare(x + xx * (w/b), y + yy * (h/a), color(60, 255, 0),  w/b, h/a);
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
    fill(color(255, 255, 255));
    rect(x, y, w, h);

    highlightSquare(x, y, a, b, w, h);

    for (let i = 0; i <= a; i++) {
      line(x, y + i * (h / a), x+w, y + i * (h / a));
    }
    for (let i = 0; i <= b; i++) {
      line(x + i * (w / b), y, x + i * (w / b), y + h);
    }
    clickedSquares(x, y, a, b, w, h);
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

function generateMines(nMines, a, b) {
  const listOfMines = [];
  const randomMap = [];
  const pattern = [-1, 0, 1, -1, 1, 0, -1, 1];

  for (let i = 0; i < a; i++) {
    let sub = [];
    for (let j = 0; j < b; j++) {
      sub.push(0);
      randomMap.push(i * a + j);
    }
    listOfMines.push(sub);
  }
  for (let i = 0; i < nMines; i++) {
    let rIndex = Math.floor(Math.random() * (randomMap.length + 1));
    let j = randomMap[rIndex];
    let curX = j % b;
    let curY = ~~(j / a); // int cast is a double NOT
    listOfMines[curY][curX] = mineChar;
    //debugger;
    for (let i = 0; i < 8; i++) {
      let dx = curX + pattern[i];
      let dy = curY + pattern[(i + 2) % 8];
      console.log("STATS", dy, dx);
      if (dy >= 0 && dy < a && dx >= 0 && dx < b && listOfMines[dy][dx] !== mineChar) {
           listOfMines[dy][dx] += 1;
           console.log(dy, dx, listOfMines[dy][dx]);
         }
    }

    randomMap.splice(rIndex, 1);
  }
  console.log("done");
  for (let i = 0; i < a; i++) {
    console.log(listOfMines[i]);
  }
  return listOfMines;
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
          clicks.push(dy * a + dx);
        }

        searched.push(dy * a + dx);
        //clicks.push(dy * a + dx);
      }
    }
    //searched.push(currentSpot);
    if (flags.includes(currentSpot)) {
      flags.splice(flags.indexOf(currentSpot), 1);
    }
    clicks.push(currentSpot);
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
