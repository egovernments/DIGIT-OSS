import msevaLogo from "egov-ui-kit/assets/images/pblogo.png";
import { getDateFromEpoch } from "egov-ui-kit/utils/commons";
import get from "lodash/get";
import { getTranslatedLabel, getUlbGradeLabel, getCommaSeperatedAddress } from "egov-ui-kit/utils/commons";

const getTaxInfo = (billAccountDetails, totalAmount, localizationLabels) => {
  const headersFromAPI = billAccountDetails.map((item) => {
    return item.taxHeadCode && item.taxHeadCode;
  });
  const headers = [
    "PT_TAX",
    "PT_FIRE_CESS",
    "PT_CANCER_CESS",
    "PT_TIME_PENALTY",
    "PT_TIME_REBATE",
    "PT_TIME_INTEREST",
    "PT_UNIT_USAGE_EXEMPTION",
    "PT_OWNER_EXEMPTION",
    "PT_ADHOC_PENALTY",
    "PT_ADHOC_REBATE",
    "PT_ADVANCE_CARRYFORWARD",
    "PT_DECIMAL_CEILING",
    "PT_DECIMAL_CEILING_CREDIT",
    "PT_DECIMAL_CEILING_CREDIT_DEBIT",
    "PT_DECIMAL_CEILING_DEBIT",
    "PT_ROUNDOFF",
  ];
  const negativeHeaders = [
    "PT_ADHOC_REBATE",
    "PT_ADVANCE_CARRYFORWARD",
    "PT_DECIMAL_CEILING_CREDIT_DEBIT",
    "PT_DECIMAL_CEILING_DEBIT",
    "PT_OWNER_EXEMPTION",
    "PT_TIME_REBATE",
    "PT_UNIT_USAGE_EXEMPTION",
  ];
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
      const taxHeadContent = billAccountDetails.filter((item) => item.taxHeadCode && item.taxHeadCode === current);
      taxHeadContent &&
        taxHeadContent[0] &&
        result[1].push({
          text: taxHeadContent[0]
            ? taxHeadContent[0].amount
              ? taxHeadContent[0].amount
              : taxHeadContent[0].debitAmount
                ? `-${taxHeadContent[0].debitAmount}`
                : taxHeadContent[0].crAmountToBePaid
                  ? taxHeadContent[0].crAmountToBePaid
                  : "0"
            : "NA",
        });
      return result;
    },
    [[], []]
  );
  taxArray[0].push({ text: "Total" });
  taxArray[1].push({ text: totalAmount });
  return taxArray;
};

const getHeaderDetails = (property = {}, cities, localizationLabels, isAcknowledgement = false) => {
  const propertyTenant = cities.filter((item) => item.code === property.tenantId);
  const ulbGrade = get(propertyTenant[0], "city.ulbGrade") ? getUlbGradeLabel(get(propertyTenant[0], "city.ulbGrade")) : "MUNICIPAL CORPORATION";
  const cityKey = `TENANT_TENANTS_${get(propertyTenant[0], "code")
    .toUpperCase()
    .replace(/[.]/g, "_")}`;
  const subheader = isAcknowledgement ? "Property Tax Assess Acknowledgement" : "Property Tax Payment Receipt";
  return {
    // header: getReceiptHeaderLabel(name, ulbGrade),
    header: `${getTranslatedLabel(cityKey, localizationLabels).toUpperCase()} ${getTranslatedLabel(ulbGrade, localizationLabels)}`,
    subheader: subheader,
    logo: msevaLogo,
    contact: propertyTenant[0].contactNumber,
    website: propertyTenant[0].domainUrl,
  };
};

const getReceiptHeaderLabel = (name, ulbGrade) => {
  if (ulbGrade) {
    if (ulbGrade === "NP") {
      return `${name.toUpperCase()} NAGAR PANCHAYAT`;
    } else if (ulbGrade === "Municipal Corporation") {
      return `${name.toUpperCase()} MUNICIPAL CORPORATION`;
    } else if (ulbGrade.includes("MC Class")) {
      return `${name.toUpperCase()} MUNICIPAL COUNCIL`;
    } else {
      return `${name.toUpperCase()} MUNICIPAL CORPORATION`;
    }
  } else {
    return `${name.toUpperCase()} MUNICIPAL CORPORATION`;
  }
};

