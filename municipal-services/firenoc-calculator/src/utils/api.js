import httpClient from "../config/httpClient";
import { addQueryArg } from "./index";

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
  if (headers)
    instance.defaults = Object.assign(instance.defaults, {
      headers
    });
  endPoint = addQueryArg(endPoint, queryObject);
  try {
    const response = await instance.post(endPoint, requestBody);
    const responseStatus = parseInt(response.status, 10);
    if (responseStatus === 200 || responseStatus === 201) {
      return response.data;
    }
  } catch (error) {
    errorReponse = error.response;
    throw errorReponse;
  }
  // console.log("error from api utils:", errorReponse);
};
