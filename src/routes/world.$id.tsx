import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { WORLDS, PRAISES, type Level, type Question } from "@/game/worlds";
import { getCurrentName, recordAnswer, getOrCreatePlayer } from "@/game/store";
import { sfx } from "@/game/sounds";

export const Route = createFileRoute("/world/$id")({
  component: WorldPage,
});

const LEVEL_LABEL: Record<Level, string> = {
  easy: "سهل",
  medium: "متوسط",
  hard: "صعب",
};
const LEVEL_COLOR: Record<Level, string> = {
  easy: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-rose-100 text-rose-700",
};

function WorldPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const world = useMemo(() => WORLDS.find((w) => w.id === id), [id]);
  const [playerName, setPlayerName] = useState<string | null>(null);

  useEffect(() => {
    const n = getCurrentName();
    if (!n) navigate({ to: "/" });
    else {
      setPlayerName(n);
      getOrCreatePlayer(n);
    }
  }, [navigate]);

  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [praise, setPraise] = useState("");
  const [completed, setCompleted] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const startTime = useRef(Date.now());

  if (!world) {
    return (
      <div className="p-8 text-center">
        <p>العالم غير موجود</p>
        <Link to="/" className="text-brand underline">عودة</Link>
      </div>
    );
  }

  const q: Question = world.questions[idx];
  const isCorrect = chosen != null && String(chosen) === String(q.answer);
  const finalCorrect = showFeedback && isCorrect;

  const submit = (c: string) => {
    if (showFeedback && finalCorrect) return;
    setChosen(c);
    const correct = String(c) === String(q.answer);
    if (correct) {
      sfx.correct();
      setPraise(PRAISES[Math.floor(Math.random() * PRAISES.length)]);
      setShowFeedback(true);
      if (playerName) {
        recordAnswer({
          playerName,
          worldId: world.id,
          questionId: q.id,
          skill: q.skill,
          prompt: q.prompt,
          chosen: c,
          correct: true,
          timeMs: Date.now() - startTime.current,
        });
      }
      setSessionCorrect((x) => x + 1);
    } else {
      sfx.wrong();
      if (attempts === 0) {
        setAttempts(1);
        setChosen(null);
        // show hint only
        setShowFeedback(false);
        setPraise("");
        // trigger shake via key
        setShakeKey((k) => k + 1);
      } else {
        setShowFeedback(true);
        if (playerName) {
          recordAnswer({
            playerName,
            worldId: world.id,
            questionId: q.id,
            skill: q.skill,
            prompt: q.prompt,
            chosen: c,
            correct: false,
            timeMs: Date.now() - startTime.current,
          });
        }
      }
    }
  };

  const next = () => {
    sfx.click();
    if (idx + 1 >= world.questions.length) {
      setCompleted(true);
      const player = playerName ? getOrCreatePlayer(playerName) : null;
      if (player && (player.stars[world.id] || 0) >= 3) sfx.badge();
      return;
    }
    setIdx(idx + 1);
    setChosen(null);
    setShowFeedback(false);
    setAttempts(0);
    setPraise("");
    startTime.current = Date.now();
  };

  const [shakeKey, setShakeKey] = useState(0);

  if (completed) {
    const player = playerName ? getOrCreatePlayer(playerName) : null;
    const stars = player?.stars[world.id] || 0;
    const earnedBadge = player?.badges.includes(world.id);
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-lg w-full rounded-3xl bg-white shadow-pop p-8 text-center pop-in">
          <div className="text-7xl mb-3 float">{world.emoji}</div>
          <h2 className="text-2xl font-black mb-2">أحسنت!</h2>
          <p className="text-muted-foreground mb-4">
            أكملت {world.name}
          </p>
          <div className="text-5xl mb-3">
            <span className={stars >= 1 ? "text-yellow-400" : "text-gray-300"}>★</span>
            <span className={stars >= 2 ? "text-yellow-400" : "text-gray-300"}>★</span>
            <span className={stars >= 3 ? "text-yellow-400" : "text-gray-300"}>★</span>
          </div>
          <p className="text-lg font-bold mb-2">
            أجبت {sessionCorrect} من {world.questions.length} إجابة صحيحة في هذه الجلسة
          </p>
          {earnedBadge && (
            <div className={`mt-4 rounded-2xl bg-gradient-to-br ${world.gradient} text-white px-4 py-3 font-black inline-flex items-center gap-2 shadow-pop`}>
              🎖️ حصلت على شارة {world.badge}!
            </div>
          )}
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Link to="/" className="rounded-2xl bg-secondary px-5 py-3 font-bold hover:bg-accent">
              الصفحة الرئيسية
            </Link>
            <button
              onClick={() => {
                setIdx(0);
                setChosen(null);
                setShowFeedback(false);
                setAttempts(0);
                setPraise("");
                setSessionCorrect(0);
                setCompleted(false);
                startTime.current = Date.now();
              }}
              className="rounded-2xl bg-gradient-sun text-brand-foreground px-5 py-3 font-black shadow-pop"
            >
              العب مرة ثانية 🔁
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = Math.round((idx / world.questions.length) * 100);

  return (
    <div className="min-h-screen">
      <header className={`bg-gradient-to-br ${world.gradient} text-white shadow-pop`}>
        <div className="mx-auto max-w-3xl px-4 py-5 flex items-center justify-between">
          <Link to="/" className="rounded-2xl bg-white/20 hover:bg-white/30 px-3 py-2 text-sm font-bold">
            ← رجوع
          </Link>
          <div className="text-center">
            <div className="text-3xl">{world.emoji}</div>
            <h1 className="text-lg font-black">{world.name}</h1>
          </div>
          <div className="text-sm font-bold bg-white/20 rounded-full px-3 py-2">
            {idx + 1} / {world.questions.length}
          </div>
        </div>
        <div className="h-2 bg-white/20">
          <div
            className="h-full bg-white transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div
          key={`${idx}-${shakeKey}`}
          className={`rounded-3xl bg-white shadow-pop p-6 md:p-8 pop-in ${attempts > 0 && !showFeedback ? "shake" : ""}`}
        >
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className={`text-xs font-bold rounded-full px-3 py-1 ${LEVEL_COLOR[q.level]}`}>
              {LEVEL_LABEL[q.level]}
            </span>
            <span className="text-xs font-bold rounded-full px-3 py-1 bg-secondary">
              {q.skill}
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-black leading-relaxed mb-6">
            {q.prompt}
          </h2>

          {q.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {q.options.map((opt) => {
                const selected = chosen === opt;
                const reveal = showFeedback;
                const isAns = String(opt) === String(q.answer);
                let cls = "border-2 border-input bg-background hover:border-brand";
                if (reveal && isAns) cls = "border-2 border-emerald-500 bg-emerald-50 text-emerald-800";
                else if (reveal && selected && !isAns) cls = "border-2 border-rose-500 bg-rose-50 text-rose-800";
                else if (selected) cls = "border-2 border-brand bg-amber-50";
                return (
                  <button
                    key={opt}
                    disabled={showFeedback && finalCorrect}
                    onClick={() => submit(opt)}
                    className={`rounded-2xl px-4 py-3 text-right font-bold text-base transition-all ${cls}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {attempts > 0 && !showFeedback && (
            <div className="mt-5 rounded-2xl bg-amber-50 border-2 border-amber-200 p-4">
              <p className="font-bold text-amber-800">💡 تلميح: {q.hint}</p>
              <p className="text-sm text-amber-700 mt-1">حاول مرة أخرى!</p>
            </div>
          )}

          {showFeedback && (
            <div
              className={`mt-5 rounded-2xl p-4 border-2 ${
                finalCorrect
                  ? "bg-emerald-50 border-emerald-300"
                  : "bg-rose-50 border-rose-300"
              }`}
            >
              <p className="font-black text-lg mb-1">
                {finalCorrect ? `✅ ${praise}` : "❌ لا بأس، نتعلم من الخطأ"}
              </p>
              <p className="text-sm leading-relaxed">
                <span className="font-bold">الشرح: </span>
                {q.explain}
              </p>
              <button
                onClick={next}
                className="mt-4 w-full rounded-2xl bg-gradient-sun text-brand-foreground font-black py-3 shadow-pop"
              >
                {idx + 1 >= world.questions.length ? "إنهاء العالم 🏁" : "السؤال التالي ←"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
