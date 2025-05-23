import { player } from './player.js';

export let enemies = [];

const enemyImages = {
  up: new Image(),
  down: new Image(),
  left: new Image(),
  right: new Image()
};

enemyImages.up.src = "images/enemy/farmer_back.png";
enemyImages.down.src = "images/enemy/farmer_front.png";
enemyImages.left.src = "images/enemy/farmer_left.png";
enemyImages.right.src = "images/enemy/farmer_right.png";

export function spawnEnemy(type = 'basic') {
  const ex = Math.random() < 0.5 ? 0 : 1024;
  const ey = Math.random() * 720;
  enemies.push({
    x: ex,
    y: ey,
    speed: 1.5,
    hp: 2,
    type,
    direction: "down" // 기본 방향
  });
}

export function moveEnemies() {
  enemies.forEach(enemy => {
    let dx = player.x - enemy.x;
    let dy = player.y - enemy.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 0) {
      enemy.x += (dx / dist) * enemy.speed;
      enemy.y += (dy / dist) * enemy.speed;

      // 방향 계산
      if (Math.abs(dx) > Math.abs(dy)) {
        enemy.direction = dx > 0 ? "right" : "left";
      } else {
        enemy.direction = dy > 0 ? "down" : "up";
      }
    }
  });
}

export function drawEnemies(ctx) {
  enemies.forEach(enemy => {
    const img = enemyImages[enemy.direction];
    const size = 40;

    const isFlashing = enemy.hitFlashTimer && enemy.hitFlashTimer > Date.now();
    ctx.globalAlpha = enemy.hp === 1 ? 0.5 : 1;

    if (img.complete) {
      if (isFlashing) {
        ctx.filter = "brightness(1.5) drop-shadow(0 0 5px red)";
      }
      ctx.drawImage(img, enemy.x - size / 2, enemy.y - size / 2, size, size);
      ctx.filter = "none";
    } else {
      ctx.fillStyle = isFlashing ? "red" : "crimson";
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, 15, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  ctx.globalAlpha = 1;
}

export function applyRepulsion(enemies) {
  for (let i = 0; i < enemies.length; i++) {
    for (let j = i + 1; j < enemies.length; j++) {
      const dx = enemies[i].x - enemies[j].x;
      const dy = enemies[i].y - enemies[j].y;
      const dist = Math.hypot(dx, dy);
      const minDist = 30;

      if (dist < minDist && dist > 0) {
        const repel = (minDist - dist) / 2;
        enemies[i].x += (dx / dist) * repel;
        enemies[i].y += (dy / dist) * repel;
        enemies[j].x -= (dx / dist) * repel;
        enemies[j].y -= (dy / dist) * repel;
      }
    }
  }
}
