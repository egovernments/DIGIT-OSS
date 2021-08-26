#!/bin/sh
baseurl=$DB_URL
schemasetter="?currentSchema="
schemas=$SCHEMA_NAME
echo "the schemas : $schemas"
for schemaname in ${schemas//,/ }
do
    dbUrl = ${baseurl}${schemasetter}${schemaname}
    echo "the schema name : $schemaname"
    flyway -url=$dbUrl  -table=$SCHEMA_TABLE -user=$FLYWAY_USER -password=$FLYWAY_PASSWORD -locations=$FLYWAY_LOCATIONS -baselineOnMigrate=true -outOfOrder=true -ignoreMissingMigrations=true migrate
done
