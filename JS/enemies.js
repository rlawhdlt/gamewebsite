import { player } from './player.js';

export let enemies = [];

function spawnEnemy(type = 'basic') {
  const ex = Math.random() < 0.5 ? 0 : 1024;
  const ey = Math.random() * 720;
  enemies.push({
    x: ex, y: ey,
    speed: 1.5,
    hp: 2,
    type
  });
}

function moveEnemies() {
  enemies.forEach(enemy => {
    let dx, dy;
    if (enemy.type === 'basic') {
      dx = player.x - enemy.x;
      dy = player.y - enemy.y;
    } else if (enemy.type === 'predictive') {
      dx = (player.x + player.vx * 20) - enemy.x;
      dy = (player.y + player.vy * 20) - enemy.y;
    } else if (enemy.type === 'sync') {
      dx = player.vx;
      dy = player.vy;
    }

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

import { player, playerHealth, isInvincible } from './player.js';

function checkPlayerHit() {
  if (isInvincible) return;

  for (let enemy of enemies) {
    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (dist < player.size + 15) {
      playerHealth--;
      updateHeartUI(playerHealth);
      isInvincible = true;
      flashPlayer(); // 깜빡임 효과
      if (playerHealth <= 0) {
        showGameOver();
      } else {
        setTimeout(() => isInvincible = false, 1000);
      }
      break;
    }
  }
}
