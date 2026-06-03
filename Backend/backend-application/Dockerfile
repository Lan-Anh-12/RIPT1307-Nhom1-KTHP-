# Giai đoạn 1: Build project bằng Maven
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Giai đoạn 2: Chạy ứng dụng từ file JAR đã build
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Copy file jar từ giai đoạn 1 vào đây (đảm bảo file jar nằm trong thư mục target)
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]