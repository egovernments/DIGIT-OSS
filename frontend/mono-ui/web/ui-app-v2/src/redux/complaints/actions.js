import * as actionTypes from "./actionTypes";
import * as commonActions from "../common/actions";
import { COMPLAINT, CATEGORY } from "utils/endPoints";
import { httpRequest } from "utils/api";
import { difference, uniq } from "lodash";
import commonConfig from "config/common.js";

//checking users there in action history
const checkUsers = (dispatch, state, actionHistory, hasUsers) => {
  if (hasUsers) {
    let employeeIds = [],
      userIds = [];
    actionHistory.forEach((actions) => {
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
    let { common } = state;
    if (employeeIds.length > 0) {
      let cachedEmployeeIds = [];
      if (common && common.employeeById) {
        cachedEmployeeIds = Object.keys(common.employeeById);
      }
      let value = uniq(difference(employeeIds, cachedEmployeeIds)).join(",");
      if (value.length) dispatch(commonActions.fetchEmployees([{ key: "id", value }]));
    }
    if (userIds.length > 0) {
      let cachedUserIds = [];
      if (common && common.citizenById) {
        cachedUserIds = Object.keys(common.citizenById);
      }
      let id = uniq(difference(userIds, cachedUserIds));
      if (id.length) dispatch(commonActions.fetchCitizens({ tenantId: localStorage.getItem("tenant-id"), id }));
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

const complaintFetchComplete = (payload) => {
  return {
    type: actionTypes.COMPLAINTS_FETCH_COMPLETE,
    payload,
  };
};

const complaintFetchError = (error) => {
  return {
    type: actionTypes.COMPLAINTS_FETCH_ERROR,
    error,
  };
};

export const fetchComplaints = (queryObject, hasUsers = true) => {
  return async (dispatch, getState) => {
    dispatch(complaintFetchPending());
    try {
      const payload = await httpRequest(COMPLAINT.GET.URL, COMPLAINT.GET.ACTION, queryObject);
      checkUsers(dispatch, getState(), payload.actionHistory, hasUsers);
      dispatch(complaintFetchComplete(payload));
    } catch (error) {
      dispatch(complaintFetchError(error.message));
    }
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
