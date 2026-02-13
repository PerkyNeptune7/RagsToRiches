package ragstoriches;

import java.util.ArrayList;
import java.util.List;

import org.bson.codecs.pojo.annotations.BsonId;

public class User {
    @BsonId
    public String id; // This maps to MongoDB's _id
    public String name;
    public String email;
    public Appearance appearance;
    public Stats stats;
    public double overallScore;

    // NEW: List of Item IDs the user owns (e.g., ["default_outfit", "gold_chain"])
    public List<String> inventory;

    public User() {
        // Empty constructor required by MongoDB
    }

    // Factory method to create a new default user
    public static User createDefault(String id) {
        User u = new User();
        u.id = id;
        u.name = "Player " + id;
        u.appearance = new Appearance();
        u.inventory = new ArrayList<>();
        u.stats = new Stats();
        u.calculateScore();
        u.inventory.add("default_outfit");
        u.inventory.add("none_hat");
        u.inventory.add("none_glasses");
        u.inventory.add("none_accessory");
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
        // Updated to match Frontend Component slots
        public String outfit = "default"; // default, business, suit
        public String hat = "none"; // none, cap, grad_cap
        public String glasses = "none"; // none, shades, reading
        public String accessory = "none"; // none, gold_chain, watch

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