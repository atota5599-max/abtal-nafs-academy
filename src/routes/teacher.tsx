import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { WORLDS } from "@/game/worlds";
import {
  getTeacherPwd,
  loadAll,
  setTeacherPwd,
  getRecommendations,
  DEFAULT_TEACHER_PWD,
  type PlayerProgress,
} from "@/game/store";

export const Route = createFileRoute("/teacher")({
  component: Teacher,
});

function Teacher() {
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [players, setPlayers] = useState<Record<string, PlayerProgress>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [newPwd, setNewPwd] = useState("");

  useEffect(() => {
    if (authed) setPlayers(loadAll());
  }, [authed]);

  const login = () => {
    if (pwd === getTeacherPwd()) {
      setAuthed(true);
      setErr("");
    } else setErr("كلمة المرور غير صحيحة");
  };

  const exportCSV = (p: PlayerProgress) => {
    const rows = [
      ["المهارة", "محاولات", "صحيحة", "خاطئة", "متوسط الزمن (ث)"],
      ...Object.entries(p.skillStats).map(([s, st]) => [
        s,
        String(st.attempts),
        String(st.correct),
        String(st.wrong),
        (st.totalTimeMs / st.attempts / 1000).toFixed(1),
      ]),
    ];
    const csv = "\uFEFF" + rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `تقرير-${p.name}.csv`;
    a.click();
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-3xl bg-white shadow-pop p-8 pop-in">
          <div className="text-5xl text-center mb-3">🔒</div>
          <h1 className="text-2xl font-black text-center mb-2">لوحة المعلمة</h1>
          <p className="text-center text-muted-foreground mb-6 text-sm">
            ادخلي كلمة المرور للوصول (الافتراضية: {DEFAULT_TEACHER_PWD})
          </p>
          <input
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            placeholder="كلمة المرور"
            className="w-full rounded-2xl border-2 border-input px-4 py-3 text-lg outline-none focus:border-brand"
          />
          {err && <p className="text-rose-600 text-sm mt-2 font-bold">{err}</p>}
          <button
            onClick={login}
            className="mt-4 w-full rounded-2xl bg-gradient-magic text-white font-black py-3 shadow-pop"
          >
            دخول
          </button>
          <Link to="/" className="mt-4 block text-center text-sm text-muted-foreground hover:text-foreground">
            ← عودة للعبة
          </Link>
        </div>
      </div>
    );
  }

  const list = Object.values(players).sort((a, b) => b.lastActive - a.lastActive);
  const p = selected ? players[selected] : null;

  return (
    <div className="min-h-screen">
      <header className="bg-gradient-magic text-white shadow-pop">
        <div className="mx-auto max-w-6xl px-4 py-5 flex items-center justify-between">
          <h1 className="text-2xl font-black">👩‍🏫 لوحة المعلمة</h1>
          <Link to="/" className="rounded-2xl bg-white/20 hover:bg-white/30 px-4 py-2 text-sm font-bold">
            ← اللعبة
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <aside className="md:col-span-1 rounded-3xl bg-white shadow-pop p-5">
          <h2 className="font-black mb-3">👨‍🎓 الطلاب ({list.length})</h2>
          {list.length === 0 && (
            <p className="text-sm text-muted-foreground">لا يوجد لاعبون بعد.</p>
          )}
          <div className="space-y-2 max-h-[50vh] overflow-auto">
            {list.map((pl) => {
              const total = WORLDS.reduce((s, w) => s + w.questions.length, 0);
              const answered = Object.values(pl.perWorld).reduce(
                (s, w) => s + w.answered.length,
                0,
              );
              const pct = total ? Math.round((answered / total) * 100) : 0;
              return (
                <button
                  key={pl.name}
                  onClick={() => setSelected(pl.name)}
                  className={`w-full text-right rounded-2xl px-4 py-3 font-bold transition-colors ${
                    selected === pl.name ? "bg-gradient-sun" : "bg-secondary hover:bg-accent"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{pl.name}</span>
                    <span className="text-sm">{pct}%</span>
                  </div>
                  <div className="text-xs opacity-70 mt-1">
                    🎖️ {pl.badges.length} • ⭐ {Object.values(pl.stars).reduce((s, n) => s + n, 0)}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t">
            <h3 className="font-bold text-sm mb-2">🔑 تغيير كلمة المرور</h3>
            <input
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              placeholder="كلمة مرور جديدة"
              className="w-full rounded-xl border-2 border-input px-3 py-2 text-sm"
            />
            <button
              onClick={() => {
                if (newPwd.length >= 3) {
                  setTeacherPwd(newPwd);
                  setNewPwd("");
                  alert("تم التحديث");
                }
              }}
              className="mt-2 w-full rounded-xl bg-brand text-white font-bold py-2 text-sm"
            >
              حفظ
            </button>
          </div>
        </aside>

        <section className="md:col-span-2 rounded-3xl bg-white shadow-pop p-6">
          {!p ? (
            <p className="text-center text-muted-foreground py-12">
              اختاري طالبًا/طالبة لعرض التقرير التفصيلي
            </p>
          ) : (
            <PlayerReport p={p} onExport={() => exportCSV(p)} />
          )}
        </section>
      </main>
    </div>
  );
}

function PlayerReport({ p, onExport }: { p: PlayerProgress; onExport: () => void }) {
  const total = WORLDS.reduce((s, w) => s + w.questions.length, 0);
  const answered = Object.values(p.perWorld).reduce((s, w) => s + w.answered.length, 0);
  const correctTotal = Object.values(p.perWorld).reduce((s, w) => s + w.correct, 0);
  const pct = total ? Math.round((answered / total) * 100) : 0;
  const acc = answered ? Math.round((correctTotal / answered) * 100) : 0;
  const recs = useMemo(() => getRecommendations(p), [p]);
  const totalStars = Object.values(p.stars).reduce((s, n) => s + n, 0);

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
        <div>
          <h2 className="text-2xl font-black">{p.name}</h2>
          <p className="text-sm text-muted-foreground">
            آخر نشاط: {new Date(p.lastActive).toLocaleString("ar-SA")}
          </p>
        </div>
        <button
          onClick={onExport}
          className="rounded-2xl bg-gradient-sun text-brand-foreground px-4 py-2 font-bold shadow-pop"
        >
          📥 تصدير CSV
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat label="نسبة الإنجاز" value={`${pct}%`} color="text-brand" />
        <Stat label="نسبة الصواب" value={`${acc}%`} color="text-emerald-600" />
        <Stat label="مجموع النجوم" value={`⭐ ${totalStars}`} color="text-amber-500" />
        <Stat label="الشارات" value={`🎖️ ${p.badges.length}`} color="text-fuchsia-600" />
      </div>

      <h3 className="font-black mb-2">📍 التقدم في العوالم</h3>
      <div className="space-y-2 mb-6">
        {WORLDS.map((w) => {
          const wp = p.perWorld[w.id];
          const a = wp?.answered.length || 0;
          const pp = wp ? Math.round((a / wp.total) * 100) : 0;
          const stars = p.stars[w.id] || 0;
          return (
            <div key={w.id} className="rounded-2xl bg-secondary p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold">
                  {w.emoji} {w.name}
                </span>
                <span className="text-sm">
                  {"★".repeat(stars)}
                  <span className="text-gray-300">{"★".repeat(3 - stars)}</span> · {pp}%
                </span>
              </div>
              <div className="h-2 bg-white rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${w.gradient}`} style={{ width: `${pp}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <h3 className="font-black mb-2">🧠 إحصاء المهارات</h3>
      <div className="overflow-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary text-right">
              <th className="p-2">المهارة</th>
              <th className="p-2">محاولات</th>
              <th className="p-2">صحيحة</th>
              <th className="p-2">خاطئة</th>
              <th className="p-2">متوسط الزمن</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(p.skillStats).map(([s, st]) => (
              <tr key={s} className="border-b">
                <td className="p-2 font-bold">{s}</td>
                <td className="p-2">{st.attempts}</td>
                <td className="p-2 text-emerald-700">{st.correct}</td>
                <td className="p-2 text-rose-700">{st.wrong}</td>
                <td className="p-2">{(st.totalTimeMs / st.attempts / 1000).toFixed(1)}ث</td>
              </tr>
            ))}
            {Object.keys(p.skillStats).length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-muted-foreground p-4">
                  لا توجد بيانات بعد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h3 className="font-black mb-2">💡 توصيات تلقائية</h3>
      <ul className="list-disc pr-5 space-y-1 mb-6">
        {recs.map((r, i) => (
          <li key={i} className="text-sm">{r}</li>
        ))}
      </ul>

      {p.wrongQuestions.length > 0 && (
        <>
          <h3 className="font-black mb-2">❗ أسئلة أخطأ فيها</h3>
          <div className="space-y-2 max-h-64 overflow-auto">
            {p.wrongQuestions.slice(-10).reverse().map((w, i) => (
              <div key={i} className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm">
                <div className="font-bold">{w.prompt}</div>
                <div className="text-rose-700">إجابته: {w.chosen}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-2xl bg-secondary p-4 text-center">
      <div className={`text-2xl font-black ${color}`}>{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
