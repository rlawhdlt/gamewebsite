import { player, movePlayer, getFacingDirection, drawPlayer, checkPlayerHit, setDeathCallback, setShootCallback } from './player.js';
import { enemies, spawnEnemy, moveEnemies, drawEnemies, applyRepulsion } from './enemies.js';
import { updateProjectiles, checkProjectileCollision, drawProjectiles, setGameStarted, fireProjectile } from './projectiles.js';
import { spawnPowerUp, drawPowerUps, checkPowerUpCollision } from './powerups.js';
import { updateUI, showGameOver, showGameOverSummary, restartGame, goToMenu, goToCharacter } from './ui.js';


export let totalEnemiesDefeated = 0;
export let totalDamageDealt = 0;
export let totalHitsTaken = 0;
export let highScore = 0;

let gameStarted = false;
let round = 1;
let timeLeft = 30;
let timerIntervalId = null;

setShootCallback(fireProjectile);

const bgm = new Audio("sounds/bgm.mp3");
bgm.loop = true;
bgm.volume = 0.3;

const toggleBtn = document.getElementById("toggleSound");
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    if (bgm.paused) {
      bgm.play();
      toggleBtn.textContent = "🔊";
    } else {
      bgm.pause();
      toggleBtn.textContent = "🔇";
    }
  });
}

setShootCallback(fireProjectile);

export function endGame() {
  gameStarted = false;
  if (enemySpawnIntervalId) clearInterval(enemySpawnIntervalId);
  if (timerIntervalId) clearInterval(timerIntervalId);
  bgm.pause(); // 🔇
  showGameOverSummary();
}

function resizeCanvas() {
  const canvas = document.getElementById("gameCanvas");
  const parent = canvas.parentElement;
  canvas.width = parent.clientWidth;
  canvas.height = parent.clientHeight;
}

function getTimeForRound(round) {
  if (round === 1) return 30;
  if (round === 2) return 40;
  return 60;
}

function startTimer() {
  timeLeft = getTimeForRound(round);
  document.getElementById("timerDisplay").textContent = `Time: ${timeLeft}s`;

  timerIntervalId = setInterval(() => {
    timeLeft--;
    document.getElementById("timerDisplay").textContent = `Time: ${timeLeft}s`;

    if (timeLeft <= 0) {
      round++;
      showRoundBanner(round, () => {
        timeLeft = getTimeForRound(round);
        document.getElementById("roundDisplay").textContent = `Round: ${round}`;
        setupEnemySpawn(round);
      });
    }
  }, 1000);
}

function startNextRound() {
  currentRound++;
  showRoundBanner(currentRound, () => {
    startRound(); // 적 스폰, 타이머 등 라운드 실제 시작
  });
}

function gameLoop() {
  if (!gameStarted) return;

  movePlayer();
  moveEnemies();
  updateProjectiles();
  checkProjectileCollision();
  checkPowerUpCollision();
  checkPlayerHit(); // ✅ 적과 충돌 감지
  applyRepulsion(enemies);

  const ctx = document.getElementById("gameCanvas").getContext("2d");
  ctx.clearRect(0, 0, 1024, 720);
  drawPowerUps();
  drawProjectiles();
  drawEnemies(ctx);
  drawPlayer(ctx);

  requestAnimationFrame(gameLoop);
}

function startGame() {
  const modal = document.getElementById("instructionsModal");
  if (modal) modal.style.display = "none";

  gameStarted = true;
  setGameStarted(true);
  updateUI("start");
  bgm.play();
  setDeathCallback(endGame); // ✅ 여기서 endGame 연결
  setInterval(spawnPowerUp, 15000);
  for (let i = 0; i < 3; i++) spawnEnemy();
  setupEnemySpawn(1);
  startTimer();
  gameLoop();
}

function showRoundBanner(roundNumber, callback) {
  const banner = document.getElementById('roundBanner');
  banner.textContent = `Round ${roundNumber}`;

  // ⛔ 타이머 및 적 스폰 정지
  clearInterval(timerIntervalId);
  clearInterval(enemySpawnIntervalId);

  // 🧹 이전 적 즉시 제거
  enemies.length = 0;
  const ctx = document.getElementById("gameCanvas").getContext("2d");
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // 🎬 애니메이션 표시
  banner.classList.remove('show');
  void banner.offsetWidth;
  banner.classList.add('show');

  // ✅ 3초 후 라운드 시작
  setTimeout(() => {
    banner.classList.remove('show');

    timeLeft = getTimeForRound(roundNumber);
    document.getElementById("roundDisplay").textContent = `Round: ${roundNumber}`;
    document.getElementById("timerDisplay").textContent = `Time: ${timeLeft}s`;

    setupEnemySpawn(roundNumber);
    startTimer();

    if (callback) callback();
  }, 3000); // 정확히 3초로 통합됨
}



let enemySpawnIntervalId = null;

function setupEnemySpawn(round) {
  // 기존 인터벌 제거
  if (enemySpawnIntervalId) clearInterval(enemySpawnIntervalId);

  let interval = 3000; // 기본: 라운드 1 → 3초
  let enemiesPerSpawn = 1;

  if (round === 2) {
    interval = 2000;
    enemiesPerSpawn = 2;
  } else if (round >= 3) {
    interval = 1000;
    enemiesPerSpawn = 3;
  }

  enemySpawnIntervalId = setInterval(() => {
    for (let i = 0; i < enemiesPerSpawn; i++) {
      spawnEnemy();
    }
  }, interval);
}


document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("startBtn");
  if (btn) btn.addEventListener("click", startGame);
  resizeCanvas();
});

window.restartGame = restartGame;
window.goToMenu = goToMenu;
window.goToCharacter = goToCharacter;
