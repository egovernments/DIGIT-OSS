import get from "lodash/get";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import store from "../../../../ui-redux/store";
import { getMdmsData } from "../utils";
import orderBy from "lodash/orderBy";
import {
  getTransformedLocalStorgaeLabels,
  getLocaleLabels
} from "egov-ui-framework/ui-utils/commons";
import commonConfig from "config/common.js";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";

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
  img.src = `/${commonConfig.tenantId}-egov-assets/${tenantid}/logo.png`;
};

export const loadPtBillData = response => {
  // const ulbData = loadMdmsData(getTenantId())
  let data = {};  
  let orderedResponse = orderBy(
    response.billDetails,
    "fromPeriod",
    "desc");
    
  let taxHeads = orderedResponse[0].billAccountDetails.reduce((acc,item,index) =>{
    if(index<9){
      acc[getLocaleLabels(
        "",
        item.taxHeadCode,
        getTransformedLocalStorgaeLabels()
      )] = item.amount 
    }     
    return acc
  },[])
  const fromDate = epochToDate(get(response, "billDetails[0].fromPeriod"));
  const toDate = epochToDate(get(response, "billDetails[0].toPeriod"));
  data.header = get(store.getState() , "")
  data.billPeriod = `${fromDate} - ${toDate}`;
  data.billDate = epochToDate(get(response, "billDate"));
  data.dueDate = epochToDate(get(response, "billDetails[0].expiryDate"));
  data.billNumber = nullToNa(get(response, "billNumber"));
  data.payerName = nullToNa(get(response, "payerName"));
  data.mobileNumber = nullToNa(get(response, "mobileNumber"));
  data.amountPaid = get(response, "billDetails[0].amountPaid", 0);
  data.totalAmount = get(response, "totalAmount", 0);
  data.amountDue = data.totalAmount - data.amountPaid;
  data.payerAddress = get(response, "payerAddress");
  data.propertyId = get(response, "consumerCode").split(":")[0];
  data.g8ReceiptNo = nullToNa(
    get(response, "billDetails[0].manualReceiptNumber", "None")
  );
  data.taxHeads = taxHeads
  return data;

  // store.dispatch(prepareFinalObject("receiptDataForReceipt", data));
};

export const loadMdmsData = async tenantid => {
  let data = {};
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantid,
      moduleDetails: [
        {
          moduleName: "tenant",
          masterDetails: [{ name: "tenants" }]
        }
      ]
    }
  };
  let response = await getMdmsData(mdmsBody);

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
  return data;
};

/** Data used for creation of receipt is generated and stored in local storage here */
// export const loadReceiptGenerationData = (applicationNumber, tenant) => {
//   /** Logo loaded and stored in local storage in base64 */
//   // loadApplicationData(applicationNumber, tenant); //PB-TL-2018-09-27-000004
//   loadBillData(applicationNumber, tenant); //PT-107-001330:AS-2018-08-29-001426     //PT consumerCode
//   loadMdmsData(tenant);
// };
