import axios from "axios";
import {
  fetchFromLocalStorage,
  addQueryArg
} from "egov-ui-framework/ui-utils/commons";
import store from "../ui-redux/store";
import { toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getAccessToken,
  getTenantId,
  getLocale
} from "egov-ui-kit/utils/localStorageUtils";

const instance = axios.create({
  baseURL: window.location.origin,
  headers: {
    "Content-Type": "application/json"
  }
});

const userInfo = {
  id: 23986,
  userName: "8275218816",
  salutation: null,
  name: "asdad",
  gender: "MALE",
  mobileNumber: "8275218816",
  emailId: "asd@gmail.com",
  altContactNumber: "0727222222",
  pan: "",
  aadhaarNumber: null,
  permanentAddress: "aa,a,a,a",
  permanentCity: "a",
  permanentPinCode: "443121",
  correspondenceAddress: "asd",
  correspondenceCity: null,
  correspondencePinCode: null,
  addresses: [
    {
      pinCode: "443121",
      city: "a",
      address: "aa,a,a,a",
      type: "PERMANENT",
      id: 47740,
      tenantId: "pb",
      userId: 23986,
      addressType: "PERMANENT",
      lastModifiedDate: null,
      lastModifiedBy: null
    },
    {
      pinCode: null,
      city: null,
      address: "asd",
      type: "CORRESPONDENCE",
      id: 52782,
      tenantId: "pb",
      userId: 23986,
      addressType: "CORRESPONDENCE",
      lastModifiedDate: null,
      lastModifiedBy: null
    }
  ],
  active: true,
  locale: null,
  type: "CITIZEN",
  accountLocked: false,
  accountLockedDate: 0,
  fatherOrHusbandName: "s",
  signature: null,
  bloodGroup: null,
  photo: null,
  identificationMark: null,
  createdBy: 23985,
  lastModifiedBy: 1,
  tenantId: "pb",
  roles: [
    {
      code: "CITIZEN",
      name: "Citizen",
      tenantId: "pb"
    }
  ],
  uuid: "6fe8fb27-3f4b-473f-8279-ae8cff4173f4",
  createdDate: "28-08-2018 17:02:32",
  lastModifiedDate: "29-11-2019 15:51:30",
  dob: "11/11/2001",
  pwdExpiryDate: "07-12-2018 22:32:00"
};

const wrapRequestBody = (requestBody, action, customRequestInfo) => {
  const authToken = getAccessToken();
  let RequestInfo = {
    apiId: "Rainmaker",
    ver: ".01",
    // ts: getDateInEpoch(),
    action: action,
    did: "1",
    key: "",
    msgId: `20170310130900|${getLocale()}`,
    requesterId: "",
    authToken,
    userInfo
  };
  RequestInfo = { ...RequestInfo, ...customRequestInfo };
  return Object.assign(
    {},
    {
      RequestInfo
    },
    requestBody
  );
};

export const httpRequest = async (
  method = "get",
  endPoint,
  action,
  queryObject = [],
  requestBody = {},
  headers = [],
  customRequestInfo = {}
) => {
  store.dispatch(toggleSpinner());
  let apiError = "Api Error";

  if (headers)
    instance.defaults = Object.assign(instance.defaults, {
      headers
    });

  endPoint = addQueryArg(endPoint, queryObject);
  var response;
  try {
    switch (method) {
      case "post":
        response = await instance.post(
          endPoint,
          wrapRequestBody(requestBody, action, customRequestInfo)
        );
        break;
      default:
        response = await instance.get(endPoint);
    }
    const responseStatus = parseInt(response.status, 10);
    store.dispatch(toggleSpinner());
    if (responseStatus === 200 || responseStatus === 201) {
      return response.data;
    }
  } catch (error) {
    const { data, status } = error.response;
    if (status === 400 && data === "") {
      apiError = "INVALID_TOKEN";
    } else {
      apiError =
        (data.hasOwnProperty("Errors") &&
          data.Errors &&
          data.Errors.length &&
          data.Errors[0].message) ||
        (data.hasOwnProperty("error") &&
          data.error.fields &&
          data.error.fields.length &&
          data.error.fields[0].message) ||
        (data.hasOwnProperty("error_description") && data.error_description) ||
        apiError;
    }
    store.dispatch(toggleSpinner());
  }
  // unhandled error
  throw new Error(apiError);
};

export const loginRequest = async (username = null, password = null) => {
  let apiError = "Api Error";
  try {
    // api call for login
    alert("Logged in");
    return;
  } catch (e) {
    apiError = e.message;
    // alert(e.message);
  }

  throw new Error(apiError);
};

export const logoutRequest = async () => {
  let apiError = "Api Error";
  try {
    alert("Logged out");
    return;
  } catch (e) {
    apiError = e.message;
    // alert(e.message);
  }

  throw new Error(apiError);
};
