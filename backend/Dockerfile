FROM eclipse-temurin:21-jdk as builder
WORKDIR /workspace
COPY . .
RUN ./gradlew :backend:bootJar && \
    ls -la backend/build/libs/

FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=builder /workspace/backend/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]