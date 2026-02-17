import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Play, BookOpen, Layers, ShoppingBag, Coins, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PlayerCharacter } from '@/types/game';
import { PlayerCharacterComponent } from './PlayerCharacter';

interface HeroSectionProps {
  onNavigate: (page: 'play' | 'learn' | 'shop' | 'leaderboard') => void;
  playerCharacter: PlayerCharacter;
}

export const HeroSection = ({ onNavigate, playerCharacter }: HeroSectionProps) => {
  // CRITICAL FIX: Safety check to prevent "undefined" crashes
  if (!playerCharacter) return null;

  // CRITICAL FIX: Use overallScore (Backend name) instead of totalPoints (Frontend name)
  // We use || 0 to ensure it never crashes even if score is missing
  const score = Math.round(playerCharacter.overallScore || 0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-savings/5 rounded-full blur-3xl" />
      </div>

      {/* Player Character & Stats */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mb-6"
      >
        <div className="flex flex-col items-center">
          <PlayerCharacterComponent
            character={playerCharacter}
            size="lg"
            showDetails
          />

          {/* Points display */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('shop')}
            className="mt-4 flex items-center gap-2 bg-primary/20 hover:bg-primary/30 px-4 py-2 rounded-full border border-primary/30 transition-colors"
          >
            <Coins className="w-4 h-4 text-primary" />
            <span className="text-primary font-semibold">
              {score.toLocaleString()} pts
            </span>
            <ShoppingBag className="w-4 h-4 text-muted-foreground" />
          </motion.button>
        </div>
      </motion.div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative text-center z-10"
      >
        <h1 className="font-display text-5xl md:text-7xl mb-4 text-gradient-gold">
          Rags to Riches
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12">
          Master Your Money Management Skills
        </p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap"
        >
          <GameButton onClick={() => onNavigate('play')} variant="primary" icon={<Play className="w-5 h-5" />}>
            Start Game
          </GameButton>

          <GameButton onClick={() => onNavigate('shop')} variant="secondary" icon={<ShoppingBag className="w-5 h-5" />}>
            Customize
          </GameButton>

          <GameButton onClick={() => onNavigate('leaderboard')} variant="secondary" icon={<Trophy className="w-5 h-5 text-yellow-500" />}>
            Rankings
          </GameButton>
        </motion.div>
      </motion.div>
    </div>
  );
};

interface GameButtonProps {
  children: ReactNode;
  onClick: () => void;
  variant: 'primary' | 'secondary' | 'ghost';
  icon?: ReactNode;
}

const GameButton = ({ children, onClick, variant, icon }: GameButtonProps) => (
  <motion.button
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={cn(
      'inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-base transition-all',
      variant === 'primary' && 'bg-blue-600 text-white shadow-lg hover:bg-blue-500',
      variant === 'secondary' && 'bg-slate-800 border-2 border-slate-700 text-white hover:bg-slate-700',
      variant === 'ghost' && 'bg-transparent text-slate-400 hover:text-white'
    )}
  >
    {icon}
    {children}
  </motion.button>
);