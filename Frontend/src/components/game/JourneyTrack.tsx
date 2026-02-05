import React from 'react';
import { motion } from 'framer-motion';
import { PlayerCharacter } from '@/types/game';
import { Flag } from 'lucide-react';

interface JourneyTrackProps {
    currentRound: number;
    totalRounds: number;
    character: PlayerCharacter;
}

export const JourneyTrack = ({ currentRound, totalRounds, character }: JourneyTrackProps) => {
    // Calculate percentage (0% to 100%)
    // Use (totalRounds - 1) to ensure the final step lands exactly on the flag ends
    const safeTotal = Math.max(1, totalRounds - 1);
    const progress = Math.min(100, (currentRound / safeTotal) * 100);

    const c = {
        skin: '#fca5a5',
        cap: '#ef4444',
        gold: '#fbbf24',
    };

    // CSS style for the track texture (dashed lines)
    const trackTexture = {
        backgroundImage: `
      linear-gradient(to bottom, transparent 45%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0.4) 55%, transparent 55%), /* Center solid line */
      repeating-linear-gradient(to right, transparent, transparent 20px, rgba(255,255,255,0.2) 20px, rgba(255,255,255,0.2) 30px) /* Vertical dashes */
    `,
        backgroundSize: '100% 100%'
    };

    return (
        <div className="w-full max-w-4xl mx-auto mb-8 px-4 relative z-0">
            {/* Labels */}
            <div className="flex justify-between text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider px-2">
                <span>Start</span>
                <span>Financial Freedom</span>
            </div>

            <div className="relative h-10 w-full flex items-center">

                {/* ==============================
            1. THE RUNNING TRACK BASE
        ============================== */}
                <div
                    className="absolute w-full h-8 bg-slate-800 rounded-full overflow-hidden border-2 border-slate-700 shadow-inner"
                    style={trackTexture}
                >
                    {/* Progress Highlight Overlay (Semi-transparent blue cover) */}
                    <motion.div
                        className="h-full bg-blue-500/40 backdrop-blur-[1px]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: "spring", stiffness: 50, damping: 20 }}
                    />
                </div>


                {/* ==============================
            2. FINISH LINE FLAG
        ============================== */}
                <div className="absolute -right-1 z-10 bg-slate-900 p-1.5 rounded-full border-2 border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                    <Flag className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                </div>


                {/* ==============================
            3. THE MINI PLAYER MARKER
        ============================== */}
                <motion.div
                    className="absolute z-20 top-1/2"
                    initial={{ left: '0%' }}
                    animate={{ left: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                    //Center the avatar horizontally on the point, lift slightly above track
                    style={{ x: '-50%', y: '-65%' }}
                >
                    {/* The Mini Head SVG */}
                    <div className="relative w-12 h-12 drop-shadow-lg transition-transform hover:scale-110">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                            {/* White border for contrast against dark track */}
                            <circle cx="50" cy="50" r="42" fill="none" stroke="white" strokeWidth="4" />
                            {/* Head Circle */}
                            <circle cx="50" cy="50" r="40" fill={c.skin} stroke="#1f2937" strokeWidth="3" />

                            {/* Eyes */}
                            <circle cx="35" cy="45" r="5" fill="#1f2937" />
                            <circle cx="65" cy="45" r="5" fill="#1f2937" />

                            {/* Determined Smile */}
                            <path d="M 35 65 Q 50 70 65 65" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" fill="none" />

                            {/* Mini Accessories - Consistent with main player */}
                            {character.accessory === 'hat' && (
                                <path d="M 10 30 Q 50 -10 90 30 L 90 35 H 10 Z" fill={c.cap} stroke="#1f2937" strokeWidth="2" />
                            )}
                            {character.accessory === 'glasses' && (
                                <g>
                                    <rect x="25" y="35" width="20" height="12" fill="black" rx="2" opacity="0.8" />
                                    <rect x="55" y="35" width="20" height="12" fill="black" rx="2" opacity="0.8" />
                                    <line x1="15" y1="41" x2="85" y2="41" stroke="black" strokeWidth="2" />
                                </g>
                            )}
                        </svg>

                        {/* Round Counter Bubble */}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap border border-slate-700">
                            Round {currentRound + 1}
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};