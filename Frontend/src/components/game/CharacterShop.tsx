import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayerCharacter, GameItem, API_URL } from '@/types/game';
import { PlayerCharacterComponent } from './PlayerCharacter';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import React from 'react';
import {
  ShoppingBag, Shirt, Home, Sparkles, Lock, Check, Coins, ArrowLeft, Loader2
} from 'lucide-react';

// --- 1. VISUAL MAPPING ---
// Maps your Backend IDs to Frontend Icons/Descriptions
// Ensure your MongoDB _id's match these keys!
const VISUAL_ASSETS: Record<string, { icon: string; desc: string }> = {
  // Outfits
  'default_outfit': { icon: '👕', desc: 'Your everyday look' },
  'business_suit': { icon: '👔', desc: 'Dress for success' },
  'cool_hoodie': { icon: '🧥', desc: 'Comfy and stylish' },
  'fancy_suit': { icon: '🎩', desc: 'Top-tier sophistication' }, // Add to DB if missing

  // Hats
  'none_hat': { icon: '✨', desc: 'No hat' },
  'red_cap': { icon: '🧢', desc: 'Cool vibes only' },
  'grad_cap': { icon: '🎓', desc: 'Proof of genius' },

  // Glasses
  'none_glasses': { icon: '👀', desc: '20/20 Vision' },
  'shades': { icon: '🕶️', desc: 'The future is bright' },

  // Accessories
  'none_accessory': { icon: '✨', desc: 'Keep it simple' },
  'gold_chain': { icon: '⛓️', desc: 'Pure 24k gold' },
  'watch': { icon: '⌚', desc: 'Time is money' },
};

interface CharacterShopProps {
  userId: string;  // We need ID to fetch data
  onClose: () => void;
}

type TabType = 'outfit' | 'hat' | 'glasses' | 'accessory';

