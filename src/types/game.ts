export type CardCategory = 'income' | 'expense' | 'savings' | 'investment';

export interface BudgetCard {
  id: string;
  name: string;
  category: CardCategory;
  amount: number;
  description: string;
  effect: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface GameState {
  budget: number;
  score: number;
  round: number;
  maxRounds: number;
  currentCards: BudgetCard[];
  playedCards: BudgetCard[];
  savings: number;
  investments: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

export interface PlayerStats {
  totalGamesPlayed: number;
  highScore: number;
  cardsPlayed: number;
  bestStreak: number;
}
