from common import *

params = {
    "DB_COUNT_QUERY": {"default": None, "message": "The query to count records from the DB"},
    "ES_HOST": {"default": None, "message": "Elastic search host"},
    "ES_INDEX_NAME": {"default": None, "message": "The name of index for which count needs to be checked"},
    "ES_INDEX_QUERY": {"default": """{"query": {"match_all": {}}}""", "required": False, "message": "Query if any to filter records"}
}

params.update(get_db_params())


def execute(config):
    import psycopg2
    import json
    from elasticsearch import Elasticsearch
    index = config["ES_INDEX_NAME"]
    err = None
    cur = None
    connection = None
    db_record_count = None
    es_record_count = None

    try:
        es = Elasticsearch(hosts=[config["ES_HOST"]])
        es_query = json.loads(config["ES_INDEX_QUERY"])
        res = es.search(index=index, body=es_query, size=0)
        es_record_count = res['hits']['total']
        log("Found {} records in ES for index {}".format(es_record_count, index))

        connection = psycopg2.connect(user=config["PG_USER"],
                                      password=config["PG_PASSWORD"],
                                      host=config["PG_HOST"],
                                      port=config["PG_PORT"],
                                      database=config["PG_DBNAME"])
        try:
            cur = connection.cursor()
            query = config["DB_COUNT_QUERY"]
            cur.execute(query)
            data = cur.fetchone()
            db_record_count = data[0]

            log("Executed Query - {}, count = {}".format(query, db_record_count))
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
            message = "Failed to connect to check Sync between DB and ES - {}".format(
                str(err))
            logger.error(message)
            report_failure(message)

    if db_record_count and es_record_count:
        if db_record_count == es_record_count:
            message = "Found correct sync between DB({}) = {} and ES({}) = {}. Delta = {}".format(
                query, db_record_count, index, es_record_count, db_record_count - es_record_count)
            log(message)
            report_success()
        else:
            message = "Found incorrect sync between DB({}) = {} and ES({}) = {}. Delta = {}".format(
                query, db_record_count, index, es_record_count, db_record_count - es_record_count)
            log(message)
            report_failure(message)


if __name__ == "__main__":
    execute(get_config(params))
