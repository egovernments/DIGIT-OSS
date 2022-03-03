import { getPlotAndFloorFormConfigPath } from "egov-ui-kit/config/forms/specs/PropertyTaxPay/utils/assessInfoFormManager";
import { getApplicationType, getDateFromEpoch, navigateToApplication } from "egov-ui-kit/utils/commons";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import isUndefined from "lodash/isUndefined";
import set from "lodash/set";
import sortBy from "lodash/sortBy";
import uniqBy from "lodash/uniqBy";
import React from "react";

export const resetFormWizard = (form, removeForm) => {
  const formKeys = form && Object.keys(form);
  const formToReset = [
    "basicInformation",
    "propertyAddress",
    "plotDetails",
    "ownershipType",
    "institutionAuthority",
    "institutionDetails",
    "cashInfo",
    "paymentModes",
    "receiptInfo",
    "additionalRebate",
  ];
  formKeys.forEach((formKey) => {
    if (
      formToReset.includes(formKey) ||
      formKey.startsWith("ownerInfo") ||
      formKey.startsWith("customSelect_") ||
      formKey.startsWith("floorDetails_")
    ) {
      removeForm(formKey);
    }
  });
};

const onApplicationClick = async (applicationNo, tenantId, propertyId, history, creationReason) => {
  const businessService = await getApplicationType(applicationNo, tenantId, creationReason);
  navigateToApplication(businessService, history, applicationNo, tenantId, propertyId);
}
const linkStyle = {
  height: 20,
  lineHeight: "auto",
  minWidth: "inherit",
  cursor: "pointer",
  textDecoration: "underline"
};

const getApplicationLink = (applicationNo, tenantId, propertyId, history, creationReason) => {
  return (
    <a
      style={linkStyle}
      onClick={() => onApplicationClick(applicationNo, tenantId, propertyId, history, creationReason)}
    >
      {applicationNo}
    </a>
  );
}

const getLink = (userType, history, id, tenantId) => {
  return (
    <a
      style={linkStyle}
      onClick={
        userType === "CITIZEN"
          ? e => {
            history.push(
              `/property-tax/my-properties/property/${id}/${tenantId}`
            );
          }
          : e => {
            history.push(
              `/property-tax/property/${id}/${tenantId}`
            );
          }
      }
    >
      {id}
    </a>
  );
}

const getStatusColor = (status) => {
  switch (status) {
    case 'INWORKFLOW':
      return status = <span style={{ color: "red" }}>{status}</span>
    case 'ACTIVE':
      return status = <span style={{ color: "green" }}>{status}</span>
    default:
      return status;
  }
}

export const getRowData = (property, history) => {
  let date = getDateFromEpoch(property.auditDetails.createdTime);
  const userType = JSON.parse(getUserInfo()).type;
  return {

    applicationNo: getApplicationLink(property.acknowldgementNumber, property.tenantId, property.propertyId, history, property.creationReason),
    propertyId: getLink(userType, history, property.propertyId, property.tenantId),
    applicationType: property.creationReason,
    name: property.owners[0].name,
    date: date,
    status: getStatusColor(property.status)

  }
}

export const getFormattedDate = (date) => {
  const dateArray = new Date(date).toString().split(' ');
  if (dateArray.length > 0) {
    return dateArray[2] + '-' + dateArray[1] + '-' + dateArray[3];
  }
  else {
    return 'dd-mmm-yyyy';
  }
}


export const getLatestPropertyDetails = (propertyDetailsArray) => {
  if (propertyDetailsArray) {
    const currentFinancialYear = getCurrentFinancialYear();
    if (propertyDetailsArray.length > 1) {
      const assessmentsOfCurrentYear = propertyDetailsArray.filter((item) => item.financialYear === currentFinancialYear);
      const propertyDetails = assessmentsOfCurrentYear.length > 0 ? assessmentsOfCurrentYear : propertyDetailsArray;
      return propertyDetails.reduce((acc, curr) => {
        return acc.assessmentDate > curr.assessmentDate ? acc : curr;
      });
    } else {
      return propertyDetailsArray[0];
    }
  } else {
    return;
  }
};

export const getCurrentFinancialYear = () => {
  var today = new Date();
  var curMonth = today.getMonth();
  var fiscalYr = "";
  if (curMonth > 3) {
    var nextYr1 = (today.getFullYear() + 1).toString();
    fiscalYr = today.getFullYear().toString() + "-" + nextYr1.slice(2);
  } else {
    var nextYr2 = today.getFullYear().toString();
    fiscalYr = (today.getFullYear() - 1).toString() + "-" + nextYr2.slice(2);
  }
  return fiscalYr;
};

export const getQueryValue = (query, key) =>
  query &&
  decodeURIComponent(
    query.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1")
  );

