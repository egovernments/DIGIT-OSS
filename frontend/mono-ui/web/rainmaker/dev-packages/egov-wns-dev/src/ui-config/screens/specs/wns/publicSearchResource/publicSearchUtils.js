import { httpRequest } from "egov-ui-framework/ui-utils/api";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
  toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import store from "redux/store";
import { serviceConst } from "../../../../../ui-utils/commons";

export const ComponentJsonPath = {
  ulbCity:
    "components.div.children.searchApplications.children.cardContent.children.searchPropertyContainer.children.ulbCity",
  locality:
    "components.div.children.searchApplications.children.cardContent.children.searchPropertyContainer.children.locality",
  consumerNo:
    "components.div.children.searchApplications.children.cardContent.children.searchPropertyContainer.children.consumerNo",
  ownerMobNo:
    "components.div.children.searchApplications.children.cardContent.children.searchPropertyContainer.children.ownerMobNo",
  propertyID:
    "components.div.children.searchApplications.children.cardContent.children.searchPropertyContainer.children.propertyID",
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

export const getRequestBody = (searchScreenObject) => {
  let requestBody = {};
  if (searchScreenObject) {
    if (searchScreenObject.ownerName) requestBody.name = searchScreenObject.ownerName;
    if (searchScreenObject.mobileNumber) requestBody.mobileNumber = searchScreenObject.mobileNumber;
    if (searchScreenObject.ids) requestBody.propertyIds = searchScreenObject.ids;
    if (searchScreenObject.locality) requestBody.locality = searchScreenObject.locality.code;
    if (searchScreenObject.tenantId) requestBody.tenantId = searchScreenObject.tenantId;
  }
  return requestBody;
};

export const fetchBill = async (
  response,
  tenantId,
  billBusinessService,
  type
) => {
  const consumerCodes = [];
  if (type == "WATER") {
    response.WaterConnection.map((item) => {
      if (item.connectionNo) consumerCodes.push(item.connectionNo);
    });
  } else {
    response.SewerageConnections.map((item) => {
      if (item.connectionNo) consumerCodes.push(item.connectionNo);
    });
  }

  const billData = await generateBill(
    consumerCodes,
    tenantId,
    billBusinessService
  );
  return billData;
};


export const generateBill = async (
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
      const payload = await getBill(queryObj);
      return payload;
    }
  } catch (e) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: e.message, labelKey: e.message },
        "error"
      )
    );
  }
};

export const getSearchBillResult = async (queryObject) => {
  try {
    const response = await httpRequest(
      "post",
      "/billing-service/bill/v2/_search",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
  }
};

export const getBill = async (queryObject) => {
  try {
    const response = await httpRequest(
      "post",
      "/billing-service/bill/v2/_fetchbill",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    // store.dispatch(
    //   toggleSnackbar(
    //     true,
    //     { labelName: error.message, labelKey: error.message },
    //     "error"
    //   )
    // );
  }
};

export const getPropertyWithBillAmount = (propertyResponse, billResponse, type, payloadbillingPeriod) => {

  try {
    if (billResponse && billResponse.Bill && billResponse.Bill.length > 0) {
      if (type === "WATER") {
        propertyResponse.WaterConnection.map((item, key) => {

          let waterMeteredDemandExipryDate = 0;
          let waterNonMeteredDemandExipryDate = 0;
          let sewerageNonMeteredDemandExpiryDate = 0;
          if (item.service === serviceConst.WATER && payloadbillingPeriod.MdmsRes['ws-services-masters'] && payloadbillingPeriod.MdmsRes['ws-services-masters'].billingPeriod !== undefined && payloadbillingPeriod.MdmsRes['ws-services-masters'].billingPeriod !== null) {
            payloadbillingPeriod.MdmsRes['ws-services-masters'].billingPeriod.forEach(obj => {
              if (obj.connectionType === 'Metered') {
                waterMeteredDemandExipryDate = obj.demandExpiryDate;
              } else if (obj.connectionType === 'Non Metered') {
                waterNonMeteredDemandExipryDate = obj.demandExpiryDate;
              }
            });
          }
          if (item.service === serviceConst.SEWERAGE && payloadbillingPeriod.MdmsRes['sw-services-calculation'] && payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod !== undefined && payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod !== null) {
            payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod.forEach(obj => {
              if (obj.connectionType === 'Non Metered') {
                sewerageNonMeteredDemandExpiryDate = obj.demandExpiryDate;
              }
            });
          }
          billResponse.Bill.map(bill => {
            if (bill.consumerCode === item.connectionNo) {
              propertyResponse.WaterConnection[key].totalAmount = bill.totalAmount;
              if (type === "WATER") {
                propertyResponse.WaterConnection[key].businessService = "WS";
              if(bill && bill.billDetails && bill.billDetails.length > 0 && bill.billDetails[0].toPeriod)  {
                propertyResponse.WaterConnection[key].updatedDueDate = (item.connectionType === 'Metered' ?
                (bill.billDetails[0].toPeriod + waterMeteredDemandExipryDate) :
                (bill.billDetails[0].toPeriod + waterNonMeteredDemandExipryDate));
              }
              } else {
                propertyResponse.WaterConnection[key].businessService = "SW";
              if(bill && bill.billDetails && bill.billDetails.length > 0 && bill.billDetails[0].toPeriod) 
                propertyResponse.WaterConnection[key].updatedDueDate = bill.billDetails[0].toPeriod + sewerageNonMeteredDemandExpiryDate;
              }
            }
          });
        });
      } else {
        propertyResponse.SewerageConnections.map((item, key) => {
          let sewerageNonMeteredDemandExpiryDate = 0;
          if (item.service === serviceConst.SEWERAGE && payloadbillingPeriod.MdmsRes['sw-services-calculation'] && payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod !== undefined && payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod !== null) {
            payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod.forEach(obj => {
              if (obj.connectionType === 'Non Metered') {
                sewerageNonMeteredDemandExpiryDate = obj.demandExpiryDate;
              }
            });
          }
          billResponse.Bill.map(bill => {
            if (bill.consumerCode === item.connectionNo) {
              propertyResponse.SewerageConnections[key].totalAmount = bill.totalAmount;
              propertyResponse.SewerageConnections[key].businessService = "SW";
              if(bill && bill.billDetails && bill.billDetails.length > 0 && bill.billDetails[0].toPeriod) 
              propertyResponse.SewerageConnections[key].updatedDueDate = bill.billDetails[0].toPeriod + sewerageNonMeteredDemandExpiryDate;
            }
          });
        });
      }
      return propertyResponse;
    } else {
      return propertyResponse;
    }
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
  }
}