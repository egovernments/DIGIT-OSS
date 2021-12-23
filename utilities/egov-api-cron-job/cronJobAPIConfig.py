import requests
import sys
import json

# The first argument to the script is the job name
argumentList = sys.argv 
job_name = sys.argv[1]


# Calls MDMS service to fetch cron job API endpoints configuration

mdms_url = "http://egov-mdms-service.egov:8080/egov-mdms-service/v1/_search"
mdms_payload = "{\n \"RequestInfo\": {\n   \"apiId\": \"asset-services\",\n   \"ver\": null,\n   \"ts\": null,\n   \"action\": null,\n   \"did\": null,\n   \"key\": null,\n   \"msgId\": \"search with from and to values\",\n   \"authToken\": \"f81648a6-bfa0-4a5e-afc2-57d751f256b7\"\n },\n \"MdmsCriteria\": {\n   \"tenantId\": \"pg\",\n   \"moduleDetails\": [\n     {\n       \"moduleName\": \"common-masters\",\n       \"masterDetails\": [\n         {\n           \"name\": \"CronJobAPIConfig\"\n         }\n       ]\n     }\n   ]\n }\n}"
mdms_headers = {
  'Content-Type': 'application/json'
}
response = requests.request("POST", mdms_url, headers=mdms_headers, data = mdms_payload)

# Convert the response to json
mdms_data = response.json()


# Call user search to fetch SYSTEM user
user_url = "http://egov-user.egov:8080/user/v1/_search?tenantId=pg"
user_payload = "{\n\t\"requestInfo\" :{\n   \"apiId\": \"ap.public\",\n    \"ver\": \"1\",\n    \"ts\": 45646456,\n    \"action\": \"POST\",\n    \"did\": null,\n    \"key\": null,\n    \"msgId\": \"8c11c5ca-03bd-11e7-93ae-92361f002671\",\n    \"userInfo\": {\n    \t\"id\" : 32\n    },\n    \"authToken\": \"5eb3655f-31b1-4cd5-b8c2-4f9c033510d4\"\n\t},\n\t\n   \"tenantId\" : \"pg\",\n   \"userType\":\"SYSTEM\",\n   \"userName\" : \"CRONJOB\",\n   \"pageSize\": \"1\",\n   \"roleCodes\" : [\"SYSTEM\"]\n\n\n}\n   \n   \n   \n   \n   \n   \n   \n   \n   \n   \n   \n   \n   \n   \n   \n   \n   \n   \n   \n   \n   \n   \n   \n   \n   \n   \n   \n   \n   \n   \n   \n   \n   \n   \n   \n   \n   \n   \n   \n   \n   \n   \n}\n"
user_headers = {
  'Content-Type': 'application/json'
}
user_response = requests.request("POST", user_url, headers=user_headers, data = user_payload)
users = user_response.json()['user']
if len(users)==0:
    raise Exception("System user not found")
else:
    userInfo = users[0]



RequestInfo = json.loads("{\n    \"apiId\": \"Rainmaker\",\n    \"ver\": \".01\",\n    \"action\": \"\",\n    \"did\": \"1\",\n    \"key\": \"\",\n    \"msgId\": \"20170310130900|en_IN\",\n    \"requesterId\": \"\",\n    \"userInfo\": \"\"\n  }")
RequestInfo["userInfo"] = userInfo


# Looping through each entry in the config, it checks if the active flag is true and jobName 
# matches the job name given as argument if both criteria fulfilled the given http request is called

for data in mdms_data["MdmsRes"]["common-masters"]["CronJobAPIConfig"]:
    
    params = None
    payload = None
    headers = None

    if data["active"].lower()=="true" and data["jobName"]==job_name:
        method = data["method"]
        url = data["url"]
        
        if "header" in data.keys():
            headers = data["header"]
            
        if 'payload' in data.keys():    
            payload = data["payload"]
            if "RequestInfo" in payload:
                if payload["RequestInfo"]=="{DEFAULT_REQUESTINFO}":
                    payload["RequestInfo"] = RequestInfo    
            
        if 'parmas' in data.keys():
            params = data['params']
            
        res = requests.request(method, url, params = params, headers = headers, data=json.dumps(payload))

