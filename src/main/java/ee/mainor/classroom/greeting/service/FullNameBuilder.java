package ee.mainor.classroom.greeting.service;


import org.springframework.stereotype.Component;

@Component
public class FullNameBuilder {

  public String fullNameFrom(String firstname, String lastName) {
    return firstname + " " + lastName;
  }

}
