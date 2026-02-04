package ragstoriches;

public class PlayerStats {
    private double money;
    private int happiness;
    private int financeKnowledge;

    public PlayerStats(double money, int happiness, int financeKnowledge) {
        this.money = money;
        this.happiness = happiness;
        this.financeKnowledge = financeKnowledge;
    }

    // Getters and Setters
    public double getMoney() {
        return money;
    }

    public void setMoney(double money) {
        this.money = money;
    }

    public int getHappiness() {
        return happiness;
    }

    public void setHappiness(int happiness) {
        this.happiness = happiness;
    }

    public int getFinanceKnowledge() {
        return financeKnowledge;
    }

    public void setFinanceKnowledge(int financeKnowledge) {
        this.financeKnowledge = financeKnowledge;
    }
}