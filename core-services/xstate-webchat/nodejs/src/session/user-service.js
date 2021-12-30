const fetch = require('node-fetch');
const config = require('../env-variables');
require('url-search-params-polyfill');

class UserService {
  async getUserForMobileNumber(mobileNumber, tenantId) {
    const user = await this.loginOrCreateUser(mobileNumber, tenantId);
    user.userId = user.userInfo.uuid;
    user.mobileNumber = mobileNumber;
    user.name = user.userInfo.name;
    user.locale = user.userInfo.locale;
    return user;
  }

  async loginOrCreateUser(mobileNumber, tenantId) {
    let user = await this.loginUser(mobileNumber, tenantId);
    if (user === undefined) {
      await this.createUser(mobileNumber, tenantId);
      user = await this.loginUser(mobileNumber, tenantId);
    }

    user = await this.enrichuserDetails(user);
    return user;
  }

  async enrichuserDetails(user) {
    const url = `${config.egovServices.userServiceHost + config.egovServices.userServiceCitizenDetailsPath}?access_token=${user.authToken}`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(url, options);
    if (response.status === 200) {
      const body = await response.json();
      user.userInfo.name = body.name;
      user.userInfo.locale = body.locale;
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

  async createUser(mobileNumber, tenantId) {
    const requestBody = {
      RequestInfo: {},
      User: {
        otpReference: config.userService.userServiceHardCodedPassword,
        permamnentCity: tenantId,
        tenantId,
        username: mobileNumber,
      },
    };

    const url = config.egovServices.userServiceHost + config.egovServices.userServiceCreateCitizenPath;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    };

    const response = await fetch(url, options);
    if (response.status === 200) {
      const responseBody = await response.json();
      return responseBody;
    }
    const responseBody = await response.json();
    console.error(JSON.stringify(responseBody));
    console.error('User Create Error');
    return undefined;
  }
}

module.exports = new UserService();
