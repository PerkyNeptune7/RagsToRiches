import { motion } from 'framer-motion';
import { PlayerCharacter as PlayerCharacterType } from '@/types/game';
import { cn } from '@/lib/utils';

interface PlayerCharacterProps {
  character: PlayerCharacterType;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  animated?: boolean;
}

const outfitEmojis: Record<string, string> = {
  default: '👕',
  business: '👔',
  casual: '🧥',
  fancy: '🤵',
  sporty: '🏃',
  student: '🎓',
};

const houseEmojis: Record<string, string> = {
  apartment: '🏢',
  house: '🏠',
  mansion: '🏰',
  penthouse: '🏙️',
  cottage: '🏡',
};

const accessoryEmojis: Record<string, string> = {
  none: '',
  glasses: '👓',
  hat: '🎩',
  watch: '⌚',
  briefcase: '💼',
  backpack: '🎒',
};

const skinColors: Record<string, string> = {
  light: 'bg-amber-100',
  medium: 'bg-amber-200',
  tan: 'bg-amber-400',
  dark: 'bg-amber-700',
};

export const PlayerCharacterComponent = ({ 
  character, 
  size = 'md', 
  showDetails = false,
  animated = true 
}: PlayerCharacterProps) => {
  const sizeClasses = {
    sm: 'w-16 h-16 text-2xl',
    md: 'w-24 h-24 text-4xl',
    lg: 'w-32 h-32 text-5xl',
  };

  const Component = animated ? motion.div : 'div';

  return (
    <div className="flex flex-col items-center gap-2">
      <Component
        {...(animated && {
          animate: { y: [0, -5, 0] },
          transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        })}
        className={cn(
          "relative rounded-full border-4 border-primary flex items-center justify-center",
          sizeClasses[size],
          skinColors[character.skinColor],
          "shadow-lg"
        )}
        style={{ boxShadow: 'var(--shadow-glow-gold)' }}
      >
        {/* Face */}
        <span className="relative z-10">😊</span>
        
        {/* Outfit indicator */}
        <div className="absolute -bottom-1 -right-1 bg-card rounded-full p-1 border border-border text-sm">
          {outfitEmojis[character.outfit]}
        </div>
        
        {/* Accessory */}
        {character.accessory !== 'none' && (
          <div className="absolute -top-1 -left-1 bg-card rounded-full p-1 border border-border text-sm">
            {accessoryEmojis[character.accessory]}
          </div>
        )}

        {/* Level badge */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
          Lv.{character.level}
        </div>
      </Component>

      {showDetails && (
        <div className="text-center mt-2">
          <h3 className="font-display text-lg text-foreground">{character.name}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <span>{houseEmojis[character.house]}</span>
            <span className="text-primary font-semibold">{character.totalPoints} pts</span>
          </div>
        </div>
      )}
    </div>
  );
};
