import { player } from './player.js';

export let enemies = [];

export function spawnEnemy() {
  const ex = Math.random() < 0.5 ? 0 : 1024;
  const ey = Math.random() * 720;
  enemies.push({ x: ex, y: ey, speed: 1.5, hp: 100 });
}

export function moveEnemies() {
  enemies.forEach(enemy => {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const dist = Math.hypot(dx, dy);
    enemy.x += (dx / dist) * enemy.speed;
    enemy.y += (dy / dist) * enemy.speed;
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
