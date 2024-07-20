// Global variables
let selectedCells = []
let lastSelectedCell = null
let selectedDuration = null

// Function to render the board
function renderBoard() {
  const board = document.getElementById("board")
  const boardData = generateBoard()
  board.innerHTML = "" // Clear existing cells

  boardData.flat().forEach((letter, idx) => {
    const cell = document.createElement("div")
    cell.className = "cell"
    cell.textContent = letter
    cell.addEventListener("click", () => handleCellClick(cell, idx, boardData))
    board.appendChild(cell)
  })
}

// Function to handle cell click
function handleCellClick(cell, idx, boardData) {
  if (selectedCells.includes(cell)) return

  cell.classList.add("selected")
  selectedCells.push(cell)

  if (lastSelectedCell) {
    lastSelectedCell.classList.remove("last-selected")
  }

  cell.classList.add("last-selected")
  lastSelectedCell = cell

  updateSelectableCells(idx, boardData)
  updateCurrentWord()
}

// Function to update selectable cells
function updateSelectableCells(lastSelectedIdx, boardData) {
  const SIZE = 4
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.classList.remove("selectable")
  })

  if (!lastSelectedCell) return

  const row = Math.floor(lastSelectedIdx / SIZE)
  const col = lastSelectedIdx % SIZE

  const positions = [
    { row: row - 1, col: col },
    { row: row + 1, col: col },
    { row: row, col: col - 1 },
    { row: row, col: col + 1 },
    { row: row - 1, col: col - 1 },
    { row: row - 1, col: col + 1 },
    { row: row + 1, col: col - 1 },
    { row: row + 1, col: col + 1 },
  ]

  positions.forEach((pos) => {
    if (pos.row >= 0 && pos.row < SIZE && pos.col >= 0 && pos.col < SIZE) {
      const adjacentIdx = pos.row * SIZE + pos.col
      const adjacentCell = board.children[adjacentIdx]
      if (!selectedCells.includes(adjacentCell)) {
        adjacentCell.classList.add("selectable")
      }
    }
  })
}

// Function to update the current word display
function updateCurrentWord() {
  const currentWordElement = document.getElementById("currentWord")
  const currentWord = selectedCells.map((cell) => cell.textContent).join("")
  currentWordElement.textContent = `Palabra: ${currentWord}`

  const checkWordButton = document.getElementById("checkWordButton")
  checkWordButton.disabled = currentWord.length < 3
}

// Function to clear the selection
function clearSelection() {
  selectedCells.forEach((cell) => {
    cell.classList.remove("selected", "last-selected")
  })
  selectedCells = []
  lastSelectedCell = null
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.classList.remove("selectable")
  })

  updateCurrentWord()
}

// Function to remove the last selected letter
function removeLastLetter() {
  if (selectedCells.length > 0) {
    const lastCell = selectedCells.pop()
    lastCell.classList.remove("selected", "last-selected")
    if (selectedCells.length > 0) {
      lastSelectedCell = selectedCells[selectedCells.length - 1]
      lastSelectedCell.classList.add("last-selected")
    } else {
      lastSelectedCell = null
    }
    updateSelectableCells(
      selectedCells.length > 0
        ? Array.prototype.indexOf.call(board.children, lastSelectedCell)
        : -1,
      null
    )
    updateCurrentWord()
  }
}

// Function to start the game
function startGame(duration) {
  selectedDuration = duration
  // Implement the game start logic here
  console.log(`Game started with duration: ${duration} seconds`)
}

// Event listeners
document
  .getElementById("clearSelectionButton")
  .addEventListener("click", clearSelection)
document
  .getElementById("removeLastLetterButton")
  .addEventListener("click", removeLastLetter)

document
  .getElementById("90SecondsButton")
  .addEventListener("click", function () {
    startGame(90)
  })

document
  .getElementById("3MinutesButton")
  .addEventListener("click", function () {
    startGame(180)
  })

document
  .getElementById("5MinutesButton")
  .addEventListener("click", function () {
    startGame(300)
  })

// Render board initially if needed
window.onload = function () {
  renderBoard()
}
