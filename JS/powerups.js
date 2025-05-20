import { player,playerHealth, updatePlayerHealth, setEnhancedDamage } from './player.js';



let powerUps = [];
const powerupSound = new Audio("sounds/powerup.mp3");

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
      showPowerUpScene(p.type);
      powerupSound.currentTime = 0;
      powerupSound.play();
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
    if (type === "damage") {
      setEnhancedDamage(true); // 2로 변경
      setTimeout(() => setEnhancedDamage(false), 10000);
    }
  } else if (type === "heal") {
    if (playerHealth < 3) {
      updatePlayerHealth(playerHealth + 1); // 상태와 UI 둘 다 갱신
    }
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

function showPowerUpScene(type) {
  const text = type.toUpperCase();
  const div = document.createElement("div");
  div.id = "powerupScene";
  div.textContent = `POWER UP - ${text}`;
  div.style.position = 'absolute';
  div.style.top = '50%';
  div.style.left = '50%';
  div.style.transform = 'translate(-50%, -50%)';
  div.style.color = 'white';
  div.style.fontSize = '32px';
  div.style.textShadow = '0 0 10px white, 0 0 20px #0ff';
  div.style.zIndex = 1000;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 1000);
}