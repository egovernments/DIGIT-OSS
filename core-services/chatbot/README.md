# Chatbot

Chatbot facilitates conversational integration of a Rest based microservice application. It collects data in multiple
 stages of a conversation and makes a Rest call at the end of the flow.
 
It's conversational flow can be defined using a tree which contains all possible ways a conversation with a user can go. 

Currently, it supports input values of following type:
1. Text : These can be further classified as:
    * Free text : The input answer will be forwarded as is.
    * Fixed Set Values : When the answer could be only one out of the given set of values 
2.  Image : User can send an image to the chatbot which will be stored in egov-filestore.

## Dependencies
1. egov-user : All the users interacting through chatbot will be stored in the egov-user service. Chatbot does not 
store any user information such as mobile number.
2. egov-localization : The chatbot is made such that it will store localization codes and the actual text value will 
be fetched only at the end. This way we can provide multi-lingual support. Localization service is also used to construct messages from templates. This dependency can be eliminated if you 
want to pass values instead of localization codes. 
3. egov-filestore : It is a dependency if you want to send/receive any file. This includes sending PDF/Image files.
