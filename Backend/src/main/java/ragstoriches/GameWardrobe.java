package ragstoriches;

public class GameWardrobe {
    public String id;
    public String description;
    public String name;
    public String type; // outfit, hat, glasses, accessory
    public double price;
    public int knowledgeReq; // Optional: Min knowledge needed to buy

    public GameWardrobe(String id, String name, String type, double price, int knowledgeReq) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.price = price;
        this.knowledgeReq = knowledgeReq;
    }
}