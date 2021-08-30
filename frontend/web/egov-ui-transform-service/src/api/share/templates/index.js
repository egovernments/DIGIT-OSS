import get from "lodash/get";
let env;
if (process.env.NODE_ENV === "development") {
  env="development";
}
else {
  env="production";
}

const templateInterface=({ shareTemplate, shareContent }) => {
  let payloads=[];
  switch (shareTemplate) {
    case "complaintDetails": {
      const topic = env==="development"?"SMS":"egov.core.notification.sms";
      const SMSRequest = {
        mobileNumber: get(shareContent[0], "to"),
        message: `Dear Contractor, please find complaint details : Name - ${get(shareContent[0].content,"name")}, Mobile Number - ${get(shareContent[0].content,"moblileNo")}, Complaint Number - ${get(shareContent[0].content,"complaintNo")}, Complaint Type - ${get(shareContent[0].content,"complaintType")}, Address - ${get(shareContent[0].content,"address")}`
      };
      const data =SMSRequest
      payloads.push({
        topic,
        messages:JSON.stringify(data)
      })
    }
    break;
    case "complaintDetailsEmail": {
      const topic = env==="development"?"SMS":"egov.core.notification.sms";
      const SMSRequest = {
        email:get(shareContent[0], "to"),
        subject:get(shareContent[0].content,"subject"),
        body: `Dear Contractor, please find complaint details : Name - ${get(shareContent[0].content,"name")}, Mobile Number - ${get(shareContent[0].content,"moblileNo")}, Complaint Number - ${get(shareContent[0].content,"complaintNo")}, Complaint Type - ${get(shareContent[0].content,"complaintType")}, Address - ${get(shareContent[0].content,"address")}`
      };
      const data =SMSRequest
      payloads.push({
        topic,
        messages:JSON.stringify(data)
      })
    }
    break;
  }
  return payloads;
};

export default templateInterface;
