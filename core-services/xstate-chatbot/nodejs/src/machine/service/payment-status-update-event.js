const config = require('../../env-variables');
const valueFirst = require('../../channel/value-first');        // TODO: import channel
const fetch = require("node-fetch");
const dialog = require('../util/dialog');
const userService = require('../../session/user-service');
const chatStateRepository = require('../../session/repo');

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
    let chatState = await chatStateRepository.getActiveStateForUserId(user.userId);
    if(chatState)
      locale = chatState.context.user.locale;
  
    if(payment.additionalDetails && payment.additionalDetails.isWhatsapp){
      let tenantId = payment.tenantId;
      tenantId = tenantId.split(".")[0]; 

      let businessService = payment.paymentDetails[0].businessService;
      let key;
      if(businessService === 'TL')
        key = 'tradelicense-receipt';

      else if(businessService === 'PT')
        key = 'property-receipt';
      
      else if(businessService === 'WS' || businessService === 'SW')
        key = 'ws-onetime-receipt';

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
          fileName: key
        };

        let messages = await this.prepareSucessMessage(payment,responseBody.filestoreIds[0],locale);
    
        await valueFirst.sendMessageToUser(user, messages,extraInfo);
      }
    }

  }

  async prepareSucessMessage(payment,filestoreId,locale){
    let message=[];
    let template = dialog.get_message(messageBundle.paymentSucess,locale);
    template = template.replace('{{transaction_number}}',payment.transactionNumber);

    var content = {
      output:template,
      type: "text"
    };
    message.push(content);

    var pdfContent = {
      output: filestoreId,
      type: "pdf"
    };
    message.push(pdfContent);

    return message;
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
    let tenantId = request.Transaction.tenantId;
    let businessService = request.Transaction.module;
    let link = await this.getPaymentLink(consumerCode,tenantId,businessService,locale);

    let user = {
      mobileNumber: request.Transaction.user.mobileNumber
    };

    let extraInfo = {
      whatsAppBusinessNumber: config.whatsAppBusinessNumber.slice(2),
    };

    let message = [];
    let template = dialog.get_message(messageBundle.paymentFail,locale);
    template = template.replace('{{transaction_number}}',transactionNumber);
    template = template.replace('{{link}}',link);
    message.push(template);
    await valueFirst.sendMessageToUser(user, message,extraInfo);
  }

  async getShortenedURL(finalPath){
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
  }

}

let messageBundle = {
  paymentSucess:{
    en_IN: "Thank you😃! You have successfully paid your bill through mSeva Punjab. Your transaction number is {{transaction_number}}.\n\nPlease find attached receipt for your reference.\n",
    hi_IN: "धन्यवाद😃! आपने mSeva पंजाब के माध्यम से अपने बिल का सफलतापूर्वक भुगतान किया है। आपका ट्रांजेक्शन नंबर {{transaction_number}} है। \n\n कृपया अपने संदर्भ के लिए संलग्न रसीद प्राप्त करें।"
  },
  paymentFail:{
    en_IN: "Sorry😥! The Payment Transaction has failed due to authentication failure. Your transaction reference number is {{transaction_number}}.\n\nIf the amount is debited from your account please give us 2-3 hours to get confirmation on payment.\n\nIf the amount is  not deducted from your account you can retry using the following payment link:\n{{link}}",
    hi_IN: "क्षमा करें 😥! प्रमाणीकरण विफलता के कारण भुगतान लेनदेन विफल हो गया है। आपका लेन-देन संदर्भ संख्या {{transaction_number}} है।\n\n यदि राशि आपके खाते से डेबिट होती है, तो कृपया भुगतान पर पुष्टि प्राप्त करने के लिए हमें 2-3 घंटे का समय दें।\n\n यदि आपके खाते से राशि नहीं काटी जाती है, तो आप निम्नलिखित भुगतान लिंक का उपयोग करके पुन: प्रयास कर सकते हैं:\n{{link}}"
  }

};

let paymentStatusUpdateEvents = new PaymentStatusUpdateEventFormatter();

module.exports = paymentStatusUpdateEvents;
