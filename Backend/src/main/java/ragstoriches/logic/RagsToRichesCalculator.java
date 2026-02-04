package ragstoriches.logic;

import ragstoriches.Card.Effect;
import ragstoriches.PlayerStats;
import ragstoriches.StatsCalculator;

public class RagsToRichesCalculator implements StatsCalculator {

    // Tunable constants for symbols
    private static final int LOW_IMPACT = 10;
    private static final int MEDIUM_IMPACT = 20;
    private static final int HIGH_IMPACT = 30;

    public void applyEffect(PlayerStats stats, Effect effect) {
        if (effect == null)
            return;

        // 1. Calculate Multipliers based on Symbols
        int pflMult = getSymbolMultiplier(effect.financeKnowledge);
        int hapMult = getSymbolMultiplier(effect.happiness);
        int monMult = getSymbolMultiplier(effect.money);

        // 2. Calculate Total Score
        int totalScore = (8 * pflMult) + (4 * hapMult) + (6 * monMult);

        System.out.println("   🏆 Turn Score: " + totalScore + " points");

        // 3. Calculate Financial Outcome
        double performanceBonus = totalScore * 100.0;
        double explicitCash = parseExplicitMoney(effect.money);
        double netMoneyChange = performanceBonus + explicitCash;

        // 4. Update Player Stats
        stats.setMoney(stats.getMoney() + netMoneyChange);
        stats.setHappiness(stats.getHappiness() + hapMult);
        stats.setFinanceKnowledge(stats.getFinanceKnowledge() + pflMult);

        System.out.println("   💵 Cash Change: " + formatMoney(netMoneyChange) +
                " (Bonus: " + formatMoney(performanceBonus) +
                ", Cost/Gain: " + formatMoney(explicitCash) + ")");
    }

    // --- Helpers ---

    private int getSymbolMultiplier(String text) {
        if (text == null)
            return 0;
        switch (text.trim()) {
            case "++":
                return 2;
            case "+":
                return 1;
            case "-":
                return 0;
            case "--":
                return -1;
            case "+++":
                return 3;
            case "---":
                return -2;
            default:
                return 0;
        }
    }

    private double parseExplicitMoney(String text) {
        if (text == null)
            return 0.0;

        // If it's strictly a symbol, explicit money is 0
        if (text.matches("\\+{1,3}|-{1,3}")) {
            return 0.0;
        }

        try {
            return Double.parseDouble(text);
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    private String formatMoney(double amount) {
        return (amount >= 0 ? "+$" : "-$") + Math.abs(amount);
    }

    @Override
    public void applyEffect(Object currentStats, Effect effect) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'applyEffect'");
    }
}