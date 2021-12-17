import psycopg2
import csv
import pandas as pd
import numpy as np
import requests
import json
from dateutil import parser

def map_appstatus(s):
    if s == 'PENDING_FOR_PAYMENT':
        return 'Pending for Payment'
    elif s == 'PENDING_FOR_CITIZEN_ACTION':
        return 'Pending for Citizen Action'
    elif s == 'PENDING_FOR_FIELD_INSPECTION':
        return 'Pending for Field Inspection'
    elif s == 'REJECTED':
        return 'Rejected'
    elif s == 'APPROVED':
        return 'Approved'
    elif s == 'PENDING_FOR_APPROVAL':
        return 'Pending for Approval'
    elif s == 'CONNECTION_ACTIVATED':
        return 'Connection Activated'
    elif s == 'PENDING_APPROVAL_FOR_CONNECTION':
        return 'Pending Approval for Connection'
    elif s == 'PENDING_FOR_CONNECTION_ACTIVATION':
        return 'Pending for Connection Activation'
    elif s == 'PENDING_FOR_DOCUMENT_VERIFICATION':
        return 'Pending for Document Verification'
    elif s == 'INITIATED':
        return 'Initiated'


def connect():
    try:
        conn = psycopg2.connect(database="{{REPLACE-WITH-DATABASE}}", user="{{REPLACE-WITH-USERNAME}}",
                            password="{{REPLACE-WITH-PASSWORD}}", host="{{REPLACE-WITH-HOST}}")
        print("Connection established!")

    except Exception as exception:
        print("Exception occurred while connecting to the database")
        print(exception)


    waterquery = "SELECT cn.applicationno AS \"Application Number\", cn.id AS \"Connection Id\",cn.connectionno AS \"Connection Number\", cn.status AS \"Status\", srv.connectiontype AS \"Connection Type\",    cn.applicationstatus AS \"Application Status\", CASE WHEN (cn.createdtime != 0) THEN to_timestamp(CAST(cn.createdtime AS bigint)/1000)::date END AS \"Application Start Datetime\", CASE WHEN (srv.connectionexecutiondate!= 0) THEN to_timestamp (CAST(srv.connectionexecutiondate AS bigint)/1000)::date END AS \"Connection Execution Datetime\",cn.tenantid, pt.locality, CASE WHEN hld.userid = ptown.userid then 'Yes' else 'No' END AS \"Property Owner is Connection Holder\" FROM (eg_ws_connection cn INNER JOIN eg_ws_service srv ON cn.id = srv.connection_id) INNER JOIN eg_pt_address pt ON pt.propertyid = cn.property_id LEFT OUTER JOIN eg_ws_connectionholder hld ON cn.id = hld.connectionid INNER JOIN eg_pt_owner ptown ON ptown.propertyid = cn.property_id INNER JOIN eg_ws_connection_Audit aud ON cn.id = aud.id WHERE cn.status != 'INACTIVE' AND cn.tenantId != 'pb.testing' AND cn.createdtime > {START_TIME} AND cn.createdtime < {END_TIME}"
    seweragequery = "SELECT cn.applicationno AS \"Application Number\", cn.id AS \"Connection Id\",cn.connectionno AS \"Connection Number\", cn.status AS \"Status\",   srv.connectiontype AS \"Connection Type\",    cn.applicationstatus AS \"Application Status\", CASE WHEN (cn.createdtime != 0) THEN to_timestamp(CAST(cn.createdtime AS bigint)/1000)::date END AS \"Application Start Datetime\", CASE WHEN (srv.connectionexecutiondate!= 0) THEN to_timestamp(CAST(srv.connectionexecutiondate AS bigint)/1000)::date END  \"Connection Execution Datetime\",cn.tenantid, pt.locality, CASE WHEN hld.userid = ptown.userid then 'Yes' else 'No' END AS \"Property Owner is Connection Holder\" FROM (eg_sw_connection cn  INNER JOIN eg_sw_service srv ON cn.id = srv.connection_id) INNER JOIN eg_pt_address pt ON pt.propertyid = cn.property_id LEFT OUTER JOIN eg_sw_connectionholder hld ON cn.id = hld.connectionid INNER JOIN eg_pt_owner ptown ON ptown.propertyid = cn.property_id WHERE cn.status != 'INACTIVE' AND cn.tenantId != 'pb.testing' AND cn.createdtime > {START_TIME} AND cn.createdtime < {END_TIME}"
    starttime = input('Enter start date (dd-mm-yyyy): ')
    endtime = input('Enter end date (dd-mm-yyyy): ')
    waterquery = waterquery.replace('{START_TIME}',dateToEpoch(starttime))
    waterquery = waterquery.replace('{END_TIME}',dateToEpoch(endtime))

    seweragequery = seweragequery.replace('{START_TIME}',dateToEpoch(starttime))
    seweragequery = seweragequery.replace('{END_TIME}',dateToEpoch(endtime))

    waterquery = pd.read_sql_query(waterquery, conn)
    waterpaymentquery = pd.read_sql_query("SELECT ws.applicationno AS \"Application Number\",ep.totaldue AS \"Total Amount Due\", ep.totalamountpaid AS \"Total Amount Paid\",ep.paymentmode AS \"Payment Mode\", ep.paymentstatus AS \"Payment Status\", ws.adhocpenalty AS \"Penalty\",ws.adhocrebate AS \"Interest\" FROM egcl_payment ep INNER JOIN egcl_paymentdetail epd ON ep.id=epd.paymentid INNER JOIN egcl_bill eb ON eb.id=epd.billid INNER JOIN eg_ws_connection ws ON ws.applicationno=eb.consumercode WHERE ws.status != 'INACTIVE' AND ws.tenantId != 'pb.testing'",conn)
    waterverifiedquery = pd.read_sql_query("Select businessid as \"Application Number\",CASE WHEN (createdtime != 0) THEN to_timestamp(CAST(createdtime AS bigint)/1000)::date END AS \"Application Verified and Sent Forward Datetime\" from eg_wf_processinstance_v2  where businessservice='NewWS1' or businessservice ='DEACTIVATE-NewWS1' and status in (select uuid from eg_wf_state_v2 where state='PENDING_FOR_FIELD_INSPECTION')",conn)
    waterapprovedquery = pd.read_sql_query("Select businessid as \"Application Number\", CASE WHEN (createdtime != 0) THEN to_timestamp(CAST(createdtime AS bigint)/1000)::date END AS \"Application Approved Datetime\" from eg_wf_processinstance_v2 where businessservice='NewWS1'  or businessservice ='DEACTIVATE-NewWS1'   and status in (select uuid from eg_wf_state_v2 where state='APPROVED')",conn)
    wateractivatedquery = pd.read_sql_query("Select businessid as \"Application Number\", CASE WHEN (createdtime != 0) THEN to_timestamp(CAST(createdtime AS bigint)/1000)::date END AS \"Connection Activated Datetime\" from eg_wf_processinstance_v2 where businessservice='NewWS1' or businessservice ='DEACTIVATE-NewWS1' and status in (select uuid from eg_wf_state_v2 where state='CONNECTION_ACTIVATED')",conn)

    seweragepaymentquery = pd.read_sql_query("SELECT sw.applicationno AS \"Application Number\", ep.totaldue AS \"Total Amount Due\", ep.totalamountpaid AS \"Total Amount Paid\", ep.paymentmode AS \"Payment Mode\", ep.paymentstatus AS \"Payment Status\", sw.adhocpenalty AS \"Penalty\", sw.adhocrebate AS \"Interest\" FROM egcl_payment ep INNER JOIN egcl_paymentdetail epd ON ep.id=epd.paymentid INNER JOIN egcl_bill eb ON eb.id=epd.billid INNER JOIN eg_sw_connection sw ON sw.applicationno=eb.consumercode WHERE sw.status != 'INACTIVE' AND sw.tenantId != 'pb.testing'",conn)
    seweragequery = pd.read_sql_query(seweragequery,conn)
    sewerageverifiedquery = pd.read_sql_query("Select businessid as \"Application Number\",CASE WHEN (createdtime != 0) THEN to_timestamp(CAST(createdtime AS bigint)/1000)::date END AS \"Application Verified and Sent Forward Datetime\" from eg_wf_processinstance_v2  where businessservice='NewSW1' or businessservice ='DEACTIVATE-NewSW1' and status in (select uuid from eg_wf_state_v2 where state='PENDING_FOR_FIELD_INSPECTION')",conn)
    sewerageapprovedquery = pd.read_sql_query("Select businessid as \"Application Number\", CASE WHEN (createdtime != 0) THEN to_timestamp(CAST(createdtime AS bigint)/1000)::date END AS \"Application Approved Datetime\" from eg_wf_processinstance_v2 where businessservice='NewSW1' or businessservice ='DEACTIVATE-NewSW1' and status in (select uuid from eg_wf_state_v2 where state='APPROVED')",conn)
    sewerageactivatedquery = pd.read_sql_query("Select businessid as \"Application Number\", CASE WHEN (createdtime != 0) THEN to_timestamp(CAST(createdtime AS bigint)/1000)::date END AS \"Connection Activated Datetime\" from eg_wf_processinstance_v2 where businessservice='NewSW1' or businessservice ='DEACTIVATE-NewSW1' and status in (select uuid from eg_wf_state_v2 where state='CONNECTION_ACTIVATED')",conn)


    watergen = pd.DataFrame(waterquery)
    waterpayment = pd.DataFrame(waterpaymentquery)
    waterverified = pd.DataFrame(waterverifiedquery)
    waterapproved = pd.DataFrame(waterapprovedquery)
    wateractivated = pd.DataFrame(wateractivatedquery)

    seweragegen = pd.DataFrame(seweragequery)
    seweragepayment = pd.DataFrame(seweragepaymentquery)
    sewerageverified = pd.DataFrame(sewerageverifiedquery)
    sewerageapproved = pd.DataFrame(sewerageapprovedquery)
    sewerageactivated = pd.DataFrame(sewerageactivatedquery)

    waterdata = pd.DataFrame()
    seweragedata = pd.DataFrame()

    waterdata = pd.merge(watergen,waterpayment,left_on='Application Number',right_on='Application Number',how='left')
    waterdata = pd.merge(waterdata,waterverified,left_on='Application Number',right_on='Application Number',how='left')
    waterdata = pd.merge(waterdata,waterapproved,left_on='Application Number',right_on='Application Number',how='left')
    waterdata = pd.merge(waterdata,wateractivated,left_on='Application Number',right_on='Application Number',how='left')


    seweragedata = pd.merge(seweragegen, seweragepayment,left_on='Application Number',right_on='Application Number',how='left' )
    seweragedata = pd.merge(seweragedata, sewerageverified,left_on='Application Number',right_on='Application Number',how='left' )
    seweragedata = pd.merge(seweragedata, sewerageapproved,left_on='Application Number',right_on='Application Number',how='left' )
    seweragedata = pd.merge(seweragedata, sewerageactivated,left_on='Application Number',right_on='Application Number',how='left' )


    waterdata['Application Status'] = waterdata['Application Status'].map(map_appstatus)
    seweragedata['Application Status'] = seweragedata['Application Status'].map(map_appstatus)

    waterdata = waterdata.rename(columns={"Application Start Datetime": "Application_Start_Datetime","Application Verified and Sent Forward Datetime":"Application_Verified_and_Sent_Forward_Datetime","Application Approved Datetime":"Application_Approved_Datetime","Connection Activated Datetime":"Connection_Activated_Datetime","Connection Execution Datetime":"Connection_Execution_Datetime"})
    seweragedata = seweragedata.rename(columns={"Application Start Datetime": "Application_Start_Datetime","Application Verified and Sent Forward Datetime":"Application_Verified_and_Sent_Forward_Datetime","Application Approved Datetime":"Application_Approved_Datetime","Connection Activated Datetime":"Connection_Activated_Datetime","Connection Execution Datetime":"Connection_Execution_Datetime"})

    waterdata['Application_Start_Datetime'] = pd.to_datetime(waterdata.Application_Start_Datetime, format='%Y-%m-%d')
    waterdata['Application_Verified_and_Sent_Forward_Datetime'] = pd.to_datetime(waterdata.Application_Verified_and_Sent_Forward_Datetime, format='%Y-%m-%d')
    waterdata['Application_Approved_Datetime'] = pd.to_datetime(waterdata.Application_Approved_Datetime, format='%Y-%m-%d')
    waterdata['Connection_Activated_Datetime'] = pd.to_datetime(waterdata.Connection_Activated_Datetime, format='%Y-%m-%d')
    waterdata['Connection_Execution_Datetime'] = pd.to_datetime(waterdata.Connection_Execution_Datetime, format='%Y-%m-%d')

    seweragedata['Application_Start_Datetime'] = pd.to_datetime(seweragedata.Application_Start_Datetime, format='%Y-%m-%d')
    seweragedata['Application_Verified_and_Sent_Forward_Datetime'] = pd.to_datetime(seweragedata.Application_Verified_and_Sent_Forward_Datetime, format='%Y-%m-%d')
    seweragedata['Application_Approved_Datetime'] = pd.to_datetime(seweragedata.Application_Approved_Datetime, format='%Y-%m-%d')
    seweragedata['Connection_Activated_Datetime'] = pd.to_datetime(seweragedata.Connection_Activated_Datetime, format='%Y-%m-%d')
    seweragedata['Connection_Execution_Datetime'] = pd.to_datetime(seweragedata.Connection_Execution_Datetime, format='%Y-%m-%d')

    waterdata['Application_Start_Datetime'] = waterdata['Application_Start_Datetime'].dt.strftime("%d-%m-%y")
    waterdata['Application_Verified_and_Sent_Forward_Datetime'] = waterdata['Application_Verified_and_Sent_Forward_Datetime'].dt.strftime("%d-%m-%y")
    waterdata['Application_Approved_Datetime'] = waterdata['Application_Approved_Datetime'].dt.strftime("%d-%m-%y")
    waterdata['Connection_Activated_Datetime'] = waterdata['Connection_Activated_Datetime'].dt.strftime("%d-%m-%y")
    waterdata['Connection_Execution_Datetime'] = waterdata['Connection_Execution_Datetime'].dt.strftime("%d-%m-%y")

    seweragedata['Application_Start_Datetime'] = seweragedata['Application_Start_Datetime'].dt.strftime("%d-%m-%y")
    seweragedata['Application_Verified_and_Sent_Forward_Datetime'] = seweragedata['Application_Verified_and_Sent_Forward_Datetime'].dt.strftime("%d-%m-%y")
    seweragedata['Application_Approved_Datetime'] = seweragedata['Application_Approved_Datetime'].dt.strftime("%d-%m-%y")
    seweragedata['Connection_Activated_Datetime'] = seweragedata['Connection_Activated_Datetime'].dt.strftime("%d-%m-%y")
    seweragedata['Connection_Execution_Datetime'] = seweragedata['Connection_Execution_Datetime'].dt.strftime("%d-%m-%y")

    waterdata = waterdata.rename(columns={"Application_Start_Datetime":"Application Start Datetime","Application_Verified_and_Sent_Forward_Datetime":"Application Verified and Sent Forward Datetime","Application_Approved_Datetime":"Application Approved Datetime","Connection_Activated_Datetime":"Connection Activated Datetime","Connection_Execution_Datetime":"Connection Execution Datetime"})
    seweragedata = seweragedata.rename(columns={"Application_Start_Datetime":"Application Start Datetime","Application_Verified_and_Sent_Forward_Datetime":"Application Verified and Sent Forward Datetime","Application_Approved_Datetime":"Application Approved Datetime","Connection_Activated_Datetime":"Connection Activated Datetime","Connection_Execution_Datetime":"Connection Execution Datetime"})

    global uniquetenant
    uniquetenantwater = waterdata['tenantid'].unique()
    uniquetenantsewerage = seweragedata['tenantid'].unique()
    uniquetenant =[*uniquetenantwater, *uniquetenantsewerage]
    uniquetenantset = set(uniquetenant)
    uniquetenant = list(uniquetenantset)
    global accesstoken
    accesstoken = accessToken()
    global localitydict
    localitydict={}
    storeTenantValues()

    waterdata['Locality'] = waterdata.apply(lambda x : enrichLocality(x.tenantid,x.locality), axis=1)
    seweragedata['Locality'] = seweragedata.apply(lambda x : enrichLocality(x.tenantid,x.locality), axis=1)

    waterdata['City'] = waterdata['tenantid'].apply(lambda x: x[3:])
    waterdata['City']=waterdata['City'].str.upper().str.title()
    waterdata['State'] = waterdata['tenantid'].apply(lambda x: 'Punjab' if x[0:2]=='pb' else '')

    seweragedata['City'] = seweragedata['tenantid'].apply(lambda x: x[3:])
    seweragedata['City']=seweragedata['City'].str.upper().str.title()
    seweragedata['State'] = seweragedata['tenantid'].apply(lambda x: 'Punjab' if x[0:2]=='pb' else '')

    waterdata = waterdata.drop(columns=['tenantid','locality'])
    seweragedata = seweragedata.drop(columns=['tenantid','locality','Connection Type'])

    waterdata.fillna('', inplace=True)
    seweragedata.fillna('', inplace=True)

    waterdata = waterdata.drop_duplicates(subset=['Application Number'],keep='last').reset_index(drop=True)
    seweragedata = seweragedata.drop_duplicates(subset=['Application Number'],keep='last').reset_index(drop=True)

    waterdata.to_csv('/tmp/waterDatamart.csv')
    seweragedata.to_csv('/tmp/sewerageDatamart.csv')

    print("Datamart exported. Please copy it using kubectl cp command to you required location.")

