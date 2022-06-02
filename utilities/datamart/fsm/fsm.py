import psycopg2
import csv
import pandas as pd
import numpy as np
import requests
import json
from dateutil import parser

def mapApplicationChannel(s):
     return  s.capitalize()
     
def map_vehicle_status(s):
    if s == 'SCHEDULED':
        return 'Scheduled'
    elif s == 'DISPOSED':
        return 'Disposed' 
    elif s == 'WAITING_FOR_DISPOSAL':
        return 'Waiting for disposal' 
    

def map_status(s):
    if s == 'CREATED':
        return 'Application Created'
    elif s == 'PENDING_APPL_FEE_PAYMENT':
        return 'Pending for payment'
    elif s == 'ASSING_DSO':
        return 'Pending for DSO Assignment'
    elif s == 'DSO_REJECTED':
        return 'DSO Rejected'
    elif s == 'DSO_INPROGRESS':
        return 'DSO Inprogress'
    elif s == 'PENDING_DSO_APPROVAL':
        return 'Pending for DSO Approval'
    elif s == 'COMPLETED':
        return 'Completed Request'
    elif s == 'REJECTED':
        return 'Rejected'
    elif s == 'CANCELED':
        return 'Cancelled'
    elif s == 'CITIZEN_FEEDBACK_PENDING':
        return 'Citizen feedback pending'

def map_propertytype(s):
    return  s.capitalize()

def map_propertySubType(s):
     return (s.replace('_',' ').capitalize())

def map_santationtype(s):

    if s =='SEPTIC_TANK_WITH_SOAK_PIT':
        return 'Septic tank with soak pit'

    elif s == 'CONVENTIONAL_SPECTIC_TANK':
        return 'Conventional Spectic tank'

    elif s=='CONVENTIONAL_SINGLE_PIT':
        return 'Conventional septic tanks with single pit'

    elif s=='Conventional septic tank with dual pit':
        return 'Improved septic tank - Upflow Anaerabic filter'

    elif s=='IMPROVED_PACKED':
        return 'Improved septic tank - Packaged contact aeration type'

    elif s=='JOHAKASU_SYSTEMS':
        return 'Johakasu systems'

    elif s=='BIO_DIGESTER':
        return 'Bio digester'

def map_vehicletype(s):

    if s=='MAHINDRA':
        return 'Mahindra'

    elif s=='MAHINDRA.BOLERO_PICKUP':
        return 'Bolero Pickup'

    elif s== 'TATA':

        return 'TATA'

    elif s== 'TATA.LPT709/34':

        return 'TATA LPT709/34'

    elif s== 'TATA.407':

        return 'TATA 407'

    elif s== 'TAFE':

        return 'TAFE'

    elif s== 'TAFE.TRACTOR_45DI':

        return 'TAFE Tractor 45DI'

    elif s== 'SONALIKA':
        return 'Sonalika'

    elif s== 'SONALIKA.TRACTOR_35DI':

       return 'Sonalika Tractor 35DI'
def map_paymentsource (s):
    return s.capitalize()
def map_paymentmode (s):
    return s.capitalize()

def mapstate(s):
    return 'Punjab'

def mapDistrict(s):
    if s =='Phagwara':
        return 'Jalandhar'

    else:
        return s;

def map_paymentsourceFromMode(s):
    if s=='Online' :
        return 'Online'
    else :
        return 'Counter'

def map_pincode(s):
    if s == '':
         return ''
    elif s.isdigit():
        return int(s)
    else:
        return s
def map_rating(s):
    if s == '':
         return ''
    else:
        return int (s)
def mapslumName(s):
    if s=='SL0001' :
        return 'Kathagada juanga sahi'
    elif s=='SL0002':
        return 'Kathagada Parbatia Sahi'
    elif s=='SL0003':
        return 'Gangadhar Sahi'
    elif s=='SL0004':
        return 'Pandab Nagar'
    elif s=='SL0005':
        return 'Haridakhandi Harijana sahi'
    elif s=='SL0006':
        return 'Haridakhandi Kadalibada sahi'
    elif s== 'SL0007':
        return 'Haridakhandi Bada Sahi'
    elif s== 'SL0008':
        return 'Haridakhandi Redika Sahi'
    elif s== 'SL0009':
        return 'Golapali Sahi'
    elif s== 'SL00010':
        return 'Surya Nagar'
    elif s== 'SL00011':
        return 'Damba Sahi'
    elif s== 'SL00012':
        return 'Raju Dhoba Sahi'
