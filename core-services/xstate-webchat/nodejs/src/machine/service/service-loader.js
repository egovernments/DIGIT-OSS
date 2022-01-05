const config = require('../../env-variables');

if (config.serviceProvider === 'eGov') {
  console.log('Using eGov Services');
  if (config.pgrUseCase.pgrVersion == 'v2') {
    console.log('Using PGR v2');
    module.exports.pgrService = require('./egov-pgr');
  }
  module.exports.ratingAndFeedback = require('./rating-feedback');
  module.exports.workFlowService = require('./egov-workflow-v2');
}
else {
    console.log("Using Dummy Services");
    module.exports.pgrService = require('./dummy-pgr');
    
}

