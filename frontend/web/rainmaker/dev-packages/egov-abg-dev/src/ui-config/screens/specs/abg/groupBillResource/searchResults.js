import React from "react";
import get from "lodash/get";
import { sortByEpoch, getEpochForDate,getTextToLocalMapping } from "../../utils";
import { generateSingleBill } from "../../utils/receiptPdf";
import { Button } from "egov-ui-framework/ui-atoms";
import { httpRequest } from "egov-ui-framework/ui-utils/api.js";
import { localStorageGet } from "egov-ui-kit/utils/localStorageUtils";

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
};

export const searchResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      getTextToLocalMapping("Bill No."),   
      getTextToLocalMapping("Consumer ID"),
      getTextToLocalMapping("Owner Name"),
      getTextToLocalMapping("Bill Date"),
      getTextToLocalMapping("Status"),
      // {
      //   name:  getTextToLocalMapping("View button"),
      //   options: {
      //     filter: false,
      //     customBodyRender: value => (
      //       <Button
      //       color="primary"
      //       primary={true}
      //       onClick={() => generateSingleBill(rowData)}
      //       >
      //         {"View"}
      //       </Button>
      //     )
      //   }
      // },
      {
        name: "tenantId",
        options: {
          display: false
        }
      }
    ], 
    title: getTextToLocalMapping(
      "Search Results for Trade License Applications"
    ),  
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20],
      onRowClick: (row, index) => generateSingleBill(row)
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

