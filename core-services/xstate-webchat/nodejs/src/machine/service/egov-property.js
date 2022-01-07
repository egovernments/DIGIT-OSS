const fetch = require('node-fetch');
const fs = require('fs');
const config = require('../../env-variables');
const messages = require('../messages/complaint-messages');
require('url-search-params-polyfill');
const moment = require("moment-timezone");
const localisationService = require('../util/localisation-service');
const dialog = require('../util/dialog');

class PropertyService {

  async getPropertyData(mobileNumber, user) {
    let requestBody = {
      RequestInfo: {
        authToken: user.authToken
      }
    };

    let billUrl = 'https://qa.digit.org/' + config.egovServices.billServiceSearchPath;
    billUrl = billUrl + '?tenantId=' + config.rootTenantId + '&mobileNumber='+mobileNumber + '&businessService=PT';

    let options = {
      method: 'POST',
      origin: '*',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    }
    
    let response = await fetch(billUrl, options);
    let results;
    if(response.status === 201) {
      let responseBody = await response.json();
      results = await this.prepareBillResult(responseBody, user);
    } 

    return results;
  }

  async prepareBillResult(responseBody, user){
    let locale = user.locale;
    let results=responseBody.Bill;

    var Bills = {};
    Bills['Bills'] = [];
    let localisationServicePrefix = "BILLINGSERVICE_BUSINESSSERVICE_"

    let self = this;
    for(let result of results){
      if(result.status=='ACTIVE' && result.totalAmount!=0){
        let dueDate = moment(result.billDetails[result.billDetails.length-1].expiryDate).tz(config.timeZone).format(config.dateFormat);
        let fromMonth = new Date(result.billDetails[result.billDetails.length-1].fromPeriod).toLocaleString('en-IN', { month: 'short' });
        let toMonth = new Date(result.billDetails[result.billDetails.length-1].toPeriod).toLocaleDateString('en-IN', { month: 'short' });
        let fromBillYear = new Date(result.billDetails[result.billDetails.length-1].fromPeriod).getFullYear();
        let toBillYear = new Date(result.billDetails[result.billDetails.length-1].toPeriod).getFullYear();
        let billPeriod = fromMonth+" "+fromBillYear+"-"+toMonth+" "+toBillYear;
        let tenantId= result.tenantId;
        let serviceCode = localisationService.getMessageBundleForCode(localisationServicePrefix + result.businessService.toUpperCase());

        var data={
          service: dialog.get_message(serviceCode,locale),
          id: result.consumerCode,
          billNumber: result.billNumber,
          payerName: result.payerName,
          dueAmount: result.totalAmount,
          dueDate: dueDate,
          period: billPeriod,
          tenantId: tenantId,
          businessService: result.businessService
        };
        
        Bills['Bills'].push(data);
      } 
    }

    return Bills['Bills'];  
  }
}

module.exports = new PropertyService();
