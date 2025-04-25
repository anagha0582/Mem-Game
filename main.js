document.addEventListener('DOMContentLoaded', () => {
    const tiles = document.querySelectorAll('.tile');
    const roundDisplay = document.getElementById('round');
    const scoreDisplay = document.getElementById('score');
    const messageDisplay = document.getElementById('message');
    const startBtn = document.getElementById('startBtn');
    
    let currentRound = 1;
    let score = 0;
    let targetTiles = []; // stores all tiles from all rounds
    let selectedTiles = [];
    let isShowingPattern = false;
    let isGameActive = false;
    
    //initialize game
    function initGame() {
        currentRound = 1;
        score = 0;
        targetTiles = [];
        updateDisplays();
        messageDisplay.textContent = 'Click Start Game to begin!';
        resetTiles();
    }
    
    // start a new game
    function startGame() {
        isGameActive = true;
        currentRound = 1;
        score = 0;
        targetTiles = []; // reset the pattern
        updateDisplays();
        startBtn.textContent = 'Restart Game';
        messageDisplay.textContent = 'Watch the pattern...';
        setTimeout(() => {
            startRound();
        }, 1000);
    }
    
    // start a new round (adds 1 new tile to the pattern)
    function startRound() {
        selectedTiles = [];
        resetTiles();
        
        // add 1 new random tile to the pattern (if not Round 1)
        if (currentRound > 1) {
            let newTile;
            do {
                newTile = Math.floor(Math.random() * 16) + 1;
            } while (targetTiles.includes(newTile)); // ensure no duplicates
            targetTiles.push(newTile);
        } else {
            // round 1: just pick 1 random tile
            targetTiles = [Math.floor(Math.random() * 16) + 1];
        }
        
        isShowingPattern = true;
        messageDisplay.textContent = 'Watch the pattern...';
        
        showPattern(targetTiles, () => {
            isShowingPattern = false;
            messageDisplay.textContent = `Select ${targetTiles.length} tile(s)`;
        });
    }
    
    // show the growing pattern (all previous tiles + 1 new one)
    function showPattern(tiles, callback) {
        let delay = 0;
        const highlightDuration = 800;
        const betweenDuration = 300;
        
        // highlight each tile in sequence
        tiles.forEach(tileNum => {
            const tile = document.getElementById(`tile${tileNum}`);
            setTimeout(() => {
                tile.classList.add('highlight');
            }, delay);
            
            setTimeout(() => {
                tile.classList.remove('highlight');
            }, delay + highlightDuration);
            
            delay += highlightDuration + betweenDuration;
        });
        
        setTimeout(callback, delay);
    }
    
    // handle tile selection
    function handleTileClick(tileNum) {
        if (!isGameActive || isShowingPattern) return;
        
        const tile = document.getElementById(`tile${tileNum}`);
        
        // if tile is already selected, do nothing
        if (selectedTiles.includes(tileNum)) return;
        
        // if tile is not in target tiles, game over
        if (!targetTiles.includes(tileNum)) {
            gameOver();
            return;
        }
        
        // select the tile
        selectedTiles.push(tileNum);
        tile.classList.add('selected');
        
        // check if all target tiles are selected
        if (selectedTiles.length === targetTiles.length) {
            // correct! Advance to next round
            score += currentRound * 10;
            currentRound++;
            updateDisplays();
            messageDisplay.textContent = 'Correct! Next round...';
            
            setTimeout(() => {
                startRound();
            }, 1500);
        }
    }
    
    // game over
    function gameOver() {
        isGameActive = false;
        messageDisplay.textContent = `Game Over! Final Score: ${score}`;
        resetTiles();
    }
    
    // reset all tiles to default state
    function resetTiles() {
        tiles.forEach(tile => {
            tile.classList.remove('highlight', 'selected');
        });
    }
    
    
    function updateDisplays() {
        roundDisplay.textContent = `Round: ${currentRound}`;
        scoreDisplay.textContent = `Score: ${score}`;
    }
    
    
    tiles.forEach(tile => {
        const tileNum = parseInt(tile.id.replace('tile', ''));
        tile.addEventListener('click', () => handleTileClick(tileNum));
    });
    
    startBtn.addEventListener('click', startGame);
    
    initGame();
});