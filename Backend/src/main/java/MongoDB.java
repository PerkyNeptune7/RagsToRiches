import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

import io.github.cdimascio.dotenv.Dotenv;

public class MongoDB {
    private static MongoClient mongoClient;
    private static MongoDatabase database;

    public static void init() {
        // Load your .env file
        Dotenv dotenv = Dotenv.load();
        String uri = dotenv.get("MONGO_URI");

        // Create the connection
        mongoClient = MongoClients.create(uri);
        database = mongoClient.getDatabase("RagsToRiches");
        
        System.out.println("🚀 Connected to MongoDB Atlas via Java!");
    }

    public static MongoDatabase getDatabase() {
        return database;
    }
}