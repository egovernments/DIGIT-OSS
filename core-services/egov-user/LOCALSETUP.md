## Operating System
 Any (Preferred Ubuntu)

## Dependencies

### Infra Dependency

- [X] Postgres DB
- [X] Redis
- [ ] Elasticsearch
- [X] Kafka
  - [ ] Consumer
  - [X] Producer

## Setup

1. Install Java 1.8 [Steps for installation on Ubuntu](<https://tecadmin.net/install-oracle-java-8-ubuntu-via-ppa/>)

2. Install Postgres 11  [Steps for installation on Ubuntu](<https://cloudcone.com/docs/article/how-to-install-postgresql-11-on-ubuntu-18-04/>)

3. Install Redis Steps for [installation on Ubuntu](<https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-redis-on-ubuntu-16-04>)

4. Install Kafka 5.4.1 [Steps for installation on Ubuntu](<https://tecadmin.net/install-apache-kafka-ubuntu/>)

5. Install IDE:  Intellij Community / Eclipse  [Intellij Installation](<https://www.jetbrains.com/help/idea/installation-guide.html#snap>)  [Eclipse Installation](<https://linuxize.com/post/how-to-install-the-latest-eclipse-ide-on-ubuntu-18-04/>)   

6. Add lombok extension [Steps to add lombok in Eclipse and Intellij](<https://www.baeldung.com/lombok-ide>)

7. Clone the git repository (https://github.com/egovernments/core-services).

8. Import the module in the respective IDE  [importing in Intellij](<https://www.jetbrains.com/help/idea/maven-support.html#maven_import_project_start>)


## Configuration
Change properties in application.properties file:

| Property | Value |
|----------|-------|
|spring.datasource.url | Path to local Database|
|flyway.url | Path to local Database|
|egov.enc.host | Host of Central Dev Server|
|egov.mdms.host | Host of Central Dev Server|
|egov.services.accesscontrol.host | Host of Central Dev Server|
|egov.otp.host | Host of Central Dev Server|

** Central Dev Server here refers to a cluster where the dependent applications are deployed. If they are not deployed anywhere, all the dependent services should be run on local machine and there local address should be added in application.properties
         



- The dependent services can be port-forwarded from central server to local and then local address can be added in application.properties. This can be done using the following command:


```bash
function kgpt(){kubectl get pods -n egov --selector=app=$1 --no-headers=true | head -n1 | awk '{print $1}'}
kubectl port-forward -n egov $(kgpt egov-enc-service) 8087:8080 &
kubectl port-forward -n egov $(kgpt egov-mdms-service) 8088:8080 &
kubectl port-forward -n egov $(kgpt egov-otp) 8089:8080
kubectl port-forward -n egov $(kgpt egov-accesscontrol) 8090:8080

```

- Run redis on port 6379

- Update below listed properties in `application.properties` before running the project if using port forward:

```ini
egov.enc.host = http://localhost:8087/
egov.mdms.host = http://localhost:8088/
egov.otp.host = http://localhost:8089/
egov.services.accesscontrol.host = http://localhost:8090/
```

## Running Locally

1.  Start postgres server on local machine using following command:
    sudo service postgresql start
    
    ** By default a database named postgres with userName and password as postgres is created during installation. You can use that database directly for running locally. (Default database should be used only for development on local machine) 

2.  Start zookeeper on local machine:
    bin/zookeeper-server-start.sh config/zookeeper.properties

3.  Start kafka server:
    bin/kafka-server-start.sh config/server.properties 

4.  Run the application by running the main file(Java class containing the main() function) from the IDE
