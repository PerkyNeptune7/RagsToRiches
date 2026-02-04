package ragstoriches;

import ragstoriches.Card.Effect;

public interface StatsCalculator {
    // strict definition: must accept PlayerStats, not Object or T
    void applyEffect(PlayerStats currentStats, Effect effect);

    void applyEffect(Object currentStats, Effect effect);
}