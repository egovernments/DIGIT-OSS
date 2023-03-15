const config = require('../env-variables');
const fetch = require("node-fetch");
const urlencode = require('urlencode');
const fs = require('fs');
const axios = require('axios');
var FormData = require("form-data");
var uuid = require('uuid-random');
var geturl = require("url");
var path = require("path");
require('url-search-params-polyfill');

let valueFirstRequestBody = "{\"@VER\":\"1.2\",\"USER\":{\"@USERNAME\":\"\",\"@PASSWORD\":\"\",\"@UNIXTIMESTAMP\":\"\",\"@CH_TYPE\":\"4\"},\"DLR\":{\"@URL\":\"\"},\"SMS\":[]}";

let textMessageBody = "{\"@UDH\":\"0\",\"@CODING\":\"1\",\"@TEXT\":\"\",\"@MSGTYPE\":\"1\",\"@TEMPLATEINFO\":\"\",\"@PROPERTY\":\"0\",\"@ID\":\"\",\"ADDRESS\":[{\"@FROM\":\"\",\"@TO\":\"\",\"@SEQ\":\"\",\"@TAG\":\"\"}]}";

let imageMessageBody = "{\"@UDH\":\"0\",\"@CODING\":\"1\",\"@TEXT\":\"\",\"@MSGTYPE\":\"4\",\"@MEDIADATA\":\"\",\"@CAPTION\":\"\",\"@TYPE\":\"image\",\"@CONTENTTYPE\":\"image\/png\",\"@TEMPLATEINFO\":\"\",\"@PROPERTY\":\"0\",\"@ID\":\"\",\"ADDRESS\":[{\"@FROM\":\"\",\"@TO\":\"\",\"@SEQ\":\"\",\"@TAG\":\"\"}]}";

let buttontemplateMessageBody = "{\"@UDH\":\"0\",\"@CODING\":\"1\",\"@TEXT\":\"\",\"@CAPTION\":\"\",\"@TYPE\":\"\",\"@CONTENTTYPE\":\"\",\"@TEMPLATEINFO\":\"\",\"@MSGTYPE\":\"3\",\"@B_URLINFO\":\"\",\"@PROPERTY\":\"0\",\"@ID\":\"\",\"ADDRESS\":[{\"@FROM\":\"\",\"@TO\":\"\",\"@SEQ\":\"1\",\"@TAG\":\"\"}]}"

let templateMessageBody = "{\"@UDH\":\"0\",\"@CODING\":\"1\",\"@TEXT\":\"\",\"@CAPTION\":\"\",\"@TYPE\":\"\",\"@CONTENTTYPE\":\"\",\"@TEMPLATEINFO\":\"\",\"@PROPERTY\":\"0\",\"@ID\":\"\",\"ADDRESS\":[{\"@FROM\":\"\",\"@TO\":\"\",\"@SEQ\":\"1\",\"@TAG\":\"\"}]}"

class ValueFirstWhatsAppProvider {

    async checkForMissedCallNotification(requestBody){
        if(requestBody.Call_id || requestBody.operartor || requestBody.circle)
            return true;
        
        return false;
    }

    async getMissedCallValues(requestBody){
        let reformattedMessage={};

        reformattedMessage.message = {
            input: "mseva",
            type: "text"
        };

        reformattedMessage.user = {
            mobileNumber: requestBody.mobile_number.slice(2)
        };
        reformattedMessage.extraInfo = {
            whatsAppBusinessNumber: config.whatsAppBusinessNumber.slice(2),
            tenantId: config.rootTenantId,
            missedCall: true
        };
        return reformattedMessage;
    }

    async fileStoreAPICall(fileName,fileData){

        var url = config.egovServices.egovServicesHost+config.egovServices.egovFilestoreServiceUploadEndpoint;
        url = url+'&tenantId='+config.rootTenantId;
        var form = new FormData();
        form.append("file", fileData, {
            filename: fileName,
            contentType: "image/jpg"
        });
        let response = await axios.post(url, form, {
            headers: {
                ...form.getHeaders()
            }
        });
        
        var filestore = response.data;
        return filestore['files'][0]['fileStoreId'];
    }
    

