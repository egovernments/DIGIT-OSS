import nltk
from googletrans import Translator
import pickle
import string
from nltk.corpus import brown
from nltk.corpus import wordnet
from nltk.util import ngrams
from fuzzywuzzy import fuzz
import requests
import json
from Config import *

from Preprocessing import rectify
from EntityRecognition import ent_reg

punctuations=string.punctuation
translator= Translator()

keyWords= requests.get(KEYWORD_LINK)
result=json.loads(keyWords.text)

#LISTS OF SYNONYMS, ANTONYMS USED FOR TRAINING THE CLASSIFIER

synonyms=result['KeyWords'][0]['synonyms']

antonyms=result['KeyWords'][0]['antonyms']

quitSynonyms=result['KeyWords'][0]['quits']

pastSynonyms=result['KeyWords'][0]['syn_past']

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

INVALID = [i["message"] for i in responseData["messages"] if i["code"]=="INVALID"][0]
SORRY = [i["message"] for i in responseData["messages"] if i["code"]=="SORRY"][0]
WELCOME_BILLS = [i["message"] for i in responseData["messages"] if i["code"]=="WELCOME_BILLS"][0]
RECEIPTS = [i["message"] for i in responseData["messages"] if i["code"]=="RECEIPTS"][0]
EXIT = [i["message"] for i in responseData["messages"] if i["code"]=="EXIT"][0]
CATEGORY_ERROR = [i["message"] for i in responseData["messages"] if i["code"]=="CATEGORY_ERROR"][0]
RECEIPT_TOKEN = [i["message"] for i in responseData["messages"] if i["code"]=="RECEIPT_TOKEN"][0]
YOU_MAY_VISIT = [i["message"] for i in responseData["messages"] if i["code"]=="YOU_MAY_VISIT"][0]
FOR_PAYING_PREFIX = [i["message"] for i in responseData["messages"] if i["code"]=="FOR_PAYING_PREFIX"][0]
BILLS = [i["message"] for i in responseData["messages"] if i["code"]=="BILLS"][0]
BILL_TOKEN = [i["message"] for i in responseData["messages"] if i["code"]=="BILL_TOKEN"][0]

#BIGRAMS

notPaid=result['KeyWords'][0]['bigrams'][0]['values']
for i in range(len(notPaid)):
    notPaid[i]=result['KeyWords'][0]['bigrams'][0]['prefix']+' '+notPaid[i]

notDue=result['KeyWords'][0]['bigrams'][1]['values']
for i in range(len(notDue)):
    notDue[i]=result['KeyWords'][0]['bigrams'][1]['prefix']+' '+notDue[i]

toBePaid= TO_BE_PAID


notToBePaid=result['KeyWords'][0]['bigrams'][2]['values']
for i in range(len(notToBePaid)):
    notToBePaid[i]=result['KeyWords'][0]['bigrams'][2]['prefix']+' '+notToBePaid[i]

#PERFORM TOKENIZATION ON THE SENTENCE AND IDENTIFY APPROPRIATE PARTS OF SPEECH FOR FEATURE EXTRACTION.

def features(sentence):
        
    paid=0
    unpaid=0
   
    for word in sentence:
        if word in synonyms:
            paid+=1
        if word in antonyms:
            unpaid+=1
            
    text=nltk.word_tokenize(sentence)
    result=nltk.pos_tag(text)
    tokenList=list()
    for j in result:
        tokenList.append(j[1])
    result={}
    result['count_vbd']=tokenList.count("VBD")
    result['count_vbn']=tokenList.count("VBN")
    result['count_vbg']=tokenList.count("VBG")
    result['count_vbp']=tokenList.count("VBP")
    result['count_vbz']=tokenList.count("VBZ")
    result['count_md']=tokenList.count("MD")
    result['paid']=paid
    result['unpaid']=unpaid
    
    
    return result

classifier_f = open("dectree.pickle", "rb")
classifier = pickle.load(classifier_f)
classifier_f.close()

