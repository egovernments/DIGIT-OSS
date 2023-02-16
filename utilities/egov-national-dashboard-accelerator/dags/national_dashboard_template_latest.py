
from numpy import sinc
from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from airflow.operators.postgres_operator import PostgresOperator
from airflow.utils.dates import days_ago
from datetime import datetime, timedelta, timezone
from datetime import date
from hooks.elastic_hook import ElasticHook
from airflow.operators.http_operator import SimpleHttpOperator
import requests
from airflow.hooks.base import BaseHook
import logging
import json
import urllib
from queries.tl import *
from queries.pgr import *
from queries.ws import *
from queries.ws_digit import *
from queries.pt import *
from queries.firenoc import *
from queries.mcollect import *
from queries.obps import *
from queries.common import *
from utils.utils import log
from pytz import timezone
from airflow.models import Variable
from elasticsearch import Elasticsearch, helpers
from csv import reader
import uuid


default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'retries': 3,
    'retry_delay': timedelta(seconds=10),
    'start_date': datetime(2017, 1, 24)

}

module_map = {
    'TL' : (tl_queries, empty_tl_payload),
    'PGR' : (pgr_queries, empty_pgr_payload),
    'WS' : (ws_queries, empty_ws_payload),
    'WS_DIGIT' : (ws_digit_queries, empty_ws_digit_payload),
    'PT' : (pt_queries, empty_pt_payload),
    'FIRENOC' : (firenoc_queries, empty_firenoc_payload),
    'MCOLLECT' : (mcollect_queries, empty_mcollect_payload),
    'OBPS' : (obps_queries, empty_obps_payload),
    'COMMON' : (common_queries,empty_common_payload)
}


dag = DAG('national_dashboard_template_manual', default_args=default_args, schedule_interval=None)
log_endpoint = 'kibana/api/console/proxy'
batch_size = 50

ulbs = {}
modules = {}
total_ulbs = 0
totalApplications = 0
totalApplicationWithinSLA = 0



def dump_kibana(**kwargs):
    hook = ElasticHook('GET', 'es_conn')
    module = kwargs['module']
    module_config = module_map.get(module)
    queries = module_config[0]
    date = kwargs['dag_run'].conf.get('date')
    localtz = timezone('Asia/Kolkata')
    dt_aware = localtz.localize(datetime.strptime(date, "%d-%m-%Y"))
    start = int(dt_aware.timestamp() * 1000)
    end = start + (24 * 60 * 60 * 1000) - 1000
    logging.info(start)
    logging.info(end)
    logging.info("start the DAGS")
    if module == 'COMMON':
        actualstart = int(localtz.localize(datetime.strptime('01-01-1970', "%d-%m-%Y")).timestamp() * 1000)
        end = start + (24 * 60 * 60 * 1000) - 1000
        start = actualstart

    merged_document = {}
    live_ulbs = 0

    isStateLive = "N/A"
    for query in queries:
        q = query.get('query').format(start,end)
        logging.info(q)
        response = hook.search(query.get('path'),json.loads(q))
        merged_document[query.get('name')] = response
        logging.info(json.dumps(response))
        if module == 'COMMON' :
            transform_response_common(merged_document,query.get('name'),query.get('module'))


    if module == 'COMMON':
        present = datetime.strptime(date,"%d-%m-%Y")
        logging.info(present.strftime("%Y-%m-%d %H:%M:%S"))
        citizen_count = get_citizen_count(present.strftime("%Y-%m-%d %H:%M:%S"))
        total_ulbs = readulb()
        common_metrics = {}
        module_ulbs = []
        for tenantid in ulbs:
            if len(ulbs[tenantid]) >= 2:
                live_ulbs +=1
                for md in ulbs[tenantid]:
                    if md in modules:
                        modules[md].append(tenantid)
                    else:
                        modules[md] = [tenantid]

        if live_ulbs >= total_ulbs/2:
            isStateLive = "Live"

        for md in modules:
            module_ulbs.append({'name': md, 'value': len(modules[md])})

        common_metrics['totalLiveUlbsCount'] = live_ulbs
        common_metrics['status']  = isStateLive
        common_metrics['onboardedUlbsCount'] = 0
        common_metrics['totalCitizensCount'] = citizen_count
        common_metrics['slaAchievement'] = (totalApplicationWithinSLA/totalApplications) * 100
        common_metrics['totalUlbCount'] = total_ulbs
        common_metrics['liveUlbsCount'] = [{'groupBy': 'serviceModuleCode', 'buckets': module_ulbs}]
        logging.info(json.dumps(common_metrics))

        empty_lambda =  module_config[1]
        common_list = []
        common_payload = empty_lambda('N/A', 'pb.amritsar', 'N/A', date)
        common_payload['metrics'] = common_metrics
        common_list.append(common_payload)
        kwargs['ti'].xcom_push(key='payload_{0}'.format(module), value=json.dumps(common_list))
        return json.dumps(common_list)
    else:
        ward_list = transform_response_sample(merged_document, date, module)
        kwargs['ti'].xcom_push(key='payload_{0}'.format(module), value=json.dumps(ward_list))
        return json.dumps(ward_list)


