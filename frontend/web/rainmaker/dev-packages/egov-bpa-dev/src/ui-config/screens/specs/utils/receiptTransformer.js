import get from "lodash/get";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import store from "../../../../ui-redux/store";
import {
  getMdmsData,
  getReceiptData,
  getSearchResults,
  getUserDataFromUuid,
  getFinancialYearDates
} from "../utils";
import {
  getLocalization,
  getLocale
} from "egov-ui-kit/utils/localStorageUtils";
import {
  getUlbGradeLabel,
  getTranslatedLabel,
  transformById,
  getTransformedLocale
} from "egov-ui-framework/ui-utils/commons";
import { getAppSearchResults } from "../../../../ui-utils/commons";

const ifNotNull = value => {
  return !["", "NA", "null", null].includes(value);
};

const nullToNa = value => {
  return ["", "NA", "null", null].includes(value) ? "NA" : value;
};

const createAddress = (doorNo, buildingName, street, locality, city) => {
  let address = "";
  address += ifNotNull(doorNo) ? doorNo + ", " : "";
  address += ifNotNull(buildingName) ? buildingName + ", " : "";
  address += ifNotNull(street) ? street + ", " : "";
  address += locality + ", ";
  address += city;
  return address;
};

const epochToDate = et => {
  if (!et) return null;
  var date = new Date(Math.round(Number(et)));
  var formattedDate =
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  return formattedDate;
};

const getMessageFromLocalization = code => {
  let messageObject = JSON.parse(getLocalization(`localization_${getLocale()}`)).find(
    item => {
      return item.code == code;
    }
  );
  return messageObject ? messageObject.message : code;
};

export const loadUlbLogo = tenantid => {
  var img = new Image();
  img.crossOrigin = "Anonymous";
  img.onload = function() {
    var canvas = document.createElement("CANVAS");
    var ctx = canvas.getContext("2d");
    canvas.height = this.height;
    canvas.width = this.width;
    ctx.drawImage(this, 0, 0);
    store.dispatch(prepareFinalObject("base64UlbLogo", canvas.toDataURL()));
    canvas = null;
  };
  img.src = `/pb-egov-assets/${tenantid}/logo.png`;
};

export const loadApplicationData = async (applicationNumber, tenant) => {
  let data = {};
  let queryObject = [
    { key: "tenantId", value: tenant },
    { key: "applicationNos", value: applicationNumber }
  ];
  let response = await getAppSearchResults(queryObject);

  if (response && response.Bpa && response.Bpa.length > 0) {
    data.applicationNumber = nullToNa(
      get(response, "Bpa[0].applicationNumber", "NA")
    );
    data.oldLicenseNumber = nullToNa(
      get(response, "Bpa[0].oldLicenseNumber", "NA")
    );
    data.applicationType = getMessageFromLocalization(
      nullToNa(
        get(
          response,
          "Bpa[0].applicationType",
          "NA"
        )
      )
    );
    // data.licenseNumber = nullToNa(
    //   get(response, "Bpa[0].licenseNumber", "NA")
    // );
    data.financialYear = nullToNa(
      get(response, "Bpa[0].financialYear", "NA")
    );
    //data.tradeName = nullToNa(get(response, "Bpa[0].tradeName", "NA"));
    data.doorNo = nullToNa(
      get(response, "Bpa[0].address.doorNo", "NA")
    );
    data.buildingName = nullToNa(
      get(response, "Bpa[0].address.buildingName", "NA")
    );
    data.streetName = nullToNa(
      get(response, "Bpa[0].address.street", "NA")
    );
    data.locality = get(
      response,
      "Bpa[0].address.locality.name",
      "NA"
    );
    let cityCode = nullToNa(
      get(response, "Bpa[0].address.tenantId", "NA")
    );
    data.city = getMessageFromLocalization("TENANT_TENANTS_"+getTransformedLocale(cityCode));
    /** Make owners data array */
    let ownersData = get(response, "Bpa[0].owners", []);
    data.owners = ownersData.map(owner => {
      return {
        name: get(owner, "name", "NA"),
        mobile: get(owner, "mobileNumber", "NA")
      };
    });
    data.ownersList = ownersData
      .map(owner => {
        return get(owner, "name", "NA");
      })
      .join(", ");
    /** End */
    let licenseIssueDate = get(response, "Bpa[0].issuedDate", "NA");
    data.licenseIssueDate = nullToNa(epochToDate(licenseIssueDate));
    data.licenseExpiryDate = nullToNa(
      epochToDate(get(response, "Bpa[0].validTo", "NA"))
    );
    let licenseValidTo = get(response, "Bpa[0].validTo", "NA");
    data.licenseValidity = getFinancialYearDates("dd/mm/yyyy", licenseValidTo);
    data.address = nullToNa(
      createAddress(
        data.doorNo,
        data.buildingName,
        data.streetName,
        data.locality,
        data.city
      )
    );
    loadUserNameData(response.Bpa[0].auditDetails.lastModifiedBy);
  }

  store.dispatch(prepareFinalObject("applicationDataForReceipt", data));
};

