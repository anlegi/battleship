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
    block.id = user + "-" + i // unique id for either player or compi
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

function addShipPiece(ship) {
  const allBoardBlocks = document.querySelectorAll("#computer div")
  let randomBoolean = Math.random() < 0.5
  let isHorizontal = randomBoolean
  let randomStartIndex = Math.floor(Math.random() * width * width)

  let validStart = isHorizontal ? randomStartIndex <= width * width - ship.length ? randomStartIndex : width * width - ship.length :
  // vertical
  randomStartIndex <= width * width - width * ship.length ? randomStartIndex :
  randomStartIndex - ship.length  * width + width


  let shipBlocks = []

  for (let i = 0; i < ship.length; i++) {
    if (isHorizontal) {
      shipBlocks.push(allBoardBlocks[Number(validStart) + i])
    } else {
      shipBlocks.push(allBoardBlocks[Number(validStart) + i * width])
    }
  }


  // Assuming shipBlocks is an array of DOM elements and 'id' is like 'computer-15'
let valid;

//HEREEEEEEEEE
if (isHorizontal) {
  valid = shipBlocks.every((shipBlock, index) => {
    const currentId = parseInt(shipBlock.id.split('-')[1]);  // Splitting the id to get the numeric part
    const baseId = parseInt(shipBlocks[0].id.split('-')[1]);
    return (baseId % width) + index < width;  // Ensure the ship doesn't wrap to the next line
  });
} else {
  valid = shipBlocks.every((shipBlock, index) => {
    const currentId = parseInt(shipBlock.id.split('-')[1]);  // Splitting the id to get the numeric part
    return currentId + (width * index) < width * width;  // Ensure the ship doesn't overflow the board bounds vertically
  });
}




  const notTaken = shipBlocks.every(shipBlock => !shipBlock.classList.contains("taken"))

  if (valid && notTaken) {
    shipBlocks.forEach(shipBlock => {
      shipBlock.classList.add(ship.name)
      shipBlock.classList.add("taken")
    })
  } else {
    addShipPiece(ship)
  }
}

ships.forEach(ship => addShipPiece(ship))
