const fetch = require('node-fetch');
const fs = require('fs');
const config = require('../../env-variables');
const messages = require('../messages/complaint-messages');
require('url-search-params-polyfill');

class WorkFlowService {

  async getApplicationStatus(user,applicationId) {
    //let appId = 'PB-AC-2021-02-17-011746';
    let tenanatid_suffix = '.amritsar';
    const requestBody = {
      RequestInfo: {
        authToken: user.authToken,
      },
    };

    let url = config.egovServices.egovServicesHost + config.egovServices.egovWorkflowSearchPath;
    url = `${url}?tenantId=${config.rootTenantId}.amritsar`;
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
      let processInstances = responseBody.ProcessInstances;
      for (let processInstance of processInstances) {
        let applicationStatus = processInstance.state.applicationStatus;
        results = applicationStatus;
        break;
      }
    } else {
      console.error('Error in fetching the complaints');
      return [];
    }
    return results;
  }
}

module.exports = new WorkFlowService();
