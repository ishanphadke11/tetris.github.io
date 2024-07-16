const game_grid = document.querySelector('.game-grid');
const scoreDisplay = document.querySelector('.score');
const rows = 20; // Number of rows
const columns = 15; // Number of columns
let score = 0;

let grid = [];
let patterns = [
    {
        shape: [
            [1, 1, 1],
            [0, 0, 1],
            [0, 0, 0]
        ],
        color: 'red',
        pattern_score: 4
    },
    {
        shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 1, 0]
        ],
        color: 'blue',
        pattern_score: 5
    },
    {
        shape: [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ],
        color: 'green',
        pattern_score: 3
    },
    {
        shape: [
            [0, 1, 1],
            [0, 1, 1],
            [0, 0, 0]
        ],
        color: 'yellow',
        pattern_score: 4
    },
    {
        shape: [
            [0, 1, 1],
            [0, 1, 1],
            [0, 0, 1]
        ],
        color: 'orange',
        pattern_score: 5
    },
    {
        shape: [
            [0, 0, 1],
            [0, 0, 1],
            [0, 0, 1]
        ],
        color: 'purple',
        pattern_score: 3
    },
    {
        shape: [
            [0, 1, 1],
            [0, 0, 1],
            [0, 0, 1]
        ],
        color: 'cyan',
        pattern_score: 4
    },
    {
        shape: [
            [0, 0, 0],
            [0, 1, 0],
            [0, 0, 0]
        ],
        color: 'brown',
        pattern_score: 1
    },
    {
        shape: [
            [0, 0, 0],
            [0, 1, 0],
            [0, 1, 1]
        ],
        color: 'white',
        pattern_score: 3
    },
    {
        shape: [
            [0, 0, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: 'chartreuse',
        pattern_score: 3
    },
];

// Loop through rows
for (let i = 0; i < rows; i++) {
    // Create a row array to store values for each row
    grid[i] = [];

    // Loop through columns
    for (let j = 0; j < columns; j++) {
        grid[i][j] = 0;
        const cell = document.createElement('div');
        cell.classList.add('cell');
        game_grid.appendChild(cell);
    }
}

// Function to place a pattern at a specific position
function placePattern(pattern, x, y) {
    for (let i = 0; i < pattern.shape.length; i++) {
        for (let j = 0; j < pattern.shape[i].length; j++) {
            if (pattern.shape[i][j] === 1 && x + i < rows && y + j < columns) {
                grid[x + i][y + j] = 1;
                const index = (x + i) * columns + (y + j);
                game_grid.children[index].style.backgroundColor = pattern.color; // Change color to pattern's color
            }
        }
    }
}

// Function to clear a pattern from a specific position
function clearPattern(pattern, x, y) {
    for (let i = 0; i < pattern.shape.length; i++) {
        for (let j = 0; j < pattern.shape[i].length; j++) {
            if (pattern.shape[i][j] === 1 && x + i < rows && y + j < columns) {
                grid[x + i][y + j] = 0;
                const index = (x + i) * columns + (y + j);
                game_grid.children[index].style.backgroundColor = ''; // Reset color to indicate empty cell
            }
        }
    }
}

function getRandomPattern() {
    const randomIndex = Math.floor(Math.random() * patterns.length);
    return patterns[randomIndex];
}

let currentX = 10;
let currentY = 10;
let isPatternLocked = false;
let currentPattern = getRandomPattern();

function isValidPosition(pattern, xPos, yPos) {
    for (let i = 0; i < pattern.shape.length; i++) {
        for (let j = 0; j < pattern.shape[i].length; j++) {
            if (pattern.shape[i][j] === 1) {
                const newX = xPos + i;
                const newY = yPos + j;
                if (newX >= rows || newY >= columns || newX < 0 || newY < 0) {
                    return false;
                }
                if (grid[newX][newY] === 1 && !isCurrentPatternCell(newX, newY)) {
                    return false;
                }
            }
        }
    }
    return true;
}

function isCurrentPatternCell(x, y) {
    const patternX = x - currentX;
    const patternY = y - currentY;
    if (patternX >= 0 && patternX < currentPattern.shape.length &&
        patternY >= 0 && patternY < currentPattern.shape[0].length) {
        return currentPattern.shape[patternX][patternY] === 1;
    }
    return false;
}

function updatePosition(newX, newY) {
    clearPattern(currentPattern, currentX, currentY);
    currentX = newX;
    currentY = newY;
    placePattern(currentPattern, currentX, currentY);
}

function lockPattern(pattern) {
    isPatternLocked = true;
    score += pattern.pattern_score;
    updateScoreDisplay();
    // checkForFullRows();
    currentPattern = getRandomPattern();
    currentX = 10;
    currentY = 10;
    isPatternLocked = false;
    updatePosition(currentX, currentY);
}

function updateScoreDisplay() {
    scoreDisplay.textContent = `Score: ${score}`;
}
/*
function checkForFullRows() {
    for (let i = rows - 1; i >= 0; i--) {
        if (isRowFull(i)) {
            clearRow(i);
            dropRowsAbove(i);
            score += 15;
            updateScoreDisplay();
            i++; // Recheck the current row as it has new content now
        }
    }
}

function isRowFull(row) {
    for (let j = 0; j < columns; j++) {
        if (grid[row][j] === 0) {
            return false;
        }
    }
    return true;
}

function clearRow(row) {
    for (let j = 0; j < columns; j++) {
        grid[row][j] = 0;
        const index = row * columns + j;
        game_grid.children[index].style.backgroundColor = ''; // Clear the cell color
    }
}

function dropRowsAbove(row) {
    for (let i = row; i > 0; i--) {
        for (let j = 0; j < columns; j++) {
            grid[i][j] = grid[i - 1][j];
            const index = i * columns + j;
            const aboveIndex = (i - 1) * columns + j;
            game_grid.children[index].style.backgroundColor = game_grid.children[aboveIndex].style.backgroundColor;
        }
    }
    // Clear the top row
    for (let j = 0; j < columns; j++) {
        grid[0][j] = 0;
        const index = j;
        game_grid.children[index].style.backgroundColor = ''; // Clear the cell color
    }
}
*/
document.addEventListener('keydown', (e) => {
    if (!isPatternLocked) {
        switch(e.key) {
            case 'ArrowUp':
                if (isValidPosition(currentPattern, currentX - 1, currentY)) updatePosition(currentX - 1, currentY);
                break;
            case 'ArrowDown':
                if (isValidPosition(currentPattern, currentX + 1, currentY)) updatePosition(currentX + 1, currentY);
                break;
            case 'ArrowLeft':
                if (isValidPosition(currentPattern, currentX, currentY - 1)) updatePosition(currentX, currentY - 1);
                break;
            case 'ArrowRight':
                if (isValidPosition(currentPattern, currentX, currentY + 1)) updatePosition(currentX, currentY + 1);
                break;
            case ' ':
                lockPattern(currentPattern);
                break;
        }
    }
});

// Initial placement of the first pattern
updatePosition(currentX, currentY);