const createReceiptDetails = (property, propertyDetails, receiptDetails, localizationLabels, cities, totalAmountToPay, totalAmountPaid) => {
  return {
    ReceiptNo: get(receiptDetails, "Bill[0].billDetails[0].receiptNumber"),
    header: getHeaderDetails(property, cities, localizationLabels),
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
      bankName: receiptDetails && get(receiptDetails, "instrument.bank.name", "NA"),
      payMode: receiptDetails && get(receiptDetails, "instrument.instrumentType.name", "Net Banking"),
      pendingAmt: receiptDetails && (totalAmountToPay - totalAmountPaid).toString(),
      paymentDate: receiptDetails && getDateFromEpoch(get(receiptDetails, "Bill[0].billDetails[0].receiptDate")),
      receiptNo: receiptDetails && get(receiptDetails, "Bill[0].billDetails[0].receiptNumber"),
      transactionNo: receiptDetails && get(receiptDetails, "instrument.transactionNumber"),
      transactionDate: receiptDetails && getDateFromEpoch(get(receiptDetails, "instrument.transactionDateInput")),
      bankNameBranch: receiptDetails && `${get(receiptDetails, "instrument.bank.name")}, ${get(receiptDetails, "instrument.branchName")}`,
      G8receiptNo: receiptDetails && get(receiptDetails, "Bill[0].billDetails[0].manualReceiptNumber"),
      G8receiptDate:
        receiptDetails &&
        get(receiptDetails, "Bill[0].billDetails[0].manualReceiptDate") &&
        getDateFromEpoch(get(receiptDetails, "Bill[0].billDetails[0].manualReceiptDate")),
    },
    propertyDetails: [{ ...propertyDetails }],
    address: property.address,
    owners: propertyDetails.owners,
    existingPropertyId: property.oldPropertyId,
    propertyId: property.propertyId,
  };
};

const createReceiptUIInfo = (property, receiptDetails, cities, totalAmountToPay, success, totalAmountPaid, latestPropertyDetails) => {
  const amountToPay = receiptDetails && get(receiptDetails, success ? "Bill[0].billDetails[0].totalAmount" : "billDetails[0].totalAmount").toString();
  const amountDue = receiptDetails && (success ? totalAmountToPay - totalAmountPaid : amountToPay).toString();
  const { owners: ownerDetails, institution, ownershipCategory } = property.propertyDetails[0];
  const { financialYear } = latestPropertyDetails;
  const isInstitution = ownershipCategory === "INSTITUTIONALPRIVATE" || ownershipCategory === "INSTITUTIONALGOVERNMENT";
  const ownerInfo = isInstitution
    ? [{ key: "PT_INSTITUTION_NAME", value: institution.name }, { key: "PT_AUTHORISED_PERSON_NAME", value: ownerDetails[0].name }]
    : ownerDetails.map((item, index) => {
      return {
        //key: `Owner${ownerDetails.length > 1 ? index + 1 : ""} name:`,
        key: "PT_OWNER_NAME_RECEIPT",
        dynamicArray: [ownerDetails.length > 1 ? index + 1 : ""],
        value: item.name,
      };
    });
  return {
    propertyInfo: property && [
      ...ownerInfo,
      {
        key: "PT_PROPERTY_ADDRESS_EXISTING_PID",
        value: property.oldPropertyId,
      },
      {
        key: "PT_UNIQUE_ID",
        value: property.propertyId,
      },
      {
        key: "PT_PROPERTY_ADDRESS_SUB_HEADER",
        value: getCommaSeperatedAddress(property.address, cities),
      },
    ],
    receiptInfo: [
      {
        key: "PT_ASSESSMENT_NUMBER_RECEIPT",
        value: receiptDetails && get(receiptDetails, success ? "Bill[0].billDetails[0].consumerCode" : "billDetails[0].consumerCode").split(":")[1],
      },
      {
        key: "PT_RECEIPT_NUMBER",
        value: receiptDetails && get(receiptDetails, success ? "Bill[0].billDetails[0].receiptNumber" : "billDetails[0].receiptNumber"),
      },
      {
        key: "PT_PAYMENT_TERM",
        value: financialYear,
      },
      {
        key: "PT_DATE_RECEIPT_LABEL",
        value: receiptDetails && getDateFromEpoch(get(receiptDetails, success ? "Bill[0].billDetails[0].receiptDate" : "billDetails[0].billDate")),
      },
      {
        key: "PT_PAYABLE_AMOUNT",
        value: receiptDetails && get(receiptDetails, success ? "Bill[0].billDetails[0].totalAmount" : "billDetails[0].totalAmount").toString(),
      },
      {
        key: "PT_AMOUNT_PAID_LABEL",
        value: receiptDetails && success ? get(receiptDetails, "Bill[0].billDetails[0].amountPaid").toString() : "0",
      },
      {
        key: "PT_AMOUNT_DUE",
        value: amountDue,
      },
    ],
  };
};

export { createReceiptUIInfo, createReceiptDetails, getHeaderDetails };
