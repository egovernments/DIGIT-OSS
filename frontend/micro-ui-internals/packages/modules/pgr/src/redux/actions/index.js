import { APPLY_FILTER, APPLY_INBOX_FILTER, FETCH_BUSINESS_SERVICE_BY_ID, FETCH_COMPLAINTS, FETCH_LOCALITIES, UPDATE_COMPLAINT } from "./types";
//import { LocalizationService } from "../../@egovernments/digit-utils/services/Localization/service";
//import { LocationService } from "../../@egovernments/digit-utils/services/Location";
//import { LocalityService } from "../../@egovernments/digit-utils/services/Localities";
import createComplaint from "./complaint";

export const fetchLocalities = (city) => async (dispatch, getState) => {
  city = city.toLowerCase();
  const { stateInfo } = getState();
  let response = await Digit.LocationService.getLocalities({ tenantId: `${stateInfo.code}.${city}` });
  let localityList = Digit.LocalityService.get(response.TenantBoundary[0]);
  console.log("get localityList:", localityList);
  dispatch({
    type: FETCH_LOCALITIES,
    payload: { localityList },
  });
};

export const updateComplaints = (data) => async (dispatch, getState) => {
  const { cityCode } = getState();
  let ServiceWrappers = await Digit.PGRService.update(data, cityCode);

  dispatch({
    type: UPDATE_COMPLAINT,
    payload: ServiceWrappers,
  });
};

//on language change update localization resource with language selected(i18n store)
export const updateLocalizationResources = () => async (dispatch, getState) => {
  let city = "amritsar"; // TODO: fetch it from store
  const lng = getState().currentLanguage.language || "en";
  await Digit.LocalizationService.getLocale({ modules: [`rainmaker-pb.${city}`], locale: lng, tenantId: `pb.${city}` });
  await Digit.LocalizationService.getLocale({ modules: ["rainmaker-common", "rainmaker-pgr"], locale: lng, tenantId: "pb" });
};

export const searchComplaints = (filters = {}) => async (dispatch, getState) => {
  const { cityCode } = getState();

  let { ServiceWrappers } = await Digit.PGRService.search(`${cityCode}`, filters);
  dispatch({
    type: FETCH_COMPLAINTS,
    payload: { complaints: ServiceWrappers },
  });
};

export const fetchBusinessServiceById = (businessId) => async (dispatch, getState) => {
  const businessServiceDetails = await Digit.workflowService.getByBusinessId(getState().cityCode, businessId);
  dispatch({
    type: FETCH_BUSINESS_SERVICE_BY_ID,
    payload: { businessServiceDetails },
  });
};

export const applyInboxFilters = (filters) => async (dispatch) => {
  console.log("filters in action:", filters);
  let response = await Digit.PGRService.inboxFilter(filters);
  console.log("response>>", response);
  dispatch({
    type: APPLY_INBOX_FILTER,
    payload: { response },
  });
};

export { createComplaint };
