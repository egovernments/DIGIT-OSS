import psycopg2
import csv
import pandas as pd
import numpy as np
import requests
import json
from dateutil import parser

def map_MC(s):
    if s in MC:
        return 'MC'
    elif s in MC1:
        return 'MC1'
    elif s in MC2:
        return 'MC2'
    elif s in MC3:
        return 'MC3'
    elif s in NP:
        return 'NP'

MC=['pb.abohar',
               'pb.amritsar',
               'pb.batala',
               'pb.bathinda',
               'pb.hoshiarpur',
               'pb.jalandhar',
               'pb.kapurthala',
               'pb.ludhiana',
               'pb.moga',
               'pb.mohali',
               'pb.pathankot',
               'pb.patiala',
               'pb.phagwara']

MC1 = ['pb.anandpursahib',
               'pb.barnala',
               'pb.derabassi',
               'pb.faridkot',
               'pb.fazilka',
               'pb.ferozepur',
               'pb.gurdaspur',
               'pb.jagraon',
               'pb.khanna',
               'pb.kharar',
               'pb.kotkapura',
               'pb.lalru',
               'pb.malerkotla',
               'pb.malout',
               'pb.mandigobindgarh',
               'pb.mansa',
               'pb.muktsar',
               'pb.nabha',
               'pb.nakodar',
               'pb.nangal',
               'pb.nawanshahr',
               'pb.rajpura',
               'pb.samana',
               'pb.sangrur',
               'pb.sunam',
               'pb.zirakpur']

MC2 = ['pb.adampur',
               	'pb.ahmedgarh',
               	'pb.baghapurana',
               	'pb.banga',
               	'pb.bhawanigarh',
               	'pb.bhogpur',
               	'pb.bhuchomandi',
               	'pb.budhlada',
               	'pb.dasuya',
               	'pb.dharamkot',
               	'pb.dhariwal',
               	'pb.dhuri',
               	'pb.dinanagar',
               	'pb.doraha',
               	'pb.garhshankar',
               	'pb.gidderbaha',
               	'pb.goniana',
               	'pb.goraya',
               	'pb.guruharsahai',
               	'pb.jaitu',
               	'pb.jalalabad',
               	'pb.jandialaguru',
               	'pb.kartarpur',
               	'pb.kurali',
               	'pb.lehragaga',
               	'pb.maur',
               	'pb.morinda',
               	'pb.mukerian',
               	'pb.mullanpur',
               	'pb.nayagaon',
               	'pb.nurmahal',
               	'pb.patran',
               	'pb.patti',
               	'pb.phillaur',
               	'pb.raikot',
               	'pb.raman',
               	'pb.rampuraphul',
               	'pb.ropar',
               	'pb.sahnewal',
               	'pb.samrala',
               	'pb.sirhind',
               	'pb.sujanpur',
               	'pb.sultanpurlodhi',
               	'pb.talwandibhai',
               	'pb.tarntaran',
               	'pb.urmartanda',
               	'pb.zira']

MC3 = ['pb.alawalpur',
               	'pb.amloh',
               	'pb.balachaur',
               	'pb.banur',
               	'pb.bareta',
               	'pb.bassipathana',
               	'pb.bhadaur',
               	'pb.derababananak',
               	'pb.dhanaula',
               	'pb.fatehgarhchurian',
               	'pb.garhdiwala',
               	'pb.hariana',
               	'pb.kotfatta',
               	'pb.longowal',
               	'pb.machhiwara',
               	'pb.majitha',
               	'pb.payal',
               	'pb.quadian',
               	'pb.rahon',
               	'pb.ramdass',
               	'pb.sanaur',
               	'pb.sangatmandi',
               	'pb.shamchurasi',
               	'pb.srihargobindpur',
               	'pb.tapa']

