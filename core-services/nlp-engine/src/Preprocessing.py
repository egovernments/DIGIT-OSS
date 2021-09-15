import nltk
import string
from nltk.corpus import brown
from nltk.corpus import wordnet
from nltk.util import ngrams
from fuzzywuzzy import fuzz
import requests
import json
from Config import *

#EXTRACT THE STOP-WORDS.

r_stop=requests.get(STOPWORD_LINK)
stopwords = json.loads(stopwords.text)
stopwords = stopwords["StopWords"]

rem=stopwords

keep=KEEP_WORDS
from autocorrect import Speller
spell=Speller(lang='en')

keyWords= requests.get(KEYWORD_LINK)
result=json.loads(keyWords.text)


toBePaid= TO_BE_PAID

#EXTRACT SYNONYMS, ANTONYMS.

synonyms=result['KeyWords'][0]['synonyms']

antonyms=result['KeyWords'][0]['antonyms']

quitSynonyms=result['KeyWords'][0]['quits']

pastSynonyms=result['KeyWords'][0]['syn_past']

notPaid=result['KeyWords'][0]['bigrams'][0]['values']
for i in range(len(notPaid)):
    notPaid[i]=result['KeyWords'][0]['bigrams'][0]['prefix']+' '+notPaid[i]

notDue=result['KeyWords'][0]['bigrams'][1]['values']
for i in range(len(notDue)):
    notDue[i]=result['KeyWords'][0]['bigrams'][1]['prefix']+' '+notDue[i]

notToBePaid=result['KeyWords'][0]['bigrams'][2]['values']
for i in range(len(notToBePaid)):
    notToBePaid[i]=result['KeyWords'][0]['bigrams'][2]['prefix']+' '+notToBePaid[i]




keywordList=synonyms+antonyms+pastSynonyms+quitSynonyms+ MISCELLANEOUS
keywordList=list(set(keywordList))

#RECTIFY THE SENTENCE OF ANY GRAMMATICAL/SPELLING ERRORS.

def rectify(sentence):
    sentence=sentence.lower()
    if sentence in GREETINGS:
        return ("hello",0)
    
    sentence=sentence.replace('to see', 'show')
    sentence=sentence.replace('see','show')
    sentence=sentence.replace('to retrieve','show')
    sentence=sentence.replace('to retrieved','show')
    sentence=sentence.replace('to get', 'show')
    sentence=sentence.replace('get','')
    sentence=sentence.replace('take','')
    sentence=sentence.replace('look','')
    
    
    newSentence=""
    for i in sentence:
        if len(newSentence)<2:
            newSentence=newSentence+i
        elif (newSentence[len(newSentence)-1]!=i or newSentence[len(newSentence)-2]!=i):
            newSentence=newSentence+i

    newSentence=newSentence.replace("n't",' not')
    newSentence=newSentence.replace("'d"," would")
    
    

    for i in newSentence.split():
        if i in rem and i not in keep:
            newSentence=newSentence.replace(i,'')

    
    newSentence= newSentence.replace('wetar', 'water')
    newSentence=newSentence.replace (' want ', ' ')
    newSentence=newSentence.replace(' wants ', ' ')
    newSentence=newSentence.replace (' wanted ', ' ')
    
    #RECTIFY SPELLING MISTAKES USING FUZZY MATCHING
    
    finalSentence=''
    count=0
    for i in newSentence.split():
        maxRatio=0
        
        newWord=''
        for j in keywordList:
            if fuzz.ratio(i,j)>=70 and fuzz.ratio(i,j)>maxRatio:
                count+=1
                maxRatio=fuzz.ratio(i,j)
                newWord=j
                
        if maxRatio!=0:
            finalSentence+=newWord+' '
        else:
            finalSentence+= spell(i)+' '

    
    flag=0
    if 'show' in finalSentence or 'see' in finalSentence:
        flag=1
    wordList=finalSentence.split();
    answerSentence=' '.join([i for i in wordList if i not in ['see','show']])
    

    if count!=0:
        
        return (answerSentence,flag)
    else:
        return ("invalid",flag)