export const CharacterShop = ({ userId, onClose }: CharacterShopProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('outfit');

  // State for Real Data
  const [user, setUser] = useState<PlayerCharacter | null>(null);
  const [catalog, setCatalog] = useState<GameItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Preview State (Visual only)
  const [previewUser, setPreviewUser] = useState<PlayerCharacter | null>(null);

  // --- 2. FETCH DATA ON MOUNT ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const [uRes, cRes] = await Promise.all([
          fetch(`${API_URL}/profile/${userId}`),
          fetch(`${API_URL}/shop/catalog`)
        ]);

        const userData = await uRes.json();
        const catalogData = await cRes.json();

        setUser(userData);
        setPreviewUser(userData);
        setCatalog(catalogData);
      } catch (err) {
        console.error("Shop Error:", err);
        toast.error("Failed to load shop");
      }
    };
    loadData();
  }, [userId]);

  // --- 3. ACTIONS ---

  const handleBuy = async (item: GameItem) => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/shop/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, itemId: item.id })
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt);
      }

      const updatedUser = await res.json();
      setUser(updatedUser);
      setPreviewUser(updatedUser);
      toast.success(`Bought ${item.name}!`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not buy item");
    } finally {
      setLoading(false);
    }
  };

  const handleEquip = async (item: GameItem) => {
    if (!user) return;
    setLoading(true); // Small loading state prevents spam clicking
    try {
      const res = await fetch(`${API_URL}/shop/equip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, itemId: item.id })
      });

      const updatedUser = await res.json();
      setUser(updatedUser);
      setPreviewUser(updatedUser);
      toast.success(`Equipped ${item.name}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to equip");
    } finally {
      setLoading(false);
    }
  };

  // --- 4. HELPERS ---
  const isOwned = (itemId: string) => user?.inventory?.includes(itemId);

  const isEquipped = (itemId: string) => {
    if (!user) return false;
    // Check against the correct slot in appearance
    return Object.values(user.appearance).includes(itemId);
  };

  // Preview logic on hover
  const handleHoverPreview = (item: GameItem) => {
    if (!previewUser) return;
    // Create a temp copy of user with this item "worn"
    const tempApp = { ...previewUser.appearance };

    // Map item type to appearance key
    if (item.type === 'outfit') tempApp.outfit = item.id;
    if (item.type === 'hat') tempApp.hat = item.id;
    if (item.type === 'glasses') tempApp.glasses = item.id;
    if (item.type === 'accessory') tempApp.accessory = item.id;

    setPreviewUser({ ...previewUser, appearance: tempApp });
  };

  const resetPreview = () => {
    setPreviewUser(user);
  };

  if (!user || !previewUser) return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center text-white">
      <Loader2 className="animate-spin mr-2" /> Loading Store...
    </div>
  );

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'outfit', label: 'Outfits', icon: <Shirt className="w-4 h-4" /> },
    { id: 'hat', label: 'Hats', icon: <Sparkles className="w-4 h-4" /> }, // Changed House to Hat for now
    { id: 'glasses', label: 'Glasses', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'accessory', label: 'Bling', icon: <Sparkles className="w-4 h-4" /> },
  ];

  // Filter items for current tab
  const currentItems = catalog.filter(i => i.type === activeTab);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-card">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Game
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-full border border-primary/20">
            <Coins className="w-5 h-5 text-primary" />
            <span className="font-display text-lg text-primary font-bold">
              ${user.stats.money.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Character Preview Panel */}
        <div className="w-1/3 border-r border-border p-6 flex flex-col items-center justify-center bg-gradient-to-b from-card to-background">
          <h2 className="font-display text-xl mb-6 text-center flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Your Look
          </h2>

          <div className="scale-125 p-10">
            {/* Passing the LIVE previewUser here allows hover effects */}
            <PlayerCharacterComponent
              character={previewUser}
              size="lg"
              reaction="happy"
            />
          </div>

          <p className="text-sm text-muted-foreground mt-8 text-center bg-secondary/50 p-3 rounded-lg">
            Hover items to preview. <br /> Click to Buy or Equip.
          </p>
        </div>

        {/* Shop Items Panel */}
        <div className="flex-1 flex flex-col bg-background">
          {/* Tabs */}
          <div className="flex border-b border-border bg-card">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-4 px-4 transition-all font-bold",
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {currentItems.map((item, index) => {
                  const owned = isOwned(item.id);
                  const equipped = isEquipped(item.id);
                  const canAfford = user.stats.money >= item.price;

                  // Get Visuals from local map, fallback to simple defaults
                  const visual = VISUAL_ASSETS[item.id] || { icon: '❓', desc: item.description };

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onMouseEnter={() => handleHoverPreview(item)}
                      onMouseLeave={resetPreview}
                      onClick={() => owned ? handleEquip(item) : handleBuy(item)}
                      className={cn(
                        "relative p-4 rounded-xl border-2 transition-all cursor-pointer group",
                        "hover:shadow-lg",
                        equipped
                          ? "border-green-500 bg-green-500/10"
                          : owned
                            ? "border-slate-600 bg-slate-800/50"
                            : canAfford
                              ? "border-border hover:border-blue-400 bg-card"
                              : "border-border bg-card/50 opacity-60 grayscale"
                      )}
                    >
                      {/* Item Icon */}
                      <div className="text-4xl text-center mb-3 group-hover:scale-110 transition-transform">
                        {visual.icon}
                      </div>

                      {/* Item Name */}
                      <h3 className="font-bold text-sm text-center mb-1">{item.name}</h3>

                      {/* Description */}
                      <p className="text-xs text-muted-foreground text-center mb-3 line-clamp-2 min-h-[2.5em]">
                        {visual.desc}
                      </p>

                      {/* Status / Price Button */}
                      <div className="flex justify-center mt-auto">
                        {equipped ? (
                          <span className="flex items-center gap-1 text-xs bg-green-600 text-white px-3 py-1 rounded-full font-bold shadow-sm">
                            <Check className="w-3 h-3" /> Equipped
                          </span>
                        ) : owned ? (
                          <span className="text-xs text-slate-400 font-semibold border border-slate-600 px-3 py-1 rounded-full group-hover:bg-slate-700 group-hover:text-white transition-colors">
                            Click to Equip
                          </span>
                        ) : (
                          <span className={cn(
                            "flex items-center gap-1 text-xs px-3 py-1 rounded-full font-bold transition-colors",
                            canAfford
                              ? "bg-blue-600 text-white group-hover:bg-blue-500"
                              : "bg-slate-700 text-slate-400"
                          )}>
                            {!canAfford && <Lock className="w-3 h-3" />}
                            <Coins className="w-3 h-3" />
                            {item.price}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};