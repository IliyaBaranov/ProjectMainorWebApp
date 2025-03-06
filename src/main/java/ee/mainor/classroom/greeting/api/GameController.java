package ee.mainor.classroom.greeting.api;

import ee.mainor.classroom.greeting.service.GameService;
import ee.mainor.classroom.greeting.dto.GameResponse;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/game")
public class GameController {
    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping
    public GameResponse startGame() {
        return gameService.startGame();
    }

    @GetMapping("/{gameId}/guess/{number}")
    public GameResponse makeGuess(@PathVariable UUID gameId, @PathVariable int number) {
        return gameService.makeGuess(gameId, number);
    }
}
