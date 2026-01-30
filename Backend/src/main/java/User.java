import org.bson.codecs.pojo.annotations.BsonId;

// 1. The Main User Class
public class User {
    @BsonId
    public String id;          // Matches MongoDB _id
    public String name;
    public String email;
    public Appearance appearance;
    public Stats stats;
    public double overallScore; // The calculated total

    // 2. The Constructor (Initialize with defaults)
    public User() {
        this.appearance = new Appearance();
        this.stats = new Stats();
    }

    // 3. The "Backend Math" Logic
    public void calculateScore() {
        if (this.stats != null) {
            this.overallScore = this.stats.money + 
                                this.stats.financeKnowledge + 
                                this.stats.happiness;
        }
    }

    public Appearance getAppearance() {
        return appearance;
    }

    public void setAppearance(Appearance appearance) {
        this.appearance = appearance;
    }

    public Stats getStats() {
        return stats;
    }

    public void setStats(Stats stats) {
        this.stats = stats;
    }
}

// Nested Classes for Structure
class Appearance {
    public String shirtColor = "white"; // Default
    public String extraDetail = "none";
}

class Stats {
    public double money = 1000;         // Default Start
    public int financeKnowledge = 0;
    public int happiness = 100;
}