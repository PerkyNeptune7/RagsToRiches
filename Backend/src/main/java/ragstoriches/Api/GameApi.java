package ragstoriches.Api;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;

import ragstoriches.Card;
import ragstoriches.PlayerStats;
import ragstoriches.StatsCalculator;
import ragstoriches.database.MongoDB;

public class GameApi {
    private final MongoCollection<Card> cardCollection;
    private final StatsCalculator calculator;
    private final PlayerStats player;

    public GameApi(StatsCalculator calculator) {
        this.cardCollection = MongoDB.getDatabase().getCollection("cards", Card.class);
        this.calculator = calculator;
        this.player = new PlayerStats(1000, 50, 0); // Starting Stats
    }

    public void processChoice(int situationId, int choiceIndex) {
        Card card = cardCollection.find(Filters.eq("situationId", situationId)).first();
        if (card == null) {
            System.out.println("❌ Card " + situationId + " not found!");
            return;
        }

        if (choiceIndex < 0 || choiceIndex >= card.options.size()) {
            System.out.println("❌ Invalid choice index!");
            return;
        }

        Card.Option selectedOption = card.options.get(choiceIndex);
        System.out.println("\n✅ You selected: " + selectedOption.text);

        // Calculate and Apply
        calculator.applyEffect(player, selectedOption.effect);

        printStats();
    }

    private void printStats() {
        System.out.println("================================");
        System.out.println("PLAYER STATUS");
        System.out.println("💰 Balance:   $" + player.getMoney());
        System.out.println("😊 Happiness: " + player.getHappiness());
        System.out.println("🧠 Knowledge: " + player.getFinanceKnowledge());
        System.out.println("================================\n");
    }
}