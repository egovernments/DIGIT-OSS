from flask import Flask, jsonify,request
import requests
from  CityExtract import *
from flask_ngrok import run_with_ngrok
import json
from googletrans import Translator
from Config import *
import json

translator= Translator()

#CALLING THE LOCALIZATION SERVICE

url = LOCALIZATION_URL

payload = json.dumps({
  "RequestInfo": {}
})
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)
responseData = json.loads(response.text)

#FETCHING THE VARIABLES FROM THE LOCALIZATION

WELCOME_MESSAGE = [i["message"] for i in responseData["messages"] if i["code"]=="WELCOME_MESSAGE"][0]
PREFIX = [i["message"] for i in responseData["messages"] if i["code"]=="PREFIX"][0]
CATEGORY = [i["message"] for i in responseData["messages"] if i["code"]=="CATEGORY"][0]
SRC_NAME_LOCALITY = [i["message"] for i in responseData["messages"] if i["code"]=="SRC_NAME_LOCALITY"][0]
MESSAGE_TOKEN = [i["message"] for i in responseData["messages"] if i["code"]=="MESSAGE_TOKEN"][0]
VALID_SELECTION = [i["message"] for i in responseData["messages"] if i["code"]=="VALID_SELECTION"][0]
MSEVA = [i["message"] for i in responseData["messages"] if i["code"]=="MSEVA"][0]
CITY_LIST = [i["message"] for i in responseData["messages"] if i["code"]=="CITY_LIST"][0]
UTF_8 = [i["message"] for i in responseData["messages"] if i["code"]=="UTF_8"][0]

CityGupshup=Flask(__name__)
run_with_ngrok(CityGupshup)

cacheCities={}
cacheFinal={}
source={}

welcomeMessage= WELCOME_MESSAGE


@CityGupshup.route('/',methods=['POST'])
def reply():
    requestData=request.get_json()
    inp=requestData["payload"]["payload"]["text"]

    destination=requestData["payload"]["source"]

    default = PREFIX +destination+ CATEGORY + SRC_NAME_LOCALITY

    payload=default
    inp=inp.lower()
    inp_2=inp
    
    #IF THE INPUT IS A GREETING

    if (inp in GREETINGS):
        inp=translator.translate(inp,dest='en')
        src=inp.src
        inp=inp.text
        inp=inp.lower()
        source["src"]=src
        
    #IF INPUT NOT A GREETING

    if (inp not in GREETINGS):
        inp=inp_2

    url_2 = GUPSHUP_URL
    headers = {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/x-www-form-urlencoded',
      'apikey': '443fbc250a744864c880cc6d373692cb',
      'cache-control': 'no-cache'
                      }
                      
    #IF INPUT IS A GREETING MESSAGE
                      
    if(inp in GREETINGS):
        cacheCities.clear()
        cacheFinal.clear()
        k=payload.index(MESSAGE_TOKEN)
        payload=payload[0:k]+MESSAGE_TOKEN+translator.translate(welcomeMessage,dest=source["src"]).text+ SRC_NAME_LOCALITY
        
    #IF INPUT IS AN INTEGER
    
    elif (inp>="1" and inp<="9" and int(inp)>=1 and int(inp)<=9):
    
        #IF THE INPUT IS NOT A VALID SELECTION
        
        if (int(inp)>len(cacheCities) or int(inp)<1):
            
            k=payload.index(MESSAGE_TOKEN)
            payload=payload[0:k]+MESSAGE_TOKEN+translator.translate(VALID_SELECTION,dest=source["src"]).text+translator.translate(MSEVA,dest=source["src"]).text+ SRC_NAME_LOCALITY
        
        #IF THE INPUT IS A VALID SELECTION
        
        else:
            
            city= cacheCities[int(inp)]
            k=payload.index(MESSAGE_TOKEN)
            payload=payload[0:k]+ MESSAGE_TOKEN +translator.translate((city[0].upper()+city[1:].lower()),dest=source["src"]).text+" \n"+ translator.translate(MSEVA,dest=source["src"]).text+ SRC_NAME_LOCALITY
            
            cacheCities.clear()
            

    else:
        
        #IF THE INPUT IS NEITHER AN INTEGER NOR GREETING, TAKE IT AS A CITY NAME.
    
        if (len(cacheCities)==0):
            m={"input_city":inp,"input_lang":"hindi"}
            response=requests.post(url=CITY_LOCALHOST, data=json.dumps(m), headers={"Content-Type": "application/json"})
            cities=json.loads(response.text)["city_detected"]
            count=1
            cityList=translator.translate(CITY_LIST,dest=source["src"]).text+'\n'
            
            #CREATE A CITY LIST BASED ON PREDICTIONS.
            
            for i in cities:
                cacheCities[count]=i[3:]
                cityList+=(str(count)+'.')
                cityList+=translator.translate((i[3].upper()+i[4:].lower()), dest=source["src"]).text+'\n'
                count+=1

            cityList+='\n'
            cityList+=translator.translate(MSEVA,dest=source["src"]).text

            k=payload.index(MESSAGE_TOKEN)
            payload=payload[0:k]+MESSAGE_TOKEN+cityList+ SRC_NAME_LOCALITY

    payload=payload.encode(UTF_8)          
    response = requests.request("POST", url_2, headers=headers, data = payload)

    return ""

CityGupshup.run()