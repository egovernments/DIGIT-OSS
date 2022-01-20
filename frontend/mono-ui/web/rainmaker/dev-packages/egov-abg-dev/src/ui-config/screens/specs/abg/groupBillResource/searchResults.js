import { httpRequest } from "egov-ui-framework/ui-utils/api.js";
import { localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import React from "react";
import { getEpochForDate, sortByEpoch } from "../../utils";
import { billDownload } from "../billSearchResources/searchResults";


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
};

const onDownloadClick = async rowData => {
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

  const billendpoint = "/collection-services-v1/receipts/_search";
  const billResponse = await httpRequest(
    "post",
    billendpoint,
    "",
    queryObject2
  );
};

export const searchResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      {
        labelKey: "ABG_COMMON_TABLE_COL_BILL_NO",
        labelName: "Bill No.",
        options: {
          filter: false,
          customBodyRender: (value, tableMeta) => (
            <a href="javascript:void(0)" onClick={() => billDownload(tableMeta.rowData[1], tableMeta.rowData[5], tableMeta.rowData[7], tableMeta.rowData[6], tableMeta.rowData[8])}>{value}</a>
          )
        }
      },
      { labelName: "Consumer ID", labelKey: "ABG_COMMON_TABLE_COL_CONSUMER_ID" },
      { labelName: "Owner Name", labelKey: "ABG_COMMON_TABLE_COL_OWN_NAME" },
      { labelName: "Bill Date", labelKey: "ABG_COMMON_TABLE_COL_BILL_DATE" },
      { labelName: "Status", labelKey: "ABG_COMMON_TABLE_COL_STATUS" },
      {
        labelName: "Tenant Id",
        labelKey: "TENANT_ID",
        options: {
          display: false
        }
      },
      {
        labelName: "business URL",
        labelKey: "BUSINESS_URL",
        options: {
          display: false
        }
      },
      {
        labelName: "Bill Key",
        labelKey: "BILL_KEY",
        options: {
          display: false
        }
      },
      {
        labelKey: "BUSINESS_SERVICE",
        labelName: "Business Service",
        options: {
          display: false
        }
      },
    ],
    title: { labelName: "Search Results for Group Bills", labelKey: "BILL_GENIE_GROUP_SEARCH_HEADER" },
    rows: "",
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20],
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

