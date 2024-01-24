import envVariables from "../envVariables";
import { httpRequest } from "../utils/api";

export const searchUser = async (requestInfo, userSearchReqCriteria, header) => {
  let requestBody = { RequestInfo: requestInfo, ...userSearchReqCriteria };

  let headers;
  var isCentralInstance  = envVariables.IS_ENVIRONMENT_CENTRAL_INSTANCE;
  if(typeof isCentralInstance =="string")
  isCentralInstance = (isCentralInstance.toLowerCase() == "true");

  if(isCentralInstance){
    header['tenantId']=header.tenantid;
  }
  else{
    header['tenantId'] = userSearchReqCriteria.tenantId;
  }


  headers = header;



  var userSearchResponse = await httpRequest({
    hostURL: `${envVariables.EGOV_USER_HOST}`,
    endPoint: `${envVariables.EGOV_USER_CONTEXT_PATH}${
      envVariables.EGOV_USER_SEARCH_ENDPOINT
    }`,
    requestBody,
    headers
  });
  //console.log("User search response: "+JSON.stringify(userSearchResponse));

  var dobFormat = "yyyy-MM-dd";
  userSearchResponse = parseResponse(userSearchResponse, dobFormat);
  // console.log(userSearchResponse);
  //console.log("User search response: "+JSON.stringify(userSearchResponse));
  return userSearchResponse;
};

export const createUser = async (requestInfo, user, header, tenantId) => {
  let requestBody = { RequestInfo: requestInfo, user: user };

  let headers;
  var isCentralInstance  = envVariables.IS_ENVIRONMENT_CENTRAL_INSTANCE;
  if(typeof isCentralInstance =="string")
  isCentralInstance = (isCentralInstance.toLowerCase() == "true");

  if(isCentralInstance){
    header['tenantId']=header.tenantid;
  }
  else
    header['tenantId']= tenantId;

  headers = header;

  user.dob=dobConvetion(user.dob);
  var userCreateResponse = await httpRequest({
    hostURL: envVariables.EGOV_USER_HOST,
    endPoint: `${envVariables.EGOV_USER_CONTEXT_PATH}${
      envVariables.EGOV_USER_CREATE_ENDPOINT
    }`,
    requestBody,
    headers
  });

  var dobFormat = "dd/MM/yyyy";
  userCreateResponse = parseResponse(userCreateResponse, dobFormat);

  return userCreateResponse;
};

export const updateUser = async (requestInfo, user, header, tenantId) => {
  // console.log(user);
  let headers;
  var isCentralInstance  = envVariables.IS_ENVIRONMENT_CENTRAL_INSTANCE;
  if(typeof isCentralInstance =="string")
  isCentralInstance = (isCentralInstance.toLowerCase() == "true");

  if(isCentralInstance){
    header['tenantId']=header.tenantid;
  }
  else
    header['tenantId'] = tenantId;

  headers = header;

  user.dob=dobConvetion(user.dob);
  // console.info(user.dob);
  let requestBody = { RequestInfo: requestInfo, user: user };
  var userUpdateResponse = await httpRequest({
    hostURL: envVariables.EGOV_USER_HOST,
    endPoint: `${envVariables.EGOV_USER_CONTEXT_PATH}${
      envVariables.EGOV_USER_UPDATE_ENDPOINT
    }`,
    requestBody,
    headers
  });

  var dobFormat = "yyyy-MM-dd";
  userUpdateResponse = parseResponse(userUpdateResponse, dobFormat);

  return userUpdateResponse;
};

const parseResponse = (userResponse, dobFormat) => {
  var format1 = "dd-MM-yyyy HH:mm:ss";
  userResponse.user &&
    userResponse.user.map(user => {
      user.createdDate =
        user.createdDate && dateToLong(user.createdDate, format1);
      user.lastModifiedDate =
        user.lastModifiedDate && dateToLong(user.lastModifiedDate, format1);
      user.dob = user.dob && dateToLong(user.dob, dobFormat);
      user.pwdExpiryDate =
        user.pwdExpiryDate && dateToLong(user.pwdExpiryDate, format1);
    });
  return userResponse;
};

const dateToLong = (date, format) => {
  var epoch = null;
  var formattedDays = null;

  switch (format) {
    case "dd-MM-yyyy HH:mm:ss":
      formattedDays = date.split(/\D+/);
      epoch = new Date(
        formattedDays[2],
        formattedDays[1] - 1,
        formattedDays[0],
        formattedDays[3],
        formattedDays[4],
        formattedDays[5]
      );
      break;
    case "yyyy-MM-dd":
      formattedDays = date.split("-");
      epoch = new Date(
        formattedDays[0],
        formattedDays[1] - 1,
        formattedDays[2]
      );

      break;
    case "dd/MM/yyyy":
      formattedDays = date.split("/");
      epoch = new Date(
        formattedDays[2],
        formattedDays[1] - 1,
        formattedDays[0]
      );

      break;
  }
  return epoch.getTime();
};

const dobConvetion=(date)=>{
  return typeof(date)=="string"?date.split("-").reverse().join("/"):date;
}

export default { searchUser, createUser, updateUser };