def readulb(**kwargs):
    ulbs = []
    url = Variable.get('totalulb_url')
    url = 'https://raw.githubusercontent.com/egovernments/punjab-mdms-data/master/data/pb/tenant/tenants.json'
    json_data = requests.get(url)
    json_data = json.loads(json_data.text)
    tenants_array=json_data["tenants"]
    for tenant in tenants_array:
        ulbs.append(tenant["code"])
    total_ulbs = len(ulbs)
    return total_ulbs

def get_citizen_count(startdate):
    logging.info('http://mseva.lgpunjab.gov.in/egov-searcher/unique-citizen-count?date={0}'.format(startdate))
    response = requests.get('http://mseva.lgpunjab.gov.in/egov-searcher/unique-citizen-count?date={0}'.format(startdate))
    if response.status_code == 200:
        logging.info("sucessfully fetched the data")
        return response.json()
    else:
        logging.info("There is an error {0} error with your request".format(response.status_code))


def transform_response_common(merged_document,query_name,query_module):
    single_document = merged_document[query_name]
    single_document = single_document.get('aggregations')
    transform_single_common(single_document,query_module)

def transform_single_common(single_document,query_module):
    global totalApplicationWithinSLA,totalApplications
    sla =  single_document.get('applicationsIssuedWithinSLA').get('withinsla').get('value')
    total =  single_document.get('totalApplications').get('value')
    totalApplications+=total
    totalApplicationWithinSLA+=sla


    ulb_agg = single_document.get('ulbs')
    ulb_buckets = ulb_agg.get('buckets')
    for ulb_bucket in ulb_buckets:
        tenantid = ulb_bucket['key']
        if tenantid in ulbs:
            ulbs[tenantid].append(query_module)
        else:
            ulbs[tenantid] = [query_module]



def transform_response_sample(merged_document, date, module):
    module_config = module_map.get(module)
    queries = module_config[0]
    ward_map = {}
    ward_list = []
    for query in queries:
        single_document = merged_document[query.get('name')]
        single_document = single_document.get('aggregations')
        lambda_function = query.get('lambda')
        ward_map = transform_single(single_document, ward_map, date, lambda_function, module)
    ward_list = [ward_map[k] for k in ward_map.keys()]
    return ward_list

def get_key(ward, ulb):
    return '{0}|{1}'.format(ward, ulb)

def transform_single(single_document, ward_map, date, lambda_function, module):
    module_config = module_map.get(module)
    empty_lambda = module_config[1]
    ward_agg = single_document.get('ward')
    ward_buckets = ward_agg.get('buckets')
    for ward_bucket in ward_buckets:
        ward = ward_bucket.get('key')
        ulb_agg = ward_bucket.get('ulb')
        ulb_buckets = ulb_agg.get('buckets')
        for ulb_bucket in ulb_buckets:
            ulb = ulb_bucket.get('key')
            region_agg = ulb_bucket.get('region')
            region_buckets = region_agg.get('buckets')
            for region_bucket in region_buckets:
                region = region_bucket.get('key')
                if ward_map.get(get_key(ward,ulb)):
                    ward_payload = ward_map.get(get_key(ward,ulb))
                else:
                    ward_payload = empty_lambda(region, ulb, ward, date)
                metrics = ward_payload.get('metrics')
                metrics = lambda_function(metrics, region_bucket)
                ward_payload['metrics'] = metrics
                ward_map[get_key(ward, ulb)] = ward_payload
    return ward_map


def dump(**kwargs):
    ds = kwargs['ds']
    hook = ElasticHook('GET', 'test-es')
    resp = hook.search('/dss-collection_v2', {
        'size': 10000,
        "query": {
            "term": {
                "dataObject.paymentDetails.businessService.keyword": "TL"
            }
        }
    })
    return resp['hits']['hits']

