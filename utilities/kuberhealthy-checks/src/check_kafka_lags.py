from kafka import KafkaProducer
from common import *
from kafka_tools import generate_kafka_client, generate_lag_all_topics, TopicGroupPair
import json

params = {
    "BOOTSTRAP_SERVER": {"default": None, "message": "The kafka bootstrap server"},
    "TOPIC_GROUP": {"default": None, "message": "A comma seperated topic:group to be tested for lag"},
    "MAX_ALLOWED_LAG": {"default": None, "message": "Allowed lag above which the test will fail"}
}

def generate_topic_group_pairs(topic_group_pairs):
    """ Splits topic:group into a list and generates a TopicGroupPair object """
    formatted_pairs = []
    for pair in topic_group_pairs:
        topic_group = pair.split(':')
        formatted_pairs.append(TopicGroupPair(topic_group[0], topic_group[1]))

    return formatted_pairs

def execute(config):
    try:
        from datetime import datetime
        bootstrap_server = config["BOOTSTRAP_SERVER"]
        c = generate_kafka_client(bootstrap_server)
        topics_groups = generate_topic_group_pairs(config["TOPIC_GROUP"].split(","))
        generate_lag_all_topics(c,bootstrap_server , topics_groups)
        errors = []
        allowed_lag = int(config["MAX_ALLOWED_LAG"])
        for tg in topics_groups:
            message = "Lag = {}/ Allowed Lag={} (Topic = {}, Consumer Group = {})".format(tg.lag,allowed_lag, tg.name, tg.group)

            if tg.lag > allowed_lag:
                errors.append(message)
            log(message)

        if len(errors):
            report_failure(*errors)
            log("Test failed because of lags - {}".format(errors))
        else:
            report_success()
            log("Test passed")
    except Exception as ex:
        message = "Test for kafka topic lags failed - {}".format(str(ex))
        log(message)
        logger.exception("Exception" ,exc_info= ex)
        report_failure(message)

if __name__ == "__main__":
    execute(get_config(params))
