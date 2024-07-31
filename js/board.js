"use strict"

// Global variables
var selectedCells = []
var lastSelectedCell = null
var selectedDuration = 15
var timerInterval = null
var dictionary = []
var score = 0

// Function to load the dictionary
function loadDictionary() {
  var xhr = new XMLHttpRequest()
  xhr.open("GET", "es.json", true)
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      dictionary = JSON.parse(xhr.responseText).words
    }
  }
  xhr.send()
}

// Function to render the board
function renderBoard() {
  var board = document.getElementById("board")
  var boardData = generateBoard()
  board.innerHTML = "" // Clear existing cells

  boardData.flat().forEach(function (letter, idx) {
    var cell = document.createElement("div")
    cell.className = "cell"
    cell.textContent = letter
    cell.addEventListener("click", function () {
      handleCellClick(cell, idx, boardData)
    })
    board.appendChild(cell)
  })
}

// Function to handle cell click
function handleCellClick(cell, idx, boardData) {
  if (
    selectedCells.length > 0 &&
    (!cell.classList.contains("selectable") || selectedCells.includes(cell))
  )
    return

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
  var SIZE = 4
  document.querySelectorAll(".cell").forEach(function (cell) {
    cell.classList.remove("selectable")
  })

  if (!lastSelectedCell) {
    document.querySelectorAll(".cell").forEach(function (cell) {
      cell.classList.add("selectable")
    })
    return
  }

  var row = Math.floor(lastSelectedIdx / SIZE)
  var col = lastSelectedIdx % SIZE

  var positions = [
    { row: row - 1, col: col },
    { row: row + 1, col: col },
    { row: row, col: col - 1 },
    { row: row, col: col + 1 },
    { row: row - 1, col: col - 1 },
    { row: row - 1, col: col + 1 },
    { row: row + 1, col: col - 1 },
    { row: row + 1, col: col + 1 },
  ]

  positions.forEach(function (pos) {
    if (pos.row >= 0 && pos.row < SIZE && pos.col >= 0 && pos.col < SIZE) {
      var adjacentIdx = pos.row * SIZE + pos.col
      var adjacentCell = board.children[adjacentIdx]
      if (!selectedCells.includes(adjacentCell)) {
        adjacentCell.classList.add("selectable")
      }
    }
  })
}

// Function to update the current word display
function updateCurrentWord() {
  var currentWordElement = document.getElementById("currentWord")
  var currentWord = selectedCells
    .map(function (cell) {
      return cell.textContent
    })
    .join("")
  currentWordElement.textContent = "Palabra: " + currentWord

  var checkWordButton = document.getElementById("checkWordButton")
  checkWordButton.disabled = currentWord.length < 3
}

// Function to clear the selection
function clearSelection() {
  selectedCells.forEach(function (cell) {
    cell.classList.remove("selected", "last-selected")
  })
  selectedCells = []
  lastSelectedCell = null
  document.querySelectorAll(".cell").forEach(function (cell) {
    cell.classList.remove("selectable")
  })

  updateCurrentWord()
}

