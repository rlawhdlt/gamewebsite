import { player, getFacingDirection } from './player.js';
import { enemies } from './enemies.js';

let projectiles = [];
let lastAttackTime = 0;
const attackCooldown = 500;

export function autoShoot() {
  const now = Date.now();
  const dir = getFacingDirection();
  if (dir && now - lastAttackTime > attackCooldown) {
    projectiles.push({
      x: player.x,
      y: player.y,
      dx: dir.x * 6,
      dy: dir.y * 6,
      damage: 20
    });
    lastAttackTime = now;
  }
}

export function updateProjectiles() {
  projectiles = projectiles.filter(p => {
    p.x += p.dx;
    p.y += p.dy;
    return p.x > 0 && p.x < 1024 && p.y > 0 && p.y < 720;
  });
}

export function checkProjectileCollision() {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    for (let j = enemies.length - 1; j >= 0; j--) {
      const dist = Math.hypot(projectiles[i].x - enemies[j].x, projectiles[i].y - enemies[j].y);
      if (dist < 20) {
        enemies[j].hp -= projectiles[i].damage;
        projectiles.splice(i, 1);
        break;
      }
    }
  }
}

export function drawProjectiles() {
  const ctx = document.getElementById("gameCanvas").getContext("2d");
  ctx.fillStyle = "yellow";
  projectiles.forEach(proj => {
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
}

function areaBlast() {
  for (let angle = 0; angle < 360; angle += 30) {
    const rad = angle * (Math.PI / 180);
    projectiles.push({
      x: player.x,
      y: player.y,
      dx: Math.cos(rad) * 5,
      dy: Math.sin(rad) * 5,
      damage: 10
    });
  }
}

setInterval(() => {
  if (gameStarted) areaBlast();
}, 3000); // 3초마다 범위 공격
