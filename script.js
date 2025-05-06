const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let gameStarted = false;

let player = { x: 400, y: 300, speed: 2.5, size: 20 };
let keys = {};
let enemies = [];
let round = 1;
let roundTime = 0;
let maxTime = [90, 60, 30];
let spawnInterval, roundTimer;
let remainingTime = maxTime[0];
let gameOver = false;

window.addEventListener("keydown", e => {
  if (gameStarted) keys[e.key.toLowerCase()] = true;
});
window.addEventListener("keyup", e => {
  if (gameStarted) keys[e.key.toLowerCase()] = false;
});

function movePlayer() {
  let dx = 0, dy = 0;
  if (keys['w']) dy -= 1;
  if (keys['s']) dy += 1;
  if (keys['a']) dx -= 1;
  if (keys['d']) dx += 1;

  if (dx !== 0 || dy !== 0) {
    const len = Math.hypot(dx, dy);
    player.x += (dx / len) * player.speed;
    player.y += (dy / len) * player.speed;
  }

  player.x = Math.max(0, Math.min(canvas.width, player.x));
  player.y = Math.max(0, Math.min(canvas.height, player.y));
}

function spawnEnemy() {
  const ex = Math.random() < 0.5 ? 0 : canvas.width;
  const ey = Math.random() * canvas.height;
  enemies.push({ x: ex, y: ey, speed: 1 + round * 0.5 });
}

function moveEnemies() {
  enemies.forEach(enemy => {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const dist = Math.hypot(dx, dy);
    enemy.x += (dx / dist) * enemy.speed;
    enemy.y += (dy / dist) * enemy.speed;
  });
}

function detectCollision() {
  for (let enemy of enemies) {
    const dist = Math.hypot(enemy.x - player.x, enemy.y - player.y);
    if (dist < player.size) {
      gameOver = true;
      clearInterval(spawnInterval);
      clearInterval(roundTimer);
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.fillStyle = "dodgerblue";
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
  ctx.fill();

  // Draw enemies
  ctx.fillStyle = "crimson";
  enemies.forEach(enemy => {
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, 15, 0, Math.PI * 2);
    ctx.fill();
  });

  if (gameOver) {
    ctx.fillStyle = "black";
    ctx.font = "40px sans-serif";
    ctx.fillText("GAME OVER", 270, 300);
  }
}

function gameLoop() {
  if (!gameStarted || gameOver) return;

  movePlayer();
  moveEnemies();
  detectCollision();
  draw();

  requestAnimationFrame(gameLoop);
}

function startGame() {
  document.getElementById("instructionsModal").style.display = "none";
  gameStarted = true;

  // 타이머 시작
  document.getElementById("roundDisplay").textContent = `Round: ${round}`;
  document.getElementById("timerDisplay").textContent = `Time: ${remainingTime}s`;

  spawnInterval = setInterval(spawnEnemy, 2000 - round * 500);
  roundTimer = setInterval(() => {
    if (gameOver) return;

    remainingTime--;
    document.getElementById("timerDisplay").textContent = `Time: ${remainingTime}s`;

    if (remainingTime <= 0) {
      round++;
      if (round > 3) {
        alert("🎉 모든 라운드를 클리어했습니다!");
        clearInterval(spawnInterval);
        clearInterval(roundTimer);
        return;
      }

      remainingTime = maxTime[round - 1];
      enemies = [];
      document.getElementById("roundDisplay").textContent = `Round: ${round}`;
      clearInterval(spawnInterval);
      spawnInterval = setInterval(spawnEnemy, 2000 - round * 500);
    }
  }, 1000);

  gameLoop();
}

function detectCollision() {
  for (let enemy of enemies) {
    const dist = Math.hypot(enemy.x - player.x, enemy.y - player.y);
    if (dist < player.size) {
      gameOver = true;
      clearInterval(spawnInterval);
      clearInterval(roundTimer);
      showGameOver();
    }
  }
}

function showGameOver() {
  document.getElementById("gameOverScreen").style.display = "flex";
}

function restartGame() {
  // 변수 초기화
  player = { x: 512, y: 360, speed: 2.5, size: 20 };
  enemies = [];
  keys = {};
  round = 1;
  roundTime = 0;
  remainingTime = maxTime[0];
  gameOver = false;
  gameStarted = true;

  document.getElementById("gameOverScreen").style.display = "none";
  document.getElementById("roundDisplay").textContent = `Round: 1`;
  document.getElementById("timerDisplay").textContent = `Time: ${remainingTime}s`;

  spawnInterval = setInterval(spawnEnemy, 2000 - round * 500);
  roundTimer = setInterval(() => {
    if (!gameOver) {
      remainingTime--;
      document.getElementById("timerDisplay").textContent = `Time: ${remainingTime}s`;
      if (remainingTime <= 0) {
        nextRound();
      }
    }
  }, 1000);

  gameLoop();
}

function goToCharacter() {
  window.location.href = "character.html";
}

function goToMenu() {
  window.location.href = "index.html";
}
