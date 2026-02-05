package ragstoriches;

import ragstoriches.Card.Effect;

public interface StatsCalculator {
    // strict definition: must accept PlayerStats, not Object or T
    void applyEffect(User.Stats currentStats, Effect effect);
}