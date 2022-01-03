const fetch = require('node-fetch');
const urlencode = require('urlencode');
const moment = require('moment-timezone');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const geturl = require('url');
const path = require('path');
const dialog = require('../util/dialog');
const localisationService = require('../util/localisation-service');
const config = require('../../env-variables');
require('url-search-params-polyfill');

const pgrCreateRequestBody = '{"RequestInfo":{"authToken":"","userInfo":{}},"service":{"tenantId":"","serviceCode":"","description":"","accountId":"","source":"whatsapp","address":{"landmark":"","city":"","geoLocation":{"latitude": null, "longitude": null},"locality":{"code":""}}},"workflow":{"action":"APPLY","verificationDocuments":[]}}';

class PGRService {
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

  async fetchFrequentComplaints(tenantId) {
    const complaintTypeMdmsData = await this.fetchMdmsData(tenantId, 'RAINMAKER-PGR', 'ServiceDefs', '$.[?(@.order && @.active == true)]');
    const sortedData = complaintTypeMdmsData.slice().sort((a, b) => a.order - b.order);
    const complaintTypes = [];
    for (const data of sortedData) {
      if (!complaintTypes.includes(data.serviceCode)) { complaintTypes.push(data.serviceCode); }
    }
    const localisationPrefix = 'SERVICEDEFS.';
    const messageBundle = {};
    for (const complaintType of complaintTypes) {
      const message = localisationService.getMessageBundleForCode(localisationPrefix + complaintType.toUpperCase());
      messageBundle[complaintType] = message;
    }
    return { complaintTypes, messageBundle };
  }

  async fetchComplaintCategories(tenantId) {
    let complaintCategories = await this.fetchMdmsData(tenantId, 'RAINMAKER-PGR', 'ServiceDefs', '$.[?(@.active == true)].menuPath');
    complaintCategories = [...new Set(complaintCategories)];
    complaintCategories = complaintCategories.filter((complaintCategory) => complaintCategory != ''); // To remove any empty category
    const localisationPrefix = 'SERVICEDEFS.';
    const messageBundle = {};
    for (const complaintCategory of complaintCategories) {
      const message = localisationService.getMessageBundleForCode(localisationPrefix + complaintCategory.toUpperCase());
      messageBundle[complaintCategory] = message;
    }
    complaintCategories = ['Not Receiving OTP', 'Unable to Proceed Forward', 'Bill Amount is incorrect', 'Application Process taking long time', 'Application is getting rejected', 'Others'];
    return { complaintCategories, messageBundle };
  }

  async fetchComplaintItemsForCategory(category, tenantId) {
    const complaintItems = await this.fetchMdmsData(tenantId, 'RAINMAKER-PGR', 'ServiceDefs', `$.[?(@.active == true && @.menuPath == "${category}")].serviceCode`);
    const localisationPrefix = 'SERVICEDEFS.';
    const messageBundle = {};
    for (const complaintItem of complaintItems) {
      const message = localisationService.getMessageBundleForCode(localisationPrefix + complaintItem.toUpperCase());
      messageBundle[complaintItem] = message;
    }
    return { complaintItems, messageBundle };
  }

  async fetchCities(tenantId) {
    const cities = await this.fetchMdmsData(tenantId, 'tenant', 'citymodule', "$.[?(@.module=='PGR.WHATSAPP')].tenants.*.code");
    const messageBundle = {};
    for (const city of cities) {
      const message = localisationService.getMessageBundleForCode(city);
      messageBundle[city] = message;
    }
    return { cities, messageBundle };
  }