#APPLY FEATURE EXTRACTION, USING N-GRAMS, FEATURES AND PREDICT THE INTENT OF THE SENTENCE.
#RETURN APPROPRIATE MESSAGES BASED ON THAT.
def process(sentence):
    sentence=sentence.replace("n't",' not')
    sentence=sentence.replace("'d"," would")
    newSentence=""
    for i in sentence:
        if i not in punctuations:
            newSentence=newSentence+i
    newSentence=newSentence.lower()
    sentence=newSentence
    (sentence,flag)=rectify(sentence)
    
    #IRRELEVANT SENTENCES
    
    if sentence==INVALID:
        return SORRY
        
    #IF SENTENCE IS A GREETING

    if sentence in GREETINGS:
        return WELCOME_BILLS
        
    #FIND IF THE SENTENCE IS SYNONYMOUS TO EXIT.
    
    b=translator.translate(sentence,dest='en').text
    for i in b.split():
        for j in quitSynonyms:
            if fuzz.ratio(i,j)>=75:
                return EXIT
                
    #GENERATE BIGRAMS, TRIGRAMS AND QUADRA-GRAMS. 

    bigrams=ngrams(nltk.word_tokenize(sentence),2)
    trigrams=ngrams(nltk.word_tokenize(sentence),3)
    quadraGrams=ngrams(nltk.word_tokenize(sentence),4)
    countQuadra=0
    countTrigrams=0
    countBigrams=0
    countNotDue=0

    #COUNT THE RELEVANT N-GRAMS
    
    for i in quadraGrams:
        if ' '.join(list(i)) in notToBePaid:
            countQuadra +=1
    for i in trigrams:
        if ' '.join(list(i)) in toBePaid:
            countTrigrams +=1
    for i in bigrams:
        if ' '.join(list(i)) in notPaid:
            countBigrams +=1
        elif ' '.join(list(i)) in notDue:
            countNotDue+=1
            
    #IF N-GRAMS EXIST IN THE SENTENCE.

    if countQuadra + countBigrams + countTrigrams+countNotDue >=1:
        if countQuadra>0:
            if(ent_reg(sentence)[0]==''):
                
                return CATEGORY_ERROR
                                
            return RECEIPT_TOKEN+' '+ent_reg(sentence)[0]+ RECEIPTS+ ent_reg(sentence)[1]
            
        elif countTrigrams>0:
            if(ent_reg(sentence)[0]==''):
                
                return CATEGORY_ERROR
                
            if flag==1:
                return YOU_MAY_VISIT+ent_reg(sentence)[2]+FOR_PAYING_PREFIX+ent_reg(sentence)[0]+ BILLS
            else:
                return BILL_TOKEN+' '+ent_reg(sentence)[2]+FOR_PAYING_PREFIX+ent_reg(sentence)[0]+ BILLS
            
        else:
            if(ent_reg(sentence)[0]==''):
                
                return CATEGORY_ERROR
                
            
            if countNotDue>0:
                return RECEIPT_TOKEN+' '+ent_reg(sentence)[0]+  RECEIPTS+ ent_reg(sentence)[1]
                
            else:
                if flag==1:
                    return YOU_MAY_VISIT+ent_reg(sentence)[2]+FOR_PAYING_PREFIX+ent_reg(sentence)[0]+ BILLS
                else:
                    return BILL_TOKEN+' '+ent_reg(sentence)[2]+FOR_PAYING_PREFIX+ent_reg(sentence)[0]+ BILLS

    else:
    
        #IF N-GRAMS DON'T EXIST IN THE SENTENCE, USE THE PARTS OF SPEECH AS FEATURES.
                
        countPast=0
        for word in sentence.split():
            if word in pastSynonyms:
                countPast=countPast+1
        if countPast>0:
            if(ent_reg(sentence)[0]==''):
                
                return CATEGORY_ERROR
                            
            return RECEIPT_TOKEN+' '+ent_reg(sentence)[0]+  RECEIPTS+ ent_reg(sentence)[1]
            
        else:
            answer=classifier.classify(features(sentence))
            if(ent_reg(sentence)[0]==''):
                
                return CATEGORY_ERROR
                   
            
            if answer=='paid':
            
                return RECEIPT_TOKEN+' '+ent_reg(sentence)[0]+  RECEIPTS+ ent_reg(sentence)[1]
                
            elif answer=='unpaid':
                if flag==1:
                    return YOU_MAY_VISIT+ent_reg(sentence)[2]+FOR_PAYING_PREFIX+ent_reg(sentence)[0]+ BILLS
                else:
                    return BILL_TOKEN+' '+ent_reg(sentence)[2]+FOR_PAYING_PREFIX+ent_reg(sentence)[0]+ BILLS
  