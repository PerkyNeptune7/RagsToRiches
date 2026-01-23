import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameCard } from './GameCard';
import { BudgetCard, GameState } from '@/types/game';
import { getRandomCards } from '@/data/cards';
import { cn } from '@/lib/utils';
import { 
  DollarSign, 
  TrendingUp, 
  PiggyBank, 
  Trophy,
  RotateCcw,
  Sparkles
} from 'lucide-react';

const initialGameState: GameState = {
  budget: 1000,
  score: 0,
  round: 1,
  maxRounds: 5,
  currentCards: [],
  playedCards: [],
  savings: 0,
  investments: 0,
  monthlyIncome: 0,
  monthlyExpenses: 0,
};

export const GameBoard = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [showResult, setShowResult] = useState(false);
  const [lastPlayed, setLastPlayed] = useState<BudgetCard | null>(null);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    startNewRound();
  }, []);

  const startNewRound = () => {
    const newCards = getRandomCards(3);
    setGameState(prev => ({
      ...prev,
      currentCards: newCards,
    }));
    setShowResult(false);
    setLastPlayed(null);
  };

  const playCard = (card: BudgetCard) => {
    setLastPlayed(card);
    setShowResult(true);

    setGameState(prev => {
      let newBudget = prev.budget;
      let newSavings = prev.savings;
      let newInvestments = prev.investments;
      let scoreChange = 0;

      switch (card.category) {
        case 'income':
          newBudget += card.amount;
          scoreChange = card.amount * 0.5;
          break;
        case 'expense':
          newBudget += card.amount; // amount is negative
          scoreChange = Math.abs(card.amount) * 0.2; // Some expenses are okay
          break;
        case 'savings':
          if (newBudget >= card.amount) {
            newBudget -= card.amount;
            newSavings += card.amount;
            scoreChange = card.amount * 2; // Saving is rewarded highly
          }
          break;
        case 'investment':
          if (newBudget >= card.amount) {
            newBudget -= card.amount;
            newInvestments += card.amount;
            scoreChange = card.amount * 1.5;
          }
          break;
      }

      const newRound = prev.round + 1;
      const isGameOver = newRound > prev.maxRounds || newBudget < 0;

      if (isGameOver) {
        setGameOver(true);
      }

      return {
        ...prev,
        budget: newBudget,
        score: prev.score + scoreChange,
        round: newRound,
        playedCards: [...prev.playedCards, card],
        savings: newSavings,
        investments: newInvestments,
        currentCards: prev.currentCards.filter(c => c.id !== card.id),
      };
    });

    // Auto advance after showing result
    setTimeout(() => {
      if (!gameOver && gameState.round < gameState.maxRounds) {
        startNewRound();
      }
    }, 2000);
  };

  const resetGame = () => {
    setGameState(initialGameState);
    setGameOver(false);
    setShowResult(false);
    setLastPlayed(null);
    startNewRound();
  };

  const getGrade = (score: number) => {
    if (score >= 2000) return { grade: 'A+', message: 'Financial Genius!', color: 'text-income' };
    if (score >= 1500) return { grade: 'A', message: 'Excellent budgeting!', color: 'text-income' };
    if (score >= 1000) return { grade: 'B', message: 'Good financial sense!', color: 'text-savings' };
    if (score >= 500) return { grade: 'C', message: 'Room for improvement', color: 'text-investment' };
    return { grade: 'D', message: 'Keep practicing!', color: 'text-expense' };
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col">
      {/* Header Stats */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap justify-center gap-4 mb-8"
      >
        <StatCard 
          icon={<DollarSign className="w-5 h-5" />} 
          label="Budget" 
          value={`$${gameState.budget.toLocaleString()}`}
          color={gameState.budget > 500 ? 'text-income' : 'text-expense'}
        />
        <StatCard 
          icon={<PiggyBank className="w-5 h-5" />} 
          label="Savings" 
          value={`$${gameState.savings.toLocaleString()}`}
          color="text-savings"
        />
        <StatCard 
          icon={<TrendingUp className="w-5 h-5" />} 
          label="Investments" 
          value={`$${gameState.investments.toLocaleString()}`}
          color="text-investment"
        />
        <StatCard 
          icon={<Trophy className="w-5 h-5" />} 
          label="Score" 
          value={Math.round(gameState.score).toLocaleString()}
          color="text-primary"
        />
      </motion.div>

      {/* Round Indicator */}
      <div className="text-center mb-6">
        <span className="text-muted-foreground">Round</span>
        <div className="flex justify-center gap-2 mt-2">
          {Array.from({ length: gameState.maxRounds }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-3 h-3 rounded-full transition-all duration-300',
                i < gameState.round - 1 ? 'bg-primary' : 'bg-secondary'
              )}
            />
          ))}
        </div>
      </div>

      {/* Game Over Screen */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="text-center p-8 rounded-2xl bg-card border border-border max-w-md">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary" />
              </motion.div>
              <h2 className="font-display text-3xl mb-2">Game Over!</h2>
              <div className={cn('text-6xl font-display mb-2', getGrade(gameState.score).color)}>
                {getGrade(gameState.score).grade}
              </div>
              <p className="text-muted-foreground mb-4">{getGrade(gameState.score).message}</p>
              
              <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
                <div className="p-3 rounded-lg bg-secondary">
                  <div className="text-income font-bold">${gameState.budget}</div>
                  <div className="text-muted-foreground">Final Budget</div>
                </div>
                <div className="p-3 rounded-lg bg-secondary">
                  <div className="text-savings font-bold">${gameState.savings}</div>
                  <div className="text-muted-foreground">Saved</div>
                </div>
                <div className="p-3 rounded-lg bg-secondary">
                  <div className="text-investment font-bold">${gameState.investments}</div>
                  <div className="text-muted-foreground">Invested</div>
                </div>
              </div>

              <div className="text-2xl font-display text-primary mb-6">
                Score: {Math.round(gameState.score).toLocaleString()}
              </div>

              <button
                onClick={resetGame}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                <RotateCcw className="w-5 h-5" />
                Play Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Last Played Card Effect */}
      <AnimatePresence>
        {showResult && lastPlayed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center mb-6"
          >
            <div className={cn(
              'inline-block px-4 py-2 rounded-full text-sm font-semibold',
              lastPlayed.category === 'income' && 'bg-income/20 text-income',
              lastPlayed.category === 'expense' && 'bg-expense/20 text-expense',
              lastPlayed.category === 'savings' && 'bg-savings/20 text-savings',
              lastPlayed.category === 'investment' && 'bg-investment/20 text-investment',
            )}>
              {lastPlayed.effect}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Area */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-display text-2xl mb-8 text-center"
        >
          Choose a card to play
        </motion.h2>
        
        <div className="flex flex-wrap justify-center gap-6">
          <AnimatePresence mode="popLayout">
            {gameState.currentCards.map((card, index) => (
              <GameCard
                key={card.id}
                card={card}
                index={index}
                onClick={playCard}
                disabled={showResult}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Tips */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          💡 <span className="text-foreground">Tip:</span> Balance your spending! 
          Saving and investing earn more points than just keeping cash.
        </p>
      </motion.div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color?: string;
}

const StatCard = ({ icon, label, value, color = 'text-foreground' }: StatCardProps) => (
  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border">
    <div className={cn('p-2 rounded-lg bg-secondary', color)}>
      {icon}
    </div>
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={cn('font-bold text-lg', color)}>{value}</div>
    </div>
  </div>
);
