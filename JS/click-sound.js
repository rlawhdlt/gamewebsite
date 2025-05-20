const clickSound = new Audio("sounds/click.mp3");
clickSound.volume = 1.0;

let soundReady = false;

document.addEventListener("DOMContentLoaded", () => {
  // 🔓 unlock: 사용자의 첫 클릭
  document.addEventListener("click", () => {
    if (!soundReady) {
      clickSound.play().catch(() => {});
      clickSound.pause();
      clickSound.currentTime = 0;
      soundReady = true;
    }
  }, { once: true });

  // 모든 버튼에 클릭 사운드 적용
  const applyClickSound = () => {
    document.querySelectorAll("button").forEach(button => {
      if (!button.dataset.soundAttached) {
        button.addEventListener("click", () => {
          if (soundReady) {
            clickSound.currentTime = 0;
            clickSound.play();
          }
        });
        button.dataset.soundAttached = "true"; // 중복 방지
      }
    });
  };

  applyClickSound();

  const observer = new MutationObserver(applyClickSound);
  observer.observe(document.body, { childList: true, subtree: true });
});
