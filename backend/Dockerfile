# Step 1: Build the Spring Boot application using Maven
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Build application
COPY src ./src
RUN mvn clean package -DskipTests

# Step 2: Runtime image (lightweight JRE)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create a non-privileged user for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy jar from builder
COPY --from=builder /app/target/*.jar app.jar

# Render assigns port dynamically via the PORT environment variable
ENV PORT=8080
EXPOSE 8080

# Configure JVM flags optimized for container memory constraints (Render Free Tier 512MB)
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

