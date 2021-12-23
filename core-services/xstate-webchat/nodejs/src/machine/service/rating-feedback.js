const fetch = require("node-fetch");
const config = require('../../env-variables');
const urlencode = require('urlencode');
const dialog = require('../util/dialog');
const moment = require("moment-timezone");
const fs = require('fs');
const axios = require('axios');
var FormData = require("form-data");
var geturl = require("url");
var path = require("path");
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
      messageBundle[data]={
        en_IN: data,
        hi_IN: data
      }
    }
    return { feedbackOptions,messageBundle };
  }
  
 
  
}

module.exports = new RatingAndFeedback();
