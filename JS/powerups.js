import { player } from './player.js';

let powerUps = [];

export function spawnPowerUp() {
  const types = ["speed", "damage", "heal"];
  const type = types[Math.floor(Math.random() * types.length)];
  const x = Math.random() * 1024;
  const y = Math.random() * 720;
  powerUps.push({ x, y, type });
}

export function checkPowerUpCollision() {
  powerUps = powerUps.filter(p => {
    const dist = Math.hypot(p.x - player.x, p.y - player.y);
    if (dist < 25) {
      applyPowerUp(p.type);
      return false;
    }
    return true;
  });
}

export function applyPowerUp(type) {
  if (type === "speed") {
    player.speed = 4;
    setTimeout(() => player.speed = 2.5, 10000);
  } else if (type === "damage") {
    // You could modify projectile damage logic
  } else if (type === "heal") {
    // Add player HP later
  }
}

export function drawPowerUps() {
  const ctx = document.getElementById("gameCanvas").getContext("2d");
  powerUps.forEach(p => {
    ctx.fillStyle = p.type === "speed" ? "lime" : p.type === "damage" ? "red" : "aqua";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
    ctx.fill();
  });
}
