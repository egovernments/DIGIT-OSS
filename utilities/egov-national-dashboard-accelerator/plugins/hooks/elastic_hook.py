import logging
import requests
import json
from airflow import AirflowException
from airflow.hooks.http_hook import HttpHook


#hook to call elastic search
class ElasticHook(HttpHook):
    def search(self, index_and_type, args):
        session = self.get_conn({})

        url = self.base_url + '/'+ index_and_type

        req = requests.Request('GET', url, json=args)
        prep_req = session.prepare_request(req)


        resp = session.send(prep_req)
        try:
            resp.raise_for_status()
        except requests.exceptions.HTTPError:
            logging.error("HTTP error: " + resp.reason)
            raise AirflowException(str(resp.status_code) + ":" + resp.reason)

        return json.loads(resp.content)