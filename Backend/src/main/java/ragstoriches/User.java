package ragstoriches;

import org.bson.codecs.pojo.annotations.BsonId;

public class User {
    @BsonId
    public String id;
    public String name;
    public String email;
    public Appearance appearance;
    public Stats stats;
    public double overallScore;

    public User() {
        this.appearance = new Appearance();
        this.stats = new Stats();
    }

    public void calculateScore() {
        if (this.stats != null) {
            this.overallScore = this.stats.money +
                    this.stats.financeKnowledge +
                    this.stats.happiness;
        }
    }

    // ---------------------------------------------------------
    // FIX: Must be 'public static' so Mongo can create them
    // ---------------------------------------------------------
    public static class Appearance {
        public String shirtColor = "white";
        public String extraDetail = "none";

        // FIX: Add explicit public empty constructor
        public Appearance() {
        }
    }

    public static class Stats {
        public double money = 1000;
        public int financeKnowledge = 0;
        public int happiness = 100;

        // FIX: Add explicit public empty constructor
        public Stats() {
        }
    }
}