def get_auth_token(connection):
    endpoint = 'user/oauth/token'
    url = '{0}://{1}/{2}'.format('https', connection.host, endpoint)
    data = {
        'grant_type' : 'password',
        'scope' : 'read',
        'username' : Variable.get('username'),
        'password' : Variable.get('password'),
        'tenantId' : Variable.get('tenantid'),
        'userType' : Variable.get('usertype')
    }

    r = requests.post(url, data=data, headers={'Authorization' : 'Basic {0}'.format(Variable.get('token')), 'Content-Type' : 'application/x-www-form-urlencoded'})
    response = r.json()
    logging.info(response)
    return (response.get('access_token'), response.get('refresh_token'), response.get('UserRequest'))


def call_ingest_api(connection, access_token, user_info, payload, module,startdate):
    endpoint = 'national-dashboard/metric/_ingest'
    url = '{0}://{1}/{2}'.format('https', connection.host, endpoint)
    data = {
        "RequestInfo": {
            "apiId": "asset-services",
            "ver": None,
            "ts": None,
            "action": None,
            "did": None,
            "key": None,
            "msgId": "search with from and to values",
            "authToken": access_token,
            "userInfo": user_info
        },
        "Data": payload

    }


    r = requests.post(url, data=json.dumps(data), headers={'Content-Type' : 'application/json'})
    response = r.json()
    logging.info(json.dumps(data))
    logging.info(response)

    #logging to the index adaptor_logs
    q = {
        'timestamp' : startdate,
        'module' : module,
        'severity' : 'Info',
        'state' : 'Punjab',
        'message' : json.dumps(response)
    }
    es = Elasticsearch(host = "elasticsearch-data-v1.es-cluster", port = 9200)
    actions = [
        {
            '_index':'adaptor_logs',
            '_type': '_doc',
            '_id': str(uuid.uuid1()),
            '_source': json.dumps(q),
        }
    ]
    helpers.bulk(es, actions)
    return response



def load(**kwargs):
    connection = BaseHook.get_connection('digit-auth')
    (access_token, refresh_token, user_info) = get_auth_token(connection)
    module = kwargs['module']

    payload = kwargs['ti'].xcom_pull(key='payload_{0}'.format(module))
    logging.info(payload)
    payload_obj = json.loads(payload)
    logging.info("payload length {0} {1}".format(len(payload_obj),module))
    localtz = timezone('Asia/Kolkata')
    dt_aware = localtz.localize(datetime.strptime(kwargs['dag_run'].conf.get('date'), "%d-%m-%Y"))
    startdate = int(dt_aware.timestamp() * 1000)
    logging.info(startdate)
    if access_token and refresh_token:
        for i in range(0, len(payload_obj), batch_size):
            logging.info('calling ingest api for batch starting at {0} with batch size {1}'.format(i, batch_size))
            call_ingest_api(connection, access_token, user_info, payload_obj[i:i+batch_size], module,startdate)
    return None

def transform(**kwargs):
    logging.info('Your transformations go here')
    return 'Post Transformed Data'


extract_tl = PythonOperator(
    task_id='elastic_search_extract_tl',
    python_callable=dump_kibana,
    provide_context=True,
    do_xcom_push=True,
    op_kwargs={ 'module' : 'TL'},
    dag=dag)

transform_tl = PythonOperator(
    task_id='nudb_transform_tl',
    python_callable=transform,
    provide_context=True,
    dag=dag)

load_tl = PythonOperator(
    task_id='nudb_ingest_load_tl',
    python_callable=load,
    provide_context=True,
    op_kwargs={ 'module' : 'TL'},
    dag=dag)


extract_pgr = PythonOperator(
    task_id='elastic_search_extract_pgr',
    python_callable=dump_kibana,
    provide_context=True,
    do_xcom_push=True,
    op_kwargs={ 'module' : 'PGR'},
    dag=dag)

transform_pgr = PythonOperator(
    task_id='nudb_transform_pgr',
    python_callable=transform,
    provide_context=True,
    dag=dag)

load_pgr = PythonOperator(
    task_id='nudb_ingest_load_pgr',
    python_callable=load,
    provide_context=True,
    op_kwargs={ 'module' : 'PGR'},
    dag=dag)

extract_ws = PythonOperator(
    task_id='elastic_search_extract_ws',
    python_callable=dump_kibana,
    provide_context=True,
    do_xcom_push=True,
    op_kwargs={ 'module' : 'WS'},
    dag=dag)

transform_ws = PythonOperator(
    task_id='nudb_transform_ws',
    python_callable=transform,
    provide_context=True,
    dag=dag)

