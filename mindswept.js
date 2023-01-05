// [ openTab(event, id) ] FUNCTION FOR BUTTONS
let previousLink, previousContent;
function openTab(clicked, tabName) {
  if (previousContent != undefined && previousLink != undefined) {
    previousLink.classList.remove("active");
    previousContent.style.display = "none";
  }
  previousContent = document.getElementById(tabName);
  previousLink = clicked.currentTarget;

  previousContent.style.display = "flex";
  previousLink.classList.add("active");
}

// [ switchTheme(event, theme) ] FUNCTION FOR SWITCHING BOARD THEMES USING VARIABLES IN :root
let previousTheme,
  root = document.querySelector(":root");
document.getElementById("ONE").click();
function switchTheme(clicked, theme) {
  if (previousTheme != undefined) {
    previousTheme.classList.remove("active");
  }
  switch (theme) {
    case "1":
      root.style.setProperty("--box-background", "#303030");
      root.style.setProperty("--box-border", "var(--light-magenta");
      root.style.setProperty("--box-color", "#ffffff");
      break;
    case "2":
      root.style.setProperty("--box-background", "#303030");
      root.style.setProperty("--box-border", "#ffcc00");
      root.style.setProperty("--box-color", "#ffcc00");
      break;
    case "3":
      root.style.setProperty("--box-background", "#101f1f");
      root.style.setProperty("--box-border", "#008000");
      root.style.setProperty("--box-color", "#33ff00");
      break;
    case "4":
      root.style.setProperty("--box-background", "#4d2e00");
      root.style.setProperty("--box-border", "#e69d00");
      root.style.setProperty("--box-color", "#ffcc00");
      break;
    case "5":
      root.style.setProperty("--box-background", "#404040");
      root.style.setProperty("--box-border", "#a0a0a0");
      root.style.setProperty("--box-color", "#ffffff");
  }
  previousTheme = clicked.currentTarget;
  previousTheme.classList.add("active");
}

/*-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-*/
/* <<< WHERE THE FUN BEGINS >>> */
let tile = [],
  x,
  ix,
  currentX,
  y,
  iy,
  currentY,
  i,
  displayTiles = document.getElementsByClassName("box"),
  sector = document.getElementsByClassName("SECTOR"),
  responses = document.getElementsByClassName("RESPONSES"),
  curtainNav = document.getElementById("NAV_CURTAIN"),
  curtain = document.getElementById("CURTAINS"),
  statBox = document.getElementById("STATS");
for (y = 0; y < 15; y++) {
  tile[y] = [];
  for (x = 0; x < 15; x++) {
    tile[y][x] = { number: 0, mine: false, visible: false, selected: false };
  }
} // making a 2D array in JS is far more complicated than in C sheesh

// [ sectorGen() ] FUNCTION FOR GENERATING SECTOR ID
function sectorGen() {
  let i,
    s = "";
  for (i = 0; i < 5; i++) {
    s += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
  }
  sector[0].innerText = "[°•._" + s + "_.•°]";
  sector[1].innerText = "[ " + s + " ]";
  sector[2].innerText = "[°•._" + s + "_.•°]";
}

// [ resetTiles() ] FUNCTION FOR RESETTING ALL TILE'S DATA
function resetTiles() {
  for (y = 0; y < 15; y++) {
    for (x = 0; x < 15; x++) {
      tile[y][x].number = 0;
      tile[y][x].mine = false;
      tile[y][x].visible = false;
      tile[y][x].selected = false;
      displayTiles[y * 15 + x].style.backgroundColor = "var(--box-background)";
      displayTiles[y * 15 + x].style.borderColor = "var(--box-border)";
    }
  }
}

// [ generateMines() ] FUNCTION FOR GENERATING MINE COORDINATES WITH RNG
function generateMines() {
  let genX, genY, random;
  resetTiles();
  random = Math.floor(Math.random() * 10) + 45;
  for (i = 0; i < random; i++) {
    while (true) {
      genX = Math.floor(Math.random() * 15);
      genY = Math.floor(Math.random() * 15);
      if (!tile[genY][genX].mine) {
        tile[genY][genX].mine = true;
        break;
      }
    }
  }
}

// [ computeTiles() ] FUNCTION FOR COMPUTING THE NUMBER DATA ON EACH TILE
function computeTiles() {
  let minesInside;
  for (y = 0; y < 15; y++) {
    for (x = 0; x < 15; x++) {
      minesInside = 0;
      for (iy = -1; iy < 2; iy++) {
        currentY = y + iy;
        if (currentY < 0 || currentY > 14) {
          continue;
        }
        for (ix = -1; ix < 2; ix++) {
          currentX = x + ix;
          if (currentX < 0 || currentX > 14) {
            continue;
          }
          if (tile[currentY][currentX].mine) {
            minesInside++;
          }
        }
      }
      tile[y][x].number = minesInside;
    }
  }
}

// [ revealZeros() ] FUNCTION FOR REVEALING NEIGHBORING NON-MINE TILES AROUND TILES WITH 0
function revealZeros() {
  for (i = 0; i < 15; i++) {
    for (y = 0; y < 15; y++) {
      for (x = 0; x < 15; x++) {
        if (tile[y][x].selected) {
          for (iy = -1; iy < 2; iy++) {
            currentY = y + iy;
            if (currentY < 0 || currentY > 14) {
              continue;
            }
            for (ix = -1; ix < 2; ix++) {
              currentX = x + ix;
              if (currentX < 0 || currentX > 14) {
                continue;
              }
              tile[currentY][currentX].visible = true;
              if (tile[currentY][currentX].number == 0) {
                tile[currentY][currentX].selected = true;
              }
            }
          }
        }
      }
    }
  }
}

