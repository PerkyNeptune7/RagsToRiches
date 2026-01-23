import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HeroSection } from '@/components/game/HeroSection';
import { GameBoard } from '@/components/game/GameBoard';
import { CardGallery } from '@/components/game/CardGallery';
import { TutorialSection } from '@/components/game/TutorialSection';
import { Navigation } from '@/components/game/Navigation';

type Page = 'home' | 'play' | 'learn' | 'cards';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const handleNavigate = (page: Page | 'play' | 'learn' | 'cards') => {
    setCurrentPage(page as Page);
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
          {currentPage === 'home' && <HeroSection onNavigate={handleNavigate} />}
          {currentPage === 'play' && <GameBoard />}
          {currentPage === 'learn' && <TutorialSection />}
          {currentPage === 'cards' && <CardGallery />}
        </motion.div>
      </AnimatePresence>
      
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
};

export default Index;