export const findCorrectDateObj = (financialYear, category) => {
  category.sort((a, b) => {
    let yearOne = a.fromFY && a.fromFY.slice(0, 4);
    let yearTwo = b.fromFY && b.fromFY.slice(0, 4);
    if (yearOne < yearTwo) {
      return 1;
    } else return -1;
  });
  let assessYear = financialYear && financialYear.slice(0, 4);
  let chosenDateObj = {};
  let categoryYear = category.reduce((categoryYear, item) => {
    const year = item.fromFY && item.fromFY.slice(0, 4);
    categoryYear.push(year);
    return categoryYear;
  }, []);
  const index = categoryYear.indexOf(assessYear);
  if (index > -1) {
    chosenDateObj = category[index];
  } else {
    for (let i = 0; i < categoryYear.length; i++) {
      if (assessYear > categoryYear[i]) {
        chosenDateObj = category[i];
        break;
      }
    }
  }
  let month = null;
  if (chosenDateObj.startingDay) {
    month = getMonth(chosenDateObj.startingDay);
    if (month === 1 || month === 2 || month === 3) {
      chosenDateObj.startingDay = chosenDateObj.startingDay + `/${++assessYear}`;
    } else {
      chosenDateObj.startingDay = chosenDateObj.startingDay + `/${assessYear}`;
    }
  } else if (chosenDateObj.endingDay) {
    month = getMonth(chosenDateObj.endingDay);
    if (month === 1 || month === 2 || month === 3) {
      chosenDateObj.endingDay = chosenDateObj.endingDay + `/${++assessYear}`;
    } else {
      chosenDateObj.endingDay = chosenDateObj.endingDay + `/${assessYear}`;
    }
  }
  return chosenDateObj;
};

export const findCorrectDateObjPenaltyIntrest = (financialYear, category) => {
  category.sort((a, b) => {
    let yearOne = a.fromFY && a.fromFY.slice(0, 4);
    let yearTwo = b.fromFY && b.fromFY.slice(0, 4);
    if (yearOne < yearTwo) {
      return 1;
    } else return -1;
  });
  let assessYear = financialYear && financialYear.slice(0, 4);
  let chosenDateObj = {};
  let categoryYear = category.reduce((categoryYear, item) => {
    const year = item.fromFY && item.fromFY.slice(0, 4);
    categoryYear.push(year);
    return categoryYear;
  }, []);
  const index = categoryYear.indexOf(assessYear);
  if (index > -1) {
    chosenDateObj = category[index];
  } else {
    for (let i = 0; i < categoryYear.length; i++) {
      if (assessYear > categoryYear[i]) {
        chosenDateObj = category[i];
        break;
      }
    }
  }
  let month = null;
  if (chosenDateObj.startingDay) {
    let yearDiff = assessYear - chosenDateObj.fromFY.split("-")[0];
    let date = chosenDateObj.startingDay.split("/");
    let yr = parseInt(date.pop()) + yearDiff;
    let len = date.push(yr.toString());
    chosenDateObj.startingDay = date.join("/");
    month = getMonth(chosenDateObj.startingDay);
  }
  return chosenDateObj;
};

const getMonth = (date) => {
  return parseInt(date.split("/")[1]);
};

export const sortDropdown = (data, sortBy, isAscending) => {
  const sortedData = data.slice().sort((a, b) => {
    var textA = a[sortBy].toUpperCase();
    var textB = b[sortBy].toUpperCase();
    return isAscending ? (textA < textB ? -1 : textA > textB ? 1 : 0) : textA < textB ? 1 : textA > textB ? -1 : 0;
  });
  return sortedData;
};
export const getOwnerCategory = (data = []) => {
  const OwnerCatArray = data.map((item, index) => {
    return { label: item.name, value: item.code };
  });
  return OwnerCatArray;
}
export const getOwnerCategoryByYear = (data, financialYear) => {
  data.sort((a, b) => {
    let yearOne = a.fromFY && a.fromFY.slice(0, 4);
    let yearTwo = b.fromFY && b.fromFY.slice(0, 4);
    if (yearOne < yearTwo) {
      return -1;
    } else return 1;
  });

  const fY = financialYear.slice(0, 4);
  const OwnerCatArray = data.reduce((OwnerCatArray, item) => {
    let year = item.fromFY && item.fromFY.slice(0, 4);
    if (year <= fY) {
      OwnerCatArray.push({ label: item.name, value: item.code });
    }
    return OwnerCatArray;
  }, []);
  return OwnerCatArray;
};

export const getFinancialYearFromQuery = () => {
  let financialYearFromQuery = window.location.search.split("FY=")[1];
  if (financialYearFromQuery) {
    return financialYearFromQuery.split("&")[0];
  }
  return null;
};

