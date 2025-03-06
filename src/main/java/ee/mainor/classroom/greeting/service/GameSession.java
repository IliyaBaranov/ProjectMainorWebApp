package ee.mainor.classroom.greeting.service;

import java.util.Random;
import java.util.UUID;

public class GameSession {
    private final UUID gameId;
    private final int targetNumber;
    private int attempts;

    public GameSession(UUID gameId) {
        this.gameId = gameId;
        this.targetNumber = new Random().nextInt(100) + 1;
        this.attempts = 0;
    }

    public String guess(int number) {
        attempts++;
        if (number < targetNumber) {
            return "Nr is bigger";
        } else if (number > targetNumber) {
            return "Nr is smaller";
        } else {
            return "Correct, it took you " + attempts + " times";
        }
    }
}
