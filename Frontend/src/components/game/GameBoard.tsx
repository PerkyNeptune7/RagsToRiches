import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { GameCard } from './GameCard'; // REMOVED: We need a custom layout for Situations
import { PlayerCharacterComponent } from './PlayerCharacter';
import { EvilCharacterComponent } from './EvilCharacter';
import { GameState, PlayerCharacter, EvilCharacter, SituationCard, Choice } from '@/types/game';
import { getRandomEvilCharacter } from '@/data/customization';
import { cn } from '@/lib/utils';
import { toast } from "sonner";
import { 
  DollarSign, 
  TrendingUp, 
  PiggyBank, 
  Trophy,
  RotateCcw,
  Sparkles,
  Swords,
  Brain
} from 'lucide-react';

interface GameBoardProps {
  playerCharacter: PlayerCharacter;
  cards: SituationCard[]; // <-- Updated to receive MongoDB cards
  onGameEnd: (score: number) => void;
}

export const GameBoard = ({ playerCharacter, cards, onGameEnd }: GameBoardProps) => {
  // 1. Core State
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [stats, setStats] = useState(playerCharacter.stats);
  const [gameOver, setGameOver] = useState(false);
  
  // 2. Battle State (Visuals)
  const [evilCharacter, setEvilCharacter] = useState<EvilCharacter | null>(null);
  const [evilHealth, setEvilHealth] = useState(100);
  const [evilMaxHealth] = useState(100);
  const [isEvilAttacking, setIsEvilAttacking] = useState(false);
  const [damageDealt, setDamageDealt] = useState<number | undefined>(undefined);
  const [battleMessage, setBattleMessage] = useState<string>('');

  // 3. Initialize Battle
  useEffect(() => {
    // Pick a random enemy for this session
    const evil = getRandomEvilCharacter(); 
    setEvilCharacter(evil);
    setEvilHealth(evil.power);
  }, []);

  const activeCard = cards[currentCardIndex];

  // 4. Handle User Selection
  const handleChoice = (choice: Choice) => {
    if (gameOver) return;

    // A. Calculate New Stats
    const newStats = {
      money: stats.money + choice.effect.money,
      happiness: stats.happiness + choice.effect.happiness,
      financeKnowledge: stats.financeKnowledge + choice.effect.financeKnowledge,
    };
    setStats(newStats);

    // B. Calculate "Battle Damage" (Gamification)
    // Good choices (gaining knowledge/money) hurt the monster!
    let damage = 0;
    if (choice.effect.financeKnowledge > 0) damage += 25; // Learning hurts ignorance!
    if (choice.effect.money > 0) damage += 15; // Income hurts debt monsters!
    if (choice.effect.money < 0) {
        // Spending gives the monster power (minor heal or attack)
        setIsEvilAttacking(true);
        setTimeout(() => setIsEvilAttacking(false), 500);
        setBattleMessage(`😈 ${evilCharacter?.name} feeds on your spending!`);
    }

    // C. Apply Damage
    if (damage > 0) {
        setDamageDealt(damage);
        setEvilHealth(prev => Math.max(0, prev - damage));
        setBattleMessage(`💥 Critical Hit! You dealt ${damage} damage!`);
    }

    // D. Advance Game
    if (currentCardIndex + 1 < cards.length) {
        setTimeout(() => {
            setDamageDealt(undefined);
            setCurrentCardIndex(prev => prev + 1);
        }, 1200); // Delay slightly to read the battle text
    } else {
        finishGame(newStats);
    }
  };

  const finishGame = (finalStats: typeof stats) => {
    setGameOver(true);
    const finalScore = finalStats.money + (finalStats.happiness * 10) + (finalStats.financeKnowledge * 20);
    
    // Check if we defeated the boss
    if (evilHealth <= 0) {
        toast.success(`You defeated ${evilCharacter?.name}!`);
    } else {
        toast.info("Game Over!");
    }

    // Delay for dramatic effect
    setTimeout(() => {
        onGameEnd(finalScore);
    }, 2000);
  };

  const resetGame = () => {
    window.location.reload(); // Simple reload to re-fetch fresh data
  };

  const getGrade = (score: number) => {
    if (score >= 5000) return { grade: 'A+', message: 'Financial Genius!', color: 'text-green-500' };
    if (score >= 3000) return { grade: 'B', message: 'Solid Choices!', color: 'text-blue-500' };
    return { grade: 'C', message: 'Keep Learning!', color: 'text-yellow-500' };
  };

  if (!activeCard && !gameOver) return <div className="p-10 text-center">Loading Situations...</div>;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 flex flex-col max-w-5xl mx-auto">
      
      {/* --- SECTION 1: BATTLE HEADER --- */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-start mb-6 gap-4"
      >
        {/* You */}
        <div className="flex-shrink-0">
            <div className="text-center mb-2 font-bold text-sm text-primary">YOU</div>
            <PlayerCharacterComponent 
                character={playerCharacter} 
                size="sm" 
                showDetails={false}
            />
        </div>

        {/* VS Badge */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-8 flex items-center gap-2 bg-gradient-to-r from-primary/20 to-red-500/20 px-4 py-2 rounded-full border border-border"
        >
          <Swords className="w-5 h-5 text-primary" />
          <span className="font-display text-sm font-bold">VS</span>
        </motion.div>

        {/* Enemy */}
        {evilCharacter && (
          <div className="flex-shrink-0">
             <div className="text-center mb-2 font-bold text-sm text-red-500">ENEMY</div>
            <EvilCharacterComponent 
              character={evilCharacter}
              isAttacking={isEvilAttacking}
              damage={damageDealt}
              health={evilHealth}
              maxHealth={evilMaxHealth}
            />
          </div>
        )}
      </motion.div>

      {/* --- SECTION 2: BATTLE LOG --- */}
      <AnimatePresence mode="wait">
        <motion.div
            key={battleMessage}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="h-8 text-center mb-4"
        >
            {battleMessage && (
            <span className="inline-block px-4 py-1 bg-card border border-primary/20 rounded-full text-sm font-medium shadow-sm">
                {battleMessage}
            </span>
            )}
        </motion.div>
      </AnimatePresence>

      {/* --- SECTION 3: STATS HUD --- */}
      <motion.div 
        className="flex flex-wrap justify-center gap-3 mb-8"
        layout
      >
        <StatCard 
          icon={<DollarSign className="w-4 h-4" />} 
          label="Money" 
          value={`$${stats.money}`}
          color={stats.money > 0 ? 'text-green-600' : 'text-red-500'}
        />
        <StatCard 
          icon={<Brain className="w-4 h-4" />} 
          label="Knowledge" 
          value={`${stats.financeKnowledge} XP`}
          color="text-blue-500"
        />
        <StatCard 
          icon={<PiggyBank className="w-4 h-4" />} 
          label="Happiness" 
          value={`${stats.happiness}%`}
          color="text-yellow-500"
        />
      </motion.div>

      {/* --- SECTION 4: THE SITUATION CARD (Active Gameplay) --- */}
      {!gameOver && activeCard && (
        <motion.div 
            key={activeCard.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col items-center max-w-2xl mx-auto w-full"
        >
            <div className="w-full bg-card rounded-xl border-2 border-primary/10 shadow-xl overflow-hidden">
                {/* Situation Text */}
                <div className="p-8 text-center bg-gradient-to-b from-card to-secondary/30">
                    <span className="inline-block mb-4 px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full">
                        Situation {currentCardIndex + 1} / {cards.length}
                    </span>
                    <h2 className="font-display text-2xl md:text-3xl leading-relaxed text-foreground">
                        {activeCard.situation}
                    </h2>
                </div>

                {/* Choices */}
                <div className="p-6 grid gap-3 bg-secondary/50">
                    {activeCard.choices.map((choice, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleChoice(choice)}
                            className="group relative flex items-center justify-between w-full p-4 bg-background hover:bg-primary text-foreground hover:text-primary-foreground border border-border rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-1 text-left"
                        >
                            <span className="font-semibold text-lg">{choice.text}</span>
                            
                            {/* Hover Preview of Effect */}
                            <span className="hidden group-hover:flex items-center gap-2 text-xs opacity-90">
                                {choice.effect.money !== 0 && (
                                    <span className={choice.effect.money > 0 ? "text-green-300" : "text-red-200"}>
                                        {choice.effect.money > 0 ? '+' : ''}${choice.effect.money}
                                    </span>
                                )}
                                <span className="text-xs bg-white/20 px-2 py-0.5 rounded">Select</span>
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </motion.div>
      )}

      {/* --- SECTION 5: GAME OVER SCREEN --- */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <div className="text-center p-8 rounded-2xl bg-card border border-border max-w-md w-full shadow-2xl">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse" />
              
              <h2 className="font-display text-3xl mb-2">Game Complete!</h2>
              {evilHealth <= 0 && <p className="text-green-500 font-bold mb-4">🏆 Enemy Defeated!</p>}
              
              <div className={cn('text-6xl font-display mb-2', getGrade(stats.money).color)}>
                {getGrade(stats.money + stats.financeKnowledge * 10).grade}
              </div>
              
              <div className="grid grid-cols-2 gap-4 my-6">
                <div className="p-3 bg-secondary rounded-lg">
                    <div className="text-xs text-muted-foreground">Final Money</div>
                    <div className="font-bold text-xl">${stats.money}</div>
                </div>
                <div className="p-3 bg-secondary rounded-lg">
                    <div className="text-xs text-muted-foreground">Knowledge Gained</div>
                    <div className="font-bold text-xl text-blue-500">{stats.financeKnowledge} XP</div>
                </div>
              </div>

              <button
                onClick={resetGame}
                className="w-full inline-flex justify-center items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                Play Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Utility Component for Stats
const StatCard = ({ icon, label, value, color = 'text-foreground' }: { icon: React.ReactNode, label: string, value: string, color?: string }) => (
  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border shadow-sm min-w-[140px]">
    <div className={cn('p-2 rounded-lg bg-secondary/50', color)}>
      {icon}
    </div>
    <div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</div>
      <div className={cn('font-bold text-lg leading-none', color)}>{value}</div>
    </div>
  </div>
);