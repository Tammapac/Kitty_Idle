(() => {
  const screen = document.getElementById("start-screen");
  const continueButton = document.getElementById("continue-game");
  const newButton = document.getElementById("new-game");

  const close = () => {
    screen?.classList.add("hidden");
    sessionStorage.setItem("kitty-start-seen", "1");
    window.setTimeout(() => screen?.remove(), 450);
  };

  if (sessionStorage.getItem("kitty-start-seen") === "1") {
    screen?.remove();
  } else {
    continueButton?.addEventListener("click", close);
    newButton?.addEventListener("click", () => {
      const confirmed = window.confirm("Wirklich ein neues Spiel beginnen? Der aktuelle Spielstand wird ersetzt.");
      if (confirmed) window.KittyIdleStart?.reset();
    });
  }
})();
