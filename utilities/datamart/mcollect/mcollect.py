import psycopg2
import csv
import pandas as pd
import numpy as np
import requests
import json
from dateutil import parser

def map_bs(s):
    if s == 'Tx.Ts1_copy_register_for_old_survey' or s == 'Tx.Ts1_Copy_Register_For_Old_Survey':
        return 'Taxes - TS1 copy register for old survey'
    elif s == 'Advt.Unipolls':
        return 'Advertisement Tax - Unipolls'
    elif s == 'Advt.Hoardings':
        return 'Advertisement Tax - Hoardings'
    elif s == 'Advt.Gas_Balloon_Advertisement':
        return 'Advertisement Tax - Gas Balloon Advertisement'
    elif s == 'Tx.Transfer_Property_Fees':
        return 'Taxes - Transfer Property Fees'
    elif s == 'Rt.Municipal_Shops_Rent':
        return 'Rents - Municipal Shops Rent'
    elif s == 'Advt.Wall_Paint_Advertisement':
        return 'Advertisement Tax - Wall Paint Advertisement'
    elif s == 'Tx.No_Dues_Certificate':
        return 'Taxes - No Dues Certificate'
    elif s == 'Advt.Light_Wala_Board':
        return 'Advertisement Tax - Light Wala Board'
    elif s == 'Tx.Electricity_Chungi':
    	return 'Taxes - Electricty Chungi'

def connect():
    try:
        conn = psycopg2.connect(database="{{REPLACE-WITH-DATABASE}}", user="{{REPLACE-WITH-USERNAME}}",
                            password="{{REPLACE-WITH-PASSWORD}}", host="{{REPLACE-WITH-HOST}}")
        print("Connection established!")

    except Exception as exception:
        print("Exception occurred while connecting to the database")
        print(exception)

    mCollectquery = "SELECT DISTINCT(chl.challanNo) AS \"Challan Number\", INITCAP(chl.businessService) AS \"Business Service\", INITCAP(chl.applicationstatus) AS \"Application Status\", chl.tenantid, adr.locality, eb.totalamount AS \"Total Amount Due\" ,eb.billno AS \"Bill Number\", INITCAP(bill.status) as \"Bill Status\" FROM eg_echallan chl INNER JOIN eg_challan_address adr ON chl.id=adr.echallanid LEFT OUTER JOIN egbs_billdetail_v1 eb ON chl.challanno=eb.consumercode LEFT OUTER JOIN egbs_bill_v1 bill ON eb.billid = bill.id WHERE chl.tenantid != 'pb.testing' AND chl.createdtime > {START_TIME} AND chl.createdtime < {END_TIME}"
    paidquery = "SELECT chl.challanNo AS \"Challan Number\", INITCAP(chl.businessService) AS \"Business Service\", INITCAP(chl.applicationstatus) AS \"Application Status\", chl.tenantid, adr.locality, ep.totaldue AS \"Total Amount Due\", ep.totalamountpaid as \"Total Amount Paid\", INITCAP(ep.paymentmode) AS \"Payment Mode\",INITCAP(ep.paymentstatus) AS \"Payment Status\",eb.billnumber AS \"Bill Number\", INITCAP(eb.status) as \"Bill Status\" FROM eg_echallan chl INNER JOIN eg_challan_address adr ON chl.id=adr.echallanid LEFT OUTER JOIN egcl_bill eb ON chl.challanno=eb.consumercode LEFT OUTER JOIN egcl_paymentdetail epd ON eb.id=epd.billid LEFT OUTER JOIN egcl_payment ep ON ep.id=epd.paymentid WHERE chl.tenantid != 'pb.testing' AND chl.applicationstatus = 'PAID'  AND chl.createdtime > {START_TIME} AND chl.createdtime < {END_TIME}"

    starttime = input('Enter start date (dd-mm-yyyy): ')
    endtime = input('Enter end date (dd-mm-yyyy): ')
    print(dateToEpoch(starttime))
    print(dateToEpoch(endtime))

    mCollectquery = mCollectquery.replace('{START_TIME}',dateToEpoch(starttime))
    mCollectquery = mCollectquery.replace('{END_TIME}',dateToEpoch(endtime))

    paidquery = paidquery.replace('{START_TIME}',dateToEpoch(starttime))
    paidquery = paidquery.replace('{END_TIME}',dateToEpoch(endtime))

    mCollectquery = pd.read_sql_query(mCollectquery, conn)
    paidquery =  pd.read_sql_query(paidquery, conn)

    mcollectgen = pd.DataFrame(mCollectquery)
    paid = pd.DataFrame(paidquery)
    mcollectgen['Business Service'] = mcollectgen['Business Service'].map(map_bs)

    mcollectgen = mcollectgen.append(paid)

    global uniquetenant
    uniquetenant = mcollectgen['tenantid'].unique()
    global accesstoken
    accesstoken = accessToken()
    global localitydict
    localitydict={}
    storeTenantValues()

    mcollectgen['Locality'] = mcollectgen.apply(lambda x : enrichLocality(x.tenantid,x.locality), axis=1)
    mcollectgen['Locality'] = mcollectgen['Locality'].str.upper().str.title()
    mcollectgen['City'] = mcollectgen['tenantid'].apply(lambda x: x[3:])
    mcollectgen['City']=mcollectgen['City'].str.upper().str.title()
    mcollectgen['State'] = mcollectgen['tenantid'].apply(lambda x: 'Punjab' if x[0:2]=='pb' else '')

    mcollectgen = mcollectgen.drop(columns=['tenantid','locality'])
    mcollectgen=mcollectgen.drop_duplicates(subset=['Challan Number'],keep='last')
    mcollectgen=mcollectgen.reset_index(drop=True)
    mcollectgen.fillna("", inplace=True)

    mcollectgen.to_csv('/tmp/mcollectDatamart.csv')
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
