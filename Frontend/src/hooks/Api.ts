import { 
  API_URL, 
  BackendUser, 
  SituationCard 
} from "@/types/game";

export const api = {
  // 1. LOAD: Get user profile (Matches Java 'User' class)
  getProfile: async (userId: string): Promise<BackendUser | null> => {
    try {
      const response = await fetch(`${API_URL}/profile/${userId}`);
      if (!response.ok) {
        if (response.status === 404) console.warn("User not found, returning defaults.");
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error("❌ API Error: Failed to load profile", error);
      return null;
    }
  },

  // 2. SAVE: Update user stats
  saveProfile: async (user: BackendUser): Promise<BackendUser | null> => {
    try {
      const response = await fetch(`${API_URL}/profile/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      
      if (!response.ok) throw new Error("Save failed");
      return await response.json();
    } catch (error) {
      console.error("❌ API Error: Failed to save profile", error);
      return null;
    }
  },

  // 3. PLAY: Get the Situation Cards (Matches Java 'Card' class)
  getCards: async (): Promise<SituationCard[]> => {
    try {
      const response = await fetch(`${API_URL}/cards`);
      if (!response.ok) throw new Error("Failed to fetch cards");
      return await response.json();
    } catch (error) {
      console.error("❌ API Error: Failed to fetch cards", error);
      return [];
    }
  },

  // 4. LEADERBOARD: Get top players
  getLeaderboard: async (sortBy: string = "overall"): Promise<BackendUser[]> => {
    try {
      const response = await fetch(`${API_URL}/leaderboard?sortBy=${sortBy}`);
      if (!response.ok) throw new Error("Failed to fetch leaderboard");
      return await response.json();
    } catch (error) {
      console.error("❌ API Error: Failed to fetch leaderboard", error);
      return [];
    }
  },

  
  makeChoice: async (userId: string, situationId: number, choiceIndex: number): Promise<BackendUser | null> => {
    try {
      const response = await fetch(`${API_URL}/choose`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ⚠️ CRITICAL: Must match Java 'ChoiceRequest' class fields!
        body: JSON.stringify({ 
          userId: userId, 
          situationId: situationId, 
          choiceIndex: choiceIndex 
        }),
      });

      if (!response.ok) throw new Error("Choice processing failed");
      
      // Returns the UPDATED User object (with new money/happiness)
      return await response.json();
    } catch (error) {
      console.error("❌ API Error:", error);
      return null;
    }
  }
};