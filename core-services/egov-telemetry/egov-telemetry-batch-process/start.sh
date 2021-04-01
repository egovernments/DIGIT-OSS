#!/bin/sh
 if [ -z "${JAVA_OPTS}" ];then
    export JAVA_OPTS="-Xmx64m -Xms64m"
fi

if [ -z $DATE ]; then
	java ${JAVA_OPTS} -jar /opt/egov/egov-telemetry-batch-process.jar
else
for i in $DATE; do
 java ${JAVA_OPTS} -jar /opt/egov/egov-telemetry-batch-process.jar $i
 sleep 30;
done
fi