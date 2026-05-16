export type QuestionType = "mcq" | "tf";
export type Level = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  type: QuestionType;
  level: Level;
  skill: string;
  prompt: string;
  options?: string[];
  answer: string | number;
  hint: string;
  explain: string;
}

export interface World {
  id: string;
  name: string;
  emoji: string;
  gradient: string;
  badge: string;
  desc: string;
  questions: Question[];
}

const q = (
  id: string, type: QuestionType, level: Level, skill: string, prompt: string,
  answer: string | number, hint: string, explain: string, options?: string[],
): Question => ({ id, type, level, skill, prompt, options, answer, hint, explain });

export const SESSION_SIZE = 8;

export const PRAISES = [
  "كفو يا بطل!",
  "يا سلام عليك!",
  "إجابتك رهيبة!",
  "أبدعت يا نجم!",
  "واضح إنك فاهمها صح!",
  "ما شاء الله عليك!",
];

const NUMBERS: Question[] = [
  q("n1","mcq","easy","قراءة الأعداد","ما الصورة اللفظية للعدد 2347؟","ألفان وثلاثمئة وسبعة وأربعون","اقرأ كل منزلة","2 ألف + 3 مئة + 4 عشرات + 7 آحاد",["ألفان وثلاثمئة وسبعة وأربعون","ألفان وأربعمئة وسبعة وثلاثون","ثلاثة آلاف ومئتان وسبعة وأربعون","ألفان وثلاثمئة وأربعة وسبعون"]),
  q("n2","mcq","easy","القيمة المنزلية","القيمة المنزلية للرقم 5 في 4512؟","500","موقع الرقم","الرقم 5 في منزلة المئات",["5","50","500","5000"]),
  q("n3","mcq","medium","المقارنة","أيّ إشارة تجعل العبارة صحيحة: 3214 __ 3241؟","<","قارن من اليسار","العشرات 1 < 4",["<",">","="]),
  q("n4","mcq","medium","الترتيب التصاعدي","رتّب تصاعديًا: 1205 ، 1502 ، 1250 ، 1052","1052، 1205، 1250، 1502","ابدأ بالأصغر","1052<1205<1250<1502",["1052، 1205، 1250، 1502","1205، 1052، 1250، 1502","1502، 1250، 1205، 1052","1052، 1250، 1205، 1502"]),
  q("n5","mcq","hard","التقريب لأقرب مئة","قرّب 3478 إلى أقرب مئة.","3500","انظر للعشرات","7 ≥ 5 فلأعلى",["3400","3500","3480","3000"]),
  q("n6","mcq","easy","القيمة المنزلية","القيمة المنزلية للرقم 8 في 2853؟","مئات","حدد موقع 8","8 في المئات",["آحاد","عشرات","مئات","آحاد الألوف"]),
  q("n7","mcq","medium","التقريب لأقرب عشرة","قرّب 1023 إلى أقرب عشرة.","1020","انظر للآحاد","3 < 5 فلأسفل",["1020","1025","1030","1100"]),
  q("n8","mcq","medium","الصورة التحليلية","العدد بصيغة 3000+600+30+5 هو:","3635","اجمع المنازل","3635",["3536","5363","3635","5336"]),
  q("n9","mcq","medium","الصورة اللفظية","الصورة اللفظية للعدد 3762:","ثلاثة آلاف
