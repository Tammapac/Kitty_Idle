(() => {
  const SAVE_KEY = "kitty-breeder-v4";

  const babyCat = (id, name, sex, color, pattern) => ({
    id,
    name,
    sex,
    color,
    pattern,
    rarity: 0,
    age: 0,
    growth: 0,
    happiness: 88,
    hunger: 90,
    health: 100,
    size: 0.55,
    genes: { size: 2, beauty: 2, energy: 2, luck: 1, temper: 2 },
    parents: [],
    generation: 1,
    cooldown: 0,
    wins: 0,
    activity: "sleep"
  });

  const freshSave = () => ({
    coins: 60,
    food: 50,
    toys: 5,
    science: 0,
    hearts: 5,
    lineage: 0,
    reputation: 0,
    selected: 1,
    selectedA: 1,
    selectedB: 2,
    nextId: 3,
    last: Date.now(),
    buildings: { kitchen: 0, nursery: 0, lab: 0, playroom: 0, garden: 0, showhall: 0 },
    research: { growth: 0, fertility: 0, genes: 0, offline: 0, gestation: 0, training: 0 },
    quests: { feed: 0, pet: 0, breed: 0, show: 0 },
    cats: [
      babyCat(1, "Minka", "♀", "orange", "tabby"),
      babyCat(2, "Milo", "♂", "gray", "solid")
    ],
    codex: ["orange-tabby", "gray-solid"],
    nest: null,
    visitors: [],
    showLog: []
  });

  try {
    if (!localStorage.getItem(SAVE_KEY)) {
      localStorage.setItem(SAVE_KEY, JSON.stringify(freshSave()));
    }
  } catch (error) {
    console.warn("Kitty Idle startup failed:", error);
  }

  window.KittyIdleStart = {
    hasSave() {
      try {
        const save = JSON.parse(localStorage.getItem(SAVE_KEY) || "{}");
        return Array.isArray(save.cats) && save.cats.length > 0;
      } catch {
        return false;
      }
    },
    reset() {
      localStorage.setItem(SAVE_KEY, JSON.stringify(freshSave()));
      location.reload();
    }
  };
})();