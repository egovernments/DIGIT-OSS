const config = require('../../env-variables');
const valueFirst = require('../../channel/value-first');        // TODO: import channel
const fetch = require("node-fetch");
const dialog = require('../util/dialog');
const userService = require('../../session/user-service');
const chatStateRepository = require('../../session/repo');
const localisationService = require('../util/localisation-service');
const telemetry = require('../../session/telemetry');

const consumerGroupOptions = require('../../session/kafka/kafka-consumer-group-options');

const kafka = require('kafka-node');

class PaymentStatusUpdateEventFormatter{

  constructor() {
    let topicList = [];
    topicList.push(config.billsAndReceiptsUseCase.pgUpdateTransaction);
    topicList.push(config.billsAndReceiptsUseCase.paymentUpdateTopic);
    let consumerGroup = new kafka.ConsumerGroup(consumerGroupOptions, topicList);
    let self = this;
    consumerGroup.on('message', function(message) {
        if(message.topic === config.billsAndReceiptsUseCase.paymentUpdateTopic) {
          let paymentRequest = JSON.parse(message.value);

          if(paymentRequest.Payment.additionalDetails && paymentRequest.Payment.additionalDetails.isWhatsapp){

            self.paymentStatusMessage(paymentRequest)
            .then(() => {
                console.log("payment message sent to citizen");        // TODO: Logs to be removed
            })
            .catch(error => {
                console.error('error while sending event message');
                console.error(error.stack || error);
            });

          }

        }

        if(message.topic === config.billsAndReceiptsUseCase.pgUpdateTransaction){
          let transactionRequest = JSON.parse(message.value);
          let status = transactionRequest.Transaction.txnStatus;

          if(status === 'FAILURE' && transactionRequest.Transaction.additionalDetails.isWhatsapp){
              self.prepareTransactionFailedMessage(transactionRequest)
              .then(() => {
                console.log("transaction failed message sent to citizen");        // TODO: Logs to be removed
              })
              .catch(error => {
                console.error('error while sending event message');
                console.error(error.stack || error);
            });
          } 
        }

    });
}

  async paymentStatusMessage(request){
    let payment = request.Payment;
    let locale = config.supportedLocales.split(',');
    locale = locale[0];
    let user = await userService.getUserForMobileNumber(payment.mobileNumber, config.rootTenantId);
    let userId = user.userId;
    let chatState = await chatStateRepository.getActiveStateForUserId(userId);
    if(chatState)
      locale = chatState.context.user.locale;
  
    if(payment.additionalDetails && payment.additionalDetails.isWhatsapp){
      let tenantId = payment.tenantId;
      tenantId = tenantId.split(".")[0]; 

      let businessService = payment.paymentDetails[0].businessService;
      let consumerCode    = payment.paymentDetails[0].bill.consumerCode;
      let isOwner = true;
      let ownerMobileNumberList = [];
      let key;
      if(businessService === 'TL')
        key = 'tradelicense-receipt';

      else if(businessService === 'PT'){
        key = 'property-receipt';
        let result = await this.getPTOwnerDetails(consumerCode, payment.tenantId, payment.mobileNumber, user.authToken);
        isOwner = result.isMobileNumberPresent;
        ownerMobileNumberList = result.ownerMobileNumberList;
      }
      
      else if(businessService === 'WS' || businessService === 'SW'){
        key = 'ws-onetime-receipt';
        let result = await this.getWnsOwnerDeatils(consumerCode, payment.tenantId, businessService, payment.mobileNumber, user.authToken);
        isOwner = result.isMobileNumberPresent;
        ownerMobileNumberList = result.ownerMobileNumberList;
      }

      else
        key = 'consolidatedreceipt';
   

      let pdfUrl = config.egovServices.externalHost + 'pdf-service/v1/_create';
      pdfUrl = pdfUrl + '?key='+key+ '&tenantId=' + tenantId;

      let msgId = request.RequestInfo.msgId.split('|');
      msgId = msgId[0] + '|' + locale; 

      let requestBody = {
        RequestInfo: {
          authToken: request.RequestInfo.authToken,
          msgId: msgId,
          userInfo: user.userInfo
        },
        Payments:[]
      };
      requestBody.Payments.push(payment);

      let options = {
        method: 'POST',
        origin: '*',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      }
      let response = await fetch(pdfUrl, options);
      if(response.status == 201){
        let responseBody = await response.json();
        let user = {
          mobileNumber: payment.mobileNumber
        };
        let extraInfo = {
          whatsAppBusinessNumber: config.whatsAppBusinessNumber.slice(2),
          fileName: consumerCode
        };

        if(isOwner){
          chatState.context.bills.paidBy = 'OWNER'
        }
        else
          chatState.context.bills.paidBy = 'OTHER'

        let active = !chatState.done;
        await chatStateRepository.updateState(user.userId, active, JSON.stringify(chatState), new Date().getTime());


        let waitMessage = [];
        var messageContent = {
          output: dialog.get_message(messageBundle.wait,locale),
          type: "text"
        };
        waitMessage.push(messageContent);
        await valueFirst.sendMessageToUser(user, waitMessage, extraInfo);

        let message = [];
        var pdfContent = {
          output: responseBody.filestoreIds[0],
          type: "pdf"
        };
        message.push(pdfContent);
        await valueFirst.sendMessageToUser(user, message, extraInfo);

        let payBillmessage = [];
        let templateContent = await this.prepareSucessMessage(payment, locale, isOwner);
        payBillmessage.push(templateContent);
        await new Promise(resolve => setTimeout(resolve, 3000));
        await valueFirst.sendMessageToUser(user, payBillmessage, extraInfo);

        if(!isOwner){
          /*let question = dialog.get_message(messageBundle.registration,locale);
          question = question.replace('{{consumerCode}}',consumerCode);
          let localisationCode = "BILLINGSERVICE_BUSINESSSERVICE_"+businessService;
          let localisationMessages = await localisationService.getMessageBundleForCode(localisationCode);
          let service = dialog.get_message(localisationMessages,locale)
          question = question.replace('{{service}}', service.toLowerCase());*/

          let question = dialog.get_message(messageBundle.endStatement,locale);
          var registrationMessage = {
            output: question,
            type: "text"
          };

          await new Promise(resolve => setTimeout(resolve, 3000));
          await valueFirst.sendMessageToUser(user, [registrationMessage], extraInfo);
        }
        telemetry.log(userId, 'payment', {message : {type: "whatsapp payment", status: "success", businessService: businessService, consumerCode: consumerCode,transactionNumber: payment.transactionNumber, locale: user.locale}});

        await this.sendMessageToOtherOwner(ownerMobileNumberList, payment.mobileNumber, payment.payerName, businessService, consumerCode, payment.transactionNumber, user.locale, responseBody.filestoreIds[0]);
      }
    }

  }

