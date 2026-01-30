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

// Character System Types
export type CharacterOutfit = 'default' | 'business' | 'casual' | 'fancy' | 'sporty' | 'student';
export type CharacterHouse = 'apartment' | 'house' | 'mansion' | 'penthouse' | 'cottage';
export type CharacterAccessory = 'none' | 'glasses' | 'hat' | 'watch' | 'briefcase' | 'backpack';
export type CharacterSkinColor = 'light' | 'medium' | 'tan' | 'dark';

export interface CustomizationItem {
  id: string;
  name: string;
  type: 'outfit' | 'house' | 'accessory';
  value: CharacterOutfit | CharacterHouse | CharacterAccessory;
  cost: number;
  icon: string;
  description: string;
  unlocked: boolean;
}

export interface PlayerCharacter {
  name: string;
  outfit: CharacterOutfit;
  house: CharacterHouse;
  accessory: CharacterAccessory;
  skinColor: CharacterSkinColor;
  level: number;
  totalPoints: number;
  unlockedItems: string[];
}

export interface EvilCharacter {
  name: string;
  type: 'debt_monster' | 'impulse_demon' | 'scam_spirit';
  power: number;
  icon: string;
  taunt: string;
}
