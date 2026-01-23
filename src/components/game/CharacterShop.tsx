import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayerCharacter, CustomizationItem } from '@/types/game';
import { customizationItems, getItemsByType } from '@/data/customization';
import { PlayerCharacterComponent } from './PlayerCharacter';
import { cn } from '@/lib/utils';
import { 
  ShoppingBag, 
  Shirt, 
  Home, 
  Sparkles,
  Lock,
  Check,
  Coins,
  ArrowLeft
} from 'lucide-react';

interface CharacterShopProps {
  character: PlayerCharacter;
  availablePoints: number;
  onPurchase: (item: CustomizationItem) => void;
  onEquip: (item: CustomizationItem) => void;
  onClose: () => void;
}

type TabType = 'outfit' | 'house' | 'accessory';

export const CharacterShop = ({ 
  character, 
  availablePoints, 
  onPurchase, 
  onEquip,
  onClose 
}: CharacterShopProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('outfit');
  const [previewCharacter, setPreviewCharacter] = useState<PlayerCharacter>(character);

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'outfit', label: 'Outfits', icon: <Shirt className="w-4 h-4" /> },
    { id: 'house', label: 'Homes', icon: <Home className="w-4 h-4" /> },
    { id: 'accessory', label: 'Accessories', icon: <Sparkles className="w-4 h-4" /> },
  ];

  const currentItems = getItemsByType(activeTab);

  const isItemOwned = (item: CustomizationItem) => {
    return character.unlockedItems.includes(item.id) || item.unlocked;
  };

  const isItemEquipped = (item: CustomizationItem) => {
    switch (item.type) {
      case 'outfit':
        return character.outfit === item.value;
      case 'house':
        return character.house === item.value;
      case 'accessory':
        return character.accessory === item.value;
      default:
        return false;
    }
  };

  const handleItemClick = (item: CustomizationItem) => {
    if (isItemOwned(item)) {
      onEquip(item);
      // Update preview
      setPreviewCharacter(prev => ({
        ...prev,
        [item.type]: item.value,
      }));
    } else if (availablePoints >= item.cost) {
      onPurchase(item);
    }
  };

  const handlePreview = (item: CustomizationItem) => {
    setPreviewCharacter(prev => ({
      ...prev,
      [item.type]: item.value,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Game
        </button>
        
        <div className="flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-full">
          <Coins className="w-5 h-5 text-primary" />
          <span className="font-display text-lg text-primary">{availablePoints.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Character Preview */}
        <div className="w-1/3 border-r border-border p-6 flex flex-col items-center justify-center bg-gradient-to-b from-card to-background">
          <h2 className="font-display text-xl mb-6 text-center">
            <ShoppingBag className="w-5 h-5 inline mr-2" />
            Character Shop
          </h2>
          
          <PlayerCharacterComponent 
            character={previewCharacter} 
            size="lg" 
            showDetails 
          />

          <p className="text-sm text-muted-foreground mt-4 text-center">
            Earn points by playing wisely!
          </p>
        </div>

        {/* Shop Items */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-border">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 px-4 transition-colors",
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
          <div className="flex-1 overflow-auto p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {currentItems.map((item, index) => {
                  const owned = isItemOwned(item);
                  const equipped = isItemEquipped(item);
                  const canAfford = availablePoints >= item.cost;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      onMouseEnter={() => handlePreview(item)}
                      onMouseLeave={() => setPreviewCharacter(character)}
                      onClick={() => handleItemClick(item)}
                      className={cn(
                        "relative p-4 rounded-xl border-2 transition-all cursor-pointer",
                        "hover:scale-105 hover:shadow-lg",
                        equipped && "border-primary bg-primary/10",
                        owned && !equipped && "border-income/50 bg-income/5",
                        !owned && canAfford && "border-border hover:border-primary/50 bg-card",
                        !owned && !canAfford && "border-border bg-card/50 opacity-60"
                      )}
                    >
                      {/* Item Icon */}
                      <div className="text-4xl text-center mb-2">{item.icon}</div>
                      
                      {/* Item Name */}
                      <h3 className="font-display text-sm text-center mb-1">{item.name}</h3>
                      
                      {/* Description */}
                      <p className="text-xs text-muted-foreground text-center mb-3">
                        {item.description}
                      </p>

                      {/* Status / Price */}
                      <div className="flex justify-center">
                        {equipped ? (
                          <span className="flex items-center gap-1 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                            <Check className="w-3 h-3" />
                            Equipped
                          </span>
                        ) : owned ? (
                          <span className="text-xs text-income font-semibold">
                            Click to Equip
                          </span>
                        ) : (
                          <span className={cn(
                            "flex items-center gap-1 text-xs px-2 py-1 rounded-full",
                            canAfford ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                          )}>
                            {!canAfford && <Lock className="w-3 h-3" />}
                            <Coins className="w-3 h-3" />
                            {item.cost}
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
