const fetch = require('node-fetch');
const config = require('../../env-variables');

class DummyPGRService {

    // Please mark the method async if the actual app-service method would involve api calls

   async persistComplaint(user, slots, extraInfo) {
      console.log('Saving complaint to service: ');
      return {
        complaintNumber: '03/01/2022/081479',
        complaintLink: 'https://mseva.org/complaint/132'
      }
    }
   
 }
module.exports = new DummyPGRService();