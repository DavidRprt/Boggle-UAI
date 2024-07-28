'use strict';

// Function to generate the board
function generateBoard() {
  var SIZE = 4;
  var frequentLetters = "AAEEEEIIOOU";
  var infrequentLetters = "BCDFGHJKLMNPQRSTVWXYZSSRRLLNNTTMMCC";
  var newBoard = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, function () { return ""; })
  );
  var totalVowels = 6;
  var vowelIndices = new Set();

  // Select random indices for vowels
  while (vowelIndices.size < totalVowels) {
    var randomIndex = Math.floor(Math.random() * SIZE * SIZE);
    vowelIndices.add(randomIndex);
  }

  // Fill the board with letters
  for (var i = 0; i < SIZE; i++) {
    for (var j = 0; j < SIZE; j++) {
      var linearIndex = i * SIZE + j;
      if (vowelIndices.has(linearIndex)) {
        newBoard[i][j] =
          frequentLetters[Math.floor(Math.random() * frequentLetters.length)];
      } else {
        newBoard[i][j] =
          infrequentLetters[
            Math.floor(Math.random() * infrequentLetters.length)
          ];
      }
    }
  }

  // Ensure Q has adjacent U
  for (i = 0; i < SIZE; i++) {
    for (j = 0; j < SIZE; j++) {
      if (newBoard[i][j] === "Q") {
        var hasAdjacentU = false;
        var directions = [
          [1, 0],
          [0, 1],
          [-1, 0],
          [0, -1],
          [1, 1],
          [-1, -1],
          [1, -1],
          [-1, 1]
        ];
        for (var d = 0; d < directions.length; d++) {
          var dx = directions[d][0];
          var dy = directions[d][1];
          var ni = i + dx,
              nj = j + dy;
          if (
            ni >= 0 &&
            ni < SIZE &&
            nj >= 0 &&
            nj < SIZE &&
            newBoard[ni][nj] === "U"
          ) {
            hasAdjacentU = true;
            break;
          }
        }
        if (!hasAdjacentU) {
          var placed = false;
          for (d = 0; d < directions.length; d++) {
            dx = directions[d][0];
            dy = directions[d][1];
            ni = i + dx;
            nj = j + dy;
            if (
              ni >= 0 &&
              ni < SIZE &&
              nj >= 0 &&
              nj < SIZE &&
              !vowelIndices.has(ni * SIZE + nj)
            ) {
              newBoard[ni][nj] = "U";
              placed = true;
              break;
            }
          }
          if (!placed && i < SIZE - 1) {
            newBoard[i + 1][j] = "U";
          }
        }
      }
    }
  }

  return newBoard;
}

