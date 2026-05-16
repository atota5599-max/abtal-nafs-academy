export type QuestionType = "mcq" | "tf";
export type Level = "easy" | "medium" | "hard";

export interface Question {
  id: string; type: QuestionType; level: Level; skill: string; prompt: string;
  options?: string[]; answer: string | number; hint: string; explain: string;
}

export interface World {
  id: string; name: string; emoji: string; gradient: string;
  badge: string; desc: string; questions: Question[];
}

const q = (
  id: string, type: QuestionType, level: Level, skill: string, prompt: string,
  answer: string | number, hint: string, explain: string, options?: string[],
): Question => ({ id, type, level, skill, prompt, options, answer, hint, explain });

export const SESSION_SIZE = 8;

export const PRAISES = [
  "كفو يا بطل!","يا سلام عليك!","إجابتك رهيبة!","أبدعت يا نجم!","واضح إنك فاهمها صح!","ما شاء الله عليك!",
];
