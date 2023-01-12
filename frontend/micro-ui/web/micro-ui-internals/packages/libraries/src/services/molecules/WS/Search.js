import { WSService } from "../../elements/WS";
import { PTService } from "../../elements/PT";
import { PaymentService } from "../../elements/Payment";
import { MdmsService } from "../../elements/MDMS";
import { WorkflowService } from "../../elements/WorkFlow";
import cloneDeep from "lodash/cloneDeep";
import _ from "lodash";
import React from "react";

const stringReplaceAll = (str = "", searcher = "", replaceWith = "") => {
  if (searcher == "") return str;
  while (str.includes(searcher)) {
    str = str.replace(searcher, replaceWith);
  }
  return str;
};

const convertEpochToDate = (dateEpoch) => {
  if (dateEpoch) {
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${day}/${month}/${year}`;
  } else {
    return null;
  }
};

const getAddress = (address, t) => {
  const result =  `${address?.doorNo ? `${address?.doorNo}, ` : ""} ${address?.street ? `${address?.street}, ` : ""}${
    address?.landmark ? `${address?.landmark}, ` : ""
  }${t(Digit.Utils.pt.getMohallaLocale(address?.locality.code, address?.tenantId))}, ${t(Digit.Utils.pt.getCityLocale(address?.tenantId))}${
    address?.pincode && t(address?.pincode) ? `, ${address.pincode}` : " "
  }`;
  return result
};

const getOwnerNames = (propertyData) => {
  const getActiveOwners = propertyData?.owners?.filter(owner => owner?.active);
  const getOwnersList = getActiveOwners?.map(activeOwner => activeOwner?.name)?.join(",");
  return getOwnersList ? getOwnersList : t("NA");
}

const checkUserExist = async (userInfo) => {
  const checkList = ["SW_FIELD_INSPECTOR", "WS_APPROVER", "WS_FIELD_INSPECTOR", "SW_APPROVER"];
  const filterList = [];
  checkList?.map(list => {
    let filterData = userInfo?.info?.roles?.filter(role => role?.code == list);
    if(filterData?.length > 0) {
      filterList.push(filterData?.[0]?.code);
    }
  })
  return filterList;
}

const checkExistStatus = async (processInstances) => {
  const checkStatus = processInstances?.filter(state => state?.state?.applicationStatus == "PENDING_FOR_PAYMENT");
  return checkStatus?.length > 0 ? checkStatus : [];
}

const checkFeeEstimateVisible = async (wsDatas) => {
  const dataDetails = wsDatas?.[0]?.applicationType?.includes("NEW");
  return dataDetails;
} 

export const WSSearch = {
  application: async (tenantId, filters = {}, serviceType) => {
    const response = await WSService.search({ tenantId, filters: { ...filters }, businessService: serviceType === "WATER" ? "WS" : "SW" });
    return response;
  },

  property: async (tenantId, propertyfilter = {}) => {
    const response = await PTService.search({ tenantId, filters: propertyfilter, auth: true });
    return response;
  },

  searchBills: async (tenantId, consumercodes) => {
    const response = await Digit.PaymentService.searchBill(tenantId, { consumerCode: consumercodes, Service: "WS.ONE_TIME_FEE" });
    return response;
  },

  searchAmendment: async (tenantId, consumercodes, businessService="WS") => {
    const response = await Digit.PaymentService.searchAmendment(tenantId, { amendmentId: consumercodes, businessService });
    return response;
  },

  workflowDataDetails: async (tenantId, businessIds) => {
    const response = await Digit.WorkflowService.getByBusinessId(tenantId, businessIds);
    return response;
  },

  wsEstimationDetails: async (data, serviceType) => {
    let businessService = serviceType === "WATER" ? "WS" : "SW";
    const response = await WSService.wsCalculationEstimate(data, businessService);
    return response;
  },

  colletionData: async ({tenantId, serviceTypeOfData, collectionNumber}) => {
    const businessService = serviceTypeOfData;
    const consumerCodes = collectionNumber;
    const response = await Digit.PaymentService.recieptSearch(tenantId, businessService, {consumerCodes: consumerCodes });
    return response;
  },

  fetchBillData: async ({tenantId, serviceTypeOfData, collectionNumber}) => {
    const businessService = serviceTypeOfData;
    const consumerCode = collectionNumber;
    const response = await Digit.PaymentService.fetchBill(tenantId, {
      businessService: businessService,
      consumerCode: consumerCode,
    });
    return response;
  },



  applicationDetails: async (t, tenantId, applicationNumber, serviceType = "WATER", userInfo, config = {}) => {

    const filters = { applicationNumber };

    let propertyids = "",
      consumercodes = "",
      businessIds = "";

    const response = await WSSearch.application(tenantId, filters, serviceType);

    const appSessionDetails = sessionStorage.getItem("WS_SESSION_APPLICATION_DETAILS");
    const wsApplicationDetails = appSessionDetails ? JSON.parse(appSessionDetails) : "";
    if (
      response?.WaterConnection?.[0] && 
      wsApplicationDetails?.applicationType &&
      wsApplicationDetails?.applicationNo == response?.WaterConnection?.[0]?.applicationNo
      ) {
      response.WaterConnection[0] = wsApplicationDetails;
    }

    if (
      response?.SewerageConnections?.[0] && 
      wsApplicationDetails?.applicationType && 
      wsApplicationDetails?.applicationNo == response?.SewerageConnections?.[0]?.applicationNo
      ) {
      response.SewerageConnections[0] = wsApplicationDetails;
    }

    const wsData = cloneDeep(serviceType == "WATER" ? response?.WaterConnection : response?.SewerageConnections);

    wsData?.forEach((item) => {
      propertyids = propertyids + item?.propertyId + ",";
      consumercodes = consumercodes + item?.applicationNo + ",";
    });

    let propertyfilter = { propertyIds: propertyids.substring(0, propertyids.length - 1) };

    if (propertyids !== "" && filters?.locality) propertyfilter.locality = filters?.locality;

    config = { enabled: propertyids !== "" ? true : false };

    const properties = await WSSearch.property(tenantId, propertyfilter);

    const billData = await WSSearch.searchBills(tenantId, consumercodes);

    if (filters?.applicationNumber) businessIds = filters?.applicationNumber;

    const workflowDetails = await WSSearch.workflowDataDetails(tenantId, businessIds);

    const isVisible = await checkFeeEstimateVisible(cloneDeep(wsData));

    // const adhocRebateData = sessionStorage.getItem("Digit.ADHOC_ADD_REBATE_DATA");
    // const parsedAdhocRebateData = adhocRebateData ? JSON.parse(adhocRebateData) : "";
    // if (wsData?.[0]?.additionalDetails && parsedAdhocRebateData?.value) {
    //   // if (parsedAdhocRebateData?.value?.adhocPenalty) parsedAdhocRebateData?.value?.adhocPenalty = parseInt(parsedAdhocRebateData?.value?.adhocPenalty)
    //   // if (parsedAdhocRebateData?.value?.adhocRebate) parsedAdhocRebateData?.value?.adhocRebate = parseInt(parsedAdhocRebateData?.value?.adhocRebate)
    //   const data = { ...wsData?.[0]?.additionalDetails, ...parsedAdhocRebateData?.value };
    //   wsData[0].additionalDetails = data;
    // }

    const data = {
      CalculationCriteria:
        serviceType == "WATER"
          ? [
              {
                applicationNo: filters?.applicationNumber,
                tenantId: wsData?.[0]?.tenantId ? wsData?.[0]?.tenantId : tenantId,
                waterConnection: { ...wsData?.[0], property: properties?.Properties?.[0] },
              },
            ]
          : [
              {
                applicationNo: filters?.applicationNumber,
                tenantId: wsData?.[0]?.tenantId ? wsData?.[0]?.tenantId : tenantId,
                sewerageConnection: { ...wsData?.[0], property: properties?.Properties?.[0], service: "SEWERAGE" },
              },
            ],
      isconnectionCalculation: false,
    };

    tenantId = wsData?.[0]?.tenantId ? wsData?.[0]?.tenantId : tenantId;
    const serviceTypeOfData = serviceType == "WATER" ? "WS.ONE_TIME_FEE" : "SW.ONE_TIME_FEE";
    const collectionNumber = filters?.applicationNumber;


    let fetchBillData = {}, colletionData = {}, estimationResponse = {}, mdmsRes = {}, isPaid = false;


    fetchBillData = await WSSearch.fetchBillData({ tenantId, serviceTypeOfData, collectionNumber });

    if (fetchBillData?.Bill?.length > 0 && isVisible) {
      const stateCode = Digit.ULBService.getStateId();
      mdmsRes = await MdmsService.getMultipleTypes(stateCode, "BillingService", ["TaxHeadMaster"]);
      let taxHeadMasterResponce = mdmsRes.BillingService.TaxHeadMaster;
      fetchBillData.Bill[0].billDetails[0].billAccountDetails.forEach(data => {
        taxHeadMasterResponce.forEach(taxHeadCode => { if (data.taxHeadCode == taxHeadCode.code) { data.category = taxHeadCode.category } });
      });

      let fee = 0, charge = 0, taxAmount = 0;
      fetchBillData.Bill[0].billSlabData = _.groupBy(fetchBillData.Bill[0].billDetails[0].billAccountDetails, 'category')
      if (fetchBillData?.Bill?.[0]?.billSlabData?.FEE?.length > 0) fetchBillData.Bill[0].billSlabData.FEE?.map(amount => { fee += parseFloat(amount.amount); });
      if (fetchBillData?.Bill?.[0]?.billSlabData?.CHARGES?.length > 0) fetchBillData.Bill[0].billSlabData.CHARGES?.map(amount => { charge += parseFloat(amount.amount); });
      if (fetchBillData?.Bill?.[0]?.billSlabData?.TAX?.length > 0) fetchBillData.Bill[0].billSlabData.TAX?.map(amount => { taxAmount += parseFloat(amount.amount); });
      fetchBillData.Bill[0].fee = fee;
      fetchBillData.Bill[0].charge = charge
      fetchBillData.Bill[0].taxAmount = taxAmount;
      fetchBillData.Bill[0].totalAmount = fee + charge + taxAmount;
    }

    if (fetchBillData?.Bill?.length == 0) {
      if (isVisible) {
        colletionData = await WSSearch.colletionData({ tenantId, serviceTypeOfData, collectionNumber });
        if (colletionData?.Payments?.length > 0) {
          const colletionDataDetails = cloneDeep(colletionData);
          const stateCode = Digit.ULBService.getStateId();
          mdmsRes = await MdmsService.getMultipleTypes(stateCode, "BillingService", ["TaxHeadMaster"]);
          let taxHeadMasterResponce = mdmsRes.BillingService.TaxHeadMaster;
          colletionDataDetails?.Payments?.[0]?.paymentDetails?.[0]?.bill?.billDetails?.[0]?.billAccountDetails.forEach(data => {
            taxHeadMasterResponce.forEach(taxHeadCode => { if (data.taxHeadCode == taxHeadCode.code) { data.category = taxHeadCode.category } });
          });
    
          let fee = 0, charge = 0, taxAmount = 0;
          fetchBillData = {};
          fetchBillData.Bill = [];
          fetchBillData.Bill[0] = {};
          fetchBillData.Bill[0].billSlabData = _.groupBy(colletionDataDetails?.Payments?.[0]?.paymentDetails?.[0]?.bill?.billDetails?.[0]?.billAccountDetails, 'category')
          if (fetchBillData?.Bill?.[0]?.billSlabData?.FEE?.length > 0) fetchBillData.Bill[0].billSlabData.FEE?.map(amount => { fee += parseFloat(amount.amount); });
          if (fetchBillData?.Bill?.[0]?.billSlabData?.CHARGES?.length > 0) fetchBillData.Bill[0].billSlabData.CHARGES?.map(amount => { charge += parseFloat(amount.amount); });
          if (fetchBillData?.Bill?.[0]?.billSlabData?.TAX?.length > 0) fetchBillData.Bill[0].billSlabData.TAX?.map(amount => { taxAmount += parseFloat(amount.amount); });
          fetchBillData.Bill[0].fee = fee;
          fetchBillData.Bill[0].charge = charge
          fetchBillData.Bill[0].taxAmount = taxAmount;
          fetchBillData.Bill[0].totalAmount = fee + charge + taxAmount;
        }
      }
    }

    if (colletionData?.Payments?.length == 0 && fetchBillData?.Bill?.length == 0) {
      if (isVisible) {
        if (serviceType == "WATER" && response?.WaterConnection?.length > 0) {
          estimationResponse = await WSSearch.wsEstimationDetails(data, serviceType);
        }
        if (serviceType !== "WATER" && response?.SewerageConnections?.length > 0) {
          estimationResponse = await WSSearch.wsEstimationDetails(data, serviceType);
        }

        if (estimationResponse?.Calculation?.[0]?.taxHeadEstimates?.length > 0) {
          estimationResponse.Calculation[0].taxHeadEstimates?.forEach(data => data.amount = data.estimateAmount);
          estimationResponse.Calculation[0].billSlabData = _.groupBy(estimationResponse.Calculation[0].taxHeadEstimates, 'category');
        }
        fetchBillData = {};
        fetchBillData.Bill = [];
        fetchBillData.Bill[0] = estimationResponse?.Calculation?.[0]
      }
    }

    const wsDataDetails = cloneDeep(wsData?.[0]);
    const propertyDataDetails = cloneDeep(properties?.Properties?.[0]);
    const billDetails = cloneDeep(billData);
    const workFlowDataDetails = cloneDeep(workflowDetails);
    const serviceDataType = cloneDeep(serviceType);


    const applicationHeaderDetails = {
      title: " ",
      asSectionHeader: true,
      values:
        serviceType == "WATER"
          ? [
              { title: "PDF_STATIC_LABEL_APPLICATION_NUMBER_LABEL", value: wsDataDetails?.applicationNo || t("NA") },
              { title: "WS_SERVICE_NAME_LABEL", value:  t(`WS_APPLICATION_TYPE_${wsDataDetails?.applicationType ? wsDataDetails?.applicationType : wsDataDetails?.serviceType}`) },
              { title: "WS_NO_OF_CONNECTIONS_PROPOSED_LABEL", value: wsDataDetails?.proposedTaps || t("NA") },
              { title: "WS_PROPOSED_PIPE_SIZE", value: wsDataDetails?.proposedPipeSize || t("NA") },
            ]
          : [
              { title: "PDF_STATIC_LABEL_APPLICATION_NUMBER_LABEL", value: wsDataDetails?.applicationNo || t("NA") },
              { title: "WS_SERVICE_NAME_LABEL", value:  t(`WS_APPLICATION_TYPE_${wsDataDetails?.applicationType ? wsDataDetails?.applicationType : wsDataDetails?.serviceType}`) },
              { title: "WS_NO_WATER_CLOSETS_LABEL", value: wsDataDetails?.proposedWaterClosets || t("NA") },
              { title: "WS_PROPOSED_WATER_TOILETS_LABEL", value: wsDataDetails?.proposedToilets || t("NA") },
            ],
    };

    let isAdhocRebate = false;
    const checkUserList = await checkUserExist(cloneDeep(userInfo));
    const checkStatus = await checkExistStatus(cloneDeep(workFlowDataDetails?.ProcessInstances));
    if (checkUserList?.length > 0 && checkStatus?.length == 0 && window.location.href.includes("/employee") && workFlowDataDetails?.ProcessInstances?.[0]?.nextActions?.length > 0) {
      isAdhocRebate = true;
    }

    let wtrSewDetails = cloneDeep(wsDataDetails);
    if (wtrSewDetails?.additionalDetails?.adhocRebateReason) {
      wtrSewDetails.additionalDetails.adhocRebateReason_data =  { 
        title : wtrSewDetails?.additionalDetails?.adhocRebateReason,
        value: t(`${wtrSewDetails?.additionalDetails?.adhocRebateReason}`)
      }
    }
    if (wtrSewDetails?.additionalDetails?.adhocPenaltyReason) {
      wtrSewDetails.additionalDetails.adhocPenaltyReason_data =  { 
        title : wtrSewDetails?.additionalDetails?.adhocPenaltyReason,
        value: t(`${wtrSewDetails?.additionalDetails?.adhocPenaltyReason}`)
      }
    }

    const feeEstimation = {
      title: "WS_TASK_DETAILS_FEE_ESTIMATE",
      asSectionHeader: true,
      additionalDetails: {
        estimationDetails: true,
        data: fetchBillData?.Bill?.[0],
        appDetails: {...wtrSewDetails, property: propertyDataDetails, service: serviceDataType},
        isAdhocRebate: isAdhocRebate,
        isVisible: isVisible,
        isPaid: colletionData?.Payments?.length > 0 ? true : false,
        isViewBreakup: isVisible,
        values: [
          { title: "WS_APPLICATION_FEE_HEADER", value: <span>&#8377;{fetchBillData?.Bill?.[0]?.fee || 0}</span>},
          { title: "WS_SERVICE_FEE_HEADER", value: <span>&#8377;{fetchBillData?.Bill?.[0]?.charge || 0}</span>},
          { title: "WS_TAX_HEADER", value: <span>&#8377;{fetchBillData?.Bill?.[0]?.taxAmount || 0}</span>},
        ],
      },
    };

    const propertyDetails = {
      title: "WS_COMMON_PROPERTY_DETAILS",
      asSectionHeader: true,
      values: [
        { title: "WS_PROPERTY_ID_LABEL", value: propertyDataDetails?.propertyId },
        { title: "WS_COMMON_OWNER_NAME_LABEL", value: getOwnerNames(propertyDataDetails) },
        { title: "WS_PROPERTY_ADDRESS_LABEL", value: getAddress(propertyDataDetails?.address, t), isNotTranslated: true, privacy: { uuid: propertyDataDetails?.owners?.[0]?.uuid, fieldName: ["doorNo", "street", "landmark"], model: "Property",showValue: true,
        loadData: {
          serviceName: "/property-services/property/_search",
          requestBody: {},
          requestParam: { tenantId, propertyIds : propertyids },
          jsonPath: "Properties[0].address.street",
          isArray: false,
          d: (res) => {
            let resultString = (_.get(res,"Properties[0].address.doorNo") ?  `${_.get(res,"Properties[0].address.doorNo")}, ` : "") + (_.get(res,"Properties[0].address.street")? `${_.get(res,"Properties[0].address.street")}, ` : "") + (_.get(res,"Properties[0].address.landmark") ? `${_.get(res,"Properties[0].address.landmark")}`:"")
            return resultString;
          }
        },}, },
      ],
      additionalDetails: {
        redirectUrl: {
          title: t("WS_VIEW_PROPERTY_DETAILS"),
          url: `/digit-ui/employee/pt/property-details/${propertyDataDetails?.propertyId}?from=WS_APPLICATION_DETAILS_HEADER`,
        },
      },
    };

    const uuid = wsDataDetails?.connectionHolders?.[0]?.uuid
    const applicationNoForPrivacy = wsDataDetails?.applicationNo
    const connectionHolderDetails = {
      title: "WS_COMMON_CONNECTION_HOLDER_DETAILS_HEADER",
      asSectionHeader: true,
      values:
        wsDataDetails?.connectionHolders?.length > 0
          ? [
            { title: "WS_OWN_DETAIL_NAME", value: wsDataDetails?.connectionHolders?.[0]?.name || t("NA") },
            { title: "WS_CONN_HOLDER_OWN_DETAIL_GENDER_LABEL", value: wsDataDetails?.connectionHolders?.[0]?.gender, privacy: { uuid: uuid, fieldName: ["gender"], model: "WnSConnectionOwner",showValue: false,
            loadData: {
              serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
              requestBody: {},
              requestParam: { tenantId, applicationNumber },
              jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].gender" : "SewerageConnections[0].connectionHolders[0].gender",
              isArray: false,
            }, }, },
            { title: "CORE_COMMON_MOBILE_NUMBER", value: wsDataDetails?.connectionHolders?.[0]?.mobileNumber, privacy: { uuid: uuid, fieldName: ["connectionHoldersMobileNumber"], model: "WnSConnectionOwner",showValue: false,
            loadData: {
              serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
              requestBody: {},
              requestParam: { tenantId, applicationNumber },
              jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].mobileNumber" : "SewerageConnections[0].connectionHolders[0].mobileNumber",
              isArray: false,
            }, }, },
            { title: "WS_CONN_HOLDER_COMMON_FATHER_OR_HUSBAND_NAME", value: wsDataDetails?.connectionHolders?.[0]?.fatherOrHusbandName, privacy: { uuid: uuid, fieldName: ["fatherOrHusbandName"], model: "WnSConnectionOwner",showValue: false,
            loadData: {
              serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
              requestBody: {},
              requestParam: { tenantId, applicationNumber },
              jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].fatherOrHusbandName" : "SewerageConnections[0].connectionHolders[0].fatherOrHusbandName",
              isArray: false,
            }, } },
              { title: "WS_CONN_HOLDER_OWN_DETAIL_RELATION_LABEL", value: wsDataDetails?.connectionHolders?.[0]?.relationship,
              privacy: { uuid: uuid, fieldName: ["relationship"], model: "WnSConnection",showValue: false,
              loadData: {
                serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                requestBody: {},
                requestParam: { tenantId, applicationNumber },
                jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].relationship" : "SewerageConnections[0].connectionHolders[0].relationship",
                isArray: false,
              }, },
            },
            {
              title: "WS_CORRESPONDANCE_ADDRESS_LABEL", value: wsDataDetails?.connectionHolders?.[0]?.correspondenceAddress, 
              privacy: {
                uuid: uuid,
                fieldName: wsDataDetails?.connectionHolders[0]?.permanentAddress ? ["permanentAddress"] : ["correspondenceAddress"],
                model: "WnSConnectionOwner",
                hide: !(wsDataDetails?.connectionHolders[0]?.permanentAddress || wsDataDetails?.connectionHolders[0]?.correspondenceAddress),
                showValue: false,
                loadData: {
                  serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                  requestBody: {},
                  requestParam: { tenantId, applicationNumber },
                  jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].correspondenceAddress" : "SewerageConnections[0].connectionHolders[0].correspondenceAddress",
                  isArray: false,
              },
              } 
            },
            {
              title: "WS_OWNER_SPECIAL_CATEGORY", value: wsDataDetails?.connectionHolders?.[0]?.ownerType ? (wsDataDetails?.connectionHolders?.[0]?.ownerType?.includes("*") ? wsDataDetails?.connectionHolders?.[0]?.ownerType : (`PROPERTYTAX_OWNERTYPE_${wsDataDetails?.connectionHolders?.[0]?.ownerType?.toUpperCase()}`) ): "NA",
              privacy: { uuid: uuid, fieldName: ["ownerType"], model: "WnSConnection",showValue: false,
              loadData: {
                serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                requestBody: {},
                requestParam: { tenantId, applicationNumber },
                jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].ownerType" : "SewerageConnections[0].connectionHolders[0].ownerType",
                isArray: false,
                d: (res) => {
                  let resultString = (res?.WaterConnection?.[0] ? t(`PROPERTYTAX_OWNERTYPE_${res?.WaterConnection?.[0]?.connectionHolders?.[0]?.ownerType?.toUpperCase()}`) : t(`PROPERTYTAX_OWNERTYPE_${res?.SewerageConnections?.[0]?.connectionHolders?.[0]?.ownerType?.toUpperCase()}`));
                  return resultString;
                }
            }, },
            },
            ]
          : [{ title: "WS_CONN_HOLDER_SAME_AS_OWNER_DETAILS", value: t("SCORE_YES") }],
    };

    const documentDetails = {
      title: "",
      asSectionHeader: true,
      additionalDetails: {
        documents: [
          {
            title: "WS_COMMON_DOCS",
            values: wsDataDetails?.documents?.map((document) => {
              return {
                title: `WS_${document?.documentType}`,
                documentType: document?.documentType,
                documentUid: document?.documentUid,
                fileStoreId: document?.fileStoreId,
              };
            }),
          },
        ],
      },
    };

    const AdditionalDetailsByWS = {
      title: "",
      isWaterConnectionDetails: true,
      additionalDetails: {
        values: [],
        connectionDetails:
          serviceType == "WATER"
            ? [
                {
                  title: "WS_SERV_DETAIL_CONN_TYPE",
                  value: wsDataDetails?.connectionType
                    ? t(`WS_SERVICES_MASTERS_WATERSOURCE_${stringReplaceAll(wsDataDetails?.connectionType?.toUpperCase(), " ", "_")}`)
                    : t("NA"),
                },
                { title: "WS_SERV_DETAIL_NO_OF_TAPS", value: wsDataDetails?.noOfTaps || t("NA") },
                {
                  title: "WS_SERV_DETAIL_WATER_SOURCE",
                  value: wsDataDetails?.waterSource
                    ? t(`WS_SERVICES_MASTERS_WATERSOURCE_${wsDataDetails?.waterSource?.toUpperCase()?.split(".")[0]}`)
                    : t("NA"),
                },
                { title: "WS_PIPE_SIZE_IN_INCHES_LABEL", value: wsDataDetails?.pipeSize || t("NA") },
                {
                  title: "WS_SERV_DETAIL_WATER_SUB_SOURCE",
                  value: wsDataDetails?.waterSource ? t(`${wsDataDetails?.waterSource?.toUpperCase()?.split(".")[1]}`) : t("NA"),
                },
              ]
            : [
                {
                  title: "WS_SERV_DETAIL_CONN_TYPE",
                  value: wsDataDetails?.connectionType
                    ? t(`WS_SERVICES_MASTERS_WATERSOURCE_${stringReplaceAll(wsDataDetails?.connectionType?.toUpperCase(), " ", "_")}`)
                    : t("NA"),
                },
                { title: "WS_NUMBER_WATER_CLOSETS_LABEL", value: wsDataDetails?.noOfWaterClosets || t("NA") },
                { title: "WS_SERV_DETAIL_NO_OF_TOILETS", value: wsDataDetails?.noOfToilets || t("NA") },
              ],
        plumberDetails:
          wsDataDetails?.additionalDetails?.detailsProvidedBy === "ULB"
            ? [
                {
                  title: "WS_ADDN_DETAILS_PLUMBER_PROVIDED_BY",
                  value: wsDataDetails?.additionalDetails?.detailsProvidedBy
                    ? t(`WS_PLUMBER_${wsDataDetails?.additionalDetails?.detailsProvidedBy?.toUpperCase()}`)
                    : t("NA"),
                },
                { title: "WS_ADDN_DETAILS_PLUMBER_LICENCE_NO_LABEL", value: wsDataDetails?.plumberInfo?.[0]?.licenseNo || t("NA") },
                { title: "WS_ADDN_DETAILS_PLUMBER_NAME_LABEL", value: wsDataDetails?.plumberInfo?.[0]?.name || t("NA") },
              {
    title: "WS_PLUMBER_MOBILE_NO_LABEL", value: wsDataDetails?.plumberInfo?.[0]?.mobileNumber || t("NA"), privacy: { uuid: wsDataDetails?.applicationNo, fieldName: ["plumberInfoMobileNumber"], model: "WnSConnectionPlumber",showValue: false,
    loadData: {
      serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
      requestBody: {},
      requestParam: { tenantId, applicationNumber },
      jsonPath: serviceType === "WATER" ? "WaterConnection[0].plumberInfo[0].mobileNumber" : "SewerageConnections[0].plumberInfo[0].mobileNumber",
      isArray: false,
    }, },
                //privacy:{} 
              },
              ]
            : [
                {
                  title: "WS_ADDN_DETAILS_PLUMBER_PROVIDED_BY",
                  value: wsDataDetails?.additionalDetails?.detailsProvidedBy
                    ? t(`WS_PLUMBER_${wsDataDetails?.additionalDetails?.detailsProvidedBy?.toUpperCase()}`)
                    : t("NA"),
                },
              ],
        roadCuttingDetails: wsDataDetails?.roadCuttingInfo
          ? wsDataDetails?.roadCuttingInfo?.filter((e) => e?.status !== "INACTIVE")?.map((info, index) => {
              return {
                title: "WS_ROAD_CUTTING_DETAIL",
                values: [
                  { title: "WS_ADDN_DETAIL_ROAD_TYPE", value: t(`WS_ROADTYPE_${info?.roadType}`) },
                  { title: "WS_ROAD_CUTTING_AREA_LABEL", value: info?.roadCuttingArea },
                ],
              };
            })
          : [
              {
                title: "WS_ROAD_CUTTING_DETAIL",
                values: [
                  { title: "WS_ADDN_DETAIL_ROAD_TYPE", value: t("NA") },
                  { title: "WS_ROAD_CUTTING_AREA_LABEL", value: t("NA") },
                ],
              },
            ],
        activationDetails:
          wsDataDetails?.connectionType == "Metered"
            ? [
                { title: "WS_SERV_DETAIL_METER_ID", value: wsDataDetails?.meterId || t("NA") },
                { title: "WS_INITIAL_METER_READING_LABEL", value: wsDataDetails?.additionalDetails?.initialMeterReading || t("NA") },
                {
                  title: "WS_INSTALLATION_DATE_LABEL",
                  value: wsDataDetails?.meterInstallationDate ? convertEpochToDate(wsDataDetails?.meterInstallationDate) : t("NA"),
                },
                {
                  title: "WS_SERV_DETAIL_CONN_EXECUTION_DATE",
                  value: wsDataDetails?.connectionExecutionDate ? convertEpochToDate(wsDataDetails?.connectionExecutionDate) : t("NA"),
                }
              ]
            : [
                {
                  title: "WS_SERV_DETAIL_CONN_EXECUTION_DATE",
                  value: wsDataDetails?.connectionExecutionDate ? convertEpochToDate(wsDataDetails?.connectionExecutionDate) : t("NA"),
                }
              ],
      },
    };

    let details = [];
    const isLabelShow = {
      title: "",
      asSectionHeader: true,
      isLabelShow: true,
      additionalDetails: { isLabelShow: true },
    };
    details = [...details,isLabelShow, applicationHeaderDetails, feeEstimation, propertyDetails, connectionHolderDetails, AdditionalDetailsByWS, documentDetails];
    wsDataDetails.serviceType = serviceDataType;

    if (!isVisible) {
      const allDetails = cloneDeep(details)
      details = allDetails?.filter(data => data?.title != "WS_TASK_DETAILS_FEE_ESTIMATE");
    }
    //for edit in DV and FI : reloading after unmasking
    sessionStorage.removeItem("IsDetailsExists");

    return {
      applicationData: wsDataDetails,
      applicationDetails: details,
      tenantId: wsDataDetails?.tenantId,
      applicationNo: wsDataDetails?.applicationNo,
      applicationStatus: wsDataDetails?.applicationStatus,
      propertyDetails: propertyDataDetails,
      billDetails: billDetails?.Bill,
      processInstancesDetails: workFlowDataDetails?.ProcessInstances,
    };
  },

  modifyApplicationDetails: async (t, tenantId, applicationNumber, serviceType = "WATER", userInfo, config = {}) => {

    const filters = { applicationNumber };

    let propertyids = "",
      consumercodes = "",
      businessIds = "";

    const response = await WSSearch.application(tenantId, filters, serviceType);

    const wsData = cloneDeep(serviceType == "WATER" ? response?.WaterConnection : response?.SewerageConnections);

    const oldFilters = { connectionNumber: wsData?.[0]?.connectionNo, isConnectionSearch: true };

    const oldResponse = await WSSearch.application(tenantId, oldFilters, serviceType);

    const wsOldDetails = cloneDeep(serviceType == "WATER" ? oldResponse?.WaterConnection?.[1] : oldResponse?.SewerageConnections?.[1]);


    wsData?.forEach((item) => {
      propertyids = propertyids + item?.propertyId + ",";
      consumercodes = consumercodes + item?.applicationNo + ",";
    });

    let propertyfilter = { propertyIds: propertyids.substring(0, propertyids.length - 1) };
    if (propertyids !== "" && filters?.locality) propertyfilter.locality = filters?.locality;
    config = { enabled: propertyids !== "" ? true : false };
    const properties = await WSSearch.property(tenantId, propertyfilter);

    let oldProperties;
    if (wsData?.[0]?.propertyId != wsOldDetails?.property) {
      let oldPropertyfilter = { propertyIds: wsOldDetails?.propertyId };
      if (wsOldDetails?.propertyId !== "" && filters?.locality) oldPropertyfilter.locality = filters?.locality;
      config = { enabled: wsOldDetails?.propertyId !== "" ? true : false };
      oldProperties = await WSSearch.property(tenantId, oldPropertyfilter);
    }

    if (filters?.applicationNumber) businessIds = filters?.applicationNumber;

    const workflowDetails = await WSSearch.workflowDataDetails(tenantId, businessIds);

    const wsDataDetails = cloneDeep(wsData?.[0]);
    const propertyDataDetails = cloneDeep(properties?.Properties?.[0]);
    const workFlowDataDetails = cloneDeep(workflowDetails);
    const serviceDataType = cloneDeep(serviceType);
    let oldPropertyDetails = cloneDeep(oldProperties?.Properties?.[0]);
    const wsOldData = cloneDeep(wsOldDetails);

    const applicationHeaderDetails = {
      title: " ",
      asSectionHeader: true,
      values:
        serviceType == "WATER"
          ? [
            { title: "PDF_STATIC_LABEL_APPLICATION_NUMBER_LABEL", value: wsDataDetails?.applicationNo || t("NA") },
            { title: "WS_SERVICE_NAME_LABEL", value: t(`WS_APPLICATION_TYPE_${wsDataDetails?.applicationType? wsDataDetails?.applicationType : wsDataDetails?.serviceType}`) },
            { title: "WS_NO_OF_CONNECTIONS_PROPOSED_LABEL", value: wsDataDetails?.proposedTaps || t("NA") },
            { title: "WS_PROPOSED_PIPE_SIZE", value: wsDataDetails?.proposedPipeSize || t("NA") },
          ]
          : [
            { title: "PDF_STATIC_LABEL_APPLICATION_NUMBER_LABEL", value: wsDataDetails?.applicationNo || t("NA") },
            { title: "WS_SERVICE_NAME_LABEL", value: t(`WS_APPLICATION_TYPE_${wsDataDetails?.applicationType? wsDataDetails?.applicationType : wsDataDetails?.serviceType}`) },
            { title: "WS_NO_WATER_CLOSETS_LABEL", value: wsDataDetails?.proposedWaterClosets || t("NA") },
            { title: "WS_PROPOSED_WATER_TOILETS_LABEL", value: wsDataDetails?.proposedToilets || t("NA") },
          ],
    };

    const propertyDetails = {
      title: "WS_COMMON_PROPERTY_DETAILS",
      asSectionHeader: true,
      values: [
        {
          title: "WS_PROPERTY_ID_LABEL",
          value: propertyDataDetails?.propertyId,
          oldValue: propertyDataDetails?.propertyId != oldPropertyDetails?.propertyId ?
            [
              { value: propertyDataDetails?.propertyId, className: "newValue", style: { display: "inline" } },
              {
                value: `${t("WS_OLD_LABEL_NAME")} ${oldPropertyDetails?.propertyId}`,
                style: { color: 'gray', paddingLeft: "10px", display: "inline", fontSize: "13px" }, className: "oldValue"
              }
            ] : null
        },
        {
          title: "WS_COMMON_OWNER_NAME_LABEL",
          value: getOwnerNames(propertyDataDetails),
          oldValue: getOwnerNames(propertyDataDetails) != getOwnerNames(oldPropertyDetails) ?
            [
              { value: getOwnerNames(propertyDataDetails), className: "newValue", style: { display: "inline" } },
              {
                value: `${t("WS_OLD_LABEL_NAME")} ${getOwnerNames(oldPropertyDetails)}`,
                style: { color: 'gray', paddingLeft: "10px", display: "inline", fontSize: "13px" }, className: "oldValue"
              }
            ] : null
        },
        {
          title: "WS_PROPERTY_ADDRESS_LABEL",
          value: getAddress(propertyDataDetails?.address, t),
          isNotTranslated: true,
          privacy: [{ uuid: propertyDataDetails?.owners?.[0]?.uuid, fieldName: ["doorNo", "street", "landmark"], model: "Property",showValue: true,
          loadData: {
            serviceName: "/property-services/property/_search",
            requestBody: {},
            requestParam: { tenantId, propertyIds : propertyids },
            jsonPath: "Properties[0].address.street",
            isArray: false,
            d: (res) => {
              let resultString = (_.get(res,"Properties[0].address.doorNo") ?  `${_.get(res,"Properties[0].address.doorNo")}, ` : "") + (_.get(res,"Properties[0].address.street")? `${_.get(res,"Properties[0].address.street")}, ` : "") + (_.get(res,"Properties[0].address.landmark") ? `${_.get(res,"Properties[0].address.landmark")}`:"")
              return resultString;
            }
          }},
          { uuid: oldPropertyDetails?.owners?.[0]?.uuid, fieldName: ["doorNo", "street", "landmark"], model: "Property",showValue: true,
          loadData: {
              serviceName: "/property-services/property/_search",
              requestBody: {},
              requestParam: { tenantId, propertyIds : wsOldDetails?.propertyId },
              jsonPath: "Properties[0].address.street",
              isArray: false,
              oldValue: true,
              d: (res) => {
                let resultString = (_.get(res,"Properties[0].address.doorNo") ?  `${_.get(res,"Properties[0].address.doorNo")}, ` : "") + (_.get(res,"Properties[0].address.street")? `${_.get(res,"Properties[0].address.street")}, ` : "") + (_.get(res,"Properties[0].address.landmark") ? `${_.get(res,"Properties[0].address.landmark")}`:"")
                return resultString;
              }
            }
          }],
          oldValue: getAddress(propertyDataDetails?.address, t) != getAddress(oldPropertyDetails?.address, t) ?
            [
              { value: getAddress(propertyDataDetails?.address, t), className: "newValue", style: { display: "inline" } },
              {
                value: `${t("WS_OLD_LABEL_NAME")} ${getAddress(oldPropertyDetails?.address, t)}`,
                style: { color: 'gray', paddingLeft: "10px", display: "inline", fontSize: "13px" }, className: "oldValue"
              }
            ] : null
        },
      ],
      additionalDetails: {
        redirectUrl: {
          title: t("WS_VIEW_PROPERTY_DETAILS"),
          url: `/digit-ui/employee/pt/property-details/${propertyDataDetails?.propertyId}?from=WS_APPLICATION_DETAILS_HEADER`,
        },
      },
    };

    const uuid = wsDataDetails?.connectionHolders?.[0]?.uuid;
    const olduuid = wsOldData?.connectionHolders?.[0]?.uuid;
    const applicationNoForPrivacy = wsDataDetails?.applicationNo;
    const OldapplicationNo = wsOldData?.applicationNo;

    let connectionHolderDetails = {
      title: "WS_COMMON_CONNECTION_HOLDER_DETAILS_HEADER",
      asSectionHeader: true,
      values:
        wsDataDetails?.connectionHolders?.length > 0
          ? [
            {
              title: "WS_OWN_DETAIL_NAME",
              value: wsDataDetails?.connectionHolders?.[0]?.name || t("NA"),
              oldValue: wsDataDetails?.connectionHolders?.[0]?.name != wsOldData?.connectionHolders?.[0]?.name ? [
                { value: wsDataDetails?.connectionHolders?.[0]?.name || t("NA"), className: "newValue", style: { display: "inline" } },
                {
                  value: `${t("WS_OLD_LABEL_NAME")} ${wsOldData?.connectionHolders?.[0]?.name || t("NA")}`,
                  style: { color: 'gray', paddingLeft: "10px", display: "inline", fontSize: "13px" }, className: "oldValue"
                }
              ] : null
            },
            {
              title: "WS_CONN_HOLDER_OWN_DETAIL_GENDER_LABEL",
              value: wsDataDetails?.connectionHolders?.[0]?.gender,
              privacy: [{ uuid: uuid, fieldName: ["gender"], model: "WnSConnectionOwner",showValue: false,
              loadData: {
                serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                requestBody: {},
                requestParam: { tenantId, applicationNumber },
                jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].gender" : "SewerageConnections[0].connectionHolders[0].gender",
                isArray: false,
              }, },{ uuid: olduuid, fieldName: ["gender"], model: "WnSConnectionOwner",showValue: false,
              loadData: {
                serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                requestBody: {},
                requestParam: { tenantId, applicationNumber:OldapplicationNo},
                jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].gender" : "SewerageConnections[0].connectionHolders[0].gender",
                isArray: false,
                oldValue: true,
                d: (res) => {
                  let resultString = (res?.WaterConnection?.[0] ? `${t("WS_OLD_LABEL_NAME")} ${t(res?.WaterConnection?.[0]?.connectionHolders?.[0]?.gender)}` : `${t("WS_OLD_LABEL_NAME")} ${t(res?.SewerageConnections?.[0]?.connectionHolders?.[0]?.gender)}`);
                  return resultString;
                }
              }, }],
              oldValue: wsDataDetails?.connectionHolders?.[0]?.gender != wsOldData?.connectionHolders?.[0]?.gender ? [
                { value: wsDataDetails?.connectionHolders?.[0]?.gender ? t(`${wsDataDetails?.connectionHolders?.[0]?.gender}`) : t("NA"), className: "newValue", style: { display: "inline" } },
                {
                  value: `${t("WS_OLD_LABEL_NAME")} ${wsOldData?.connectionHolders?.[0]?.gender ? t(`${wsOldData?.connectionHolders?.[0]?.gender}`) : t("NA")}`,
                  style: { color: 'gray', paddingLeft: "10px", display: "inline", fontSize: "13px" }, className: "oldValue"
                }
              ] : null
            },
            {
              title: "CORE_COMMON_MOBILE_NUMBER",
              value: wsDataDetails?.connectionHolders?.[0]?.mobileNumber,
              privacy: [{
                uuid: uuid, fieldName: ["connectionHoldersMobileNumber"],
                model: "WnSConnectionOwner",showValue: false,
                loadData: {
                  serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                  requestBody: {},
                  requestParam: { tenantId, applicationNumber },
                  jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].mobileNumber" : "SewerageConnections[0].connectionHolders[0].mobileNumber",
                  isArray: false,
                },
              },
              {
                uuid: olduuid, fieldName: ["connectionHoldersMobileNumber"],
                model: "WnSConnectionOwner",showValue: false,
                loadData: {
                  serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                  requestBody: {},
                  requestParam: { tenantId, applicationNumber:OldapplicationNo },
                  jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].mobileNumber" : "SewerageConnections[0].connectionHolders[0].mobileNumber",
                  isArray: false,
                  oldValue: true,
                  d: (res) => {
                    let resultString = (res?.WaterConnection?.[0] ? `${t("WS_OLD_LABEL_NAME")} ${res?.WaterConnection?.[0]?.connectionHolders?.[0]?.mobileNumber}` : `${t("WS_OLD_LABEL_NAME")} ${res?.SewerageConnections?.[0]?.connectionHolders?.[0]?.mobileNumber}`);
                    return resultString;
                  }
                },
              }],
              oldValue: wsDataDetails?.connectionHolders?.[0]?.mobileNumber != wsOldData?.connectionHolders?.[0]?.mobileNumber ? [
                { value: wsDataDetails?.connectionHolders?.[0]?.mobileNumber ? t(`${wsDataDetails?.connectionHolders?.[0]?.mobileNumber}`) : t("NA"), className: "newValue", style: { display: "inline" } },
                {
                  value: `${t("WS_OLD_LABEL_NAME")} ${wsOldData?.connectionHolders?.[0]?.mobileNumber ? t(`${wsOldData?.connectionHolders?.[0]?.mobileNumber}`) : t("NA")}`,
                  style: { color: 'gray', paddingLeft: "10px", display: "inline", fontSize: "13px" }, className: "oldValue"
                }
              ] : null
            },
            {
              title: "WS_CONN_HOLDER_COMMON_FATHER_OR_HUSBAND_NAME",
              value: wsDataDetails?.connectionHolders?.[0]?.fatherOrHusbandName,
              privacy: [{
                uuid: uuid, fieldName: ["fatherOrHusbandName"],
                model: "WnSConnectionOwner",showValue: false,
                loadData: {
                  serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                  requestBody: {},
                  requestParam: { tenantId, applicationNumber },
                  jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].fatherOrHusbandName" : "SewerageConnections[0].connectionHolders[0].fatherOrHusbandName",
                  isArray: false,
                },
              },{
                uuid: olduuid, fieldName: ["fatherOrHusbandName"],
                model: "WnSConnectionOwner",showValue: false,
                loadData: {
                  serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                  requestBody: {},
                  requestParam: { tenantId, applicationNumber:OldapplicationNo},
                  jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].fatherOrHusbandName" : "SewerageConnections[0].connectionHolders[0].fatherOrHusbandName",
                  isArray: false,
                  oldValue: true,
                  d: (res) => {
                    let resultString = (res?.WaterConnection?.[0] ? `${t("WS_OLD_LABEL_NAME")} ${res?.WaterConnection?.[0]?.connectionHolders?.[0]?.fatherOrHusbandName}` : `${t("WS_OLD_LABEL_NAME")} ${res?.SewerageConnections?.[0]?.connectionHolders?.[0]?.fatherOrHusbandName}`);
                    return resultString;
                  }
                },
              }],
              oldValue: wsDataDetails?.connectionHolders?.[0]?.fatherOrHusbandName != wsOldData?.connectionHolders?.[0]?.fatherOrHusbandName ? [
                { value: `${wsDataDetails?.connectionHolders?.[0]?.fatherOrHusbandName ? t(`${wsDataDetails?.connectionHolders?.[0]?.fatherOrHusbandName}`) : t("NA")}`, className: "newValue", style: { display: "inline" } },
                {
                  value: `${`${t("WS_OLD_LABEL_NAME")} ${wsOldData?.connectionHolders?.[0]?.fatherOrHusbandName ? t(`${wsOldData?.connectionHolders?.[0]?.fatherOrHusbandName}`) : t("NA")}`}`,
                  style: { color: 'gray', paddingLeft: "10px", display: "inline", fontSize: "13px" }, className: "oldValue"
                }
              ] : null
            },
            {
              title: "WS_CONN_HOLDER_OWN_DETAIL_RELATION_LABEL",
              value: wsDataDetails?.connectionHolders?.[0]?.relationship,
              privacy: [{ uuid: uuid, fieldName: ["relationship"], model: "WnSConnectionOwner",showValue: false,
              loadData: {
                serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                requestBody: {},
                requestParam: { tenantId, applicationNumber },
                jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].relationship" : "SewerageConnections[0].connectionHolders[0].relationship",
                isArray: false,
              },
            },{ uuid: olduuid, fieldName: ["relationship"], model: "WnSConnectionOwner",showValue: false,
            loadData: {
              serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
              requestBody: {},
              requestParam: { tenantId, applicationNumber:OldapplicationNo },
              jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].relationship" : "SewerageConnections[0].connectionHolders[0].relationship",
              isArray: false,
              oldValue: true,
              d: (res) => {
                let resultString = (res?.WaterConnection?.[0] ? `${t("WS_OLD_LABEL_NAME")} ${t(res?.WaterConnection?.[0]?.connectionHolders?.[0]?.relationship)}` : `${t("WS_OLD_LABEL_NAME")} ${t(res?.SewerageConnections?.[0]?.connectionHolders?.[0]?.relationship)}`);
                return resultString;
              }
            }, }],
              oldValue: wsDataDetails?.connectionHolders?.[0]?.relationship != wsOldData?.connectionHolders?.[0]?.relationship ? [
                { value: `${wsDataDetails?.connectionHolders?.[0]?.relationship ? t(`${wsDataDetails?.connectionHolders?.[0]?.relationship}`) : t("NA")}`, className: "newValue", style: { display: "inline" } },
                {
                  value: `${`${t("WS_OLD_LABEL_NAME")} ${wsOldData?.connectionHolders?.[0]?.relationship ? t(`${wsOldData?.connectionHolders?.[0]?.relationship}`) : t("NA")}`}`,
                  style: { color: 'gray', paddingLeft: "10px", display: "inline", fontSize: "13px" }, className: "oldValue"
                }
              ] : null
            },
            {
              title: "WS_CORRESPONDANCE_ADDRESS_LABEL",
              value: wsDataDetails?.connectionHolders?.[0]?.correspondenceAddress,
              privacy: [{
                uuid: uuid,
                fieldName: wsDataDetails?.connectionHolders[0]?.permanentAddress ? ["permanentAddress"] : ["correspondenceAddress"],
                model: "WnSConnectionOwner",
                hide: !(wsDataDetails?.connectionHolders[0]?.permanentAddress || wsDataDetails?.connectionHolders[0]?.correspondenceAddress),
                showValue: false,
                loadData: {
                  serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                  requestBody: {},
                  requestParam: { tenantId, applicationNumber },
                  jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].correspondenceAddress" : "SewerageConnections[0].connectionHolders[0].correspondenceAddress",
                  isArray: false,
                },
              },
              {
                uuid: olduuid,
                fieldName: wsDataDetails?.connectionHolders[0]?.permanentAddress ? ["permanentAddress"] : ["correspondenceAddress"],
                model: "WnSConnectionOwner",
                hide: !(wsDataDetails?.connectionHolders[0]?.permanentAddress || wsDataDetails?.connectionHolders[0]?.correspondenceAddress),
                showValue: false,
                loadData: {
                  serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                  requestBody: {},
                  requestParam: { tenantId, applicationNumber:OldapplicationNo},
                  jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].correspondenceAddress" : "SewerageConnections[0].connectionHolders[0].correspondenceAddress",
                  isArray: false,
                  oldValue: true,
                  d: (res) => {
                    let resultString = (res?.WaterConnection?.[0] ? `${t("WS_OLD_LABEL_NAME")} ${res?.WaterConnection?.[0]?.connectionHolders?.[0]?.correspondenceAddress}` : `${t("WS_OLD_LABEL_NAME")} ${res?.SewerageConnections?.[0]?.connectionHolders?.[0]?.correspondenceAddress}`);
                    return resultString;
                  }
                },
              }],
              oldValue: wsDataDetails?.connectionHolders?.[0]?.correspondenceAddress != wsOldData?.connectionHolders?.[0]?.correspondenceAddress ? [
                { value: wsDataDetails?.connectionHolders?.[0]?.correspondenceAddress || t("NA"), className: "newValue", style: { display: "inline" } },
                {
                  value: `${t("WS_OLD_LABEL_NAME")} ${wsOldData?.connectionHolders?.[0]?.correspondenceAddress || t("NA")}`,
                  style: { color: 'gray', paddingLeft: "10px", display: "inline", fontSize: "13px" }, className: "oldValue"
                }
              ] : null
            },
            {
              title: "WS_OWNER_SPECIAL_CATEGORY",
              value: wsDataDetails?.connectionHolders?.[0]?.ownerType ? (wsDataDetails?.connectionHolders?.[0]?.ownerType?.includes("*") ? wsDataDetails?.connectionHolders?.[0]?.ownerType : (t(`PROPERTYTAX_OWNERTYPE_${wsDataDetails?.connectionHolders?.[0]?.ownerType?.toUpperCase()}`))) : "NA",
              privacy: [{ uuid: uuid, fieldName: ["ownerType"], model: "WnSConnection",showValue: false,
              loadData: {
                serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                requestBody: {},
                requestParam: { tenantId, applicationNumber },
                jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].ownerType" : "SewerageConnections[0].connectionHolders[0].ownerType",
                isArray: false,
                d: (res) => {
                  let resultString = (res?.WaterConnection?.[0]? t(`PROPERTYTAX_OWNERTYPE_${res?.WaterConnection?.[0]?.connectionHolders?.[0]?.ownerType?.toUpperCase()}`) : t(`PROPERTYTAX_OWNERTYPE_${res?.SewerageConnections?.[0]?.connectionHolders?.[0]?.ownerType?.toUpperCase()}`));
                  return resultString;
                }
            }, },
              { uuid: olduuid, fieldName: ["ownerType"], model: "WnSConnection",showValue: false,
              loadData: {
                serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                requestBody: {},
                requestParam: { tenantId, applicationNumber:OldapplicationNo },
                jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].ownerType" : "SewerageConnections[0].connectionHolders[0].ownerType",
                isArray: false,
                oldValue: true,
                d: (res) => {
                  let resultString = (res?.WaterConnection?.[0] ? `${t("WS_OLD_LABEL_NAME")} ${t(`PROPERTYTAX_OWNERTYPE_${res?.WaterConnection?.[0]?.connectionHolders?.[0]?.ownerType?.toUpperCase()}`)}` : `${t("WS_OLD_LABEL_NAME")} ${t(`PROPERTYTAX_OWNERTYPE_${res?.SewerageConnections?.[0]?.connectionHolders?.[0]?.ownerType?.toUpperCase()}`)}`);
                  return resultString;
                }
            }, }],
              oldValue: wsDataDetails?.connectionHolders?.[0]?.ownerType != wsOldData?.connectionHolders?.[0]?.ownerType ? [
                { value: `${wsDataDetails?.connectionHolders?.[0]?.ownerType ? t(`${wsDataDetails?.connectionHolders?.[0]?.ownerType}`) : t("NA")}`, className: "newValue", style: { display: "inline" } },
                {
                  value: `${`${t("WS_OLD_LABEL_NAME")} ${wsOldData?.connectionHolders?.[0]?.ownerType ? t(`${wsOldData?.connectionHolders?.[0]?.ownerType}`) : t("NA")}`}`,
                  style: { color: 'gray', paddingLeft: "10px", display: "inline", fontSize: "13px" }, className: "oldValue"
                }
              ] : null
            },
          ]
          : [
            {
              title: "WS_CONN_HOLDER_SAME_AS_OWNER_DETAILS",
              value: t("SCORE_YES")
            }],
    };

    const documentDetails = {
      title: "",
      asSectionHeader: true,
      additionalDetails: {
        documents: [
          {
            title: "WS_COMMON_DOCS",
            values: wsDataDetails?.documents?.map((document) => {
              return {
                title: `WS_${document?.documentType}`,
                documentType: document?.documentType,
                documentUid: document?.documentUid,
                fileStoreId: document?.fileStoreId,
              };
            }),
          },
        ],
      },
    };

    const connectionDetails = {
      title: "WS_COMMON_CONNECTION_DETAIL",
      asSectionHeader: true,
      values: serviceType == "WATER"
        ? [
          {
            title: "WS_SERV_DETAIL_CONN_TYPE",
            value: wsDataDetails?.connectionType
              ? t(`WS_SERVICES_MASTERS_WATERSOURCE_${stringReplaceAll(wsDataDetails?.connectionType?.toUpperCase(), " ", "_")}`)
              : t("NA"),
            oldValue: wsDataDetails?.connectionType != wsOldData?.connectionType ? [
              {
                value: wsDataDetails?.connectionType
                  ? t(`WS_SERVICES_MASTERS_WATERSOURCE_${stringReplaceAll(wsDataDetails?.connectionType?.toUpperCase(), " ", "_")}`)
                  : t("NA"), className: "newValue", style: { display: "inline" }
              },
              {
                value: `${t("WS_OLD_LABEL_NAME")} ${wsOldData?.connectionType
                  ? t(`WS_SERVICES_MASTERS_WATERSOURCE_${stringReplaceAll(wsOldData?.connectionType?.toUpperCase(), " ", "_")}`)
                  : t("NA")}`,
                style: { color: 'gray', paddingLeft: "10px", display: "inline", fontSize: "13px" }, className: "oldValue"
              }
            ] : null
          },
          {
            title: "WS_SERV_DETAIL_NO_OF_TAPS",
            value: wsDataDetails?.noOfTaps || t("NA"),
            oldValue: wsDataDetails?.noOfTaps != wsOldData?.noOfTaps ? [
              { value: wsDataDetails?.noOfTaps || t("NA"), className: "newValue", style: { display: "inline" } },
              {
                value: `${t("WS_OLD_LABEL_NAME")} ${wsOldData?.noOfTaps || t("NA")}`,
                style: { color: 'gray', paddingLeft: "10px", display: "inline", fontSize: "13px" }, className: "oldValue"
              }
            ] : null
          },
          {
            title: "WS_SERV_DETAIL_WATER_SOURCE",
            value: wsDataDetails?.waterSource
              ? t(`WS_SERVICES_MASTERS_WATERSOURCE_${wsDataDetails?.waterSource?.toUpperCase()?.split(".")[0]}`)
              : t("NA"),
            oldValue: wsDataDetails?.waterSource != wsOldData?.waterSource ? [
              {
                value: wsDataDetails?.waterSource
                  ? t(`WS_SERVICES_MASTERS_WATERSOURCE_${wsDataDetails?.waterSource?.toUpperCase()?.split(".")[0]}`)
                  : t("NA"), className: "newValue", style: { display: "inline" }
              },
              {
                value: `${t("WS_OLD_LABEL_NAME")} ${wsOldData?.waterSource
                  ? t(`WS_SERVICES_MASTERS_WATERSOURCE_${wsOldData?.waterSource?.toUpperCase()?.split(".")[0]}`)
                  : t("NA")}`,
                style: { color: 'gray', paddingLeft: "10px", display: "inline", fontSize: "13px" }, className: "oldValue"
              }
            ] : null
          },
          {
            title: "WS_PIPE_SIZE_IN_INCHES_LABEL",
            value: wsDataDetails?.pipeSize || t("NA"),
            oldValue: wsDataDetails?.pipeSize != wsOldData?.pipeSize ? [
              { value: wsDataDetails?.pipeSize || t("NA"), className: "newValue", style: { display: "inline" } },
              {
                value: `${t("WS_OLD_LABEL_NAME")} ${wsOldData?.pipeSize || t("NA")}`,
                style: { color: 'gray', paddingLeft: "10px", display: "inline", fontSize: "13px" }, className: "oldValue"
              }
            ] : null
          },
          {
            title: "WS_SERV_DETAIL_WATER_SUB_SOURCE",
            value: wsDataDetails?.waterSource ? t(`${wsDataDetails?.waterSource?.toUpperCase()?.split(".")[1]}`) : t("NA"),
            oldValue: wsDataDetails?.waterSource != wsOldData?.waterSource ? [
              { value: wsDataDetails?.waterSource ? t(`${wsDataDetails?.waterSource?.toUpperCase()?.split(".")[1]}`) : t("NA"), className: "newValue", style: { display: "inline" } },
              {
                value: `${t("WS_OLD_LABEL_NAME")} ${wsOldData?.waterSource ? t(`${wsOldData?.waterSource?.toUpperCase()?.split(".")[1]}`) : t("NA")}`,
                style: { color: 'gray', paddingLeft: "10px", display: "inline", fontSize: "13px" }, className: "oldValue"
              }
            ] : null
          },
        ]
        : [
          {
            title: "WS_SERV_DETAIL_CONN_TYPE",
            value: wsDataDetails?.connectionType
              ? t(`WS_SERVICES_MASTERS_WATERSOURCE_${stringReplaceAll(wsDataDetails?.connectionType?.toUpperCase(), " ", "_")}`)
              : t("NA"),
            oldValue: wsDataDetails?.connectionType != wsOldData?.connectionType ? [
              {
                value: wsDataDetails?.connectionType
                  ? t(`WS_SERVICES_MASTERS_WATERSOURCE_${stringReplaceAll(wsDataDetails?.connectionType?.toUpperCase(), " ", "_")}`)
                  : t("NA"), className: "newValue", style: { display: "inline" }
              },
              {
                value: `${t("WS_OLD_LABEL_NAME")} ${wsOldData?.connectionType
                  ? t(`WS_SERVICES_MASTERS_WATERSOURCE_${stringReplaceAll(wsOldData?.connectionType?.toUpperCase(), " ", "_")}`)
                  : t("NA")}`,
                style: { color: 'gray', paddingLeft: "10px", display: "inline", fontSize: "13px" }, className: "oldValue"
              }
            ] : null
          },
          {
            title: "WS_NUMBER_WATER_CLOSETS_LABEL",
            value: wsDataDetails?.noOfWaterClosets || t("NA"),
            oldValue: wsDataDetails?.noOfWaterClosets != wsOldData?.noOfWaterClosets ? [
              {
                value: wsDataDetails?.noOfWaterClosets || t("NA"), className: "newValue", style: { display: "inline" }
              },
              {
                value: `${t("WS_OLD_LABEL_NAME")} ${wsOldData?.noOfWaterClosets || t("NA")}`,
                style: { color: 'gray', paddingLeft: "10px", display: "inline", fontSize: "13px" }, className: "oldValue"
              }
            ] : null
          },
          {
            title: "WS_SERV_DETAIL_NO_OF_TOILETS",
            value: wsDataDetails?.noOfToilets || t("NA"),
            oldValue: wsDataDetails?.noOfToilets != wsOldData?.noOfToilets ? [
              {
                value: wsDataDetails?.noOfToilets || t("NA"), className: "newValue", style: { display: "inline" }
              },
              {
                value: `${t("WS_OLD_LABEL_NAME")} ${wsOldData?.noOfToilets || t("NA")}`,
                style: { color: 'gray', paddingLeft: "10px", display: "inline", fontSize: "13px" }, className: "oldValue"
              }
            ] : null
          },
        ],
    };

    const activationDetails = {
      title: "WS_ACTIVATION_DETAILS",
      asSectionHeader: true,
      values: wsDataDetails?.connectionType == "Metered"
        ? [
          {
            title: "WS_SERV_DETAIL_METER_ID",
            value: wsDataDetails?.meterId || t("NA"),
            oldValue: wsDataDetails?.meterId != wsOldData?.meterId ? [
              {
                value: wsDataDetails?.meterId || t("NA"), className: "newValue", style: { display: "inline" }
              },
              {
                value: `${t("WS_OLD_LABEL_NAME")} ${wsOldData?.meterId || t("NA")}`,
                style: { color: 'gray', paddingLeft: "10px", display: "inline", fontSize: "13px" }, className: "oldValue"
              }
            ] : null
          },
          {
            title: "WS_INITIAL_METER_READING_LABEL",
            value: wsDataDetails?.additionalDetails?.initialMeterReading || t("NA"),
            oldValue: wsDataDetails?.additionalDetails?.initialMeterReading != wsOldData?.additionalDetails?.initialMeterReading ? [
              {
                value: wsDataDetails?.additionalDetails?.initialMeterReading || t("NA"), className: "newValue", style: { display: "inline" }
              },
              {
                value: `${t("WS_OLD_LABEL_NAME")} ${wsOldData?.additionalDetails?.initialMeterReading || t("NA")}`,
                style: { color: 'gray', paddingLeft: "10px", display: "inline", fontSize: "13px" }, className: "oldValue"
              }
            ] : null
          },
          {
            title: "WS_INSTALLATION_DATE_LABEL",
            value: wsDataDetails?.meterInstallationDate ? convertEpochToDate(wsDataDetails?.meterInstallationDate) : t("NA"),
            oldValue: wsDataDetails?.meterInstallationDate != wsOldData?.meterInstallationDate ? [
              {
                value: wsDataDetails?.meterInstallationDate ? convertEpochToDate(wsDataDetails?.meterInstallationDate) : t("NA"), className: "newValue", style: { display: "inline" }
              },
              {
                value: `${t("WS_OLD_LABEL_NAME")} ${wsOldData?.meterInstallationDate ? convertEpochToDate(wsOldData?.meterInstallationDate) : t("NA")}`,
                style: { color: 'gray', paddingLeft: "10px", display: "inline", fontSize: "13px" }, className: "oldValue"
              }
            ] : null
          },
          {
            title: "WS_SERV_DETAIL_CONN_EXECUTION_DATE",
            value: wsDataDetails?.connectionExecutionDate ? convertEpochToDate(wsDataDetails?.connectionExecutionDate) : t("NA"),
            oldValue: wsDataDetails?.connectionExecutionDate != wsOldData?.connectionExecutionDate ? [
              {
                value: wsDataDetails?.connectionExecutionDate ? convertEpochToDate(wsDataDetails?.connectionExecutionDate) : t("NA"), className: "newValue", style: { display: "inline" }
              },
              {
                value: `${t("WS_OLD_LABEL_NAME")} ${wsOldData?.connectionExecutionDate ? convertEpochToDate(wsOldData?.connectionExecutionDate) : t("NA")}`,
                style: { color: 'gray', paddingLeft: "10px", display: "inline", fontSize: "13px" }, className: "oldValue"
              }
            ] : null
          },
          ...(wsDataDetails?.dateEffectiveFrom ? [{
            title: "WS_MODIFICATIONS_EFFECTIVE_FROM",
            value: wsDataDetails?.dateEffectiveFrom ? convertEpochToDate(wsDataDetails?.dateEffectiveFrom) : t("NA"),
            oldValue: wsDataDetails?.dateEffectiveFrom != wsOldData?.dateEffectiveFrom ? [
              {
                value: wsDataDetails?.dateEffectiveFrom ? convertEpochToDate(wsDataDetails?.dateEffectiveFrom) : t("NA"), className: "newValue", style: { display: "inline" }
              },
              {
                value: `${t("WS_OLD_LABEL_NAME")} ${wsOldData?.dateEffectiveFrom ? convertEpochToDate(wsOldData?.dateEffectiveFrom) : t("NA")}`,
                style: { color: 'gray', paddingLeft: "10px", display: "inline", fontSize: "13px" }, className: "oldValue"
              }
            ] : null
          }] : []),
        ]
        : [
          {
            title: "WS_SERV_DETAIL_CONN_EXECUTION_DATE",
            value: wsDataDetails?.connectionExecutionDate ? convertEpochToDate(wsDataDetails?.connectionExecutionDate) : t("NA"),
            oldValue: wsDataDetails?.connectionExecutionDate != wsOldData?.connectionExecutionDate ? [
              {
                value: wsDataDetails?.connectionExecutionDate ? convertEpochToDate(wsDataDetails?.connectionExecutionDate) : t("NA"), className: "newValue", style: { display: "inline" }
              },
              {
                value: `${t("WS_OLD_LABEL_NAME")} ${wsOldData?.connectionExecutionDate ? convertEpochToDate(wsOldData?.connectionExecutionDate) : t("NA")}`,
                style: { color: 'gray', paddingLeft: "10px", display: "inline", fontSize: "13px" }, className: "oldValue"
              }
            ] : null
          },
          ...(wsDataDetails?.dateEffectiveFrom ? [{
            title: "WS_MODIFICATIONS_EFFECTIVE_FROM",
            value: wsDataDetails?.dateEffectiveFrom ? convertEpochToDate(wsDataDetails?.dateEffectiveFrom) : t("NA"),
            oldValue: wsDataDetails?.dateEffectiveFrom != wsOldData?.dateEffectiveFrom ? [
              {
                value: wsDataDetails?.dateEffectiveFrom ? convertEpochToDate(wsDataDetails?.dateEffectiveFrom) : t("NA"), className: "newValue", style: { display: "inline" }
              },
              {
                value: `${t("WS_OLD_LABEL_NAME")} ${wsOldData?.dateEffectiveFrom ? convertEpochToDate(wsOldData?.dateEffectiveFrom) : t("NA")}`,
                style: { color: 'gray', paddingLeft: "10px", display: "inline", fontSize: "13px" }, className: "oldValue"
              }
            ] : null
          }] : [])
        ]
    };

    let details = [];
    const isLabelShow = {
      title: "",
      asSectionHeader: true,
      isLabelShow: true,
      additionalDetails: { isLabelShow: true },
    };
    details = [...details, isLabelShow, applicationHeaderDetails, propertyDetails, connectionHolderDetails, connectionDetails, activationDetails, documentDetails];
    wsDataDetails.serviceType = serviceDataType;

    return {
      applicationData: wsDataDetails,
      applicationDetails: details,
      tenantId: wsDataDetails?.tenantId,
      applicationNo: wsDataDetails?.applicationNo,
      applicationStatus: wsDataDetails?.applicationStatus,
      propertyDetails: propertyDataDetails,
      processInstancesDetails: workFlowDataDetails?.ProcessInstances,
      oldApplication: wsOldData
    };
  },

  applicationDetailsBillAmendment: async (t, tenantId, applicationNumber, serviceType = "WATER", config = {}, businessService="WS.AMENDMENT") => {
    businessService = serviceType === "WATER" ? "WS.AMENDMENT" : "SW.AMENDMENT";
    const businessServiceWf = await WorkflowService.init(tenantId,businessService)
    
    let billAmendSearchService="WS";
    if(serviceType!="WATER"){
     billAmendSearchService="SW"
    }
    const billAmendmentSearch = await WSSearch.searchAmendment(tenantId, applicationNumber,billAmendSearchService)

    const filtersForWSSearch = {
      connectionNumber: billAmendmentSearch.Amendments[0].consumerCode,
      searchType: "CONNECTION",
      billAmendSearchService,
      isPropertyDetailsRequired: true
    }

    let propertyids = "", consumercodes = "", businessIds = "";

    const response = await WSSearch.application(tenantId, filtersForWSSearch, serviceType);
    
    const wsData = cloneDeep(response?.WaterConnection || response?.SewerageConnections)

    const filters = { applicationNumber: wsData?.[0]?.applicationNo };

    wsData?.forEach(item => {
      propertyids = propertyids + item?.propertyId + (",");
      consumercodes = consumercodes + item?.applicationNo + ",";
    });

    let propertyfilter = { propertyIds: propertyids.substring(0, propertyids.length - 1), }

    if (propertyids !== "" && filters?.locality) propertyfilter.locality = filters?.locality;

    config = { enabled: propertyids !== "" ? true : false }

    const properties = await WSSearch.property(tenantId, propertyfilter);

    const {Demands: BillDemandDetails} = await PaymentService.demandSearch(tenantId, filtersForWSSearch?.connectionNumber, billAmendSearchService)
    const billServiceTaxHeadMaster = await MdmsService.getWSTaxHeadMaster(tenantId, "WS")
    const billServiceTaxHeadMasterForBillAmendment = billServiceTaxHeadMaster?.BillingService?.TaxHeadMaster?.filter(w=>w.IsBillamend)
    const actualFieldsAndAmountOfBillDetails = BillDemandDetails?.[0]?.demandDetails.filter( e => billServiceTaxHeadMasterForBillAmendment.find(taxHeadMaster => taxHeadMaster.code === e.taxHeadMasterCode))
    const billData = await WSSearch.searchBills(tenantId, consumercodes);

    if (filters?.applicationNumber) businessIds = filters?.applicationNumber;
    
    const workflowDetails = await WSSearch.workflowDataDetails(tenantId, applicationNumber);
    
    const wsDataDetails = cloneDeep(response?.WaterConnection?.[0] || response?.SewerageConnections?.[0]);
    const propertyDataDetails = cloneDeep(properties?.Properties?.[0]);
    const billDetails = cloneDeep(billData);
    const workFlowDataDetails = cloneDeep(workflowDetails);
    const serviceDataType = cloneDeep(serviceType);

    const applicationHeaderDetails = {
      title: " ",
      asSectionHeader: true,
      values: [
        { title: "PDF_STATIC_LABEL_CONSUMER_NUMBER_LABEL", value: wsDataDetails?.connectionNo || t("NA") },
      ]
    };

    const propertyDetails = {
      title: "WS_AMOUNT_DETAILS",
      asSectionHeader: true,
      values: [...actualFieldsAndAmountOfBillDetails.map( e => ({
        title: e?.taxHeadMasterCode, value: `₹ ${e?.taxAmount}`
      })), { title: "WS_REVISED_DEMAND", value: `₹ ${Math.round(actualFieldsAndAmountOfBillDetails.reduce((acc, curr) => curr.taxAmount + acc, 0))}` }]
    };
    
    const tableData = billAmendmentSearch?.Amendments?.[0]?.additionalDetails?.searchBillDetails;
    const action = tableData?.action;
    const tableHeader = ["WS_TAX_HEAD","WS_CURRENT_DEMAND",`WS_${action}_HEAD`,"WS_REVISED_DEMAND"]
    const tableRows = []
    const taxHeads = Object.keys(tableData?.actionPerformed)
    const actionPerformed = tableData?.actionPerformed
    const originalDemand = tableData?.originalDemand
    const getTaxHeadAmount = (obj,taxHead) => {
      return parseInt(obj[taxHead] ? obj[taxHead] : 0)
    }
    
    let sumCurrent=0;
    let sumApplied=0;
    let sumRevised=0;
    taxHeads.map(taxHead => {
      const currentDemand = getTaxHeadAmount(originalDemand, taxHead)
      const appliedDemand = getTaxHeadAmount(actionPerformed, taxHead)
      const revisedDemand = action==="REBATE"?currentDemand-appliedDemand:currentDemand+appliedDemand
      sumCurrent += currentDemand
      sumApplied += appliedDemand
      sumRevised += revisedDemand
      tableRows.push([taxHead,`₹${currentDemand}`,`₹${appliedDemand}`,`₹${revisedDemand}`])
    })
    tableRows.push(["WS_TOTAL_DUE",`₹${sumCurrent}`,`₹${sumApplied}`,`₹${sumRevised}`])
    
    const tableDetails = {
      title: "WS_AMOUNT_DETAILS",
      asSectionHeader: true,
      isTable:true,
      headers:tableHeader,
      action,
      tableRows
    }

    function getReasonDocNoHeader(amendmentReason){
      if(amendmentReason === "COURT_CASE_SETTLEMENT")
      return "WS_COURT_ORDER_NO";
      else if(amendmentReason === "ARREAR_WRITE_OFF" || amendmentReason === "ONE_TIME_SETTLEMENT")
      return "WS_GOVERNMENT_NOTIFICATION_NUMBER";
      else
      return "WS_DOCUMENT_NO";
    }

    let connectionHolderDetails = {
      title: "WS_DEMAND_REVISION_BASIS_DETAILS",
      asSectionHeader: true,
      values: [
        { title: "WS_DEMAND_REVISION_BASIS", value: billAmendmentSearch?.Amendments?.[0]?.amendmentReason },
        { title: getReasonDocNoHeader(billAmendmentSearch?.Amendments?.[0]?.amendmentReason), value: billAmendmentSearch?.Amendments?.[0]?.reasonDocumentNumber },
        { title: "WS_COMMON_FROM_DATE_LABEL", value: Digit.DateUtils.ConvertTimestampToDate(billAmendmentSearch?.Amendments?.[0]?.effectiveFrom) },
        {...billAmendmentSearch?.Amendments?.[0]?.amendmentReason !== "COURT_CASE_SETTLEMENT" && { title: "WS_COMMON_TO_DATE_LABEL", value: Digit.DateUtils.ConvertTimestampToDate(billAmendmentSearch?.Amendments?.[0]?.effectiveTill) }},
      ]?.filter((ob) => JSON.stringify(ob) !== "{}")
    };
    const documentDetails = {
      title: "",
      asSectionHeader: true,
      additionalDetails: {
        documents: [{
          title: "BILL_AMEND_DOCS_UPLOADED",
          BS:'BillAmend',
          values: billAmendmentSearch.Amendments[0]?.documents?.map((document) => {
            return {
              title: `WS_${document?.documentType}`,
              documentType: document?.documentType,
              documentUid: document?.documentUid,
              fileStoreId: document?.fileStoreId,
            };
          }),
        },
        ]
      }
    };

    const details = [applicationHeaderDetails, tableDetails , connectionHolderDetails, documentDetails]
    wsDataDetails.serviceType = serviceDataType;


    if (billAmendmentSearch?.Amendments?.[0]) {
      wsDataDetails.billAmendmentDetails = billAmendmentSearch.Amendments[0]
      wsDataDetails.isBillAmend = true
    }

    
    return {
      applicationData: wsDataDetails,
      applicationDetails: details,
      tenantId: wsDataDetails?.tenantId,
      applicationNo: wsDataDetails?.applicationNo,
      applicationStatus: wsDataDetails?.applicationStatus,
      propertyDetails: propertyDataDetails,
      billDetails: billDetails?.Bill,
      processInstancesDetails: workFlowDataDetails?.ProcessInstances,
      amendment: billAmendmentSearch.Amendments[0], 
      businessServiceWf
    };
  },
  applicationDetailsBillAmendmentv2: async() => {

  }
  , 
  connectionDetails: async (t, tenantId, connectionNumber, serviceType = "WATER", config = {}) => {
    const filters = { connectionNumber, searchType: "CONNECTION" };

    let propertyids = "",
      consumercodes = "",
      businessIds = [];

    const response = await WSSearch.application(tenantId, filters, serviceType);

    const wsData = cloneDeep(serviceType == "WATER" ? response?.WaterConnection : response?.SewerageConnections);

    wsData?.forEach((item) => {
      propertyids = propertyids + item?.propertyId + ",";
      consumercodes = consumercodes + item?.connectionNo + ",";
    });

    let propertyfilter = { propertyIds: propertyids.substring(0, propertyids.length - 1) };

    if (propertyids !== "" && filters?.locality) propertyfilter.locality = filters?.locality;

    config = { enabled: propertyids !== "" ? true : false };

    const properties = await WSSearch.property(tenantId, propertyfilter);

    const wsResponseForWorkflow = await WSSearch.application(tenantId, { connectionNumber }, serviceType);

    const wsResponseForWorkflowData = cloneDeep(serviceType == "WATER" ? wsResponseForWorkflow?.WaterConnection : wsResponseForWorkflow?.SewerageConnections);
    
    const noOfConnections = cloneDeep(wsResponseForWorkflowData);
    let isDisconnectionDone = false;
    if (noOfConnections?.length > 0) {
      const data = noOfConnections?.filter(data => data?.applicationStatus == "DISCONNECTION_EXECUTED" && data?.applicationType.includes("DISCONNECT"));
      if (data?.length) isDisconnectionDone = true;
    }
    
    wsResponseForWorkflowData?.forEach((item) => {
      item?.applicationNo &&  businessIds.push(item?.applicationNo);
    });

    const workflowDetails = await WSSearch.workflowDataDetails(tenantId, businessIds.join(","));

    const wsDataDetails = cloneDeep(serviceType == "WATER" ? response?.WaterConnection?.[0] : response?.SewerageConnections?.[0]);
    
    const propertyDataDetails = cloneDeep(properties?.Properties?.[0]);
    const workFlowDataDetails = cloneDeep(workflowDetails);
    const serviceDataType = cloneDeep(serviceType);

    const serviceTypeOfData = serviceType == "WATER" ? "WS" : "SW";
    const collectionNumber = wsDataDetails?.connectionNo;
    const colletionOFData = await WSSearch.colletionData({tenantId, serviceTypeOfData, collectionNumber}, {});
    const fetchBills = await WSSearch.fetchBillData({ tenantId, serviceTypeOfData, collectionNumber});


    const applicationHeaderDetails = {
      title: "WS_COMMON_SERV_DETAIL",
      asSectionHeader: true,
      values:
        serviceType == "WATER"
          ? [
              { title: "PDF_STATIC_LABEL_CONSUMER_NUMBER_LABEL", value: wsDataDetails?.connectionNo || t("NA") },
              { title: "WS_SERVICE_NAME_LABEL", value: t(`WS_APPLICATION_TYPE_${wsDataDetails?.applicationType? wsDataDetails?.applicationType : wsDataDetails?.serviceType}`) },
              {
                title: "WS_SERV_DETAIL_CONN_TYPE",
                value: wsDataDetails?.connectionType
                  ? t(`WS_SERVICES_MASTERS_WATERSOURCE_${stringReplaceAll(wsDataDetails?.connectionType?.toUpperCase(), " ", "_")}`)
                  : t("NA"),
              },
              { title: "WS_SERV_DETAIL_NO_OF_TAPS", value: wsDataDetails?.noOfTaps || t("NA") },
              { title: "WS_PIPE_SIZE_IN_INCHES_LABEL", value: wsDataDetails?.pipeSize || t("NA") },
              {
                title: "WS_SERV_DETAIL_WATER_SOURCE",
                value: wsDataDetails?.waterSource
                  ? t(`WS_SERVICES_MASTERS_WATERSOURCE_${wsDataDetails?.waterSource?.toUpperCase()?.split(".")[0]}`)
                  : t("NA"),
              },
              {
                title: "WS_SERV_DETAIL_WATER_SUB_SOURCE",
                value: wsDataDetails?.waterSource ? t(`${wsDataDetails?.waterSource?.toUpperCase()?.split(".")[1]}`) : t("NA"),
              },
              {
                title: "WS_SERV_DETAIL_CONN_EXECUTION_DATE",
                value: wsDataDetails?.connectionExecutionDate ? convertEpochToDate(wsDataDetails?.connectionExecutionDate) : t("NA"),
              },
              { title: "WS_SERV_DETAIL_METER_ID", value: wsDataDetails?.meterId || t("NA") },
              {
                title: "WS_INSTALLATION_DATE_LABEL",
                value: wsDataDetails?.meterInstallationDate ? convertEpochToDate(wsDataDetails?.meterInstallationDate) : t("NA"),
              },
              { title: "WS_INITIAL_METER_READING_LABEL", value: wsDataDetails?.additionalDetails?.initialMeterReading || t("NA") },
              {
                title: "WS_VIEW_CONSUMPTION_DETAIL",
                to: `/digit-ui/employee/ws/consumption-details?applicationNo=${wsDataDetails?.connectionNo}&tenantId=${wsDataDetails?.tenantId}&service=${serviceType}&from=${window.location.href.includes("bill-details") ? "ABG_BILL_DETAILS_HEADER" : "WS_COMMON_CONNECTION_DETAIL"}`,
                value: "",
                isLink: wsDataDetails?.connectionType ==="Metered" ? true:false,
              },
            ]
          : [
              { title: "PDF_STATIC_LABEL_CONSUMER_NUMBER_LABEL", value: wsDataDetails?.connectionNo || t("NA") },
              { title: "WS_SERVICE_NAME_LABEL", value: t(`WS_APPLICATION_TYPE_${wsDataDetails?.applicationType? wsDataDetails?.applicationType : wsDataDetails?.serviceType}`) },
              { title: "WS_NUMBER_WATER_CLOSETS_LABEL", value: wsDataDetails?.noOfWaterClosets || t("NA") },
              { title: "WS_SERV_DETAIL_NO_OF_TOILETS", value: wsDataDetails?.noOfToilets || t("NA") },
              {
                title: "WS_SERV_DETAIL_CONN_EXECUTION_DATE",
                value: wsDataDetails?.connectionExecutionDate ? convertEpochToDate(wsDataDetails?.connectionExecutionDate) : t("NA"),
              },
            ],
    };

    const propertyDetails = {
      title: "WS_COMMON_PROPERTY_DETAILS",
      asSectionHeader: true,
      values: [
        { title: "WS_PROPERTY_ID_LABEL", value: propertyDataDetails?.propertyId },
        { title: "WS_COMMON_OWNER_NAME_LABEL", 
          value: getOwnerNames(propertyDataDetails),
          privacy: {
            uuid: propertyDataDetails?.owners?.[0]?.uuid, 
            fieldName: "name", 
            model: "User"
          }
        },
        { title: "WS_PROPERTY_ADDRESS_LABEL",
          value: getAddress(propertyDataDetails?.address, t),
          privacy: {
            uuid: propertyDataDetails?.owners?.[0]?.uuid, 
            fieldName: ["doorNo" , "street" , "landmark"], 
            model: "Property",showValue: true,
            loadData: {
              serviceName: "/property-services/property/_search",
              requestBody: {},
              requestParam: { tenantId, propertyIds : propertyids },
              jsonPath: "Properties[0].address.street",
              isArray: false,
              d: (res) => {
                let resultString = (_.get(res,"Properties[0].address.doorNo") ?  `${_.get(res,"Properties[0].address.doorNo")}, ` : "") + (_.get(res,"Properties[0].address.street")? `${_.get(res,"Properties[0].address.street")}, ` : "") + (_.get(res,"Properties[0].address.landmark") ? `${_.get(res,"Properties[0].address.landmark")}`:"")
                return resultString;
              }
            }
          }
        },
        {
          title: "WS_VIEW_PROPERTY_DETAIL",
          to: `/digit-ui/employee/pt/property-details/${propertyDataDetails?.propertyId}?from=${window.location.href.includes("bill-details") ? "ABG_BILL_DETAILS_HEADER" : "WS_COMMON_CONNECTION_DETAIL"}`,
          value: "",
          isLink: true,
        },
      ],
    };

    const connectionHolderDetails = {
      title: "WS_COMMON_CONNECTION_HOLDER_DETAILS_HEADER",
      asSectionHeader: true,
      values:
        wsDataDetails?.connectionHolders != null && wsDataDetails?.connectionHolders.length > 0
          ? [
              { 
                title: "WS_OWN_DETAIL_NAME", 
                value: wsDataDetails?.connectionHolders?.[0]?.name || t("NA"),
                privacy: {
                  uuid: wsDataDetails?.connectionHolders?.[0]?.uuid, 
                  fieldName: "name", 
                  model: "WnSConnectionOwner"
                }
              },
              { 
                title: "WS_CONN_HOLDER_OWN_DETAIL_GENDER_LABEL", 
                value: wsDataDetails?.connectionHolders?.[0]?.gender,
                privacy: { 
                  uuid: wsDataDetails?.connectionHolders?.[0]?.uuid, 
                  fieldName: "gender", 
                  model: "WnSConnectionOwner",showValue: false,
                  loadData: {
                    serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                    requestBody: {},
                    requestParam: { tenantId, connectionNumber, searchType: "CONNECTION" },
                    jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].gender" : "SewerageConnections[0].connectionHolders[0].gender",
                    isArray: false,
                  },
                } 
              },
              { 
                title: "CORE_COMMON_MOBILE_NUMBER", 
                value: wsDataDetails?.connectionHolders?.[0]?.mobileNumber,
                privacy: { 
                  uuid: wsDataDetails?.connectionHolders?.[0]?.uuid, 
                  fieldName: "connectionHoldersMobileNumber", 
                  model: "WnSConnectionOwner",showValue: false,
                  loadData: {
                    serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                    requestBody: {},
                    requestParam: { tenantId, connectionNumber, searchType: "CONNECTION" },
                    jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].mobileNumber" : "SewerageConnections[0].connectionHolders[0].mobileNumber",
                    isArray: false,
                  },
                } 
              },
              { 
                title: "WS_CONN_HOLDER_COMMON_FATHER_OR_HUSBAND_NAME", 
                value: wsDataDetails?.connectionHolders?.[0]?.fatherOrHusbandName,
                privacy: { 
                  uuid: wsDataDetails?.connectionHolders?.[0]?.uuid, 
                  fieldName: "fatherOrHusbandName", 
                  model: "WnSConnectionOwner",showValue: false,
                  loadData: {
                    serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                    requestBody: {},
                    requestParam: { tenantId, connectionNumber, searchType: "CONNECTION" },
                    jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].fatherOrHusbandName" : "SewerageConnections[0].connectionHolders[0].fatherOrHusbandName",
                    isArray: false,
                  },
                }
              },
              { title: "WS_CONN_HOLDER_OWN_DETAIL_RELATION_LABEL", value: wsDataDetails?.connectionHolders?.[0]?.relationship,
                privacy: { 
                  uuid: wsDataDetails?.connectionHolders?.[0]?.uuid, 
                  fieldName: ["relationship"], 
                  model: "WnSConnection",showValue: false,
                  loadData: {
                    serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                    requestBody: {},
                    requestParam: { tenantId, connectionNumber, searchType: "CONNECTION" },
                    jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].relationship" : "SewerageConnections[0].connectionHolders[0].relationship",
                    isArray: false,
                  },
                }  
              },
              { 
                title: "WS_CORRESPONDANCE_ADDRESS_LABEL", 
                value: wsDataDetails?.connectionHolders?.[0]?.correspondenceAddress,
                privacy: { 
                  uuid: wsDataDetails?.connectionHolders?.[0]?.uuid, 
                  fieldName: "correspondenceAddress", 
                  model: "WnSConnectionOwner",showValue: false,
                  loadData: {
                    serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                    requestBody: {},
                    requestParam: { tenantId, connectionNumber, searchType: "CONNECTION" },
                    jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].correspondenceAddress" : "SewerageConnections[0].connectionHolders[0].correspondenceAddress",
                    isArray: false,
                  },
                }
              },
              { title: "WS_OWNER_SPECIAL_CATEGORY", value: wsDataDetails?.connectionHolders?.[0]?.ownerType ? !(wsDataDetails?.connectionHolders?.[0]?.ownerType?.includes("*")) ? `PROPERTYTAX_OWNERTYPE_${wsDataDetails?.connectionHolders?.[0]?.ownerType?.toUpperCase()}` : wsDataDetails?.connectionHolders?.[0]?.ownerType : "NA",
              privacy: { 
                uuid: wsDataDetails?.connectionHolders?.[0]?.uuid, 
                fieldName: ["ownerType"], 
                model: "WnSConnection",showValue: false,
                loadData: {
                  serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                  requestBody: {},
                  requestParam: { tenantId, connectionNumber, searchType: "CONNECTION" },
                  jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].ownerType" : "SewerageConnections[0].connectionHolders[0].ownerType",
                  isArray: false,
                  d: (res) => {
                    let resultString = (res?.WaterConnection?.[0] ? t(`PROPERTYTAX_OWNERTYPE_${res?.WaterConnection?.[0]?.connectionHolders?.[0]?.ownerType?.toUpperCase()}`) : t(`PROPERTYTAX_OWNERTYPE_${res?.SewerageConnections?.[0]?.connectionHolders?.[0]?.ownerType?.toUpperCase()}`));
                    return resultString;
                  }
              },
              } }
            ]
          : [{ title: "WS_CONN_HOLDER_SAME_AS_OWNER_DETAILS", value: t("SCORE_YES") }],
    };

    const isApplicationApproved =  workFlowDataDetails?.ProcessInstances?.[0]?.state.isTerminateState  
    const isLabelShow = {
      title: "",
      asSectionHeader: true,
      isLabelShow: true,
      additionalDetails: { isLabelShow: true },
    };

    let details = [];
    details = [...details, isLabelShow, applicationHeaderDetails, propertyDetails, connectionHolderDetails];
    wsDataDetails.serviceType = serviceDataType;
    wsDataDetails.property = propertyDataDetails;
    return {
      applicationData: wsDataDetails,
      applicationDetails: details,
      tenantId: wsDataDetails?.tenantId,
      applicationNo: wsDataDetails?.applicationNo,
      applicationStatus: wsDataDetails?.applicationStatus,
      propertyDetails: propertyDataDetails,
      processInstancesDetails: workFlowDataDetails?.ProcessInstances,
      colletionOfData: colletionOFData?.Payments,
      fetchBillsData: fetchBills?.Bill,
      isApplicationApproved: isApplicationApproved,
      isDisconnectionDone: isDisconnectionDone
    };
  },

  disConnectionDetails: async (t, tenantId, applicationNumber, serviceType = "WATER", config = {}) => {
    const filters = { applicationNumber };
    let propertyids = "", consumercodes = "", businessIds = "";

    const response = await WSSearch.application(tenantId, filters, serviceType);

    const appSessionDetails = sessionStorage.getItem("WS_SESSION_APPLICATION_DETAILS");
    const wsApplicationDetails = appSessionDetails ? JSON.parse(appSessionDetails) : "";
    if (
      response?.WaterConnection?.[0] && 
      wsApplicationDetails?.applicationType &&
      wsApplicationDetails?.applicationNo == response?.WaterConnection?.[0]?.applicationNo
      ) {
      response.WaterConnection[0] = wsApplicationDetails;
    }

    if (
      response?.SewerageConnections?.[0] && 
      wsApplicationDetails?.applicationType && 
      wsApplicationDetails?.applicationNo == response?.SewerageConnections?.[0]?.applicationNo
      ) {
      response.SewerageConnections[0] = wsApplicationDetails;
    }

    const wsData = cloneDeep(serviceType == "WATER" ? response?.WaterConnection : response?.SewerageConnections);

    wsData?.forEach((item) => { propertyids = propertyids + item?.propertyId + ","; consumercodes = consumercodes + item?.applicationNo + ","; });

    let propertyfilter = { propertyIds: propertyids.substring(0, propertyids.length - 1) };

    if (propertyids !== "" && filters?.locality) propertyfilter.locality = filters?.locality;

    config = { enabled: propertyids !== "" ? true : false };

    const properties = await WSSearch.property(tenantId, propertyfilter);

    if (filters?.applicationNumber) businessIds = filters?.applicationNumber;

    const workflowDetails = await WSSearch.workflowDataDetails(tenantId, businessIds);

    tenantId = wsData?.[0]?.tenantId ? wsData?.[0]?.tenantId : tenantId;
    const serviceTypeOfData = serviceType == "WATER" ? "WS" : "SW";
    const collectionNumber = wsData?.[0]?.connectionNo;

    const fetchBillData = await WSSearch.fetchBillData({ tenantId, serviceTypeOfData, collectionNumber });

    const wsDataDetails = cloneDeep(wsData?.[0]);
    const propertyDataDetails = cloneDeep(properties?.Properties?.[0]);
    const workFlowDataDetails = cloneDeep(workflowDetails);
    const serviceDataType = cloneDeep(serviceType);
    const wsApplicationType = cloneDeep(wsDataDetails?.applicationType);
    let applicationType = "";
    if (wsApplicationType.includes("DISCONNECT") && wsDataDetails?.isDisconnectionTemporary) applicationType = "WS_DISCONNECTIONTYPE_TEMPORARY";
    else applicationType = "WS_DISCONNECTIONTYPE_PERMANENT";


    const applicationHeaderDetails = {
      title: " ",
      asSectionHeader: true,
      values:
        [
          { title: "PDF_STATIC_LABEL_APPLICATION_NUMBER_LABEL", value: wsDataDetails?.applicationNo || t("NA") },
          { title: "PDF_STATIC_LABEL_CONSUMER_NUMBER_LABEL", value: wsDataDetails?.connectionNo || t("NA") },
          { title: "WS_SERVICE_NAME_LABEL", value: t(`WS_APPLICATION_TYPE_${wsDataDetails?.applicationType? wsDataDetails?.applicationType : wsDataDetails?.serviceType}`) },
          { title: "PDF_STATIC_LABEL_WS_CONSOLIDATED_ACKNOWELDGMENT_DISCONNECTION_TYPE", value: t(`${applicationType}`) },
          { title: "WNS_COMMON_TABLE_COL_AMT_DUE_LABEL", value: fetchBillData.Bill[0]?.totalAmount ? "₹ " + fetchBillData.Bill[0]?.totalAmount : "₹ 0" },
          { title: "WS_DISCONNECTION_PROPOSED_DATE", value: wsDataDetails?.dateEffectiveFrom ? convertEpochToDate(wsDataDetails?.dateEffectiveFrom) : t("NA") },
          { title: "WS_DISCONNECTION_EXECUTED_DATE", value: wsDataDetails?.disconnectionExecutionDate ? convertEpochToDate(wsDataDetails?.disconnectionExecutionDate) : t("NA") },
          { title: "WS_DISCONNECTION_REASON", value: wsDataDetails?.disconnectionReason || t("NA") },
        ]
    };

    const propertyDetails = {
      title: "WS_COMMON_PROPERTY_DETAILS",
      asSectionHeader: true,
      values: [
        { title: "WS_PROPERTY_ID_LABEL", value: propertyDataDetails?.propertyId },
        { title: "WS_COMMON_OWNER_NAME_LABEL", value: getOwnerNames(propertyDataDetails) },
        { title: "WS_PROPERTY_ADDRESS_LABEL", value: getAddress(propertyDataDetails?.address, t),
        privacy: {
          uuid: propertyDataDetails?.owners?.[0]?.uuid, 
          fieldName: ["doorNo" , "street" , "landmark"], 
          model: "Property",showValue: true,
          loadData: {
            serviceName: "/property-services/property/_search",
            requestBody: {},
            requestParam: { tenantId, propertyIds : propertyids },
            jsonPath: "Properties[0].address.street",
            isArray: false,
            d: (res) => {
              let resultString = (_.get(res,"Properties[0].address.doorNo") ?  `${_.get(res,"Properties[0].address.doorNo")}, ` : "") + (_.get(res,"Properties[0].address.street")? `${_.get(res,"Properties[0].address.street")}, ` : "") + (_.get(res,"Properties[0].address.landmark") ? `${_.get(res,"Properties[0].address.landmark")}`:"")
              return resultString;
            }
          }
        } },
      ],
      additionalDetails: {
        redirectUrl: {
          title: t("WS_VIEW_PROPERTY_DETAILS"),
          url: `/digit-ui/employee/pt/property-details/${propertyDataDetails?.propertyId}?from=WS_APPLICATION_DETAILS_HEADER`,
        },
      },
    };

    const connectionHolderDetails = {
      title: "WS_COMMON_CONNECTION_HOLDER_DETAILS_HEADER",
      asSectionHeader: true,
      values:
        wsDataDetails?.connectionHolders?.length > 0
          ? [
            { title: "WS_OWN_DETAIL_NAME", value: wsDataDetails?.connectionHolders?.[0]?.name || t("NA"),
            privacy: {
              uuid: wsDataDetails?.connectionHolders?.[0]?.uuid,
              fieldName: ["name"],
              model: "WnSConnectionOwner",
            }  },
            { title: "WS_CONN_HOLDER_OWN_DETAIL_GENDER_LABEL", value: wsDataDetails?.connectionHolders?.[0]?.gender ,
            privacy: {
              uuid: wsDataDetails?.connectionHolders?.[0]?.uuid,
              fieldName: ["gender"],
              model: "WnSConnectionOwner",showValue: false,
              loadData: {
                serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                requestBody: {},
                requestParam: { tenantId, applicationNumber },
                jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].gender" : "SewerageConnections[0].connectionHolders[0].gender",
                isArray: false,
              },
            } },
            { title: "CORE_COMMON_MOBILE_NUMBER", value: wsDataDetails?.connectionHolders?.[0]?.mobileNumber,
            privacy: { uuid: wsDataDetails?.connectionHolders?.[0]?.uuid, fieldName: ["connectionHoldersMobileNumber"], model: "WnSConnectionOwner",showValue: false,
            loadData: {
              serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
              requestBody: {},
              requestParam: { tenantId, applicationNumber },
              jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].mobileNumber" : "SewerageConnections[0].connectionHolders[0].mobileNumber",
              isArray: false,
            }, } },
            { title: "WS_CONN_HOLDER_COMMON_FATHER_OR_HUSBAND_NAME", value: wsDataDetails?.connectionHolders?.[0]?.fatherOrHusbandName,
            privacy: { uuid: wsDataDetails?.connectionHolders?.[0]?.uuid, fieldName: ["fatherOrHusbandName"], model: "WnSConnectionOwner",showValue: false,
            loadData: {
              serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
              requestBody: {},
              requestParam: { tenantId, applicationNumber },
              jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].fatherOrHusbandName" : "SewerageConnections[0].connectionHolders[0].fatherOrHusbandName",
              isArray: false,
            }, } },
            { title: "WS_CONN_HOLDER_OWN_DETAIL_RELATION_LABEL", value: wsDataDetails?.connectionHolders?.[0]?.relationship,
            privacy: { uuid: wsDataDetails?.connectionHolders?.[0]?.uuid, fieldName: ["relationship"], model: "WnSConnection",showValue: false,
            loadData: {
              serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
              requestBody: {},
              requestParam: { tenantId, applicationNumber },
              jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].relationship" : "SewerageConnections[0].connectionHolders[0].relationship",
              isArray: false,
            }, }, },
            { title: "WS_CORRESPONDANCE_ADDRESS_LABEL", value: wsDataDetails?.connectionHolders?.[0]?.correspondenceAddress,
            privacy: {
              uuid: wsDataDetails?.connectionHolders?.[0]?.uuid,
              fieldName: wsDataDetails?.connectionHolders[0]?.permanentAddress ? ["permanentAddress"] : ["correspondenceAddress"],
              model: "WnSConnectionOwner",
              hide: !(wsDataDetails?.connectionHolders[0]?.permanentAddress || wsDataDetails?.connectionHolders[0]?.correspondenceAddress),showValue: false,
              loadData: {
                serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                requestBody: {},
                requestParam: { tenantId, applicationNumber },
                jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].correspondenceAddress" : "SewerageConnections[0].connectionHolders[0].correspondenceAddress",
                isArray: false,
              },
            } },
            { title: "WS_OWNER_SPECIAL_CATEGORY", value: wsDataDetails?.connectionHolders?.[0]?.ownerType ? !(wsDataDetails?.connectionHolders?.[0]?.ownerType?.includes("*")) ? `PROPERTYTAX_OWNERTYPE_${wsDataDetails?.connectionHolders?.[0]?.ownerType?.toUpperCase()}` : wsDataDetails?.connectionHolders?.[0]?.ownerType : "NA" ,
            privacy: { uuid: wsDataDetails?.connectionHolders?.[0]?.uuid, fieldName: ["ownerType"], model: "WnSConnection",showValue: false,
            loadData: {
              serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
              requestBody: {},
              requestParam: { tenantId, applicationNumber },
              jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].ownerType" : "SewerageConnections[0].connectionHolders[0].ownerType",
              isArray: false,
              d: (res) => {
                let resultString = (res?.WaterConnection?.[0] ? t(`PROPERTYTAX_OWNERTYPE_${res?.WaterConnection?.[0]?.connectionHolders?.[0]?.ownerType?.toUpperCase()}`) : t(`PROPERTYTAX_OWNERTYPE_${res?.SewerageConnections?.[0]?.connectionHolders?.[0]?.ownerType?.toUpperCase()}`));
                return resultString;
              }
          }, }},
          ]
          : [{ title: "WS_CONN_HOLDER_SAME_AS_OWNER_DETAILS", value: t("SCORE_YES") }],
    };

    const plumberDetails = {
      title: "WS_COMMON_PLUMBER_DETAILS",
      asSectionHeader: true,
      values:
        wsDataDetails?.additionalDetails?.detailsProvidedBy === "ULB"
          ? [
            {
              title: "WS_ADDN_DETAILS_PLUMBER_PROVIDED_BY",
              value: wsDataDetails?.additionalDetails?.detailsProvidedBy
                ? t(`WS_PLUMBER_${wsDataDetails?.additionalDetails?.detailsProvidedBy?.toUpperCase()}`)
                : t("NA"),
            },
            { title: "WS_ADDN_DETAILS_PLUMBER_LICENCE_NO_LABEL", value: wsDataDetails?.plumberInfo?.[0]?.licenseNo || t("NA") },
            { title: "WS_ADDN_DETAILS_PLUMBER_NAME_LABEL", value: wsDataDetails?.plumberInfo?.[0]?.name || t("NA") },
            { title: "WS_PLUMBER_MOBILE_NO_LABEL", value: wsDataDetails?.plumberInfo?.[0]?.mobileNumber || t("NA"),privacy: { uuid: wsDataDetails?.applicationNo, fieldName: ["plumberInfoMobileNumber"], model: "WnSConnectionPlumber",showValue: false,
            loadData: {
              serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
              requestBody: {},
              requestParam: { tenantId, applicationNumber },
              jsonPath: serviceType === "WATER" ? "WaterConnection[0].plumberInfo[0].mobileNumber" : "SewerageConnections[0].plumberInfo[0].mobileNumber",
              isArray: false,
            }, }  },
          ]
          : [
            {
              title: "WS_ADDN_DETAILS_PLUMBER_PROVIDED_BY",
              value: wsDataDetails?.additionalDetails?.detailsProvidedBy
                ? t(`WS_PLUMBER_${wsDataDetails?.additionalDetails?.detailsProvidedBy?.toUpperCase()}`)
                : t("NA"),
            },
          ]
    };

    const documentDetails = {
      title: "",
      asSectionHeader: true,
      additionalDetails: {
        documents: [
          {
            title: "WS_COMMON_DOCS",
            values: wsDataDetails?.documents?.map((document) => {
              return {
                title: `WS_${document?.documentType}`,
                documentType: document?.documentType,
                documentUid: document?.documentUid,
                fileStoreId: document?.fileStoreId,
              };
            }),
          },
        ],
      },
    };

    let details = [];
    details = [...details, applicationHeaderDetails, propertyDetails, connectionHolderDetails, plumberDetails, documentDetails];
    wsDataDetails.serviceType = serviceDataType;
    //for unmasking of plumber mobilenumber in FI/DV edit disconnection
    sessionStorage.removeItem("IsDetailsExists");

    return {
      applicationData: wsDataDetails,
      applicationDetails: details,
      tenantId: wsDataDetails?.tenantId,
      applicationNo: wsDataDetails?.applicationNo,
      applicationStatus: wsDataDetails?.applicationStatus,
      propertyDetails: propertyDataDetails,
      processInstancesDetails: workFlowDataDetails?.ProcessInstances,
    };

  }
};
