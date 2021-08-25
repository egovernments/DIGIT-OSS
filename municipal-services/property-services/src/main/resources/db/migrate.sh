schemas=$SCHEMA_NAME
for schemaname in ${schemas//,/ }
do
    echo "the schema name : $schemaname"
    #!/bin/sh

flyway -url=$DB_URL -schemas=$schemaname -table=$SCHEMA_TABLE -user=$FLYWAY_USER -password=$FLYWAY_PASSWORD -locations=$FLYWAY_LOCATIONS -baselineOnMigrate=true -outOfOrder=true -ignoreMissingMigrations=true migrate
done
