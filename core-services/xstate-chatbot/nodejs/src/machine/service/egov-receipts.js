const config = require('../../env-variables');
const fetch = require("node-fetch");
const moment = require("moment-timezone");
const localisationService = require('../util/localisation-service');
const dialog = require('../util/dialog');
const pdfService = require('../util/pdf-service');
const paymentStatusConsumer = require('./payment-status-update-event');

let supportedServiceForLocality = "{\"TL\" : \"tl-services\",\"FIRENOC\" : \"fireNoc\",\"WS\" : \"ws-services\",\"SW\" : \"sw-services\",\"PT\" : \"PT\",\"BPA\" : \"bpa-services\"}";

class ReceiptService {

  constructor() {
    this.services = [];
    let supportedModules = config.billsAndReceiptsUseCase.billSupportedModules.split(',');
    for(let module of supportedModules) {
      this.services.push(module.trim());
    }
  }

    getSupportedServicesAndMessageBundle() {
        let services = this.services;
        let messageBundle = {
          WS: {
            en_IN: 'Water and Sewerage',
            hi_IN: 'पानी और सीवरेज'
          },
          PT: {
            en_IN: 'Property Tax',
            hi_IN: 'संपत्ति कर'
          },
          TL: {
            en_IN: 'Trade License Fees',
            hi_IN: 'ट्रेड लाइसेंस शुल्क'
          },
          FIRENOC: {
            en_IN: 'Fire NOC Fees',
            hi_IN: 'फायर एनओसी फीस'
          },
          BPA: {
            en_IN: 'Building Plan Scrutiny Fees',
            hi_IN: 'बिल्डिंग प्लान स्क्रूटनी फीस'
          }
        }
    
        return { services, messageBundle };
    }
    getSearchOptionsAndMessageBundleForService(service) {
        let messageBundle = {
          mobile: {
            en_IN: 'Search 🔎 using Mobile No.📱',
            hi_IN: 'मोबाइल नंबर 📱का उपयोग करके 🔎खोजें'
          },
          connectionNumber: {
            en_IN: 'Search 🔎 using Connection No.',
            hi_IN: 'कनेक्शन नंबर का उपयोग करके 🔎 खोजें'
          },
          consumerNumber: {
            en_IN: 'Search 🔎 using Consumer Number',
            hi_IN: 'उपभोक्ता नंबर का उपयोग करके 🔎 खोजें'
    
          },
          propertyId: {
            en_IN: 'Search 🔎 using Property ID',
            hi_IN: 'संपत्ति आईडी का उपयोग करके 🔎 खोजें'
    
          },
          tlApplicationNumber: {
            en_IN: 'Search 🔎 using Trade License Application Number',
            hi_IN: 'ट्रेड लाइसेंस आवेदन संख्या का उपयोग करके 🔎 खोजें'
          },
          nocApplicationNumber: {
            en_IN: 'Search 🔎 using NOC Application Number',
            hi_IN: 'एनओसी आवेदन संख्या का उपयोग करके 🔎 खोजें'
          },
          bpaApplicationNumber: {
            en_IN: 'Search 🔎 using BPA Application Number',
            hi_IN: 'बिल्डिंग प्लान आवेदन संख्या का उपयोग करके 🔎खोजें'
          }
        }
        let searchOptions = [];
        if(service === 'WS') {
          searchOptions = [ 'connectionNumber'];
        } else if(service === 'PT') {
          searchOptions = [ 'propertyId'];
        } else if(service === 'TL') {
          searchOptions = [ 'tlApplicationNumber' ];
        } else if(service === 'FIRENOC') {
          searchOptions = [ 'nocApplicationNumber' ];
        } else if(service === 'BPA') {
          searchOptions = [ 'bpaApplicationNumber' ];
        }
        
        return { searchOptions, messageBundle };
    }
    getOptionAndExampleMessageBundle(service, searchParamOption) {
      let option,example;

      if(searchParamOption === 'mobile'){
        option = {
          en_IN: 'Mobile Number',
          hi_IN: 'मोबाइल नंबर'
        };
        example = {
          en_IN: 'Do not use +91 or 0 before mobile number.',
          hi_IN: 'मोबाइल नंबर से पहले +91 या 0 का उपयोग न करें।'
        }
      }
  
      if(searchParamOption === 'consumerNumber'){
        option = {
          en_IN: 'Consumer Number',
          hi_IN: 'उपभोक्ता संख्या'
        };
        example = {
          en_IN: ' ',
          hi_IN: ' '
        }
      }
  
      if(searchParamOption === 'connectionNumber'){
        option = {
          en_IN: 'Connection Number',
          hi_IN: 'कनेक्शन नंबर'
        };
        example = {
          en_IN: '(Connection No must be in format\nWS/XXX/XX-XX/XXXXX)',
          hi_IN: '(कनेक्शन नंबर WS/XXX/XX-XX/XXXXX प्रारूप में होना चाहिए)'
        }
      }
  
      if(searchParamOption === 'propertyId'){
        option = {
          en_IN: 'Property ID',
          hi_IN: 'संपत्ति आईडी'
        };
        example = {
          en_IN: '(Property ID must be in format\nPB-PT-XXXX-XX-XX-XXXXX)',
          hi_IN: '(प्रॉपर्टी आईडी प्रारूप में होनी चाहिए\nPB-PT-XXXX-XX-XX-XXXXX)'
        }
      }
  
      if(searchParamOption === 'tlApplicationNumber'){
        option = {
          en_IN: 'Trade License Application Number',
          hi_IN: 'ट्रेड लाइसेंस आवेदन संख्या'
        };
        example = {
         en_IN: ' ',
         hi_IN: ' '
        }
      }
  
      if(searchParamOption === 'nocApplicationNumber'){
        option = {
          en_IN: 'Fire Noc Application Number',
          hi_IN: 'फायर एनओसी एप्लीकेशन नंबर'
        };
        example = {
         en_IN: ' ',
         hi_IN: ' '
        }
      }
  
      if(searchParamOption === 'bpaApplicationNumber'){
        option = {
          en_IN: 'BPA Application Number',
          hi_IN: 'बिल्डिंग प्लान आवेदन संख्या'
        };
        example = {
         en_IN: ' ',
         hi_IN: ' '
        }
      }
  
      
      return { option, example };
    }
    
