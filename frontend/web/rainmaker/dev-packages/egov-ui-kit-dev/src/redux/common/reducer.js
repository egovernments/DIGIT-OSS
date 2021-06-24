import * as commonTypes from "./actionTypes";
import { transformById, getTransformedDropdown } from "egov-ui-kit/utils/commons";
import set from "lodash/set";
import { commonActions } from "egov-ui-kit/utils/commons";

const intialState = {
  dropDownData: {},
  prepareFormData: {},
  spinner: false,
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
    case commonTypes.EMPLOYEE_FETCH_PENDING:
      return {
        ...state,
        loading: true,
        error: false,
        employeeFetchSuccess: false,
        errorMessage: "",
      };
    case commonTypes.EMPLOYEE_FETCH_SUCCESS:
      let employeeById = transformById(action.payload.Employees, "id");
      return {
        ...state,
        loading: false,
        employeeFetchSuccess: true,
        employeeById: {
          ...state.employeeById,
          ...employeeById,
        },
      };
    case commonTypes.EMPLOYEE_FETCH_ERROR:
      return {
        ...state,
        loading: false,
        employeeFetchSuccess: true,
        error: true,
        errorMessage: action.error,
      };

    case commonTypes.EMPLOYEE_TO_ASSIGN_FETCH_PENDING:
      return {
        ...state,
        loading: true,
        error: false,
        fetchEmployeeToAssignSuccess: false,
        errorMessage: "",
      };

    case commonTypes.EMPLOYEE_TO_ASSIGN_FETCH_SUCCESS:
      let employeeToAssignById = transformById(action.payload.Employees, "id");
      return {
        ...state,
        loading: false,
        fetchEmployeeToAssignSuccess: true,
        employeeToAssignById: {
          ...state.employeeToAssignById,
          ...employeeToAssignById,
        },
      };
    case commonTypes.EMPLOYEE_TO_ASSIGN_FETCH_ERROR:
      return {
        ...state,
        loading: false,
        fetchEmployeeToAssignSuccess: true,
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
      let stateInfoById = action.payload.MdmsRes["common-masters"].StateInfo;
      // transformById(action.payload.MdmsRes["common-masters"].StateInfo, "code");
      const citiesByModule = transformById(action.payload.MdmsRes["tenant"].citymodule, "code");
      const tenantInfo = action.payload.MdmsRes["tenant"]["tenantInfo"];
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
        stateInfoById,
        cities: [...cities],
        citiesByModule: citiesByModule,
        tenantInfo: tenantInfo,
      };
    case commonTypes.MDMS_FETCH_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
        errorMessage: action.error,
      };
    case commonTypes.PREPARE_FORM_DATA:
      return {
        ...state,
        prepareFormData: set(state.prepareFormData, action.jsonPath, action.value ? action.value : null),
      };

    case commonTypes.GENERAL_MDMS_FETCH_SUCCESS:
      const { masterArray, key } = action;
      const generalMDMSDataById = masterArray.reduce((result, masterName) => {
        result[masterName] = transformById(action.payload.MdmsRes[action.moduleName][masterName], key ? key : "code");
        return result;
      }, {});
      return {
        ...state,
        loading: false,
        generalMDMSDataById: getTransformedDropdown(generalMDMSDataById, ["PropertyType", "OwnerShipCategory", "UsageCategory"]),
      };

    case commonTypes.GENERAL_MDMS_FETCH_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
        errorMessage: action.error,
      };

    case commonTypes.TOGGLE_SPINNER:
      return {
        ...state,
        spinner: !state.spinner,
      };
    case commonTypes.SHOW_SPINNER:
      return {
        ...state,
        spinner: true,
      };

    case commonTypes.HIDE_SPINNER:
      return {
        ...state,
        spinner: false,
      };
    case commonTypes.PREPARE_FORM_DATA_FROM_DRAFT:
      return {
        ...state,
        prepareFormData: action.prepareFormData,
      };
    case commonTypes.FETCH_PGR_CONSTANTS:
      return {
        ...state,
        pgrContants: action.data,
      };
    default:
      return state;
  }
};
export default commonReducer;
