import java.util.List;

import org.bson.codecs.pojo.annotations.BsonId;

public class Card {
    @BsonId
    public String id;
    public String situation;
    public List<Choice> choices;

    // 1. Main Empty Constructor
    public Card() {
    }

    // ---------------------------------------------------------
    // FIX: Inner classes must be 'public static' with Empty Constructors
    // ---------------------------------------------------------

    public static class Choice {
        public String text;
        public Effect effect;

        // FIX: Add this!
        public Choice() {
        }
    }

    public static class Effect {
        public double money;
        public int happiness;
        public int financeKnowledge;

        // FIX: Add this!
        public Effect() {
        }
    }
}