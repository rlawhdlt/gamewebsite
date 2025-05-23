import { score } from './score.js';

console.log(score.highScore); // ✅ 이렇게 접근
export function updateUI(state) {
  const ui = document.getElementById("gameUI");
  ui.style.display = state === "start" ? "block" : "none";
}


const gameOverSound = new Audio("sounds/gameover.mp3");
const clickSound = new Audio("sounds/click.mp3");
clickSound.volume = 1.0;

export function showGameOver() {
  const gameOverScreen = document.getElementById("gameOverScreen");
  if (gameOverScreen) {
    gameOverScreen.style.display = "block";
    gameOverSound.currentTime = 0;
    gameOverSound.play();
  }
}


export function showGameOverSummary() {
  const screen = document.getElementById("gameOverScreen");
  const stats = document.getElementById("finalStats");
  const buttons = document.getElementById("gameOverButtons");

  // ✅ 1. 통계 내용 업데이트
  document.getElementById("statEnemies").textContent = score.totalEnemiesDefeated;
  document.getElementById("statDamage").textContent = score.totalDamageDealt;
  document.getElementById("statHits").textContent = score.totalHitsTaken;

  const totalScore = score.totalEnemiesDefeated * 10 + score.totalDamageDealt - score.totalHitsTaken * 5;
  if (totalScore > score.highScore) {
    score.highScore = totalScore;
  }
  document.getElementById("statHighScore").textContent = score.highScore;

  // ✅ 2. 오버스크린 보여주기 + 버튼 숨기기
  screen.style.display = "flex";
  stats.style.display = "block";
  buttons.style.display = "none";

  // ✅ 3. 5초 후에 통계 숨기고 버튼만 보여주기
  setTimeout(() => {
    stats.style.display = "none";
    buttons.style.display = "flex";
    buttons.style.flexDirection = "column";
    buttons.style.gap = "12px";
  }, 5000);
}


export function restartGame() {
  clickSound.currentTime = 0;
  clickSound.play().catch(() => {});
  setTimeout(() => {
    window.location.reload();
  }, 200);
}

export function goToMenu() {
  clickSound.currentTime = 0;
  clickSound.play().catch(() => {});
  setTimeout(() => {
    window.location.href = "index.html";
  }, 200);
}

export function goToCharacter() {
  clickSound.currentTime = 0;
  clickSound.play().catch(() => {});
  setTimeout(() => {
    window.location.href = "character.html";
  }, 200);
}

export function updateHeartUI(health) {
  const hearts = document.querySelectorAll("#heartContainer .heart");
  hearts.forEach((heart, index) => {
    if (index < health) {
      heart.style.opacity = "1";
      heart.classList.remove("heart-glow");
      setTimeout(() => heart.classList.add("heart-glow"), 50); // 깜빡임 재적용
    } else {
      heart.style.opacity = "0.2";
      heart.classList.remove("heart-glow");
    }
  });
}
