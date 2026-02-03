import { motion } from 'framer-motion';
import { Home, Gamepad2, BookOpen, Layers, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';
type Page = 'home' | 'play' | 'learn' | 'cards' | 'shop';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems = [
  { id: 'home' as Page, label: 'Home', icon: Home },
  { id: 'play' as Page, label: 'Play', icon: Gamepad2 },
  { id: 'shop' as Page, label: 'Shop', icon: ShoppingBag },
  { id: 'learn' as Page, label: 'Learn', icon: BookOpen },
  { id: 'cards' as Page, label: 'Cards', icon: Layers },
];

export const Navigation = ({ currentPage, onNavigate }: NavigationProps) => {
  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
    >
      <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-2xl bg-card/80 backdrop-blur-lg border border-border shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'relative flex flex-col items-center gap-0.5 px-2 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-all',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
              <span className="text-[10px] sm:text-xs font-medium relative z-10">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
};
