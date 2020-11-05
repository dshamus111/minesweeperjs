document.addEventListener('DOMContentLoaded', () => {

  const grid = document.querySelector('.grid')

  let width = 10
  let bombAmount = 20
  let flags = 0
  let squares = []
  let isGameOver = false

  // Create Board
  function createBoard() {

    // get shuffled game array with random bombs
    const bombArray = Array(bombAmount).fill('bomb')
    const emptyArray = Array(width * width - bombAmount).fill('valid')
    const gameArray = emptyArray.concat(bombArray)
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5)

    for (let i = 0; i < width * width; i++) {
      const square = document.createElement('div')
      square.setAttribute('id', i)
      square.classList.add(shuffledArray[i])
      grid.appendChild(square)
      squares.push(square)

      //normal click
      square.addEventListener('click', (event) => {
        click(square)
      })

      //cntrl and left click
      square.oncontextmenu = function (e) {
        e.preventDefault()
        if (square.classList.contains('checked')) {
          checkIfCleared(square)
        } else {
          addFlag(square)
        }

      }

      document.getElementById('flags-left').innerHTML = bombAmount
    }


    // Add numbers
    for (let i = 0; i < squares.length; i++) {
      let total = 0
      const isLeftEdge = (i % width === 0)
      const isRightEdge = (i % width === width - 1)

      if (squares[i].classList.contains('valid')) {

        // bomb is left of square
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++

        // bomb is bottom left of square
        if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb'))
          total++

        // bomb is top of square
        if (i > 10 && squares[i - width].classList.contains('bomb')) total++

        // bomb is top left of square
        if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++

        // bomb is right of square
        if (i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++

        // bomb is bottom left of square
        if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++

        // bomb is bottom right of square
        if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++

        // bomb is bottom of square
        if (i < 89 && squares[i + width].classList.contains('bomb')) total++

        squares[i].setAttribute('data', total)
      }
    }
  }

  createBoard()

  // Add flag with right click
  function addFlag(square) {
    if (isGameOver) return
    if (!square.classList.contains('checked') && (flags <= bombAmount)) {
      if (!square.classList.contains('flag')) {
        square.classList.add('flag')
        square.innerHTML = '🚩'
        flags++
        checkForWin()
      } else {
        square.classList.remove('flag')
        square.innerHTML = ''
        flags--
      }
      document.getElementById('flags-left').innerHTML = bombAmount - flags
    }
  }

  // Checks to see if surrounding flags are equal to square
  function checkIfCleared(square) {
    const currentId = square.id
    surroundingFlags = 0
    const isLeftEdge = (currentId % width === 0)
    const isRightEdge = (currentId % width === width - 1)

    if (parseInt(currentId) > 0 && !isLeftEdge && squares[parseInt(currentId) - 1].classList.contains('flag')) surroundingFlags++

    if (parseInt(currentId) > 9 && !isRightEdge && squares[parseInt(currentId) + 1 - width].classList.contains('flag'))
      surroundingFlags++

    if (parseInt(currentId) > 10 && squares[parseInt(currentId) - width].classList.contains('flag')) surroundingFlags++

    if (parseInt(currentId) > 11 && !isLeftEdge && squares[parseInt(currentId) - 1 - width].classList.contains('flag')) surroundingFlags++

    if (parseInt(currentId) < 98 && !isRightEdge && squares[parseInt(currentId) + 1].classList.contains('flag')) surroundingFlags++

    if (parseInt(currentId) < 90 && !isLeftEdge && squares[parseInt(currentId) - 1 + width].classList.contains('flag')) surroundingFlags++

    if (parseInt(currentId) < 88 && !isRightEdge && squares[parseInt(currentId) + 1 + width].classList.contains('flag')) surroundingFlags++

    if (parseInt(currentId) < 89 && squares[parseInt(currentId) + width].classList.contains('flag')) surroundingFlags++

    if (square.getAttribute('data') !== 0 && surroundingFlags >= square.getAttribute('data')) {
      setTimeout(() => {
        if (currentId > 0 && !isLeftEdge) {
          const newId = squares[parseInt(currentId) - 1].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
        if (currentId > 9 && !isRightEdge) {
          const newId = squares[parseInt(currentId) + 1 - width].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
        if (currentId > 10) {
          const newId = squares[parseInt(currentId) - width].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
        if (currentId > 11 && !isLeftEdge) {
          const newId = squares[parseInt(currentId) - 1 - width].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
        if (currentId < 98 && !isRightEdge) {
          const newId = squares[parseInt(currentId) + 1].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
        if (currentId < 90 && !isLeftEdge) {
          const newId = squares[parseInt(currentId) - 1 + width].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
        if (currentId < 88 && !isRightEdge) {
          const newId = squares[parseInt(currentId) + 1 + width].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
        if (currentId < 89) {
          const newId = squares[parseInt(currentId) + width].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
      }, 10)
    }
  }

  // Click on square actions
  function click(square) {
    let currentId = square.id
    if (isGameOver) return
    if (square.classList.contains('checked') || square.classList.contains('flag')) return
    if (square.classList.contains('bomb')) {
      gameOver(square)
    } else {
      let total = square.getAttribute('data')
      if (total != 0) {
        square.classList.add('checked')
        if (total == 1) square.classList.add('one')
        if (total == 2) square.classList.add('two')
        if (total == 3) square.classList.add('three')
        if (total == 4) square.classList.add('four')
        square.innerHTML = total
        return
      }
      checkSquare(square, currentId)
    }
    square.classList.add('checked')
  }

  // Check neighboring square once square is clicked
  function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % width === 0)
    const isRightEdge = (currentId % width === width - 1)

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId > 9 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 - width].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId > 10) {
        const newId = squares[parseInt(currentId) - width].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId > 11 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 - width].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 98 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 90 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 + width].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 88 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 + width].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 89) {
        const newId = squares[parseInt(currentId) + width].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
    }, 10)
  }

  // Game Over
  function gameOver() {
    document.getElementById('result').innerHTML = 'Boom! Game Over!'
    isGameOver = true;

    // Show all bomb locations
    squares.forEach(square => {
      if (square.classList.contains('bomb')) {
        square.innerHTML = '💣'
      }
    }
    )
  }

  // Check for win
  function checkForWin() {
    let matches = 0;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
        matches++
      }
      if (matches === bombAmount) {
        document.getElementById('result').innerHTML = 'You Won!'
        isGameOver = true;
        break;
      }
    }
  }

})