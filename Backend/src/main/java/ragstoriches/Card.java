package ragstoriches;

import java.util.List;

import org.bson.BsonType;
import org.bson.codecs.pojo.annotations.BsonId;
import org.bson.codecs.pojo.annotations.BsonRepresentation;

public class Card {
    @BsonId
    @BsonRepresentation(BsonType.OBJECT_ID)
    public String _id;

    // Matches "situationId": 1
    public int situationId;

    // Matches "scenario": "..."
    public String scenario;

    // Matches "options": [...]
    public List<Option> options;

    public Card() {
    }

    public static class Option {
        // Matches "text": "..."
        public String text;

        // Matches "effect": {...}
        public Effect effect;

        public Option() {
        }
    }

    public static class Effect {
        // Must be String to handle both "-600" and "++"
        public String money;
        public String happiness;
        public String financeKnowledge;

        public Effect() {
        }
    }
}