export const getEstimateFromBill = (bill) => {
  const taxHeads = [
    "PT_TAX",
    "PT_UNIT_USAGE_EXEMPTION",
    "PT_OWNER_EXEMPTION",
    "PT_FIRE_CESS",
    "PT_CANCER_CESS",
    "PT_TIME_PENALTY",
    "PT_TIME_REBATE",
    "PT_TIME_INTEREST",
    "PT_ADHOC_PENALTY",
    "PT_ADHOC_REBATE",
    "PT_ADVANCE_CARRYFORWARD",
    "PT_DECIMAL_CEILING_DEBIT",
    "PT_ROUNDOFF",
  ]; //Hardcoding as backend is not sending in correct order
  const { billDetails, tenantId } = bill && bill[0];
  const { collectedAmount, totalAmount, billAccountDetails } = billDetails && billDetails[0];
  const taxHeadsFromAPI = billAccountDetails.map((item) => {
    return item.taxHeadCode;
  });
  const transformedTaxHeads = taxHeads.reduce((result, current) => {
    if (taxHeadsFromAPI.indexOf(current) > -1) {
      result.push(current);
    }
    return result;
  }, []);
  let estimate = { totalAmount: 0 };
  estimate.totalAmount = totalAmount;
  estimate.tenantId = tenantId;
  estimate.collectedAmount = collectedAmount;
  const taxHeadEstimates = transformedTaxHeads.reduce((taxHeadEstimates, current) => {
    const taxHeadContent = billAccountDetails.filter((item) => item.taxHeadCode && item.taxHeadCode === current);
    taxHeadContent &&
      taxHeadContent[0] &&
      taxHeadEstimates.push({
        taxHeadCode: taxHeadContent[0].taxHeadCode,
        // estimateAmount: taxHeadContent[0].debitAmount ? taxHeadContent[0].debitAmount : taxHeadContent[0].crAmountToBePaid,
        estimateAmount: taxHeadContent[0].amount,
        category: taxHeadContent[0].purpose,
      });
    return taxHeadEstimates;
  }, []);
  // collectedAmount > 0 &&
  //   taxHeadEstimates.push({
  //     taxHeadCode: "PT_ADVANCE_CARRYFORWARD",
  //     estimateAmount: collectedAmount,
  //     category: "EXEMPTION",
  //   });
  estimate.taxHeadEstimates = taxHeadEstimates;
  return [{ ...estimate }];
};

export const transformPropertyDataToAssessInfo = (data) => {
  const propertyType = data["Properties"][0]["propertyDetails"][0]["propertyType"];
  const propertySubType = data["Properties"][0]["propertyDetails"][0]["propertySubType"];
  const usageCategoryMajor = data["Properties"][0]["propertyDetails"][0]["usageCategoryMajor"];
  const usageCategoryMinor = data["Properties"][0]["propertyDetails"][0]["usageCategoryMinor"];
  const propType = propertySubType === null ? propertyType : propertySubType;
  const propUsageType = usageCategoryMinor == null ? usageCategoryMajor : usageCategoryMinor;
  const formConfigPath = getPlotAndFloorFormConfigPath(propUsageType, propType);
  const path = formConfigPath["path"];
  let dictFloor = {};
  let dictCustomSelect = {};

  let customSelectconfig = require(`egov-ui-kit/config/forms/specs/PropertyTaxPay/customSelect.js`).default;
  let basicInfoConfig = require(`egov-ui-kit/config/forms/specs/PropertyTaxPay/basicInformation.js`).default;
  let configPlot = null,
    configFloor = null;

  basicInfoConfig = cloneDeep(basicInfoConfig);
  set(basicInfoConfig, "fields.typeOfUsage.value", propUsageType);
  set(basicInfoConfig, "fields.typeOfBuilding.value", propType);
  if (propType === "SHAREDPROPERTY") {
    configPlot = { fields: { floorCount: { value: 1 } } };
  }

  if (formConfigPath["hasPlot"]) {
    configPlot = require(`egov-ui-kit/config/forms/specs/${path}/plotDetails.js`).default;
    configPlot = cloneDeep(configPlot);
    Object.keys(configPlot["fields"]).map((item) => {
      let jsonPath = configPlot["fields"][item]["jsonPath"];
      if (item === "plotSize" && (propType === "VACANT" || propType === "INDEPENDENTPROPERTY")) {
        let value = get(data, modifyEndOfJsonPath(jsonPath, "landArea"));
        configPlot["fields"][item]["value"] = value;
      } else {
        let value = get(data, jsonPath);
        configPlot["fields"][item]["value"] = value;
      }
    });
  }

  if (formConfigPath["hasFloor"]) {
    configFloor = require(`egov-ui-kit/config/forms/specs/${path}/floorDetails.js`).default;
    let units = data["Properties"][0]["propertyDetails"][0]["units"];

    //For assigning consecutive indexes in formkeys irrespective of floor no.
    const floorIndexObj = prepareUniqueFloorIndexObj(units);
    for (var unitIndex = 0; unitIndex < units.length; unitIndex++) {
      const floorNo = units[unitIndex]["floorNo"];
      const floorIndex = floorIndexObj[floorNo];
      let formKey =
        propUsageType !== "RESIDENTIAL" && propType === "SHAREDPROPERTY"
          ? `floorDetails_0_unit_${unitIndex}`
          : `floorDetails_${floorIndex}_unit_${unitIndex}`;
      configFloor = cloneDeep(configFloor);
      Object.keys(configFloor["fields"]).forEach((item) => {
        let jsonPath = configFloor["fields"][item]["jsonPath"];
        jsonPath = jsonPath.replace(/units\[[0-9]\]/g, "units[" + unitIndex + "]");
        configFloor["fields"][item].jsonPath = jsonPath;
        let valueInJSON = get(data, jsonPath);
        if (valueInJSON === null) {
          let categoryValue = jsonPath.split(".").pop();
          if (categoryValue === "usageCategoryMinor") {
            valueInJSON = get(data, modifyEndOfJsonPath(jsonPath, "usageCategoryMajor"));
          } else if (categoryValue === "usageCategoryDetail") {
            valueInJSON = get(data, modifyEndOfJsonPath(jsonPath, "usageCategorySubMinor"));
          }
        }
        configFloor["fields"][item].value = valueInJSON;
      });
      configFloor.unitsIndex = unitIndex;
      dictFloor[formKey] = configFloor;

      if (!("customSelect_" + floorIndex in dictCustomSelect)) {
        customSelectconfig = cloneDeep(customSelectconfig);
        customSelectconfig["fields"]["floorName"]["value"] = floorNo;
        dictCustomSelect["customSelect_" + floorIndex] = customSelectconfig;
      }
    }
  }

  
  return { basicInformation: basicInfoConfig, plotDetails: configPlot, ...dictFloor, ...dictCustomSelect };
};

