import {
  APPLY_FILTER,
  APPLY_INBOX_FILTER,
  FETCH_BUSINESS_SERVICE_BY_ID,
  FETCH_COMPLAINTS,
  FETCH_LOCALITIES,
  UPDATE_COMPLAINT,
  FETCH_ALL_BUSINESSS_SERVICES,
} from "./types";
//import { LocalizationService } from "../../@egovernments/digit-utils/services/Localization/service";
//import { LocationService } from "../../@egovernments/digit-utils/services/Location";
//import { LocalityService } from "../../@egovernments/digit-utils/services/Localities";
import createComplaint from "./complaint";

export const fetchLocalities = (city) => async (dispatch, getState) => {
  city = city.toLowerCase();
  const { stateInfo } = getState();
  let response = await Digit.LocationService.getLocalities(`${stateInfo.code}.${city}`);
  let localityList = Digit.LocalityService.get(response.TenantBoundary[0]);
  dispatch({
    type: FETCH_LOCALITIES,
    payload: { localityList },
  });
};

export const updateComplaints = (data) => async (dispatch) => {
  let ServiceWrappers = await Digit.PGRService.update(data);

  dispatch({
    type: UPDATE_COMPLAINT,
    payload: ServiceWrappers,
  });
};

export const fetchBusinessServiceByTenant = (tenantId, businessServices) => async (dispatch) => {
  const businessServiceResponse = await Digit.WorkflowService.init(tenantId, businessServices);
  const businessService = businessServiceResponse.BusinessServices;
  dispatch({
    type: FETCH_ALL_BUSINESSS_SERVICES,
    payload: { businessService },
  });
};

export const applyInboxFilters = (filters) => async (dispatch) => {
  let response = await Digit.PGRService.inboxFilter(filters);
  dispatch({
    type: APPLY_INBOX_FILTER,
    payload: { response },
  });
};

export { createComplaint };
