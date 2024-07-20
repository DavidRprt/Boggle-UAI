// Global variables
let selectedCells = []
let lastSelectedCell = null

// Event listeners
document.getElementById("startButton").addEventListener("click", startGame)
document.getElementById("clearSelectionButton").addEventListener("click", clearSelection)
document.getElementById("removeLastLetterButton").addEventListener("click", removeLastLetter)

// Function to start the game
function startGame() {
  document.getElementById("startScreen").style.display = "none"
   document.getElementById("gameBoard").classList.remove("hidden")
  renderBoard()
}

// Function to generate the board
function generateBoard() {
  const SIZE = 4
  const frequentLetters = "AAEEEEIIOOU"
  const infrequentLetters = "BCDFGHJKLMNPQRSTVWXYZSSRRLLNNTTMMCC"
  let newBoard = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => "")
  )
  const totalVowels = 6
  let vowelIndices = new Set()

  while (vowelIndices.size < totalVowels) {
    let randomIndex = Math.floor(Math.random() * SIZE * SIZE)
    vowelIndices.add(randomIndex)
  }

  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      let linearIndex = i * SIZE + j
      if (vowelIndices.has(linearIndex)) {
        newBoard[i][j] =
          frequentLetters[Math.floor(Math.random() * frequentLetters.length)]
      } else {
        newBoard[i][j] =
          infrequentLetters[
            Math.floor(Math.random() * infrequentLetters.length)
          ]
      }
    }
  }

  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      if (newBoard[i][j] === "Q") {
        let hasAdjacentU = false
        const directions = [
          [1, 0],
          [0, 1],
          [-1, 0],
          [0, -1],
          [1, 1],
          [-1, -1],
          [1, -1],
          [-1, 1],
        ]
        for (let [dx, dy] of directions) {
          let ni = i + dx,
            nj = j + dy
          if (
            ni >= 0 &&
            ni < SIZE &&
            nj >= 0 &&
            nj < SIZE &&
            newBoard[ni][nj] === "U"
          ) {
            hasAdjacentU = true
            break
          }
        }
        if (!hasAdjacentU) {
          let placed = false
          for (let [dx, dy] of directions) {
            let ni = i + dx,
              nj = j + dy
            if (
              ni >= 0 &&
              ni < SIZE &&
              nj >= 0 &&
              nj < SIZE &&
              !vowelIndices.has(ni * SIZE + nj)
            ) {
              newBoard[ni][nj] = "U"
              placed = true
              break
            }
          }
          if (!placed && i < SIZE - 1) {
            newBoard[i + 1][j] = "U"
          }
        }
      }
    }
  }

  return newBoard
}

// Function to render the board
function renderBoard() {
  const board = document.getElementById("board")
  const boardData = generateBoard()
  console.log(boardData)
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
  if (selectedCells.includes(cell)) return // If already selected, do nothing

  // Add 'selected' class to the clicked cell
  cell.classList.add("selected")
  selectedCells.push(cell)

  // Remove 'last-selected' class from the previous last selected cell
  if (lastSelectedCell) {
    lastSelectedCell.classList.remove("last-selected")
  }

  // Add 'last-selected' class to the new last selected cell
  cell.classList.add("last-selected")
  lastSelectedCell = cell

  // Update selectable cells
  updateSelectableCells(idx, boardData)

  // Update the current word
  updateCurrentWord()
}

// Function to update selectable cells
function updateSelectableCells(lastSelectedIdx, boardData) {
  const SIZE = 4
  // Remove 'selectable' class from all cells
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.classList.remove("selectable")
  })

  if (!lastSelectedCell) return

  // Determine the position of the last selected cell
  const row = Math.floor(lastSelectedIdx / SIZE)
  const col = lastSelectedIdx % SIZE

  // Define adjacent positions
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

  // Add 'selectable' class to adjacent cells
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
