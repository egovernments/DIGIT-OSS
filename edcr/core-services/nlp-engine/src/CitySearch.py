from fuzzywuzzy import fuzz
from googletrans import Translator
from nltk.util import ngrams
from Config import *
import string
import nltk
import requests
import json
import os

translator= Translator()

punct= string.punctuation

url = MDMS_HOST + MDMS_SEARCH_URL
data = {"RequestInfo":{},"MdmsCriteria":{"tenantId": "","moduleDetails":[{"moduleName":"", "masterDetails":[]}]}}
data["MdmsCriteria"]["tenantId"] = os.environ.get('DEFAULT_LOCALISATION_TENANT')
data["MdmsCriteria"]["moduleDetails"][0]["moduleName"] = MDMS_MODULE_NAME
masterDeatils = {"name":CITY_MASTER}
data["MdmsCriteria"]["moduleDetails"][0]["masterDetails"].append(masterDeatils)
masterDeatils = {"name":CITY_LOCALE_MASTER}
data["MdmsCriteria"]["moduleDetails"][0]["masterDetails"].append(masterDeatils)
payload = json.dumps(data)

response = requests.post(url, data=payload, headers={"Content-Type": "application/json"})
res = json.loads(response.text)

citiesData=res["MdmsRes"]["Chatbot"]["CityNames"]
master = res["MdmsRes"]["Chatbot"]["CityLocaleMasterData"]
cities=[]
for data in citiesData:
    cities = cities + data['cities']

def findCity(a):
    a= [i for i in a if i not in punct]
    a= ''.join(a)
    a=a.lower()

    max1=0
    city=[[0,"Please try again"]]
    #result=list()
    
    for j in master:

        if (a == j["cityName"].lower()[0:len(a)]):
            city.append([100,j["tenantId"]])
            
        elif fuzz.ratio(a,j["cityName"].lower())>=50 :
            max1=max(max1,fuzz.ratio(a,j["cityName"].lower()))
            city.append([fuzz.ratio(a,j["cityName"].lower()),j["tenantId"]])
            #result.append(j["CityName"].lower())
                
                
    exact_match='false'
    if max1==100:
        exact_match='true'
    k= sorted(city)
   

    
    final_answer=list()
    for i in range(min(5,len(k))):
        final_answer.append(k[len(k)-1-i][1])
    
    return (final_answer,max1,exact_match)
    #return (k,max1,exact_match)
