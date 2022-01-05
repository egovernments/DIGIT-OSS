const config = require('../../env-variables');
const producer = require('../../session/kafka/kafka-producer');

class EmailNotificationService {
  sendNewComplaintEmail(requestInfo, emailId, complaintId, complaintType, complaintSubType, applicationNumber, phoneNumber, location, comments, imageAttachment) {
    let subject = 'New Complaint Registered <complaintId>';
    let body = 'Dear Citizen,\nComplaint has been resgistered of Type : <complaintType>  and Sub-Type : <complaintSubType>\nPlease find full details of the complaint below.\nComplaint ID : <complaintId>\nType : <complaintType>\nSub-Type : <complaintSubType>\nApplication Number : <applicationNumber>\nPhone Number : <phoneNumber>\nLocation : <location>\nComments : <comments>\nImage Attachment : <imageAttachment>';

    subject = subject.replace('<complaintId>', complaintId);

    body = body.replaceAll('<complaintType>', complaintType);
    body = body.replaceAll('<complaintSubType>', complaintSubType);
    body = body.replace('<complaintId>', complaintId);
    body = body.replace('<applicationNumber>', applicationNumber);
    body = body.replace('<phoneNumber>', phoneNumber);
    body = body.replace('<location>', location);
    body = body.replace('<comments>', comments);
    body = body.replace('<imageAttachment>', imageAttachment);

    const email = {
      emailTo: [emailId],
      subject,
      body,
      isHTML: false,
    };
    this.sendEmail(requestInfo, email);
  }

  sendEmail(requestInfo, email) {
    const emailServicePayload = {
      requestInfo,
      email,
    };
    const emailPayload = [{
      topic: config.kafka.sendEmailTopic,
      messages: JSON.stringify(emailServicePayload),
    }];
    producer.send(emailPayload, (err, data) => {
      if (err) {
        console.error(`failed to put email notification on ${config.kafka.sendEmailTopic}`);
      } else {
        console.log(`email successfully placed on ${config.kafka.sendEmailTopic}`);
      }
    });
  }
}

module.exports = new EmailNotificationService();
