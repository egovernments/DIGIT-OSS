import { httpRequest } from "egov-ui-framework/ui-utils/api";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";

export const applyMohallaData = (mohallaData, tenantId, dispatch) => {
  dispatch(
    prepareFinalObject("applyScreenMdmsData.tenant.localities", mohallaData)
  );
  dispatch(
    handleField(
      "public-search",
      "components.div.children.searchPropertyDetails.children.cardContent.children.searchPropertyContainer.children.locality",
      "props.data",
      mohallaData
      // payload.TenantBoundary && payload.TenantBoundary[0].boundary
    )
  );
  const mohallaLocalePrefix = {
    moduleName: tenantId,
    masterName: "REVENUE"
  };
  dispatch(
    handleField(
      "public-search",
      "components.div.children.searchPropertyDetails.children.cardContent.children.searchPropertyContainer.children.locality",
      "props.localePrefix",
      mohallaLocalePrefix
    )
  );
};

export const ComponentJsonPath = {
  ulbCity:
    "components.div.children.searchPropertyDetails.children.cardContent.children.searchPropertyContainer.children.ulbCity",
  locality:
    "components.div.children.searchPropertyDetails.children.cardContent.children.searchPropertyContainer.children.locality",
  ownerName:
    "components.div.children.searchPropertyDetails.children.cardContent.children.searchPropertyContainer.children.ownerName",
  ownerMobNo:
    "components.div.children.searchPropertyDetails.children.cardContent.children.searchPropertyContainer.children.ownerMobNo",
  propertyID:
    "components.div.children.searchPropertyDetails.children.cardContent.children.searchPropertyContainer.children.propertyID"
};

export const getSearchResults = async requestPayload => {
  const PUBLIC_SEARCH = {
    GET: {
      URL: "egov-searcher/property-services/propertyopensearch/_get",
      ACTION: "_get"
    }
  };
  const searchResponse = await httpRequest(
    "post",
    PUBLIC_SEARCH.GET.URL,
    PUBLIC_SEARCH.GET.ACTION,
    [],
    { searchCriteria: requestPayload }
  );
  return searchResponse;
};

export const getPayload = searchScreenObject => {
  const requestPayload = {
    ownerName: searchScreenObject.ownerName,
    mobileNumber: searchScreenObject.mobileNumber,
    propertyId: searchScreenObject.ids,
    locality: searchScreenObject.locality.code,
    tenantId: searchScreenObject.tenantId
  };
  return requestPayload;
};

export const getTenantName = (tenantId, state) => {
  const cityObject = get(state.common, "cities", []);
  if(cityObject && cityObject.length > 0) {
	return cityObject[cityObject.findIndex(item =>item.key.indexOf(tenantId) !== -1)].name;
  }
};
