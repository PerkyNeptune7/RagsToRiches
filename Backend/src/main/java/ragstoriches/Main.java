import io.github.cdimascio.dotenv.Dotenv;
import ragstoriches.Api.GameApi;
import ragstoriches.database.MongoDB;
import ragstoriches.logic.RagsToRichesCalculator;

public class Main {
    public static void main(String[] args) {

        Dotenv dotenv = Dotenv.load();
        String mongoUri = dotenv.get("MONGO_URI");

        // 2. Initialize DB (Pass the URI here!)

        // 1. Init DB

        try {
            // Initialize the Single Database Connection
            MongoDB.init(mongoUri);
            System.out.println("✅ Connected to MongoDB!");

            // Initialize the Game API
            GameApi game = new GameApi(new RagsToRichesCalculator());

            // Test a card (e.g., ID 37 from your screenshot)
            System.out.println("--- TESTING CARD 37 ---");
            game.processChoice(37, 0);

        } catch (Exception e) {
            System.err.println("❌ Connection Failed: " + e.getMessage());
            e.printStackTrace();
        }

        // 2. Init Game with our new formula
        GameApi game = new GameApi(new RagsToRichesCalculator());

        // 3. Test Situation 36 (Textbooks)
        // Scenario: "You need to buy textbooks... totals $600"
        // Option 0: Buy new (-$600, PFL: -, Happiness: --)
        // Expectation:
        // Multipliers: PFL(0), Hap(-1), Mon(0)
        // Score: (8*0) + (4*-1) + (6*0) = -4
        // Cash Bonus: -4 * 100 = -$400
        // Explicit Cost: -$600
        // Total Change: -$1000
        System.out.println("--- TESTING SITUATION 36 ---");
        game.processChoice(30, 0);
    }
}