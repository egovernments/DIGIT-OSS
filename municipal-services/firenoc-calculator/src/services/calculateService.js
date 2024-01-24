import { requestInfoToResponseInfo } from "../utils";
import { searchService } from "../controller/search";
import { generateDemand } from "./demandService";
import { getFireNoc } from "./firenocService";
import isEmpty from "lodash/isEmpty";
import envVariables from "../envVariables";
import { mdmsData } from "./mdmsService";

export const calculateService = async (req, pool, next) => {
  let calculalteResponse = {};
  var header = JSON.parse(JSON.stringify(req.headers));
  const requestInfo = req.body.RequestInfo;
  const tenantId = req.body.CalulationCriteria[0].tenantId;

  calculalteResponse.ResponseInfo = requestInfoToResponseInfo(
    requestInfo,
    true
  );

  let calculations = await getCalculation(req, pool, next);
  calculalteResponse.Calculation = calculations;

  let a = await generateDemand(requestInfo, tenantId, calculations, header);

  return calculalteResponse;
};

const getCalculation = async (req, pool, next) => {
  let calculations = [];
  const requestInfo = req.body.RequestInfo;
  var header = JSON.parse(JSON.stringify(req.headers));

  for (let i = 0; i < req.body.CalulationCriteria.length; i++) {
    let calculateCriteria = req.body.CalulationCriteria[i];
    if (calculateCriteria.fireNOC) {
      calculateCriteria.applicationNumber =
        calculateCriteria.fireNOC.fireNOCDetails.applicationNumber;
    }
    if (!calculateCriteria.fireNOC || isEmpty(calculateCriteria.fireNOC)) {
      const applicationNumber = calculateCriteria.applicationNumber;
      const tenantId = calculateCriteria.tenantId;
      let firefireNocSearchResponseNOC = getFireNoc(
        requestInfo,
        applicationNumber,
        tenantId,
        header
      );
      if (
        !firefireNocSearchResponseNOC.FireNOCs ||
        isEmpty(firefireNocSearchResponseNOC.FireNOCs)
      ) {
        throw `FireNOC not found for application number: ${applicationNumber}`;
      } else {
        calculateCriteria.fireNOC = firefireNocSearchResponseNOC.FireNOCs[0];
      }
    }

    let calculation = await calculateForSingleReq(
      calculateCriteria,
      requestInfo,
      pool,
      next,
      header
    );

    calculations.push(calculation);
  }

  return calculations;
};

const calculateForSingleReq = async (
  calculateCriteria,
  requestInfo,
  pool,
  next,
  header
) => {
  let mdms = await mdmsData(requestInfo, calculateCriteria.tenantId, header);
  let mdmsConfig = {};
  for (let i = 0; i < mdms.MdmsRes.firenoc.FireNocULBConstats.length; i++) {
    let constEntry = mdms.MdmsRes.firenoc.FireNocULBConstats[i];
    mdmsConfig = { ...mdmsConfig, [constEntry.code]: constEntry.value };
  }
  for (let i = 0; i < mdms.MdmsRes.firenoc.FireNocStateConstats.length; i++) {
    let constEntry = mdms.MdmsRes.firenoc.FireNocStateConstats[i];
    mdmsConfig = { ...mdmsConfig, [constEntry.code]: constEntry.value };
  }
  let searchReqParam = {};
  searchReqParam.tenantId = calculateCriteria.fireNOC.tenantId;
  searchReqParam.fireNOCType =
    calculateCriteria.fireNOC.fireNOCDetails.fireNOCType;
  searchReqParam.calculationType = mdmsConfig.CALCULATON_TYPE;

  let calculation = {
    applicationNumber: calculateCriteria.applicationNumber,
    fireNoc: calculateCriteria.fireNOC,
    tenantId: searchReqParam.tenantId,
    taxHeadEstimates: []
  };
  const feeEstimate = await calculateNOCFee(
    searchReqParam,
    calculateCriteria,
    mdmsConfig,
    pool,
    requestInfo,
    next
  );
  calculation.taxHeadEstimates.push(feeEstimate);
  if (calculateCriteria.fireNOC.fireNOCDetails.additionalDetail.adhocPenalty) {
    const adhocPenaltyEstimate = calculateAdhocPenalty(calculateCriteria);
    calculation.taxHeadEstimates.push(adhocPenaltyEstimate);
  }
  if (calculateCriteria.fireNOC.fireNOCDetails.additionalDetail.adhocRebate) {
    const adhocRebateEstimate = calculateAdhocRebate(calculateCriteria);
    calculation.taxHeadEstimates.push(adhocRebateEstimate);
  }
  const taxEstimate = calculateTaxes(mdmsConfig, calculation);
  calculation.taxHeadEstimates.push(taxEstimate);

  const roundoffEstimate = calculateRoundOff(calculation);
  calculation.taxHeadEstimates.push(roundoffEstimate);
  return calculation;
};

