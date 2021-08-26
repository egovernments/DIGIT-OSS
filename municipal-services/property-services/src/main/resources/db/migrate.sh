#!/bin/sh
schemasetter="?currentSchema="
schemas=$SCHEMA_NAME
echo "the schemas : $schemas"
for schemaname in ${schemas//,/ }
do
    echo "the schema name : $DB_URL${schemasetter}${schemaname}"
    flyway -url=${baseurl}${schemasetter}${schemaname}  -table=$SCHEMA_TABLE -user=$FLYWAY_USER -password=$FLYWAY_PASSWORD -locations=$FLYWAY_LOCATIONS -baselineOnMigrate=true -outOfOrder=true -ignoreMissingMigrations=true migrate
done
