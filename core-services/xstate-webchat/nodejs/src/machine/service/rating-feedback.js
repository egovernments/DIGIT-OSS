const fetch = require('node-fetch');
const config = require('../../env-variables');
const localisationService = require('../util/localisation-service');
require('url-search-params-polyfill');

class RatingAndFeedback {
  async fetchMdmsData(tenantId, moduleName, masterName, filterPath) {
    const url = config.egovServices.egovServicesHost + config.egovServices.mdmsSearchPath;
    const request = {
      RequestInfo: {},
      MdmsCriteria: {
        tenantId,
        moduleDetails: [
          {
            moduleName,
            masterDetails: [
              {
                name: masterName,
                filter: filterPath,
              },
            ],
          },
        ],
      },
    };

    const options = {
      method: 'POST',
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();

    return data.MdmsRes[moduleName][masterName];
  }

  async fetchFeedbackOptions(tenantId, groupName) {
    const filter = `$.[?(@.order && @.active == true && @.groupName == '${groupName}')].code`;
    const feedbackOptions = await this.fetchMdmsData(tenantId, 'XstateWebChatbot', 'RatingAndFeedback', filter);
    const messageBundle = {};
    for (const data of feedbackOptions) {
      const message = localisationService.getMessageBundleForCode(data);
      messageBundle[data] = message;
    }
    return { feedbackOptions, messageBundle };
  }
}

module.exports = new RatingAndFeedback();
