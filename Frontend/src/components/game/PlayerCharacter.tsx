import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayerCharacter } from '@/types/game';

interface PlayerProps {
  character: PlayerCharacter;
  reaction?: 'neutral' | 'happy' | 'thinking' | 'sad';
  size?: 'sm' | 'lg';
}

export const PlayerCharacterComponent = ({
  character,
  reaction = 'neutral',
  size = 'lg'
}: PlayerProps) => {

  const c = {
    skin: '#fca5a5',      // Pinkish skin
    shirt: '#3b82f6',     // Blue Shirt (Default)
    suit: '#1e293b',      // Suit color
    black: '#1f2937',     // Lines & Eyes
    gold: '#fbbf24',
    cap: '#ef4444'
  };

  // --- ANIMATIONS ---

  // 1. Arm Animations (Stick arms)
  const leftArmAnim = {
    neutral: { d: "M 70 120 L 40 150" }, // Down by side
    happy: {
      d: ["M 70 120 L 30 100", "M 70 120 L 30 80", "M 70 120 L 30 100"], // Waving up
      transition: { duration: 0.3, repeat: Infinity }
    },
    thinking: { d: "M 70 120 L 40 150" }, // Down
    sad: { d: "M 70 125 L 50 170" } // Hanging low
  };

  const rightArmAnim = {
    neutral: { d: "M 130 120 L 160 150" }, // Down by side
    happy: {
      d: ["M 130 120 L 170 100", "M 130 120 L 170 80", "M 130 120 L 170 100"], // Waving up
      transition: { duration: 0.3, repeat: Infinity }
    },
    thinking: {
      d: ["M 130 120 L 150 90", "M 130 120 L 155 95", "M 130 120 L 150 90"], // Scratching chin
      transition: { duration: 1, repeat: Infinity }
    },
    sad: { d: "M 130 125 L 150 170" } // Hanging low
  };

  // 2. Body Jump
  const bodyAnim = {
    happy: { y: [0, -10, 0], transition: { duration: 0.4, repeat: Infinity } },
    sad: { y: 10, rotate: -5 },
    thinking: { rotate: 5 }
  };

  // Helper to render the Avatar SVG
  const renderAvatar = (mode: string) => (
    <motion.svg
      viewBox="0 0 200 200"
      className="w-full h-full drop-shadow-xl"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      variants={bodyAnim}
      animate={mode}
      style={{ overflow: 'visible' }}
    >

      {/* === LAYER 1: STICK LIMBS (Behind body) === */}
      {/* Left Arm */}
      <motion.path
        stroke={c.black} strokeWidth="6" strokeLinecap="round"
        variants={leftArmAnim} animate={mode}
      />
      {/* Right Arm */}
      <motion.path
        stroke={c.black} strokeWidth="6" strokeLinecap="round"
        variants={rightArmAnim} animate={mode}
      />
      {/* Legs */}
      <path d="M 85 190 L 85 220" stroke={c.black} strokeWidth="6" strokeLinecap="round" />
      <path d="M 115 190 L 115 220" stroke={c.black} strokeWidth="6" strokeLinecap="round" />


      {/* === LAYER 2: RECTANGLE CHEST === */}
      <rect
        x="65" y="110" width="70" height="80"
        fill={character.outfit === 'business' ? c.suit : c.shirt}
        stroke={c.black} strokeWidth="3"
        rx="5" // Slightly rounded corners
      />

      {/* Outfit Details */}
      {character.outfit === 'business' ? (
        // Tie
        <path d="M 100 110 L 100 160" stroke="#ef4444" strokeWidth="6" />
      ) : (
        // Hoodie Strings
        <g>
          <line x1="90" y1="110" x2="90" y2="140" stroke="white" strokeWidth="2" opacity="0.5" />
          <line x1="110" y1="110" x2="110" y2="140" stroke="white" strokeWidth="2" opacity="0.5" />
        </g>
      )}


      {/* === LAYER 3: ROUND HEAD === */}
      <circle cx="100" cy="70" r="40" fill={c.skin} stroke={c.black} strokeWidth="3" />


      {/* === LAYER 4: FACE === */}
      {/* Eyes */}
      <circle cx="85" cy="65" r="4" fill={c.black} />
      <circle cx="115" cy="65" r="4" fill={c.black} />

      {/* Mouth */}
      {mode === 'happy' && <path d="M 85 85 Q 100 95 115 85" stroke={c.black} strokeWidth="3" strokeLinecap="round" fill="none" />}
      {mode === 'sad' && <path d="M 85 90 Q 100 80 115 90" stroke={c.black} strokeWidth="3" strokeLinecap="round" fill="none" />}
      {mode === 'thinking' && <line x1="90" y1="90" x2="110" y2="90" stroke={c.black} strokeWidth="3" strokeLinecap="round" />}
      {mode === 'neutral' && <path d="M 90 85 Q 100 90 110 85" stroke={c.black} strokeWidth="3" strokeLinecap="round" fill="none" />}


      {/* === LAYER 5: ACCESSORIES === */}

      {/* Chain (on chest) */}
      {character.accessory === 'watch' && (
        <path d="M 80 110 Q 100 140 120 110" stroke={c.gold} strokeWidth="4" fill="none" />
      )}

      {/* Glasses (on face) */}
      {character.accessory === 'glasses' && (
        <g>
          <line x1="60" y1="65" x2="140" y2="65" stroke="black" strokeWidth="2" />
          <rect x="70" y="55" width="25" height="15" fill="black" opacity="0.8" rx="2" />
          <rect x="105" y="55" width="25" height="15" fill="black" opacity="0.8" rx="2" />
        </g>
      )}

      {/* Hat (on head) */}
      {character.accessory === 'hat' && (
        <path d="M 60 45 Q 100 10 140 45 L 140 50 H 60 Z" fill={c.cap} stroke={c.black} strokeWidth="2" />
      )}

    </motion.svg>
  );

  return (
    <>
      {/* 1. NORMAL HEADER VERSION */}
      <div
        className={`relative ${size === 'sm' ? 'w-24 h-24' : 'w-48 h-48'} transition-opacity duration-300`}
        style={{ opacity: reaction === 'happy' ? 0 : 1 }}
      >
        {renderAvatar(reaction)}
      </div>

      {/* 2. THE "HERO MOMENT" OVERLAY (Zooms Big) */}
      <AnimatePresence>
        {reaction === 'happy' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            {/* Confetti / Burst Background */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 flex items-center justify-center opacity-20"
            >
              <div className="w-[800px] h-[800px] bg-gradient-to-r from-yellow-500/50 to-blue-500/50 rounded-full blur-3xl" />
            </motion.div>

            {/* The Big Player */}
            <motion.div
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 2.5, y: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-64 h-64"
            >
              {renderAvatar('happy')}
            </motion.div>

            {/* Victory Text */}
            <motion.div
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 180 }}
              className="absolute text-white font-black text-4xl tracking-widest drop-shadow-[0_4px_0_#000]"
            >
              SMART MOVE!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};