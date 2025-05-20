import { player, getFacingDirection, isEnhancedDamage } from './player.js';
import { enemies } from './enemies.js';

let projectiles = [];
let lastAttackTime = 0;
let gameStartedFlag = false;

export function setGameStarted(val) {
  gameStartedFlag = val;
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
        enemies[j].hitFlashTimer = Date.now() + 150; // 150ms 동안 깜빡임
        if (enemies[j].hp <= 0) enemies.splice(j, 1);
        projectiles.splice(i, 1);
        break;
      }
    }
  }
}

export function drawProjectiles() {
  const ctx = document.getElementById("gameCanvas").getContext("2d");
  projectiles.forEach(proj => {
    if (proj.type === "star") {
      ctx.fillStyle = "gold";
      ctx.beginPath();
      ctx.moveTo(proj.x, proj.y - 5);
      ctx.lineTo(proj.x + 2, proj.y + 5);
      ctx.lineTo(proj.x - 5, proj.y -1);
      ctx.lineTo(proj.x + 5, proj.y -1);
      ctx.lineTo(proj.x - 2, proj.y + 5);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillStyle = "yellow";
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}


export function fireProjectile(x, y, dx, dy) {
  const enhanced = isEnhancedDamage(); // 불러오기
  projectiles.push({
    x,
    y,
    dx: dx * 6,
    dy: dy * 6,
    damage: enhanced ? 2 : 1,
    type: enhanced ? "star" : "normal"
  });
}