const calculateNOCFee = async (
  searchReqParam,
  calculateCriteria,
  mdmsConfig,
  pool,
  requestInfo,
  next
) => {
  let nocfee = 0;
  let buidingnocfees = [];
  for (
    let i = 0;
    i < calculateCriteria.fireNOC.fireNOCDetails.buildings.length;
    i++
  ) {
    let buidingnocfee = 0;
    searchReqParam.buildingUsageType =
      calculateCriteria.fireNOC.fireNOCDetails.buildings[i].usageType;
    let uoms = calculateCriteria.fireNOC.fireNOCDetails.buildings[
      i
    ].uoms.filter(uom => {
      return uom.isActiveUom;
    });
    for (let uomindex = 0; uomindex < uoms.length; uomindex++) {
      searchReqParam.uom = uoms[uomindex].code;
      if (mdmsConfig.CALCULATON_TYPE !== "FLAT")
        searchReqParam.uomValue = uoms[uomindex].value;
      const billingslabs = await searchService(searchReqParam, {}, pool);
      let errors = [];
      if (billingslabs.length > 1) {
        errors = [...errors, { message: "More than 1 billingslabs!" }];
      }
      if (billingslabs.length < 1) {
        errors = [...errors, { message: "No Billing slabs found!" }];
      }
      if (errors.length > 0) {
        next({
          errorType: "custom",
          errorReponse: {
            ResponseInfo: requestInfoToResponseInfo(requestInfo, false),
            Errors: errors
          }
        });
        return;
      }

      if (mdmsConfig.CALCULATON_TYPE === "FLAT") {
        buidingnocfee += Number(billingslabs[0].rate);
      } else {
        buidingnocfee += Number(
          billingslabs[0].rate * Number(searchReqParam.uomValue)
        );
      }
    }
    if (mdmsConfig.CALCULATON_TYPE !== "FLAT") {
      const minimumFee =
        searchReqParam.fireNOCType === "NEW"
          ? mdmsConfig.MINIMUM_NEW
          : mdmsConfig.MINIMUM_PROVISIONAL;
      buidingnocfee = Math.max(buidingnocfee, minimumFee);
    }

    buidingnocfees.push(buidingnocfee);
  }
  switch (mdmsConfig.MULTI_BUILDING_CALC_METHOD) {
    case "SUM":
      nocfee = buidingnocfees.reduce((a, b) => a + b, 0);
      break;
    case "AVERAGE":
      nocfee =
        buidingnocfees.reduce((a, b) => a + b, 0) / buidingnocfees.length;
      break;
    case "MAX":
      nocfee = Math.max(...buidingnocfees);
      break;
    case "MIN":
      nocfee = Math.min(...buidingnocfees);
      break;
  }
  const feeEstimate = {
    category: "FEE",
    taxHeadCode: "FIRENOC_FEES",
    estimateAmount: nocfee
  };
  return feeEstimate;
};

const calculateAdhocPenalty = calculateCriteria => {
  const adhocPenaltyEstimate = {
    category: "PENALTY",
    taxHeadCode: "FIRENOC_ADHOC_PENALTY",
    estimateAmount:
      calculateCriteria.fireNOC.fireNOCDetails.additionalDetail.adhocPenalty
  };
  return adhocPenaltyEstimate;
};

const calculateAdhocRebate = calculateCriteria => {
  const adhocRebateEstimate = {
    category: "REBATE",
    taxHeadCode: "FIRENOC_ADHOC_REBATE",
    estimateAmount:
      calculateCriteria.fireNOC.fireNOCDetails.additionalDetail.adhocRebate
  };
  return adhocRebateEstimate;
};

const calculateTaxes = (mdmsConfig, calculation) => {
  let taxableAmount = 0;
  calculation.taxHeadEstimates.map(taxHeadEstimate => {
    if (envVariables.TAXABLE_TAXHEADS.includes(taxHeadEstimate.taxHeadCode)) {
      taxableAmount += taxHeadEstimate.estimateAmount;
    }
  });
  let taxAmount = (taxableAmount * mdmsConfig.TAX_PERCENTAGE) / 100;
  taxAmount = taxAmount.toFixed(2);
  const taxEstimate = {
    category: "TAX",
    taxHeadCode: "FIRENOC_TAXES",
    estimateAmount: taxAmount
  };
  return taxEstimate;
};

const calculateRoundOff = calculation => {
  let roundoffAmount = 0;
  let totalAmount = 0;
  calculation.taxHeadEstimates.map(taxHeadEstimate => {
    if (envVariables.DEBIT_TAXHEADS.includes(taxHeadEstimate.taxHeadCode)) {
      totalAmount -= taxHeadEstimate.estimateAmount;
    } else {
      totalAmount += taxHeadEstimate.estimateAmount;
    }
  });
  roundoffAmount = Math.round(totalAmount) - totalAmount;
  roundoffAmount = roundoffAmount.toFixed(2);
  const roundoffEstimate = {
    category: "TAX",
    taxHeadCode: "FIRENOC_ROUNDOFF",
    estimateAmount: roundoffAmount
  };
  return roundoffEstimate;
};