package ee.mainor.classroom.greeting.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class GreetingRequestDto {

  private String name;
  private String lastname;

  public String getLastname() {
    return lastname + "Test";
  }

}