  async prepareSucessMessage(payment, locale, isOwner){
    let templateList;
    let params=[];
    if(isOwner){
      templateList =  config.valueFirstWhatsAppProvider.valuefirstNotificationOwnerBillSuccessTemplateid.split(',');
      params.push(payment.transactionNumber);
    }
    else{
      if(payment.paymentDetails[0].businessService === 'PT')
        templateList =  config.valueFirstWhatsAppProvider.valuefirstNotificationOtherPTBillSuccessTemplateid.split(',');

      if(payment.paymentDetails[0].businessService === 'WS' || payment.paymentDetails[0].businessService === 'SW')
        templateList =  config.valueFirstWhatsAppProvider.valuefirstNotificationOtherWSBillSuccessTemplateid.split(',');
      
        params.push(payment.paymentDetails[0].bill.consumerCode);
        params.push(payment.transactionNumber);
    }
    let localeList   =  config.supportedLocales.split(',');
    let localeIndex  =  localeList.indexOf(locale);

    let templateId;
    if(templateList[localeIndex])
      templateId = templateList[localeIndex];
    else
      templateId = templateList[0];


    var templateContent = {
      output: templateId,
      type: "template",
      params: params
    };
    
    return templateContent;
  }

  async prepareTransactionFailedMessage(request){
    let locale = config.supportedLocales.split(',');
    locale = locale[0];
    let payerUser = await userService.getUserForMobileNumber(request.Transaction.user.mobileNumber, config.rootTenantId);
    let chatState = await chatStateRepository.getActiveStateForUserId(payerUser.userId);
    if(chatState)
      locale = chatState.context.user.locale;

    let transactionNumber = request.Transaction.txnId;
    let consumerCode = request.Transaction.consumerCode;
    let businessService = request.Transaction.module;
    /*
    let tenantId = request.Transaction.tenantId;
    let link = await this.getPaymentLink(consumerCode,tenantId,businessService,locale);*/

    let user = {
      mobileNumber: request.Transaction.user.mobileNumber
    };

    let extraInfo = {
      whatsAppBusinessNumber: config.whatsAppBusinessNumber.slice(2),
    };

    let message = [];
    let template = dialog.get_message(messageBundle.paymentFail,locale);
    template = template.replace('{{transaction_number}}',transactionNumber);
    //template = template.replace('{{link}}',link);
    message.push(template);
    await valueFirst.sendMessageToUser(user, message,extraInfo);
    telemetry.log(payerUser.userId, 'payment', {message : {type: "whatsapp payment", status: "failed", businessService: businessService, consumerCode: consumerCode,transactionNumber: transactionNumber, locale: locale}});
  }

