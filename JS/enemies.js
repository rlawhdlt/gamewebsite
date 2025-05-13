import { player } from './player.js';

export let enemies = [];

export function spawnEnemy(type = 'basic') {
  const ex = Math.random() < 0.5 ? 0 : 1024;
  const ey = Math.random() * 720;
  enemies.push({
    x: ex, y: ey,
    speed: 1.5,
    hp: 10,
    type
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
    }
  });
}

export function drawEnemies(ctx) {
  ctx.fillStyle = "crimson";
  enemies.forEach(enemy => {
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, 15, 0, Math.PI * 2);
    ctx.fill();
  });
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
