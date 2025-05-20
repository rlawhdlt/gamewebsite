document.addEventListener("DOMContentLoaded", () => {
    const joystickImg = document.getElementById("joystick");
    if (!joystickImg) return;
  
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft" || e.key === "a") {
        joystickImg.src = "assets/joystick-left.png";
      } else if (e.key === "ArrowRight" || e.key === "d") {
        joystickImg.src = "assets/joystick-right.png";
      }
    });
  
    document.addEventListener("keyup", (e) => {
      if (["ArrowLeft", "ArrowRight", "a", "d"].includes(e.key)) {
        joystickImg.src = "assets/joystick-default.png";
      }
    });
  });
  