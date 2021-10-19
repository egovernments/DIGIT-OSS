from flask import Flask, jsonify, request
import requests
from CityExtract import *
from flask_ngrok import run_with_ngrok
import json
import speech_recognition as sr
from pydub import AudioSegment
from Config import *
import json

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
DESTINATION = [i["message"] for i in responseData["messages"] if i["code"]=="DESTINATION"][0]
PREFIX = [i["message"] for i in responseData["messages"] if i["code"]=="PREFIX"][0]
CATEGORY = [i["message"] for i in responseData["messages"] if i["code"]=="CATEGORY"][0]
SRC_NAME_LOCALITY = [i["message"] for i in responseData["messages"] if i["code"]=="SRC_NAME_LOCALITY"][0]
MESSAGE_TOKEN = [i["message"] for i in responseData["messages"] if i["code"]=="MESSAGE_TOKEN"][0]
INVALID_SELECTION = [i["message"] for i in responseData["messages"] if i["code"]=="INVALID_SELECTION"][0]
LOCALITY_DETECTED = [i["message"] for i in responseData["messages"] if i["code"]=="LOCALITY_DETECTED"][0]
ASK_LOCALITY_NAME = [i["message"] for i in responseData["messages"] if i["code"]=="ASK_LOCALITY_NAME"][0]
CITY_LIST = [i["message"] for i in responseData["messages"] if i["code"]=="CITY_LIST"][0]
LOCALITY_LIST = [i["message"] for i in responseData["messages"] if i["code"]=="LOCALITY_LIST"][0]
UTF_8 = [i["message"] for i in responseData["messages"] if i["code"]=="UTF_8"][0]
AUDIO_ERROR = [i["message"] for i in responseData["messages"] if i["code"]=="AUDIOFILE_SIZE_ERROR"][0]
FORMAT_ERROR = [i["message"] for i in responseData["messages"] if i["code"]=="FORMAT_ERROR"][0]
AUDIO_FILESIZE_LIMIT = int([i["message"] for i in responseData["messages"] if i["code"]=="AUDIO_FILESIZE_LIMIT"][0])

CityAudio=Flask(__name__)
run_with_ngrok(CityAudio)

cacheCities={}
cacheFinal={}
cacheLocalities={}
source={}

welcomeMessage= WELCOME_MESSAGE

@CityAudio.route('/',methods=['POST'])
def reply():
    destination= DESTINATION
    payload= PREFIX + DESTINATION + CATEGORY + SRC_NAME_LOCALITY
    url_2 = GUPSHUP_URL
    headers = {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/x-www-form-urlencoded',
      'apikey': '443fbc250a744864c880cc6d373692cb',
      'cache-control': 'no-cache'
                      }
    
    requestData=request.get_json()
    inp=""
    
    #IF INPUT MESSAGE IS AN AUDIO
    
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
            payload=payload[0:k]+MESSAGE_TOKEN+translator.translate(AUDIO_ERROR,dest='en').text+ SRC_NAME_LOCALITY
            response = requests.request("POST", url_2, headers=headers, data = payload)
            return ""

        AUDIO_FILE = "voice_message.wav"
        r = sr.Recognizer()
        with sr.AudioFile(AUDIO_FILE) as source:
            audio = r.record(source)
            inp=r.recognize_google(audio)
            
    #VALIDATE THAT THE INPUT MESSAGE IS IN TEXT FORMAT (IF NOT AUDIO)
    elif requestData["payload"]["type"]!="text" :
        k=payload.index(MESSAGE_TOKEN)
        payload=payload[0:k]+MESSAGE_TOKEN+translator.translate(FORMAT_ERROR,dest='en').text+ SRC_NAME_LOCALITY
        response = requests.request("POST", url_2, headers=headers, data = payload)
        return ""
        
    else:
        inp=requestData["payload"]["payload"]["text"]

    inp=inp.lower()
    
    #IF INPUT IS A GREETING MESSAGE
   
    if(inp in GREETINGS):
        cacheCities.clear()
        cacheFinal.clear()
        cacheLocalities.clear()
        k=payload.index(MESSAGE_TOKEN)
        payload=payload[0:k]+MESSAGE_TOKEN+welcomeMessage+ SRC_NAME_LOCALITY
        
    #IF INPUT IS A NUMBER FROM 1 TO 9    
        
    elif (inp>="1" and inp<="9" and int(inp)>=1 and int(inp)<=9):
        
        if (int(inp)>len(cacheCities) or int(inp)<1):
            k=payload.index(MESSAGE_TOKEN)
            payload=payload[0:k] + INVALID_SELECTION + SRC_NAME_LOCALITY

        else:
               #INTERPRET THE INPUT NUMBER AS A LOCALITY NUMBER.       
            if (len(cacheLocalities)!=0):
                                
                locality=cacheLocalities[int(inp)]
                
                k=payload.index(MESSAGE_TOKEN)
                payload=payload[0:k] + LOCALITY_DETECTED +locality.upper()+ SRC_NAME_LOCALITY
                cacheCities.clear()
                cacheFinal.clear()
                cacheLocalities.clear()
                
               #ELSE INTERPRET THE NUMBER AS A CITY NUMBER.
                                
            else:
                city= cacheCities[int(inp)]
                k=payload.index(MESSAGE_TOKEN)
                payload=payload[0:k]+MESSAGE_TOKEN+"*"+(city[0].upper()+city[1:].lower())+"* \n"+ ASK_LOCALITY_NAME+ SRC_NAME_LOCALITY
                cacheFinal["city"]=city
                
    else:
    
        #IF INPUT IS NOT A NUMBER, INTERPRET IT AS A CITY IF CACHECITIES IS EMPTY.
        if (len(cacheCities)==0):
            m={"input_city":inp,"input_lang":"hindi"}
            response=requests.post(url=CITY_LOCALHOST, data=json.dumps(m), headers={"Content-Type": "application/json"})
            cities=json.loads(response.text)["city_detected"]
            count=1
            cityList= CITY_LIST
            
            for i in cities:
                cacheCities[count]=i[3:]
                cityList+=(str(count)+'.')
                cityList+=(i[3].upper()+i[4:].lower())+'\n'
                count+=1

            cityList+='\n'
            

            k=payload.index(MESSAGE_TOKEN)
            payload=payload[0:k]+MESSAGE_TOKEN+cityList+ SRC_NAME_LOCALITY
            
        #IF CACHE CITIES IS NOT EMPTY, ASSUME THE INPUT TO BE A LOCALITY NAME.
        else:
            m={"city":cacheFinal["city"],"locality":inp}
            response=requests.post(url=LOCALITY_LOCALHOST, data=json.dumps(m), headers={"Content-Type": "application/json"})
            localities=json.loads(response.text)["predictions"]
            count=1
            localList= LOCALITY_LIST

            for i in localities:
                cacheLocalities[count]=i["name"]
                localList+=(str(count)+'.'+i["code"]+' . '+i["name"]+'\n')
                count+=1

            k=payload.index(MESSAGE_TOKEN)
            payload=payload[0:k]+MESSAGE_TOKEN+localList+ SRC_NAME_LOCALITY
        
    payload=payload.encode(UTF_8)
    response = requests.request("POST", url_2, headers=headers, data = payload)

    return ""

CityAudio.run()
