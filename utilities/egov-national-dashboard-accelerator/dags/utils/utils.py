
import requests
import logging
import json
import datetime

log_path = '/adaptor_logs/_doc'

def log(module, type, message, connection, endpoint):
    url = '{0}://{1}/{2}?path={3}&method=POST'.format('https', connection.host, endpoint, log_path)
    q = {
        'timestamp' : int(datetime.datetime.now().timestamp() * 1000),
        'module' : module,
        'severity' : type,
        'state' : 'Punjab',
        'message' : message
    }
    r = requests.post(url, data=json.dumps(q), headers={'kbn-xsrf' : 'true', 'Content-Type' : 'application/json'}, auth=(connection.login, connection.password))
    response = r.json()
    logging.info(response)
