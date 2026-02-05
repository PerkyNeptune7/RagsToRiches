package ragstoriches.database;

import static org.bson.codecs.configuration.CodecRegistries.fromProviders;
import static org.bson.codecs.configuration.CodecRegistries.fromRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

import io.github.cdimascio.dotenv.Dotenv;

public class MongoDB {
    private static MongoDatabase database;

    // 1. The Init Method (Call this ONCE in Main)
    public static void init(String connectionString) {

        Dotenv dotenv = Dotenv.load();
        connectionString = dotenv.get("MONGO_URI");

        if (database != null)
            return; // Already initialized

        // Create the "Translator" for your Java Classes (User/Card)
        CodecRegistry pojoCodecRegistry = fromRegistries(
                MongoClientSettings.getDefaultCodecRegistry(),
                fromProviders(PojoCodecProvider.builder().automatic(true).build()));

        MongoClientSettings settings = MongoClientSettings.builder()
                .applyConnectionString(new ConnectionString(connectionString))
                .codecRegistry(pojoCodecRegistry) // <--- APPLY TRANSLATOR
                .build();

        MongoClient mongoClient = MongoClients.create(settings);
        database = mongoClient.getDatabase("RagsToRiches"); // Your DB Name
    }

    // 2. The Getter (Call this whenever you need to save/load data)
    public static MongoDatabase getDatabase() {
        if (database == null) {
            throw new RuntimeException("❌ You must call MongoDB.init(uri) in Main.java first!");
        }
        return database;
    }
}