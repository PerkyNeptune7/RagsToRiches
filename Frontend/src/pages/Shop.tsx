import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CharacterShop } from "@/components/game/CharacterShop";

const USER_ID = "test_user_1";

const Shop = () => {
    const navigate = useNavigate();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        console.log("✅ Shop Page Mounted");
        setMounted(true);
    }, []);

    if (!mounted) return <div className="p-10 text-red-500">Initializing Shop Route...</div>;

    return (
        <div className="w-full h-screen bg-slate-900 flex items-center justify-center">
            {/* If CharacterShop crashes, this Error Boundary text won't show, 
         but the console will catch it.
      */}
            <CharacterShop
                userId={USER_ID}
                onClose={() => {
                    console.log("🔙 Closing Shop, returning Home");
                    navigate('/');
                }}
            />
        </div>
    );
};

export default Shop;