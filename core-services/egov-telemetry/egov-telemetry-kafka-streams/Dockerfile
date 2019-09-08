FROM openjdk:8
MAINTAINER Sivaprakash Ramasamy<sivaprakash.ramasamy@tarento.com>
 # INSTRUCTIONS ON HOW TO BUILD JAR:
# Move to the location where pom.xml is exist in project and build project using below command
# "mvn clean package"
COPY target/egov-telemetry-kafka-streams-0.0.1-SNAPSHOT-jar-with-dependencies.jar /opt/egov/egov-telemetry-kafka-streams.jar
COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
CMD ["/usr/bin/start.sh"]
