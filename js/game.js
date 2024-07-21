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