    async convertFromBase64AndStore(imageInBase64String){
        imageInBase64String = imageInBase64String.replace(/ /g,'+');
        let buff = Buffer.from(imageInBase64String, 'base64');
        var tempName = 'pgr-whatsapp-'+Date.now()+'.jpg'; 

        /*fs.writeFile(tempName, buff, (err) => {
            if (err) throw err;
        });*/

        var filestoreId = await this.fileStoreAPICall(tempName,buff);
        
        return filestoreId;
    }

    async getUserMessage(requestBody){
        let reformattedMessage={};
        let type;
        let input;

        if(requestBody.buttonLabel && requestBody.buttonLabel != '$btnLabel'){
            type = 'button'
            input = requestBody.buttonLabel;
            requestBody.from = requestBody.TO;
            requestBody.to = config.whatsAppBusinessNumber;
        }
        else{
            if(requestBody.media_type)
                type = requestBody.media_type;
            else
                type = "unknown";

            if(type === "location") {
                input = '(' + requestBody.latitude + ',' + requestBody.longitude + ')';
            } 
            else if(type === 'image'){
                var imageInBase64String = requestBody.MediaData;
                input = await this.convertFromBase64AndStore(imageInBase64String);
            }
            else if(type === 'unknown' || type === 'document')
                input = ' ';
            else {
                input = requestBody.text;
            }
        } 

        reformattedMessage.message = {
            input: input,
            type: type
        };
        reformattedMessage.user = {
            mobileNumber: requestBody.from.slice(2)
        };
        reformattedMessage.extraInfo ={
            whatsAppBusinessNumber: requestBody.to.slice(2),
            tenantId: config.rootTenantId
        };

        return reformattedMessage;

    }

    async isValid(requestBody){
        try {
            if(await this.checkForMissedCallNotification(requestBody)) // validation for misscall
                return true;
            
            let type = requestBody.media_type;

            if(type==="text" || type==="image")
                return true;

            else if(type || type.length>=1)
                return true;

        } catch (error) {
            console.error("Invalid request");
        }
        return false;
    };

    async getTransformedRequest(requestBody){
        var missCall = await this.checkForMissedCallNotification(requestBody);
        let reformattedMessage = {};

        if(missCall)
            reformattedMessage= await this.getMissedCallValues(requestBody);
        else
            reformattedMessage= await this.getUserMessage(requestBody);

        return reformattedMessage;
    }

