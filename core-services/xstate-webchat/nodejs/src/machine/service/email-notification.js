const { config } = require("../pt");
const producer = require('./kafka/kafka-producer');

class EmailNotificationService {
    sendNewComplaintEmail(requestInfo, emailId, complaintId, complaintType, complaintSubType, applicationNumber, phoneNumber, location, comments, imageAttachment) {
        let subject = "New Complaint Registered <complaintId>";
        let body = "Dear Citizen,\nComplaint has been resgistered of Type : <complaintType>  and Sub-Type : <complaintSubType>\nPlease find full details of the complaint below.\nComplaint ID : <complaintId>\nType : <complaintType>\nSub-Type : <complaintSubType>\nApplication Number : <applicationNumber>\nPhone Number : <phoneNumber>\nLocation : <location>\nComments : <comments>\nImage Attachment : <imageAttachment>";



        // let subject = "New Complaint Registered " + complaintId;
        // let body = "Dear Citizen,\nComplaint has been resgistered of Type " + complaintType + " and Sub-Type :"
        // + complaintSubType + 
        //  "\nPlease find full details of the complaint below.\nComplaint ID : " + complaintId +
        //  "\nType : " + complaintType + 
        //  "\nSub-Type : " + complaintSubType + 
        //  "\nApplication Number : " + applicationNumber + 
        //  "\nPhone Number : " + phoneNumber + 
        //  "\nLocation : " + location + 
        //  "\nComments : " + comments + 
        //  "\nImage Attachment : " + imageAttachment;
         

         console.log(body);

        let email = {
            emailTo : [emailId],
            subject : subject,
            body : body,
            isHTML : false
        };
        this.sendEmail(requestInfo, email)

        
        
    }

    sendEmail(requestInfo, email) {
        let emailPayload = [{
            topic : config.kafka.sendEmailTopic,
            messages : JSON.stringify(email)
        }]
        producer.send(requestInfo, emailPayload);
//        console.log(JSON.stringify(email));
    }

    

};

module.exports = new EmailNotificationService();



// let emailNotificationService = new EmailNotificationService();
// emailNotificationService.sendNewComplaintEmail({}, 'asd@aa.co', '123', 'web', 'pt', '456', '9428333333', 'punjab', 'no comments', null);
