import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EvilCharacter } from '@/types/game';
import { ImpulseDemon } from './ImpulseDemon';
// import { AnimatedShark } from './AnimatedShark'; // Uncomment if you switch back to shark

export type VillainState = 'idle' | 'laughing' | 'scared';

interface VillainProps {
  character: EvilCharacter;
  state: VillainState;
  health: number;
  maxHealth: number;
  damage?: number;
}

export const VillainCharacter = ({ state, health, maxHealth, damage }: VillainProps) => {

  // Helper to render the specific avatar (Shark or Demon)
  const renderAvatar = (mode: VillainState) => {
    // If you have multiple characters, switch them here. 
    // For now, we use the Impulse Demon you liked.
    return <ImpulseDemon state={mode} />;
  };

  return (
    <>
      {/* =========================================================
          1. THE "NORMAL" HEADER VILLAIN
          This stays in the game board header.
          We lower its opacity to 0 when he jumps to the center
          so it looks like he actually moved.
      ========================================================= */}
      <div className="relative flex flex-col items-center justify-end h-32 w-24 md:h-48 md:w-32 transition-opacity duration-300"
        style={{ opacity: state === 'laughing' ? 0 : 1 }}
      >

        {/* Damage Number Popup */}
        <AnimatePresence>
          {damage && damage > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: 1, y: -50, scale: 1.5 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 z-20 font-black text-4xl text-red-500 drop-shadow-lg"
            >
              -{damage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Health Bar */}
        <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden mb-2 border border-slate-700 relative">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-700 to-purple-500"
            initial={{ width: "100%" }}
            animate={{ width: `${(health / maxHealth) * 100}%` }}
            transition={{ type: "spring", stiffness: 100 }}
          />
        </div>

        {/* The Avatar (Small) */}
        <div className="w-full h-full">
          {renderAvatar(state)}
        </div>
      </div>


      {/* =========================================================
          2. THE "JUMPSCARE" OVERLAY (Huge Version)
          This only appears when state === 'laughing'
      ========================================================= */}
      <AnimatePresence>
        {state === 'laughing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            {/* The Huge Villain Container */}
            <motion.div
              initial={{ scale: 0.5, rotate: -10, y: 100 }}
              animate={{
                scale: 2.5,   // Make him HUGE (2.5x normal size)
                rotate: 0,
                y: 0
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-64 h-64 md:w-96 md:h-96" // Base size before scaling
            >
              {renderAvatar('laughing')}
            </motion.div>

            {/* Optional: Text that appears below him */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 150 }}
              className="absolute text-red-500 font-black text-4xl tracking-widest uppercase drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]"
            >
              MUHAHAHA!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};