const prepareUniqueFloorIndexObj = (units) => {
  units = sortBy(uniqBy(units, "floorNo"), (unit) => parseInt(unit.floorNo) || -99999);
  let floorIndexObj = units.reduce((floorIndexObj, item, index) => {
    if (isUndefined(floorIndexObj[item.floorNo])) {
      floorIndexObj[item.floorNo] = index;
    }
    return floorIndexObj;
  }, {});
  return floorIndexObj;
};

export const convertUnitsToSqFt = (unitArray) => {
  return unitArray.map((unit) => {
    let value = unit.unitArea;
    value = value * 9.0;
    value = Math.round(value * 100) / 100;
    unit.unitArea = value;
    return unit;
  });
};

const modifyEndOfJsonPath = (jsonpath, toReplaceWith) => {
  let jP = jsonpath.split(".");
  jP.pop();
  return jP.join(".") + "." + toReplaceWith;
};


export const generatePdfFromDiv = (action, applicationNumber, divIdName) => {
  let target = document.querySelector(divIdName);
  
  html2canvas(target, {
    scale: 0.8,
    onclone: function (clonedDoc) {
      if (clonedDoc.getElementById("pdf-header")) {
        clonedDoc.getElementById("pdf-header").style.display = "block";
      }
      if (clonedDoc.getElementById("property-assess-form")) {
        clonedDoc.getElementById("property-assess-form").style.display = "none";
      }
      if (clonedDoc.getElementById("pt-header-button-container")) {
        clonedDoc.getElementById("pt-header-button-container").style.display = "none";
      }
      if (clonedDoc.getElementById("pt-flex-child-button")) {
        clonedDoc.getElementById("pt-flex-child-button").style.display = "none";
      }
      if (clonedDoc.getElementById("pt-header-due-amount")) {
        clonedDoc.getElementById("pt-header-due-amount").style.display = "none";
      }

    }
  }).then(canvas => {
   
    var data = canvas.toDataURL("image/png", 1);
    var imgWidth = 200;
    var pageHeight = 295;
    var imgHeight = (canvas.height * imgWidth) / canvas.width;
    var heightLeft = imgHeight;
    var doc = new jsPDF("p", "mm");
    var position = 0;
    doc.addImage(data, "PNG", 5, 5 + position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    if (action === "download") {
      doc.save(`preview-${applicationNumber}.pdf`);
    } else if (action === "print") {
      doc.autoPrint();
      window.open(doc.output("bloburl"), "_blank");
    }
  });
};