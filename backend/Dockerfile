# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Import Aiven CA certificate so Java trusts the Kafka SSL connection
COPY ca.pem /app/ca.pem
RUN keytool -import -trustcacerts -noprompt -alias aiven-ca \
    -file /app/ca.pem \
    -keystore $JAVA_HOME/lib/security/cacerts \
    -storepass changeit

EXPOSE 8081
ENTRYPOINT ["java", "-Xmx300m", "-Xss512k", "-XX:CICompilerCount=2", "-jar", "app.jar"]

