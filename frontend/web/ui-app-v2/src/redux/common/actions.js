import * as actionTypes from "./actionTypes";
import { httpRequest } from "utils/api";
import { EMPLOYEE, CITIZEN, MDMS } from "utils/endPoints";

export const setDropDownData = (key, payload) => {
  return { type: actionTypes.SET_DROPDOWN_DATA, key, payload };
};

const employeeFetchSuccess = (payload) => {
  return {
    type: actionTypes.EMPLOYEE_FETCH_SUCCESS,
    payload,
  };
};

const employeeFetchError = (error) => {
  return {
    type: actionTypes.EMPLOYEE_FETCH_ERROR,
    error,
  };
};

const citizenFetchSuccess = (payload) => {
  return {
    type: actionTypes.CITIZEN_FETCH_SUCCESS,
    payload,
  };
};

const citizenFetchError = (error) => {
  return {
    type: actionTypes.CITIZEN_FETCH_ERROR,
    error,
  };
};

const MDMSFetchSuccess = (payload) => {
  return {
    type: actionTypes.MDMS_FETCH_SUCCESS,
    payload,
  };
};

const MDMSFetchError = (error) => {
  return {
    type: actionTypes.MDMS_FETCH_ERROR,
    error,
  };
};

export const fetchEmployees = (requestBody) => {
  return async (dispatch) => {
    try {
      const payload = await httpRequest(EMPLOYEE.GET.URL, EMPLOYEE.GET.ACTION,requestBody);
      dispatch(employeeFetchSuccess(payload));
    } catch (error) {
      dispatch(employeeFetchError(error.message));
    }
  };
};

export const fetchCitizens = (requestBody=[],requestParams=[]) => {
  return async (dispatch) => {
    try {
      const payload = await httpRequest(CITIZEN.GET.URL, CITIZEN.GET.ACTION, requestParams, requestBody);
      dispatch(citizenFetchSuccess(payload));
    } catch (error) {
      dispatch(citizenFetchError(error.message));
    }
  };
};

export const fetchMDMSData = (requestBody) => {
  return async (dispatch) => {
    try {
      const payload = await httpRequest(MDMS.GET.URL, MDMS.GET.ACTION, [], requestBody);
      dispatch(MDMSFetchSuccess(payload));
    } catch (error) {
      dispatch(MDMSFetchError(error.message));
    }
  };
};
