const flipButton = document.querySelector("#flip-button")
const optionContainer = document.querySelector(".option-container")
const gamesBoardContainer = document.querySelector("#gamesboard-container")

let angle = 0
function flip() {
  const optionShips = Array.from(optionContainer.children)
  if (angle === 0) {
    angle = 90
  } else {
    angle = 0
  }
  optionShips.forEach(optionShip => optionShip.style.transform = `rotate(${angle}deg)`) // css in js
}

flipButton.addEventListener("click", flip)


// create boards
const width = 10

function createBoard(color, user) {
  const gameBoardContainer = document.createElement("div")
  gameBoardContainer.classList.add("game-board")
  gameBoardContainer.style.backgroundColor = color
  gameBoardContainer.id = user
  gamesBoardContainer.append(gameBoardContainer)


  for (let i = 0; i < width * width; i++) {
    const block = document.createElement("div")
    block.classList.add("block")
    block.id = i
    gameBoardContainer.append(block)
  }
}

createBoard("green", "player")
createBoard("orange", "computer")

// create ships
class Ship {
  constructor(name, length) {
    this.name = name
    this.length = length
  }
}

const destroyer = new Ship("destroyer", 2)
const submarine = new Ship("submarine", 3)
const cruiser = new Ship("cruiser", 3)
const battleship = new Ship("battleship", 4)
const carrier = new Ship("carrier", 5)

const ships = [destroyer, submarine, cruiser, battleship, carrier]

function addShipPiece(user, ship, startId = null, isHorizontal = null) {
  const allBoardBlocks = document.querySelectorAll(`#${user} .block`);
  let randomStartIndex = Math.floor(Math.random() * width * width);

  // Adjust starting index to prevent overflow
  if (user === "computer") {
    // Continue with random placement for computer
    isHorizontal = Math.random() < 0.5; // Random orientation
    startId = Math.floor(Math.random() * width * width); // Random start index

    if (isHorizontal) {
      startId = startId - startId % width + Math.min(startId % width, width - ship.length);
    } else {
      while (startId + (ship.length - 1) * width >= width * width) {
        startId -= width; // Adjust to fit within vertical boundaries
      }
    }
  }

  let shipBlocks = [];
  // collects the blocks where the ship will be placed, it calculates an index for each part of the ship based on its orientation
  for (let i = 0; i < ship.length; i++) {
    let idx = isHorizontal ? randomStartIndex + i : randomStartIndex + i * width;
    if (idx < allBoardBlocks.length) { // Check if the calculated index is valid
      shipBlocks.push(allBoardBlocks[idx]);
    } else {
      // If not valid, restart the process for this ship
      addShipPiece(ship);
      return;
    }
  }

  const notTaken = shipBlocks.every(shipBlock => !shipBlock.classList.contains("taken"));

  if (notTaken) {
    shipBlocks.forEach(shipBlock => {
      shipBlock.classList.add(ship.name);
      shipBlock.classList.add("taken");
    });
  } else {
    addShipPiece(ship); // If any block is taken, restart the placement
  }
}

ships.forEach(ship => addShipPiece("computer", ship));


// drag ships
let draggedShip
const optionShips = Array.from(optionContainer.chidlren)
optionShips.forEach(optionShip => optionShip.addEventListener("dragstart", dragStart))

const allPlayerBlocks = document.querySelectorAll("#player div")
allPlayerBlocks.forEach(playerBlock => {
  playerBlock.addEventListener("dragover", dragOver)
  playerBlock.addEventListener("drop", dropShip)
})

function dragStart(e) {
  draggedShip = e.target
}

function dragOver(e) {
  e.preventDefault()
}

function dropShip(e) {
  const startId = e.target.id
  const ship = ships[draggedShip.id]
  addShipPiece("player", ship, startId)
}
