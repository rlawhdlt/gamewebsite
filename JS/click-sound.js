document.addEventListener("DOMContentLoaded", () => {
    const clickSound = new Audio("sounds/click.mp3");
    clickSound.volume = 1.0;
  
    document.querySelectorAll("button").forEach(button => {
      const href = button.getAttribute("data-href");
  
      button.addEventListener("click", e => {
        // 사운드 재생
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});
  
        if (href) {
          e.preventDefault(); // 즉시 이동 방지
          setTimeout(() => {
            window.location.href = href;
          }, 200); // 200ms 후 이동 → 소리 먼저 재생됨
        }
      });
    });
  });
  