    validateparamInput(service, searchParamOption, paramInput) {
      var state=config.rootTenantId;
      state=state.toUpperCase();

      if(searchParamOption === 'mobile') {
        let regexp = new RegExp('^[0-9]{10}$');
        return regexp.test(paramInput)
      }

      if(searchParamOption === 'consumerNumber' || searchParamOption === 'propertyId' || searchParamOption === 'connectionNumber'){
        if(service === 'PT'){
          let regexp = new RegExp(state+'-PT-\\d{4}-\\d{2}-\\d{2}-\\d+$');
          return regexp.test(paramInput);
        }
        if(service === 'WS'){
          //todo
          let regexp = new RegExp('^(WS|SW)/\\d{3}/\\d{4}-\\d{2}/\\d+$');
          return regexp.test(paramInput);
        }
      }
    

      if(searchParamOption === 'tlApplicationNumber'){
        let regexp = new RegExp(state+'-TL-\\d{4}-\\d{2}-\\d{2}-\\d+$');
        return regexp.test(paramInput);
      }

      if(searchParamOption === 'nocApplicationNumber'){
        let regexp = new RegExp(state+'-FN-\\d{4}-\\d{2}-\\d{2}-\\d+$');
        return regexp.test(paramInput);
      }

      if(searchParamOption === 'bpaApplicationNumber'){
        let regexp = new RegExp(state+'-BP-\\d{4}-\\d{2}-\\d{2}-\\d+$');
        return regexp.test(paramInput);
      }
      return true;
    }    

