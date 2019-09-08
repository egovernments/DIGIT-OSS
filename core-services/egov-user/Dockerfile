FROM egovio/apline-jre:8u121

MAINTAINER Venki<venki@egovernments.org>

# advertise jboss service port
EXPOSE 8080 9990

# copy pre-built JAR into image
#
# INSTRUCTIONS ON HOW TO BUILD JAR:
# Move to the location where pom.xml is exist in project and build project using below command
# "mvn clean package"
COPY /target/egov-user-0.0.1-SNAPSHOT.jar /opt/egov/egov-user.jar
#COPY /target/newrelic.jar /opt/egov/newrelic.jar
#COPY /target/newrelic.yml /opt/egov/newrelic.yml

COPY start.sh /usr/bin/start.sh

RUN chmod +x /usr/bin/start.sh

CMD ["/usr/bin/start.sh"]

# NOTE: the two 'RUN' commands can probably be combined inside of a single
# script (i.e. RUN build-and-install-app.sh) so that we can also clean up the
# extra files created during the `mvn package' command. that step inflates the
# resultant image by almost 1.0GB.
