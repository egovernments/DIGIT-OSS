var axios = require('axios');
// var store = require('configureStore').configure();

var instance = axios.create({
  baseURL: window.location.origin,
  // timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

//document.cookie = "SESSIONID=75dedd21-1145-4745-a8aa-1790a737b7c5; JSESSIONID=Nw2kKeNF6Eu42vtXypb3kP4fER1ghjXNMNISiIF5.ip-10-0-0-100; Authorization=Basic Og==";

var authToken = localStorage.getItem('auth');

//request info from cookies
var requestInfo = {
  apiId: 'org.egov.pt',
  ver: '1.0',
  ts: '01-04-2017 01:01:01',
  action: 'asd',
  did: '4354648646',
  key: 'xyz',
  msgId: '654654',
  requesterId: '61',
  authToken: authToken,
};

var tenantId = localStorage.getItem('tenantId') ? localStorage.getItem('tenantId') : 'default';

module.exports = {
  commonApiPost: (context, queryObject = {}, body = {}, doNotOverride = false) => {
    var url = context;
    if (!doNotOverride) url += '?tenantId=' + tenantId;
    else url += '?';
    for (var variable in queryObject) {
      if (typeof queryObject[variable] != 'undefined') {
        url += '&' + variable + '=' + queryObject[variable];
      }
    }
    body['RequestInfo'] = requestInfo;
    return instance
      .post(url, body)
      .then(function(response) {
        return response.data;
      })
      .catch(function(response) {
        throw new Error(response.data.message);
      });
  },
  commonApiGet: (context, queryObject = {}, doNotOverride = false) => {
    var url = context;
    if (!doNotOverride) url += '?tenantId=' + tenantId;
    else url += '?';
    for (var variable in queryObject) {
      if (typeof queryObject[variable] != 'undefined') {
        url += '&' + variable + '=' + queryObject[variable];
      }
    }
    return instance
      .get(url)
      .then(function(response) {
        return response.data;
      })
      .catch(function(response) {
        throw new Error(response.data.message);
      });
  },
  getAll: arrayOfRequest => {
    return instance.all(arrayOfRequest).then(
      axios.spread(function(acct, perms) {
        // Both requests are now complete
      })
    );
  },
};
