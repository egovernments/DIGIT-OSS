import logging
import logging.config
import requests
import os
import sys

reporting_url = os.getenv("KH_REPORTING_URL", None)
LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'formatters': {
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
    },
    'handlers': {
        'console':{
            'level':'DEBUG',
            'class':'logging.StreamHandler',
            'formatter': 'simple'
        }
    },
    'loggers': {
        'checks': {
            'handlers':['console'],
            'propagate': True,
            'level':'INFO',
        }
    }
}
logging.config.dictConfig(LOGGING)
logger = logging.getLogger("checks")

def get_db_params():
    return  {
        "PG_HOST": {"default": None, "message": "The host for postgres DB"},
        "PG_PORT": {"default": "5432", "message": "The port for postgres DB"},
        "PG_USER": {"default": None, "message": "The postgres DB username"},
        "PG_PASSWORD": {"default": None, "message": "The postgres DB password"},
        "PG_DBNAME": {"default": "postgres", "message": "The postgres DB name"}
    }

def report_success():
    if reporting_url:
        requests.post(reporting_url, json={"OK": True})


def report_failure(*errors):
    if reporting_url:
        requests.post(reporting_url, json={"OK": False, "Errors": errors})


def get_config(params, fail_on_missing_configs=True):
    config = {}
    missing_config = False

    for key, value in params.items():
        config[key] = os.getenv(key, value["default"])
        if config[key] is None and value.get("required", True):
            missing_config = True
            log("Missing environment - {}: {}".format(key, value["message"]))

    if fail_on_missing_configs and missing_config:
        sys.exit(1)

    return config


def log(*args):
    logger.info(*args)
