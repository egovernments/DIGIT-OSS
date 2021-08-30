from common import *

params = {
    "PG_REMAINING_CONNECTIONS": {"default": None, "message": "Provide count of % of remaining connections to be checked"},
}

params.update(get_db_params())


def execute(config):
    import psycopg2
    err = None
    cur = None
    connection = None
    try:
        connection = psycopg2.connect(user=config["PG_USER"],
                                      password=config["PG_PASSWORD"],
                                      host=config["PG_HOST"],
                                      port=config["PG_PORT"],
                                      database=config["PG_DBNAME"])
        try:
            cur = connection.cursor()
            log("Connection to the Database {}@{} Successfull!".format(
                config["PG_USER"], config["PG_DBNAME"]))
            cur.execute("""select  * from
	                (select count(*) used from pg_stat_activity) q1,
	                (select setting::int max_conn from pg_settings where name=$$max_connections$$) q3;""")
            data = cur.fetchall()

            current_connection_count = data[0][0]
            max_connection_count = data[0][1]

            connection_desired_limit = config["PG_REMAINING_CONNECTIONS"]

            log("Current connections = {}, Max Connections allowed = {}, Desired limit = {}".format(
                current_connection_count, max_connection_count, connection_desired_limit))

            if connection_desired_limit.strip().endswith("%"):
                limit = int(max_connection_count) - (int(max_connection_count) /
                                                     100 * int(connection_desired_limit.replace("%", "")))
            else:
                limit = int(max_connection_count) - \
                    int(connection_desired_limit)

            if current_connection_count >= limit:
                raise Exception("The current database connection count is high. Max limit = {}, current = {}, remaining = {}, desired remaining={}".format(
                    max_connection_count, current_connection_count, max_connection_count - current_connection_count, connection_desired_limit))

        except psycopg2.OperationalError as e:
            log("Unable to connect to the Database")
            err = e

    except (Exception, psycopg2.Error) as e:
        err = e

    finally:
        # closing database connection.
        if connection:
            if cur:
                cur.close()
            connection.close()

        if err:
            message = "DB Connection count failed - {}".format(str(err))
            logger.error(message)
            report_failure(message)
        else:
            report_success()


if __name__ == "__main__":
    execute(get_config(params))