load_ws = PythonOperator(
    task_id='nudb_ingest_load_ws',
    python_callable=load,
    provide_context=True,
    op_kwargs={ 'module' : 'WS'},
    dag=dag)


extract_pt = PythonOperator(
    task_id='elastic_search_extract_pt',
    python_callable=dump_kibana,
    provide_context=True,
    do_xcom_push=True,
    op_kwargs={ 'module' : 'PT'},
    dag=dag)

transform_pt = PythonOperator(
    task_id='nudb_transform_pt',
    python_callable=transform,
    provide_context=True,
    dag=dag)

load_pt = PythonOperator(
    task_id='nudb_ingest_load_pt',
    python_callable=load,
    provide_context=True,
    op_kwargs={ 'module' : 'PT'},
    dag=dag)

extract_firenoc = PythonOperator(
    task_id='elastic_search_extract_firenoc',
    python_callable=dump_kibana,
    provide_context=True,
    do_xcom_push=True,
    op_kwargs={ 'module' : 'FIRENOC'},
    dag=dag)

transform_firenoc = PythonOperator(
    task_id='nudb_transform_firenoc',
    python_callable=transform,
    provide_context=True,
    dag=dag)

load_firenoc = PythonOperator(
    task_id='nudb_ingest_load_firenoc',
    python_callable=load,
    provide_context=True,
    op_kwargs={ 'module' : 'FIRENOC'},
    dag=dag)


extract_mcollect = PythonOperator(
    task_id='elastic_search_extract_mcollect',
    python_callable=dump_kibana,
    provide_context=True,
    do_xcom_push=True,
    op_kwargs={ 'module' : 'MCOLLECT'},
    dag=dag)

transform_mcollect = PythonOperator(
    task_id='nudb_transform_mcollect',
    python_callable=transform,
    provide_context=True,
    dag=dag)

load_mcollect = PythonOperator(
    task_id='nudb_ingest_load_mcollect',
    python_callable=load,
    provide_context=True,
    op_kwargs={ 'module' : 'MCOLLECT'},
    dag=dag)

extract_common = PythonOperator(
    task_id='elastic_search_extract_common',
    python_callable=dump_kibana,
    provide_context=True,
    do_xcom_push=True,
    op_kwargs={ 'module' : 'COMMON'},
    dag=dag)

transform_common = PythonOperator(
    task_id='nudb_transform_common',
    python_callable=transform,
    provide_context=True,
    dag=dag)

load_common = PythonOperator(
    task_id='nudb_ingest_load_common',
    python_callable=load,
    provide_context=True,
    op_kwargs={ 'module' : 'COMMON'},
    dag=dag)

# extract_ws_digit = PythonOperator(
#     task_id='elastic_search_extract_ws_digit',
#     python_callable=dump_kibana,
#     provide_context=True,
#     do_xcom_push=True,
#     op_kwargs={ 'module' : 'WS_DIGIT'},
#     dag=dag)

# transform_ws_digit = PythonOperator(
#     task_id='nudb_transform_ws_digit',
#     python_callable=transform,
#     provide_context=True,
#     dag=dag)

# load_ws_digit = PythonOperator(
#     task_id='nudb_ingest_load_ws_digit',
#     python_callable=load,
#     provide_context=True,
#     op_kwargs={ 'module' : 'WS_DIGIT'},
#     dag=dag)

# extract_obps = PythonOperator(
#     task_id='elastic_search_extract_obps',
#     python_callable=dump_kibana,
#     provide_context=True,
#     do_xcom_push=True,
#     op_kwargs={ 'module' : 'OBPS'},
#     dag=dag)

# transform_obps = PythonOperator(
#     task_id='nudb_transform_obps',
#     python_callable=transform,
#     provide_context=True,
#     dag=dag)

# load_obps = PythonOperator(
#     task_id='nudb_ingest_load_obps',
#     python_callable=load,
#     provide_context=True,
#     op_kwargs={ 'module' : 'OBPS'},
#     dag=dag)



extract_tl >> transform_tl >> load_tl
extract_pgr >> transform_pgr >> load_pgr
extract_ws >> transform_ws >> load_ws
extract_pt >> transform_pt >> load_pt
extract_firenoc >> transform_firenoc >> load_firenoc
extract_mcollect >> transform_mcollect >> load_mcollect
extract_common >> transform_common >> load_common
#extract_ws_digit >> transform_ws_digit >> load_ws_digit
#extract_obps >> transform_obps >> load_obps