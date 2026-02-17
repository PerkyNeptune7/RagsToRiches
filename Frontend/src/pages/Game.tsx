import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameBoard } from '@/components/game/GameBoard';
import { PlayerCharacter, SituationCard, API_URL, BackendUser } from '@/types/game';
import { api } from '@/hooks/Api';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const USER_ID = "test_user_1";

const Game = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<PlayerCharacter | null>(null);
    const [cards, setCards] = useState<SituationCard[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch Game Data
    useEffect(() => {
        const loadGameData = async () => {
            try {
                const [uRes, cRes] = await Promise.all([
                    fetch(`${API_URL}/profile/${USER_ID}`),
                    fetch(`${API_URL}/cards`)
                ]);

                const userData = await uRes.json();
                const cardData = await cRes.json();

                setUser(userData);
                setCards(cardData);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load game data");
                navigate('/'); // Go back home on error
            } finally {
                setLoading(false);
            }
        };
        loadGameData();
    }, [navigate]);

    const handleGameEnd = async (score: number) => {
        if (!user) return;

        // 1. Calculate New Stats
        const newTotalPoints = (user.overallScore || 0) + Math.round(score);

        // 2. Prepare Payload
        const userToSave: BackendUser = {
            ...user,
            overallScore: newTotalPoints,
            stats: {
                ...user.stats,
                money: user.stats.money + score,
                financeKnowledge: user.stats.financeKnowledge + 10
            }
        };

        // 3. Save to Backend
        try {
            await api.saveProfile(userToSave);
            toast.success(`Game Over! You earned $${score}`);
            navigate('/'); // Return to Main Menu
        } catch (err) {
            toast.error("Failed to save progress");
        }
    };

    if (loading || !user) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-slate-900 text-white">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <GameBoard
                playerCharacter={user}
                cards={cards}
                onGameEnd={handleGameEnd}
            />
        </div>
    );
};

export default Game;