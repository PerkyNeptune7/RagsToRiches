import { motion } from 'framer-motion';
import { Play, BookOpen, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  onNavigate: (page: 'play' | 'learn' | 'cards') => void;
}

export const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-savings/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-investment/5 rounded-full blur-3xl" />
      </div>

      {/* Floating cards decoration */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [-5, 5, -5] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-20 left-[10%] text-6xl opacity-20"
      >
        💰
      </motion.div>
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [5, -5, 5] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        className="absolute top-40 right-[15%] text-5xl opacity-20"
      >
        📊
      </motion.div>
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [-3, 3, -3] }}
        transition={{ duration: 7, repeat: Infinity, delay: 2 }}
        className="absolute bottom-40 left-[20%] text-5xl opacity-20"
      >
        🏦
      </motion.div>
      <motion.div
        animate={{ y: [0, 15, 0], rotate: [3, -3, 3] }}
        transition={{ duration: 5.5, repeat: Infinity, delay: 0.5 }}
        className="absolute bottom-32 right-[10%] text-6xl opacity-20"
      >
        💳
      </motion.div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative text-center z-10"
      >
        {/* Logo/Title */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="font-display text-5xl md:text-7xl mb-4 text-gradient-gold">
            Budget Quest
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-2">
            Master Your Money
          </p>
          <p className="text-sm text-muted-foreground/70 max-w-md mx-auto mb-12">
            A card game that teaches financial literacy through strategic decision-making
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <GameButton
            onClick={() => onNavigate('play')}
            variant="primary"
            icon={<Play className="w-5 h-5" />}
          >
            Start Game
          </GameButton>
          <GameButton
            onClick={() => onNavigate('learn')}
            variant="secondary"
            icon={<BookOpen className="w-5 h-5" />}
          >
            Learn Budgeting
          </GameButton>
          <GameButton
            onClick={() => onNavigate('cards')}
            variant="ghost"
            icon={<Layers className="w-5 h-5" />}
          >
            View Cards
          </GameButton>
        </motion.div>
      </motion.div>

      {/* Bottom decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 text-center"
      >
        <p className="text-xs text-muted-foreground/50">
          💡 Tip: Hover over cards to see their magical effects!
        </p>
      </motion.div>
    </div>
  );
};

interface GameButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant: 'primary' | 'secondary' | 'ghost';
  icon?: React.ReactNode;
}

const GameButton = ({ children, onClick, variant, icon }: GameButtonProps) => (
  <motion.button
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={cn(
      'inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all',
      variant === 'primary' && [
        'bg-gradient-to-r from-primary via-primary to-investment',
        'text-primary-foreground',
        'shadow-lg shadow-primary/30',
        'hover:shadow-xl hover:shadow-primary/40',
      ],
      variant === 'secondary' && [
        'bg-secondary border-2 border-primary/30',
        'text-foreground',
        'hover:border-primary/50 hover:bg-secondary/80',
      ],
      variant === 'ghost' && [
        'bg-transparent border border-border',
        'text-muted-foreground',
        'hover:text-foreground hover:border-foreground/30',
      ]
    )}
  >
    {icon}
    {children}
  </motion.button>
);