    async preparePaymentResult(responseBody,authToken,locale,isMultipleRecords){
      let results=responseBody.Payments;
      let receiptLimit = config.billsAndReceiptsUseCase.receiptSearchLimit;

      if(results.length < receiptLimit)
        receiptLimit = results.length;
      
      var Payments = {};
      Payments['Payments'] = [];
      var count =0;
      var lookup=[];
      let localisationServicePrefix = "BILLINGSERVICE_BUSINESSSERVICE_"

      let self = this;
      for(let result of results) {
        if(count<receiptLimit && (!lookup.includes(result.paymentDetails[0].bill.consumerCode) || isMultipleRecords)){
          var transactionDate = moment(result.transactionDate).tz(config.timeZone).format(config.dateFormat);
          var consumerCode = result.paymentDetails[0].bill.consumerCode;
          var tenantId= result.tenantId;
          var receiptNumber = result.paymentDetails[0].receiptNumber;
          var businessService = result.paymentDetails[0].businessService;
          var mobileNumber = result.mobileNumber;
          let serviceCode = localisationService.getMessageBundleForCode(localisationServicePrefix + businessService);
          
          var data={
            service: dialog.get_message(serviceCode,locale),
            id: consumerCode,
            locality: undefined, //to do
            city: tenantId, //to do
            amount: result.totalAmountPaid,
            date: transactionDate,
            businessService: businessService,
            transactionNumber: result.transactionNumber,
            fileStoreId: result.fileStoreId,
            tenantId: tenantId
          }
          Payments['Payments'].push(data);
          lookup.push(consumerCode);
          count=count+1;
        }
      }

      if(!isMultipleRecords){
        let service = Payments['Payments'][0].businessService;
        var businessServiceList = ['WS','SW'];
        let consumerCodeToLocalityMapping;
      
        if(businessServiceList.includes(service))
          consumerCodeToLocalityMapping = await this.getApplicationNumber(Payments['Payments'], service, authToken, locale);
      
        else
          consumerCodeToLocalityMapping = await this.getLocality(lookup, authToken, service,locale);
  
        var tenantIdList=[];
        var stateLevelCode = "TENANT_TENANTS_"+config.rootTenantId.toUpperCase();
        tenantIdList.push(stateLevelCode);
  
        for(var i=0; i<Payments['Payments'].length;i++){
          if(!(Object.keys(consumerCodeToLocalityMapping).length === 0) && consumerCodeToLocalityMapping[Payments['Payments'][i].id])
            Payments['Payments'][i].locality = consumerCodeToLocalityMapping[Payments['Payments'][i].id];
          
          let tenantId = Payments['Payments'][i].city;
          tenantId = "TENANT_TENANTS_" + tenantId.toUpperCase().replace('.','_');
  
          if(!tenantIdList.includes(tenantId))
            tenantIdList.push(tenantId);
        }
        
        let localisedMessages = await localisationService.getMessagesForCodesAndTenantId(tenantIdList, config.rootTenantId);
  
        for(var i=0; i<Payments['Payments'].length;i++){
          let tenantId = Payments['Payments'][i].city;
          tenantId = "TENANT_TENANTS_" + tenantId.toUpperCase().replace('.','_');
  
          if(!Payments['Payments'][i].locality){
            if(localisedMessages[tenantId][locale])
              Payments['Payments'][i].locality = localisedMessages[tenantId][locale];
            
            if(localisedMessages[stateLevelCode][locale])
              Payments['Payments'][i].city = localisedMessages[stateLevelCode][locale];
  
          }
  
          else{
            if(localisedMessages[tenantId][locale])
              Payments['Payments'][i].city = localisedMessages[tenantId][locale]; 
          }
        }

      }
      
      return Payments['Payments'];
      
    }

    async findreceiptsList(user,service,locale){ 
      let requestBody = {
        RequestInfo: {
          authToken: user.authToken
        }
      };
       var searchEndpoint = config.egovServices.collectonServicSearchEndpoint;
       searchEndpoint= searchEndpoint.replace(/\$module/g,service);
      let paymentUrl = config.egovServices.externalHost + searchEndpoint;
      paymentUrl =  paymentUrl + '?tenantId=' + config.rootTenantId;
      
      if(user.hasOwnProperty('paramOption') && (user.paramOption!=null) ){
        
        if(user.paramOption=='mobile')
        paymentUrl +='&mobileNumber='+user.paramInput;

        if(user.paramOption=='consumerNumber' || user.paramOption == 'tlApplicationNumber' || user.paramOption == 'nocApplicationNumber'
          || user.paramOption=='bpaApplicationNumber' || user.paramOption=='connectionNumber' || user.paramOption=='propertyId')
              paymentUrl +='&consumerCodes='+user.paramInput;
      }
      else{
        paymentUrl+='&';
        paymentUrl +='mobileNumber='+user.mobileNumber;
      }

      let options = {
        method: 'POST',
        origin: '*',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      }

      let response = await fetch(paymentUrl,options);
      let results;
      if(response.status === 200) {
        let responseBody = await response.json();
        if(responseBody.Payments.length>0)
          results=await this.preparePaymentResult(responseBody,user.authToken,locale,false);
      } else {
        console.error('Error in fetching the payment data');
        return [];
      }
      
      return results;
    }

