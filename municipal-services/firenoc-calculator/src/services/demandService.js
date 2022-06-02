import { generateDemandSearchURL, generateGetBillURL } from "../utils";
import { httpRequest } from "../utils/api";
import get from "lodash/get";
import envVariables from "../envVariables";
import { mdmsFiananceYear } from "./mdmsService";

export const generateDemand = async (requestInfo, tenantId, calculations) => {
  let consumercodeList = calculations.map(calculation => {
    return calculation.applicationNumber;
  });
  let mdms = await mdmsFiananceYear(requestInfo, tenantId);

  let createcalculations = [];
  let updatecalculations = [];
  let demandsSearch = await searchDemand(
    requestInfo,
    tenantId,
    consumercodeList
  );
  let foundConsumerCode = demandsSearch.Demands.map(demand => {
    return demand.consumerCode;
  });
  calculations.map(calculation => {
    if (foundConsumerCode.includes(calculation.applicationNumber))
      updatecalculations.push(calculation);
    else createcalculations.push(calculation);
  });
  if (createcalculations.length > 0) {
    let cr = await createDemand(requestInfo, createcalculations, mdms);
  }
  if (updatecalculations.length > 0) {
    let ud = await updateDemand(
      requestInfo,
      updatecalculations,
      demandsSearch,
      mdms
    );
  }
  return "uri";
};

const createDemand = async (requestInfo, calculations, mdms) => {
  //  let financeYear = mdms.
  let FinancialYearsData = get(mdms, "MdmsRes.egf-master.FinancialYear");
  let demands = [];
  calculations.map(calculation => {
    let tenantId = calculation.tenantId;
    let consumerCode = calculation.applicationNumber;
    let fireNoc = calculation.fireNoc;
    let fnYear = get(fireNoc, "fireNOCDetails.financialYear");
    let FYData = FinancialYearsData.find(i => i.code == fnYear);
    let payer = get(fireNoc, "fireNOCDetails.applicantDetails.owners[0]");
    let demand = {
      tenantId,
      consumerCode,
      consumerType: "FIRENOC",
      payer,
      businessService: envVariables.BUSINESSSERVICE,
      taxPeriodFrom: FYData.startingDate,
      taxPeriodTo: FYData.endingDate,
      demandDetails: []
    };
    calculation.taxHeadEstimates.map(taxHeadEstimate => {
      let demandDetail = {
        taxHeadMasterCode: taxHeadEstimate.taxHeadCode,
        taxAmount: taxHeadEstimate.estimateAmount,
        collectionAmount: 0,
        tenantId
      };
      demand.demandDetails.push(demandDetail);
    });
    demands.push(demand);
  });

  let DemandRequest = {
    RequestInfo: requestInfo,
    Demands: demands
  };
  var demandCreateResponse = await httpRequest({
    hostURL: envVariables.EGOV_BILLINGSERVICE_HOST,
    endPoint: envVariables.EGOV_DEMAND_CREATE_ENDPOINT,
    requestBody: DemandRequest
  });
};

const updateDemand = async (requestInfo, calculations, demandsSearch, mdms) => {
  let FinancialYearsData = get(mdms, "MdmsRes.egf-master.FinancialYear");

  let demandMap = {};
  demandsSearch.Demands.map(demand => {
    if (get(demand, "payer") && !demand.payer.uuid) demand.payer = null; // demand search is sending payer object in case of null
    demandMap = { ...demandMap, [demand.consumerCode]: demand };
  });
  let demands = [];
  calculations.map(calculation => {
    let tenantId = calculation.tenantId;
    let consumerCode = calculation.applicationNumber;
    let fireNoc = calculation.fireNoc;
    let demand = demandMap[consumerCode];
    let demandDetailsMap = {};
    demand.demandDetails.map(demandDetail => {
      demandDetailsMap = {
        ...demandDetailsMap,
        [demandDetail.taxHeadMasterCode]: demandDetail
      };
    });
    calculation.taxHeadEstimates.map(taxHeadEstimate => {
      if (demandDetailsMap.hasOwnProperty(taxHeadEstimate.taxHeadCode)) {
        demandDetailsMap[[taxHeadEstimate.taxHeadCode]].taxAmount =
          taxHeadEstimate.estimateAmount;
      } else {
        let demandDetail = {
          taxHeadMasterCode: taxHeadEstimate.taxHeadCode,
          taxAmount: taxHeadEstimate.estimateAmount,
          collectionAmount: 0,
          tenantId
        };
        demandDetailsMap = {
          ...demandDetailsMap,
          [demandDetail.taxHeadMasterCode]: demandDetail
        };
      }
    });
    demand.demandDetails = Object.values(demandDetailsMap);
    demands.push(demand);
  });

  let DemandRequest = {
    RequestInfo: requestInfo,
    Demands: demands
  };
  var demandUpdateResponse = await httpRequest({
    hostURL: envVariables.EGOV_BILLINGSERVICE_HOST,
    endPoint: envVariables.EGOV_DEMAND_UPDATE_ENDPOINT,
    requestBody: DemandRequest
  });
};

const searchDemand = async (requestInfo, tenantId, consumercodeList) => {
  let uri = generateDemandSearchURL();
  uri = uri.replace("{1}", tenantId);
  uri = uri.replace("{2}", envVariables.BUSINESSSERVICE);
  uri = uri.replace("{3}", consumercodeList.join(","));
  let requestBody = { RequestInfo: requestInfo };
  var demandsSearch = null;
  demandsSearch = await httpRequest({
    hostURL: envVariables.EGOV_BILLINGSERVICE_HOST,
    endPoint: uri,
    requestBody
  });
  return demandsSearch;
};

export const generateBill = async (requestInfo, billCriteria) => {
  const consumerCode = billCriteria.applicationNumber.split(",");
  const tenantId = billCriteria.tenantId;
  let demandsSearch = await searchDemand(requestInfo, tenantId, consumerCode);

  if (demandsSearch.Demands && demandsSearch.Demands.length > 0) {
    let uri = generateGetBillURL(tenantId, consumerCode);
    let requestBody = { RequestInfo: requestInfo };
    var billResponse = await httpRequest({
      hostURL: envVariables.EGOV_BILLINGSERVICE_HOST,
      endPoint: uri,
      requestBody
    });
  } else {
    throw "Invalid Consumer Code ";
  }
  return billResponse;
};