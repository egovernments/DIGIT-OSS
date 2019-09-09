import get from "lodash/get";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import store from "../../../../ui-redux/store";
import { getEmployeeName } from "../utils/index";
import { getMdmsData } from "../utils";
import {
  getLocalization,
  getLocale
} from "egov-ui-kit/utils/localStorageUtils";
import {
  getUlbGradeLabel,
  getTranslatedLabel,
  transformById,
  getTransformedLocale,
  getLocaleLabels
} from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";

const localizationLabels = JSON.parse(getLocalization("localization_en_IN"));
const transfomedKeys = transformById(localizationLabels, "code");

const ifNotNull = value => {
  return !["", "NA", "null", null].includes(value);
};

const nullToNa = value => {
  return ["", "NA", "null", null].includes(value) ? "None" : value;
};

const epochToDate = et => {
  if (!et) return null;
  var date = new Date(Math.round(Number(et)));
  var formattedDate =
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  return formattedDate;
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

export const loadReceiptData = async response => {
  let data = {};

  if (response.Bill && response.Bill.length > 0) {
    data.receiptDate = epochToDate(
      get(response, "Bill[0].billDetails[0].receiptDate")
    );
    const fromDate = epochToDate(
      get(response, "Bill[0].billDetails[0].fromPeriod")
    );
    const toDate = epochToDate(
      get(response, "Bill[0].billDetails[0].toPeriod")
    );
    data.taxPeriod = `${fromDate} - ${toDate}`;
    data.consumerName = get(response, "Bill[0].payerName");
    data.mobileNumber = get(response, "Bill[0].mobileNumber");

    const serviceCatLabel = getTransformedLocale(
      get(response, "Bill[0].billDetails[0].businessService").split(".")[0]
    );
    data.serviceCategory = getLocaleLabels(
      "",
      `BILLINGSERVICE_BUSINESSSERVICE_${serviceCatLabel}`,
      transfomedKeys
    );

    const serviceTypeLabel = getTransformedLocale(
      get(response, "Bill[0].billDetails[0].businessService")
    );
    const serviceType = getLocaleLabels(
      "",
      `BILLINGSERVICE_BUSINESSSERVICE_${serviceTypeLabel}`,
      transfomedKeys
    );
    data.serviceType = serviceType ? serviceType : "NA";
    data.amountPaid = get(response, "Bill[0].billDetails[0].amountPaid", 0);
    data.totalAmount = get(response, "Bill[0].billDetails[0].totalAmount", 0);
    data.amountDue = data.totalAmount - data.amountPaid;
    data.paymentMode = nullToNa(
      get(response, "instrument.instrumentType.name", "NA")
    );
    data.comments = nullToNa(
      get(response, "Bill[0].billDetails[0].additionalDetails.comment", "NA")
    );
    data.receiptNumber = get(
      response,
      "Bill[0].billDetails[0].receiptNumber",
      null
    );
    data.g8ReceiptNo = nullToNa(
      get(response, "Bill[0].billDetails[0].manualReceiptNumber", "None")
    );
    data.g8ReceiptDate = nullToNa(
      epochToDate(
        get(response, "Bill[0].billDetails[0].manualReceiptDate", null)
      )
    );

    const queryObj = [
      {
        key: "ids",
        value: get(response, "auditDetails.createdBy")
      },
      {
        key: "tenantId",
        value:
          process.env.REACT_APP_NAME === "Employee"
            ? getTenantId()
            : response.tenantId
      }
    ];

    data.createdBy =
      get(response, "instrument.instrumentType.name") !== "Online"
        ? await getEmployeeName(queryObj)
        : "NA";
  }
  return data;
  // store.dispatch(prepareFinalObject("receiptDataForReceipt", data));
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
    // let ulbGrade = get(ulbData, "city.ulbGrade", "NA");
    // let name = get(ulbData, "city.name", "NA");
    // if (ulbGrade) {
    //   if (ulbGrade === "NP") {
    //     data.corporationName = `${name.toUpperCase()} NAGAR PANCHAYAT`;
    //   } else if (ulbGrade === "Municipal Corporation") {
    //     data.corporationName = `${name.toUpperCase()} MUNICIPAL CORPORATION`;
    //   } else if (ulbGrade.includes("MC Class")) {
    //     data.corporationName = `${name.toUpperCase()} MUNICIPAL COUNCIL`;
    //   } else {
    //     data.corporationName = `${name.toUpperCase()} MUNICIPAL CORPORATION`;
    //   }
    // } else {
    //   data.corporationName = `${name.toUpperCase()} MUNICIPAL CORPORATION`;
    // }
    const ulbGrade = get(ulbData, "city.ulbGrade", "NA")
      ? getUlbGradeLabel(get(ulbData, "city.ulbGrade", "NA"))
      : "MUNICIPAL CORPORATION";

    const cityKey = `TENANT_TENANTS_${get(ulbData, "code", "NA")
      .toUpperCase()
      .replace(/[.]/g, "_")}`;

    data.corporationName = `${getTranslatedLabel(
      cityKey,
      localizationLabels
    ).toUpperCase()} ${getTranslatedLabel(
      ulbGrade,
      localizationLabels
    ).toUpperCase()}`;

    /** END */
    data.corporationAddress = get(ulbData, "address", "NA");
    data.corporationContact = get(ulbData, "contactNumber", "NA");
    data.corporationWebsite = get(ulbData, "domainUrl", "NA");
    data.corporationEmail = get(ulbData, "emailId", "NA");
  }
  store.dispatch(prepareFinalObject("mdmsDataForReceipt", data));
};

/** Data used for creation of receipt is generated and stored in local storage here */
