import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayerCharacter, GameItem, API_URL } from '@/types/game';
import { PlayerCharacterComponent } from './PlayerCharacter';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ShoppingBag, Shirt, Sparkles, Lock, Check, Coins, ArrowLeft, Loader2, Glasses } from 'lucide-react';
import { api } from "@/hooks/Api";

// (Keep your VISUAL_ASSETS constant here...)
const VISUAL_ASSETS: Record<string, { icon: string; desc: string }> = {
  'default_outfit': { icon: '👕', desc: 'Your everyday look' },
  'business_suit': { icon: '👔', desc: 'Dress for success' },
  'cool_hoodie': { icon: '🧥', desc: 'Comfy and stylish' },
  'grad_cap': { icon: '🎓', desc: 'Proof of genius' },
  'red_cap': { icon: '🧢', desc: 'Cool vibes' },
  'shades': { icon: '🕶️', desc: 'Cool shades' },
  'gold_chain': { icon: '⛓️', desc: 'Bling bling' },
};

interface CharacterShopProps {
  userId: string;
  onClose: () => void;
}

type TabType = 'outfit' | 'hat' | 'glasses' | 'accessory';

export const CharacterShop = ({ userId, onClose }: CharacterShopProps) => {
  console.log("🔍 CharacterShop Component MOUNTED");

  const [activeTab, setActiveTab] = useState<TabType>('outfit');
  const [user, setUser] = useState<PlayerCharacter | null>(null);
  const [catalog, setCatalog] = useState<GameItem[]>([]);
  const [loading, setLoading] = useState(true); // Start true to show spinner
  const [previewUser, setPreviewUser] = useState<PlayerCharacter | null>(null);

  useEffect(() => {
    const loadData = async () => {
      console.log(`🔍 Fetching Shop Data for ${userId}...`);
      try {
        const [userData, catalogData] = await Promise.all([
          api.getProfile(userId),
          api.getShopCatalog()
        ]);

        console.log("🔍 Shop User:", userData);
        console.log("🔍 Shop Catalog:", catalogData);

        if (userData && !userData.inventory) userData.inventory = [];

        setUser(userData as PlayerCharacter);
        setPreviewUser(userData as PlayerCharacter);
        setCatalog(catalogData);
      } catch (err) {
        console.error("🔍 Shop Error:", err);
        toast.error("Failed to load shop");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [userId]);

  const handleBuy = async (item: GameItem) => {
    console.log(`🔍 Attempting to buy: ${item.id}`);
    if (!user) return;
    setLoading(true);
    try {
      const updatedUser = await api.buyItem(userId, item.id);
      console.log("🔍 Buy Success:", updatedUser);
      if (updatedUser) {
        setUser(updatedUser as PlayerCharacter);
        setPreviewUser(updatedUser as PlayerCharacter);
        toast.success(`Bought ${item.name}!`);
      }
    } catch (err: any) {
      console.error("🔍 Buy Failed:", err);
      toast.error(err.message || "Could not buy item");
    } finally {
      setLoading(false);
    }
  };

  // ... (keep handleEquip, handleHover, etc. exactly as they were) ...
  // (Just pasting the render part briefly to ensure it works)

  if (loading) return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center text-white">
      <Loader2 className="animate-spin w-10 h-10 mb-4" />
      <h2 className="text-xl">Loading Store...</h2>
      <p className="text-sm text-slate-400">Check console for logs if stuck.</p>
    </div>
  );

  if (!user) return <div className="fixed inset-0 z-50 bg-red-900 text-white p-10">ERROR: User failed to load.</div>;

  const currentItems = catalog.filter(i => i.type === activeTab);
  console.log(`🔍 Rendering ${currentItems.length} items for tab ${activeTab}`);

  return (
    <motion.div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex flex-col">
      {/* ... (Rest of your UI code goes here) ... */}
      {/* Just copy the UI return statement from the previous correct version */}
      <div className="p-4 border-b border-border flex justify-between bg-card">
        <button onClick={onClose} className="flex items-center gap-2"><ArrowLeft /> Back</button>
        <span className="font-bold">${user.stats.money}</span>
      </div>
      <div className="flex-1 flex">
        {/* TABS */}
        <div className="w-1/4 bg-slate-900 p-4">
          {['outfit', 'hat', 'glasses', 'accessory'].map(t => (
            <button key={t} onClick={() => setActiveTab(t as any)} className="block w-full text-left p-2 text-white capitalize">{t}</button>
          ))}
        </div>
        {/* GRID */}
        <div className="flex-1 p-4 grid grid-cols-3 gap-4">
          {currentItems.map(item => (
            <div key={item.id} onClick={() => handleBuy(item)} className="p-4 border rounded cursor-pointer hover:bg-slate-800">
              {item.name} (${item.price})
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};