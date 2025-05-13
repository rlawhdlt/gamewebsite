export let player = { x: 512, y: 360, speed: 2.5, size: 20 };
let keys = {};
export let playerHealth = 3;
export let isInvincible = false;

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
  ctx.fillStyle = "dodgerblue";
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
  ctx.fill();
}
