// src/types/game.ts

export const API_URL = "http://localhost:8080/api";

// ==========================================
// 1. SHOP & ITEM TYPES (NEW)
// ==========================================

export interface GameItem {
  id: string;          // "business_suit", "red_cap"
  name: string;
  type: 'outfit' | 'hat' | 'glasses' | 'accessory';
  price: number;
  knowledgeReq: number; // Min knowledge needed to buy
  description: string;
}

// ==========================================
// 2. BACKEND INTEGRATION TYPES
// (Matches your Java User & Card Models)
// ==========================================

export interface BackendStats {
  money: number;
  happiness: number;
  financeKnowledge: number;
}

export interface PlayerCharacter {
  id: string;
  name: string;
  
  // MATCHES JAVA "Appearance" CLASS NESTING
  appearance: {
    outfit: string;    // "default", "business_suit"
    hat: string;       // "none", "red_cap"
    glasses: string;   // "none", "shades"
    accessory: string; // "none", "gold_chain"
    extraDetail?: string; // Optional field from your User.java
  };

  // MATCHES JAVA "User" FIELDS
  inventory: string[]; // List of IDs ["default_outfit", "red_cap"]
  
  stats: BackendStats;
  overallScore?: number;
}

export interface Effect {
  money: number;
  happiness: number;
  financeKnowledge: number;
}

export interface Choice {
  text: string;
  effect: Effect;
}

export interface SituationCard {
  _id: string; // MongoDB ID
  situationId: number;
  scenario: string;
  options: {
    text: string;
    effect: {
      money: string;
      happiness: string;
      financeKnowledge: string;
    };
  }[];
}

// ==========================================
// 2. EXISTING UI TYPES (Preserved)
// ==========================================

export type CardCategory = 'income' | 'expense' | 'savings' | 'investment';

// Kept for backward compatibility if your UI uses it
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
  // New Stats (Synced with Backend)
  stats: BackendStats; 
  
  // Legacy UI State (Keep these for animations/rounds)
  round: number;
  maxRounds: number;
  currentSituation: SituationCard | null; // The active card from DB
  
  // Optional: Keep these if your UI calculates monthly flows locally
  monthlyIncome: number;
  monthlyExpenses: number;
}

// ==========================================
// 3. CHARACTER SYSTEM (Merged)
// ==========================================

export interface EvilCharacter {
  name: string;
  type: 'debt_monster' | 'impulse_demon' | 'scam_spirit';
  power: number;
  icon: string;
  taunt: string;
}

// Legacy types (Keep if other components strictly require them, otherwise safe to remove)
export type CharacterOutfit = string; 
export type CharacterAccessory = string;
export interface GameState {
  stats: BackendStats;
  round: number;
  maxRounds: number;
  currentSituation: SituationCard | null;
}