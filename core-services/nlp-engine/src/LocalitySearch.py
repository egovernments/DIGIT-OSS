from flask import Flask, jsonify, request, send_file
from fuzzywuzzy import fuzz
from Config import *
import json
import requests
import string

punct= string.punctuation


def findLocality(city, locality):
    
    payload = {"RequestInfo":{}}
    payload = json.dumps(payload)
    url= EGOV_LOCATION_HOST + EGOV_LOCATION_SEARCH_URL + "?tenantId="+str(city.lower())

    response=requests.request("POST",url, data=payload, headers={"Content-Type": "application/json"})

    localities=list()
    tenant_boundaries=json.loads(response.text)["TenantBoundary"]

    for tenant in tenant_boundaries:
        for entry in tenant["boundary"]:
            for sub_entry in entry["children"]:
                for grand_entry in sub_entry["children"]:
                    for final in grand_entry["children"]:
                        
                        k=final["name"]
                        k=k.lower()
                        median=""
                        for character in k:
                            if character!=' ':
                                median+=character
                        k=median

                        median=""
                        locality= [i for i in locality if i not in punct]
                        locality= ''.join(locality)
                        locality=locality.lower()
                        
                        for character in locality:
                            if character!=' ':
                                median+=character
                        locality=median
                        locality=locality.lower()

                        if locality==k[0:len(locality)]:
                            a=list()
                            a.append(100)
                            b=dict()
                            b["code"]=final["code"]
                            b["name"]=final["name"]
                            checker=list()
                            for i in localities:
                                checker.append(i[1]["name"])
                            a.append(b)
                            if b["name"] not in checker:
                                localities.append(a)
                            
                        
                        if fuzz.ratio(locality.lower(),k)>=50:
                            a=list()
                            a.append(fuzz.ratio(locality,k))
                            b=dict()
                            b["code"]=final["code"]
                            b["name"]=final["name"]
                            checker=list()
                            for i in localities:
                                checker.append(i[1]["name"])
                            a.append(b)
                            if b["name"] not in checker:
                                localities.append(a)
    
    
    localities.sort(key=lambda x:x[0] ,reverse=False)
    predictions=list()

    for i in range(min(5,len(localities))):
        predictions.append(localities[len(localities)-1-i][1])
    
    
    
    g={"predictions":predictions}
    return g
