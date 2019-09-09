#!/bin/sh

if [[ -z "${JAVA_OPTS}" ]];then
    export JAVA_OPTS="-Xmx256m -Xms256m"
fi

java ${JAVA_OPTS} -jar /opt/egov/egov-hrms.jar
