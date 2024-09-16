import { backend } from 'declarations/backend';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('scoreValue');
const highScoresList = document.getElementById('highScoresList');

// Game variables
let score = 0;
const player = {
    x: 50,
    y: 200,
    width: 20,
    height: 20,
    dy: 0,
    jumpForce: -10,
    gravity: 0.6,
    isJumping: false
};
const platform = {
    x: 0,
    y: 300,
    width: canvas.width,
    height: 20
};

// Event listeners for controls
document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft') player.x -= 5;
    if (e.code === 'ArrowRight') player.x += 5;
    if (e.code === 'Space' && !player.isJumping) {
        player.dy = player.jumpForce;
        player.isJumping = true;
    }
});

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update player position
    player.y += player.dy;
    player.dy += player.gravity;

    // Check for collision with platform
    if (player.y + player.height > platform.y && player.y < platform.y + platform.height) {
        player.y = platform.y - player.height;
        player.dy = 0;
        player.isJumping = false;
    }

    // Draw player
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw platform
    ctx.fillStyle = 'green';
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

    // Update score
    score++;
    scoreElement.textContent = score;

    // Request next frame
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();

// Function to update high scores
async function updateHighScores() {
    try {
        const highScores = await backend.getHighScores();
        highScoresList.innerHTML = '';
        highScores.forEach(([name, score]) => {
            const li = document.createElement('li');
            li.textContent = `${name}: ${score}`;
            highScoresList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching high scores:', error);
    }
}

// Update high scores every 5 seconds
setInterval(updateHighScores, 5000);

// Function to submit high score when game ends
async function submitHighScore(playerName, finalScore) {
    try {
        await backend.addHighScore(playerName, finalScore);
        updateHighScores();
    } catch (error) {
        console.error('Error submitting high score:', error);
    }
}

// Example usage (you would call this when the game ends):
// submitHighScore('Player1', score);
