import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HeroSection } from '@/components/game/HeroSection';
import { GameBoard } from '@/components/game/GameBoard';
import { CardGallery } from '@/components/game/CardGallery';
import { TutorialSection } from '@/components/game/TutorialSection';
import { Navigation } from '@/components/game/Navigation';
import { CharacterShop } from '@/components/game/CharacterShop';
import { PlayerCharacter, CustomizationItem } from '@/types/game';

type Page = 'home' | 'play' | 'learn' | 'cards' | 'shop';

const defaultCharacter: PlayerCharacter = {
  name: 'Budget Hero',
  outfit: 'default',
  house: 'apartment',
  accessory: 'none',
  skinColor: 'medium',
  level: 1,
  totalPoints: 0,
  unlockedItems: ['outfit-default', 'house-apartment', 'accessory-none'],
};

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [playerCharacter, setPlayerCharacter] = useState<PlayerCharacter>(() => {
    const saved = localStorage.getItem('budgetquest-character');
    return saved ? JSON.parse(saved) : defaultCharacter;
  });

  // Save character to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('budgetquest-character', JSON.stringify(playerCharacter));
  }, [playerCharacter]);

  const handleNavigate = (page: Page | 'play' | 'learn' | 'cards' | 'shop') => {
    setCurrentPage(page as Page);
  };

  const handleGameEnd = (score: number) => {
    setPlayerCharacter(prev => {
      const newTotalPoints = prev.totalPoints + Math.round(score);
      const newLevel = Math.floor(newTotalPoints / 500) + 1;
      return {
        ...prev,
        totalPoints: newTotalPoints,
        level: newLevel,
      };
    });
  };

  const handlePurchaseItem = (item: CustomizationItem) => {
    if (playerCharacter.totalPoints >= item.cost) {
      setPlayerCharacter(prev => ({
        ...prev,
        totalPoints: prev.totalPoints - item.cost,
        unlockedItems: [...prev.unlockedItems, item.id],
        [item.type]: item.value, // Auto-equip on purchase
      }));
    }
  };

  const handleEquipItem = (item: CustomizationItem) => {
    setPlayerCharacter(prev => ({
      ...prev,
      [item.type]: item.value,
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentPage === 'home' && (
            <HeroSection 
              onNavigate={handleNavigate} 
              playerCharacter={playerCharacter}
            />
          )}
          {currentPage === 'play' && (
            <GameBoard 
              playerCharacter={playerCharacter}
              onGameEnd={handleGameEnd}
            />
          )}
          {currentPage === 'learn' && <TutorialSection />}
          {currentPage === 'cards' && <CardGallery />}
        </motion.div>
      </AnimatePresence>

      {/* Shop Modal */}
      <AnimatePresence>
        {currentPage === 'shop' && (
          <CharacterShop
            character={playerCharacter}
            availablePoints={playerCharacter.totalPoints}
            onPurchase={handlePurchaseItem}
            onEquip={handleEquipItem}
            onClose={() => setCurrentPage('home')}
          />
        )}
      </AnimatePresence>
      
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
};

export default Index;