// Function to remove the last selected letter
function removeLastLetter() {
  if (selectedCells.length > 0) {
    var lastCell = selectedCells.pop()
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
  var playerName = document.getElementById("playerName").value.trim()
  if (playerName.length < 3) {
    showModal("El nombre debe tener al menos 3 letras.")
    return
  }

  document.getElementById("startScreen").style.display = "none"
  document.getElementById("gameBoard").classList.remove("hidden")
  document.getElementById("gameBoard").style.display = "block"
  renderBoard()
  setTimer(selectedDuration)
}

// Function to set the timer
function setTimer(duration) {
  var timeRemainingElement = document.getElementById("timeRemaining")
  var timerElement = document.getElementById("timer")
  timeRemainingElement.textContent = duration
  if (timerInterval) clearInterval(timerInterval)

  timerInterval = setInterval(function () {
    duration--
    timeRemainingElement.textContent = duration

    if (duration <= 10) {
      timerElement.classList.add("low-time")
    } else {
      timerElement.classList.remove("low-time")
    }

    if (duration <= 0) {
      clearInterval(timerInterval)
      console.log("JUEGO TERMINADO")
      endGame()
    }
  }, 1000) // Update every second
}

// Function to restart the game
function restartGame() {
  document.getElementById("overScreen").style.display = "none"
  document.getElementById("startScreen").style.display = "flex"
  document.getElementById("board").innerHTML = "" // Clear the board
  document.getElementById("foundWordsList").innerHTML = "" // Clear found words list
  document.getElementById("currentWord").textContent = "Palabra:"
  document.getElementById("scoreCounter").textContent = "Puntuación: 0"
  document.getElementById("timeRemaining").textContent = selectedDuration

  selectedCells = []
  lastSelectedCell = null
  score = 0
}

// Function to select the game duration
function selectDuration(duration) {
  selectedDuration = duration
  document.querySelectorAll(".timer-buttons button").forEach(function (button) {
    button.classList.remove("selected")
  })
  var button =
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

document
  .getElementById("restartGameButton")
  .addEventListener("click", restartGame)

document.getElementById("playerName").addEventListener("input", function () {
  var playerName = document.getElementById("playerName").value.trim()
  document.getElementById("startGameButton").disabled = playerName.length < 3
})

document
  .getElementById("orderByScoreButton")
  .addEventListener("click", function () {
    showRanking("score")
  })
document
  .getElementById("orderByDateButton")
  .addEventListener("click", function () {
    showRanking("date")
  })

document.getElementById("startGameButton").addEventListener("click", startGame)
document
  .getElementById("restartGameButton")
  .addEventListener("click", restartGame)

document.getElementById("checkWordButton").addEventListener("click", checkWord)

// Render board initially if needed
window.onload = function () {
  loadDictionary()
  renderBoard()
  showRanking()
}

// Render board initially if needed
window.onload = async function () {
  await loadDictionary()
  renderBoard()
  showRanking()
}

// Function to check if the current word is in the dictionary
function checkWord() {
  var currentWord = selectedCells
    .map(function (cell) {
      return cell.textContent
    })
    .join("")
    .toLowerCase()
  var foundWords = Array.from(
    document.getElementById("foundWordsList").children
  ).map(function (item) {
    return item.textContent.toLowerCase()
  })

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
  var timerElement = document.getElementById("timer")
  timerElement.classList.add("error")
  setTimeout(function () {
    timerElement.classList.remove("error")
  }, 1000) // Background stays dark for 1 second

  if (score > 0) {
    score -= 1
  }
  updateScore()
}

// Function to add the found word to the list
function addWordToList(word) {
  var foundWordsList = document.getElementById("foundWordsList")
  var listItem = document.createElement("li")
  listItem.textContent = word
  foundWordsList.appendChild(listItem)

  score += word.length
  updateScore()
}

// Function to update the score display
function updateScore() {
  var scoreCounter = document.getElementById("scoreCounter")
  scoreCounter.textContent = "Puntuación: " + score
}

// Function to end the game
function endGame() {
  console.log("HERE")
  var playerName = document.getElementById("playerName").value.trim()
  saveGameResult(playerName, score)

  document.getElementById("gameBoard").style.display = "none"
  var gameResultElement = document.getElementById("gameResult")
  gameResultElement.innerHTML =
    "<p>" +
    playerName +
    ": " +
    score +
    " puntos</p><p>" +
    new Date().toLocaleString() +
    "</p>"
  document.getElementById("overScreen").style.display = "flex"
}

// Function to save result
function saveGameResult(playerName, score) {
  var results = JSON.parse(localStorage.getItem("gameResults")) || []
  var gameResult = {
    name: playerName,
    score: score,
    date: new Date().toLocaleString(),
  }
  results.push(gameResult)
  localStorage.setItem("gameResults", JSON.stringify(results))
  showRanking()
}

// Functions to parse and format dates for ranking
function parseDate(dateString) {
  // Añadir chequeo para asegurarse de que dateString no es nulo o indefinido
  if (!dateString) {
    return null
  }

  // Utilizar regex para validar y extraer partes de la fecha
  var parts = dateString.match(
    /(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+) (\w+\.\w+\.)/
  )
  if (!parts) {
    return null
  }

  var day = parts[1],
    month = parts[2],
    year = parts[3]
  var hours = parseInt(parts[4], 10),
    minutes = parts[5],
    seconds = parts[6]
  var period = parts[7]

  if (period.toLowerCase() === "p.m." && hours !== 12) {
    hours += 12
  } else if (period.toLowerCase() === "a.m." && hours === 12) {
    hours = 0
  }

  // Validar que todas las partes de la fecha fueron correctamente extraídas
  if (
    isNaN(day) ||
    isNaN(month) ||
    isNaN(year) ||
    isNaN(hours) ||
    isNaN(minutes) ||
    isNaN(seconds)
  ) {
    return null
  }

  var isoString =
    year +
    "-" +
    month.padStart(2, "0") +
    "-" +
    day.padStart(2, "0") +
    "T" +
    hours.toString().padStart(2, "0") +
    ":" +
    minutes +
    ":" +
    seconds

  var parsedDate = new Date(isoString)
  return isNaN(parsedDate) ? null : parsedDate
}

function formatDate(date) {
  if (!date) {
    return "Invalid date"
  }
  var options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }
  return date.toLocaleDateString("es-ES", options)
}

// Function to show ranking
function showRanking(orderBy) {
  if (orderBy === undefined) {
    orderBy = "score"
  }
  var results = JSON.parse(localStorage.getItem("gameResults")) || []
  var sortedResults = results
    .map(function (result) {
      var parsedDate = parseDate(result.date)
      return {
        ...result,
        parsedDate: parsedDate,
      }
    })
    .filter(function (result) {
      return result.parsedDate !== null 
    })
    .sort(function (a, b) {
      if (orderBy === "score") {
        return b.score - a.score
      } else {
        return b.parsedDate - a.parsedDate 
      }
    })
    .slice(0, 7)

  var scoreList = document.getElementById("scoreList")
  scoreList.innerHTML = ""

  sortedResults.forEach(function (result) {
    var listItem = document.createElement("li")
    var formattedDate = formatDate(result.parsedDate)
    listItem.textContent =
      result.name + ": " + result.score + " puntos (" + formattedDate + ")"
    scoreList.appendChild(listItem)
  })
}