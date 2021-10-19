import nltk
from fuzzywuzzy import fuzz
from nltk.util import ngrams
from Config import *
import requests
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

WATER = [i["message"] for i in responseData["messages"] if i["code"]=="WATER"][0]
SEWERAGE = [i["message"] for i in responseData["messages"] if i["code"]=="SEWERAGE"][0]
PROPERTY = [i["message"] for i in responseData["messages"] if i["code"]=="PROPERTY"][0]
TRADE_LICENSE = [i["message"] for i in responseData["messages"] if i["code"]=="TRADE_LICENSE"][0]

#ENTITY RECOGNITION USING FUZZY MATCHING
#RETURN THE APPROPRIATE LINKS BASED ON THE GUESSED ENTITY.

def ent_reg(sent):
    sent=sent.lower()
    taxes=TAX_ENTITIES

    bigrams=ngrams(nltk.word_tokenize(sent),2)
    
    entity=''
    maxRatio=0
    for i in bigrams:
        guess=' '.join(list(i))
        if fuzz.ratio(guess,TRADE_LICENSE)>=60:
            entity=TRADE_LICENSE

    
    record= dict()
    for k in taxes:
        record[k]=0
    
    
    for i in sent.split():
        for j in taxes:
            if fuzz.ratio(i,j)>=60 and fuzz.ratio(i,j)>maxRatio:
                maxRatio=fuzz.ratio(i,j)
                entity=j
            
            
    result = list()
    result.append(entity)
    
    if entity==WATER or entity==SEWERAGE:
        result.append(WATER_LINK_PAID)
        result.append(WATER_LINK_UNPAID)
        
    elif entity==PROPERTY:
        result.append(PROPERTY_LINK_PAID)
        result.append(PROPERTY_LINK_UNPAID)
        
    elif entity==TRADE_LICENSE:
        result.append(TRADE_LINK_PAID)
        result.append(TRADE_LINK_UNPAID)
        
    else:
        result.append("no link")
        result.append("no link")
    
    return result