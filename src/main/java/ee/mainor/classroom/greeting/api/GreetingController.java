package ee.mainor.classroom.greeting.api;

import ee.mainor.classroom.greeting.dto.GreetingRequestDto;
import ee.mainor.classroom.greeting.dto.GreetingResponseDto;
import ee.mainor.classroom.greeting.service.AgeCalculator;
import ee.mainor.classroom.greeting.service.GreetingService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("greeting")
public class GreetingController {

  private GreetingService greetingService;

  @GetMapping
  public String sayHello(@RequestParam String name) {
    return "Hello %s !".formatted(name);
  }

  @PutMapping("{id}")
  public String updateGreeting(@PathVariable Long id, @RequestBody GreetingRequestDto greetingRequestDto) {
    return "Greeting is with id %s is updated ".formatted(id) + greetingRequestDto.getName();
  }

  @PatchMapping("{id}")
  public String partiallyUpdateGreeting(@PathVariable Long id, @RequestBody GreetingRequestDto greetingRequestDto) {
    return "Greeting is with id %s is updated ".formatted(id) + greetingRequestDto.getName();
  }

  @DeleteMapping("{id}")
  public void delete(@PathVariable Long id) {
  }

  @PostMapping
  public GreetingResponseDto sayHello(@RequestBody GreetingRequestDto greetingRequestDto) {
    return greetingService.createGreeting(greetingRequestDto);
  }


}
