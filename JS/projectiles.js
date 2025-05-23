import { player, getFacingDirection, isEnhancedDamage } from './player.js';
import { enemies } from './enemies.js';
import { score } from './score.js';

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
  projectiles = projectiles.filter((projectile) => {
    let hit = false;

    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      const dx = projectile.x - enemy.x;
      const dy = projectile.y - enemy.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 30) {
        if (enemy.health === undefined) enemy.health = 2; // ✅ 체력 2로 설정
        enemy.health -= projectile.damage;
        enemy.hitTimer = 10; // ✅ 맞으면 효과 시간 지정
      
        score.totalDamageDealt += projectile.damage;
      
        if (enemy.health <= 0) {
          enemies.splice(i, 1);
          score.totalEnemiesDefeated++;
        }
        if (enemy.hp === undefined) enemy.hp = 2;
          enemy.hp -= projectile.damage;
          enemy.hitFlashTimer = Date.now() + 300; // 300ms 동안 반짝임 효과
      
        hit = true;
        break;
      }
    }

    return !hit; // 충돌한 projectile은 제거
  });
}

export function drawProjectiles() {
  const ctx = document.getElementById("gameCanvas").getContext("2d");
  projectiles.forEach(proj => {
    if (proj.type === "star") {
      ctx.fillStyle = "yellow";
      ctx.beginPath();
      ctx.moveTo(proj.x, proj.y - 20);          // top spike
      ctx.lineTo(proj.x + 8, proj.y + 20);      // bottom right
      ctx.lineTo(proj.x - 20, proj.y - 4);      // left
      ctx.lineTo(proj.x + 20, proj.y - 4);      // right
      ctx.lineTo(proj.x - 8, proj.y + 20);      // bottom left
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

