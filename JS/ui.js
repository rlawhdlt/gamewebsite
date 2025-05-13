export function updateUI(state) {
  const ui = document.getElementById("gameUI");
  ui.style.display = state === "start" ? "block" : "none";
}

export function showGameOver() {
  const gameOverScreen = document.getElementById("gameOverScreen");
  if (gameOverScreen) gameOverScreen.style.display = "block";
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
    heart.style.opacity = index < health ? "1" : "0.2";
  });
}
