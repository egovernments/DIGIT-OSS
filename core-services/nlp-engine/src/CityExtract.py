import string
import nltk
from fuzzywuzzy import fuzz
from googletrans import Translator
from nltk.util import ngrams
import requests
import json
from Config import *

translator= Translator()

punctuations= string.punctuation

url = MDMS_HOST + MDMS_SEARCH_URL
data = {"RequestInfo":{},"MdmsCriteria":{"tenantId": "","moduleDetails":[{"moduleName":"", "masterDetails":[]}]}}
data["MdmsCriteria"]["tenantId"] = STATE_LEVEL_TENANTID
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

def find_city(city):
    city= [i for i in city if i not in punctuations]
    city= ''.join(city)
    city=city.lower()
    maxRatio=0
    cityResult=[[0,"Please try again"]]
     
    for j in master:
    
        if (city == j["cityName"].lower()[0:len(city)]):
            cityResult.append([100,j["tenantId"]])

        elif fuzz.ratio(city,j["cityName"].lower())>=50 :
            maxRatio=max(maxRatio,fuzz.ratio(city,j["cityName"].lower()))
            cityResult.append([fuzz.ratio(city,j["cityName"].lower()),j["tenantId"]])
            
    
    exactMatch='false'
    
    if maxRatio==100:
        exactMatch='true'
    k= sorted(cityResult)
       
    finalAnswer=list()
    for i in range(min(5,len(k))):
        finalAnswer.append(k[len(k)-1-i][1])
    
    return (finalAnswer,maxRatio,exactMatch)