NP = ['pb.ajnala',
               	'pb.amargarh',
               	'pb.arniwala',
               	'pb.badhnikalan',
               	'pb.balianwali',
               	'pb.bariwala',
               	'pb.begowal',
               	'pb.bhadson',
               	'pb.bhagtabhai',
               	'pb.bhairoopa',
               	'pb.bhikhi',
               	'pb.bhikhiwind',
               	'pb.bhulath',
               	'pb.bilga',
               	'pb.boha',
               	'pb.chamkaursahib',
               	'pb.chaunke',
               	'pb.cheema',
               	'pb.dhilwan',
               	'pb.dirba',
               	'pb.fatehgarhpanjtoor',
               	'pb.ghagga',
               	'pb.ghanaur',
               	'pb.handiaya',
               	'pb.joga',
               	'pb.khamano',
               	'pb.khanauri',
               	'pb.khemkaran',
               	'pb.kiratpur',
               	'pb.kothaguru',
               	'pb.kotissekhan',
               	'pb.kotshamir',
               	'pb.lehramohabbat',
               	'pb.lohiankhas',
               	'pb.mahilpur',
               	'pb.makhu',
               	'pb.mallanwala',
               	'pb.maloud',
               	'pb.maluka',
               	'pb.mamdot',
               	'pb.mandikalan',
               	'pb.mehatpur',
               	'pb.mehraj',
               	'pb.moonak',
               	'pb.mudki',
               	'pb.nadala',
               	'pb.narotjaimalsingh',
               	'pb.nathana',
               	'pb.nihalsinghwala',
               	'pb.rajasansi',
               	'pb.rampura',
               	'pb.rayya',
               	'pb.sardulgarh',
               	'pb.shahkot',
               	'pb.talwandisabo',
               	'pb.talwara']

def map_ownershipsubtype(s):
    if s == 'Institutional':
        return 'Institutional'
    elif s == 'Individual':
        return 'Individual'
    elif s == 'Individual.Singleowner':
        return 'Single Owner'
    elif s == 'Institutionalgovernment.Stategovernment':
        return 'State Government'
    elif s == 'Institutionalgovernment.Ulbgovernment':
        return 'Ulb Government'
    elif s == 'Institutionalgovernment.Centralgovernment':
        return 'Central Government'
    elif s == 'Institutionalprivate.Othersgovernmentinstituition':
        return 'Other Government Instituition'
    elif s == 'Individual.Multipleowners':
        return 'Multiple Owners'
    elif s == 'Institutionalprivate.Privatetrust':
        return 'Private Trust'
    elif s == 'Institutionalprivate.Privatecompany':
        return 'Private Company'
    elif s == 'Institutionalprivate.Othersprivateinstituition':
        return 'Other Private Instituition'
    elif s == 'Institutionalprivate.Ngo':
        return 'Ngo'
    elif s == 'Institutionalprivate.Privateboard':
        return 'Private Board'

def map_ownershiptype(s):
    if s in Institutional:
        return 'Institutional'
    elif s in InstitutionalPrivate:
        return 'Institutional Private'
    elif s in InstitutionalGovernment:
        return 'Institutional Government'
    elif s in Individual:
        return 'Individual'

Institutional = ['Institutional']

InstitutionalPrivate = ['Other Private Instituition','Private Company','Private Board', 'Private Trust','Ngo']

InstitutionalGovernment = ['Other Government Instituition','State Government','Central Government','Ulb Government',]

Individual = ['Individual','Multiple Owners','Single Owner']

def map_status(s):
    if s == 'APPROVED':
        return 'Approved'
    elif s == 'INITIATED':
        return 'Initiated'
    elif s == 'Cancelled':
        return 'Cancelled'
    elif s == 'Applied':
        return 'Applied'
    elif s == 'REJECTED':
        return 'Rejected'
    elif s == 'INPROGRESS':
        return 'Inprogress'
    elif s == 'DOC_VERIFICATION_INPROGRESS':
        return 'Document Verification Inprogress'
    elif s == 'FIELDINSPECTION_INPROGRESS':
        return 'Field Inspection Inprogress'
    elif s == 'REVOCATED':
        return 'Revocated'
    elif s == 'APPROVAL_INPROGRESS':
        return 'Aprproval Inprogress'
    elif s == 'PENDING_SANC_FEE_PAYMENT':
        return 'Pending Sanction Fee Payment'
    elif s == 'NOC_VERIFICATION_INPROGRESS':
        return 'NOC Verification Inprogress'
    elif s == 'PENDING_APPL_FEE':
        return 'Pending Application Fee'
    elif s == 'PERMIT REVOCATION':
        return 'Permit Revocation'
    elif s == 'CITIZEN_ACTION_PENDING_AT_FI_VERIF':
        return 'Citizen Action Pending At FI Verification'
    elif s == 'CITIZEN_ACTION_PENDING_AT_DOC_VERIF':
        return 'Citizen Action Pending At Document Verification'
    elif s == 'CITIZEN_APPROVAL_INPROCESS':
        return 'Citizen Approval Inprogress'
    elif s == 'PENDING_FEE':
        return 'Pending Fee'


