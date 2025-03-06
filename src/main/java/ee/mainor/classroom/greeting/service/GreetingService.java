package ee.mainor.classroom.greeting.service;

import ee.mainor.classroom.greeting.dto.GreetingRequestDto;
import ee.mainor.classroom.greeting.dto.GreetingResponseDto;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class GreetingService {

  private AgeCalculator ageCalculator;
  private FullNameBuilder fullNameBuilder;

  public GreetingResponseDto createGreeting(GreetingRequestDto requestDto) {
    String fullName = fullNameBuilder.fullNameFrom(requestDto.getName(), requestDto.getLastname());
    Integer age = ageCalculator.calculateFromNam(requestDto.getName());
    return new GreetingResponseDto(fullName, age);
  }

}
