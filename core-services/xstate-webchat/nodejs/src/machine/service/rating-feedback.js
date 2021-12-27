const fetch = require("node-fetch");
const config = require('../../env-variables');
const localisationService = require('../util/localisation-service');
require('url-search-params-polyfill');


class RatingAndFeedback {

  async fetchMdmsData(tenantId, moduleName, masterName, filterPath) {
    var url = 'https://dev.digit.org/' + config.egovServices.mdmsSearchPath;
    var request = {
      "RequestInfo": {},
      "MdmsCriteria": {
        "tenantId": tenantId,
        "moduleDetails": [
          {
            "moduleName": moduleName,
            "masterDetails": [
              {
                "name": masterName,
                "filter": filterPath
              }
            ]
          }
        ]
      }
    };
  
    var options = {
      method: 'POST',
      body: JSON.stringify(request),
      headers: {
          'Content-Type': 'application/json'
      }
    }
  
    let response = await fetch(url, options);
    let data = await response.json()
  
    return data["MdmsRes"][moduleName][masterName];
  }

  async fetchFeedbackOptions(tenantId, groupName){
    let filter = "$.[?(@.order && @.active == true && @.groupName == '"+groupName+"')].code"
    let feedbackOptions = await this.fetchMdmsData(tenantId, "XstateWebChatbot","RatingAndFeedback", filter);
    var messageBundle = {};
    for(let data of feedbackOptions){
      let message = localisationService.getMessageBundleForCode(data);
      messageBundle[data] = message;
    }
    return { feedbackOptions,messageBundle };
  }
  
 
  
}

module.exports = new RatingAndFeedback();
