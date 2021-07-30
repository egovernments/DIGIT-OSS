const config = require('../env-variables');
const fetch = require('node-fetch');
require('url-search-params-polyfill');

class UserService {

  async getUserForMobileNumber(mobileNumber, tenantId) {
    let user = await this.loginOrCreateUser(mobileNumber, tenantId);
    user.userId = user.userInfo.uuid;
    user.mobileNumber = mobileNumber;
    user.name = user.userInfo.name;
    user.locale = user.userInfo.locale;
    return user;
  }

  async loginOrCreateUser(mobileNumber, tenantId) {
    let user = await this.loginUser(mobileNumber, tenantId);
    if(user === undefined) {
      await this.createUser(mobileNumber, tenantId);
      user = await this.loginUser(mobileNumber, tenantId);
    }

    user = await this.enrichuserDetails(user);
    return user;
  }

  async enrichuserDetails(user) {
    let url = config.egovServices.userServiceHost + config.egovServices.userServiceCitizenDetailsPath + '?access_token=' + user.authToken ;
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    let response = await fetch(url, options);
    if(response.status === 200) {
      let body = await response.json();
      user.userInfo.name = body.name;
      user.userInfo.locale = body.locale;
    } 
    return user;
  }

  async loginUser(mobileNumber, tenantId) {
    let data = new URLSearchParams();
    data.append('grant_type', 'password');
    data.append('scope', 'read');
    data.append('password', config.userService.userServiceHardCodedPassword);
    data.append('userType', 'CITIZEN');

    data.append('tenantId', tenantId);
    data.append('username', mobileNumber);
    
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': config.userService.userLoginAuthorizationHeader
    }

    let url = config.egovServices.userServiceHost + config.egovServices.userServiceOAuthPath;
    let options = {
      method: 'POST',
      headers: headers,
      body: data
    }

    let response = await fetch(url, options);
    if(response.status === 200) {
      let body = await response.json();
      return {
        authToken: body.access_token,
        refreshToken: body.refresh_token,
        userInfo: body.UserRequest
      }
    } else {
      return undefined;
    }
  }

  async createUser(mobileNumber, tenantId) {
    let requestBody = {
      RequestInfo: {},
      User: {
        otpReference: config.userService.userServiceHardCodedPassword,
        permamnentCity: tenantId,
        tenantId: tenantId,
        username: mobileNumber
      }
    }

    let url = config.egovServices.userServiceHost + config.egovServices.userServiceCreateCitizenPath;
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    }

    let response = await fetch(url, options);
    if(response.status === 200) {
      let responseBody = await response.json();
      return responseBody;
    } else {
      let responseBody = await response.json();
      console.error(JSON.stringify(responseBody));
      console.error('User Create Error');
      return undefined;
    }

  }

}

module.exports = new UserService();