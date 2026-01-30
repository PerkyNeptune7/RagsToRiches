import { motion, AnimatePresence } from 'framer-motion';
import { EvilCharacter as EvilCharacterType } from '@/types/game';
import { cn } from '@/lib/utils';
import { Skull, Flame, Zap } from 'lucide-react';

interface EvilCharacterProps {
  character: EvilCharacterType;
  isAttacking?: boolean;
  damage?: number;
  health: number;
  maxHealth: number;
}

const typeColors: Record<string, string> = {
  debt_monster: 'from-red-600 to-red-900',
  impulse_demon: 'from-purple-600 to-purple-900',
  scam_spirit: 'from-green-600 to-green-900',
};

const typeGlows: Record<string, string> = {
  debt_monster: '0 0 30px rgba(220, 38, 38, 0.6)',
  impulse_demon: '0 0 30px rgba(147, 51, 234, 0.6)',
  scam_spirit: '0 0 30px rgba(22, 163, 74, 0.6)',
};

export const EvilCharacterComponent = ({ 
  character, 
  isAttacking = false,
  damage,
  health,
  maxHealth
}: EvilCharacterProps) => {
  const healthPercentage = (health / maxHealth) * 100;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Character name and type */}
      <div className="text-center">
        <h3 className="font-display text-lg text-expense flex items-center gap-2 justify-center">
          <Skull className="w-4 h-4" />
          {character.name}
        </h3>
      </div>

      {/* Evil character body */}
      <motion.div
        animate={isAttacking ? {
          x: [0, -10, 10, -10, 0],
          scale: [1, 1.1, 1],
        } : {
          y: [0, -8, 0],
          rotate: [0, -3, 3, 0],
        }}
        transition={isAttacking ? {
          duration: 0.5,
        } : {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={cn(
          "relative w-28 h-28 rounded-2xl flex items-center justify-center",
          "bg-gradient-to-b",
          typeColors[character.type],
          "border-2 border-expense/50"
        )}
        style={{ boxShadow: typeGlows[character.type] }}
      >
        {/* Evil face */}
        <span className="text-6xl filter drop-shadow-lg">{character.icon}</span>
        
        {/* Flames around */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute -top-2 left-1/2 -translate-x-1/2"
        >
          <Flame className="w-6 h-6 text-orange-400" />
        </motion.div>

        {/* Power indicator */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-expense text-foreground text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <Zap className="w-3 h-3" />
          {character.power}
        </div>

        {/* Damage popup */}
        <AnimatePresence>
          {damage && damage > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: 1, y: -30, scale: 1.2 }}
              exit={{ opacity: 0, y: -50 }}
              className="absolute top-0 left-1/2 -translate-x-1/2 text-income font-display text-2xl font-bold"
            >
              -{damage}!
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Health bar */}
      <div className="w-full max-w-32">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">HP</span>
          <span className="text-expense font-semibold">{health}/{maxHealth}</span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden border border-border">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: `${healthPercentage}%` }}
            className={cn(
              "h-full rounded-full transition-all duration-500",
              healthPercentage > 50 ? "bg-expense" : healthPercentage > 25 ? "bg-orange-500" : "bg-red-700"
            )}
          />
        </div>
      </div>

      {/* Taunt bubble */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-card/80 backdrop-blur border border-border rounded-lg px-3 py-2 max-w-40"
      >
        <p className="text-xs text-center italic text-muted-foreground">
          "{character.taunt}"
        </p>
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-card/80" />
      </motion.div>
    </div>
  );
};
