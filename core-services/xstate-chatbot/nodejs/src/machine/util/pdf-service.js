const config = require('../../env-variables');
const fetch = require('node-fetch');
const channel = require('../../channel');

class PdfService {

    async generatePdf(businessService, payment, locale, authToken, userInfo, mobileNumber){
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
        pdfUrl = pdfUrl + '?key='+key+ '&tenantId=' + config.rootTenantId;

        let requestBody = {
            RequestInfo: {
                authToken: authToken,
                msgId: config.msgId + '|' + locale,
                userInfo: userInfo
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
        };

        let response = await fetch(pdfUrl, options);
        if(response.status == 201){
            let responseBody = await response.json();

            let user = {
                mobileNumber: mobileNumber
              };
            let extraInfo = {
                whatsAppBusinessNumber: config.whatsAppBusinessNumber.slice(2),
                fileName: payment.paymentDetails[0].bill.consumerCode
            };

            let message = [];
            var pdfContent = {
              output: responseBody.filestoreIds[0],
              type: "pdf"
            };
            message.push(pdfContent);

            await channel.sendMessageToUser(user, message, extraInfo);
    
        }

    }
}

const pdfService = new PdfService();

module.exports = pdfService;