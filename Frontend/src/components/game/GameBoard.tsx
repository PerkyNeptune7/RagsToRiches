import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameCard } from './GameCard';
import { PlayerCharacterComponent } from './PlayerCharacter';
import { EvilCharacterComponent } from './EvilCharacter';
import { BudgetCard, GameState, PlayerCharacter, EvilCharacter } from '@/types/game';
import { getRandomCards } from '@/data/cards';
import { getRandomEvilCharacter } from '@/data/customization';
import { cn } from '@/lib/utils';
import { 
  DollarSign, 
  TrendingUp, 
  PiggyBank, 
  Trophy,
  RotateCcw,
  Sparkles,
  Swords
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

interface GameBoardProps {
  playerCharacter: PlayerCharacter;
  onGameEnd: (score: number) => void;
}

export const GameBoard = ({ playerCharacter, onGameEnd }: GameBoardProps) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [showResult, setShowResult] = useState(false);
  const [lastPlayed, setLastPlayed] = useState<BudgetCard | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [evilCharacter, setEvilCharacter] = useState<EvilCharacter | null>(null);
  const [evilHealth, setEvilHealth] = useState(100);
  const [evilMaxHealth, setEvilMaxHealth] = useState(100);
  const [isEvilAttacking, setIsEvilAttacking] = useState(false);
  const [damageDealt, setDamageDealt] = useState<number | undefined>(undefined);
  const [battleMessage, setBattleMessage] = useState<string>('');

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const evil = getRandomEvilCharacter();
    setEvilCharacter(evil);
    setEvilHealth(evil.power);
    setEvilMaxHealth(evil.power);
    startNewRound();
  };

  const startNewRound = () => {
    const newCards = getRandomCards(3);
    setGameState(prev => ({
      ...prev,
      currentCards: newCards,
    }));
    setShowResult(false);
    setLastPlayed(null);
    setDamageDealt(undefined);
    setBattleMessage('');
  };

  const playCard = useCallback((card: BudgetCard) => {
    setLastPlayed(card);
    setShowResult(true);

    let damageToEnemy = 0;
    let message = '';

    setGameState(prev => {
      let newBudget = prev.budget;
      let newSavings = prev.savings;
      let newInvestments = prev.investments;
      let scoreChange = 0;

      switch (card.category) {
        case 'income':
          newBudget += card.amount;
          scoreChange = card.amount * 0.5;
          damageToEnemy = Math.round(card.amount * 0.15);
          message = `💰 Income boost! ${damageToEnemy} damage to ${evilCharacter?.name}!`;
          break;
        case 'expense':
          newBudget += card.amount;
          scoreChange = Math.abs(card.amount) * 0.2;
          // Evil character attacks when you spend
          setIsEvilAttacking(true);
          setTimeout(() => setIsEvilAttacking(false), 500);
          message = `😈 ${evilCharacter?.name} gains power from your spending!`;
          break;
        case 'savings':
          if (newBudget >= card.amount) {
            newBudget -= card.amount;
            newSavings += card.amount;
            scoreChange = card.amount * 2;
            damageToEnemy = Math.round(card.amount * 0.3);
            message = `🛡️ Savings shield! ${damageToEnemy} damage to ${evilCharacter?.name}!`;
          }
          break;
        case 'investment':
          if (newBudget >= card.amount) {
            newBudget -= card.amount;
            newInvestments += card.amount;
            scoreChange = card.amount * 1.5;
            damageToEnemy = Math.round(card.amount * 0.25);
            message = `📈 Investment attack! ${damageToEnemy} damage to ${evilCharacter?.name}!`;
          }
          break;
      }

      const newRound = prev.round + 1;
      const isGameOver = newRound > prev.maxRounds || newBudget < 0;

      if (isGameOver) {
        setGameOver(true);
        onGameEnd(prev.score + scoreChange);
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

    // Deal damage to evil character
    if (damageToEnemy > 0) {
      setDamageDealt(damageToEnemy);
      setEvilHealth(prev => {
        const newHealth = Math.max(0, prev - damageToEnemy);
        if (newHealth === 0) {
          setBattleMessage(`🎉 You defeated ${evilCharacter?.name}! Bonus points!`);
        }
        return newHealth;
      });
    }
    
    setBattleMessage(message);

    // Auto advance after showing result
    setTimeout(() => {
      if (!gameOver && gameState.round < gameState.maxRounds) {
        startNewRound();
      }
    }, 2500);
  }, [evilCharacter, gameOver, gameState.round, gameState.maxRounds, onGameEnd]);

  const resetGame = () => {
    setGameState(initialGameState);
    setGameOver(false);
    setShowResult(false);
    setLastPlayed(null);
    startNewGame();
  };

  const getGrade = (score: number) => {
    if (score >= 2000) return { grade: 'A+', message: 'Financial Genius!', color: 'text-income' };
    if (score >= 1500) return { grade: 'A', message: 'Excellent budgeting!', color: 'text-income' };
    if (score >= 1000) return { grade: 'B', message: 'Good financial sense!', color: 'text-savings' };
    if (score >= 500) return { grade: 'C', message: 'Room for improvement', color: 'text-investment' };
    return { grade: 'D', message: 'Keep practicing!', color: 'text-expense' };
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 flex flex-col">
      {/* Battle Arena Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-start mb-4 gap-4"
      >
        {/* Player Character */}
        <div className="flex-shrink-0">
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
          className="flex items-center gap-2 bg-gradient-to-r from-primary/20 to-expense/20 px-4 py-2 rounded-full border border-border"
        >
          <Swords className="w-5 h-5 text-primary" />
          <span className="font-display text-sm">VS</span>
        </motion.div>

        {/* Evil Character */}
        {evilCharacter && (
          <div className="flex-shrink-0">
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

      {/* Battle Message */}
      <AnimatePresence>
        {battleMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center mb-4"
          >
            <span className="inline-block px-4 py-2 bg-card/80 backdrop-blur border border-border rounded-lg text-sm">
              {battleMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap justify-center gap-3 mb-6"
      >
        <StatCard 
          icon={<DollarSign className="w-4 h-4" />} 
          label="Budget" 
          value={`$${gameState.budget.toLocaleString()}`}
          color={gameState.budget > 500 ? 'text-income' : 'text-expense'}
        />
        <StatCard 
          icon={<PiggyBank className="w-4 h-4" />} 
          label="Savings" 
          value={`$${gameState.savings.toLocaleString()}`}
          color="text-savings"
        />
        <StatCard 
          icon={<TrendingUp className="w-4 h-4" />} 
          label="Investments" 
          value={`$${gameState.investments.toLocaleString()}`}
          color="text-investment"
        />
        <StatCard 
          icon={<Trophy className="w-4 h-4" />} 
          label="Score" 
          value={Math.round(gameState.score).toLocaleString()}
          color="text-primary"
        />
      </motion.div>

      {/* Round Indicator */}
      <div className="text-center mb-4">
        <span className="text-muted-foreground text-sm">Round</span>
        <div className="flex justify-center gap-2 mt-1">
          {Array.from({ length: gameState.maxRounds }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-2.5 h-2.5 rounded-full transition-all duration-300',
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
            className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <div className="text-center p-6 md:p-8 rounded-2xl bg-card border border-border max-w-md w-full">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <Sparkles className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-primary" />
              </motion.div>
              <h2 className="font-display text-2xl md:text-3xl mb-2">Game Over!</h2>
              
              {evilHealth <= 0 && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-income font-semibold mb-2"
                >
                  🎉 You defeated {evilCharacter?.name}!
                </motion.p>
              )}
              
              <div className={cn('text-5xl md:text-6xl font-display mb-2', getGrade(gameState.score).color)}>
                {getGrade(gameState.score).grade}
              </div>
              <p className="text-muted-foreground mb-4">{getGrade(gameState.score).message}</p>
              
              <div className="grid grid-cols-3 gap-3 mb-6 text-xs md:text-sm">
                <div className="p-2 md:p-3 rounded-lg bg-secondary">
                  <div className="text-income font-bold">${gameState.budget}</div>
                  <div className="text-muted-foreground">Final Budget</div>
                </div>
                <div className="p-2 md:p-3 rounded-lg bg-secondary">
                  <div className="text-savings font-bold">${gameState.savings}</div>
                  <div className="text-muted-foreground">Saved</div>
                </div>
                <div className="p-2 md:p-3 rounded-lg bg-secondary">
                  <div className="text-investment font-bold">${gameState.investments}</div>
                  <div className="text-muted-foreground">Invested</div>
                </div>
              </div>

              <div className="text-xl md:text-2xl font-display text-primary mb-4 md:mb-6">
                +{Math.round(gameState.score).toLocaleString()} points earned!
              </div>

              <button
                onClick={resetGame}
                className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
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
            className="text-center mb-4"
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
          className="font-display text-xl md:text-2xl mb-6 text-center"
        >
          Choose a card to play
        </motion.h2>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
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
        className="mt-6 text-center"
      >
        <p className="text-xs md:text-sm text-muted-foreground max-w-md mx-auto">
          💡 <span className="text-foreground">Tip:</span> Saving and investing deal more damage to {evilCharacter?.name}!
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
  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border">
    <div className={cn('p-1.5 rounded-md bg-secondary', color)}>
      {icon}
    </div>
    <div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className={cn('font-bold text-sm', color)}>{value}</div>
    </div>
  </div>
);
