FROM frolvlad/alpine-java:jdk8-slim
WORKDIR /app
ADD ./target/egov-enc-service-1.1.4.jar enc-service.jar
ENTRYPOINT ["java", "-jar", "enc-service.jar"]