    async findreceipts(user,service){

      if(service === 'WS'){
        let businessService = ['WS','SW'];
        return await this.findReceiptsForMutipleBusinsessService(user,businessService,user.locale);
      }
      if(service === 'BPA'){
        let businessService = ['BPA.LOW_RISK_PERMIT_FEE', 'BPA.NC_APP_FEE', 'BPA.NC_SAN_FEE', 'BPA.NC_OC_APP_FEE', 'BPA.NC_OC_SAN_FEE'];
        return await this.findReceiptsForMutipleBusinsessService(user,businessService,user.locale);
      }

      else
          return await this.findreceiptsList(user,service,user.locale);


    }

    async findReceiptsForMutipleBusinsessService(user,businessService,locale){
      let receiptResults=[];
      for(let service of businessService){
        let results = await this.findreceiptsList(user,service,locale);
        if(results && results.length>0)
          receiptResults = receiptResults.concat(results);
      }
      return receiptResults;
    }

    async fetchReceiptsForParam(user, service, searchParamOption, paraminput) {
        if(searchParamOption)
          user.paramOption=searchParamOption;
        if(paraminput)  
          user.paramInput=paraminput;
        if(service === 'WS' || service === 'BPA'){
          return await this.findreceipts(user,service)
        }
        else
          return await this.findreceiptsList(user,service,user.locale);
    }

    async multipleRecordReceipt(user,service,consumerCodes,transactionNumber, tenantId, forPdf){ 
      
      let requestBody = {
        RequestInfo: {
          authToken: user.authToken
        }
      };

      var searchEndpoint = config.egovServices.collectonServicSearchEndpoint;
      searchEndpoint= searchEndpoint.replace(/\$module/g,service);
      let paymentUrl = config.egovServices.egovServicesHost + searchEndpoint;
      paymentUrl =  paymentUrl + '?tenantId=' + config.rootTenantId;
      paymentUrl+='&';
      if(forPdf){
        paymentUrl +='transactionNumber='+transactionNumber;
        paymentUrl+='&mobileNumber='+user.mobileNumber;
      }
        
      else{
        paymentUrl +='consumerCodes='+consumerCodes;
        let isOwner = false;
        if(service === 'PT'){
          let result = await paymentStatusConsumer.getPTOwnerDetails(consumerCodes, tenantId, user.mobileNumber, user.authToken);
          isOwner = result.isMobileNumberPresent;
        }

        if(service === 'WS' || service === 'SW'){
          let result = await paymentStatusConsumer.getWnsOwnerDeatils(consumerCodes, tenantId, service, user.mobileNumber, user.authToken);
          isOwner = result.isMobileNumberPresent;
        }


        if(!isOwner)
        paymentUrl+='&mobileNumber='+user.mobileNumber;
      }
        


      let options = {
        method: 'POST',
        origin: '*',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      }

      let response = await fetch(paymentUrl,options);
      let results;
      if(response.status === 200) {
        let responseBody = await response.json();
        if(responseBody.Payments.length>0){
          if(forPdf){
            return responseBody.Payments[0];
          }
          results=await this.preparePaymentResult(responseBody, user.authToken, user.locale,true);
        }
      } else {
        console.error('Error in fetching the payment data');
        return undefined;
      }

      return results;
      
    }

