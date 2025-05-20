import { player,playerHealth, updatePlayerHealth, setEnhancedDamage } from './player.js';

const powerupImages = {
  speed: new Image(),
  damage: new Image(),
  heal: new Image(),
};

powerupImages.speed.src = "images/powerup-speed.png";
powerupImages.damage.src = "images/powerup-damage.png";
powerupImages.heal.src = "images/powerup-greenheal.png";

let powerUps = [];
const powerupSound = new Audio("sounds/powerup");

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
      const audio = new Audio('sounds/powerup.mp3');  // 🔈 사운드 재생
      audio.play();
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
    const img = powerupImages[p.type];
    if (img && img.complete) {
      ctx.drawImage(img, p.x - 16, p.y - 16, 50, 50); // 중앙 정렬
    }
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