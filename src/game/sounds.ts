let ctx: AudioContext | null = null;
function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return ctx;
}

function tone(freq: number, dur = 0.15, type: OscillatorType = "sine", vol = 0.15) {
  const c = getCtx();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.value = vol;
  o.connect(g).connect(c.destination);
  o.start();
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  o.stop(c.currentTime + dur);
}

export const sfx = {
  correct: () => {
    tone(660, 0.12, "triangle");
    setTimeout(() => tone(880, 0.18, "triangle"), 100);
  },
  wrong: () => tone(180, 0.25, "sawtooth", 0.1),
  badge: () => {
    [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 0.18, "triangle"), i * 110));
  },
  click: () => tone(440, 0.05, "square", 0.08),
};
