export function updateUI(state) {
  const ui = document.getElementById("gameUI");
  ui.style.display = state === "start" ? "block" : "none";
}

const gameOverSound = new Audio("sounds/gameover.mp3");

export function showGameOver() {
  const gameOverScreen = document.getElementById("gameOverScreen");
  if (gameOverScreen) {
    gameOverScreen.style.display = "block";
    gameOverSound.currentTime = 0;
    gameOverSound.play();
  }
}

export function restartGame() {
  window.location.reload();
}

export function goToMenu() {
  window.location.href = "index.html";
}

export function goToCharacter() {
  window.location.href = "character.html";
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