export const loadReceiptData = async (consumerCode, tenant) => {
  let data = {};
  let queryObject = [
    {
      key: "tenantId",
      value: tenant
    },
    {
      key: "consumerCode",
      value: consumerCode
    }
  ];
  let response = await getReceiptData(queryObject);

  if (response && response.Receipt && response.Receipt.length > 0) {
    data.receiptNumber = nullToNa(
      get(response, "Receipt[0].Bill[0].billDetails[0].receiptNumber", "NA")
    );
    data.amountPaid = get(
      response,
      "Receipt[0].Bill[0].billDetails[0].amountPaid",
      0
    );
    data.totalAmount = get(
      response,
      "Receipt[0].Bill[0].billDetails[0].totalAmount",
      0
    );
    data.amountDue = data.totalAmount - data.amountPaid;
    data.paymentMode = nullToNa(
      get(response, "Receipt[0].instrument.instrumentType.name", "NA")
    );
    data.transactionNumber = nullToNa(
      get(response, "Receipt[0].instrument.transactionNumber", "NA")
    );
    data.bankName = get(response, "Receipt[0].instrument.bank.name", "NA");
    data.branchName = get(response, "Receipt[0].instrument.branchName", null);
    data.bankAndBranch = nullToNa(
      data.bankName && data.branchName
        ? data.bankName + ", " + data.branchName
        : get(data, "bankName", "NA")
    );
    data.paymentDate = nullToNa(
      epochToDate(
        get(response, "Receipt[0].Bill[0].billDetails[0].receiptDate", 0)
      )
    );
    data.g8ReceiptNo = nullToNa(
      get(
        response,
        "Receipt[0].Bill[0].billDetails[0].manualReceiptNumber",
        "NA"
      )
    );
    data.g8ReceiptDate = nullToNa(
      epochToDate(
        get(response, "Receipt[0].Bill[0].billDetails[0].manualReceiptDate", 0)
      )
    );
    /** START TL Fee, Adhoc Penalty/Rebate Calculation */
    var tlAdhocPenalty = 0,
      tlAdhocRebate = 0;
    response.Receipt[0].Bill[0].billDetails[0].billAccountDetails.map(item => {
      let desc = item.taxHeadCode ? item.taxHeadCode : "";
      if (desc === "TL_TAX") {
        data.tlFee = item.amount;
      } else if (desc === "TL_ADHOC_PENALTY") {
        tlAdhocPenalty = item.amount;
      } else if (desc === "TL_ADHOC_REBATE") {
        tlAdhocRebate = item.amount;
      }
    });
    data.tlPenalty = "NA";
    data.tlRebate = "NA";
    data.tlAdhocPenalty = tlAdhocPenalty;
    data.tlAdhocRebate = tlAdhocRebate;
    /** END */
  }
  store.dispatch(prepareFinalObject("receiptDataForReceipt", data));
};

export const loadMdmsData = async tenantid => {
  let localStorageLabels = JSON.parse(
    window.localStorage.getItem(`localization_${getLocale()}`)
  );
  let localizationLabels = transformById(localStorageLabels, "code");
  let data = {};
  let queryObject = [
    {
      key: "tenantId",
      value: `${tenantid}`
    },
    {
      key: "moduleName",
      value: "tenant"
    },
    {
      key: "masterName",
      value: "tenants"
    }
  ];
  let response = await getMdmsData(queryObject);

  if (
    response &&
    response.MdmsRes &&
    response.MdmsRes.tenant.tenants.length > 0
  ) {
    let ulbData = response.MdmsRes.tenant.tenants.find(item => {
      return item.code == tenantid;
    });
    /** START Corporation name generation logic */
    const ulbGrade = get(ulbData, "city.ulbGrade", "NA")
      ? getUlbGradeLabel(get(ulbData, "city.ulbGrade", "NA"))
      : "MUNICIPAL CORPORATION";

    const cityKey = `TENANT_TENANTS_${get(ulbData, "code", "NA")
      .toUpperCase()
      .replace(/[.]/g, "_")}`;

    data.corporationName = `${getTranslatedLabel(ulbGrade, localizationLabels)} ${getTranslatedLabel(
      cityKey,
      localizationLabels
    ).toUpperCase()} `;

    /** END */
    data.corporationAddress = get(ulbData, "address", "NA");
    data.corporationContact = get(ulbData, "contactNumber", "NA");
    data.corporationWebsite = get(ulbData, "domainUrl", "NA");
    data.corporationEmail = get(ulbData, "emailId", "NA");
  }
  store.dispatch(prepareFinalObject("mdmsDataForReceipt", data));
};

export const loadUserNameData = async uuid => {
  let data = {};
  let bodyObject = {
    uuid: [uuid]
  };
  let response = await getUserDataFromUuid(bodyObject);

  if (response && response.user && response.user.length > 0) {
    data.auditorName = get(response, "user[0].name", "NA");
  }
  data.Disclaimer=getMessageFromLocalization("TL_RECEIPT_FOOTER_1");
  store.dispatch(prepareFinalObject("userDataForReceipt", data));
};

/** Data used for creation of receipt is generated and stored in local storage here */
export const loadReceiptGenerationData = (applicationNumber, tenant) => {
  /** Logo loaded and stored in local storage in base64 */
  loadUlbLogo(tenant);
  loadApplicationData(applicationNumber, tenant); //PB-TL-2018-09-27-000004
  loadReceiptData(applicationNumber, tenant); //PT-107-001330:AS-2018-08-29-001426     //PT consumerCode
  loadMdmsData(tenant);
};

/** Data used for creation of receipt is generated and stored in local storage here */
export const loadPdfGenerationData = (applicationNumber, tenant) => {
  /** Logo loaded and stored in local storage in base64 */
  loadUlbLogo(tenant);
  loadApplicationData(applicationNumber, tenant); //PB-FN-2019-06-14-002241
  loadReceiptData(applicationNumber, tenant); //PB-FN-2019-06-14-002241
  loadMdmsData(tenant);
};