  /*async getShortenedURL(finalPath){
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
  
  async getPaymentLink(consumerCode,tenantId,businessService,locale){
    var UIHost = config.egovServices.externalHost;
    var paymentPath = config.egovServices.msgpaylink;
    paymentPath = paymentPath.replace(/\$consumercode/g,consumerCode);
    paymentPath = paymentPath.replace(/\$tenantId/g,tenantId);
    paymentPath = paymentPath.replace(/\$businessservice/g,businessService);
    paymentPath = paymentPath.replace(/\$redirectNumber/g,"+"+config.whatsAppBusinessNumber);
    paymentPath = paymentPath.replace(/\$locale/g,locale);
    var finalPath = UIHost + paymentPath;
    var link = await this.getShortenedURL(finalPath);
    return link;
  }*/

  async getWnsOwnerDeatils(consumerCode, tenantId, businessService, mobileNumber, authToken){
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
    };

    let url = config.egovServices.externalHost;    
    if(businessService === 'WS'){
      url = url + config.egovServices.waterConnectionSearch;
    }
    if(businessService === 'SW'){
      url = url + config.egovServices.sewerageConnectionSearch;;
    }

    url = url + '&tenantId='+tenantId;
    url = url + '&connectionNumber='+consumerCode;
    let response = await fetch(url,options);
    let searchResults;
    let isOwner = false;
    let mobileNumberList = [];
    
    if(response.status === 200) {
      searchResults = await response.json();
      let connectionHolders;
      let propertyId;

      if(businessService === 'WS'){
        connectionHolders = searchResults.WaterConnection[0].connectionHolders
        propertyId = searchResults.WaterConnection[0].propertyId;
      }
      if(businessService === 'SW'){
        connectionHolders = searchResults.SewerageConnections[0].connectionHolders
        propertyId = searchResults.SewerageConnections[0].propertyId;
      }

      //let { isMobileNumberPresent, ownerMobileNumberList } = await this.getPTOwnerDetails(propertyId, tenantId, mobileNumber, authToken);
      let data = await this.getPTOwnerDetails(propertyId, tenantId, mobileNumber, authToken);

      /*if(isMobileNumberPresent)
        return { isMobileNumberPresent, ownerMobileNumberList };*/
      
      if(connectionHolders != null){
        for(let connectionHolder of connectionHolders){
          if(connectionHolder.mobileNumber === mobileNumber){
            data.isMobileNumberPresent = true;
          }
          if(!data.ownerMobileNumberList.includes(connectionHolder.mobileNumber))
            data.ownerMobileNumberList.push(connectionHolder.mobileNumber);
        }
      }
      
      isOwner = data.isMobileNumberPresent;
      mobileNumberList = data.ownerMobileNumberList;
    }

    var result = {
      isMobileNumberPresent:isOwner,
      ownerMobileNumberList:mobileNumberList
    };
    return result;
  }

  async getPTOwnerDetails(propertyId, tenantId, mobileNumber, authToken){

    let isMobileNumberPresent = false;

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
    };

    let url = config.egovServices.externalHost + 'property-services/property/_search';
    url = url + '?tenantId='+tenantId;
    url = url + '&propertyIds='+propertyId;
    let response = await fetch(url,options);
    let searchResults;
    let ownerMobileNumberList=[];
    
    if(response.status === 200) {
      searchResults = await response.json();
      let ownerList = searchResults.Properties[0].owners;

      for(let owner of ownerList){
        if(owner.mobileNumber === mobileNumber)
          isMobileNumberPresent = true;

        if(!ownerMobileNumberList.includes(owner.mobileNumber))
          ownerMobileNumberList.push(owner.mobileNumber);
      }
      
    }
    var result = {
      isMobileNumberPresent:isMobileNumberPresent,
      ownerMobileNumberList:ownerMobileNumberList
    };
    return result;
  }

  async sendMessageToOtherOwner(ownerMobileNumberList, payerMobileNumber, payerName, businessService, consumerCode, transactionNumber, locale, filestoreId){
    if(ownerMobileNumberList.includes(payerMobileNumber))
      ownerMobileNumberList = ownerMobileNumberList.filter(item => item !== payerMobileNumber)
    
    if(locale == null){
      locale = config.supportedLocales.split(',');
      locale = locale[0];
    }
      
    
    let template;
    if(businessService == 'PT')
      template = dialog.get_message(messageBundle.paymentSucess.propertyPayment,locale);
    if(businessService == 'WS')
      template = dialog.get_message(messageBundle.paymentSucess.waterPayment,locale);
    if(businessService == 'SW')
      template = dialog.get_message(messageBundle.paymentSucess.seweragePayment,locale);

    template = template.replace('{{consumerCode}}', consumerCode);
    template = template.replace('{{name}}', payerName);
    template = template.replace('{{payerNumber}}', payerMobileNumber);
    template = template.replace('{{transaction_number}}', transactionNumber);

    let message = [];
    var messageContent = {
      output: template,
      type: "text"
    };
    message.push(messageContent);

    var pdfContent = {
          output: filestoreId,
          type: "pdf"
        };
    message.push(pdfContent);

    let extraInfo = {
      whatsAppBusinessNumber: config.whatsAppBusinessNumber.slice(2),
      fileName: consumerCode
    };

    for(let mobileNumber of ownerMobileNumberList){
      let user = {
        mobileNumber: mobileNumber
      };
      await valueFirst.sendMessageToUser(user, message, extraInfo);
    }

  }

}

