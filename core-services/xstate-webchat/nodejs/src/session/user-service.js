const fetch = require('node-fetch');
const config = require('../env-variables');
require('url-search-params-polyfill');

class UserService {
  async getUserForMobileNumber(mobileNumber, tenantId) {
    let user = await this.loginUser(mobileNumber, tenantId);
    console.log("reformattedMessage:: ", user.utf8Data);
    //Check added for anonmous users
    if (user != undefined) {
      user.userId = user.userInfo.uuid;
      user.mobileNumber = mobileNumber;
      user.name = user.userInfo.name;
      user.locale = user.userInfo.locale;
    } else {
      //For Anonmous if the profile creation has failed then populate default values in user object
      user = {
        locale: 'en_IN',
        userId: mobileNumber,
        name: mobileNumber,
        mobileNumber: mobileNumber
      };

    }

    return user;
  }

  async loginUser(mobileNumber, tenantId) {
    const data = new URLSearchParams();
    data.append('grant_type', 'password');
    data.append('scope', 'read');
    data.append('password', config.userService.userServiceHardCodedPassword);
    data.append('userType', 'CITIZEN');

    data.append('tenantId', tenantId);
    data.append('username', mobileNumber);

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: config.userService.userLoginAuthorizationHeader,
    };

    const url = config.egovServices.userServiceHost + config.egovServices.userServiceOAuthPath;
    const options = {
      method: 'POST',
      headers,
      body: data,
    };

    const response = await fetch(url, options);
    if (response.status === 200) {
      const body = await response.json();
      return {
        authToken: body.access_token,
        refreshToken: body.refresh_token,
        userInfo: body.UserRequest,
      };
    }
    return undefined;
  }


}
module.exports = new UserService();
