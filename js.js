const width = 16;
const cell_height = 16;
const number_bombs = 10;
const cell_size = 18;
let stopTimer = false;
let stopTimerBomb = false;
let functionCall = true;
let gameStart = true;
const restartBtn = document.getElementById('face');

let bombs = getBombs(width * cell_height, number_bombs);
function getBombs(fieldSize, bombsCount) {
  return [...Array(fieldSize).keys()]
    .sort(() => Math.random() - 0.5)
    .slice(0, bombsCount);
}

const field = document.querySelectorAll('.field')[0];
field.innerHTML = '<button class="button"></button>'.repeat(
  width * cell_height
);
field.style.gridTemplateColumns = `repeat(${width}, ${cell_size}px)`;

const cells = [...field.children];
cells.forEach((cell) => {
  cell.style.height = `${cell_size}px`;
});

field.addEventListener('mousedown', (event) => {
  if (gameStart) {
    if (event.button === 0) restartBtn.classList.add('face-surprise');
  }
});
field.addEventListener('mouseup', (event) => {
  if (gameStart) {
    if (event.button === 0) restartBtn.classList.remove('face-surprise');
  }
});
field.addEventListener('click', (event) => {
  if (gameStart) {
    if (event.target.classList.contains('flag')) {
      return;
    } else {
      if (event.target.tagName !== 'BUTTON') return;

      const index = cells.indexOf(event.target);

      const column = index % width;
      const row = (index - column) / width;

      openCell(row, column);
    }
    stopTimer = false;
    if (functionCall) {
      outNum();

      functionCall = false;
    }
  }
});

function openCell(row, column) {
  if (!isValid(row, column)) return;

  const index = row * width + column;
  const cell = cells[index];

  if (cell.disabled === true) return;

  cell.disabled = true;

  if (isBomb(row, column)) {
    openBomb();
    cell.classList.add('explosion');
    stopTimerBomb = true;

    outNum();
    gameStart = false;
    restartBtn.classList.add('face-sad');
    console.log();
    return;
  }

  const count = getCount(row, column);

  if (count !== 0) {
    if (count === 1) {
      cell.classList.add('one');
    }
    if (count === 2) {
      cell.classList.add('two');
    }
    if (count === 3) {
      cell.classList.add('three');
    }
    if (count === 4) {
      cell.classList.add('four');
    }
    if (count === 5) {
      cell.classList.add('five');
    }
    if (count === 6) {
      cell.classList.add('six');
    }
    if (count === 7) {
      cell.classList.add('seven');
    }

    return;
  }

  openCellsNearby(row, column);
}

function openCellsNearby(row, column) {
  for (let y = -1; y <= 1; y++) {
    for (let x = -1; x <= 1; x++) {
      setTimeout(() => openCell(row + y, column + x), 50);
    }
  }
}
function openBomb() {
  cells.forEach((cell, index) => {
    const column = index % width;
    const row = (index - column) / width;
    if (isBomb(row, column)) {
      cell.classList.add('bomb');
    }
  });
}

function getCount(row, column) {
  let count = 0;

  for (let y = -1; y <= 1; y++) {
    for (let x = -1; x <= 1; x++) {
      if (isBomb(row + y, column + x)) {
        count++;
      }
    }
  }

  return count;
}

function isBomb(row, column) {
  if (!isValid(row, column)) return false;
  const index = row * width + column;
  return bombs.includes(index);
}

function isValid(row, column) {
  return row >= 0 && row < cell_height && column >= 0 && column < width;
}

field.addEventListener('contextmenu', (event) => {
  if (gameStart) {
    event.preventDefault();
    event.target.classList.toggle('flag');
    let quantity = document.querySelectorAll('.field .flag').length;

    countingQuantity(quantity);
  }
});

restartBtn.addEventListener('mousedown', (e) => {
  e.target.classList.remove('face-sad');
  e.target.classList.add('face-smile');
});

restartBtn.addEventListener('mouseup', (e) => {
  // if (event.button === 2) {
  stopTimerBomb = false;

  stopTimer = true;
  outNum();
  functionCall = true;

  e.target.classList.remove('face-smile');
  clear();
  gameStart = true;
  // }
});

