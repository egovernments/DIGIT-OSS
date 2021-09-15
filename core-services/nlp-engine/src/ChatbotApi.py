from IntentRecognition import *
from flask import Flask, jsonify, request, send_file
from EntityRecognition import *
import requests
from googletrans import Translator
from fuzzywuzzy import fuzz
from Config import *
import json

from CityExtract import find_city
import time

import speech_recognition as sr
from os import path
from pydub import AudioSegment

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

PREFIX  = [i["message"] for i in responseData["messages"] if i["code"]=="PREFIX"][0]
CATEGORY = [i["message"] for i in responseData["messages"] if i["code"]=="CATEGORY"][0]
SRC_NAME = [i["message"] for i in responseData["messages"] if i["code"]=="SRC_NAME"][0]
MESSAGE_TOKEN = [i["message"] for i in responseData["messages"] if i["code"]=="MESSAGE_TOKEN"][0]
CITY_PART_1 = [i["message"] for i in responseData["messages"] if i["code"]=="CITY_PART_1"][0]
CITY_PART_2 = [i["message"] for i in responseData["messages"] if i["code"]=="CITY_PART_2"][0]
CITY_CONFIRMATION = [i["message"] for i in responseData["messages"] if i["code"]=="CITY_CONFIRMATION"][0]
WELCOME_RESULT = [i["message"] for i in responseData["messages"] if i["code"]=="WELCOME_RESULT"][0]
ASK_CITY_NAME = [i["message"] for i in responseData["messages"] if i["code"]=="ASK_CITY_NAME"][0]
RECEIPT_TOKEN = [i["message"] for i in responseData["messages"] if i["code"]=="RECEIPT_TOKEN"][0]
WATER_RECEIPTS = [i["message"] for i in responseData["messages"] if i["code"]=="WATER_RECEIPTS"][0]
TRADE_RECEIPTS = [i["message"] for i in responseData["messages"] if i["code"]=="TRADE_RECEIPTS"][0]
PROPERTY_RECEIPTS = [i["message"] for i in responseData["messages"] if i["code"]=="PROPERTY_RECEIPTS"][0]
BILL_TOKEN = [i["message"] for i in responseData["messages"] if i["code"]=="BILL_TOKEN"][0]
BILL_TOKEN_NEW = [i["message"] for i in responseData["messages"] if i["code"]=="BILL_TOKEN_NEW"][0]
UTF_8 = [i["message"] for i in responseData["messages"] if i["code"]=="UTF_8"][0]
WATER_BILL = [i["message"] for i in responseData["messages"] if i["code"]=="WATER_BILL"][0]
TRADE_BILL = [i["message"] for i in responseData["messages"] if i["code"]=="TRADE_BILLBILL"][0]
PROPERTY_BILL = [i["message"] for i in responseData["messages"] if i["code"]=="PROPERTY_BILL"][0]
AUDIO_ERROR = [i["message"] for i in responseData["messages"] if i["code"]=="AUDIOFILE_SIZE_ERROR"][0]
FORMAT_ERROR = [i["message"] for i in responseData["messages"] if i["code"]=="FORMAT_ERROR"][0]
AUDIO_FILESIZE_LIMIT = int([i["message"] for i in responseData["messages"] if i["code"]=="AUDIO_FILESIZE_LIMIT"][0])

translator= Translator()
languages = LANGUAGE_CODES

# LANGUAGE FUZZY MATCHING
def close_to(entry):
    entry=entry.lower()
    for i in languages.keys():
        if fuzz.ratio(i,entry)>=75:
            return i
    return 'english'

ChatbotApi = Flask(__name__)

