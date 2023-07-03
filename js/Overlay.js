class Overlay {
  static {
    document.getElementById("hide-overlay-button").addEventListener("click", Overlay.hideOverlay);
    document.getElementById("my-popup").addEventListener("click", (e) => e.stopPropagation());
    document.getElementById("my-overlay").addEventListener("click", Overlay.hideOverlay);
    document.getElementById("my-info-button").addEventListener("click", Overlay.showOverlay);
  }

  static showOverlay() {
    document.getElementById("my-overlay").style.display = "flex";
    setTimeout(() => (document.getElementById("my-overlay").style.opacity = 1), 100);
    document.body.style.overflow = "hidden";
    window.addEventListener("keyup", Overlay.checkEscKey);
  }

  static hideOverlay() {
    document.getElementById("my-overlay").style.opacity = 0;
    setTimeout(() => (document.getElementById("my-overlay").style.display = "none"), 200);
    document.body.style.overflow = "initial";
    window.removeEventListener("keyup", Overlay.checkEscKey);
  }

  static checkEscKey = (event) => {
    if (event.key && (event.key === "Escape" || event.key === "Esc")) {
      Overlay.hideOverlay();
    }
  };
}

export { Overlay };
