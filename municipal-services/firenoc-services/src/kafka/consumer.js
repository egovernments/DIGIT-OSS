const kafka = require("kafka-node");
import envVariables from "../envVariables";
import producer from "./producer";
import get from "lodash/get";
import set from "lodash/set";
import { searchApiResponse } from "../api/search";
import { updateApiResponse } from "../api/update";
// import { httpRequest } from "../api";

var options = {
  // connect directly to kafka broker (instantiates a KafkaClient)
  kafkaHost: envVariables.KAFKA_BROKER_HOST,
  groupId: "firenoc-consumer-grp",
  autoCommit: true,
  autoCommitIntervalMs: 5000,
  sessionTimeout: 15000,
  fetchMaxBytes: 10 * 1024 * 1024, // 10 MB
  // An array of partition assignment protocols ordered by preference. 'roundrobin' or 'range' string for
  // built ins (see below to pass in custom assignment protocol)
  protocol: ["roundrobin"],
  // Offsets to use for new groups other options could be 'earliest' or 'none'
  // (none will emit an error if no offsets were saved) equivalent to Java client's auto.offset.reset
  fromOffset: "latest",
  // how to recover from OutOfRangeOffset error (where save offset is past server retention)
  // accepts same value as fromOffset
  outOfRangeOffset: "earliest"
};

var consumerGroup = new kafka.ConsumerGroup(options, [
  envVariables.KAFKA_TOPICS_FIRENOC_CREATE,
  envVariables.KAFKA_TOPICS_FIRENOC_UPDATE,
  envVariables.KAFKA_TOPICS_FIRENOC_WORKFLOW,
  envVariables.KAFKA_TOPICS_RECEIPT_CREATE
]);


