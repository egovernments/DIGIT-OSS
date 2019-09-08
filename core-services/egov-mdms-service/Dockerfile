FROM egovio/apline-jre:8u121-mdms-1.0

MAINTAINER Senthil<senthil.kalimuthu@tarento.com>


# INSTRUCTIONS ON HOW TO BUILD JAR:
# Move to the location where pom.xml is exist in project and build project using below command
# "mvn clean package"

#RUN cd /opt/mdms && git pull origin master

#RUN cd /opt && wget "https://codeload.github.com/egovernments/egov-mdms-data/zip/master" -O master.zip && unzip master.zip && rm -rf master.zip mdms && mv egov-mdms-data-master mdms 

COPY /target/egov-mdms-service-test-0.0.1-SNAPSHOT.jar /opt/egov/egov-mdms-service-test.jar

COPY start.sh /usr/bin/start.sh

RUN chmod +x /usr/bin/start.sh

CMD ["/usr/bin/start.sh"]

# NOTE: the two 'RUN' commands can probably be combined inside of a single
# script (i.e. RUN build-and-install-app.sh) so that we can also clean up the
# extra files created during the `mvn package' command. that step inflates the
# resultant image by almost 1.0GB.