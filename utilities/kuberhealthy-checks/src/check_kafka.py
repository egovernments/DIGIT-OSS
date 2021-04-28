from common import *
from kafka import KafkaProducer
from kafka.admin import KafkaAdminClient, NewTopic
from kafka.errors import TopicAlreadyExistsError

params = {
    "BOOTSTRAP_SERVER": {"default": None, "message": "The kafka bootstrap server"},
    "TOPIC_SEND_TEST": {"default": "kafka.check.sending.message", "message": "The kafka bootstrap server"},
}

def execute(config):
    try:
        from datetime import datetime
        topic = config["TOPIC_SEND_TEST"]
        bootstrap_server = config["BOOTSTRAP_SERVER"]
        log("Connecting to Kafka server - {}".format(bootstrap_server))
        c = KafkaAdminClient(bootstrap_servers=[bootstrap_server])
        
        try:
            c.create_topics([NewTopic(topic, 1, 1)], timeout_ms=60000)
        except TopicAlreadyExistsError:
            pass

        producer = KafkaProducer(bootstrap_servers=[config["BOOTSTRAP_SERVER"]])
        producer.send(topic, bytearray("Test - " + str(datetime.now()), "ascii"))
        log("Successfully sent message to kafka topic")
        report_success()
    except Exception as ex:
        message = "Test for kafka connection failed - {}".format(str(ex))
        log(message)
        report_failure(message)
if __name__ == "__main__":
    execute(get_config(params))
