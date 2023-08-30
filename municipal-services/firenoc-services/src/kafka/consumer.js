const { Kafka, logLevel } = require('kafkajs')
import envVariables from "../envVariables";
import producer from "./producer";
import get from "lodash/get";
import set from "lodash/set";
import { searchApiResponse } from "../api/search";
import { updateApiResponse } from "../api/update";
import { getUpdatedTopic, getStateSpecificTopicName } from "../utils/index";
import userService from "../services/userService";
// import { httpRequest } from "../api";


const kafka = new Kafka({
  logLevel: logLevel.INFO,
  brokers: [envVariables.KAFKA_BROKER_HOST],
  ssl: false,
  clientId: 'example-consumer',
});

const consumer = kafka.consumer({ groupId: 'firenoc-consumer-grp' });

console.log("Consumer ");

const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic: envVariables.KAFKA_TOPICS_RECEIPT_CREATE_REGEX, fromBeginning: true});
  await consumer.subscribe({ topic: envVariables.KAFKA_TOPICS_FIRENOC_CREATE_SMS_REGEX, fromBeginning: true});
  await consumer.subscribe({ topic: envVariables.KAFKA_TOPICS_FIRENOC_UPDATE_SMS_REGEX, fromBeginning: true});
  await consumer.subscribe({ topic: envVariables.KAFKA_TOPICS_FIRENOC_WORKFLOW_SMS_REGEX, fromBeginning: true});

  await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log("consumer-topic",topic);
        let value = JSON.parse(message.value);

        let payloads = [];
        //const topic = envVariables.KAFKA_TOPICS_NOTIFICATION;
        let smsRequest = {};
        let fireNOCRequest = {};
        let events = [];
        let { RequestInfo } = value;

        const sendEventNotificaiton = (tenantId) => {
          let requestPayload = {
            RequestInfo,
            events
          };

          let topic = envVariables.KAFKA_TOPICS_EVENT_NOTIFICATION;
          var isCentralInstance  = envVariables.IS_ENVIRONMENT_CENTRAL_INSTANCE;
          if(typeof isCentralInstance =="string")
            isCentralInstance = (isCentralInstance.toLowerCase() == "true");

          if(isCentralInstance)
            topic = getStateSpecificTopicName(tenantId, topic);

          payloads.push({
            topic: topic,
            messages: JSON.stringify(requestPayload)
          });
          // httpRequest({
          //   hostURL: envVariables.EGOV_EVENT_HOST,
          //   endPoint: `${envVariables.EGOV_EVENT_CONTEXT_PATH}${envVariables.EGOV_EVENT_CREATE_ENPOINT}`,
          //   requestPayload
          // }).then(
          //   function(response) {
          //     console.log(response);
          //   },
          //   function(error) {
          //     console.log(error);
          //   }
          // );
        };

        const sendFireNOCSMSRequest = async FireNOCs => {
          let tenantId = get(FireNOCs[0], "tenantId");
          for (let i = 0; i < FireNOCs.length; i++) {
            let mobileNumber = get(
              FireNOCs[i],
              "fireNOCDetails.applicantDetails.owners.0.mobileNumber"
            );
            smsRequest["mobileNumber"] = mobileNumber;
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
                ] = `Dear ${ownerName},Your application for ${firenocType} with application no. is ${applicationNumber} has been forwarded for document verifier.\n\nEGOVS`;
                break;
              case "FIELDINSPECTION":
                smsRequest[
                  "message"
                ] = `Dear ${ownerName},Your application for ${firenocType} with application no. is ${applicationNumber} has been forwarded for field inpsection.\n\nEGOVS`;
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
              case "CITIZENACTIONREQUIRED":
                smsRequest[
                  "message"
                ] = `Dear ${ownerName},Your application for ${firenocType} Fire NOC Certificate with application no. ${applicationNumber} is send back to you for further actions.Please check the comments and Re-submit application through mSeva App or by ULB counter.\n\nEGOVS`;
                break;
              case "CITIZENACTIONREQUIRED-DV":
                smsRequest[
                  "message"
                ] = `Dear ${ownerName},Your application for ${firenocType} Fire NOC Certificate with application no. ${applicationNumber} is send back to you for further actions.Please check the comments and Re-submit application through mSeva App or by ULB counter.\n\nEGOVS`;
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

            let topic = envVariables.KAFKA_TOPICS_NOTIFICATION;
            var isCentralInstance  = envVariables.IS_ENVIRONMENT_CENTRAL_INSTANCE;
            if(typeof isCentralInstance =="string")
              isCentralInstance = (isCentralInstance.toLowerCase() == "true");

            if(isCentralInstance)
              topic = getStateSpecificTopicName(tenantId, topic);

            payloads.push({
              topic: topic,
              messages: JSON.stringify(smsRequest)
            });
            // console.log("smsRequest",JSON.stringify(smsRequest));
            if (smsRequest.message) {
              let userSearchReqCriteria = {};
              let userSearchResponse = {};
              let header = {
                tenantid:tenantId
              };
              userSearchReqCriteria.userName = mobileNumber;
              userSearchReqCriteria.active = true;
              userSearchReqCriteria.tenantId = envVariables.EGOV_DEFAULT_STATE_ID;
              userSearchResponse = await userService.searchUser(
                RequestInfo,
                userSearchReqCriteria,
                header
              );
              if (get(userSearchResponse, "user", []).length > 0) {
                events.push({
                  tenantId: tenantId,
                  eventType: "SYSTEMGENERATED",
                  description: smsRequest.message,
                  name: "Firenoc notification",
                  source: "webapp",
                  recepient: {
                    toUsers: [userSearchResponse.user[0].uuid]
                  }
                });
              }

            }
          }
          // console.log("events",events);
          if (events.length > 0) {
            sendEventNotificaiton(tenantId);
          }

          producer.send(payloads, function(err, data) {
            if (!err) {
              console.log(data);
            } else {
              console.log(err);
            }
          });

        };
        const FireNOCPaymentStatus = async value => {
          try {
            //console.log("Consumer Payment data"+JSON.stringify(value));
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
                  let headers = {
                    tenantid:tenantId
                  };
                  const body = { RequestInfo };
                  const searchRequest = { body, query, headers };
                  const searchResponse = await searchApiResponse(searchRequest);
                  //console.log("search response: "+JSON.stringify(searchResponse));
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
                    //console.log("Workflow TenantId",get(body.RequestInfo.userInfo.roles[index],"tenantId"));
                  }

                  const updateBody = { RequestInfo, FireNOCs };
                  const updateRequest = { body: updateBody,headers };
                  //console.log("update Request: "+JSON.stringify(updateRequest));
                  const updateResponse = await updateApiResponse(updateRequest, false);
                  //console.log("update Response: "+JSON.stringify(updateResponse));
                }
              }
            }
          } catch (error) {
            throw error;
          }
        };

        if(envVariables.KAFKA_TOPICS_RECEIPT_CREATE_REGEX.test(topic))
          FireNOCPaymentStatus(value);

        if(envVariables.KAFKA_TOPICS_FIRENOC_CREATE_SMS_REGEX.test(topic)){
          const { FireNOCs } = value;
          sendFireNOCSMSRequest(FireNOCs);
        }

        if(envVariables.KAFKA_TOPICS_FIRENOC_UPDATE_SMS_REGEX.test(topic)){
          const { FireNOCs } = value;
          sendFireNOCSMSRequest(FireNOCs);
        }

        if(envVariables.KAFKA_TOPICS_FIRENOC_WORKFLOW_SMS_REGEX.test(topic)){
          const { FireNOCs } = value;
          sendFireNOCSMSRequest(FireNOCs);
        }

      },
  })
}

run().catch(e => console.error(`[example/consumer] ${e.message}`, e))


export default consumer;