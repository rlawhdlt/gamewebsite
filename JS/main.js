import { player, movePlayer, getFacingDirection, drawPlayer } from './player.js';
import { enemies, spawnEnemy, moveEnemies, drawEnemies } from './enemies.js';
import { autoShoot, updateProjectiles, checkProjectileCollision, drawProjectiles } from './projectiles.js';
import { spawnPowerUp, drawPowerUps, checkPowerUpCollision } from './powerups.js';
import { updateUI, showGameOver, restartGame, goToMenu, goToCharacter } from './ui.js';

let gameStarted = false;
let round = 1;
let timeLeft = 30;

function startTimer() {
  setInterval(() => {
    timeLeft--;
    document.getElementById("timerDisplay").textContent = `Time: ${timeLeft}s`;

    if (timeLeft <= 0) {
      round++;
      timeLeft = 30;
      document.getElementById("roundDisplay").textContent = `Round: ${round}`;
      scaleDifficulty(round);
    }
  }, 1000);
}

function scaleDifficulty(round) {
  enemies.forEach(e => e.speed += 0.3);
  if (round >= 2) enemyTypes.push('predictive');
  if (round >= 3) enemyTypes.push('sync');
}

function gameLoop() {
  if (!gameStarted) return;

  movePlayer();
  moveEnemies();
  autoShoot();
  updateProjectiles();
  checkProjectileCollision();
  checkPowerUpCollision();

  const ctx = document.getElementById("gameCanvas").getContext("2d");
  ctx.clearRect(0, 0, 1024, 720);
  drawPowerUps();
  drawProjectiles();
  drawEnemies(ctx);
  drawPlayer(ctx);

  requestAnimationFrame(gameLoop);
}

function startGame() {
  document.getElementById("instructionsModal").style.display = "none";
  gameStarted = true;
  startTimer();
  gameLoop();
}

document.getElementById("startBtn").addEventListener("click", startGame);
window.restartGame = restartGame;
window.goToMenu = goToMenu;
window.goToCharacter = goToCharacter;