const clear = () => {
  const buttonClass = document.querySelectorAll('.button');

  buttonClass.forEach((item) => {
    item.classList.remove(
      'explosion',
      'one',
      'two',
      'three',
      'four',
      'five',
      'flag',
      'bomb'
    );
    item.disabled = false;

    // window.location.reload();
  });
  bombs = getBombs(width * cell_height, number_bombs);
};

const time = 10000;
const step = 1;

function outNum() {
  let secondsOnes = document.getElementById('seconds_ones');
  let secondsTens = document.getElementById('seconds_tens');
  let secondsHundreds = document.getElementById('seconds_hundreds');
  let firstNumber = 0;
  let secondNumber = 0;
  let thirdNumber = 0;

  let interval = setInterval(() => {
    if (firstNumber <= 9) {
      firstNumber = firstNumber + step;
    } else {
      firstNumber = 0;
      secondNumber += 1;
    }

    if (secondNumber === 10) {
      secondNumber = 0;
      thirdNumber += 1;
    }
    if (firstNumber <= 10) {
      secondsOnes.classList.add(`time${firstNumber}`);
      secondsOnes.classList.remove(`time${firstNumber - 1}`);
      if (firstNumber === 10) {
        secondsOnes.classList.remove(`time${firstNumber}`);
        secondsOnes.classList.add(`time${0}`);
      }
    }
    if (secondNumber <= 10) {
      secondsTens.classList.add(`time${secondNumber}`);
      secondsTens.classList.remove(`time${secondNumber - 1}`);
      if (secondNumber === 10) {
        secondsTens.classList.remove(`time${secondNumber}`);
        secondsTens.classList.add(`time${0}`);
      }
    }
    if (thirdNumber <= 10) {
      secondsHundreds.classList.add(`time${thirdNumber}`);
      secondsHundreds.classList.remove(`time${thirdNumber - 1}`);
      if (thirdNumber === 10) {
        secondsHundreds.classList.remove(`time${thirdNumber}`);
        secondsHundreds.classList.add(`time${0}`);
      }
    }
    if (stopTimer) {
      for (let index = 0; index < 10; index++) {
        secondsOnes.classList.remove(`time${index}`);
        secondsTens.classList.remove(`time${index}`);
        secondsHundreds.classList.remove(`time${index}`);
      }

      firstNumber = 0;
      secondNumber = 0;
      thirdNumber = 0;
      clearInterval(interval);
    }
    if (stopTimerBomb) {
      clearInterval(interval);
    }
  }, 1000);
}

function countingQuantity(quantity) {
  let secondsOnes = document.getElementById('mines_ones');
  let secondsTens = document.getElementById('mines_tens');
  let secondsHundreds = document.getElementById('mines_hundreds');

  let lastDigit = quantity.toString().slice(-1);
  let firstNumber = 10;
  let secondNumber = 4;
  let thirdNumber = 10;
  if (firstNumber <= 10 && firstNumber !== 0) {
    firstNumber = firstNumber - lastDigit;
  } else {
    firstNumber = 9;
    secondNumber -= 1;
  }
  if (firstNumber !== 10) {
    secondNumber = 3;
  }
  // if (secondNumber === 9) {
  //   secondNumber = 9;
  //   thirdNumber -= 1;
  // }
  if (firstNumber <= 10) {
    secondsOnes.classList.remove(`time${firstNumber + 1}`);
    secondsOnes.classList.add(`time${firstNumber}`);

    if (firstNumber === 0) {
      secondsOnes.classList.remove(`time${firstNumber}`);
      // secondsOnes.classList.add(`time${0}`);
    }
  }
  if (secondNumber < 4) {
    secondsTens.classList.remove(`time${4}`);
    secondsTens.classList.add(`time${secondNumber}`);

    if (secondNumber === 10) {
      secondsTens.classList.remove(`time${secondNumber}`);
      secondsTens.classList.add(`time${0}`);
    }
  }
}
