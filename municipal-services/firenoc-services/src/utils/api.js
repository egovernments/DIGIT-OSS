import httpClient from "../config/httpClient";
import { addQueryArg } from "./index";
import envVariables from "../envVariables";

export const httpRequest = async ({
  hostURL,
  endPoint,
  queryObject = [],
  requestBody = {},
  headers = [],
  customRequestInfo = {}
}) => {
  let instance = httpClient(hostURL);
  let errorReponse = {};
  if (headers){
    headers[0]['tenantId']=headers[0].tenantid
    let header = headers[0];
    instance.defaults = Object.assign(instance.defaults, {
      header
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
