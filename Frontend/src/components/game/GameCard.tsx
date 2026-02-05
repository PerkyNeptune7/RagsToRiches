import { useState } from 'react';
import { Choice } from '@/types/game';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { parseCash, parseSymbol } from '@/utils/gameLogic'; // Import your helpers
import React from 'react';

interface GameCardProps {
  choice: Choice;
  onClick?: (choice: Choice) => void;
  disabled?: boolean;
  index?: number;
  subtitle?: string;
}

type CardCategory = 'income' | 'expense' | 'savings' | 'investment';

const categoryStyles: Record<CardCategory, { border: string; glow: string; bg: string; text: string }> = {
  income: {
    border: 'border-green-500',
    glow: 'shadow-[0_0_20px_rgba(34,197,94,0.5)]',
    bg: 'from-green-500/20 to-green-500/5',
    text: 'text-green-600',
  },
  expense: {
    border: 'border-red-500',
    glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]',
    bg: 'from-red-500/20 to-red-500/5',
    text: 'text-red-500',
  },
  savings: {
    border: 'border-blue-400',
    glow: 'shadow-[0_0_20px_rgba(96,165,250,0.5)]',
    bg: 'from-blue-400/20 to-blue-400/5',
    text: 'text-blue-500',
  },
  investment: {
    border: 'border-purple-500',
    glow: 'shadow-[0_0_20px_rgba(168,85,247,0.5)]',
    bg: 'from-purple-500/20 to-purple-500/5',
    text: 'text-purple-500',
  },
};

export const GameCard = ({ choice, onClick, disabled, subtitle, index = 0 }: GameCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Helper to determine visuals based on stats
  const analyzeChoice = (c: Choice) => {
    // 1. FIX: Parse strings to numbers before doing math
    const moneyVal = parseCash(c.effect.money);
    const financeVal = parseSymbol(c.effect.financeKnowledge);

    let category: CardCategory = 'savings';
    let icon = '🛡️';
    let rarity = 'common';

    if (moneyVal < 0) {
      category = 'expense';
      icon = '💸';
    } else if (moneyVal > 0) {
      category = 'income';
      icon = '💰';
    } else if (financeVal > 0) {
      category = 'investment';
      icon = '🧠';
    }

    // Calculate total impact for rarity
    const totalImpact = Math.abs(moneyVal) + (financeVal * 50); // Weighted knowledge

    if (totalImpact > 1000) rarity = 'legendary';
    else if (totalImpact > 500) rarity = 'epic';
    else if (totalImpact > 200) rarity = 'rare';

    return { category, icon, rarity };
  };

  const { category, icon, rarity } = analyzeChoice(choice);
  const styles = categoryStyles[category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: 45 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, type: 'spring', stiffness: 100 }}
      className="perspective-1000"
    >
      <motion.button // Changed to button for semantics
        whileHover={{
          scale: 1.05,
          y: -15,
          rotateY: 5,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => !disabled && onClick?.(choice)}
        disabled={disabled} // Native disable
        className={cn(
          'relative w-44 h-64 md:w-48 md:h-80 rounded-xl cursor-pointer preserve-3d transition-all duration-300 border-2 bg-card text-left flex flex-col',
          styles.border,
          isHovered && styles.glow,
          disabled && 'opacity-50 cursor-not-allowed grayscale'
        )}
      >
        {/* Background Gradient */}
        <div className={cn(
          'absolute inset-0 rounded-xl bg-gradient-to-b',
          styles.bg
        )}>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/10 to-transparent opacity-50" />
        </div>

        {/* Content Container */}
        <div className="relative h-full flex flex-col p-4 w-full z-10">

          {/* Top Badge */}
          <div className="flex justify-between items-start mb-2">
            <span className={cn(
              'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/20 text-foreground',
            )}>
              {category}
            </span>
            {rarity !== 'common' && <span className="text-xs animate-pulse">⭐</span>}
          </div>

          {/* Icon Area */}
          <div className="flex-none flex items-center justify-center py-6">
            <motion.span
              className="text-5xl md:text-6xl drop-shadow-md select-none"
              animate={isHovered ? { scale: 1.2, rotate: [0, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              {icon}
            </motion.span>
          </div>

          {/* Text Content */}
          <div className="flex-1 flex flex-col justify-end text-center space-y-3 mt-auto">
            <h3 className="font-display text-sm leading-snug font-bold text-foreground break-words line-clamp-3">
              {choice.text}
            </h3>

            {/* 2. FIX: Display the subtitle (Clean Summary) clearly */}
            {subtitle ? (
              <span className={cn(
                "text-xs font-bold px-2 py-1.5 rounded bg-background/80 backdrop-blur-sm border border-border shadow-sm",
                styles.text // Colors the text based on category (Green for income, Red for expense)
              )}>
                {subtitle}
              </span>
            ) : (
              // Fallback skeleton if subtitle is missing
              <div className="h-6 w-full bg-white/10 rounded animate-pulse" />
            )}
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
};