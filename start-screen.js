(() => {
  const screen = document.getElementById("start-screen");
  const continueButton = document.getElementById("continue-game");
  const newButton = document.getElementById("new-game");

  const close = () => {
    if (typeof window.closeKittyStart === "function") {
      window.closeKittyStart();
      return;
    }
    try { sessionStorage.setItem("kitty-start-seen", "1"); } catch (_) {}
    if (screen) {
      screen.style.display = "none";
      screen.remove();
    }
  };

  if (sessionStorage.getItem("kitty-start-seen") === "1") {
    close();
  } else {
    continueButton?.addEventListener("click", close);
    newButton?.addEventListener("click", () => {
      const confirmed = window.confirm("Wirklich ein neues Spiel beginnen? Der aktuelle Spielstand wird ersetzt.");
      if (confirmed) window.KittyIdleStart?.reset();
    });
  }
})();
