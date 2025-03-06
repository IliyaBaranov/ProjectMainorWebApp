package ee.mainor.classroom.greeting.dto;

import java.util.UUID;

public class GameResponse {
    private UUID gameId;
    private String message;

    public GameResponse(UUID gameId, String message) {
        this.gameId = gameId;
        this.message = message;
    }

    public UUID getGameId() {
        return gameId;
    }

    public String getMessage() {
        return message;
    }
}
