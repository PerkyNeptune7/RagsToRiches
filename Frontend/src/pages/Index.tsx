import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HeroSection } from '@/components/game/HeroSection';
import { GameBoard } from '@/components/game/GameBoard';
import { CardGallery } from '@/components/game/CardGallery';
import { TutorialSection } from '@/components/game/TutorialSection';
import { Navigation } from '@/components/game/Navigation';
import { CharacterShop } from '@/components/game/CharacterShop';
import { PlayerCharacter, CustomizationItem, BackendUser, SituationCard } from '@/types/game';
import { api } from "@/hooks/Api"; // Ensure this matches where you created api.ts
import { toast } from "sonner";
import { AuthPanel, AuthState } from '@/components/auth/AuthPanel';
type Page = 'home' | 'play' | 'learn' | 'cards' | 'shop';

// Default visuals (Backend doesn't store clothes yet, so we keep this local)
const defaultVisuals = {
  outfit: 'default',
  house: 'apartment',
  accessory: 'none',
  skinColor: 'medium',
  unlockedItems: ['outfit-default', 'house-apartment', 'accessory-none'],
} as const;

const AUTH_STORAGE_KEY = 'budgetquest-auth';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [loading, setLoading] = useState(true);

  // 1. NEW: State to hold the cards fetched from MongoDB
  const [cards, setCards] = useState<SituationCard[]>([]);

  // Initialize Player State
  const [playerCharacter, setPlayerCharacter] = useState<PlayerCharacter>(() => {
    // Try to load local visuals (clothes/skin)
    const saved = localStorage.getItem('budgetquest-character');
    const parsed = saved ? JSON.parse(saved) : {};

    // Return merged object (Default Stats + Saved Visuals)
    return {
      name: 'Student',
      ...defaultVisuals,
      ...parsed,
      level: 1,
      totalPoints: 0,
      stats: { money: 1000, happiness: 50, financeKnowledge: 0 }
    };
  });

  const [auth, setAuth] = useState<AuthState>({
    status: 'guest',
    userName: 'Guest',
    email: '',
  });

  // -------------------------------------------
  // 2. LOAD GAME (Sync with Java Backend)
  // -------------------------------------------
  useEffect(() => {
    const loadBackendData = async () => {
      try {
        // TODO: Replace with real session check from backend.
        const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
        if (savedAuth) {
          try {
            const parsedAuth = JSON.parse(savedAuth) as AuthState;
            setAuth(parsedAuth);
            setPlayerCharacter(prev => ({
              ...prev,
              name: parsedAuth.userName || prev.name,
            }));
          } catch (error) {
            console.warn("Invalid auth cache, clearing.", error);
            localStorage.removeItem(AUTH_STORAGE_KEY);
          }
        }

        const userId = "test-student-001"; // Hardcoded for prototype

        // FETCH BOTH USER AND CARDS
        const [backendUser, backendCards] = await Promise.all([
          api.getProfile(userId),
          api.getCards()
        ]);

        // A. Sync User Profile
        if (backendUser) {
          setPlayerCharacter(prev => ({
            ...prev,
            name: backendUser.name,
            totalPoints: Math.round(backendUser.overallScore),
            level: Math.floor(backendUser.stats.financeKnowledge / 100) + 1,
            stats: backendUser.stats
          }));
          toast.success("Sync successful: Profile loaded!");
        }

        // B. Sync Cards
        if (backendCards && backendCards.length > 0) {
          setCards(backendCards);
          console.log("🃏 Cards loaded from DB:", backendCards);
        }

      } catch (err) {
        console.error("Backend load failed", err);
        toast.error("Playing in Offline Mode");
      } finally {
        setLoading(false);
      }
    };

    loadBackendData();
  }, []);

  // -------------------------------------------
  // 3. SAVE VISUALS (Local Storage Only)
  // -------------------------------------------
  useEffect(() => {
    const visualData = {
      outfit: playerCharacter.outfit,
      house: playerCharacter.house,
      accessory: playerCharacter.accessory,
      skinColor: playerCharacter.skinColor,
      unlockedItems: playerCharacter.unlockedItems
    };
    localStorage.setItem('budgetquest-character', JSON.stringify(visualData));
  }, [playerCharacter]);

  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  }, [auth]);

  const handleNavigate = (page: Page | 'play' | 'learn' | 'cards' | 'shop') => {
    setCurrentPage(page as Page);
  };

  // -------------------------------------------
  // 4. GAME OVER (Send Stats to Java)
  // -------------------------------------------
  const handleGameEnd = async (score: number) => {
    // A. Update Local State first (Instant feedback)
    setPlayerCharacter(prev => {
      const newTotalPoints = prev.totalPoints + Math.round(score);
      const newLevel = Math.floor(newTotalPoints / 500) + 1;

      // B. Create the payload for Java
      const userToSave: BackendUser = {
        id: "test-student-001",
        name: prev.name,
        // Map local 'outfit' to backend 'appearance'
        appearance: {
          shirtColor: prev.outfit,
          extraDetail: prev.accessory
        },
        overallScore: newTotalPoints,
        stats: {
          money: prev.stats.money,
          happiness: prev.stats.happiness,
          financeKnowledge: prev.stats.financeKnowledge + 10
        }
      };

      // C. Send to Backend
      api.saveProfile(userToSave).then(() => {
        toast.success("Progress Saved to Database!");
      });

      return {
        ...prev,
        totalPoints: newTotalPoints,
        level: newLevel,
      };
    });
  };

  const handlePurchaseItem = (item: CustomizationItem) => {
    if (playerCharacter.totalPoints >= item.cost) {
      setPlayerCharacter(prev => {
        const newState = {
          ...prev,
          totalPoints: prev.totalPoints - item.cost,
          unlockedItems: [...prev.unlockedItems, item.id],
          [item.type]: item.value,
        };
        return newState;
      });
      toast.success(`Bought ${item.name}!`);
    } else {
      toast.error("Not enough points!");
    }
  };

  const handleEquipItem = (item: CustomizationItem) => {
    setPlayerCharacter(prev => ({
      ...prev,
      [item.type]: item.value,
    }));
  };

  const handleLogin = (payload: { email: string; password: string }) => {
    if (!payload.email || !payload.password) {
      toast.error("Please enter your email and password.");
      return false;
    }
    // TODO: Call backend login endpoint and return authenticated user profile.
    const displayName = payload.email.split('@')[0] || 'Player';
    setAuth({
      status: 'authenticated',
      userName: displayName,
      email: payload.email,
    });
    setPlayerCharacter(prev => ({
      ...prev,
      name: displayName,
    }));
    toast.success(`Welcome back, ${displayName}!`);
    return true;
  };

  const handleSignup = (payload: { name: string; email: string; password: string }) => {
    if (!payload.name || !payload.email || !payload.password) {
      toast.error("Please fill out all fields.");
      return false;
    }
    // TODO: Call backend signup endpoint and return authenticated user profile.
    setAuth({
      status: 'authenticated',
      userName: payload.name,
      email: payload.email,
    });
    setPlayerCharacter(prev => ({
      ...prev,
      name: payload.name,
    }));
    toast.success(`Account created. Welcome, ${payload.name}!`);
    return true;
  };

  const handleLogout = () => {
    // TODO: Call backend logout endpoint and clear server session.
    setAuth({
      status: 'guest',
      userName: 'Guest',
      email: '',
    });
    setPlayerCharacter(prev => ({
      ...prev,
      name: 'Guest',
    }));
    toast.message("You're now playing as a guest.");
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading Data...</div>;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.08),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(59,130,246,0.08),transparent_50%)]" />
      </div>

      <AuthPanel auth={auth} onLogin={handleLogin} onSignup={handleSignup} onLogout={handleLogout} />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 pb-28"
        >
          {currentPage === 'home' && (
            <>
              <HeroSection
                onNavigate={handleNavigate}
                playerCharacter={playerCharacter}
              />

              {/* 🔌 DEBUG SECTION: DATABASE CONNECTION TEST */}
              {cards.length > 0 && (
                <div className="mx-auto mt-8 max-w-2xl rounded-xl border border-yellow-400 bg-yellow-50 p-6 shadow-md">
                  <h3 className="mb-2 text-lg font-bold text-yellow-800">🔌 MongoDB Connection Test</h3>
                  <p className="text-sm text-yellow-700">Successfully fetched {cards.length} cards from Atlas:</p>

                  <div className="mt-4 rounded bg-white p-4 shadow-sm border border-yellow-200">
                    <p className="font-semibold text-gray-800">Situation #1 Preview:</p>
                    <p className="text-lg italic text-gray-600">&quot;{cards[0].scenario}&quot;</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {cards[0].options.map((c, i) => (
                        <span key={i} className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                          Option: {c.text}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {currentPage === 'play' && (
            <GameBoard
              playerCharacter={playerCharacter}
              onGameEnd={handleGameEnd}
              cards={cards}
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
