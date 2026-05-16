import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { WORLDS } from "@/game/worlds";
import {
  getCurrentName,
  getOrCreatePlayer,
  loadAll,
  setCurrentName,
  type PlayerProgress,
} from "@/game/store";

export const Route = createFileRoute("/")({
  component: Home,
});

function Star({ filled }: { filled: boolean }) {
  return (
    <span className={filled ? "text-yellow-400" : "text-gray-300"}>★</span>
  );
}

function Home() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [current, setCurrent] = useState<string | null>(null);
  const [player, setPlayer] = useState<PlayerProgress | null>(null);
  const [savedPlayers, setSavedPlayers] = useState<string[]>([]);

  useEffect(() => {
    const n = getCurrentName();
    setCurrent(n);
    setSavedPlayers(Object.keys(loadAll()));
    if (n) setPlayer(getOrCreatePlayer(n));
  }, []);

  const start = (n: string) => {
    const trimmed = n.trim();
    if (!trimmed) return;
    setCurrentName(trimmed);
    getOrCreatePlayer(trimmed);
    setCurrent(trimmed);
    setPlayer(getOrCreatePlayer(trimmed));
  };

  const logout = () => {
    localStorage.removeItem("nafis_current_player");
    setCurrent(null);
    setPlayer(null);
  };

  const totalQuestions = WORLDS.reduce((s, w) => s + w.questions.length, 0);
  const answered = player
    ? Object.values(player.perWorld).reduce((s, w) => s + w.answered.length, 0)
    : 0;
  const overall = totalQuestions ? Math.round((answered / totalQuestions) * 100) : 0;

  return (
    <div className="min-h-screen">
      <header className="bg-gradient-magic text-white shadow-pop">
        <div className="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl float">🏆</span>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                أبطال نافس في الرياضيات
              </h1>
              <p className="text-sm opacity-90">للصف الثالث الابتدائي</p>
            </div>
          </div>
          <Link
            to="/teacher"
            className="rounded-2xl bg-white/20 hover:bg-white/30 px-4 py-2 text-sm font-bold backdrop-blur"
          >
            👩‍🏫 لوحة المعلمة
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {!current ? (
          <section className="rounded-3xl bg-white shadow-pop p-8 max-w-xl mx-auto pop-in">
            <h2 className="text-2xl font-black mb-2">مرحبًا بك يا بطل! 👋</h2>
            <p className="text-muted-foreground mb-6">
              اكتب اسمك لنبدأ رحلتك في عالم الرياضيات
            </p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اكتب اسمك هنا..."
              className="w-full rounded-2xl border-2 border-input bg-background px-4 py-3 text-lg focus:border-brand outline-none"
              onKeyDown={(e) => e.key === "Enter" && start(name)}
            />
            <button
              onClick={() => start(name)}
              className="mt-4 w-full rounded-2xl bg-gradient-sun text-brand-foreground font-black text-lg py-3 shadow-pop hover:opacity-90"
            >
              يلا نبدأ 🚀
            </button>
            {savedPlayers.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-bold mb-2">أو اختر اسمك:</p>
                <div className="flex flex-wrap gap-2">
                  {savedPlayers.map((p) => (
                    <button
                      key={p}
                      onClick={() => start(p)}
                      className="rounded-full bg-secondary px-4 py-2 text-sm font-bold hover:bg-accent"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        ) : (
          <>
            <section className="rounded-3xl bg-white shadow-pop p-6 mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">أهلًا بعودتك</p>
                <h2 className="text-2xl font-black">{current} 🌟</h2>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-3xl font-black text-brand">{overall}%</div>
                  <div className="text-xs text-muted-foreground">نسبة الإنجاز</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-yellow-500">
                    {player?.badges.length || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">شارات</div>
                </div>
                <button
                  onClick={logout}
                  className="rounded-2xl bg-secondary px-4 py-2 text-sm font-bold hover:bg-accent"
                >
                  تبديل اللاعب
                </button>
              </div>
            </section>

            <h3 className="text-xl font-black mb-4">اختر عالمك ⚔️</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {WORLDS.map((w) => {
                const stars = player?.stars[w.id] || 0;
                const wp = player?.perWorld[w.id];
                const pct = wp ? Math.round((wp.answered.length / wp.total) * 100) : 0;
                return (
                  <button
                    key={w.id}
                    onClick={() => navigate({ to: "/world/$id", params: { id: w.id } })}
                    className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${w.gradient} text-white p-6 text-right shadow-pop hover:scale-[1.02] transition-transform`}
                  >
                    <div className="text-6xl mb-3 float">{w.emoji}</div>
                    <h4 className="text-lg font-black">{w.name}</h4>
                    <p className="text-sm opacity-90 mt-1 mb-4">{w.desc}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-xl">
                        <Star filled={stars >= 1} />
                        <Star filled={stars >= 2} />
                        <Star filled={stars >= 3} />
                      </div>
                      <div className="text-sm font-bold bg-white/20 rounded-full px-3 py-1">
                        {pct}%
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {player && player.badges.length > 0 && (
              <section className="mt-8 rounded-3xl bg-white shadow-pop p-6">
                <h3 className="text-xl font-black mb-3">🎖️ شاراتك</h3>
                <div className="flex flex-wrap gap-3">
                  {player.badges.map((b) => {
                    const w = WORLDS.find((x) => x.id === b);
                    if (!w) return null;
                    return (
                      <div
                        key={b}
                        className={`rounded-2xl bg-gradient-to-br ${w.gradient} text-white px-4 py-3 font-bold flex items-center gap-2 shadow-pop`}
                      >
                        <span className="text-2xl">{w.emoji}</span>
                        <span>شارة {w.badge}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          تصميم وإعداد: د. فاطمة الصوقعي
        </footer>
      </main>
    </div>
  );
}