def accessToken():
    query = {'username':'{{REPLACE-WITH-USERNAME}}','password':'{{REPLACE-WITH-PASSWORD}}','userType':'EMPLOYEE',"scope":"read","grant_type":"password"}
    query['tenantId']='pb.amritsar'
    response = requests.post("{{REPLACE-WITH-URL}}",data=query, headers={
   "Connection":"keep-alive","content-type":"application/x-www-form-urlencoded", "origin":"{{REPLACE-WITH-URL}}","Authorization": "Basic ZWdvdi11c2VyLWNsaWVudDo="})
    jsondata = response.json()
    return jsondata.get('access_token')


def locationApiCall(tenantid):
    body = { "RequestInfo": {"apiId": "Rainmaker", "ver": ".01","ts": "","action": "","did": "1","key": "","msgId": "20170310130900|en_IN",}}
    body["RequestInfo"]["authToken"]=accesstoken
    paramlist = {"hierarchyTypeCode":"REVENUE","boundaryType":"locality"}
    paramlist["tenantId"]=tenantid
    response = requests.post("{{REPLACE-WITH-URL}}",params = paramlist,json=body, headers={
       "Connection":"keep-alive","content-type":"application/json;charset=UTF-8", "origin":"{{REPLACE-WITH-URL}}"})

    jsondata={}
    if response.status_code == 200:
        jsondata = response.json()
    else:
        return ''

    if 'TenantBoundary' in jsondata:
        jsondata = jsondata['TenantBoundary']
    else:
        return ''
    if len(jsondata)>0:
        jsondata = jsondata[0]
    else:
        return ''
    if 'boundary' in jsondata:
        jsondata = jsondata['boundary']
    else:
        return ''


    dictionary={}
    for v in jsondata:
        dictionary[v['code']]= v['name']

    return dictionary

def storeTenantValues():
    for tenant in uniquetenant:
        localitydict[tenant]=locationApiCall(tenant)


def enrichLocality(tenantid,locality):
    if tenantid in localitydict:
        if localitydict[tenantid]=='':
            return ''
        elif locality in localitydict[tenantid]:
            return localitydict[tenantid][locality]
        else:
            return ''
    else:
        return ''

def dateToEpoch(dateString):
     return str(parser.parse(dateString).timestamp() * 1000)

if __name__ == '__main__':
    connect()
