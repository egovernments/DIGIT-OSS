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

def map_subownership(s):
    if s == 'Multipleowners':
        return 'Multiple Owners'
    elif s == 'Singleowner':
        return 'Single Owner'
    elif s == 'Privatetrust':
        return 'Private Trust'
    elif s == 'Privatecompany':
        return 'Private Company'
    elif s == 'Othersprivateinstituition':
        return 'Others Private Instituition'
    elif s == 'Stategovernment':
        return 'State Government'
    elif s == 'Othergovernmentinstituition':
        return 'Other Government Instituition'
    elif s == 'Privateboard':
        return 'Private Board'
    elif s == 'Central Government':
        return 'Central Government'
    elif s == 'Ulbgovernment':
        return 'Ulb Government'
    elif s == 'Ngo':
        return 'Ngo'
#Replace with correct password in relation to the database

def connect():
    try:
        conn = psycopg2.connect(database="{{REPLACE-WITH-DATABASE}}", user="{{REPLACE-WITH-USERNAME}}",
                            password="{{REPLACE-WITH-PASSWORD}}", host="{{REPLACE-WITH-HOST}}")
        print("Connection established!")

    except Exception as exception:
        print("Exception occurred while connecting to the database")
        print(exception)

    property_detailsquery = "select eg_pt_property.*, adr.locality as locality from eg_pt_property left outer join eg_pt_address adr on eg_pt_property.id = adr.propertyid where eg_pt_property.status='ACTIVE' and eg_pt_property.createdtime < 1606780799000 AND eg_pt_property.tenantId != 'pb.testing' AND eg_pt_property.createdtime  > {START_TIME} AND eg_pt_property.createdtime < {END_TIME}"

    starttime = input('Enter start date (dd-mm-yyyy): ')
    endtime = input('Enter end date (dd-mm-yyyy): ')
    property_detailsquery = property_detailsquery.replace('{START_TIME}',dateToEpoch(starttime))
    property_detailsquery = property_detailsquery.replace('{END_TIME}',dateToEpoch(endtime))

    property_detailsquery = pd.read_sql_query(property_detailsquery, conn)
    property_changesquery = pd.read_sql_query("SELECT ptid, isUsageCategorychanged,isOwnerShipCategorychanged,isOwnerDetailChanged,isUnitAreaChanged,financialyears,numberOfAssessments FROM ( SELECT data_rank.ptid as ptid, MAX(usage_rank) > 1 AS isUsageCategoryChanged, MAX(ownercategory_rank) > 1 AS isOwnerShipCategoryChanged,          MAX(ownerdetail_rank) > 1 AS isOwnerDetailChanged,         MAX(unitarea_rank) > 1 AS isUnitAreaChanged FROM ( SELECT             *, RANK() OVER( PARTITION BY pt_data.ptid ORDER BY          pt_data.usagemajor DESC ) usage_rank , RANK() OVER( PARTITION BY pt_data.ptid ORDER BY pt_data.ownercategory DESC ) ownercategory_rank, RANK() OVER( PARTITION BY pt_data.ptid ORDER BY pt_data.ownerids DESC ) ownerdetail_rank, RANK() OVER (PARTITION BY pt_data.ptid ORDER BY pt_data.totalunitarea DESC) unitarea_rank FROM (SELECT *, pt.propertyid AS ptid FROM eg_pt_property_v2 pt INNER JOIN (( SELECT *, CONCAT(usagecategorymajor, ',', usagecategoryminor) AS usagemajor, CONCAT(ownershipcategory, ',', subownershipcategory) AS ownercategory FROM eg_pt_propertydetail_v2 pd LEFT OUTER JOIN ( select SUM(unitarea) as totalunitarea, propertydetail from eg_pt_unit_v2 GROUP BY propertydetail) ut ON ut.propertydetail = pd.assessmentnumber WHERE tenantid != 'pb.testing' AND createdtime < 1606780799000 AND createdtime IN( SELECT max(createdtime) FROM eg_pt_propertydetail_v2 GROUP BY property, financialyear ) ) tmp INNER JOIN ( SELECT ARRAY_AGG( ow.userid ORDER BY ow.userid ) ownerids, propertydetail from eg_pt_owner_v2 ow GROUP BY propertydetail) owner_data ON owner_data.propertydetail = tmp.assessmentnumber)epd ON epd.property = pt.propertyid) pt_data ORDER BY usage_rank DESC ) data_rank GROUP BY data_rank.ptid ) fin_data INNER JOIN ( SELECT ARRAY_AGG( pd.financialyear ORDER BY pd.financialyear ) financialyears,property, count(DISTINCT financialyear) as numberOfAssessments from eg_pt_propertydetail_v2 pd WHERE tenantid != 'pb.testing' group by property) asmt_count ON  asmt_count.property = fin_data.ptid", conn)
    property_paymentsquery = pd.read_sql_query("SELECT eb.consumercode, count(*) as numberOfPayments, SUM(ep.totalamountpaid) FROM egcl_payment ep INNER JOIN egcl_paymentdetail epd ON ep.id=epd.paymentid INNER JOIN egcl_bill eb ON eb.id=epd.billid INNER JOIN (SELECT DISTINCT(propertyid) FROM eg_pt_property_v2 WHERE status ='ACTIVE' AND tenantId != 'pb.testing') pt ON pt.propertyid=eb.consumercode WHERE ep.createdtime < 1606780799000 AND paymentStatus!='CANCELLED' GROUP BY eb.consumercode", conn)
    property_demandsquery = pd.read_sql_query("select consumercode,sum(pt_tax) as total_tax_due from (select pt_tax,consumercode from egbs_demand_v1 dd INNER JOIN ( select SUM(taxamount) as pt_tax, demandid from egbs_demanddetail_v1 GROUP BY demandid ) ddtl ON dd.id = ddtl.demandid where dd.id IN ( select id from egbs_demand_v1 dd WHERE dd.tenantId!='pb.testing' AND businessservice = 'PT' AND dd.status='ACTIVE' AND dd.createdtime < 1606780799000) ) tp GROUP BY consumercode", conn)
    user_typesquery = pd.read_sql_query("select uuid,type,gender from eg_user", conn)
    assessment_countquery = pd.read_sql_query("SELECT ARRAY_AGG(DISTINCT pd.financialyear ORDER BY pd.financialyear) financialyears,property,count(DISTINCT financialyear) as numberOfAssessments from eg_pt_propertydetail_v2 pd WHERE tenantid != 'pb.testing' AND createdtime < 1606780799000 GROUP BY property", conn)
    assessment_demandquery = pd.read_sql_query("select pt_tax, pt_interest, pt_rebate, pt_unit_exemption,  pt_owner_exemption, pt_roundoff, pt_penalty, pt_fire_cess, pt_cancer_cess,consumercode, taxperiodfrom, CASE WHEN taxperiodfrom = 1364774400000 THEN '2013-14' WHEN taxperiodfrom = 1396310400000 THEN '2014-15' WHEN taxperiodfrom = 1427846400000 THEN '2015-16'  WHEN taxperiodfrom = 1459468800000 THEN '2016-17' WHEN taxperiodfrom = 1491004800000 THEN '2017-18' WHEN taxperiodfrom = 1522540800000 THEN '2018-19' WHEN taxperiodfrom = 1554076800000 THEN '2019-20' WHEN taxperiodfrom = 1585699200000 THEN '2020-21' END AS financialyear from egbs_demand_v1 dd INNER JOIN ( select SUM(taxamount) as pt_tax, demandid from egbs_demanddetail_v1 WHERE taxheadcode = 'PT_TAX' GROUP BY demandid ) ddtl ON dd.id = ddtl.demandid LEFT OUTER JOIN ( select SUM(taxamount) as pt_interest, demandid from egbs_demanddetail_v1 WHERE taxheadcode = 'PT_TIME_INTEREST' GROUP BY demandid ) ddtl_int ON dd.id = ddtl_int.demandid LEFT OUTER JOIN ( select SUM(taxamount) as pt_rebate, demandid from egbs_demanddetail_v1 WHERE taxheadcode = 'PT_TIME_REBATE' GROUP BY demandid ) ddtl_rb ON dd.id = ddtl_rb.demandid LEFT OUTER JOIN ( select SUM(taxamount) as pt_cancer_cess, demandid from egbs_demanddetail_v1 WHERE taxheadcode = 'PT_CANCER_CESS' GROUP BY demandid ) ddtl_cn ON dd.id = ddtl_cn.demandid LEFT OUTER JOIN ( select SUM(taxamount) as pt_fire_cess, demandid from egbs_demanddetail_v1 WHERE taxheadcode = 'PT_FIRE_CESS' GROUP BY demandid ) ddtl_fr ON dd.id = ddtl_fr.demandid LEFT OUTER JOIN ( select SUM(taxamount) as pt_roundoff, demandid from egbs_demanddetail_v1 WHERE taxheadcode = 'PT_ROUNDOFF' GROUP BY demandid ) ddtl_rd ON dd.id = ddtl_rd.demandid LEFT OUTER JOIN ( select SUM(taxamount) as pt_penalty, demandid from egbs_demanddetail_v1 WHERE taxheadcode = 'PT_TIME_PENALTY' GROUP BY demandid ) ddtl_pn ON dd.id = ddtl_pn.demandid LEFT OUTER JOIN ( select SUM(taxamount) as pt_unit_exemption, demandid from egbs_demanddetail_v1 WHERE taxheadcode = 'PT_UNIT_USAGE_EXEMPTION' GROUP BY demandid ) ddtl_ut ON dd.id = ddtl_ut.demandid LEFT OUTER JOIN ( select SUM(taxamount) as pt_owner_exemption, demandid from egbs_demanddetail_v1 WHERE taxheadcode = 'PT_OWNER_EXEMPTION' GROUP BY demandid ) ddtl_ow ON dd.id = ddtl_ow.demandid WHERE businessservice = 'PT' AND tenantId != 'pb.testing' AND dd.createdTime IN ( select max(createdTime) from egbs_demand_v1 WHERE businessservice = 'PT' GROUP BY consumercode, taxperiodfrom)", conn)
    assessment_changequery = pd.read_sql_query("with data as ( SELECT property as ptid, usagecategorymajor, usagecategoryminor, assessmentnumber, propertytype, propertysubtype,nooffloors, landarea, builduparea, adhocexemption, adhocpenalty,  ut.unitarea AS area, pd.financialyear as financialyear, pt_tax FROM eg_pt_propertydetail_v2 pd INNER JOIN ( select SUM(unitarea) as unitarea, propertydetail from eg_pt_unit_v2 GROUP BY propertydetail ) ut ON ut.propertydetail = pd.assessmentnumber INNER JOIN ( select pt_tax,consumercode,taxperiodfrom, CASE WHEN taxperiodfrom = 1364774400000 THEN '2013-14' WHEN taxperiodfrom = 1396310400000 THEN '2014-15' WHEN taxperiodfrom = 1427846400000 THEN '2015-16' WHEN taxperiodfrom = 1459468800000 THEN '2016-17' WHEN taxperiodfrom = 1491004800000 THEN '2017-18' WHEN taxperiodfrom = 1522540800000 THEN '2018-19' WHEN taxperiodfrom = 1554076800000 THEN '2019-20' WHEN taxperiodfrom = 1585699200000 THEN '2020-21' END AS financialyear from egbs_demand_v1 dd INNER JOIN (select SUM(taxamount) as pt_tax,demandid from egbs_demanddetail_v1 WHERE taxheadcode='PT_TAX' GROUP BY demandid) ddtl ON dd.id=ddtl.demandid WHERE businessservice = 'PT' AND tenantId != 'pb.testing' AND dd.createdTime IN (select max(createdTime) from egbs_demand_v1 WHERE businessservice = 'PT' GROUP BY consumercode,taxperiodfrom) ) demand ON demand.consumercode = pd.property AND demand.financialyear = pd.financialyear WHERE tenantid != 'pb.testing' AND createdtime IN ( SELECT  max(createdtime) FROM eg_pt_propertydetail_v2 GROUP BY property, financialyear ) AND pd.createdtime < 1606780799000 ), data_lag as (     SELECT ptid,area,pt_tax, financialyear,usagecategorymajor,usagecategoryminor,propertytype, propertysubtype, assessmentnumber, nooffloors, landarea, builduparea,adhocexemption, adhocpenalty, LAG(area,1) OVER ( PARTITION BY ptid ORDER BY financialyear ASC ) previous_year_area, LAG(pt_tax,1) OVER (PARTITION BY ptid ORDER BY financialyear ASC ) previous_year_tax from data ) select (area - previous_year_area) as diff,(pt_tax - previous_year_tax) as tax_diff, data_lag.ptid,usagecategorymajor,usagecategoryminor,propertytype,assessmentnumber,propertysubtype, nooffloors, landarea, builduparea, adhocexemption,adhocpenalty, area, financialyear, pt_tax from data_lag", conn)

    property_details = pd.DataFrame(property_detailsquery)
    property_changes = pd.DataFrame(property_changesquery)
    property_payments = pd.DataFrame(property_paymentsquery)
    property_demands = pd.DataFrame(property_demandsquery)
    user_types = pd.DataFrame(user_typesquery)
    assessment_count = pd.DataFrame(assessment_countquery)
    assessment_demand = pd.DataFrame(assessment_demandquery)
    assessment_change = pd.DataFrame(assessment_changequery)

    property_changes = property_changes.drop(columns=['financialyears','numberofassessments'])
    data = pd.merge(property_details,property_changes,left_on='propertyid',right_on='ptid')
    data[['propertytype','propertySubType']] = pd.DataFrame(data.propertytype.str.split('.',1).tolist(),columns = ['property_type','property_subtype'])
    data[['ownershipcategory','subownershipCategory']] = pd.DataFrame(data.ownershipcategory.str.split('.',1).tolist(),columns = ['ownershipcategory','subownershipcategory'])
    data[['usagecategory','usageCategoryMinor']] = pd.DataFrame(data.usagecategory.str.split('.',1).tolist(),columns = ['usagecategory','usageCategoryMinor'])

    data = pd.merge(data,property_payments,left_on='propertyid',right_on='consumercode',how='left')
    data = pd.merge(data,property_demands,left_on='propertyid',right_on='consumercode',how='left')
    data = pd.merge(data,assessment_count,left_on='propertyid',right_on='property',how='left')
    data_asmt = pd.merge(assessment_demand,assessment_change,left_on=['consumercode','financialyear'],right_on=['ptid','financialyear'],how='inner')
    data = pd.merge(data,user_types,left_on='createdby',right_on='uuid',how='left')
    data['ULB_Type'] = data['tenantid'].map(map_MC)

    columns_to_retain=['propertyid', 'tenantid','propertytype',
       'ownershipcategory', 'usagecategory', 'creationreason', 'nooffloors',
       'landarea', 'superbuiltuparea', 'source', 'channel', 'additionaldetails',
       'isusagecategorychanged','isownershipcategorychanged', 'isownerdetailchanged',
       'isunitareachanged', 'financialyears', 'numberofassessments','numberofpayments',
       'sum','total_tax_due','type','gender','propertySubType','subownershipCategory',
        'usageCategoryMinor','ULB_Type','locality']

    data = data[columns_to_retain]
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
    dict = {0 : "Others", 1 : "Female", 2 : "Male", 3 : "Transgender"}
    data['gender'] = data['gender'].map(dict)

    data = data.rename(columns={"sum": "Total_Amount_Paid","type":"User Type Of Creator",
                           "propertyid": "Property Id",
                            "propertytype" : "Property Type",
                            "ownershipcategory":"Ownership Category",
                            "usagecategory":"Usage Category",
                            "creationreason":"Creation Reason",
                            "landarea":"Land Area",
                            "superbuiltuparea":"Builtup Area",
                            "source":"Source",
                            "channel":"Channel",
                           "additionaldetails":"Additional Details",
                               "isusagecategorychanged":"Usage Category Changed?",
                               "isownershipcategorychanged":"Ownership Category Changed?",
                               "isownerdetailchanged":"Owner Detail Changed?",
                               "isunitareachanged":"Unit Area Changed?",
                               "financialyears":"Financial Years",
                               "numberofassessments":"Number of Assessments",
                               "numberofpayments":"Number of Payments",
                            "sum":"Sum",
                               "total_tax_due":"Total Tax Due",
                               "type":"Type",
                            "gender":"Gender",
                               "propertySubType":"Property Subtype",
                               "subownershipCategory":"Subownership Category",
                              "usageCategoryMinor":"Usage Category Minor",
                               "ULB_Type":"ULB Type"                      })

    data["Property Type"]= data["Property Type"].str.upper().str.title()
    data["Ownership Category"]= data["Ownership Category"].str.upper().str.title()
    data["Usage Category"]= data["Usage Category"].str.upper().str.title()
    data["Creation Reason"]= data["Creation Reason"].str.upper().str.title()
    data["Source"]= data["Source"].str.upper().str.title()
    data["Channel"]= data["Channel"].str.upper().str.title()
    data["Type"]= data["Type"].str.upper().str.title()
    data["Property Subtype"]= data["Property Subtype"].str.upper().str.title()
    data["Subownership Category"]= data["Subownership Category"].str.upper().str.title()
    data["Usage Category Minor"]= data["Usage Category Minor"].str.upper().str.title()

    data['Usage Category Changed?']=data['Usage Category Changed?'].map({False:'No',True:'Yes'})
    data['Ownership Category Changed?']=data['Ownership Category Changed?'].map({False:'No',True:'Yes'})
    data['Owner Detail Changed?']=data['Owner Detail Changed?'].map({False:'No',True:'Yes'})
    data['Unit Area Changed?']=data['Unit Area Changed?'].map({False:'No',True:'Yes'})
    data['Source']=data['Source'].map({'Municipal_Records':'Municipal Records'})
    data['Property Subtype']=data['Property Subtype'].map({'Independentproperty':'Independent Property','Sharedproperty':'Shared Property'})

    data['Subownership Category'] = data['Subownership Category'].map(map_subownership)
    data = data.drop_duplicates(subset = ["Property Id"]).reset_index(drop=True)
    data.fillna("", inplace=True)
    data.to_csv('/tmp/ptDatamart.csv')
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
