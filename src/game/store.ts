import { WORLDS } from "./worlds";

export interface SkillStat {
  attempts: number;
  correct: number;
  wrong: number;
  totalTimeMs: number;
}

export interface PlayerProgress {
  name: string;
  createdAt: number;
  stars: Record<string, number>; // worldId -> stars (0..3)
  badges: string[]; // world ids whose badge earned
  perWorld: Record<string, { answered: string[]; correct: number; total: number }>;
  skillStats: Record<string, SkillStat>; // skill name -> stats
  wrongQuestions: { worldId: string; questionId: string; prompt: string; chosen: string }[];
  lastActive: number;
}

const KEY = "nafis_players_v1";
const CURRENT = "nafis_current_player";
const TEACHER_PWD_KEY = "nafis_teacher_pwd";
export const DEFAULT_TEACHER_PWD = "1234";

export function getTeacherPwd(): string {
  if (typeof window === "undefined") return DEFAULT_TEACHER_PWD;
  return localStorage.getItem(TEACHER_PWD_KEY) || DEFAULT_TEACHER_PWD;
}

export function setTeacherPwd(p: string) {
  localStorage.setItem(TEACHER_PWD_KEY, p);
}

export function loadAll(): Record<string, PlayerProgress> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveAll(data: Record<string, PlayerProgress>) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getCurrentName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CURRENT);
}

export function setCurrentName(name: string) {
  localStorage.setItem(CURRENT, name);
}

export function getOrCreatePlayer(name: string): PlayerProgress {
  const all = loadAll();
  if (!all[name]) {
    all[name] = {
      name,
      createdAt: Date.now(),
      stars: {},
      badges: [],
      perWorld: {},
      skillStats: {},
      wrongQuestions: [],
      lastActive: Date.now(),
    };
    saveAll(all);
  }
  return all[name];
}

export function updatePlayer(name: string, mut: (p: PlayerProgress) => void) {
  const all = loadAll();
  const p = all[name] || getOrCreatePlayer(name);
  mut(p);
  p.lastActive = Date.now();
  all[name] = p;
  saveAll(all);
  return p;
}

export function recordAnswer(opts: {
  playerName: string;
  worldId: string;
  questionId: string;
  skill: string;
  prompt: string;
  chosen: string;
  correct: boolean;
  timeMs: number;
}) {
  return updatePlayer(opts.playerName, (p) => {
    const w = (p.perWorld[opts.worldId] ||= {
      answered: [],
      correct: 0,
      total: WORLDS.find((x) => x.id === opts.worldId)?.questions.length || 0,
    });
    if (!w.answered.includes(opts.questionId)) {
      w.answered.push(opts.questionId);
      if (opts.correct) w.correct++;
    }
    const s = (p.skillStats[opts.skill] ||= {
      attempts: 0,
      correct: 0,
      wrong: 0,
      totalTimeMs: 0,
    });
    s.attempts++;
    s.totalTimeMs += opts.timeMs;
    if (opts.correct) s.correct++;
    else {
      s.wrong++;
      p.wrongQuestions.push({
        worldId: opts.worldId,
        questionId: opts.questionId,
        prompt: opts.prompt,
        chosen: opts.chosen,
      });
      if (p.wrongQuestions.length > 50) p.wrongQuestions.shift();
    }
    // stars
    const ratio = w.total ? w.correct / w.total : 0;
    const stars = ratio >= 0.9 ? 3 : ratio >= 0.6 ? 2 : ratio >= 0.3 ? 1 : 0;
    p.stars[opts.worldId] = Math.max(p.stars[opts.worldId] || 0, stars);
    if (stars === 3 && !p.badges.includes(opts.worldId)) p.badges.push(opts.worldId);
  });
}

export function getRecommendations(p: PlayerProgress): string[] {
  const recs: string[] = [];
  for (const [skill, s] of Object.entries(p.skillStats)) {
    if (s.attempts < 2) continue;
    const ratio = s.correct / s.attempts;
    if (ratio < 0.5) recs.push(`يحتاج تدريبًا إضافيًا في: ${skill}`);
    else if (ratio >= 0.9) recs.push(`متقن لمهارة: ${skill}`);
  }
  if (!recs.length) recs.push("ابدأ بحل المزيد من الأسئلة لظهور التوصيات.");
  return recs;
}