  async preparePGRResult(responseBody, locale) {
    const serviceWrappers = responseBody.ServiceWrappers;
    const results = {};
    results.ServiceWrappers = [];
    const localisationPrefix = 'SERVICEDEFS.';

    let complaintLimit = config.pgrUseCase.complaintSearchLimit;

    if (serviceWrappers.length < complaintLimit) { complaintLimit = serviceWrappers.length; }
    let count = 0;

    for (const serviceWrapper of serviceWrappers) {
      if (count < complaintLimit) {
        const { mobileNumber } = serviceWrapper.service.citizen;
        const { serviceRequestId } = serviceWrapper.service;
        const complaintURL = await this.makeCitizenURLForComplaint(serviceRequestId, mobileNumber);
        const serviceCode = localisationService.getMessageBundleForCode(localisationPrefix + serviceWrapper.service.serviceCode.toUpperCase());
        let filedDate = serviceWrapper.service.auditDetails.createdTime;
        filedDate = moment(filedDate).tz(config.timeZone).format(config.dateFormat);
        const applicationStatus = localisationService.getMessageBundleForCode(serviceWrapper.service.applicationStatus);
        const data = {
          complaintType: dialog.get_message(serviceCode, locale),
          complaintNumber: serviceRequestId,
          filedDate,
          complaintStatus: dialog.get_message(applicationStatus, locale),
          complaintLink: complaintURL,
        };
        count++;
        results.ServiceWrappers.push(data);
      } else { break; }
    }
    return results.ServiceWrappers;
  }

   //The integration with the backend service for persisting the complaint will be taken up in future sprints. For now only hardoced complaint id will be returned
  async persistComplaint(user, slots, extraInfo) {
      return {
      complaintNumber: '03/01/2022/081479',
      complaintLink: 'https://mseva.org/complaint/132'
    }
  }

  async fetchOpenComplaints(user) {
    const requestBody = {
      RequestInfo: {
        authToken: user.authToken,
      },
    };

    let url = config.egovServices.egovServicesHost + config.egovServices.pgrSearchEndpoint;
    url = `${url}?tenantId=${config.rootTenantId}`;
    url += '&';
    url += `mobileNumber=${user.mobileNumber}`;

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
      results = await this.preparePGRResult(responseBody, user.locale);
    } else {
      console.error('Error in fetching the complaints');
      return [];
    }

    return results;
  }

  async getShortenedURL(finalPath) {
    const url = config.egovServices.egovServicesHost + config.egovServices.urlShortnerEndpoint;
    const request = {};
    request.url = finalPath;
    const options = {
      method: 'POST',
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await fetch(url, options);
    const data = await response.text();
    return data;
  }

  async makeCitizenURLForComplaint(serviceRequestId, mobileNumber) {
    const encodedPath = urlencode(serviceRequestId, 'utf8');
    const url = `${config.egovServices.externalHost}citizen/otpLogin?mobileNo=${mobileNumber}&redirectTo=digit-ui/citizen/pgr/complaints/${encodedPath}`;
    const shortURL = await this.getShortenedURL(url);
    return shortURL;
  }

  async downloadImage(url, filename) {
    const writer = fs.createWriteStream(filename);

    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }

  async fileStoreAPICall(fileName, fileData, tenantId) {
    let url = config.egovServices.egovServicesHost + config.egovServices.egovFilestoreServiceUploadEndpoint;
    url = `${url}&tenantId=${tenantId}`;
    const form = new FormData();
    form.append('file', fileData, {
      filename: fileName,
      contentType: 'image/jpg',
    });
    const response = await axios.post(url, form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    const filestore = response.data;
    return filestore.files[0].fileStoreId;
  }

  async getFileForFileStoreId(filestoreId, tenantId) {
    let url = config.egovServices.egovServicesHost + config.egovServices.egovFilestoreServiceDownloadEndpoint;
    url += '?';
    url = `${url}tenantId=${config.rootTenantId}`;
    url += '&';
    url = `${url}fileStoreIds=${filestoreId}`;

    const options = {
      method: 'GET',
      origin: '*',
    };

    let response = await fetch(url, options);
    response = await (response).json();
    const fileURL = response.fileStoreIds[0].url.split(',');
    let fileName = geturl.parse(fileURL[0]);
    fileName = path.basename(fileName.pathname);
    fileName = fileName.substring(13);
    await this.downloadImage(fileURL[0].toString(), fileName);
    let imageInBase64String = fs.readFileSync(fileName, 'base64');
    imageInBase64String = imageInBase64String.replace(/ /g, '+');
    const fileData = Buffer.from(imageInBase64String, 'base64');
    var filestoreId = await this.fileStoreAPICall(fileName, fileData, tenantId);
    fs.unlinkSync(fileName);
    return filestoreId;
  }
}

module.exports = new PGRService();
