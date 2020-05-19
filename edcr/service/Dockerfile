FROM egovio/alpine-maven-builder-jdk-8:gcp AS build
ARG WORK_DIR
WORKDIR /app

# copy the project files

COPY ${WORK_DIR} ./${WORK_DIR}
RUN cd ${WORK_DIR} \
    && mvn clean package -DskipTests
                                 

# Create runtime image

FROM egovio/wildfly:8-helm-fin-11052167

COPY --from=build /app/egov/egov-ear/target/*.ear /opt/jboss/wildfly/standalone/deployments/
USER jboss

CMD ["/opt/jboss/wildfly/bin/standalone.sh", "-b", "0.0.0.0", "-bmanagement", "0.0.0.0", "-Ddb.migration.enabled=true"]
