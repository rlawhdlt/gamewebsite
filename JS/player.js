export let player = { x: 512, y: 360, speed: 2.5, size: 20 };
let keys = {};
export let playerHealth = 3;
export let isInvincible = false;

import { enemies } from './enemies.js';
import { showGameOver, updateHeartUI } from './ui.js';
let onDeath = null;

export function setDeathCallback(callback) {
  onDeath = callback;
}

window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

export function movePlayer() {
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

  player.x = Math.max(0, Math.min(1024, player.x));
  player.y = Math.max(0, Math.min(720, player.y));
}

export function getFacingDirection() {
  let dx = 0, dy = 0;
  if (keys['w']) dy -= 1;
  if (keys['s']) dy += 1;
  if (keys['a']) dx -= 1;
  if (keys['d']) dx += 1;

  if (dx === 0 && dy === 0) return null;

  const len = Math.hypot(dx, dy);
  return { x: dx / len, y: dy / len };
}

export function drawPlayer(ctx) {
  ctx.fillStyle = isInvincible ? "rgba(30, 144, 255, 0.5)" : "dodgerblue"; // 깜빡임 효과
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
  ctx.fill();
}

export function checkPlayerHit() {
  if (isInvincible) return;

  for (let enemy of enemies) {
    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (dist < player.size + 15) {
      playerHealth--;
      updateHeartUI(playerHealth);
      isInvincible = true;

      if (playerHealth <= 0) {
        showGameOver();
        if (onDeath) onDeath(); // ✅ endGame 함수 호출
        return;
      }

      setTimeout(() => {
        isInvincible = false;
      }, 1000);
      break;
    }
  }
}

let shootCooldown = false;

window.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;

  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    shootInDirection(e.key);
  }
});

function shootInDirection(key) {
  if (shootCooldown) return;

  let dir = { x: 0, y: 0 };
  switch (key) {
    case "ArrowUp": dir.y = -1; break;
    case "ArrowDown": dir.y = 1; break;
    case "ArrowLeft": dir.x = -1; break;
    case "ArrowRight": dir.x = 1; break;
  }

  const len = Math.hypot(dir.x, dir.y);
  if (len === 0) return;

  // normalize
  dir.x /= len;
  dir.y /= len;

  // emit projectile (delegated to projectiles.js)
  if (shootCallback) shootCallback(player.x, player.y, dir.x, dir.y);

  shootCooldown = true;
  setTimeout(() => shootCooldown = false, 300); // 300ms 쿨타임
}

let shootCallback = null;
export function setShootCallback(callback) {
  shootCallback = callback;
}