@ChatbotApi.route('/', methods=['POST'])
def reply():
    requestData=request.get_json()
    inp=""
    
    #PROCESSING THE REQUEST DATA
    destination=requestData["payload"]["source"]
    default = PREFIX+destination + CATEGORY +SRC_NAME
    payload= default
            
    url = GUPSHUP_URL
    headers = {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded',
            'apikey': '37cef3c8bf164df7cdc0a36eae94beec',
            'cache-control': 'no-cache'
                      }
    
    # IF INPUT IS A VOICE MESSAGE
    if requestData["payload"]["type"]=="audio" :
        audioUrl=requestData["payload"]["payload"]["url"]
        getAudioFile=requests.get(audioUrl, allow_redirects=True)
        open('voice_message.ogg', 'wb').write(getAudioFile.content)
        sound=AudioSegment.from_ogg("voice_message.ogg")
        
        sound.export("voice_message.wav", format="wav")
        
        #AUDIO FILE SIZE VALIDATION --> IF AUDIO FILE IS TOO LARGE, RETURN AN ERROR MESSAGE.
        audioFilesize = path.getsize("voice_message.wav")
        
        if audioFilesize>AUDIO_FILESIZE_LIMIT:
            k=payload.index(MESSAGE_TOKEN)
            payload=payload[0:k]+MESSAGE_TOKEN+translator.translate(AUDIO_ERROR,dest='en').text+ SRC_NAME
            response = requests.request("POST", url, headers=headers, data = payload)
            return ""
                     

        AUDIO_FILE = "voice_message.wav"
        r = sr.Recognizer()
        with sr.AudioFile(AUDIO_FILE) as source:
            audio = r.record(source)
            inp=r.recognize_google(audio)
            
    #VALIDATE THAT THE INPUT MESSAGE IS IN TEXT FORMAT (IF NOT AUDIO)
    elif requestData["payload"]["type"]!="text" :
        k=payload.index(MESSAGE_TOKEN)
        payload=payload[0:k]+MESSAGE_TOKEN+translator.translate(FORMAT_ERROR,dest='en').text+ SRC_NAME
        response = requests.request("POST", url, headers=headers, data = payload)
        return ""
    
    else:
        inp=requestData["payload"]["payload"]["text"]

    inp=inp.lower()
 
    # INPUT IS TAKEN AS CITY NAME
    if len(inp.split())==1 and inp not in GREETINGS:
        answer=find_city(inp)[0].upper()
        answer=answer[0]+answer[1:].lower()

        k=payload.index(MESSAGE_TOKEN)
        payload=payload[0:k]+MESSAGE_TOKEN+translator.translate(CITY_PART_1 +answer+ CITY_PART_2,dest='en').text+ SRC_NAME
        response = requests.request("POST", url, headers=headers, data = payload)

        payload=payload[0:k]+MESSAGE_TOKEN+translator.translate(CITY_CONFIRMATION,dest='en').text+ SRC_NAME
        response = requests.request("POST", url, headers=headers, data = payload)
        return ""
        

    inp=translator.translate(inp,dest='en')
    sourceLanguage=inp.src
    inp=inp.text
    result= process(inp)
    
    resultArray=result.split()
    
    # IF OUTPUT IS A WELCOME MESSAGE
    if resultArray[0]==WELCOME_RESULT :
        
        k=payload.index(MESSAGE_TOKEN)
        payload=payload[0:k]+MESSAGE_TOKEN+translator.translate(result,dest=sourceLanguage).text+ SRC_NAME
        response = requests.request("POST", url, headers=headers, data = payload)
        
        
        k=payload.index(MESSAGE_TOKEN)
        payload=payload[0:k]+MESSAGE_TOKEN+translator.translate(ASK_CITY_NAME,dest=sourceLanguage).text+ SRC_NAME
    
    #OUTPUT IS A RECEIPT    
    elif resultArray[0]==RECEIPT_TOKEN:
        if WATER in resultArray:
            payload = PREFIX+destination+ WATER_RECEIPTS+ SRC_NAME

        elif TRADE in resultArray:
            payload = PREFIX+destination+ TRADE_RECEIPTS + SRC_NAME

        elif PROPERTY in resultArray:
            payload = PREFIX+destination+ PROPERTY_RECEIPTS + SRC_NAME

        else:
        
            #Send out a message that entity is not mentioned properly.
            
            k=payload.index(MESSAGE_TOKEN)
            payload=payload[0:k]+MESSAGE_TOKEN+translator.translate(result,dest=sourceLanguage).text+ SRC_NAME 
            
    #OUTPUT IS A BILL
    elif resultArray[0]==BILL_TOKEN:
        
        k=payload.index(MESSAGE_TOKEN)
        payload=payload[0:k]+MESSAGE_TOKEN+translator.translate(result,dest=sourceLanguage).text+ SRC_NAME

    elif resultArray[0]==BILL_TOKEN_NEW:

        if WATER in resultArray:
            payload = PREFIX +destination + WATER_BILL + SRC_NAME

        elif TRADE in resultArray:
            payload = PREFIX +destination+ TRADE_BILL + SRC_NAME

        elif PROPERTY in resultArray:
            payload = PREFIX +destination+ PROPERTY_BILL + SRC_NAME

        response = requests.request("POST", url, headers=headers, data = payload)

        k=payload.index(MESSAGE_TOKEN)
        payload=payload[0:k]+MESSAGE_TOKEN+translator.translate(result,dest=sourceLanguage).text+ SRC_NAME
    
    else:
         
        k=payload.index(MESSAGE_TOKEN)
        payload=payload[0:k]+MESSAGE_TOKEN+translator.translate(result,dest=sourceLanguage).text+ SRC_NAME
    
    if resultArray[0]!= RECEIPT_TOKEN:
        payload=payload.encode(UTF_8)

    response = requests.request("POST", url, headers=headers, data = payload)

    return ""

ChatbotApi.run()
    