    async downloadImage(url,filename) {  
        const writer = fs.createWriteStream(filename);
      
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
          });
      
        response.data.pipe(writer);
      
        return new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        })
    }

    async getFileForFileStoreId(filestoreId){
        var url = config.egovServices.egovServicesHost+config.egovServices.egovFilestoreServiceDownloadEndpoint;
        url = url + '?';
        url = url + 'tenantId='+config.rootTenantId;
        url = url + '&';
        url = url + 'fileStoreIds='+filestoreId;

        var options = {
            method: "GET",
            origin: '*'
        }

        let response = await fetch(url,options);
        response = await(response).json();
        var fileURL = response['fileStoreIds'][0]['url'].split(",");
        /*var fileName = geturl.parse(fileURL[0]);
        fileName = path.basename(fileName.pathname);
        fileName = fileName.substring(13);
        await this.downloadImage(fileURL[0].toString(),fileName);
        const file = fs.readFileSync(fileName,'base64');
        fs.unlinkSync(fileName);*/
        return fileURL[0].toString();
    }

    async getTransformedResponse(user, messages, extraInfo){
        let userMobile = user.mobileNumber;

        let fromMobileNumber = "91"+extraInfo.whatsAppBusinessNumber;
        if(!fromMobileNumber)
            console.error("Receipient number can not be empty");

        let requestBody = JSON.parse(valueFirstRequestBody);
        requestBody["USER"]["@USERNAME"] = config.valueFirstWhatsAppProvider.valueFirstUsername;
        requestBody["USER"]["@PASSWORD"] = config.valueFirstWhatsAppProvider.valueFirstPassword;

        for(let i = 0; i < messages.length; i++) {
            let message;
            let type;
            if(typeof messages[i] == 'string'){
                type = "text";
                message = messages[i];
            }
            
            if(typeof messages[i] == 'object'){
                type = messages[i].type;
                message = messages[i].output;
            }
            
            let messageBody;
            if(type === 'text') {
                messageBody = JSON.parse(textMessageBody);
                let encodedMessage=urlencode(message, 'utf8');
                messageBody['@TEXT'] = encodedMessage;
            } 
            else if(type == 'template'){

                if(messages[i].bttnUrlComponent){
                    messageBody = JSON.parse(buttontemplateMessageBody);
                    messageBody['@B_URLINFO'] = messages[i].bttnUrlComponent;
                }
                else
                    messageBody = JSON.parse(templateMessageBody);

                let combinedStringForTemplateInfo = message;
            
                if(messages[i].params){
                    let templateParams = messages[i].params;
                    for(let param of templateParams)
                        combinedStringForTemplateInfo = combinedStringForTemplateInfo + "~" + param;
                }

                messageBody['@TEMPLATEINFO'] = combinedStringForTemplateInfo;
            }     
            else {
                // TODO for non-textual messages
                let fileStoreId;
                if(message)
                    fileStoreId = message;
                var fileURL = await this.getFileForFileStoreId(fileStoreId);
                var uniqueImageMessageId = uuid();
                messageBody = JSON.parse(imageMessageBody);
                if(type === 'pdf'){
                    messageBody['@TYPE'] = "document";
                    messageBody['@CONTENTTYPE'] = 'application/pdf';
                    messageBody['@CAPTION'] = extraInfo.fileName+'-'+Date.now();
                }
                messageBody['@MEDIADATA'] = fileURL;
                messageBody['@ID'] = uniqueImageMessageId;

            }
            messageBody["ADDRESS"][0]["@FROM"] = fromMobileNumber;
            messageBody["ADDRESS"][0]["@TO"] = '91' + userMobile;

            requestBody["SMS"].push(messageBody);
        }
        
        return requestBody;
    }

    async sendMessage(requestBody) {
        let url = config.valueFirstWhatsAppProvider.valueFirstURL;

        let headers = {
            'Content-Type': 'application/json',
            'Authorization': config.valueFirstWhatsAppProvider.valuefirstLoginAuthorizationHeader
        }

        var request = {
            method: "POST",
            headers: headers,
            origin: '*',
            body: JSON.stringify(requestBody)
        }
        let response = await fetch(url,request);
        if(response.status === 200){
            let messageBack = await response.json();
            if(messageBack.MESSAGEACK.Err){
                console.error(messageBack.MESSAGEACK.Err.Desc);
                return messageBack;
            }

            
            return messageBack
        }         
        else {
            console.error('Error in sending message');
            return undefined;
          }
    }    
    
    async processMessageFromUser(req) {
        let reformattedMessage = {}
        let requestBody = req.query;

        if(Object.keys(requestBody).length === 0)
            requestBody  = req.body; 
            
        if(requestBody.media_type && requestBody.media_type === 'button')
            return null;
        
        if(requestBody.buttonLabel && requestBody.buttonLabel == '$btnLabel')
            return null;
        
        reformattedMessage = await this.getTransformedRequest(requestBody);
        return reformattedMessage;

    }

    async sendMessageToUser(user, messages,extraInfo) {
        let requestBody = {};
        requestBody = await this.getTransformedResponse(user, messages, extraInfo);
        this.sendMessage(requestBody);       
    }

    async getTransformMessageForTemplate(reformattedMessages){
        if(reformattedMessages.length>0){
            let requestBody = JSON.parse(valueFirstRequestBody);
            requestBody["USER"]["@USERNAME"] = config.valueFirstWhatsAppProvider.valueFirstUsername;
            requestBody["USER"]["@PASSWORD"] = config.valueFirstWhatsAppProvider.valueFirstPassword;

            for(let message of reformattedMessages){
                let messageBody = JSON.parse(templateMessageBody);
                let templateParams = message.extraInfo.params;
                let combinedStringForTemplateInfo = message.extraInfo.templateId;
                let userMobile = message.user.mobileNumber;
            
                for(let param of templateParams)
                    combinedStringForTemplateInfo = combinedStringForTemplateInfo + "~" + param;

                messageBody['@TEMPLATEINFO'] = combinedStringForTemplateInfo;

                messageBody["ADDRESS"][0]["@FROM"] = config.whatsAppBusinessNumber;
                messageBody["ADDRESS"][0]["@TO"] = '91' + userMobile;

                requestBody["SMS"].push(messageBody);

            }
            this.sendMessage(requestBody);

        }

         
    }

    

}

module.exports = new ValueFirstWhatsAppProvider();
