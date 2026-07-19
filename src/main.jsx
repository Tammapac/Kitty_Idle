import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const initial = { coins: 25, level: 1, xp: 0, hunger: 80, happy: 70, food: 0, bed: 0, friend: 0, bank: 0, last: Date.now() };
const load = () => { try { return { ...initial, ...JSON.parse(localStorage.getItem("kitty-idle") || "{}") }; } catch { return initial; } };

function App() {
  const [s, setS] = useState(load);
  const [note, setNote] = useState("");
  const cps = s.bed * (1 + s.level * 0.15);
  const gain = 3 + s.friend * 2 + Math.floor(s.level / 3);
  const need = s.level * 100;
  const costs = useMemo(() => ({ food: Math.floor(25 * 1.65 ** s.food), bed: Math.floor(50 * 1.65 ** s.bed), friend: Math.floor(80 * 1.65 ** s.friend) }), [s.food, s.bed, s.friend]);
  const toast = text => { setNote(text); clearTimeout(window.kittyToast); window.kittyToast = setTimeout(() => setNote(""), 1300); };
  const levelUp = n => { while (n.xp >= n.level * 100) { n.xp -= n.level * 100; n.level++; n.coins += n.level * 20; toast("Levelaufstieg! 🎉"); } return n; };
  const action = type => setS(p => {
    const n = { ...p };
    if (type === "feed") { if (n.hunger >= 100) { toast("Schon satt!"); return p; } n.hunger = Math.min(100, n.hunger + 22); n.xp += 12 + n.food * 6; }
    if (type === "play") { if (n.happy >= 100) { toast("Schon superglücklich!"); return p; } n.happy = Math.min(100, n.happy + 18); n.hunger = Math.max(0, n.hunger - 5); n.xp += 8; }
    if (type === "pet") { n.happy = Math.min(100, n.happy + 8); n.xp += 3; }
    n.coins += gain; return levelUp(n);
  });
  const buy = type => setS(p => { const c = costs[type]; if (p.coins < c) { toast("Nicht genug Münzen"); return p; } toast("Upgrade gekauft!"); return { ...p, coins: p.coins - c, [type]: p[type] + 1 }; });
  const collect = () => setS(p => { const amount = Math.floor(p.bank); if (!amount) { toast("Noch keine Idle-Münzen"); return p; } toast(`+${amount} Münzen`); return { ...p, coins: p.coins + amount, bank: p.bank - amount }; });

  useEffect(() => {
    const seconds = Math.min(28800, (Date.now() - (s.last || Date.now())) / 1000);
    if (seconds > 15 && cps > 0) setS(p => ({ ...p, bank: p.bank + seconds * cps }));
    const timer = setInterval(() => setS(p => {
      let rate = p.bed * (1 + p.level * 0.15); if (p.hunger < 25) rate *= .5; if (p.happy < 20) rate *= .6;
      return { ...p, hunger: Math.max(0, p.hunger - .045), happy: Math.max(0, p.happy - .03), bank: p.bank + rate, last: Date.now() };
    }), 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => localStorage.setItem("kitty-idle", JSON.stringify({ ...s, last: Date.now() })), [s]);

  return <main className="app">
    <div className={`toast ${note ? "show" : ""}`}>{note}</div>
    <header><div><small>Münzen</small>🪙 {Math.floor(s.coins)}</div><div><small>Pro Sekunde</small>✨ {cps.toFixed(1)}</div></header>
    <section className="card">
      <h1>Kitty Idle</h1><p>Ziehe deine Katze groß und baue ihr Katzenparadies auf.</p>
      <div className="scene"><span className="level">Level {s.level}</span><div className="sun"/><div className="cat">🐱</div><div className="bowl">🥣</div></div>
      <Bar label="Hunger" value={s.hunger} cls="orange"/><Bar label="Glück" value={s.happy} cls="pink"/><Bar label="Wachstum" value={s.xp / need * 100} text={`${Math.floor(s.xp)} / ${need}`} cls="blue"/>
      <div className="actions"><button onClick={() => action("feed")}>🥣 Füttern</button><button onClick={() => action("play")}>🧶 Spielen</button><button onClick={() => action("pet")}>💖 Streicheln</button><button onClick={collect}>🪙 Einsammeln</button></div>
    </section>
    <section className="card"><h2>Upgrades</h2><Upgrade icon="🥛" title={`Besseres Futter ${s.food}`} text="Mehr Wachstum beim Füttern" cost={costs.food} onClick={() => buy("food")}/><Upgrade icon="🧺" title={`Körbchen ${s.bed}`} text="Erzeugt automatisch Münzen" cost={costs.bed} onClick={() => buy("bed")}/><Upgrade icon="🐾" title={`Katzenfreund ${s.friend}`} text="Mehr Münzen pro Aktion" cost={costs.friend} onClick={() => buy("friend")}/></section>
  </main>;
}
function Bar({ label, value, text, cls }) { const v = Math.max(0, Math.min(100, value)); return <div className="barbox"><div><b>{label}</b><span>{text || `${Math.floor(v)}%`}</span></div><div className="bar"><i className={cls} style={{ width: `${v}%` }}/></div></div>; }
function Upgrade({ icon, title, text, cost, onClick }) { return <div className="upgrade"><span className="icon">{icon}</span><div><b>{title}</b><small>{text}</small></div><button onClick={onClick}>{cost} 🪙</button></div>; }
createRoot(document.getElementById("root")).render(<App/>);
