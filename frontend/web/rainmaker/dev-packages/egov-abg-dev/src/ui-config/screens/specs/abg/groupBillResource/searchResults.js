import React from "react";
import { Link } from "react-router-dom";
import get from "lodash/get";
import { sortByEpoch, getEpochForDate } from "../../utils";
import { generateSingleBill } from "../../utils/receiptPdf";
import { getLocalization } from "egov-ui-kit/utils/localStorageUtils";
import { Button, Icon } from "egov-ui-framework/ui-atoms";
import { DownloadIcon } from "ui-atoms-local";
import { httpRequest } from "egov-ui-framework/ui-utils/api.js";
import { localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import { COPYFILE_EXCL } from "constants";
import { objectOf } from "prop-types";
import {
  getTransformedLocalStorgaeLabels,
  getLocaleLabels
} from "egov-ui-framework/ui-utils/commons";

const getLocalTextFromCode = localCode => {
  return JSON.parse(getLocalization("localization_en_IN")).find(
    item => item.code === localCode
  );
};

const getConsumerDetail = propertyResponse => {
  return {
    propertyId: get(propertyResponse, "Properties[0].propertyId", "NA"),
    name: get(
      propertyResponse,
      "Properties[0].propertyDetails[0].owners[0].name",
      "NA"
    ),
    mobileno: get(
      propertyResponse,
      "Properties[0].propertyDetails[0].owners[0].mobileNumber",
      "NA"
    ),
    address: get(propertyResponse, "Properties[0].address.city", "NA"),
    locality: get(propertyResponse, "Properties[0].address.locality.name", "NA")
  };
};

const getBillDetails = billResponse => {
  const requiredData = [];

  const billAccountDetails = get(
    billResponse,
    "Receipt[0].Bill[0].billDetails[0].billAccountDetails",
    []
  );
  for (let i = 0; i < billAccountDetails.length; i++) {
    let obj = {
      TaxHead: billAccountDetails[i].taxHeadCode,
      Amount: billAccountDetails[i].amount,
      Arrear: 0,
      Adjustmeents: 0,
      Total: 0
    };
    requiredData.push(obj);
  }

  // console.log(requiredData);
};

const onDownloadClick = async rowData => {
  // console.log(rowData);
  const queryObject1 = [
    {
      key: "ids",
      value: rowData["Property ID"]
    },

    {
      key: "tenantId",
      value: localStorageGet("tenant-id")
    }
  ];
  const queryObject2 = [
    {
      key: "consumerCode",
      value: `${rowData["Property ID"]}:${rowData["Assessment No"]}`
    },

    {
      key: "tenantId",
      value: localStorageGet("tenant-id")
    }
  ];

  const propertyendpoint = "/pt-services-v2/property/_search";
  const propertyResponse = await httpRequest(
    "post",
    propertyendpoint,
    "",
    queryObject1
  );
  // console.log(propertyResponse);

  const billendpoint = "/collection-services-v1/receipts/_search";
  const billResponse = await httpRequest(
    "post",
    billendpoint,
    "",
    queryObject2
  );

  const consumerDetails = getConsumerDetail(propertyResponse);
  const billDetails = getBillDetails(billResponse);
};

export const textToLocalMapping = {
  "Consumer ID": getLocaleLabels(
    "Consumer ID",
    "ABG_COMMON_TABLE_COL_CONSUMER_ID",
    getTransformedLocalStorgaeLabels()
  ),
  "Bill No.": getLocaleLabels(
    "Bill No.",
    "ABG_COMMON_TABLE_COL_BILL_NO",
    getTransformedLocalStorgaeLabels()
  ),
  "Owner Name": getLocaleLabels(
    "Owner Name",
    "ABG_COMMON_TABLE_COL_OWN_NAME",
    getTransformedLocalStorgaeLabels()
  ),
  "Bill Date": getLocaleLabels(
    "Bill Date",
    "ABG_COMMON_TABLE_COL_BILL_DATE",
    getTransformedLocalStorgaeLabels()
  ),
  Download: getLocaleLabels("Download", "ABG_COMMON_TABLE_COL_DOWNLOAD_BUTTON"),
  "View button": getLocaleLabels(
    "Action",
    "ABG_COMMON_TABLE_COL_VIEW_BUTTON",
    getTransformedLocalStorgaeLabels()
  )
};

export const searchResults = {
  uiFramework: "custom-molecules",
  // moduleName: "egov-tradelicence",
  componentPath: "Table",
  visible: false,
  props: {
    // data: [],
    columns: {
      [get(textToLocalMapping, "Bill No.")]: {},
      [get(textToLocalMapping, "Consumer ID")]: {},
      [get(textToLocalMapping, "Owner Name")]: {},
      [get(textToLocalMapping, "Bill Date")]: {},
      [get(textToLocalMapping, "View button")]: {
        format: rowData => {
          return (
            <Button
              color="primary"
              primary={true}
              onClick={() => generateSingleBill(rowData)}
            >
              {"View"}

              {/* <DownloadIcon fill="#FE7A51" />
              {get(textToLocalMapping, "View button")} */}
            </Button>
          );
        }
      }
    },
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20]
    },
    customSortColumn: {
      column: "Date Created",
      sortingFn: (data, i, sortDateOrder) => {
        const epochDates = data.reduce((acc, curr) => {
          acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
          return acc;
        }, []);
        const order = sortDateOrder === "asc" ? true : false;
        const finalData = sortByEpoch(epochDates, !order).map(item => {
          item.pop();
          return item;
        });
        return { data: finalData, currentOrder: !order ? "asc" : "desc" };
      }
    }
  }
};

// const onRowClick = rowData => {
//   switch (rowData[get(textToLocalMapping, "")]) {
//     default:
//       return `/abg/groupBills`;
//   }
// };
