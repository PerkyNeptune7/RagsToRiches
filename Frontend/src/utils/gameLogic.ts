// Place this in src/utils/gameLogic.ts or at the top of GameBoard.tsx

import { Choice } from "@/types/game";

// 1. Convert Symbols (++, --) to Numbers for the formula
export const parseSymbol = (val?: string | number): number => {
  if (val === undefined || val === null) return 0;
  const strVal = typeof val === 'number' ? val.toString() : val;
  if (strVal.includes('+++')) return 3;
  if (strVal.includes('++')) return 2;
  if (strVal.includes('+')) return 1;
  if (strVal.includes('---')) return -2; // High penalty
  if (strVal.includes('--')) return -1;
  if (strVal.includes('-')) return 0;    // Matches your Java '0' logic
  return 0;
};

// 2. Extract Cash Amount (e.g. "-$500" -> -500)
export const parseCash = (val?: string | number): number => {
  if (!val) return 0;
  const strVal = typeof val === 'number' ? val.toString() : val;
  const match = strVal.match(/[-+]?\d+/);
  return match ? parseInt(match[0]) : 0;
};

// 3. The "Clean Summary" you requested
export const getCleanSummary = (effect: Choice['effect']) => {
  const parts = [];

  // Format Money
  const cash = parseCash(effect.money);
  if (cash !== 0) parts.push(cash > 0 ? `+$${cash}` : `-$${Math.abs(cash)}`);

  // Format Happiness
  const hap = parseSymbol(effect.happiness);
  if (hap > 0) parts.push("😊 Happiness +");
  if (hap < 0) parts.push("😞 Happiness -");

  // Format Knowledge
  const knw = parseSymbol(effect.financeKnowledge);
  if (knw > 0) parts.push("🧠 Knowledge +");

  return parts.length > 0 ? parts.join(" • ") : "No immediate effect";
};

// 4. The Formula (Matches Java Backend)
export const calculateTurnScore = (effect: Choice['effect']) => {
  const pflMult = parseSymbol(effect.financeKnowledge);
  const hapMult = parseSymbol(effect.happiness);
  const monMult = parseSymbol(effect.money); // Symbol multiplier, not cash

  // Formula: 8xPFL + 4xHap + 6xMoney
  return (8 * pflMult) + (4 * hapMult) + (6 * monMult);
};