def mapplantname(s):
    if s =='AMR001':
        return 'Amritsar FSTP'
    elif s == 'MOH002':
        return 'Mohali SeTPP'


def connect():
    try:
        conn = psycopg2.connect(database="{{REPLACE-WITH-DATABASE}}", user="{{REPLACE-WITH-USERNAME}}",
                            password="{{REPLACE-WITH-PASSWORD}}", host="{{REPLACE-WITH-HOST}}")
        print("Connection established!")
    except Exception as exception:
        print("Exception occurred while connecting to the database")
        print(exception)

    fsmquery="SELECT fsm.tenantid,fsmvehicleTrip.applicationstatus AS Vehicle_Application_Status, fsm.applicationno  as ApplicationId,COALESCE(fsm.applicationStatus,'N/A') as ApplicationStatus,split_part(propertyusage::TEXT,'.', 1) as PropertyType, CASE WHEN split_part(propertyusage::TEXT,'.', 2)!='' THEN split_part(propertyusage::TEXT,'.', 2) ELSE 'N/A' END as PropertySubType,COALESCE(fsm.sanitationType,'N/A') as OnSiteSanitationType, COALESCE(REPLACE(fsmaddress.doorno,',','#'),'N/A') as DoorNumber, COALESCE(REPLACE(fsmaddress.street,',','#'),'N/A') as StreetName, COALESCE(fsmaddress.city,'N/A') as City, COALESCE(fsmaddress.pincode,'N/A') as Pincode, COALESCE(fsmaddress.locality,'N/A') as Locality, COALESCE(fsmaddress.district,'N/A') as District, COALESCE(fsmaddress.state,'N/A') as State, COALESCE(fsmaddress.slumname,'N/A') as SlumName, COALESCE(fsm.source,'N/A') as ApplicationSource,COALESCE(fsmdso.name,'N/A') as DesludgingEntity, COALESCE(fsmgeolocation.longitude,0) as Longitude, COALESCE(fsmgeolocation.latitude,0) as Latitude, CASE WHEN fsmgeolocation.longitude>0 THEN 'Yes' ELSE 'No' end as GeoLocationProvided,  COALESCE(fsmvehicle.registrationNumber,'N/A') as DesludgingVehicleNumber, COALESCE(fsm.vehicleType,'N/A') as VehicleType, COALESCE(fsmvehicle.tankcapicity,0) as VehicleCapacity , COALESCE(fsmvehicleTripdetail.volume,0) as WasteCollected, COALESCE(fsmvehicleTrip.volumeCarried,0) as WasteDumped, to_char((to_timestamp(fsmvehicleTrip.tripstarttime)::timestamp  at time zone 'utc' at time Zone 'Asia/Kolkata'), 'dd/mm/yyyy HH24:MI:SS') as VehicleInDateTime, to_char((to_timestamp(fsmvehicleTrip.tripendtime)::timestamp  at time zone 'utc' at time Zone 'Asia/Kolkata'), 'dd/mm/yyyy HH24:MI:SS') as VehicleOutDateTime,  fsmvehicleTrip.additionaldetails->>'plantCode' as fstpplant, COALESCE(fsmpayment.totalamountpaid,0) as PaymentAmount, COALESCE(fsmpayment.paymentstatus,'N/A') as PaymentStatus,COALESCE(fsmpayment.paymentmode,'N/A') as PaymentSource, COALESCE(fsmpayment.paymentmode,'N/A') as PaymentInstrumentType,to_char((to_timestamp(fsm.createdtime/1000)::timestamp  at time zone 'utc' at time Zone 'Asia/Kolkata'), 'dd/mm/yyyy HH24:MI:SS') as ApplicationSumbitDate  FROM eg_fsm_application as fsm JOIN eg_fsm_address as fsmaddress ON ( fsmaddress.fsm_id = fsm.id ) JOIN eg_fsm_geolocation as fsmgeolocation ON ( fsmaddress.id = fsmgeolocation.address_id ) LEFT JOIN eg_vendor as fsmdso ON ( fsmdso.id = fsm.dso_id)  LEFT JOIN eg_vehicle as fsmvehicle ON ( fsm.vehicle_id = fsmvehicle.id) LEFT JOIN eg_vehicle_trip_detail as fsmvehicleTripdetail ON ( fsmvehicleTripdetail.referenceNo = fsm.applicationNo) LEFT JOIN eg_vehicle_trip as fsmvehicleTrip ON ( fsmvehicleTripdetail.trip_id = fsmvehicleTrip.id) LEFT JOIN egcl_bill as egbill ON ( egbill.consumercode =fsm.applicationno) LEFT JOIN egcl_paymentdetail as paymentdl ON ( paymentdl.billid = egbill.id ) LEFT JOIN egcl_payment as fsmpayment ON ( fsmpayment.id=paymentdl.paymentid) AND fsm.createdtime > {START_TIME} AND fsm.createdtime < {END_TIME}"

    starttime = input('Enter start date (dd-mm-yyyy): ')
    endtime = input('Enter end date (dd-mm-yyyy): ')
    fsmquery = fsmquery.replace('{START_TIME}',dateToEpoch(starttime))
    fsmquery = fsmquery.replace('{END_TIME}',dateToEpoch(endtime))
    
    query = pd.read_sql_query(fsmquery, conn)
    data = pd.DataFrame(query)
    pendingpaymentstatus="select businessid as applicationno, to_char((to_timestamp(createdtime/1000)::timestamp  at time zone 'utc' at time Zone 'Asia/Kolkata'), 'dd/mm/yyyy HH24:MI:SS') as PendingPaymentSumbitDate from eg_wf_processinstance_v2  where businessservice='FSM'  and status in (select uuid from eg_wf_state_v2 where state='PENDING_APPL_FEE_PAYMENT')"
    pendingpaymentstatusQuery=pd.read_sql_query(pendingpaymentstatus, conn)
    pendingpaymentstatusData=pd.DataFrame(pendingpaymentstatusQuery)
    assigndsostatus="select businessid as applicationno, to_char((to_timestamp(createdtime/1000)::timestamp  at time zone 'utc' at time Zone 'Asia/Kolkata'), 'dd/mm/yyyy HH24:MI:SS') as PendingPaymentSumbitDate from eg_wf_processinstance_v2  where businessservice='FSM'  and status in (select uuid from eg_wf_state_v2 where state='ASSING_DSO')"
    assigndsostatusQuery=pd.read_sql_query(assigndsostatus, conn)
    assigndsostatusData=pd.DataFrame(assigndsostatusQuery)
    dsorejectstatus="select businessid as applicationno, to_char((to_timestamp(createdtime/1000)::timestamp  at time zone 'utc' at time Zone 'Asia/Kolkata'), 'dd/mm/yyyy HH24:MI:SS') as PendingPaymentSumbitDate from eg_wf_processinstance_v2  where businessservice='FSM'  and status in (select uuid from eg_wf_state_v2 where state='DSO_REJECTED')"
    dsorejectstatusQuery=pd.read_sql_query(dsorejectstatus, conn)
    dsorejectstatusData=pd.DataFrame(dsorejectstatusQuery)
    dsoinprogressstatus="select businessid as applicationno, to_char((to_timestamp(createdtime/1000)::timestamp  at time zone 'utc' at time Zone 'Asia/Kolkata'), 'dd/mm/yyyy HH24:MI:SS') as PendingPaymentSumbitDate from eg_wf_processinstance_v2  where businessservice='FSM'  and status in (select uuid from eg_wf_state_v2 where state='DSO_INPROGRESS')"
    dsoinprogressstatusQuery=pd.read_sql_query(dsoinprogressstatus, conn)
    dsoinprogressstatusData=pd.DataFrame(dsoinprogressstatusQuery)
    pendingdsoapprovalstatus="select businessid as applicationno, to_char((to_timestamp(createdtime/1000)::timestamp  at time zone 'utc' at time Zone 'Asia/Kolkata'), 'dd/mm/yyyy HH24:MI:SS') as PendingPaymentSumbitDate from eg_wf_processinstance_v2  where businessservice='FSM'  and status in (select uuid from eg_wf_state_v2 where state='PENDING_DSO_APPROVAL')"
    pendingdsoapprovalstatusQuery=pd.read_sql_query(pendingdsoapprovalstatus, conn)
    pendingdsoapprovalstatusData=pd.DataFrame(pendingdsoapprovalstatusQuery)
    completedstatus="select businessid as applicationno, to_char((to_timestamp(createdtime/1000)::timestamp  at time zone 'utc' at time Zone 'Asia/Kolkata'), 'dd/mm/yyyy HH24:MI:SS') as PendingPaymentSumbitDate,rating as rating from eg_wf_processinstance_v2  where businessservice='FSM'  and status in (select uuid from eg_wf_state_v2 where state='COMPLETED')"
    completedstatusQuery=pd.read_sql_query(completedstatus, conn)
    completedstatusData=pd.DataFrame(completedstatusQuery)
    rejectedstatus="select businessid as applicationno, to_char((to_timestamp(createdtime/1000)::timestamp  at time zone 'utc' at time Zone 'Asia/Kolkata'), 'dd/mm/yyyy HH24:MI:SS') as PendingPaymentSumbitDate from eg_wf_processinstance_v2  where businessservice='FSM'  and status in (select uuid from eg_wf_state_v2 where state='REJECTED')"
    rejectedstatus="select businessid as applicationno, to_char((to_timestamp(createdtime/1000)::timestamp  at time zone 'utc' at time Zone 'Asia/Kolkata'), 'dd/mm/yyyy HH24:MI:SS') as PendingPaymentSumbitDate from eg_wf_processinstance_v2  where businessservice='FSM'  and status in (select uuid from eg_wf_state_v2 where state='REJECTED')"
    rejectedstatusQuery=pd.read_sql_query(rejectedstatus,conn)
    rejectedstatusData=pd.DataFrame(rejectedstatusQuery)
    cancelledstatus="select businessid as applicationno, to_char((to_timestamp(createdtime/1000)::timestamp  at time zone 'utc' at time Zone 'Asia/Kolkata'), 'dd/mm/yyyy HH24:MI:SS') as PendingPaymentSumbitDate from eg_wf_processinstance_v2  where businessservice='FSM'  and status in (select uuid from eg_wf_state_v2 where state='CANCELED')"
    cancelledstatusQuery=pd.read_sql_query(cancelledstatus,conn)
    cancelledstatusData=pd.DataFrame(cancelledstatusQuery)
    citizenfeedbackstatus="select businessid as applicationno, to_char((to_timestamp(createdtime/1000)::timestamp  at time zone 'utc' at time Zone 'Asia/Kolkata'), 'dd/mm/yyyy HH24:MI:SS') as PendingPaymentSumbitDate from eg_wf_processinstance_v2  where businessservice='FSM'  and status in (select uuid from eg_wf_state_v2 where state='CITIZEN_FEEDBACK_PENDING')"
    citizenfeedbackstatusQuery=pd.read_sql_query(citizenfeedbackstatus,conn)
    citizenfeedbackstatusData=pd.DataFrame(citizenfeedbackstatusQuery)
    scheduledstatus="select referenceno as applicationno, to_char((to_timestamp(process.createdtime/1000)::timestamp  at time zone 'utc' at time Zone 'Asia/Kolkata'), 'dd/mm/yyyy HH24:MI:SS') as scheduleddatetime from eg_wf_processinstance_v2 as process inner join eg_vehicle_trip_detail as detail on process.businessid=detail.referenceno where businessservice='FSM_VEHICLE_TRIP' and process.status in (select uuid from eg_wf_state_v2 where state='SCHEDULED')"
    scheduledstatusQuery=pd.read_sql_query(scheduledstatus,conn)
    scheduledstatusData=pd.DataFrame(scheduledstatusQuery)
    waitingfordisposalstatus="select referenceno as applicationno, to_char((to_timestamp(process.createdtime/1000)::timestamp  at time zone 'utc' at time Zone 'Asia/Kolkata'), 'dd/mm/yyyy HH24:MI:SS') as waitingfordisposalassignedtime from eg_wf_processinstance_v2 as process inner join eg_vehicle_trip_detail as detail  on process.businessid=detail.referenceno where businessservice='FSM_VEHICLE_TRIP' and process.status in (select uuid from eg_wf_state_v2 where state='WAITING_FOR_DISPOSAL')"
    waitingfordisposalstatusQuery=pd.read_sql_query(waitingfordisposalstatus,conn)
    waitingfordisposalstatusData=pd.DataFrame(waitingfordisposalstatusQuery)
    disposedstatus="select referenceno as applicationno, to_char((to_timestamp(process.createdtime/1000)::timestamp  at time zone 'utc' at time Zone 'Asia/Kolkata'), 'dd/mm/yyyy HH24:MI:SS') as disposedtime from eg_wf_processinstance_v2 as process inner join eg_vehicle_trip_detail as detail  on process.businessid=detail.referenceno where businessservice='FSM_VEHICLE_TRIP' and process.status in (select uuid from eg_wf_state_v2 where state='DISPOSED')"
    disposedstatusQuery=pd.read_sql_query(disposedstatus,conn)
    disposedstatusData=pd.DataFrame(disposedstatusQuery)
    data.columns=['tenantid','Vehicle_Application_Status','Application ID','Application Status', 'Property Type','Property Sub Type','OnSite Sanitation Type','Door Number','Street Name','City','Pincode','Locality','District','State','Slum Name','Application Source','Desludging Entity','Longitude','Latitude','Geo Location Provided','Desludging Vehicle Number','Vehicle Type','Vehicle Capacity','Waste Collected','Waste Dumped','Vehicle In DateTime','Vehicle  Out DateTime','Fstp Plant Name','Payment Amount','Payment Status','Payment Source','Payment Instrument Type','Application Submitted Time']
    pendingpaymentstatusData.columns=['Application ID','Pending payment Submitted Time']
    assigndsostatusData.columns=['Application ID','Assigned DSO Submitted Time']
    dsorejectstatusData.columns=['Application ID','DSO Rejected Submitted Time']
    dsoinprogressstatusData.columns=['Application ID','DSO Inprogress Submitted Time']
    pendingdsoapprovalstatusData.columns=['Application ID','Pending DSO Approval Submitted Time']
    rejectedstatusData.columns=['Application ID','Rejected Date Time']
    cancelledstatusData.columns=['Application ID','Cancelled Date Time']
    citizenfeedbackstatusData.columns=['Application ID','Citizen feedback Submitted Date Time']
    completedstatusData.columns=['Application ID','Application Completed Time','Rating']
    scheduledstatusData.columns=['Application ID','Scheduled Time']
    waitingfordisposalstatusData.columns=['Application ID','Waiting for disposalTime']
    disposedstatusData.columns=['Application ID','Disposed Time']    
    fsmdata = pd.DataFrame()
    fsmdata=pd.merge(data,pendingpaymentstatusData,left_on='Application ID',right_on='Application ID',how='left')
    fsmdata=pd.merge(fsmdata,assigndsostatusData,left_on='Application ID',right_on='Application ID',how='left')
    fsmdata=pd.merge(fsmdata,dsorejectstatusData,left_on='Application ID',right_on='Application ID',how='left')
    fsmdata=pd.merge(fsmdata,dsoinprogressstatusData,left_on='Application ID',right_on='Application ID',how='left')
    fsmdata=pd.merge(fsmdata,pendingdsoapprovalstatusData,left_on='Application ID',right_on='Application ID',how='left')
    fsmdata=pd.merge(fsmdata,rejectedstatusData,left_on='Application ID',right_on='Application ID',how='left')
    fsmdata=pd.merge(fsmdata,cancelledstatusData,left_on='Application ID',right_on='Application ID',how='left')
    fsmdata=pd.merge(fsmdata,citizenfeedbackstatusData,left_on='Application ID',right_on='Application ID',how='left')
    fsmdata=pd.merge(fsmdata,completedstatusData,left_on='Application ID',right_on='Application ID',how='left') 
    fsmdata=pd.merge(fsmdata,scheduledstatusData,left_on='Application ID',right_on='Application ID',how='left') 
    fsmdata=pd.merge(fsmdata,waitingfordisposalstatusData,left_on='Application ID',right_on='Application ID',how='left')
    fsmdata=pd.merge(fsmdata,disposedstatusData,left_on='Application ID',right_on='Application ID',how='left')
    fsmdata['Application Status'] = fsmdata['Application Status'].map(map_status) 
    fsmdata['Property Type']=fsmdata['Property Type'].map(map_propertytype)
    fsmdata['Property Sub Type']=fsmdata['Property Sub Type'].map(map_propertySubType)
    fsmdata['SLA Planned (In Days)']=2 
    fsmdata=fsmdata.fillna('N/A')  
    fsmdata['Application Source'] =fsmdata['Application Source'].map(mapApplicationChannel)  
    fsmdata['OnSite Sanitation Type']= fsmdata['OnSite Sanitation Type'].map(map_santationtype)
    fsmdata['Application Completed Time']=fsmdata['Application Completed Time'].replace('N/A', '')
    fsmdata['Application Submitted Time']=fsmdata['Application Submitted Time'].replace('N/A', '') 
    fsmdata['Scheduled Time']=fsmdata['Scheduled Time'].replace('N/A', '')
    fsmdata['Waiting for disposalTime']=fsmdata['Waiting for disposalTime'].replace('N/A', '')
    fsmdata['Disposed Time']=fsmdata['Disposed Time'].replace('N/A', '')
    fsmdata = fsmdata.dropna(axis=0, subset=['Application Submitted Time'])
    fsmdata['SLA achieved'] = (pd.to_datetime(fsmdata['Application Completed Time'])- pd.to_datetime(fsmdata['Application Submitted Time'])).dt.days
    fsmdata=fsmdata.fillna('N/A') 
    fsmdata['Vehicle Type']=fsmdata['Vehicle Type'].map(map_vehicletype)  
    fsmdata['Payment Status'] =fsmdata['Payment Status'].map(map_paymentsource)  
    fsmdata['State']=fsmdata['State'].map(mapstate)
    fsmdata['District']=fsmdata['City']
    fsmdata['District']=fsmdata['District'].map(mapDistrict)
    fsmdata['Payment Source']= fsmdata['Payment Source'].map(map_paymentsource)
    fsmdata['Payment Source']=fsmdata['Payment Source'].map(map_paymentsourceFromMode)
    fsmdata['Waste Collected']=fsmdata['Waste Collected'].apply(np.int64)
    fsmdata['Payment Amount']=fsmdata['Payment Amount'].apply(np.int64)
    fsmdata['Rating']=fsmdata['Rating'].replace('N/A','')
    fsmdata['Rating']=fsmdata['Rating'].map(map_rating)
    fsmdata['Pincode']=fsmdata['Pincode'].replace('N/A','') 
    fsmdata['Pincode']=fsmdata['Pincode'].map(map_pincode)
    fsmdata['Longitude']=fsmdata['Longitude'].replace(0,'')
    fsmdata['Latitude']=fsmdata['Latitude'].replace(0,'')
    fsmdata['Longitude']=fsmdata['Longitude'].map(map_rating)    
    fsmdata['Latitude']=fsmdata['Latitude'].map(map_rating)  
    fsmdata['Slum Name'] = fsmdata['Slum Name'].map(mapslumName)
    fsmdata['Waste Dumped']=fsmdata['Waste Dumped'].apply(np.int64)
    fsmdata['Fstp Plant Name'] = fsmdata['Fstp Plant Name'].map(mapplantname)
    fsmdata['Vehicle_Application_Status'] = fsmdata['Vehicle_Application_Status'].map(map_vehicle_status)
    global uniquetenant
    uniquetenant = fsmdata['tenantid'].unique()
    global accesstoken
    accesstoken = accessToken()
    global localitydict
    localitydict={}
    storeTenantValues()

    fsmdata['Locality'] = fsmdata.apply(lambda x : enrichLocality(x.tenantid,x.Locality), axis=1)
    fsmdata = fsmdata.drop(columns=['tenantid'])
    fsmdata.fillna('', inplace=True)
    fsmdata=fsmdata.drop_duplicates(subset = ["Application ID"]).reset_index(drop=True)
    fsmdata.to_csv('/tmp/fsmDatamart.csv')

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

def dateToEpoch(dateString):
     return str(parser.parse(dateString).timestamp() * 1000)

if __name__ == '__main__':
   connect()
