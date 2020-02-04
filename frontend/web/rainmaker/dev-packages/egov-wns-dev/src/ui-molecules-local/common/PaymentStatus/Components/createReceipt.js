import msevaLogo from "egov-ui-kit/assets/images/pblogo.png";
import { getDateFromEpoch } from "egov-ui-kit/utils/commons";
import get from "lodash/get";
import { getTranslatedLabel } from "egov-ui-kit/utils/commons";

const getTaxInfo = (billAccountDetails, totalAmount, localizationLabels) => {
  const headersFromAPI = billAccountDetails.map((item) => {
    return item.accountDescription && item.accountDescription.split("-")[0];
  });
  const headers = ["PT_TAX", "PT_FIRE_CESS", "PT_TIME_REBATE", "PT_TIME_INTEREST", "PT_TIME_REBATE", "PT_UNIT_USAGE_EXEMPTION", "PT_OWNER_EXEMPTION"];
  const transformedHeaders = headers.reduce((result, current) => {
    if (headersFromAPI.indexOf(current) > -1) {
      result.push(current);
    }
    return result;
  }, []);
  const taxArray = transformedHeaders.reduce(
    (result, current) => {
      result[0].push({ text: getTranslatedLabel(current, localizationLabels) });
      // result[0].push({ text: getTranslatedLabel(current.accountDescription.split("-")[0], localizationLabels) });
      const taxHeadContent = billAccountDetails.filter((item) => item.accountDescription && item.accountDescription.split("-")[0] === current);
      taxHeadContent && taxHeadContent[0] && result[1].push({ text: taxHeadContent[0].crAmountToBePaid || "0" });
      return result;
    },
    [[], []]
  );
  taxArray[0].push({ text: "Total" });
  taxArray[1].push({ text: totalAmount });
  return taxArray;
};

// const getBase64FromImageUrl = async (url) => {
//   var img = new Image();
//   var dataURL;
//   img.setAttribute("crossOrigin", "anonymous");

//   img.onload = await function() {
//     var canvas = document.createElement("canvas");
//     canvas.width = this.width;
//     canvas.height = this.height;

//     var ctx = canvas.getContext("2d");
//     ctx.drawImage(this, 0, 0);

//     dataURL = canvas.toDataURL("image/png");

//     dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
//   };

//   return dataURL;
// };
// const url = `https://s3.ap-south-1.amazonaws.com/pb-egov-assets/${property.tenantId}/logo.png`;
const getHeaderDetails = (property, cities) => {
  const propertyTenant = cities.filter((item) => item.code === property.tenantId);
  return {
    header: `${propertyTenant[0].name} MUNICIPAL CORPORATION`,
    subheader: "Property Tax Payment Receipt (Citizen Copy)",
    logo: propertyTenant[0].imageId || msevaLogo,
    contact: propertyTenant[0].contactNumber,
    website: propertyTenant[0].domainUrl,
  };
};

const createReceiptDetails = (property, propertyDetails, receiptDetails, localizationLabels, cities, totalAmountToPay) => {
  return {
    ReceiptNo: get(receiptDetails, "Bill[0].billDetails[0].receiptNumber"),
    header: getHeaderDetails(property, cities),
    taxNew:
      receiptDetails &&
      getTaxInfo(receiptDetails.Bill[0].billDetails[0].billAccountDetails, receiptDetails.Bill[0].billDetails[0].totalAmount, localizationLabels),
    tax: {
      AmountPaid: "100",
      fireCess: "10",
      rebate: "10",
      total: "100",
    },
    receipts: {
      AmountPaid: receiptDetails && get(receiptDetails, "Bill[0].billDetails[0].amountPaid").toString(),
      transactionId: receiptDetails && get(receiptDetails, "Bill[0].billDetails[0].receiptNumber"),
      bankName: "AXIS",
      payMode: "Net Banking",
      pendingAmt: receiptDetails && (totalAmountToPay - get(receiptDetails, "Bill[0].billDetails[0].amountPaid")).toString(),
      paymentDate: receiptDetails && getDateFromEpoch(get(receiptDetails, "Bill[0].billDetails[0].receiptDate")),
      receiptNo: receiptDetails && get(receiptDetails, "Bill[0].billDetails[0].receiptNumber"),
      transactionNo: receiptDetails && get(receiptDetails, "instrument.transactionNumber"),
      transactionDate: receiptDetails && get(receiptDetails, "instrument.transactionDate"),
      bankNameBranch: receiptDetails && `${get(receiptDetails, "instrument.bank.id")}, ${get(receiptDetails, "instrument.branchName")}`,
    },
    propertyDetails: [{ ...propertyDetails }],
    address: property.address,
    owners: propertyDetails.owners,
    existingPropertyId: property.oldPropertyId,
    propertyId: property.propertyId,
  };
};

export default createReceiptDetails;
