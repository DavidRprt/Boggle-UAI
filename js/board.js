// Global variables
let selectedCells = []
let lastSelectedCell = null
let selectedDuration = 180
let timerInterval = null
let dictionary = []

async function loadDictionary() {
  const response = await fetch("es.json")
  const data = await response.json()
  dictionary = data.words
}

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
  if (selectedCells.length > 0 && (!cell.classList.contains("selectable") || selectedCells.includes(cell))) return

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

  if (!lastSelectedCell) {
    document.querySelectorAll(".cell").forEach((cell) => {
      cell.classList.add("selectable")
    })
    return
  }

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
function startGame() {
  const playerName = document.getElementById("playerName").value.trim()
  if (playerName.length < 3) {
    showModal("El nombre debe tener al menos 3 letras.")
    return
  }

  document.getElementById("startScreen").style.display = "none"
  document.getElementById("gameBoard").classList.remove("hidden")
  renderBoard()
  setTimer(selectedDuration)
  console.log(`Game started with duration: ${selectedDuration} seconds and player name: ${playerName}`)
}

// Function to set the timer
function setTimer(duration) {
  const timeRemainingElement = document.getElementById("timeRemaining")
  timeRemainingElement.textContent = duration
  if (timerInterval) clearInterval(timerInterval)

  timerInterval = setInterval(() => {
    duration--
    timeRemainingElement.textContent = duration

    if (duration <= 0) {
      clearInterval(timerInterval)
      endGame()
    }
  }, 1000) // Update every second
}

// Function to restart the game
function restartGame() {
  document.getElementById("overScreen").classList.add("hidden")
  document.getElementById("startScreen").style.display = "flex"
}

// Function to select the game duration
function selectDuration(duration) {
  selectedDuration = duration
  document.querySelectorAll(".timer-buttons button").forEach((button) => {
    button.classList.remove("selected")
  })
  const button =
    duration === 90
      ? document.getElementById("90SecondsButton")
      : duration === 180
      ? document.getElementById("3MinutesButton")
      : document.getElementById("5MinutesButton")
  button.classList.add("selected")
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
    selectDuration(90)
  })

document
  .getElementById("3MinutesButton")
  .addEventListener("click", function () {
    selectDuration(180)
  })

document
  .getElementById("5MinutesButton")
  .addEventListener("click", function () {
    selectDuration(300)
  })

document.getElementById("playerName").addEventListener("input", function () {
  const playerName = document.getElementById("playerName").value.trim()
  document.getElementById("startGameButton").disabled = playerName.length < 3
})

document.getElementById("startGameButton").addEventListener("click", startGame)
document
  .getElementById("restartGameButton")
  .addEventListener("click", restartGame)

document.getElementById("checkWordButton").addEventListener("click", checkWord)

// Render board initially if needed
window.onload = async function () {
  await loadDictionary()
  renderBoard()
}

// Function to check if the current word is in the dictionary
function checkWord() {
  const currentWord = selectedCells.map((cell) => cell.textContent).join("").toLowerCase()
  const foundWords = Array.from(document.getElementById("foundWordsList").children).map(item => item.textContent.toLowerCase())

  if (dictionary.includes(currentWord)) {
    if (foundWords.includes(currentWord)) {
      flashTimerBackground()
    } else {
      addWordToList(currentWord)
    }
  } else {
    flashTimerBackground()
  }
  clearSelection()
}


// Function to flash the timer background if the word is not in the dictionary
function flashTimerBackground() {
  const timerElement = document.getElementById("timer")
  timerElement.classList.add("error")
  setTimeout(() => {
    timerElement.classList.remove("error")
  }, 1000) // Background stays dark for 3 seconds
}



// Function to add the found word to the list
function addWordToList(word) {
  const foundWordsList = document.getElementById("foundWordsList")
  const listItem = document.createElement("li")
  listItem.textContent = word
  foundWordsList.appendChild(listItem)
}

// Function to end the game
function endGame() {
  document.getElementById("gameBoard").classList.add("hidden")
  document.getElementById("overScreen").classList.remove("hidden")
}