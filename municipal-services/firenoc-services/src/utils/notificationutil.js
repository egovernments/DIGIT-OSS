const kafka = require("kafka-node");
import envVariables from "../envVariables";
// import producer from "./producer";
import { httpRequest } from "./api";
import set from "lodash/set";
import get from "lodash/get";


const fetchChannelList = async  (RequestInfo,tenantId,moduleName) => {
try{
    // console.log("inside here!")
var uri = envVariables.EGOV_MDMS_HOST + envVariables.EGOV_MDMS_CONTEXT_PATH+envVariables.EGOV_MDMS_SEARCH_ENPOINT;
let map = [];

if(tenantId == null)
return map;

var mdmsCriteriaReq = getMdmsRequestForChannelList(RequestInfo, tenantId.split(".")[0]);
// console.log("1   "+JSON.stringify(mdmsCriteriaReq))
console.log("1 ")


const mdmsResponse = await mdmsCall(mdmsCriteriaReq)
// mdmsResponse.then(mdmsResponse => data = mdmsResponse);

console.log("2"+JSON.stringify(mdmsResponse))

const channelList = get(mdmsResponse, "MdmsRes.Channel.channelList");
console.log("4.    "+JSON.stringify(channelList))

// for(var list of channelList)
// {
//   map.push(get(list,"action"),get(list,"channelNames"));
// }

// mdmsResponse.then(mdmsResponse => console.log(mdmsResponse));

// var data_filter = mdmsResponse.filter( element => element.MODULENAME == moduleName)
// console.log("3"+data_filter);
// for(var obj: data_filter)
// 	{
// 		map.put(obj.get(ACTION),obj.get(CHANNEL_NAMES));
// 		}
// 		return map;

}
 catch (error) {
  throw error;
}
};

const mdmsCall = async (mdmsCriteriaReq) =>
{
 var response =  await httpRequest({
    hostURL: envVariables.EGOV_MDMS_HOST,
    endPoint: `${envVariables.EGOV_MDMS_CONTEXT_PATH}${
      envVariables.EGOV_MDMS_SEARCH_ENPOINT}`,
      requestBody:  mdmsCriteriaReq
    });

    console.log("3.   Response   "+JSON.stringify(response));

//     var data = await response.json();
// console.log("4. data  "+data);
    // return JSON.stringify(response);
    return response;
}
//   myMap.forEach((value, key) => {
//     console.log(value, key)
// })


const getMdmsRequestForChannelList = (requestInfo ,tenantId) => {

const mdmsCriteriaReqBody = {
    "RequestInfo": requestInfo,
    "MdmsCriteria": {
        "tenantId": tenantId,
        "moduleDetails": [
          {
            "moduleName": "Channel",
            "masterDetails": [
              {
                "name": "channelList",
                "filter": null
              }
            ]
          }
        ]
      }
  };

return mdmsCriteriaReqBody;
};

export default fetchChannelList;
// fetchChannelList(RequestInfo,"pb.amritsar","TL")

