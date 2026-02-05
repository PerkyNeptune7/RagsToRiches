package ragstoriches;

import org.bson.codecs.pojo.annotations.BsonId;

public class User {
    @BsonId
    public String id; // This maps to MongoDB's _id
    public String name;
    public String email;
    public Appearance appearance;
    public Stats stats;
    public double overallScore;

    public User() {
        // Empty constructor required by MongoDB
    }

    // Factory method to create a new default user
    public static User createDefault(String id) {
        User u = new User();
        u.id = id;
        u.name = "Player " + id;
        u.appearance = new Appearance();
        u.stats = new Stats();
        u.calculateScore();
        return u;
    }

    public void calculateScore() {
        if (this.stats != null) {
            this.overallScore = this.stats.money +
                    (this.stats.financeKnowledge * 10) + // Weighting knowledge
                    (this.stats.happiness * 5); // Weighting happiness
        }
    }

    // --- NESTED CLASSES ---

    public static class Appearance {
        public String shirtColor = "white";
        public String extraDetail = "none";

        public Appearance() {
        }
    }

    public static class Stats {
        public double money = 1000;
        public int financeKnowledge = 0;
        public int happiness = 100;

        public Stats() {
        }
    }
}