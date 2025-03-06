package ee.mainor.classroom.greeting.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class GreetingResponseDto {

  private String greetingType;
  private String fullName;
  private Integer age;

  public GreetingResponseDto(String fullName, Integer age) {
    this.fullName = fullName;
    this.age = age;
    greetingType = "regular";
  }

}
