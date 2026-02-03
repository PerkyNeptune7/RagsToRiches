import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameCard } from './GameCard';
import { PlayerCharacterComponent } from './PlayerCharacter';
import { VillainCharacter, VillainState } from './VillainCharacter';
import { JourneyTrack } from './JourneyTrack';

import {
  PlayerCharacter,
  EvilCharacter,
  SituationCard,
  Choice,
  BackendStats
} from '@/types/game';
import { getRandomEvilCharacter } from '@/data/customization';
import { cn } from '@/lib/utils';
import {
  DollarSign,
  PiggyBank,
  Swords,
  Brain
} from 'lucide-react';

interface GameBoardProps {
  playerCharacter: PlayerCharacter;
  cards: SituationCard[];
  onGameEnd: (score: number) => void;
}

export const GameBoard = ({ playerCharacter, cards, onGameEnd }: GameBoardProps) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [stats, setStats] = useState<BackendStats>(playerCharacter.stats);
  const [gameOver, setGameOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // === ANIMATION STATES ===
  const [playerReaction, setPlayerReaction] = useState<'neutral' | 'happy' | 'thinking' | 'sad'>('neutral');

  // === BATTLE STATES ===
  const [evilCharacter, setEvilCharacter] = useState<EvilCharacter | null>(null);
  const [evilHealth, setEvilHealth] = useState(100);
  const [evilMaxHealth] = useState(100);
  const [isEvilAttacking, setIsEvilAttacking] = useState(false); // Controls Villain Zoom
  const [damageDealt, setDamageDealt] = useState<number | undefined>(undefined);
  const [battleMessage, setBattleMessage] = useState<string>('');

  useEffect(() => {
    const evil = getRandomEvilCharacter();
    setEvilCharacter(evil);
    setEvilHealth(evil.power);
  }, []);

  // Determine Villain Animation State
  const getVillainState = (): VillainState => {
    if (isEvilAttacking) return 'laughing'; // Triggers Villain Zoom Overlay
    if (damageDealt && damageDealt > 0) return 'scared'; // Triggers Scared Animation (In-place)
    return 'idle';
  };

  const activeCard = cards[currentCardIndex];

  const handleChoice = (choice: Choice) => {
    if (gameOver || isProcessing) return;
    setIsProcessing(true);

    // 1. Update Stats
    const newStats = {
      money: stats.money + choice.effect.money,
      happiness: stats.happiness + choice.effect.happiness,
      financeKnowledge: stats.financeKnowledge + choice.effect.financeKnowledge,
    };
    setStats(newStats);

    // 2. === MUTUAL EXCLUSIVITY LOGIC ===
    // We prioritize "Bad News" (Villain) over "Good News" (Hero) if both happen,
    // to prevent two cutscenes from playing at once.

    const isBadFinancialMove = choice.effect.money < 0;
    const isGoodFinancialMove = choice.effect.money > 0 || choice.effect.financeKnowledge > 0;

    if (isBadFinancialMove) {
      // --- SCENARIO A: VILLAIN TAKES THE SCREEN ---

      setIsEvilAttacking(true); // 1. Trigger Villain Zoom
      setPlayerReaction('sad'); // 2. Player looks sad (No zoom)

      setBattleMessage(`😈 ${evilCharacter?.name} laughs at your spending!`);

      // Reset after animation
      setTimeout(() => {
        setIsEvilAttacking(false);
        setPlayerReaction('neutral');
      }, 2500);

    } else if (isGoodFinancialMove) {
      // --- SCENARIO B: HERO TAKES THE SCREEN ---

      setIsEvilAttacking(false); // 1. Ensure Villain stays put
      setPlayerReaction('happy'); // 2. Trigger Player Zoom/Dance

      // Calculate damage to villain (Visual only)
      let damage = 10;
      if (choice.effect.financeKnowledge > 0) damage += 15;
      setDamageDealt(damage);
      setEvilHealth(prev => Math.max(0, prev - damage));

      setBattleMessage("🎉 Great Choice! You're taking control!");

      // Reset after animation
      setTimeout(() => {
        setPlayerReaction('neutral');
        setDamageDealt(undefined);
      }, 2500);

    } else {
      // --- SCENARIO C: NEUTRAL/THINKING ---
      if (choice.effect.financeKnowledge > 0) {
        setPlayerReaction('thinking');
      } else {
        setPlayerReaction('neutral');
      }
      setTimeout(() => setPlayerReaction('neutral'), 1500);
    }

    // 3. Move to Next Card
    setTimeout(() => {
      setDamageDealt(undefined);
      setBattleMessage('');
      setIsProcessing(false);

      if (currentCardIndex + 1 < cards.length) {
        setCurrentCardIndex(prev => prev + 1);
      } else {
        finishGame(newStats);
      }
    }, 2500); // Wait for the zoom animations to finish
  };

  const finishGame = (finalStats: typeof stats) => {
    setGameOver(true);
    const finalScore = finalStats.money + (finalStats.happiness * 10) + (finalStats.financeKnowledge * 20);
    setTimeout(() => onGameEnd(finalScore), 2500);
  };

  if (!activeCard && !gameOver) return <div className="p-10 text-center">Loading Situations...</div>;

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col max-w-6xl mx-auto overflow-hidden">

      {/* 2. INSERT TRACK HERE (Top of the screen) */}
      <JourneyTrack
        currentRound={currentCardIndex}
        totalRounds={cards.length}
        character={playerCharacter}
      />

      {/* === BATTLE HEADER === */}
      <motion.div className="flex justify-between items-start mb-4 px-2 pt-4 relative z-10">

        {/* PLAYER (Left) */}
        {/* NOTE: If playerReaction is 'happy', this component handles the Fullscreen Zoom internally */}
        <PlayerCharacterComponent
          character={playerCharacter}
          size="sm"
          reaction={playerReaction}
        />

        {/* CENTER INFO */}
        <div className="mt-4 flex flex-col items-center z-10">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2 bg-secondary/80 backdrop-blur px-4 py-1 rounded-full border border-border"
          >
            <Swords className="w-4 h-4 text-primary" />
            <span className="font-bold text-xs">ROUND {currentCardIndex + 1}/{cards.length}</span>
          </motion.div>

          <AnimatePresence mode="wait">
            {battleMessage && (
              <motion.span
                key={battleMessage}
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mt-2 text-sm font-bold text-white bg-slate-900/90 px-3 py-1 rounded-full shadow-lg border border-slate-700"
              >
                {battleMessage}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* VILLAIN (Right) */}
        {/* NOTE: If state is 'laughing', this component handles the Fullscreen Zoom internally */}
        {evilCharacter && (
          <div className="flex-shrink-0">
            <VillainCharacter
              character={evilCharacter}
              state={getVillainState()}
              health={evilHealth}
              maxHealth={evilMaxHealth}
              damage={damageDealt}
            />
          </div>
        )}
      </motion.div>

      {/* === STATS BAR === */}
      <div className="flex justify-center gap-4 mb-8">
        <StatCard icon={<DollarSign className="w-4 h-4" />} label="Money" value={`$${stats.money}`} color={stats.money > 0 ? 'text-green-500' : 'text-red-500'} />
        <StatCard icon={<Brain className="w-4 h-4" />} label="Knowledge" value={`${stats.financeKnowledge}`} color="text-blue-500" />
        <StatCard icon={<PiggyBank className="w-4 h-4" />} label="Happy" value={`${stats.happiness}`} color="text-yellow-500" />
      </div>

      {/* === CARD AREA === */}
      {!gameOver && activeCard && (
        <div className="flex-1 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            key={activeCard.id}
            className="mb-8 text-center max-w-2xl bg-secondary/30 p-6 rounded-2xl border border-border backdrop-blur-sm shadow-sm"
          >
            <h2 className="font-display text-xl md:text-2xl leading-relaxed">
              &quot;{activeCard.situation}&quot;
            </h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6 perspective-1000">
            <AnimatePresence mode="wait">
              {activeCard.choices.map((choice, idx) => (
                <GameCard
                  key={`${activeCard.id}-choice-${idx}`}
                  choice={choice}
                  index={idx}
                  onClick={handleChoice}
                  disabled={isProcessing}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* === GAME OVER === */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center"
          >
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Game Complete!</h1>
              <p className="text-xl text-muted-foreground mb-4">Final Score: {stats.money + stats.happiness * 10}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StatCard = ({ icon, value, color }: any) => (
  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border shadow-sm min-w-[100px] justify-center">
    <div className={cn('p-1.5 rounded-md bg-secondary', color)}>{icon}</div>
    <div className="font-bold text-sm">{value}</div>
  </div>
);