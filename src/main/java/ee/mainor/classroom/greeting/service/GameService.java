package ee.mainor.classroom.greeting.service;

import ee.mainor.classroom.greeting.dto.GameResponse;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class GameService {
    private final Map<UUID, GameSession> games = new HashMap<>();

    public GameResponse startGame() {
        UUID gameId = UUID.randomUUID();
        games.put(gameId, new GameSession(gameId));
        return new GameResponse(gameId, "Game started");
    }

    public GameResponse makeGuess(UUID gameId, int number) {
        GameSession game = games.get(gameId);
        if (game == null) {
            return new GameResponse(gameId, "Game not found");
        }
        return new GameResponse(gameId, game.guess(number));
    }
}
