import * as commonTypes from "./actionTypes";
import { transformById } from "utils/commons";

const intialState = {
  dropDownData: {},
};

const commonReducer = (state = intialState, action) => {
  switch (action.type) {
    case commonTypes.SET_DROPDOWN_DATA:
      return {
        ...state,
        dropDownData: {
          ...state.dropDownData,
          [action.key]: action.payload,
        },
      };
    case commonTypes.EMPLOYEE_FETCH_SUCCESS:
      let employeeById = transformById(action.payload.Employee, "id");
      return {
        ...state,
        loading: false,
        employeeById: {
          ...state.employeeById,
          ...employeeById,
        },
      };
    case commonTypes.EMPLOYEE_FETCH_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
        errorMessage: action.error,
      };
    case commonTypes.CITIZEN_FETCH_SUCCESS:
      let citizenById = transformById(action.payload.user, "id");
      return {
        ...state,
        loading: false,
        citizenById: {
          ...state.citizenById,
          ...citizenById,
        },
      };
    case commonTypes.CITIZEN_FETCH_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
        errorMessage: action.error,
      };
    case commonTypes.MDMS_FETCH_SUCCESS:
      let departmentsById = transformById(action.payload.MdmsRes["common-masters"].Department, "code");
      let designationsById = transformById(action.payload.MdmsRes["common-masters"].Designation, "code");
      const cities = action.payload.MdmsRes["tenant"]["tenants"].map((item) => {
        return {
          key: item.code,
          text: item.city.name,
          ...item,
        };
      });
      return {
        ...state,
        loading: false,
        departmentById: {
          ...state.departmentsById,
          ...departmentsById,
        },
        designationsById: {
          ...state.designationsById,
          ...designationsById,
        },
        cities: [...cities],
      };
    case commonTypes.MDMS_FETCH_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
        errorMessage: action.error,
      };
    default:
      return state;
  }
};
export default commonReducer;
