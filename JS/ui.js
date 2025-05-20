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
