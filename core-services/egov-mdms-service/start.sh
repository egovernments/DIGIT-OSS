#!/bin/sh

cd /opt && wget "$EGOV_MDMS_GIT_URL${BRANCH:-master}" -O master.zip && unzip master.zip && rm -rf master.zip mdms && mv "$EGOV_MDMS_FOLDER-${BRANCH:-master}" mdms

if [[ -z "${JAVA_OPTS}" ]];then
    export JAVA_OPTS="-Xmx64m -Xms64m"
fi

if [ x"${JAVA_ENABLE_DEBUG}" != x ] && [ "${JAVA_ENABLE_DEBUG}" != "false" ]; then
    java_debug_args="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=${JAVA_DEBUG_PORT:-5005}"
fi

java ${java_debug_args} ${JAVA_OPTS} ${JAVA_ARGS}  -jar /opt/egov/egov-mdms-service-test.jar