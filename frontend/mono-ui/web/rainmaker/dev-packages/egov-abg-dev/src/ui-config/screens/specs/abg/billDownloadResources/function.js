import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
  toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import { getBulkPdfRecords } from "../../../../../ui-utils/commons";

export const searchApiCall = async (state, dispatch) => {
  showHideTable(false, dispatch);

  let queryObject = [
    {
      key: "offset",
      value: 0,
    },
    { key: "limit", value: 100 },
  ];

  const responseFromAPI = await getBulkPdfRecords(dispatch, queryObject);
  const bills = (responseFromAPI && responseFromAPI.groupBillrecords) || [];
  const billTableData = bills.map((item) => {
    return {
      createdtime: get(item, "createdtime"),
      locality: get(item, "locality"),
      tenantId: get(item, "tenantId"),

      consumercode: get(item, "consumercode"),
      bussinessService: get(item, "bussinessService"),
      isConsolidated: get(item, "isConsolidated"),
      lastmodifiedtime: get(item, "lastmodifiedtime"),
      totalrecords: get(item, "totalrecords"),
      recordscompleted: get(item, "recordscompleted"),
      filestoreid: get(item, "filestoreid"),
    };
  });
  dispatch(
    prepareFinalObject("searchScreenMdmsData.billSearchResponse", bills)
  );

  try {
    let data = billTableData.map((item) => ({
      ["TL_DATE_LABEL"]: item.createdtime || "-",
      ["PAYMENT_COMMON_CONSUMER_CODE"]: item.consumercode || "-",
      ["CS_INBOX_LOCALITY_FILTER"]:
        `${getTransformedLocale(item.tenantId)}_REVENUE_${item.locality}` ||
        "-",
      ["BUSINESS_SERVICE"]:
        `BILLINGSERVICE_BUSINESSSERVICE_${item.bussinessService}` || "-",
      ["ABG_COMMON_TABLE_COL_STATUS"]:
        (item.recordscompleted / item.totalrecords) * 100 || "",
      ["ABG_COMMON_TABLE_COL_ACTION"]: item.filestoreid || "",
      ["ABG_COMMON_TABLE_TENANT"]: item.tenantId || "NA",
      ["ABG_IS_FAILED"]:
        item.recordscompleted === item.totalrecords && !item.filestoreid,
      ["ABG_RETRY_OBJ"]: {
        locality: item.locality,
        consumercode: item.consumercode,
        isConsolidated: item.isConsolidated,
        bussinessService: item.bussinessService,
      },
      ["ABG_PROGRESS_OBJ"]: {
        recordscompleted: item.recordscompleted,
        totalrecords: item.totalrecords,
        failed:
          item.recordscompleted === item.totalrecords && !item.filestoreid,
      },
    }));
    dispatch(
      handleField(
        "billDownload",
        "components.div.children.searchResults",
        "props.data",
        data
      )
    );
    dispatch(
      handleField(
        "billDownload",
        "components.div.children.searchResults",
        "props.tableData",
        billTableData
      )
    );
    dispatch(
      handleField(
        "billDownload",
        "components.div.children.searchResults",
        "props.rows",
        billTableData.length
      )
    );

    showHideTable(true, dispatch);
  } catch (error) {
    dispatch(toggleSnackbar(true, error.message, "error"));
    console.log(error);
  }
};

const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "billDownload",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};
