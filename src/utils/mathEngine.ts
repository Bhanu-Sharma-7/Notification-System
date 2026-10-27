export type OperationType = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed';

export type AdvancedCategory =
  | 'trigonometry'
  | 'squares'
  | 'cubes'
  | 'percentages'
  | 'roots';

export type QuestionCategory = 'arithmetic' | 'advanced';

export interface MathQuestion {
  id: string;
  category: QuestionCategory;
  question: string;
  correctAnswer: string | number;
  options: (string | number)[];
  explanation?: string;
}

export interface ArithmeticConfig {
  operation?: OperationType;
  digits?: number; // 1 = 1-9, 2 = 10-99, 3 = 100-999, etc.
  rows?: number; // Number of terms (e.g. 2 for "A + B", 3 for "A + B + C")
  allowNegative?: boolean;
}

// ---------------------------------------------------------------------------
// 🎲 Helper Functions
// ---------------------------------------------------------------------------

export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getNumberByDigits = (digits: number): number => {
  const min = digits === 1 ? 1 : Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return getRandomInt(min, max);
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// ---------------------------------------------------------------------------
// 🎯 Smart Distractor Generator
// ---------------------------------------------------------------------------

export const generateNumericOptions = (
  correctAnswer: number,
  count = 4
): number[] => {
  const options = new Set<number>();
  options.add(correctAnswer);

  const deltas = [1, -1, 2, -2, 5, -5, 10, -10, 3, -3, 4, -4];
  const shuffledDeltas = shuffleArray(deltas);

  // Attempt plausible near-misses first
  for (const delta of shuffledDeltas) {
    if (options.size >= count) break;
    const candidate = correctAnswer + delta;
    if (candidate >= 0 || correctAnswer < 0) {
      options.add(candidate);
    }
  }

  // Fallback random generation if not enough unique options
  let attempts = 0;
  while (options.size < count && attempts < 50) {
    attempts++;
    const variance = Math.max(3, Math.round(Math.abs(correctAnswer) * 0.2));
    const randomOffset = getRandomInt(-variance, variance);
    const candidate = correctAnswer + randomOffset;
    if (candidate !== correctAnswer && (candidate >= 0 || correctAnswer < 0)) {
      options.add(candidate);
    }
  }

  // Absolute fallback in case of 0 or small domain
  let filler = 1;
  while (options.size < count) {
    options.add(correctAnswer + filler);
    filler++;
  }

  return shuffleArray(Array.from(options));
};

// ---------------------------------------------------------------------------
// ➕ Arithmetic Question Generator
// ---------------------------------------------------------------------------

export const generateArithmeticQuestion = (config: ArithmeticConfig = {}): MathQuestion => {
  const {
    operation = 'addition',
    digits = 2,
    rows = 2,
    allowNegative = false,
  } = config;

  let activeOp = operation;
  if (activeOp === 'mixed') {
    const ops: OperationType[] = ['addition', 'subtraction', 'multiplication', 'division'];
    activeOp = ops[getRandomInt(0, ops.length - 1)];
  }

  const id = `arithmetic_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  if (activeOp === 'addition') {
    const termCount = Math.max(2, rows);
    const terms: number[] = [];
    for (let i = 0; i < termCount; i++) {
      terms.push(getNumberByDigits(digits));
    }
    const correctAnswer = terms.reduce((acc, curr) => acc + curr, 0);
    const question = terms.join(' + ');

    return {
      id,
      category: 'arithmetic',
      question,
      correctAnswer,
      options: generateNumericOptions(correctAnswer),
      explanation: `${question} = ${correctAnswer}`,
    };
  }

  if (activeOp === 'subtraction') {
    let a = getNumberByDigits(digits);
    let b = getNumberByDigits(digits);

    if (!allowNegative && a < b) {
      [a, b] = [b, a]; // Swap so result is non-negative
    }

    const correctAnswer = a - b;
    const question = `${a} - ${b}`;

    return {
      id,
      category: 'arithmetic',
      question,
      correctAnswer,
      options: generateNumericOptions(correctAnswer),
      explanation: `${a} - ${b} = ${correctAnswer}`,
    };
  }

  if (activeOp === 'multiplication') {
    // Keep multiplication digits within reasonable mental math bounds
    const d1 = Math.min(digits, 2);
    const d2 = digits >= 3 ? 1 : Math.min(digits, 2);

    const a = getNumberByDigits(d1);
    const b = getNumberByDigits(d2);
    const correctAnswer = a * b;
    const question = `${a} × ${b}`;

    return {
      id,
      category: 'arithmetic',
      question,
      correctAnswer,
      options: generateNumericOptions(correctAnswer),
      explanation: `${a} × ${b} = ${correctAnswer}`,
    };
  }

  // Division: Guarantee clean whole-number results without decimals
  const divisor = getNumberByDigits(Math.min(digits, 2));
  const quotient = getNumberByDigits(Math.min(digits, 2));
  const dividend = divisor * quotient;
  const question = `${dividend} ÷ ${divisor}`;

  return {
    id,
    category: 'arithmetic',
    question,
    correctAnswer: quotient,
    options: generateNumericOptions(quotient),
    explanation: `${dividend} ÷ ${divisor} = ${quotient}`,
  };
};

// ---------------------------------------------------------------------------
// 📐 Advanced & Formula Question Generator
// ---------------------------------------------------------------------------

interface FormulaItem {
  question: string;
  correctAnswer: string | number;
  options: (string | number)[];
  explanation: string;
}

const TRIGONOMETRY_POOL: FormulaItem[] = [
  {
    question: 'sin²(θ) + cos²(θ) = ?',
    correctAnswer: '1',
    options: ['1', '0', '2', 'tan²(θ)'],
    explanation: 'Fundamental Pythagorean identity: sin²(θ) + cos²(θ) = 1',
  },
  {
    question: 'sec²(θ) - tan²(θ) = ?',
    correctAnswer: '1',
    options: ['1', '0', '-1', 'cos²(θ)'],
    explanation: 'Identity: 1 + tan²(θ) = sec²(θ) => sec²(θ) - tan²(θ) = 1',
  },
  {
    question: 'tan(45°) = ?',
    correctAnswer: '1',
    options: ['1', '0', '√3', '1/√3'],
    explanation: 'tan(45°) = sin(45°) / cos(45°) = 1',
  },
  {
    question: 'sin(90°) = ?',
    correctAnswer: '1',
    options: ['1', '0', '-1', '1/2'],
    explanation: 'sin(90°) is at the peak of the unit circle = 1',
  },
  {
    question: 'cos(0°) = ?',
    correctAnswer: '1',
    options: ['1', '0', '-1', '√3/2'],
    explanation: 'cos(0°) = 1 on the unit circle x-axis',
  },
  {
    question: 'sin(30°) = ?',
    correctAnswer: '1/2',
    options: ['1/2', '√3/2', '1', '1/√2'],
    explanation: 'sin(30°) is equal to 0.5 or 1/2',
  },
  {
    question: 'cos(60°) = ?',
    correctAnswer: '1/2',
    options: ['1/2', '√3/2', '0', '1/√2'],
    explanation: 'cos(60°) = sin(30°) = 1/2',
  },
  {
    question: 'tan(0°) = ?',
    correctAnswer: '0',
    options: ['0', '1', 'Undefined', '∞'],
    explanation: 'tan(0°) = sin(0°) / cos(0°) = 0 / 1 = 0',
  },
];

export const generateAdvancedQuestion = (category?: AdvancedCategory): MathQuestion => {
  const poolCategories: AdvancedCategory[] = [
    'trigonometry',
    'squares',
    'cubes',
    'percentages',
    'roots',
  ];
  const activeCategory = category ?? poolCategories[getRandomInt(0, poolCategories.length - 1)];
  const id = `advanced_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  if (activeCategory === 'trigonometry') {
    const item = TRIGONOMETRY_POOL[getRandomInt(0, TRIGONOMETRY_POOL.length - 1)];
    return {
      id,
      category: 'advanced',
      question: item.question,
      correctAnswer: item.correctAnswer,
      options: shuffleArray(item.options),
      explanation: item.explanation,
    };
  }

  if (activeCategory === 'squares') {
    const base = getRandomInt(11, 35);
    const answer = base * base;
    const question = `${base}² = ?`;
    return {
      id,
      category: 'advanced',
      question,
      correctAnswer: answer,
      options: generateNumericOptions(answer),
      explanation: `${base} × ${base} = ${answer}`,
    };
  }

  if (activeCategory === 'roots') {
    const root = getRandomInt(6, 30);
    const square = root * root;
    const question = `√${square} = ?`;
    return {
      id,
      category: 'advanced',
      question,
      correctAnswer: root,
      options: generateNumericOptions(root),
      explanation: `Since ${root}² = ${square}, √${square} = ${root}`,
    };
  }

  if (activeCategory === 'cubes') {
    const base = getRandomInt(3, 15);
    const answer = base * base * base;
    const question = `${base}³ = ?`;
    return {
      id,
      category: 'advanced',
      question,
      correctAnswer: answer,
      options: generateNumericOptions(answer),
      explanation: `${base} × ${base} × ${base} = ${answer}`,
    };
  }

  // Percentages (clean numbers)
  const percentChoices = [10, 15, 20, 25, 30, 40, 50, 75];
  const percent = percentChoices[getRandomInt(0, percentChoices.length - 1)];
  const multiplier = getRandomInt(2, 20);
  const baseValue = multiplier * (percent === 15 || percent === 75 ? 40 : 20);
  const answer = Math.round((percent / 100) * baseValue);
  const question = `${percent}% of ${baseValue} = ?`;

  return {
    id,
    category: 'advanced',
    question,
    correctAnswer: answer,
    options: generateNumericOptions(answer),
    explanation: `(${percent} / 100) × ${baseValue} = ${answer}`,
  };
};

export default {
  generateArithmeticQuestion,
  generateAdvancedQuestion,
  generateNumericOptions,
};
