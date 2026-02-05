package ragstoriches;

import io.github.cdimascio.dotenv.Dotenv;
import io.javalin.Javalin;
import io.javalin.apibuilder.ApiBuilder;
import ragstoriches.Api.GameApi;
import ragstoriches.database.MongoDB;
import ragstoriches.logic.RagsToRichesCalculator;

public class Main {
    public static void main(String[] args) {

        // 1. Load Config & DB
        Dotenv dotenv = Dotenv.load();
        MongoDB.init(dotenv.get("MONGO_URI"));

        // 2. Initialize Game Logic
        GameApi game = new GameApi(new RagsToRichesCalculator());

        // 3. Start Server & Define Routes
        Javalin app = Javalin.create(config -> {

            // A. Enable CORS
            config.bundledPlugins.enableCors(cors -> {
                cors.addRule(it -> it.anyHost());
            });

            // B. Define Routes (Javalin 6 Style)
            config.router.apiBuilder(() -> {
                ApiBuilder.path("api", () -> {

                    // 1. GET ALL CARDS
                    ApiBuilder.get("cards", ctx -> {
                        ctx.json(game.getAllCards());
                    });

                    // 2. GET USER PROFILE
                    ApiBuilder.get("profile/{userId}", ctx -> {
                        String userId = ctx.pathParam("userId");
                        User user = game.getUser(userId);
                        if (user == null) {
                            System.out.println("Creating new user: " + userId);
                            user = game.createUser(userId);
                        }
                        ctx.json(user);
                    });

                    // 3. SAVE USER PROFILE
                    ApiBuilder.post("profile/save", ctx -> {
                        User incomingUser = ctx.bodyAsClass(User.class);
                        User savedUser = game.saveUser(incomingUser);
                        ctx.json(savedUser);
                    });

                    // 4. GET LEADERBOARD
                    ApiBuilder.get("leaderboard", ctx -> {
                        ctx.json(game.getLeaderboard());
                    });

                    // 5. MAKE A CHOICE
                    ApiBuilder.post("choose", ctx -> {
                        ChoiceRequest request = ctx.bodyAsClass(ChoiceRequest.class);
                        User updatedUser = game.processChoice(
                                request.userId,
                                request.situationId,
                                request.choiceIndex);
                        ctx.json(updatedUser);
                    });
                });
            });

        }).start(8080); // Start the server

        System.out.println("🚀 Backend is LISTENING on http://localhost:8080/api/");
    }

    // --- HELPER CLASS ---
    public static class ChoiceRequest {
        public String userId;
        public int situationId;
        public int choiceIndex;

        public ChoiceRequest() {
        }
    }
}