// [ resetSelected() ] FUNCTION TO RESET THE SELECTED TILES
function resetSelected() {
  for (y = 0; y < 15; y++) {
    for (x = 0; x < 15; x++) {
      tile[y][x].selected = false;
    }
  }
}

// [ displayMinefield() ] FUNCTION FOR DISPLAYING TILES IN MINEFIELD
function displayMinefield() {
  for (y = 0; y < 15; y++) {
    for (x = 0; x < 15; x++) {
      i = y * 15 + x;
      if (!tile[y][x].visible) {
        displayTiles[i].innerText = " ";
      } else {
        displayTiles[i].innerText = tile[y][x].number;
      }
    }
  }
}

// [ countMines() ] FUNCTION FOR COUNTING TOTAL MINES IN MINEFIELD
let displayMineCount = document.getElementsByClassName("MINES"),
  mineCount = 0;
function countMines() {
  mineCount = 0;
  for (y = 0; y < 15; y++) {
    for (x = 0; x < 15; x++) {
      if (tile[y][x].mine) {
        mineCount++;
      }
    }
  }
  displayMineCount[0].innerText = mineCount;
  displayMineCount[1].innerText = mineCount;
}

// [ theMain(theX, theY) ] FUNCTION AS THE MAIN FUNCTION EXECUTED AT EVERY PRESS OF THE TILES
let firstClick = true;
function theMain(theX, theY) {
  if (firstClick) {
    for (iy = -1; iy < 2; iy++) {
      currentY = theY + iy;
      if (currentY < 0 || currentY > 14) {
        continue;
      }
      for (ix = -1; ix < 2; ix++) {
        currentX = theX + ix;
        if (currentX < 0 || currentX > 14) {
          continue;
        }
        tile[currentY][currentX].mine = false;
      }
    }
    computeTiles();
    countMines();
    firstClick = false;
  }

  if (!tile[theY][theX].visible) {
    tile[theY][theX].visible = true;
    tile[theY][theX].selected = true;
    if (tile[theY][theX].number == 0) {
      revealZeros();
    }
    resetSelected();
    displayMinefield();
  } else {
    tile[theY][theX].visible = false;
    displayMinefield();
  }
}

// [ startSequence() ] FUNCTION FOR GENERATING MINES AND ALL THAT
function startSequence() {
  sectorGen();
  generateMines();
  curtain.style.display = "none";
  statBox.style.display = "flex";
}

// [ valid() ] FUNCTION TO CHECK IF THE MINEFIELD IS VALID FOR SUBMISSION
function valid() {
  i = 0;
  for (y = 0; y < 15; y++) {
    for (x = 0; x < 15; x++) {
      if (tile[y][x].visible) {
        i++;
      }
    }
  }
  return 225 - mineCount <= i ? true : false;
}

// [ minesHit() ] FUNCTION TO COUNT HOW MANY MINES GOT HIT
let inaccuracy = 0;
function minesHit() {
  inaccuracy = 0;
  for (y = 0; y < 15; y++) {
    for (x = 0; x < 15; x++) {
      if (tile[y][x].mine && tile[y][x].visible) {
        inaccuracy++;
      }
    }
  }
}

// [ exposeMines() ] FUNCTION FOR REVEALING THE MINES IN THE BOARD
function revealMines() {
  for (y = 0; y < 15; y++) {
    for (x = 0; x < 15; x++) {
      i = y * 15 + x;
      if (tile[y][x].mine) {
        if (!tile[y][x].visible) {
          displayTiles[i].style.backgroundColor = "#669900";
          displayTiles[i].style.borderColor = "white";
        } else {
          displayTiles[i].style.backgroundColor = "red";
        }
      }
    }
  }
}

// [ checkWin() ] FUNCTION TO CHECK IF THE PLAYER WON OR NOT
function checkWin() {
  if (valid()) {
    minesHit();
    curtainNav.style.display = "flex";
    if (inaccuracy == 0) {
      responses[1].innerText =
        "well done !!! you've successfully cleared the minefield";
      responses[2].innerText =
        "thank you for your service, we'll take it from here ;) you may now proceed.";
    } else {
      responses[1].innerText = "you've hit " + inaccuracy + " mines !!!";
      responses[2].innerText =
        "How clumsy of you to have missed them. We'll reassign your sector to other, more rigorous personel.";
    }
    revealMines();
  } else {
    responses[0].innerText =
      "<!!!> Minefield unfit for submission. At least all non-mine tiles must be uncovered first.";
    responses[3].innerText =
      "<!!!> Minefield unfit for submission. At least all non-mine tiles must be uncovered first.";
  }
}

// [ replay() ] FUNCTION TO EXECUTE REPLAY SEQUENCE
function replay() {
  responses[0].innerText = "";
  responses[3].innerText = "";
  displayMineCount[0].innerText = "X";
  displayMineCount[1].innerText = "X";
  curtainNav.style.display = "none";
  firstClick = true;
  sectorGen();
  generateMines();
  displayMinefield();
}