let messageBundle = {
  paymentSucess:{
    en_IN: "Bill Payment Successful ✅\n\nYour transaction number is *{{transaction_number}}*.\n\nYou can download the payment receipt from above.\n\n[Payment receipt in PDF format is attached with message]\n\nWe are happy to serve you 😃",
    hi_IN: "धन्यवाद😃! आपने mSeva पंजाब के माध्यम से अपने बिल का सफलतापूर्वक भुगतान किया है। आपका ट्रांजेक्शन नंबर *{{transaction_number}}* है। \n\n कृपया अपने संदर्भ के लिए संलग्न रसीद प्राप्त करें। 😃",
    propertyPayment:{
      en_IN: "Bill Payment Successful ✅\n\nThe property tax for *{{consumerCode}}* has been paid by *{{name}}* *{{payerNumber}}*\n\nThe transaction number is *{{transaction_number}}*.\n\nWe are happy to serve you 😃",
      hi_IN: "बिल भुगतान सफल ✅\n\n*{{consumerCode}}* के लिए संपत्ति कर का भुगतान *{{name}}* *{{payerNumber}}* द्वारा किया गया है।\n\nआपका ट्रांजेक्शन नंबर *{{transaction_number}}* है।\n\nहम आपकी सेवा करके खुश हैं। 😃"
    },
    waterPayment:{
      en_IN: "Bill Payment Successful ✅\n\nThe water connection bill for *{{consumerCode}}* has been paid by *{{name}}* *{{payerNumber}}*\n\nThe transaction number is *{{transaction_number}}*.\n\nWe are happy to serve you 😃",
      hi_IN: "बिल भुगतान सफल ✅\n\n*{{consumerCode}}* के लिए पानी कनेक्शन बिल का भुगतान *{{name}}* *{{payerNumber}}* द्वारा किया गया है।\n\nआपका ट्रांजेक्शन नंबर *{{transaction_number}}* है।\n\nहम आपकी सेवा करके खुश हैं। 😃"
    },
    seweragePayment:{
      en_IN: "Bill Payment Successful ✅\n\nThe sewerage connection bill for *{{consumerCode}}* has been paid by *{{name}}* *{{payerNumber}}*\n\nThe transaction number is *{{transaction_number}}*.\n\nWe are happy to serve you 😃",
      hi_IN: "बिल भुगतान सफल ✅\n\n*{{consumerCode}}* के लिए सीवरेज कनेक्शन बिल का भुगतान *{{name}}* *{{payerNumber}}* द्वारा किया गया है।\n\nआपका ट्रांजेक्शन नंबर *{{transaction_number}}* है।\n\nहम आपकी सेवा करके खुश हैं। 😃"
    }
  },
  paymentFail:{
    en_IN: "Sorry 😥!  The Payment Transaction has failed due to authentication failure.\n\nYour transaction reference number is *{{transaction_number}}*.\n\nTo go back to the main menu, type and send mseva.",
    hi_IN: "क्षमा करें 😥! प्रमाणीकरण विफलता के कारण भुगतान लेनदेन विफल हो गया है। आपका लेन-देन संदर्भ संख्या *{{transaction_number}}* है।\n\nमुख्य मेनू पर वापस जाने के लिए, टाइप करें और mseva भेजें।"
  },
  wait:{
    en_IN: "Please wait while your receipt is being generated.",
    hi_IN: "कृपया प्रतीक्षा करें जब तक कि आपकी रसीद उत्पन्न न हो जाए।"
  },
  registration:{
    en_IN: 'If you want to receive {{service}} bill alerts for *{{consumerCode}}* on this mobile number type and send *1*\n\nElse type and send *2*',
    hi_IN: 'यदि आप इस मोबाइल नंबर प्रकार पर {{उपभोक्ता कोड}} के लिए बिल अलर्ट प्राप्त करना चाहते हैं और भेजें *1*\n\nअन्यथा टाइप करें और *2* भेजें'
  },
  endStatement:{
    en_IN: "👉 To go back to the main menu, type and send mseva.",
    hi_IN: "👉 मुख्य मेनू पर वापस जाने के लिए, टाइप करें और mseva भेजें।"
  }

};

let paymentStatusUpdateEvents = new PaymentStatusUpdateEventFormatter();

module.exports = paymentStatusUpdateEvents;
