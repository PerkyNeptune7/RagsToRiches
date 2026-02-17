import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
// COMPONENTS
import { HeroSection } from '@/components/game/HeroSection';
import { GameBoard } from '@/components/game/GameBoard';
import { CharacterShop } from '@/components/game/CharacterShop';
import { Leaderboard } from '@/components/game/Leaderboard';
import { Navigation } from '@/components/game/Navigation';
import { TutorialSection } from '@/components/game/TutorialSection';
// TYPES & API
import { PlayerCharacter, BackendUser, SituationCard } from '@/types/game';
import { api } from "@/hooks/Api";
import { toast } from "sonner";
import { AuthPanel, AuthState } from '@/components/auth/AuthPanel';
import { Loader2 } from 'lucide-react';

// REMOVED 'cards' from this list
type Page = 'home' | 'play' | 'learn' | 'shop' | 'leaderboard';

const USER_ID = "test_user_1";

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<PlayerCharacter | null>(null);
  const [cards, setCards] = useState<SituationCard[]>([]);

  const [auth, setAuth] = useState<AuthState>({
    status: 'guest', userName: 'Guest', email: '',
  });

  const refreshGameData = useCallback(async () => {
    try {
      const [backendUser, backendCards] = await Promise.all([
        api.getProfile(USER_ID),
        api.getCards()
      ]);

      if (backendUser) setUser(backendUser as PlayerCharacter);
      if (backendCards) setCards(backendCards);
    } catch (err) {
      console.error(err);
      toast.error("Connection failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshGameData();
  }, [refreshGameData]);

  const handleGameEnd = async (score: number) => {
    if (!user) return;
    const newScore = (user.overallScore || 0) + score;
    const userToSave: BackendUser = {
      ...user,
      overallScore: newScore,
      stats: { ...user.stats, money: user.stats.money + score, financeKnowledge: user.stats.financeKnowledge + 10 }
    };
    await api.saveProfile(userToSave);
    toast.success("Progress Saved!");
    refreshGameData();
    setCurrentPage('home');
  };

  const handleLogin = (p: { email: string }) => { setAuth({ status: 'authenticated', userName: p.email, email: p.email }); return true; };
  const handleSignup = (p: { name: string, email: string }) => { setAuth({ status: 'authenticated', userName: p.name, email: p.email }); return true; };
  const handleLogout = () => { setAuth({ status: 'guest', userName: 'Guest', email: '' }); };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-900 text-white"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-sans pb-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.05),transparent_60%)]" />
      </div>

      <AuthPanel auth={auth} onLogin={handleLogin} onSignup={handleSignup} onLogout={handleLogout} />

      <AnimatePresence mode="wait">
        {/* HOME PAGE */}
        {currentPage === 'home' && user && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HeroSection onNavigate={handleNavigate} playerCharacter={user} />
          </motion.div>
        )}

        {/* GAME PAGE */}
        {currentPage === 'play' && user && (
          <motion.div key="play" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <GameBoard playerCharacter={user} onGameEnd={handleGameEnd} cards={cards} />
          </motion.div>
        )}

        {/* LEADERBOARD PAGE */}
        {currentPage === 'leaderboard' && (
          <motion.div key="leaderboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="z-20 relative">
            <Leaderboard onBack={() => setCurrentPage('home')} />
          </motion.div>
        )}

        {/* SHOP PAGE */}
        {currentPage === 'shop' && (
          <motion.div key="shop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="z-50 relative">
            <CharacterShop
              userId={USER_ID}
              onClose={() => {
                setCurrentPage('home');
                refreshGameData();
              }}
            />
          </motion.div>
        )}

        {/* LEARN PAGE */}
        {currentPage === 'learn' && (
          <motion.div key="learn" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="z-20 relative">
            <TutorialSection />
          </motion.div>
        )}
      </AnimatePresence>

      <Navigation currentPage={currentPage} onNavigate={(p) => setCurrentPage(p as Page)} />
    </div>
  );
};

export default Index;