FROM egovio/flyway:4.1.2

COPY ./ddl /flyway/sql

# COPY ./seed /flyway/seed

COPY migrate.sh /usr/bin/migrate.sh

RUN chmod +x /usr/bin/migrate.sh

CMD ["/usr/bin/migrate.sh"]
