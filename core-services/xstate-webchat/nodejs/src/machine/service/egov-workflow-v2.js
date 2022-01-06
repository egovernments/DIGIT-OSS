const fetch = require('node-fetch');
const config = require('../../env-variables');
const moment = require('moment');
const messages = require('../messages/complaint-messages');
require('url-search-params-polyfill');

class WorkFlowService {

  async getApplicationStatus(user,applicationId) {
    const requestBody = {
      RequestInfo: {
        authToken: user.authToken,
      },
    };

    let url = config.egovServices.egovServicesHost + config.egovServices.egovWorkflowSearchPath;
    url = `${url}?tenantId=${user.userInfo.permanentCity}`;
    url += '&';
    url += `businessIds=${applicationId}`;

    const options = {
      method: 'POST',
      origin: '*',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    };

    const response = await fetch(url, options);
    let results;
    if (response.status === 200) {
          const responseBody = await response.json();
          results = await this.prepareAppTimelineResult(responseBody);
      } 
    return results;
  }

  async prepareAppTimelineResult(responseBody){
    var results = {};
    results['AppStatus'] = [];
    let processInstances = responseBody.ProcessInstances;
      for (let processInstance of processInstances) {
            let applicationDate = moment(processInstance.auditDetails.lastModifiedTime).tz(config.timeZone).format(config.dateFormat);
            var data ={
              status: processInstance.state.applicationStatus,
              date: applicationDate
            }
            results['AppStatus'].push(data);
      }
      return results;
  }
}
module.exports = new WorkFlowService();
