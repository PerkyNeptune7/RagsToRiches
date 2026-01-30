import org.bson.Document;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.ReplaceOptions;

import io.github.cdimascio.dotenv.Dotenv;
import io.javalin.Javalin;

public class Main {
    public static void main(String[] args) {
        // 1. Initialize DB

        Dotenv dotenv = Dotenv.load();
        String mongoUri = dotenv.get("MONGO_URI");
        MongoDB.init();
        // 2. Start Javalin
        var app = Javalin.create().start(8080);
        MongoCollection<Document> usersCollection = MongoDB.getDatabase().getCollection("users");
        // 3. Create a REST endpoint
       app.post("/api/profile/save", ctx -> {
        // A. Receive JSON from Frontend
        User user = ctx.bodyAsClass(User.class);

    // B. The Critical Step: BE does the Math!
        user.calculateScore(); 
        System.out.println("🧮 Calculated Score for " + user.name + ": " + user.overallScore);

    // C. Convert to MongoDB Document (Manual mapping for control)
        Document doc = new Document("_id", user.id)
            .append("name", user.name)
            .append("email", user.email)
            .append("overallScore", user.overallScore)
            .append("appearance", new Document()
                    .append("shirtColor", user.appearance.shirtColor)
                    .append("extraDetail", user.appearance.extraDetail))
            .append("stats", new Document()
                    .append("money", user.stats.money)
                    .append("happiness", user.stats.happiness)
                    .append("financeKnowledge", user.stats.financeKnowledge));

         // D. Upsert (Update if exists, Insert if new)
            usersCollection.replaceOne(
            Filters.eq("_id", user.id), 
            doc, 
            new ReplaceOptions().upsert(true)
            );

        ctx.json(user); // Send back the updated user (with the new score)
        });
        app.get("/api/profile/{id}", ctx -> {
    String userId = ctx.pathParam("id");
    
    // A. Try to find the user in MongoDB
    Document doc = usersCollection.find(Filters.eq("_id", userId)).first();

    if (doc != null) {
        // Found them! Send the raw document as JSON
        // (Javalin automatically converts the BSON Document to JSON)
        ctx.json(doc);
    } else {
        // Not found? Return a default "New User" structure
        System.out.println("⚠️ User " + userId + " not found. Returning Guest defaults.");
        ctx.json(new User()); 
    }
    });

    // 4. (Optional) A pure "New Game" endpoint
    app.get("/api/profile/new", ctx -> {
    ctx.json(new User());
    });

    }
}
