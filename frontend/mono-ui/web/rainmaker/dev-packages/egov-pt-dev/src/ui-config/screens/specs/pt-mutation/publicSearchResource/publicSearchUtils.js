import { httpRequest } from "egov-ui-framework/ui-utils/api";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
  toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { getSearchBillResult } from "../../../../../ui-utils/commons";

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
    "components.div.children.searchPropertyDetails.children.cardContent.children.searchPropertyContainer.children.propertyID",
};

export const applyMohallaData = (mohallaData, tenantId, dispatch) => {
  dispatch(
    prepareFinalObject("applyScreenMdmsData.tenant.localities", mohallaData)
  );
  dispatch(
    handleField(
      "public-search",
      ComponentJsonPath.locality,
      "props.data",
      mohallaData
      // payload.TenantBoundary && payload.TenantBoundary[0].boundary
    )
  );
  dispatch(
    handleField("public-search", ComponentJsonPath.locality, "props.value", "")
  );
  dispatch(
    handleField("public-search", ComponentJsonPath.locality, "props.error", false)
  );
  dispatch(
    handleField("public-search", ComponentJsonPath.locality, "isFieldValid", true)
  );
  dispatch(
    handleField("public-search", ComponentJsonPath.locality, "props.errorMessage", "")
  );
  dispatch(
    handleField("public-search", ComponentJsonPath.locality, "props.helperText", "")
  );
  dispatch(
    handleField("public-search", ComponentJsonPath.ulbCity, "props.helperText", "")
  );
  dispatch(
    handleField("public-search", ComponentJsonPath.ulbCity, "props.error", false)
  );
  dispatch(
    handleField("public-search", ComponentJsonPath.ulbCity, "props.isFieldValid", true)
  );
  dispatch(prepareFinalObject("searchScreen.locality.code", ""));
  const mohallaLocalePrefix = {
    moduleName: tenantId,
    masterName: "REVENUE",
  };
  dispatch(
    handleField(
      "public-search",
      ComponentJsonPath.locality,
      "props.localePrefix",
      mohallaLocalePrefix
    )
  );
};

export const getSearchResults = async (requestPayload) => {
  const PUBLIC_SEARCH = {
    GET: {
      URL: "egov-searcher/property-services/propertyopensearch/_get",
      ACTION: "_get",
    },
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

export const getPayload = (searchScreenObject) => {
  let querryObject = [];
  if (searchScreenObject) {
    if (searchScreenObject.ownerName) {
      querryObject.push({
        key: "name",
        value: searchScreenObject.ownerName,
      });
    }
    if (searchScreenObject.mobileNumber) {
      querryObject.push({
        key: "mobileNumber",
        value: searchScreenObject.mobileNumber,
      });
    }
    if (searchScreenObject.ids) {
      querryObject.push({ key: "propertyIds", value: searchScreenObject.ids });
    }
    if (searchScreenObject.locality) {
      querryObject.push({
        key: "locality",
        value: searchScreenObject.locality.code,
      });
    }
    if (searchScreenObject.tenantId) {
      querryObject.push({
        key: "tenantId",
        value: searchScreenObject.tenantId,
      });
    }
  }
  return querryObject;
};

export const getTenantName = (tenantId, state) => {
  const cityObject = get(state.common, "cities", []);
  if (cityObject && cityObject.length > 0) {
    return cityObject[
      cityObject.findIndex((item) => item.key.indexOf(tenantId) !== -1)
    ].name;
  }
};

export const fetchBill = async (
  dispatch,
  response,
  tenantId,
  billBusinessService
) => {
  const consumerCodes = [];
  response.Properties.map((item) => {
    consumerCodes.push(item.propertyId);
  });
  const billData = await generateBill(
    dispatch,
    consumerCodes,
    tenantId,
    billBusinessService
  );
  return billData;
};

export const generateBill = async (
  dispatch,
  consumerCodes,
  tenantId,
  businessService
) => {
  try {
    if (consumerCodes && consumerCodes.length > 0 && tenantId) {
      const queryObj = [
        {
          key: "tenantId",
          value: tenantId,
        },
      ];
      queryObj.push({
        key: "consumerCode",
        value: consumerCodes.join(","),
      });
      if (businessService) {
        queryObj.push({
          key: "businessService",
          value: businessService,
        });
      }
      const payload = await getSearchBillResult(queryObj, dispatch);
      return payload;
    }
  } catch (e) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: e.message, labelKey: e.message },
        "error"
      )
    );
    console.log(e);
  }
};

export const getBill = async (queryObject, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/billing-service/bill/v2/_fetchbill",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    console.log(error, "fetxh");
  }
};

export const getPropertyWithBillAmount = (propertyResponse, billResponse) => {
  try {
    if(billResponse && billResponse.Bill && billResponse.Bill.length > 0) {
      propertyResponse.Properties.map((item, key) => {
        billResponse.Bill.map(bill => {
          if(bill.consumerCode === item.propertyId) {
            propertyResponse.Properties[key].totalAmount = bill.totalAmount;
          }
        });
      });
      return propertyResponse;
    } else {
      return propertyResponse;
    }
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    console.log(error, "Bill Error");
  }
}