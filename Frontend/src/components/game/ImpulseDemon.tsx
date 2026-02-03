import React from 'react';
import { motion } from 'framer-motion';
import { VillainState } from './VillainCharacter';

interface DemonProps {
    state: VillainState;
}

export const ImpulseDemon = ({ state }: DemonProps) => {
    // Palette
    const c = {
        base: '#a855f7',      // Purple (Normal)
        glow: '#d8b4fe',      // Light Purple
        dark: '#581c87',      // Dark Outline
        eyes: '#fdf4ff',      // White
        red: '#dc2626',       // <--- NEW: Evil Red
        scared: '#60a5fa',    // Blue (Scared skin)
        scaredDark: '#1e3a8a' // Dark Blue (Scared Outline)
    };

    // --- ANIMATIONS ---

    // 1. Body: Floats (Idle) vs Shivers (Scared)
    const bodyAnim = {
        idle: {
            y: [0, -8, 0],
            x: 0,
            rotate: 0,
            filter: "drop-shadow(0px 0px 10px rgba(168, 85, 247, 0.6))",
            transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const }
        },
        laughing: {
            scale: [1, 1.1, 1],
            filter: "drop-shadow(0px 0px 20px rgba(220, 38, 38, 0.8))", // Glow turns RED too!
            transition: { duration: 0.4, repeat: Infinity }
        },
        scared: {
            scale: 0.9,
            x: [-2, 2, -2, 2, 0],
            y: 5,
            rotate: [-1, 1, -1],
            filter: "drop-shadow(0px 0px 0px rgba(0,0,0,0))",
            transition: { duration: 0.1, repeat: Infinity }
        }
    };

    // 2. Jaw: Snaps (Laughing) vs Hangs Loose (Scared)
    const jawAnim = {
        idle: { y: 0, rotate: 0, x: 0 },
        laughing: {
            y: [0, 15, 0],
            transition: { duration: 0.2, repeat: Infinity }
        },
        scared: {
            y: 15,
            x: 5,
            rotate: 10,
            transition: { duration: 0.4, type: "spring" as const }
        }
    };

    // 3. Horns: Perky (Idle) vs Droopy (Scared)
    const leftHornAnim = {
        idle: { rotate: 0, y: 0 },
        laughing: { rotate: -10, transition: { duration: 0.2, repeat: Infinity, repeatType: "reverse" as const } },
        scared: { rotate: -45, y: 5, x: -5, transition: { duration: 0.5 } }
    };

    const rightHornAnim = {
        idle: { rotate: 0, y: 0 },
        laughing: { rotate: 10, transition: { duration: 0.2, repeat: Infinity, repeatType: "reverse" as const } },
        scared: { rotate: 45, y: 5, x: 5, transition: { duration: 0.5 } }
    };

    // 4. EYES: White (Idle) -> Red (Laughing) -> Blue (Scared)
    const eyeAnim = {
        idle: { scale: 1, fill: c.eyes },
        laughing: {
            scale: [1, 1.2, 1],
            fill: c.red, // <--- EYES TURN RED HERE
            transition: { duration: 0.2, repeat: Infinity }
        },
        scared: {
            scale: 0.8,
            fill: c.scared, // Eyes turn blue/dim
        }
    };

    // 5. Sweat Drops (Only appear when Scared)
    const sweatAnim = {
        idle: { opacity: 0, y: -10 },
        laughing: { opacity: 0 },
        scared: {
            opacity: [0, 1, 0],
            y: [0, 15],
            transition: { duration: 1, repeat: Infinity, ease: "easeOut" as const }
        }
    };

    return (
        <motion.svg
            width="100%"
            height="100%"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            animate={state}
            variants={bodyAnim}
            style={{ overflow: 'visible' }}
        >

            {/* === HORNS === */}
            <motion.path
                d="M70 50 L 50 30"
                stroke={state === 'scared' ? c.scaredDark : c.dark}
                strokeWidth="6" strokeLinecap="round"
                variants={leftHornAnim}
                style={{ originX: "70px", originY: "50px" }}
            />
            <motion.path
                d="M130 50 L 150 30"
                stroke={state === 'scared' ? c.scaredDark : c.dark}
                strokeWidth="6" strokeLinecap="round"
                variants={rightHornAnim}
                style={{ originX: "130px", originY: "50px" }}
            />

            {/* === TOP SKULL === */}
            <path
                d="M60 100 V 80 C 60 40, 140 40, 140 80 V 100 H 60 Z"
                fill={state === 'scared' ? c.scared : c.base}
                stroke={state === 'scared' ? c.scaredDark : c.dark}
                strokeWidth="4"
            />

            {/* === EYES (Animated) === */}
            <motion.g variants={eyeAnim}>
                <circle cx="85" cy="80" r="12" />
                <circle cx="115" cy="80" r="12" />

                {/* Pupils (Small dots) */}
                <motion.circle
                    cx="85" cy="80" r="4" fill={c.dark}
                    animate={state === 'scared' ? { r: 2 } : { r: 4 }}
                />
                <motion.circle
                    cx="115" cy="80" r="4" fill={c.dark}
                    animate={state === 'scared' ? { r: 2 } : { r: 4 }}
                />
            </motion.g>

            {/* === FLOATING JAW === */}
            <motion.g
                variants={jawAnim}
                style={{ originX: "100px", originY: "100px" }}
            >
                <path
                    d="M65 110 V 120 C 65 140, 135 140, 135 120 V 110 H 65 Z"
                    fill={state === 'scared' ? c.scared : c.base}
                    stroke={state === 'scared' ? c.scaredDark : c.dark}
                    strokeWidth="4"
                />
                {/* Teeth */}
                <path d="M85 110 V 125" stroke={state === 'scared' ? c.scaredDark : c.dark} strokeWidth="3" strokeLinecap="round" />
                <path d="M100 110 V 125" stroke={state === 'scared' ? c.scaredDark : c.dark} strokeWidth="3" strokeLinecap="round" />
                <path d="M115 110 V 125" stroke={state === 'scared' ? c.scaredDark : c.dark} strokeWidth="3" strokeLinecap="round" />
            </motion.g>

            {/* === SWEAT DROPS === */}
            <motion.path
                d="M45 60 Q 40 70, 45 80 Q 50 70, 45 60"
                fill="#3b82f6"
                variants={sweatAnim}
            />
            <motion.path
                d="M155 50 Q 150 60, 155 70 Q 160 60, 155 50"
                fill="#3b82f6"
                variants={sweatAnim}
                transition={{ delay: 0.2 }}
            />

        </motion.svg>
    );
};