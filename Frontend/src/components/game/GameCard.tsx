import { useState } from 'react';
import { BudgetCard, CardCategory } from '@/types/game';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface GameCardProps {
  card: BudgetCard;
  onClick?: (card: BudgetCard) => void;
  disabled?: boolean;
  index?: number;
}

const categoryStyles: Record<CardCategory, { border: string; glow: string; bg: string }> = {
  income: {
    border: 'border-income',
    glow: 'card-glow-income',
    bg: 'from-income/20 to-income/5',
  },
  expense: {
    border: 'border-expense',
    glow: 'card-glow-expense',
    bg: 'from-expense/20 to-expense/5',
  },
  savings: {
    border: 'border-savings',
    glow: 'card-glow-savings',
    bg: 'from-savings/20 to-savings/5',
  },
  investment: {
    border: 'border-investment',
    glow: 'card-glow-investment',
    bg: 'from-investment/20 to-investment/5',
  },
};

const rarityStyles = {
  common: 'border-2',
  rare: 'border-2 ring-1 ring-savings/30',
  epic: 'border-3 ring-2 ring-primary/40',
  legendary: 'border-4 ring-2 ring-primary animate-pulse-glow',
};

export const GameCard = ({ card, onClick, disabled, index = 0 }: GameCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const styles = categoryStyles[card.category];

  const formatAmount = (amount: number) => {
    if (amount >= 0) return `+$${amount}`;
    return `-$${Math.abs(amount)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: 45 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, type: 'spring', stiffness: 100 }}
      className="perspective-1000"
    >
      <motion.div
        whileHover={{ 
          scale: 1.08, 
          y: -20,
          rotateY: 5,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => !disabled && onClick?.(card)}
        className={cn(
          'relative w-48 h-72 rounded-xl cursor-pointer preserve-3d transition-all duration-300',
          styles.border,
          rarityStyles[card.rarity],
          isHovered && styles.glow,
          disabled && 'opacity-50 cursor-not-allowed grayscale'
        )}
      >
        {/* Card Background */}
        <div className={cn(
          'absolute inset-0 rounded-xl bg-gradient-to-b',
          styles.bg,
          'bg-card'
        )}>
          {/* Shine effect */}
          <div className="absolute inset-0 rounded-xl bg-card-shine opacity-50" />
        </div>

        {/* Card Content */}
        <div className="relative h-full flex flex-col p-4">
          {/* Category Badge */}
          <div className="flex justify-between items-start mb-2">
            <span className={cn(
              'text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full',
              card.category === 'income' && 'bg-income/20 text-income',
              card.category === 'expense' && 'bg-expense/20 text-expense',
              card.category === 'savings' && 'bg-savings/20 text-savings',
              card.category === 'investment' && 'bg-investment/20 text-investment',
            )}>
              {card.category}
            </span>
            <span className="text-2xl">{card.icon}</span>
          </div>

          {/* Card Icon - Large */}
          <div className="flex-1 flex items-center justify-center">
            <motion.span 
              className="text-6xl"
              animate={isHovered ? { scale: 1.2, rotate: [0, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              {card.icon}
            </motion.span>
          </div>

          {/* Card Name */}
          <h3 className="font-display text-lg font-bold text-center mb-1 text-foreground">
            {card.name}
          </h3>

          {/* Amount */}
          <div className={cn(
            'text-center text-xl font-bold mb-2',
            card.amount >= 0 ? 'text-income' : 'text-expense'
          )}>
            {formatAmount(card.amount)}
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground text-center line-clamp-2">
            {card.description}
          </p>

          {/* Rarity indicator */}
          {card.rarity !== 'common' && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
              <div className={cn(
                'flex gap-1',
                card.rarity === 'rare' && 'text-savings',
                card.rarity === 'epic' && 'text-primary',
                card.rarity === 'legendary' && 'text-gradient-gold'
              )}>
                {card.rarity === 'rare' && '★'}
                {card.rarity === 'epic' && '★★'}
                {card.rarity === 'legendary' && '★★★'}
              </div>
            </div>
          )}
        </div>

        {/* Hover glow effect */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              'absolute inset-0 rounded-xl pointer-events-none',
              'bg-gradient-to-t from-transparent via-white/5 to-white/10'
            )}
          />
        )}
      </motion.div>
    </motion.div>
  );
};