def map_gender(s):
    if s == 1:
        return 'Female'
    elif s == 2:
        return 'Male'
    elif s == 3:
        return 'Transgender'


def connect():
    try:
        conn = psycopg2.connect(database="{{REPLACE-WITH-DATABASE}}", user="{{REPLACE-WITH-USERNAME}}",
                            password="{{REPLACE-WITH-PASSWORD}}", host="{{REPLACE-WITH-HOST}}")
        print("Connection established!")

    except Exception as exception:
        print("Exception occurred while connecting to the database")
        print(exception)

    dataquery = "SELECT DISTINCT(bp.applicationno) AS \"Application Number\", CASE WHEN (bp.applicationdate!= 0) THEN to_timestamp(CAST(bp.applicationdate AS bigint)/1000)::date END AS \"Application Date\", bp.edcrnumber AS \"eDCR Number\", bp.tenantid, adr.locality, bp.status AS \"Application Status\", usr.gender AS \"Application Gender\", INITCAP(usr.type) AS \"Logged in User\", bp.additionaldetails->> 'serviceType' AS \"Service Type\",  bp.additionaldetails->>'applicationType' AS \"Application Type\", bp.businessservice AS \"Business Service\",land.occupancytype AS \"Occupancy Type\", INITCAP(landinfo.ownershipcategory) AS \"Ownership Subtype\", CASE WHEN bp.businessservice = 'BPA_OC' THEN CASE WHEN (bp.approvaldate!= 0) THEN to_timestamp(CAST(bp.approvaldate AS bigint)/1000)::date END END AS \"OC Issued Date\", CASE WHEN bp.businessservice = 'BPA' THEN CASE WHEN (bp.approvaldate!= 0) THEN to_timestamp(CAST(bp.approvaldate AS bigint)/1000)::date END END AS \"Permit Issued Date\" ,CASE WHEN bp.businessservice = 'BPA_LOW' THEN CASE WHEN (bp.approvaldate!= 0) THEN to_timestamp(CAST(bp.approvaldate AS bigint)/1000)::date END END AS \"Permit Low Issued Date\" FROM eg_bpa_buildingplan bp LEFT OUTER JOIN eg_user usr ON bp.createdby = usr.uuid INNER JOIN eg_land_unit land ON land.landinfoid = bp.landid INNER JOIN eg_land_landinfo landinfo ON land.landinfoid = landinfo.id LEFT OUTER JOIN eg_land_address adr ON adr.landinfoid = landinfo.id WHERE bp.tenantid != 'pb.testing'  AND bp.createdtime > {START_TIME} AND bp.createdtime < {END_TIME}"

    starttime = input('Enter start date (dd-mm-yyyy): ')
    endtime = input('Enter end date (dd-mm-yyyy): ')
    dataquery = dataquery.replace('{START_TIME}',dateToEpoch(starttime))
    dataquery = dataquery.replace('{END_TIME}',dateToEpoch(endtime))

    dataquery = pd.read_sql_query(dataquery, conn)
    sanctionquery = pd.read_sql_query("SELECT bp.edcrnumber AS \"eDCR Number\",ep.totaldue As \"Sanction Fee Total Amount Due\", ep.totalamountpaid as \"Sanction Fee Total Amount Paid\", INITCAP(ep.paymentmode) AS \"Sanction Fee Payment Mode\",CASE WHEN (ep.createdtime!= 0) THEN to_timestamp(CAST(ep.createdtime AS bigint)/1000)::date END AS \"Sanction Fee Payment Date\" FROM eg_bpa_buildingplan bp LEFT OUTER JOIN egcl_bill eb ON bp.applicationno=eb.consumercode LEFT OUTER JOIN egcl_paymentdetail epd ON eb.id=epd.billid LEFT OUTER JOIN egcl_payment ep ON ep.id=epd.paymentid WHERE epd.businessservice = 'BPA.NC_SAN_FEE' OR epd.businessservice = 'BPA.NC_OC_SAN_FEE'", conn)
    feequery = pd.read_sql_query("SELECT bp.edcrnumber AS \"eDCR Number\",ep.totaldue As \"Application Fee Total Amount Due\", ep.totalamountpaid as \"Application Fee Total Amount Paid\", INITCAP(ep.paymentmode) AS \"Application Fee Payment Mode\",CASE WHEN (ep.createdtime!= 0) THEN to_timestamp(CAST(ep.createdtime AS bigint)/1000)::date END AS \"Application Fee Payment Date\" FROM eg_bpa_buildingplan bp LEFT OUTER JOIN egcl_bill eb ON bp.applicationno=eb.consumercode LEFT OUTER JOIN egcl_paymentdetail epd ON eb.id=epd.billid LEFT OUTER JOIN egcl_payment ep ON ep.id=epd.paymentid WHERE epd.businessservice = 'BPA.NC_APP_FEE' OR epd.businessservice = 'BPA.NC_OC_APP_FEE' OR epd.businessservice = 'BPA.LOW_RISK_PERMIT_FEE'", conn)
    firequery = pd.read_sql_query("SELECT DISTINCT(bp.edcrnumber) AS \"eDCR Number\", CASE WHEN (noc.createdtime!= 0) THEN to_timestamp(CAST(noc.createdtime AS bigint)/1000)::date END AS \"Fire Noc Sent Date\" ,CASE WHEN noc.applicationstatus = 'APPROVED' or noc.applicationstatus = 'REJECTED' or noc.applicationstatus = 'AUTO_APPROVED' THEN  CASE WHEN (bs.createdtime!= 0) THEN to_timestamp(CAST(bs.createdtime AS bigint)/1000)::date END END AS \"Fire Noc Approved/Rejected Date\", INITCAP(noc.applicationstatus) AS \"Fire Noc Status\" FROM eg_bpa_buildingplan bp INNER JOIN eg_noc noc ON bp.applicationno = noc.sourcerefid LEFT OUTER JOIN eg_wf_processinstance_v2 wf ON bp.applicationno = wf.businessid LEFT OUTER JOIN eg_wf_businessservice_v2 bs ON wf.businessservice = bs.businessservice LEFT OUTER JOIN eg_wf_state_v2 state ON  state.businessserviceid = bs.uuid WHERE noc.noctype = 'FIRE_NOC'", conn)
    airportquery = pd.read_sql_query("SELECT DISTINCT(bp.edcrnumber) AS \"eDCR Number\", CASE WHEN (noc.createdtime!= 0) THEN to_timestamp(CAST(noc.createdtime AS bigint)/1000)::date END AS \"Airport Noc Sent Date\" ,CASE WHEN noc.applicationstatus = 'APPROVED' or noc.applicationstatus = 'REJECTED' or noc.applicationstatus = 'AUTO_APPROVED' THEN  CASE WHEN (bs.createdtime!= 0) THEN to_timestamp(CAST(bs.createdtime AS bigint)/1000)::date END END AS \"Airport Noc Approved/Rejected Date\", INITCAP(noc.applicationstatus) AS \"Airport Noc Status\" FROM eg_bpa_buildingplan bp INNER JOIN eg_noc noc ON bp.applicationno = noc.sourcerefid LEFT OUTER JOIN eg_wf_processinstance_v2 wf ON bp.applicationno = wf.businessid LEFT OUTER JOIN eg_wf_businessservice_v2 bs ON wf.businessservice = bs.businessservice LEFT OUTER JOIN eg_wf_state_v2 state ON  state.businessserviceid = bs.uuid WHERE noctype = 'AIRPORT_AUTHORITY'", conn)
    ownergenderquery = pd.read_sql_query("SELECT bp.edcrnumber AS \"eDCR Number\",usr.gender AS \"Owner Gender\" FROM eg_bpa_buildingplan bp LEFT OUTER JOIN eg_land_unit land ON land.landinfoid = bp.landid INNER JOIN eg_land_landinfo landinfo ON land.landinfoid = landinfo.id INNER JOIN eg_land_ownerinfo owner ON owner.landinfoid = landinfo.id LEFT OUTER JOIN eg_user usr ON owner.uuid = usr.uuid",conn)

    data = pd.DataFrame(dataquery)
    sanction = pd.DataFrame(sanctionquery)
    fee = pd.DataFrame(feequery)
    fire = pd.DataFrame(firequery)
    airport = pd.DataFrame(airportquery)
    ownergender = pd.DataFrame(ownergenderquery)

    data = pd.merge(data, sanction, how="left", on=["eDCR Number"])
    data = pd.merge(data, fee, how="left", on=["eDCR Number"])
    data = pd.merge(data, fire, how="left", on=["eDCR Number"])
    data = pd.merge(data, airport, how="left", on=["eDCR Number"])
    data = pd.merge(data, ownergender, how="inner", on=["eDCR Number"])

    data['Airport Noc?'] = pd.notnull(data['Airport Noc Sent Date']).map({True:'Yes',False:'No'})
    data['Fire Noc?'] = pd.notnull(data['Fire Noc Sent Date']).map({True:'Yes',False:'No'})

    data['Ownership Subtype'] = data['Ownership Subtype'].map(map_ownershipsubtype)
    data['Ownership Type'] = data['Ownership Subtype'].map(map_ownershiptype)

    data['ULB Type'] = data['tenantid'].map(map_MC)

    data['Service Type'] = data['Service Type'].map({'NEW_CONSTRUCTION':'New Construction'})
    data['Application Status'] = data['Application Status'].map(map_status)
    data['Application Type'] = data['Application Type'].map({'BUILDING_PLAN_SCRUTINY':'Building Plan Scrutiny','BUILDING_OC_PLAN_SCRUTINY':'Building OC Plan Scrutiny'})
    data['Business Service'] = data['Business Service'].map({'BPA':"Bpa",'BPA_LOW':'Bpa Low Risk','BPA_OC':'Bpa OC'})

    data = data.rename(columns={"Fire Noc Sent Date":"FireSent","Airport Noc Sent Date":"AirportSent","Fire Noc Approved/Rejected Date":"FireRecieved", "Airport Noc Approved/Rejected Date":"AirportRecieved","Application Date": "Application_Date","OC Issued Date":"oc_date","Permit Issued Date":"permit_date", "Permit Low Issued Date":"permit_low_date","Sanction Fee Payment Date":"sanction_fee","Application Fee Payment Date":"app_fee"})
    data['Application_Date'] = pd.to_datetime(data.Application_Date, format='%Y-%m-%d')
    data['oc_date'] = pd.to_datetime(data.oc_date, format='%Y-%m-%d')
    data['permit_date'] = pd.to_datetime(data.permit_date, format='%Y-%m-%d')
    data['permit_low_date'] = pd.to_datetime(data.permit_low_date, format='%Y-%m-%d')
    data['sanction_fee'] = pd.to_datetime(data.sanction_fee, format='%Y-%m-%d')
    data['app_fee'] = pd.to_datetime(data.app_fee, format='%Y-%m-%d')
    data['FireSent'] = pd.to_datetime(data.FireSent, format='%Y-%m-%d')
    data['AirportSent'] = pd.to_datetime(data.AirportSent, format='%Y-%m-%d')
    data['FireRecieved'] = pd.to_datetime(data.FireRecieved, format='%Y-%m-%d')
    data['AirportRecieved'] = pd.to_datetime(data.AirportRecieved, format='%Y-%m-%d')

    data['Application_Date'] = data['Application_Date'].dt.strftime("%d-%m-%y")
    data['oc_date'] = data['oc_date'].dt.strftime("%d-%m-%y")
    data['permit_date'] = data['permit_date'].dt.strftime("%d-%m-%y")
    data['permit_low_date'] =data['permit_low_date'].dt.strftime("%d-%m-%y")
    data['sanction_fee'] = data['sanction_fee'].dt.strftime("%d-%m-%y")
    data['app_fee'] = data['app_fee'].dt.strftime("%d-%m-%y")
    data['FireSent'] = data['FireSent'].dt.strftime("%d-%m-%y")
    data['AirportSent'] = data['AirportSent'].dt.strftime("%d-%m-%y")
    data['FireRecieved'] = data['FireRecieved'].dt.strftime("%d-%m-%y")
    data['AirportRecieved'] = data['AirportRecieved'].dt.strftime("%d-%m-%y")

    data = data.rename(columns={"FireSent":"Fire Noc Sent Date","AirportSent":"Airport Noc Sent Date","FireRecieved":"Fire Noc Approved/Rejected Date","AirportRecieved":"Airport Noc Approved/Rejected Date", "oc_date":"OC Issued Date","permit_date":"Permit Issued Date","permit_low_date":"Permit Low Risk Issued Date","sanction_fee":"Sanction Fee Payment Date","app_fee":"Application Fee Payment Date"})

    data["Application Gender"] = data["Application Gender"].map(map_gender)
    data["Owner Gender"] = data["Owner Gender"].map(map_gender)

    data['FinancialYear'] = ""
    data['FinancialYear'] = data.apply(lambda x: calcFinancialYear(x.Application_Date), axis=1)

    data = data.rename(columns={ "FinancialYear":"Financial Year","Application_Date":"Application Date"})

    global uniquetenant
    uniquetenant = data['tenantid'].unique()
    global accesstoken
    accesstoken = accessToken()
    global localitydict
    localitydict={}
    storeTenantValues()

    data['Locality'] = data.apply(lambda x : enrichLocality(x.tenantid,x.locality), axis=1)
    data['Locality'] = data['Locality'].str.upper().str.title()
    data['City'] = data['tenantid'].apply(lambda x: x[3:])
    data['City']=data['City'].str.upper().str.title()
    data['State'] = data['tenantid'].apply(lambda x: 'Punjab' if x[0:2]=='pb' else '')

    data = data.drop(columns=['tenantid','locality'])
    data = data.drop_duplicates(subset=['Application Number'],keep='last').reset_index(drop=True)
    data = data[['eDCR Number',
    'Application Number',
 'Application Date',
    'Financial Year',
 'Application Status',
  'Application Type',
 'Application Gender',
 'Logged in User',
  'Business Service',
 'Service Type',
 'Occupancy Type',
  'Ownership Type',
 'Ownership Subtype',
 'Owner Gender',
 'OC Issued Date',
 'Permit Issued Date',
 'Permit Low Risk Issued Date',
 'Sanction Fee Total Amount Due',
 'Sanction Fee Total Amount Paid',
 'Sanction Fee Payment Mode',
 'Sanction Fee Payment Date',
 'Application Fee Total Amount Due',
 'Application Fee Total Amount Paid',
 'Application Fee Payment Mode',
 'Application Fee Payment Date',
  'Fire Noc?',
 'Fire Noc Sent Date',
             'Fire Noc Approved/Rejected Date',
  'Airport Noc?',
 'Airport Noc Sent Date',
       'Airport Noc Approved/Rejected Date',
 'ULB Type','Locality','City','State']]


    data.fillna("", inplace=True)

    data.to_csv('/tmp/bpaDatamart.csv')

    print("Datamart exported. Please copy it using kubectl cp command to your required location.")


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

def calcFinancialYear(x):
    if(isinstance(x, str)):
        if int(x[3:5])<=3:
            return ("20"+str(int(x[-2:])-1)+" - 20"+x[-2:])
        else:
            return ("20"+x[-2:]+" - 20"+str(int(x[-2:])+1))

def dateToEpoch(dateString):
     return str(parser.parse(dateString).timestamp() * 1000)

if __name__ == '__main__':
    connect()
    