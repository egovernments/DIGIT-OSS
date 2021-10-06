import httpClient from "../config/httpClient";
import { addQueryArg } from "./index";
import envVariables from "../envVariables";

export const httpRequest = async ({
  hostURL,
  endPoint,
  queryObject = [],
  requestBody = {},
  headerBody = [],
  customRequestInfo = {}
}) => {
  let instance = httpClient(hostURL);
  let errorReponse = {};
  if (headerBody){
    headerBody[0]['tenantId']=headerBody[0].tenantid
    let headers = headerBody[0];
    instance.defaults = Object.assign(instance.defaults, {
      headers
    });
  }
    
  endPoint = addQueryArg(endPoint, queryObject);
  console.log("\ninstance.defaults"+JSON.stringify(instance.defaults)+"\n");
  try {
    // console.log("test");
    const response = await instance.post(endPoint, requestBody);
    // console.log("test 2");
    const responseStatus = parseInt(response.status, 10);
    if (responseStatus === 200 || responseStatus === 201) {
      return response.data;
    }
  } catch (error) {
    errorReponse = error.response;
     // console.log("test 1");
  }

  // console.log("test -",JSON.stringify(error));
  // console.log("error from api utils:", errorReponse);
  throw errorReponse;
};
