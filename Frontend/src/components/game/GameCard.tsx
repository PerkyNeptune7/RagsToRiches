import { useState } from 'react';
import { Choice } from '@/types/game';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React from 'react';

interface GameCardProps {
  choice: Choice;
  onClick?: (choice: Choice) => void;
  disabled?: boolean;
  index?: number;
}

type CardCategory = 'income' | 'expense' | 'savings' | 'investment';

const categoryStyles: Record<CardCategory, { border: string; glow: string; bg: string }> = {
  income: {
    border: 'border-green-500',
    glow: 'shadow-[0_0_20px_rgba(34,197,94,0.5)]',
    bg: 'from-green-500/20 to-green-500/5',
  },
  expense: {
    border: 'border-red-500',
    glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]',
    bg: 'from-red-500/20 to-red-500/5',
  },
  savings: {
    border: 'border-blue-400',
    glow: 'shadow-[0_0_20px_rgba(96,165,250,0.5)]',
    bg: 'from-blue-400/20 to-blue-400/5',
  },
  investment: {
    border: 'border-purple-500',
    glow: 'shadow-[0_0_20px_rgba(168,85,247,0.5)]',
    bg: 'from-purple-500/20 to-purple-500/5',
  },
};

export const GameCard = ({ choice, onClick, disabled, index = 0 }: GameCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Helper to determine visuals based on stats
  const analyzeChoice = (c: Choice) => {
    const { money, financeKnowledge } = c.effect;

    let category: CardCategory = 'savings';
    let icon = '🛡️';
    let rarity = 'common';

    if (money < 0) {
      category = 'expense';
      icon = '💸';
    } else if (money > 0) {
      category = 'income';
      icon = '💰';
    } else if (financeKnowledge > 10) {
      category = 'investment';
      icon = '🧠';
    }

    const totalImpact = Math.abs(money) + (financeKnowledge * 10);
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
      <motion.div
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
        className={cn(
          'relative w-44 h-64 md:w-48 md:h-80 rounded-xl cursor-pointer preserve-3d transition-all duration-300 border-2 bg-card',
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
        <div className="relative h-full flex flex-col p-4">

          {/* Top Badge */}
          <div className="flex justify-between items-start mb-2">
            <span className={cn(
              'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/20',
            )}>
              {category}
            </span>
            {rarity !== 'common' && <span className="text-xs">⭐</span>}
          </div>

          {/* Icon Area */}
          <div className="flex-none flex items-center justify-center py-4">
            <motion.span
              className="text-5xl md:text-6xl drop-shadow-md"
              animate={isHovered ? { scale: 1.2, rotate: [0, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              {icon}
            </motion.span>
          </div>

          {/* Text Content - FIXED VISIBILITY */}
          <div className="flex-1 flex flex-col justify-end text-center space-y-2">
            <h3 className="font-display text-sm leading-tight font-bold text-foreground break-words">
              {choice.text}
            </h3>

            {/* Stats Preview */}
            <div className="flex justify-center gap-2 text-xs font-mono font-bold opacity-80 pt-2 border-t border-white/10">
              {choice.effect.money !== 0 && (
                <span className={choice.effect.money > 0 ? "text-green-600" : "text-red-500"}>
                  {choice.effect.money > 0 ? '+' : ''}${choice.effect.money}
                </span>
              )}
              {choice.effect.financeKnowledge > 0 && (
                <span className="text-blue-500">+{choice.effect.financeKnowledge}XP</span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};