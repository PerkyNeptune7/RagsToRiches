import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, ArrowLeft, Loader2 } from 'lucide-react';
import { PlayerCharacter, BackendUser } from '@/types/game';
import { PlayerCharacterComponent } from './PlayerCharacter';
import { api } from "@/hooks/Api";

interface LeaderboardProps {
    onBack: () => void;
}

export const Leaderboard = ({ onBack }: LeaderboardProps) => {
    const [leaders, setLeaders] = useState<BackendUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaders = async () => {
            try {
                const data = await api.getLeaderboard("overall");
                setLeaders(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaders();
    }, []);

    if (loading) return (
        <div className="flex h-screen items-center justify-center text-primary">
            <Loader2 className="animate-spin w-8 h-8" />
        </div>
    );

    return (
        <div className="min-h-screen bg-background p-4 pb-24 relative overflow-y-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 pt-4">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-secondary rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Trophy className="w-8 h-8 text-yellow-500" />
                    Top Players
                </h1>
            </div>

            {/* Top 3 Podium */}
            <div className="flex justify-center items-end gap-2 mb-12 min-h-[220px]">
                {/* 2nd Place */}
                {leaders[1] && <PodiumUser user={leaders[1]} rank={2} color="text-slate-400" height="h-32" />}

                {/* 1st Place */}
                {leaders[0] && <PodiumUser user={leaders[0]} rank={1} color="text-yellow-500" height="h-48" />}

                {/* 3rd Place */}
                {leaders[2] && <PodiumUser user={leaders[2]} rank={3} color="text-amber-700" height="h-24" />}
            </div>

            {/* The Rest of the List */}
            <div className="max-w-md mx-auto space-y-3">
                {leaders.slice(3).map((user, index) => (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={user.id}
                        className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl shadow-sm"
                    >
                        <span className="font-bold text-muted-foreground w-6 text-center">{index + 4}</span>

                        {/* Mini Avatar Head */}
                        <div className="w-10 h-10 overflow-hidden rounded-full bg-secondary border border-border shrink-0 relative">
                            <div className="scale-150 translate-y-2 absolute inset-0 flex items-center justify-center">
                                <PlayerCharacterComponent character={user as unknown as PlayerCharacter} size="sm" />
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm truncate">{user.name}</h3>
                            <p className="text-xs text-muted-foreground">Level {Math.floor(user.stats.financeKnowledge / 10) + 1}</p>
                        </div>

                        <div className="text-right">
                            <span className="block font-bold text-primary">{Math.round(user.overallScore).toLocaleString()}</span>
                            <span className="text-[10px] uppercase text-muted-foreground">Score</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// Helper Component for the Top 3
const PodiumUser = ({ user, rank, color, height }: { user: BackendUser, rank: number, color: string, height: string }) => (
    <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col items-center"
    >
        {/* Avatar */}
        <div className="relative mb-2">
            {rank === 1 && <Crown className="absolute -top-8 left-1/2 -translate-x-1/2 text-yellow-500 w-8 h-8 animate-bounce" />}
            <div className={`w-16 h-16 rounded-full border-4 ${rank === 1 ? 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'border-border'} overflow-hidden bg-secondary relative`}>
                <div className="scale-150 translate-y-3 absolute inset-0 flex items-center justify-center">
                    <PlayerCharacterComponent character={user as unknown as PlayerCharacter} size="sm" />
                </div>
            </div>
            <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-background border shadow-sm flex items-center justify-center text-xs font-bold ${color}`}>
                {rank}
            </div>
        </div>

        {/* Name & Score */}
        <div className="text-center mb-2">
            <div className="font-bold text-xs truncate max-w-[80px]">{user.name}</div>
            <div className="font-black text-sm">{Math.round(user.overallScore).toLocaleString()}</div>
        </div>

        {/* Podium Block */}
        <div className={`w-20 ${height} bg-gradient-to-t from-secondary to-card rounded-t-lg border-x border-t border-border/50 shadow-inner flex items-end justify-center pb-2`}>
            <span className={`font-black text-4xl opacity-10 ${color}`}>{rank}</span>
        </div>
    </motion.div>
);