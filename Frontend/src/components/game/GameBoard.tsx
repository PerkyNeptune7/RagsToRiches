import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameCard } from './GameCard';
import { PlayerCharacterComponent } from './PlayerCharacter';
import { VillainCharacter, VillainState } from './VillainCharacter';
import { JourneyTrack } from './JourneyTrack';
import { getCleanSummary, calculateTurnScore, parseCash, parseSymbol } from '@/utils/gameLogic'; // Import helpers

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
  const [isEvilAttacking, setIsEvilAttacking] = useState(false);
  const [damageDealt, setDamageDealt] = useState<number | undefined>(undefined);
  const [battleMessage, setBattleMessage] = useState<string>('');

  useEffect(() => {
    const evil = getRandomEvilCharacter();
    setEvilCharacter(evil);
    setEvilHealth(evil.power);
  }, []);

  const getVillainState = (): VillainState => {
    if (isEvilAttacking) return 'laughing';
    if (damageDealt && damageDealt > 0) return 'scared';
    return 'idle';
  };

  const activeCard = cards[currentCardIndex];

  const handleChoice = (choice: Choice) => {
    if (gameOver || isProcessing) return;
    setIsProcessing(true);

    // 1. Calculate Score using the Helper Formula
    const turnScore = calculateTurnScore(choice.effect);

    // 2. Parse Stats (Strings -> Numbers)
    const moneyChange = parseCash(choice.effect.money);
    const hapChange = parseSymbol(choice.effect.happiness);
    const knwChange = parseSymbol(choice.effect.financeKnowledge);

    // 3. Update Stats
    const newStats = {
      money: stats.money + moneyChange,
      happiness: stats.happiness + hapChange,
      financeKnowledge: stats.financeKnowledge + knwChange,
    };
    setStats(newStats);

    // 4. === ANIMATION LOGIC (Based on Score) ===

    // Threshold: Score > 0 is GOOD (Hero Dance), Score <= 0 is BAD (Villain Dance)
    const isGoodTurn = turnScore > 0;

    if (!isGoodTurn) {
      // --- VILLAIN DANCE ---
      setIsEvilAttacking(true);
      setPlayerReaction('sad');
      setBattleMessage(`😈 ${evilCharacter?.name} laughs at your mistake!`);

      setTimeout(() => {
        setIsEvilAttacking(false);
        setPlayerReaction('neutral');
      }, 2500);

    } else {
      // --- HERO DANCE ---
      setIsEvilAttacking(false);
      setPlayerReaction('happy'); // Triggers Zoom/Dance

      // Visual Damage to Villain
      const damage = Math.min(turnScore * 5, 20); // Scale score to damage
      setDamageDealt(damage);
      setEvilHealth(prev => Math.max(0, prev - damage));

      setBattleMessage("🎉 Great Choice! You're winning!");

      setTimeout(() => {
        setPlayerReaction('neutral');
        setDamageDealt(undefined);
      }, 2500);
    }

    // 5. Next Card
    setTimeout(() => {
      setDamageDealt(undefined);
      setBattleMessage('');
      setIsProcessing(false);

      if (currentCardIndex + 1 < cards.length) {
        setCurrentCardIndex(prev => prev + 1);
      } else {
        finishGame(newStats);
      }
    }, 2500);
  };

  const finishGame = (finalStats: typeof stats) => {
    setGameOver(true);
    const finalScore = finalStats.money + (finalStats.happiness * 10) + (finalStats.financeKnowledge * 20);
    setTimeout(() => onGameEnd(finalScore), 2500);
  };

  if (!activeCard && !gameOver) return <div className="p-10 text-center">Loading Situations...</div>;

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col max-w-6xl mx-auto overflow-hidden">

      <JourneyTrack
        currentRound={currentCardIndex}
        totalRounds={cards.length}
        character={playerCharacter}
      />

      {/* HEADER: PLAYER vs VILLAIN */}
      <motion.div className="flex justify-between items-start mb-4 px-2 pt-4 relative z-10">
        <PlayerCharacterComponent
          character={playerCharacter}
          size="sm"
          reaction={playerReaction}
        />

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

      {/* STATS */}
      <div className="flex justify-center gap-4 mb-8">
        <StatCard icon={<DollarSign className="w-4 h-4" />} label="Money" value={`$${stats.money}`} color={stats.money > 0 ? 'text-green-500' : 'text-red-500'} />
        <StatCard icon={<Brain className="w-4 h-4" />} label="Knowledge" value={`${stats.financeKnowledge}`} color="text-blue-500" />
        <StatCard icon={<PiggyBank className="w-4 h-4" />} label="Happy" value={`${stats.happiness}`} color="text-yellow-500" />
      </div>

      {/* CARD AREA */}
      {!gameOver && activeCard && (
        <div className="flex-1 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            key={activeCard.id} // Ensure this matches your ID field (_id or situationId)
            className="mb-8 text-center max-w-2xl bg-secondary/30 p-6 rounded-2xl border border-border backdrop-blur-sm shadow-sm"
          >
            <h2 className="font-display text-xl md:text-2xl leading-relaxed">
              &quot;{activeCard.scenario}&quot;
            </h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6 perspective-1000">
            <AnimatePresence mode="wait">
              {activeCard.options.map((choice, idx) => (
                <GameCard
                  key={`choice-${idx}`}
                  choice={choice}
                  index={idx}
                  onClick={handleChoice}
                  disabled={isProcessing}
                  // ✨ NEW: Pass the clean summary here!
                  subtitle={getCleanSummary(choice.effect)}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* GAME OVER */}
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

// Simple Stat Card Helper
const StatCard = ({ icon, value, color }: any) => (
  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border shadow-sm min-w-[100px] justify-center">
    <div className={cn('p-1.5 rounded-md bg-secondary', color)}>{icon}</div>
    <div className="font-bold text-sm">{value}</div>
  </div>
);