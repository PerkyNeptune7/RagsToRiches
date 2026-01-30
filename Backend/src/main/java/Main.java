import java.util.ArrayList;
import java.util.List;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.ReplaceOptions;
import com.mongodb.client.model.Sorts;

import io.github.cdimascio.dotenv.Dotenv;
import io.javalin.Javalin;

public class Main {
    public static void main(String[] args) {
        // 1. Initialize DB

        Dotenv dotenv = Dotenv.load();
        String mongoUri = dotenv.get("MONGO_URI");

        // 2. Initialize DB (Pass the URI here!)
        MongoDB.init(mongoUri);

        // 3. Start Server
        var app = Javalin.create(config -> {
            // FIX: Use 'bundledPlugins' instead of 'plugins'
            config.bundledPlugins.enableCors(cors -> {
                cors.addRule(it -> it.anyHost());
            });
        }).start(8080);

        // 4. Get Typed Collections (Now safe to call)
        MongoCollection<User> usersCollection = MongoDB.getDatabase().getCollection("users", User.class);
        MongoCollection<Card> cardsCollection = MongoDB.getDatabase().getCollection("cards", Card.class);
        // 3. Create a REST endpoint
        app.post("/api/profile/save", ctx -> {
            // A. Receive JSON from Frontend
            User user = ctx.bodyAsClass(User.class);

            // B. Calculate Score
            user.calculateScore();
            System.out.println("🧮 Calculated Score for " + user.name + ": " + user.overallScore);

            // C. FIX: Save the 'user' object directly!
            // No need to manually create a "Document" anymore.
            usersCollection.replaceOne(
                    Filters.eq("_id", user.id),
                    user, // <--- Just pass the Java object!
                    new ReplaceOptions().upsert(true));

            ctx.json(user);
        });
        app.get("/api/profile/{id}", ctx -> {
            String userId = ctx.pathParam("id");

            // FIX: Receive a 'User' object directly (not a Document)
            User user = usersCollection.find(Filters.eq("_id", userId)).first();

            if (user != null) {
                ctx.json(user); // Send the user object
            } else {
                System.out.println("⚠️ User " + userId + " not found. Returning Guest defaults.");
                ctx.json(new User());
            }
        });

        // 4. New Game Endpoint
        app.get("/api/profile/new", ctx -> {
            ctx.json(new User());
        });
        app.get("/api/cards", ctx -> {
            // FIX: Create a list of 'Card' objects (not Documents)
            List<Card> cards = new ArrayList<>();

            // Fetch directly into the list
            cardsCollection.find().into(cards);

            // Send to frontend
            ctx.json(cards);
        });

        // 3. THE LEADERBOARD ENDPOINT
        app.get("/api/leaderboard", ctx -> {
            // FIX: Create a "Typed" collection reference just for this query
            // This tells Mongo: "When you get data from 'users', convert it to my User
            // class automatically"
            MongoCollection<User> userTypedCollection = MongoDB.getDatabase().getCollection("users", User.class);

            String type = ctx.queryParam("sortBy");
            String sortField;

            // Decide which field to sort by
            if ("money".equals(type)) {
                sortField = "stats.money";
            } else if ("financeKnowledge".equals(type)) {
                sortField = "stats.financeKnowledge";
            } else if ("happiness".equals(type)) {
                sortField = "stats.happiness";
            } else {
                sortField = "overallScore";
            }

            // Fetch Top 10 users
            List<User> leaders = new ArrayList<>();
            userTypedCollection.find() // Now this returns 'User' objects, not 'Documents'
                    .sort(Sorts.descending(sortField))
                    .limit(10)
                    .into(leaders);

            ctx.json(leaders);
        });

    }
}
