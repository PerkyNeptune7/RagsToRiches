import org.bson.Document;

import com.mongodb.client.model.Filters;

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

        // 3. Create a REST endpoint
        app.get("/api/users/{email}", ctx -> {
            String email = ctx.pathParam("email");
            
            // Find the user in the "users" collection
            Document user = MongoDB.getDatabase()
                    .getCollection("users")
                    .find(Filters.eq("email", email))
                    .first();

            if (user != null) {
                ctx.json(user.toJson()); // Send the JSON back to your frontend
            } else {
                ctx.status(404).result("User not found");
            }
        });
    }
}