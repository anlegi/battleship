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
let notDropped;

function addShipPiece(user, ship, startId = null) {
  const allBoardBlocks = document.querySelectorAll(`#${user} .block`)
  // let randomBoolean = Math.random() < 0.5
  let isHorizontal = user === "player" ? angle === 0 : Math.random() < 0.5
  let randomStartIndex = Math.floor(Math.random() * width * width)

  let startIndex = startId ? parsePosition(startId) : randomStartIndex

  let validStart = isHorizontal ? startIndex <= width * width - ship.length ? startIndex : width * width - ship.length :
  // vertical
  startIndex <= width * width - width * ship.length ? startIndex : startIndex - ship.length  * width + width

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
    if (user === "computer") addShipPiece("computer", ship)
    if (user === "player") notDropped = true
  }
}

function parsePosition(startId){
  const elements = startId.split("-")
  return parseInt(elements[1])
}

ships.forEach(ship => addShipPiece("computer", ship))


// drag player ships
let draggedShip;
const optionShips = Array.from(optionContainer.children)
optionShips.forEach(optionShip => optionShip.addEventListener("dragstart", dragStart))


const allPlayerBlocks = document.querySelectorAll("#player div")
allPlayerBlocks.forEach(playerBlock => {
  playerBlock.addEventListener("dragover", dragOver)
  playerBlock.addEventListener("drop", dropShip)
})


function dragStart(e) {
  notDropped = false
  draggedShip = e.target
}

function dragOver(e) {
  e.preventDefault()
}

function dropShip(e) {
  const startId = e.target.id
  console.log(startId)
  const ship = ships[draggedShip.id]
  console.log(ship)
  addShipPiece("player", ship, startId)
  if (!notDropped) {
    draggedShip.remove()
  }
}
