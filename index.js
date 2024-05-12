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

function addShipPiece(ship) {
  const allBoardBlocks = document.querySelectorAll("#computer div") // get all div elements in computer id
  let randomBoolean = Math.random() < 0.5
  let isHorizontal = randomBoolean
  let randomStartIndex = Math.floor(Math.random() * width * width)

  // valid start for first block
  let validStart = isHorizontal ? randomStartIndex <= width * width - ship.length ? randomStartIndex :
  width * width - ship.length : // if it overflws the right edge of the board, that's the new start index
  // vertical
  randomStartIndex <= width * width - (ship.length) * width // ship needs enough rows below the starting index to be placed without crossing the bottom boundary of the board
  ? randomStartIndex
  : randomStartIndex - ship.length * width + width

  let shipBlocks = []
  for (let i = 0; i < ship.length; i++) {
    if (isHorizontal) {
      shipBlocks.push(allBoardBlocks[Number(randomStartIndex) + i]) // push first block and second block to board
    } else { // when it's vertical
      shipBlocks.push(allBoardBlocks[Number(randomStartIndex) + i * width]) // random block at 52, i+width=10, so 52+10=62 => the block underneath 52
    }
  }

  let valid
  if (isHorizontal) {
    shipBlocks.every((_shipBlock, index) =>
      valid = shipBlocks[0].id % width !== width - (shipBlocks.length - (index + 1)))
  } else {
    shipBlocks.every((_shipblock, index) =>
      valid = shipBlocks[0].id < 90 + (width * index + 1))
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
