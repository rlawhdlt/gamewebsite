const player = document.getElementById('player');
const gameArea = document.getElementById('gameArea');
const gameOverScreen = document.getElementById('gameOverScreen');
const restartBtn = document.getElementById('restartBtn');

let zombies = [];
let attacks = [];

let playerX = window.innerWidth / 2;
let playerY = window.innerHeight / 2;
let speed = 5;

let moveDirection = null;
let playerHP = 10;
let gameOver = false; // ➔ 추가: 게임 오버 상태 확인용

// 키 입력
document.addEventListener('keydown', (e) => {
  if (gameOver) return; // 게임 오버 시 키 입력 무시
  const key = e.key.toLowerCase();
  if (['w', 'a', 's', 'd'].includes(key)) {
    moveDirection = key;
  }
});

document.addEventListener('keyup', (e) => {
  if (gameOver) return; // 게임 오버 시 키 입력 무시
  const key = e.key.toLowerCase();
  if (moveDirection === key) {
    moveDirection = null;
  }
});

restartBtn.addEventListener('click', () => {
  location.reload();
});

// 메인 루프
setInterval(gameLoop, 16);
setInterval(spawnZombie, 2000);
setInterval(autoAttack, 500); // 0.5초마다 자동 공격

function gameLoop() {
  if (gameOver) return; // 게임 오버 시 멈춤

  movePlayer();
  moveZombies();
  moveAttacks();
  checkCollisions();
}

function movePlayer() {
  if (gameOver) return;

  if (moveDirection === 'w') playerY -= speed;
  if (moveDirection === 's') playerY += speed;
  if (moveDirection === 'a') playerX -= speed;
  if (moveDirection === 'd') playerX += speed;

  playerX = Math.max(0, Math.min(window.innerWidth - 40, playerX));
  playerY = Math.max(0, Math.min(window.innerHeight - 40, playerY));

  updatePlayer();
}

function updatePlayer() {
  player.style.left = playerX + 'px';
  player.style.top = playerY + 'px';
}

function fireAttack() {
  if (gameOver) return;

  const attack = document.createElement('div');
  attack.classList.add('attack');
  attack.style.left = playerX + 15 + 'px';
  attack.style.top = playerY + 15 + 'px';
  attack.dataset.dir = moveDirection;
  attack.dataset.distance = 0;
  gameArea.appendChild(attack);
  attacks.push(attack);
}

function autoAttack() {
  if (gameOver) return;
  if (moveDirection) {
    fireAttack();
  }
}

function moveAttacks() {
  if (gameOver) return;

  attacks.forEach((attack, i) => {
    let x = parseFloat(attack.style.left);
    let y = parseFloat(attack.style.top);
    const dir = attack.dataset.dir;

    if (dir === 'w') y -= 10;
    if (dir === 's') y += 10;
    if (dir === 'a') x -= 10;
    if (dir === 'd') x += 10;

    attack.dataset.distance = parseFloat(attack.dataset.distance) + 10;

    attack.style.left = x + 'px';
    attack.style.top = y + 'px';

    if (parseFloat(attack.dataset.distance) > 300) {
      attack.remove();
      attacks.splice(i, 1);
    }
  });
}

function spawnZombie() {
  if (gameOver) return;

  const zombie = document.createElement('div');
  zombie.classList.add('zombie');
  zombie.style.left = Math.random() * window.innerWidth + 'px';
  zombie.style.top = Math.random() * window.innerHeight + 'px';
  zombie.dataset.hp = 3;
  gameArea.appendChild(zombie);
  zombies.push(zombie);
}

function moveZombies() {
  if (gameOver) return;

  zombies.forEach(zombie => {
    let zx = parseFloat(zombie.style.left);
    let zy = parseFloat(zombie.style.top);

    let dx = playerX - zx;
    let dy = playerY - zy;
    let distance = Math.sqrt(dx*dx + dy*dy);
    dx /= distance;
    dy /= distance;

    zx += dx * 1.5;
    zy += dy * 1.5;

    zombie.style.left = zx + 'px';
    zombie.style.top = zy + 'px';
  });
}

function checkCollisions() {
  if (gameOver) return;

  attacks.forEach((attack, ai) => {
    zombies.forEach((zombie, zi) => {
      let ax = parseFloat(attack.style.left);
      let ay = parseFloat(attack.style.top);
      let zx = parseFloat(zombie.style.left);
      let zy = parseFloat(zombie.style.top);

      if (Math.abs(ax - zx) < 20 && Math.abs(ay - zy) < 20) {
        let hp = parseInt(zombie.dataset.hp);
        hp -= 1;
        zombie.dataset.hp = hp;
        attack.remove();
        attacks.splice(ai, 1);

        if (hp <= 0) {
          zombie.remove();
          zombies.splice(zi, 1);
        }
      }
    });
  });

  zombies.forEach((zombie) => {
    let zx = parseFloat(zombie.style.left);
    let zy = parseFloat(zombie.style.top);

    if (Math.abs(playerX - zx) < 30 && Math.abs(playerY - zy) < 30) {
      playerHP -= 1;
      zombie.remove();
      zombies = zombies.filter(z => z !== zombie);

      if (playerHP <= 0) {
        endGame();
      }
    }
  });
}

function endGame() {
  gameOver = true;
  gameOverScreen.classList.remove('hidden');
}
