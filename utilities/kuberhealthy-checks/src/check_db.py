from common import *

params = get_db_params()


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
            cur.execute('SELECT 1')
            log("Connection to the Database {}@{} Successfull!".format(config["PG_USER"], config["PG_DBNAME"]))
        except psycopg2.OperationalError as e:
            log("Unable to connect to the Database")
            err = e

    except (Exception, psycopg2.Error) as e :
        err = e

    finally:
        #closing database connection.
        if connection:
            if cur:
                cur.close()
            connection.close()

        if err:
            message = "Failed to connect to the DB - {}@{} - {}".format(config["PG_USER"], config["PG_DBNAME"], str(err))
            logger.error(message)
            report_failure(message)
        else:
            report_success()

if __name__ == "__main__":
    execute(get_config(params))
