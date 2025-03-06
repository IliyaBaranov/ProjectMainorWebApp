package ee.mainor.classroom.greeting.service;

import org.springframework.stereotype.Component;

@Component
public class AgeCalculator {

  public Integer calculateFromNam(String name) {
    return name.length() * 5;
  }


}
