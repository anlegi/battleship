const flipButton = document.querySelector("#flip-button")
const optionContainer = document.querySelector(".option-container")
const gamesBoardContainer = document.querySelector("#gamesboard-container")

let angle = 0
function flip() {
  const optionShips = Array.from(optionContainer.children);
  if (angle === 0) {
    angle = 90;
    optionShips.forEach(ship => {
      ship.classList.remove('horizontal')
      ship.classList.add('vertical');
      // Update class names based on ship type to apply vertical styles
      if (ship.classList.contains('destroyer-preview')) {
        ship.classList.add('vertical-destroyer');
      } else if (ship.classList.contains('submarine-preview')) {
        ship.classList.add('vertical-submarine');
      } else if (ship.classList.contains('cruiser-preview')) {
        ship.classList.add('vertical-cruiser');
      } else if (ship.classList.contains('battleship-preview')) {
        ship.classList.add('vertical-battleship');
      } else if (ship.classList.contains('carrier-preview')) {
        ship.classList.add('vertical-carrier');
      }
    });
  } else {
    angle = 0;
    optionShips.forEach(ship => {
      ship.classList.remove('vertical');
      ship.classList.remove('vertical-destroyer', 'vertical-submarine', 'vertical-cruiser', 'vertical-battleship', 'vertical-carrier');
      ship.classList.add('horizontal');
    });
  }
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
    this.hits = 0
    this.blocks = []
  }
}

const destroyer = new Ship("destroyer", 2)
const submarine = new Ship("submarine", 3)
const cruiser = new Ship("cruiser", 3)
const battleship = new Ship("battleship", 4)
const carrier = new Ship("carrier", 5)

const ships = [destroyer, submarine, cruiser, battleship, carrier]

const shipStates = {
  destroyer: { length: destroyer.length, hits: 0 },
  submarine: { length: submarine.length, hits: 0 },
  cruiser: { length: cruiser.length, hits: 0 },
  battleship: { length: battleship.length, hits: 0 },
  carrier: { length: carrier.length, hits: 0 },
}

let notDropped;

function addShipPiece(user, ship, startId = null) {
  const allBoardBlocks = document.querySelectorAll(`#${user} .block`);
  let isHorizontal = user === "player" ? angle === 0 : Math.random() < 0.5;
  let randomStartIndex = Math.floor(Math.random() * width * width);

  let startIndex = startId ? parsePosition(startId) : randomStartIndex;

  let validStart = isHorizontal
    ? startIndex <= width * width - ship.length
      ? startIndex
      : width * width - ship.length
    : startIndex <= width * width - width * ship.length
    ? startIndex
    : startIndex - ship.length * width + width;

  let shipBlocks = [];
  for (let i = 0; i < ship.length; i++) {
    if (isHorizontal) {
      shipBlocks.push(allBoardBlocks[Number(validStart) + i]);
    } else {
      shipBlocks.push(allBoardBlocks[Number(validStart) + i * width]);
    }
  }

  let valid;

  if (isHorizontal) {
    valid = shipBlocks.every((shipBlock, index) => {
      const currentId = parseInt(shipBlock.id.split("-")[1]); // Splitting the id to get the numeric part
      const baseId = parseInt(shipBlocks[0].id.split("-")[1]);
      return (baseId % width) + index < width; // Ensure the ship doesn't wrap to the next line
    });
  } else {
    valid = shipBlocks.every((shipBlock, index) => {
      const currentId = parseInt(shipBlock.id.split("-")[1]); // Splitting the id to get the numeric part
      return currentId + width * index < width * width;
    });
  }

  const notTaken = shipBlocks.every(
    (shipBlock) => !shipBlock.classList.contains("taken")
  );

  if (valid && notTaken) {
    shipBlocks.forEach((shipBlock) => {
      shipBlock.classList.add(ship.name);
      shipBlock.classList.add("taken");
      if (user === "computer") {
        shipBlock.classList.add("hidden"); // Hide the computer's ships
      }
    });
    ship.blocks = shipBlocks; // Store the blocks of the ship
  } else {
    if (user === "computer") addShipPiece("computer", ship);
    if (user === "player") notDropped = true;
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
  resetShipOrientation(draggedShip)
}

function resetShipOrientation(ship) {
  ship.classList.remove('vertical-destroyer', 'vertical-submarine', 'vertical-cruiser', 'vertical-battleship', 'vertical-carrier', 'horizontal');

  if (angle === 90) {
    ship.classList.add('vertical');
    // Add specific vertical classes based on ship type
    if (ship.classList.contains('destroyer-preview')) {
      ship.classList.add('vertical-destroyer');
    } else if (ship.classList.contains('submarine-preview')) {
      ship.classList.add('vertical-submarine');
    } else if (ship.classList.contains('cruiser-preview')) {
      ship.classList.add('vertical-cruiser');
    } else if (ship.classList.contains('battleship-preview')) {
      ship.classList.add('vertical-battleship');
    } else if (ship.classList.contains('carrier-preview')) {
      ship.classList.add('vertical-carrier');
    }
  } else {
    ship.classList.add('horizontal')
  }
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
  } else {
    resetShipOrientation(draggedShip)
  }
}

