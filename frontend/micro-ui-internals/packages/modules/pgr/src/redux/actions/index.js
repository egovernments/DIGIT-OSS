import { FETCH_LOCALITIES } from "./types";
import { LocalizationService } from "../../@egovernments/digit-utils/services/Localization/service";
import { LocationService } from "../../@egovernments/digit-utils/services/Location";
import { LocalityService } from "../../@egovernments/digit-utils/services/Localities";

export const fetchLocalities = (city) => async (dispatch, getState) => {
  city = city.toLowerCase();
  const { stateInfo } = getState();
  let response = await LocationService.getLocalities({ tenantId: `${stateInfo.code}.${city}` });
  let localityList = LocalityService.get(response.TenantBoundary[0]);
  dispatch({
    type: FETCH_LOCALITIES,
    payload: { localityList },
  });
};

//on language change update localization resource with language selected(i18n store)
export const updateLocalizationResources = () => async (dispatch, getState) => {
  let city = "amritsar"; // TODO: fetch it from store
  const lng = getState().currentLanguage.language || "en";
  await LocalizationService.getLocale({ modules: [`rainmaker-pb.${city}`], locale: lng, tenantId: `pb.${city}` });
  await LocalizationService.getLocale({ modules: ["rainmaker-common", "rainmaker-pgr"], locale: lng, tenantId: "pb" });
};