consumerGroup.on("message", function(message) {
  const value = JSON.parse(message.value);

  let payloads = [];
  const topic = envVariables.KAFKA_TOPICS_NOTIFICATION;
  let smsRequest = {};
  let fireNOCRequest = {};
  let events = [];
  let { RequestInfo } = value;

  const sendEventNotificaiton = () => {
    let requestPayload = {
      // RequestInfo,
      events
    };

    payloads.push({
      topic: envVariables.KAFKA_TOPICS_EVENT_NOTIFICATION,
      messages: JSON.stringify(requestPayload)
    });
    // httpRequest({
    //   hostURL: envVariables.EGOV_EVENT_HOST,
    //   endPoint: `${envVariables.EGOV_EVENT_CONTEXT_PATH}${envVariables.EGOV_EVENT_CREATE_ENPOINT}`,
    //   requestPayload
    // }).then(
    //   function(response) {
    //   },
    //   function(error) {
    //   }
    // );
  };

  const sendFireNOCSMSRequest = FireNOCs => {
    for (let i = 0; i < FireNOCs.length; i++) {
      smsRequest["mobileNumber"] = get(
        FireNOCs[i],
        "fireNOCDetails.applicantDetails.owners.0.mobileNumber"
      );
      let firenocType =
        get(FireNOCs[i], "fireNOCDetails.fireNOCType") === "NEW"
          ? "new"
          : "provision";

      let ownerName = get(
        FireNOCs[i],
        "fireNOCDetails.applicantDetails.owners.0.name"
      );
      let uuid = get(
        FireNOCs[i],
        "fireNOCDetails.applicantDetails.owners.0.uuid"
      );
      let applicationNumber = get(
        FireNOCs[i],
        "fireNOCDetails.applicationNumber"
      );
      let fireNOCNumber = get(FireNOCs[i], "fireNOCDetails.validTo");
      let validTo = get(FireNOCs[i], "fireNOCDetails.validTo");
      let tenantId = get(FireNOCs[i], "tenantId");
      switch (FireNOCs[i].fireNOCDetails.status) {
        case "INITIATED":
          smsRequest[
            "message"
          ] = `Dear ${ownerName},Your application for ${firenocType} has been generated. Your application no. is ${applicationNumber}.\n\nEGOVS`;
          break;
        case "PENDINGPAYMENT":
          smsRequest[
            "message"
          ] = `Dear ${ownerName},Your application for ${firenocType} has been submitted. Your application no. is ${applicationNumber}. Please pay your NoC Fees online or at your applicable fire office\n\nEGOVS`;
          break;
        case "DOCUMENTVERIFY":
          smsRequest[
            "message"
          ] = `Dear ${ownerName},Your application for ${firenocType} with application no. is ${applicationNumber} has been forwarded for field inpsection.\n\nEGOVS`;
          break;
        case "FIELDINSPECTION":
          smsRequest[
            "message"
          ] = `Dear ${ownerName},Your application for ${firenocType} with application no. is ${applicationNumber} has been forwarded for document verifier.\n\nEGOVS`;
          break;
        case "PENDINGAPPROVAL":
          smsRequest[
            "message"
          ] = `Dear ${ownerName},Your application for ${firenocType} with application no. is ${applicationNumber} has been forwarded for approver.\n\nEGOVS`;
          break;
        case "APPROVED":
          var currentDate = new Date(validTo);
          var date = currentDate.getDate();
          var month = currentDate.getMonth(); //Be careful! January is 0 not 1
          var year = currentDate.getFullYear();

          var dateString =
            date +
            "-" +
            (month + 1 > 9 ? month + 1 : `0${month + 1}`) +
            "-" +
            year;

          smsRequest[
            "message"
          ] = `Dear ${ownerName},Your application for ${firenocType} with application no. is ${applicationNumber} is approved.And your fire NoC has been generated.Your Fire NoC No. is ${fireNOCNumber}. It is valid till ${dateString}\n\nEGOVS`;
          break;
        case "SENDBACKTOCITIZEN":
          smsRequest[
            "message"
          ] = `Dear ${ownerName}, 
          Your application for ${firenocType} Fire NOC Certificate with application no. ${applicationNumber} is send back to you for further actions.Please check the comments and Re-submit application through mSeva App or by ULB counter.\n\nEGOVS`;
          break;
        case "REJECTED":
          smsRequest[
            "message"
          ] = `Dear ${ownerName},Your application for ${firenocType} with application no. is ${applicationNumber} has been rejected.To know more details please contact your applicable fire office\n\nEGOVS`;
          break;
        // case "CANCELLED":
        //   break;
        default:
      }
      payloads.push({
        topic,
        messages: JSON.stringify(smsRequest)
      });
      if (smsRequest.message) {
        events.push({
          tenantId: tenantId,
          eventType: "SYSTEMGENERATED",
          description: smsRequest.message,
          name: "Firenoc notification",
          source: "webapp",
          recepient: {
            toUsers: [uuid]
          }
        });
      }
    }
    if (events.length > 0) {
      sendEventNotificaiton();
    }
  };
  const FireNOCPaymentStatus = async value => {
    try {
      const { Payment, RequestInfo } = value;
      let tenantId = get(Payment, "tenantId");
      const { paymentDetails } = Payment;
      if (paymentDetails) {
        for (var index = 0; index < paymentDetails.length; index++) {
          let businessService = get(paymentDetails[index], "businessService");
          if (businessService === envVariables.BUSINESS_SERVICE) {
            let applicationNumber = get(
              paymentDetails[index],
              "bill.consumerCode"
            );
            const query = {
              tenantId,
              applicationNumber
            };
            const body = { RequestInfo };
            const searchRequest = { body, query };
            const searchResponse = await searchApiResponse(searchRequest);
            const { FireNOCs } = searchResponse;
            if (!FireNOCs.length) {
              throw "FIRENOC Search error";
            }
            for (
              var firenocIndex = 0;
              firenocIndex < FireNOCs.length;
              firenocIndex++
            ) {
              set(
                FireNOCs[firenocIndex],
                "fireNOCDetails.action",
                envVariables.ACTION_PAY
              );
            }

            for(var index =0; index < RequestInfo.userInfo.roles.length;index++){
              let tenantId = get(RequestInfo.userInfo,"tenantId");
              set(RequestInfo.userInfo.roles[index],"tenantId",tenantId);
            }

            const updateBody = { RequestInfo, FireNOCs };
            const updateRequest = { body: updateBody };
            const updateResponse = await updateApiResponse(updateRequest, false);
          }
        }
      }
    } catch (error) {
      throw error;
    }
  };

  switch (message.topic) {
    case envVariables.KAFKA_TOPICS_FIRENOC_CREATE:
      {
        const { FireNOCs } = value;
        sendFireNOCSMSRequest(FireNOCs);
      }
      break;
    case envVariables.KAFKA_TOPICS_FIRENOC_UPDATE:
      {
        const { FireNOCs } = value;
        sendFireNOCSMSRequest(FireNOCs);
      }
      break;
    case envVariables.KAFKA_TOPICS_FIRENOC_WORKFLOW:
      {
        const { FireNOCs } = value;
        sendFireNOCSMSRequest(FireNOCs);
      }
      break;

    // case envVariables.KAFKA_TOPICS_RECEIPT_CREATE:
    //   {
    //   }
    //   break;
    case envVariables.KAFKA_TOPICS_RECEIPT_CREATE:
      {
        FireNOCPaymentStatus(value);
      }
      break;
  }

  producer.send(payloads, function(err, data) {
    if (!err) {
    } else {
    }
  });
});

consumerGroup.on("error", function(err) {
});

consumerGroup.on("offsetOutOfRange", function(err) {
});

export default consumerGroup;
