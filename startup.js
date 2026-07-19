(() => {
  const SAVE_KEY = "kitty-breeder-v3";
  const MIGRATION_KEY = "kitty-baby-start-v1";

  const babyCat = (id, name, sex, color, pattern) => ({
    id,
    name,
    sex,
    color,
    pattern,
    rarity: 0,
    age: 0.05,
    growth: 0,
    happiness: 92,
    hunger: 92,
    health: 100,
    size: 0.62,
    genes: { size: 2, beauty: 2, energy: 2, luck: 1, temper: 2 },
    parents: [],
    generation: 1,
    cooldown: 0,
    wins: 0,
    activity: "sleep"
  });

  const freshSave = () => ({
    coins: 350,
    food: 140,
    toys: 15,
    science: 0,
    hearts: 35,
    lineage: 0,
    reputation: 0,
    selected: 1,
    selectedA: 1,
    selectedB: 2,
    nextId: 3,
    last: Date.now(),
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
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      localStorage.setItem(SAVE_KEY, JSON.stringify(freshSave()));
      localStorage.setItem(MIGRATION_KEY, "1");
      return;
    }

    if (!localStorage.getItem(MIGRATION_KEY)) {
      const save = JSON.parse(raw);
      if (Array.isArray(save.cats)) {
        save.cats = save.cats.map((cat) => {
          const founder = cat.generation === 1 && (!cat.parents || cat.parents.length === 0);
          if (!founder) return cat;
          return {
            ...cat,
            age: 0.05,
            growth: 0,
            size: 0.62,
            activity: "sleep",
            hunger: Math.max(90, Number(cat.hunger) || 0),
            happiness: Math.max(90, Number(cat.happiness) || 0),
            health: 100
          };
        });
      }
      save.last = Date.now();
      localStorage.setItem(SAVE_KEY, JSON.stringify(save));
      localStorage.setItem(MIGRATION_KEY, "1");
    }
  } catch (error) {
    console.warn("Kitty Idle start migration failed:", error);
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
      localStorage.setItem(MIGRATION_KEY, "1");
      location.reload();
    }
  };
})();
