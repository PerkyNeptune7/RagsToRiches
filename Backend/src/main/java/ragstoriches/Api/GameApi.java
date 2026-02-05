package ragstoriches.Api;

import java.util.ArrayList;
import java.util.List;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Sorts;

import ragstoriches.Card;
import ragstoriches.StatsCalculator;
import ragstoriches.User;
import ragstoriches.database.MongoDB;

public class GameApi {
    private final MongoCollection<Card> cardCollection;
    private final MongoCollection<User> userCollection;
    private final StatsCalculator calculator;

    public GameApi(StatsCalculator calculator) {
        this.calculator = calculator;
        this.cardCollection = MongoDB.getDatabase().getCollection("cards", Card.class);
        this.userCollection = MongoDB.getDatabase().getCollection("users", User.class);
    }

    // --- READS ---

    public List<Card> getAllCards() {
        return cardCollection.find().into(new ArrayList<>());
    }

    public User getUser(String userId) {
        return userCollection.find(Filters.eq("_id", userId)).first();
    }

    public List<User> getLeaderboard() {
        return userCollection.find()
                .sort(Sorts.descending("overallScore")) // Sort by score, not money
                .limit(10)
                .into(new ArrayList<>());
    }

    // --- WRITES ---

    public User createUser(String userId) {
        // Use our new Factory method to ensure stats exist
        User newUser = User.createDefault(userId);
        userCollection.insertOne(newUser);
        return newUser;
    }

    public User saveUser(User user) {
        user.calculateScore(); // Recalculate score before saving
        userCollection.replaceOne(Filters.eq("_id", user.id), user);
        return user;
    }

    // --- GAMEPLAY ---

    public User processChoice(String userId, int situationId, int choiceIndex) {
        // 1. Get User (or create temp if testing)
        User user = getUser(userId);
        if (user == null)
            user = createUser(userId);

        // 2. Get Card
        Card card = cardCollection.find(Filters.eq("situationId", situationId)).first();

        // 3. Apply Effect
        if (card != null && choiceIndex >= 0 && choiceIndex < card.options.size()) {
            Card.Option selectedOption = card.options.get(choiceIndex);

            // ⚠️ PASS THE NESTED STATS OBJECT
            calculator.applyEffect(user.stats, selectedOption.effect);

            // Save immediately
            saveUser(user);
        }

        return user;
    }
}