    async getShortenedURL(finalPath)
    {
      var url = config.egovServices.egovServicesHost + config.egovServices.urlShortnerEndpoint;
      var request = {};
      request.url = finalPath; 
      var options = {
        method: 'POST',
        body: JSON.stringify(request),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      let response = await fetch(url, options);
      let data = await response.text();
      return data;
    }

    async receiptDownloadLink(consumerCode,tenantId,receiptNumber,businessService,mobileNumber,locale)
    {
      var UIHost = config.egovServices.externalHost;
      var paymentPath = config.egovServices.receiptdownladlink;
      paymentPath = paymentPath.replace(/\$consumercode/g,consumerCode);
      paymentPath = paymentPath.replace(/\$tenantId/g,tenantId);
      paymentPath = paymentPath.replace(/\$receiptnumber/g,receiptNumber)
      paymentPath = paymentPath.replace(/\$businessservice/g,businessService);
      paymentPath = paymentPath.replace(/\$mobilenumber/g,mobileNumber);
      paymentPath = paymentPath.replace(/\$whatsAppBussinessNumber/g,config.whatsAppBusinessNumber);
      paymentPath = paymentPath.replace(/\$locale/g,locale)
      var finalPath = UIHost + paymentPath;
      var link = await this.getShortenedURL(finalPath);
      return link;
    }

    async getLocality(consumerCodes, authToken, businessService, locale){

      let supportedService = JSON.parse(supportedServiceForLocality);
      businessService = supportedService[businessService];
  
      if(!businessService)
        businessService = supportedService["BPA"];
      
  
      let requestBody = {
        RequestInfo: {
          authToken: authToken
        },
        searchCriteria: {
          referenceNumber: consumerCodes,
          limit: 5000,
          offset: 0
        }
      };
  
      let locationUrl = config.egovServices.searcherHost + 'egov-searcher/locality/'+businessService+'/_get';
  
      let options = {
        method: 'POST',
        origin: '*',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      }
  
      let response = await fetch(locationUrl,options);
      let localitySearchResults;
  
      if(response.status === 200) {
        localitySearchResults = await response.json();
      } else {
        console.error('Error in fetching the Locality data');
        return undefined;
      }
  
      let localities = [];
      for(let result of localitySearchResults.Localities){
        if(!localities.includes(result.locality))
          localities.push(result.locality);
      }
  
      let localitiesLocalisationCodes = [];
      for(let locality of localities) {
        let localisationCode = 'admin.locality.' + locality;
        localitiesLocalisationCodes.push(localisationCode);
      }
  
      let localisedMessages = await localisationService.getMessagesForCodesAndTenantId(localitiesLocalisationCodes, config.rootTenantId);
  
      let messageBundle = {};
      for(let result of localitySearchResults.Localities) {
        let localisationCode = 'admin.locality.' + result.locality;
        messageBundle[result.referencenumber] = localisedMessages[localisationCode][locale];
      }
  
    return messageBundle;
  
    }
  
    async getApplicationNumber(Payments, businessService, authToken, locale){
  
      let requestBody = {
        RequestInfo: {
          authToken: authToken
        }
      };
  
      let options = {
        method: 'POST',
        origin: '*',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      }
  
      
      let applicationNumbersList = [];
      let consumerCodeToApplicationMapping={};
  
      for(let Payment of Payments){
        let url = config.egovServices.externalHost;
        if(businessService === 'WS'){
          url = url + config.egovServices.waterConnectionSearch;
        }
        if(businessService === 'SW'){
          url = url + config.egovServices.sewerageConnectionSearch;;
        }
        
        url = url + '&tenantId='+Payment.city;
        url = url + '&connectionNumber='+Payment.id;
        let response = await fetch(url,options);
        let searchResults;
        
        if(response.status === 200) {
          searchResults = await response.json();
          let applicationNumber;
          if(businessService === 'WS'){
            applicationNumber = searchResults.WaterConnection[0].applicationNo
            applicationNumbersList.push(applicationNumber);
          }
          if(businessService === 'SW'){
            applicationNumber = searchResults.SewerageConnections[0].applicationNo
            applicationNumbersList.push(applicationNumber);
          }
          consumerCodeToApplicationMapping[applicationNumber] = Payment.id;
        }
      }
  
      let cosumerCodeToLocalityMap = await this.getLocality(applicationNumbersList, authToken, businessService,locale);
  
      let messageBundle = {};
      for(var i=0;i<applicationNumbersList.length;i++){
        let applicationNo = applicationNumbersList[i];
        if(!(Object.keys(cosumerCodeToLocalityMap).length === 0) && cosumerCodeToLocalityMap[applicationNo])
          messageBundle[consumerCodeToApplicationMapping[applicationNo]] = cosumerCodeToLocalityMap[applicationNo];
      }
      
      return messageBundle;  
    }

    async getPdfFilestoreId(businessService, payment, user){
      await pdfService.generatePdf(businessService, payment, user.locale, user.authToken, user.userInfo, user.mobileNumber);
    }
  }
module.exports = new ReceiptService();