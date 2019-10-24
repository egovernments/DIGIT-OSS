import get from "lodash/get";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import store from "../../../../ui-redux/store";
import { getMdmsData } from "../utils";
import { getLocalization } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import {
  getTransformedLocalStorgaeLabels,
  getLocaleLabels
} from "egov-ui-framework/ui-utils/commons";

const ifNotNull = value => {
  return !["", "NA", "null", null].includes(value);
};

const nullToNa = value => {
  return ["", "NA", "null", null].includes(value) ? "NA" : value;
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

export const loadPtBillData = response => {
  let data = {};

  // if (response.Bill && response.Bill.length > 0) {
  data.billDate = epochToDate(get(response, "billDetails[0].billDate"));
  const fromDate = epochToDate(get(response, "billDetails[0].fromPeriod"));
  const toDate = epochToDate(get(response, "billDetails[0].toPeriod"));
  data.taxPeriod = `${fromDate} - ${toDate}`;
  data.billNumber = nullToNa(get(response, "billDetails[0].billNumber"));
  data.consumerName = nullToNa(get(response, "payerName"));
  data.mobileNumber = nullToNa(get(response, "mobileNumber"));
  data.businessService = get(response, "billDetails[0].businessService").split(
    "."
  )[0];
  const serviceType = get(response, "billDetails[0].businessService").split(
    "."
  )[1];
  data.serviceType = serviceType ? serviceType : "NA";
  data.amountPaid = get(response, "billDetails[0].amountPaid", 0);
  data.totalAmount = get(response, "billDetails[0].totalAmount", 0);
  data.amountDue = data.totalAmount - data.amountPaid;
  data.dueDate = epochToDate(get(response, "billDetails[0].expiryDate"));
  data.payerAddress = nullToNa(get(response, "payerAddress"));
  data.propertyId = get(response, "billDetails[0].consumerCode").split(":")[0];
  data.AssessNo = get(response, "billDetails[0].consumerCode").split(":")[1];
  data.locality = nullToNa(
    get(response, "billDetails[0].address.locality", "NA")
  );
  data.paymentMode = nullToNa(
    get(response, "instrument.instrumentType.name", "NA")
  );
  data.g8ReceiptNo = nullToNa(
    get(response, "billDetails[0].manualReceiptNumber", "None")
  );
  // }
  const taxes = get(response, "billDetails[0].billAccountDetails", []);
  data.taxHeads = getTaxHeads(
    taxes,
    get(response, "billDetails[0].totalAmount", 0)
  );
  return data;
  // store.dispatch(prepareFinalObject("receiptDataForReceipt", data));
};

const getTaxHeads = (taxes, totalAmount) => {
  let taxHeads = [];
  taxes.forEach(i => {
    if (i.amount !== 0) {
      taxHeads.push({
        taxHeadCode: getLocaleLabels(
          "",
          i.taxHeadCode,
          getTransformedLocalStorgaeLabels()
        ),
        amount: i.amount
      });
    }
  });
  taxHeads.push({
    taxHeadCode: getLocaleLabels(
      "",
      "TOTAL_PAYABLE",
      getTransformedLocalStorgaeLabels()
    ),
    amount: totalAmount
  });
  return taxHeads;
};

export const loadMdmsData = async tenantid => {
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
    let ulbGrade = get(ulbData, "city.ulbGrade", "NA");
    let name = get(ulbData, "city.name", "NA");
    if (ulbGrade) {
      if (ulbGrade === "NP") {
        data.corporationName = `${name.toUpperCase()} NAGAR PANCHAYAT`;
      } else if (ulbGrade === "Municipal Corporation") {
        data.corporationName = `${name.toUpperCase()} MUNICIPAL CORPORATION`;
      } else if (ulbGrade.includes("MC Class")) {
        data.corporationName = `${name.toUpperCase()} MUNICIPAL COUNCIL`;
      } else {
        data.corporationName = `${name.toUpperCase()} MUNICIPAL CORPORATION`;
      }
    } else {
      data.corporationName = `${name.toUpperCase()} MUNICIPAL CORPORATION`;
    }
    /** END */
    data.corporationAddress = get(ulbData, "address", "NA");
    data.corporationContact = get(ulbData, "contactNumber", "NA");
    data.corporationWebsite = get(ulbData, "domainUrl", "NA");
    data.corporationEmail = get(ulbData, "emailId", "NA");
  }
  store.dispatch(prepareFinalObject("mdmsDataForReceipt", data));
};

/** Data used for creation of receipt is generated and stored in local storage here */
// export const loadReceiptGenerationData = (applicationNumber, tenant) => {
//   /** Logo loaded and stored in local storage in base64 */
//   // loadApplicationData(applicationNumber, tenant); //PB-TL-2018-09-27-000004
//   loadBillData(applicationNumber, tenant); //PT-107-001330:AS-2018-08-29-001426     //PT consumerCode
//   loadMdmsData(tenant);
// };