const allComputerBlocks = document.querySelectorAll("#computer div")
allComputerBlocks.forEach((computerBlock) => {
  computerBlock.addEventListener("click", handleComputerClick)
})

let isPlayerTurn = true // player starts the game

function handleComputerClick(e) {
  if (!isPlayerTurn) return; // Prevent clicking if it's not player's turn
  const block = e.target;
  if (block.classList.contains("hit") || block.classList.contains("miss")) {
    return; // Prevent clicking on the same block multiple times
  }

  if (block.classList.contains("taken")) {
    block.classList.add("hit");
    block.classList.remove("hidden");
    const shipName = Array.from(block.classList).find((cls) =>
      ships.some((ship) => ship.name === cls)
    );

    if (shipName) {
      const ship = ships.find((s) => s.name === shipName);
      ship.hits += 1;
      document.getElementById("info").textContent = "Hit!";
      if (ship.hits === ship.length) {
        document.getElementById("info").textContent = `${capitalizeFirstLetter(shipName)} sunk!`;
        console.log(`Ship ${ship.name} is sunk.`);
        ship.blocks.forEach((shipBlock) => {
          if (shipBlock.id.startsWith("player")) {
            shipBlock.classList.add("sunk");
            console.log("Added sunk class to: ", shipBlock);
          }
        });
      }
    }
  } else {
    block.classList.add("miss");
    document.getElementById("info").textContent = "Miss!";
    isPlayerTurn = false; // Switch turn to the computer
    updateTurnDisplay(); // Update turn display
    setTimeout(computerTurn, 1000); // Give some delay for the computer's turn
  }

  block.removeEventListener("click", handleComputerClick); // Prevent clicking the same block multiple times
}

function computerTurn() {
  if (isPlayerTurn) return; // If it's already player's turn, return

  const playerBlocks = document.querySelectorAll("#player .block");
  let randomIndex;
  let block;

  do {
    randomIndex = Math.floor(Math.random() * playerBlocks.length);
    block = playerBlocks[randomIndex];
  } while (block.classList.contains("hit") || block.classList.contains("miss"));

  if (block.classList.contains("taken")) {
    block.classList.add("hit");
    const shipName = Array.from(block.classList).find((cls) =>
      ships.some((ship) => ship.name === cls)
    );

    if (shipName) {
      shipStates[shipName].hits += 1;
      document.getElementById("info").textContent = "Computer hit your ship!";
      if (shipStates[shipName].hits === shipStates[shipName].length) {
        document.getElementById("info").textContent = `Computer sunk your ${capitalizeFirstLetter(shipName)}!`;
        console.log(`Computer sunk your ${shipName}.`);
        const playerShip = ships.find(ship => ship.name === shipName)
        playerShip.blocks.forEach(block => {
          if (block.id.startsWith("computer")) {
            block.classList.add("sunk")
            console.log("Added sunk class to: ", block);
          }
        })
      }
    }
    setTimeout(computerTurn, 2000); // Continue computer's turn if hit
  } else {
    block.classList.add("miss");
    document.getElementById("info").textContent = "Computer missed!";
    isPlayerTurn = true; // Switch turn to the player
    updateTurnDisplay(); // Update turn display
  }
}

function updateTurnDisplay() {
  const turnDisplay = document.getElementById("turn-display");
  turnDisplay.textContent = isPlayerTurn ? "Player's Turn" : "Computer's Turn";
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
