FROM egovio/flyway:4.1.2

COPY ./migration/ddl /flyway/sql

COPY ./migration/seed /flyway/seed

COPY ./migration/dev /flyway/dev

COPY ./migration/qa /flyway/qa

COPY migrate.sh /usr/bin/migrate.sh

RUN chmod +x /usr/bin/migrate.sh

CMD ["/usr/bin/migrate.sh"]
