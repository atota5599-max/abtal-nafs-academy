// خلفية كرتونية احترافية مستوحاة من الأنمي التعليمي
// عناصر طائرة: أرقام، أشكال هندسية، نجوم، غيوم، عملات، ساعات، كسور

const FLOATERS = [
  { c: "1", cls: "text-sky-300" },
  { c: "2", cls: "text-pink-300" },
  { c: "3", cls: "text-amber-300" },
  { c: "7", cls: "text-emerald-300" },
  { c: "9", cls: "text-violet-300" },
  { c: "+", cls: "text-rose-300" },
  { c: "×", cls: "text-indigo-300" },
  { c: "÷", cls: "text-teal-300" },
  { c: "½", cls: "text-fuchsia-300" },
  { c: "¼", cls: "text-orange-300" },
  { c: "△", cls: "text-lime-300" },
  { c: "◯", cls: "text-cyan-300" },
  { c: "▢", cls: "text-yellow-300" },
  { c: "★", cls: "text-amber-200" },
  { c: "⏰", cls: "" },
  { c: "🪙", cls: "" },
  { c: "📐", cls: "" },
  { c: "🧩", cls: "" },
];

export function MagicBackground() {
  // مواقع ثابتة لتجنب اختلاف SSR/CSR
  const items = [
    { top: "6%",  left: "4%",  size: 56, delay: 0,   dur: 9,  i: 0 },
    { top: "12%", left: "82%", size: 48, delay: 1.2, dur: 11, i: 1 },
    { top: "22%", left: "28%", size: 64, delay: 0.6, dur: 13, i: 2 },
    { top: "30%", left: "68%", size: 44, delay: 2.1, dur: 10, i: 3 },
    { top: "44%", left: "8%",  size: 52, delay: 1.6, dur: 12, i: 4 },
    { top: "50%", left: "90%", size: 60, delay: 0.9, dur: 14, i: 5 },
    { top: "60%", left: "40%", size: 46, delay: 2.4, dur: 11, i: 6 },
    { top: "70%", left: "72%", size: 54, delay: 0.4, dur: 13, i: 7 },
    { top: "78%", left: "16%", size: 58, delay: 1.9, dur: 12, i: 8 },
    { top: "86%", left: "56%", size: 42, delay: 1.1, dur: 10, i: 9 },
    { top: "16%", left: "52%", size: 38, delay: 2.7, dur: 15, i: 10 },
    { top: "38%", left: "46%", size: 40, delay: 0.3, dur: 14, i: 11 },
    { top: "66%", left: "6%",  size: 48, delay: 1.4, dur: 13, i: 12 },
    { top: "8%",  left: "36%", size: 36, delay: 2.2, dur: 12, i: 13 },
    { top: "92%", left: "84%", size: 50, delay: 0.7, dur: 11, i: 14 },
  ];

  const stars = Array.from({ length: 24 }).map((_, k) => ({
    top: `${(k * 37) % 100}%`,
    left: `${(k * 53) % 100}%`,
    delay: (k % 7) * 0.3,
    size: 4 + (k % 4) * 2,
  }));

  return (
    <div aria-hidden className="magic-bg">
      {/* طبقة السماء المتدرجة */}
      <div className="magic-sky" />
      {/* جبال ملونة في الأسفل */}
      <svg className="magic-mountains" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="url(#mgrad1)" d="M0,220 L160,140 L280,200 L420,120 L560,200 L700,150 L860,220 L1000,140 L1160,200 L1320,150 L1440,210 L1440,320 L0,320 Z" />
        <path fill="url(#mgrad2)" opacity="0.85" d="M0,260 L120,200 L240,250 L380,190 L520,240 L680,200 L820,260 L980,210 L1140,250 L1300,200 L1440,250 L1440,320 L0,320 Z" />
        <defs>
          <linearGradient id="mgrad1" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.85 0.16 150)" />
            <stop offset="100%" stopColor="oklch(0.68 0.18 170)" />
          </linearGradient>
          <linearGradient id="mgrad2" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.82 0.17 110)" />
            <stop offset="100%" stopColor="oklch(0.62 0.18 145)" />
          </linearGradient>
        </defs>
      </svg>

      {/* غيوم ناعمة */}
      <div className="magic-cloud cloud-a">☁️</div>
      <div className="magic-cloud cloud-b">☁️</div>
      <div className="magic-cloud cloud-c">☁️</div>

      {/* قوس قزح وقلعة وبوابة سحرية */}
      <div className="magic-castle">🏰</div>
      <div className="magic-portal">🌈</div>

      {/* نجوم لامعة */}
      {stars.map((s, k) => (
        <span
          key={`s-${k}`}
          className="magic-twinkle"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {/* عناصر رياضية طائرة */}
      {items.map((it) => {
        const f = FLOATERS[it.i % FLOATERS.length];
        return (
          <span
            key={`f-${it.i}`}
            className={`magic-float ${f.cls}`}
            style={{
              top: it.top,
              left: it.left,
              fontSize: it.size,
              animationDelay: `${it.delay}s`,
              animationDuration: `${it.dur}s`,
            }}
          >
            {f.c}
          </span>
        );
      })}

      {/* غبار سحري */}
      <div className="magic-sparkle-layer" />
    </div>
  );
}

export function SignatureBadge() {
  return (
    <div className="signature-badge" aria-label="تصميم: فاطمة الصوقعي">
      <span className="signature-text">تصميم: فاطمة الصوقعي</span>
    </div>
  );
}
