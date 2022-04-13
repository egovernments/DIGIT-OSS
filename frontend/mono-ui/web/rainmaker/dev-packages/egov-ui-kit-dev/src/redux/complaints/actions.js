import * as actionTypes from "./actionTypes";
import * as commonActions from "../common/actions";
import { COMPLAINT, CATEGORY } from "egov-ui-kit/utils/endPoints";
import { httpRequest } from "egov-ui-kit/utils/api";
import difference from "lodash/difference";
import uniq from "lodash/uniq";
import commonConfig from "config/common.js";
import { getUserInfo, getTenantId } from "egov-ui-kit/utils/localStorageUtils";

import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";

//checking users there in action history
const checkUsers = (dispatch, state, actionHistory, hasUsers, tenantId) => {
  if (hasUsers) {
    let employeeIds = [],
      userIds = [];
    actionHistory.forEach((actions) => {
      actions &&
        actions.actions &&
        actions.actions.forEach((action) => {
          if (action.by) {
            let { userId, employeeId } = getUserEmployeeId(action.by);
            if (userId) userIds.push(userId);
            if (employeeId) employeeIds.push(employeeId);
          }
          if (action.assignee) {
            let { userId, employeeId } = getUserEmployeeId(action.assignee);
            if (userId) userIds.push(userId);
            if (employeeId) employeeIds.push(employeeId);
          }
        });
    });
    let { common, auth } = state;
    if (employeeIds.length > 0) {
      let cachedEmployeeIds = [];
      if (common && common.employeeById) {
        cachedEmployeeIds = Object.keys(common.employeeById);
      }
      let value =
        uniq(difference(employeeIds, cachedEmployeeIds)).indexOf(auth.userInfo.id) === -1 && auth.userInfo.type !== "CITIZEN"
          ? [...uniq(difference(employeeIds, cachedEmployeeIds)), auth.userInfo.id].join(",")
          : [...uniq(difference(employeeIds, cachedEmployeeIds))].join(",");
      const queryObject = tenantId
        ? [
            { key: "tenantId", value: tenantId },
            { key: "ids", value },
          ]
        : [{ key: "ids", value }];
      if (value.length) dispatch(commonActions.fetchEmployees(queryObject));
    }
    if (userIds.length > 0) {
      let cachedUserIds = [];
      if (common && common.citizenById) {
        cachedUserIds = Object.keys(common.citizenById);
      }
      let id =
        uniq(difference(userIds, cachedUserIds)).indexOf(auth.userInfo.id) === -1 && auth.userInfo.type === "CITIZEN"
          ? [...uniq(difference(userIds, cachedUserIds)), auth.userInfo.id]
          : [...uniq(difference(userIds, cachedUserIds))];
      if (id.length)
        dispatch(commonActions.fetchCitizens({ tenantId: JSON.parse(getUserInfo()).tenantId, userName: JSON.parse(getUserInfo()).userName, id: id }));
    }
  }
};

//get user and employee id from action
const getUserEmployeeId = (user) => {
  const splitArray = user.split(":");
  const id = splitArray[0];
  const role = splitArray[1];
  if (role && role.toLowerCase() === "citizen") {
    return { userId: id };
  } else {
    return { employeeId: id };
  }
};

// complaint categories success
const complaintCategoriesFetchSucess = (payload) => {
  return {
    type: actionTypes.COMPLAINTS_CATEGORIES_FETCH_SUCCESS,
    payload,
  };
};

const complaintCategoriesFetchError = (error) => {
  return {
    type: actionTypes.COMPLAINTS_CATEGORIES_FETCH_ERROR,
    error,
  };
};

// complaints actions
const complaintFetchPending = () => {
  return {
    type: actionTypes.COMPLAINTS_FETCH_PENDING,
  };
};

const complaintFetchComplete = (payload, overWrite) => {
  return {
    type: actionTypes.COMPLAINTS_FETCH_COMPLETE,
    payload,
    overWrite: overWrite,
  };
};

const complaintSendSMS = (message) => {
  return {
    type: actionTypes.COMPLAINTS_SEND_MESSAGE,
    message,
  };
};

const complaintSendSMSTo = (message) => {
  return {
    type: actionTypes.COMPLAINTS_SEND_MESSAGE_SHARECONTENT_TO,
    message,
  };
};

const complaintSendSMSMedia = (message) => {
  return {
    type: actionTypes.COMPLAINTS_SEND_MESSAGE_SHAREMEDIA,
    message,
  };
};

const complaintFetchError = (error) => {
  return {
    type: actionTypes.COMPLAINTS_FETCH_ERROR,
    error,
  };
};

const complaintSortOrder = (order) => {
  return { type: actionTypes.COMPLAINTS_SORT_ORDER, order };
};

export const getComplaintDisplayOrder = (order) => {
  return async (dispatch, getState) => {
    dispatch(complaintSortOrder(order));
  };
};

export const fetchComplaints = (queryObject, hasUsers = true, overWrite) => {
  return async (dispatch, getState) => {
    dispatch(complaintFetchPending());
    try {
      let tenantId = "";
      if (queryObject && queryObject.length) {
        let isTenantId = true;
        queryObject.forEach(obj => {
          if (obj.key === "tenantId") {
            isTenantId = false
          }
        })
        if (isTenantId) {
          queryObject.push({ key: "tenantId", value: getTenantId() })
        }
      }

      if (queryObject && queryObject.length == 0) {
        queryObject.push({ key: "tenantId", value: getTenantId() })
      }
      
      const payload = await httpRequest(COMPLAINT.GET.URL, COMPLAINT.GET.ACTION, queryObject);
      if (payload.services && payload.services.length === 1) {
        tenantId = payload.services[0].tenantId;
      }
      checkUsers(dispatch, getState(), payload.actionHistory, hasUsers, tenantId);
      dispatch(complaintFetchComplete(payload, overWrite));
    } catch (error) {
      dispatch(complaintFetchError(error.message));
      dispatch(
        toggleSnackbarAndSetText(
          true,
          {
            labelKey: error.message,
            labelName: error.message,
          },
          "error"
        )
      );
    }
  };
};

export const sendMessage = (message) => {
  return async (dispatch, getState) => {
    dispatch(complaintSendSMS(message));
  };
};

export const sendMessageTo = (message) => {
  return async (dispatch, getState) => {
    dispatch(complaintSendSMSTo(message));
  };
};

export const sendMessageMedia = (message) => {
  return async (dispatch, getState) => {
    dispatch(complaintSendSMSMedia(message));
  };
};

export const fetchComplaintCategories = () => {
  //Fetching Complaint Categories from MDMS
  let requestBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "RAINMAKER-PGR",
          masterDetails: [
            {
              name: "ServiceDefs",
            },
          ],
        },
      ],
    },
  };

  return async (dispatch) => {
    try {
      const payload = await httpRequest(CATEGORY.GET.URL, CATEGORY.GET.ACTION, [], requestBody);
      dispatch(complaintCategoriesFetchSucess(payload));
    } catch (error) {
      dispatch(complaintCategoriesFetchError(error.message));
    }
  };
};
