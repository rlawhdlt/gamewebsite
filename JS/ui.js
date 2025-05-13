export function updateUI(mode) {
    if (mode === "start") {
      document.getElementById("roundDisplay").textContent = "Round: 1";
      document.getElementById("timerDisplay").textContent = "Time: 90s";
    }
  }
  
  export function showGameOver() {
    document.getElementById("gameOverScreen").style.display = "flex";
  }
  
  export function restartGame() {
    location.reload();
  }
  
  export function goToMenu() {
    window.location.href = "index.html";
  }
  
  export function goToCharacter() {
    window.location.href = "character.html";
  }
  