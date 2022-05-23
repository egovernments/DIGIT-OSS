import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import { getBillAmendSearchResult, searchBill } from "../../../../../ui-utils/commons";
import { validateFields } from "../../utils";

export const getAddress=(tenantId,locality)=>{
  if(!tenantId&&!locality){
    return'NA';
  }
  let address='';
  let tenantList=tenantId&&tenantId.split('.')|| [];

  let localityMessage=locality&&tenantId&&tenantList.length>1&&getLocaleLabels(tenantId,`TENANT_TENANTS_${tenantList[0]&&tenantList[0].toUpperCase()}_${tenantList[1]&&tenantList[1].toUpperCase()}`)||'';
  let tenantMessage=locality&&tenantId&&getLocaleLabels(locality,`${tenantList[0]&&tenantList[0].toUpperCase()}_${tenantList[1]&&tenantList[1].toUpperCase()}_REVENUE_${locality.toUpperCase()}`)+','||'';
  address=tenantMessage+localityMessage;
  return address;
}
export const searchApiCall = async (state, dispatch) => {
  showHideTable(false, dispatch);

  let queryObject = [

  ];
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreenBillAmend",
    {}
  );

  let isSearchBoxFirstRowValid = validateFields(
    "components.div.children.searchCard.children.cardContent.children.searchContainer.children",
    state,
    dispatch,
    "search"
  );
  if (isSearchBoxFirstRowValid) {
    isSearchBoxFirstRowValid = get(searchScreenObject, 'mobileNumber', '') == "" && get(searchScreenObject, 'amendmentId', '') == "" && get(searchScreenObject, 'consumerCode', '') == "" ? false : true;
  }

  if (!isSearchBoxFirstRowValid) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill at least one field to start search",
          labelKey: "BILL_SEARCH_SELECT_AT_LEAST_ONE_TOAST_MESSAGE"
        },
        "warning"
      )
    );
  } else if (
    Object.keys(searchScreenObject).length == 0 ||
    Object.values(searchScreenObject).every(x => x === "")
  ) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill at least one field to start search",
          labelKey: "BILL_SEARCH_SELECT_AT_LEAST_ONE_TOAST_MESSAGE"
        },
        "warning"
      )
    );
  } else {
    for (var key in searchScreenObject) {
      if (
        searchScreenObject.hasOwnProperty(key) && searchScreenObject[key] &&
        searchScreenObject[key].trim() !== ""
      ) {
        queryObject.push({ key: key, value: searchScreenObject[key].trim() });
      }
      if (searchScreenObject.hasOwnProperty(key) &&
        searchScreenObject[key] == "") {
        delete searchScreenObject[key];
      }
    }
    let serviceObject = get(
      state.screenConfiguration.preparedFinalObject,
      "searchScreenMdmsData.BillingService.BusinessService"
    ).filter(item => item.code === searchScreenObject.businesService);

    const responseFromAPI = await getBillAmendSearchResult(queryObject, dispatch)
    const Amendments = (responseFromAPI && responseFromAPI.Amendments) || [];

    if (get(searchScreenObject, 'amendmentId', '') != "" && get(searchScreenObject, 'consumerCode', '') == "" && get(responseFromAPI, 'Amendments[0].consumerCode', '') != '') {
      queryObject.push({
        "key": 'consumerCode',
        "value": get(responseFromAPI, 'Amendments[0].consumerCode', '')
      })
    } else if (get(searchScreenObject, 'mobileNumber', '') == "" &&get(searchScreenObject, 'consumerCode', '') == "" && get(searchScreenObject, 'amendmentId', '') != "") {
      dispatch(
        handleField(
          "search",
          "components.div.children.searchResults",
          "props.tableData",
          []
        )
      );
      dispatch(
        handleField(
          "search",
          "components.div.children.searchResults",
          "props.rows",
          0
        )
      );

      showHideTable(true, dispatch);
      return;
    }
    const resp = await searchBill(queryObject, dispatch)
    
    const amendObj = {};
    const addtionalObj={}
    Amendments.map(bill => {
      if(amendObj[bill.consumerCode]){
        addtionalObj[bill.amendmentId] = bill;
      }else{
        amendObj[bill.consumerCode] = bill;
      }
     
    })
    let usedBills={}
    const billTableData = resp.Bill.map(item => {
      let amendTempObj = {}
      if (amendObj[get(item, "connectionNo")]) {
        amendTempObj = {...amendObj[get(item, "connectionNo")]};
        usedBills[get(item, "connectionNo", '')] = { ...item }
        delete amendObj[get(item, "connectionNo", '')];
      }
      usedBills[get(item, "connectionNo")]={...item};

      return {

        businessService:  get(amendTempObj, "businessService", get(searchScreenObject, 'businessService', '')),
        amendmentId:  get(amendTempObj, "amendmentId", "NA"),
        consumerCode: get(item, "connectionNo"),
        status: get(amendTempObj, "status", "NA"),
        consumerName: get(item, "additionalDetails.ownerName",   "NA"),
        consumerAddress:getAddress( get(item, "tenantId"),get(item, "additionalDetails.locality")) ,
        tenantId: get(item, "tenantId"),
        connectionType: get(item, "connectionType", 'Metered'),
      };
    });

    Object.keys(addtionalObj).map(key=>{
      billTableData.push({
        

          businessService:  get(addtionalObj[key], "businessService", get(searchScreenObject, 'businessService', '')),
          amendmentId:  get(addtionalObj[key], "amendmentId", "NA"),
          consumerCode: get(addtionalObj[key], "consumerCode"),
          status: get(addtionalObj[key], "status", "NA"),
          consumerName: get(usedBills[get(addtionalObj[key], "consumerCode")], "additionalDetails.ownerName",   "NA"),
          consumerAddress:getAddress( get(addtionalObj[key], "tenantId"),get(usedBills[get(addtionalObj[key], "consumerCode")], "additionalDetails.locality")) ,
          tenantId: get(addtionalObj[key], "tenantId"),
          connectionType: get(addtionalObj[key], "connectionType", 'Metered'),
        
      })
    })
    // const bills = (resp && resp.Bill) || [];
    // const respObj = {};
    // bills.map(bill => {
    //   respObj[bill.connectionNo] = bill;
    // })
    // let usedBills = {};
    // const billTableData = Amendments.map(item => {
    //   let billDetails = {}
    //   if (respObj[get(item, "consumerCode", '')]) {
    //     billDetails = respObj[get(item, "consumerCode", '')]
    //     usedBills[get(item, "consumerCode", '')] = { ...billDetails }
    //     delete respObj[get(item, "consumerCode", '')];
    //   } else if (usedBills[get(item, "consumerCode", '')]) {
    //     billDetails = usedBills[get(item, "consumerCode", '')]
    //   } else {
    //     billDetails = {};
    //   }

    //   return {
    //     businessService: get(item, "businessService"),
    //     amendmentId: get(item, "amendmentId", 'NA'),
    //     consumerCode: get(item, "consumerCode"),
    //     status: get(item, "status", "NA"),
    //     consumerName: get(billDetails, "payerName",  get(item, "additionalDetails.payerName", "NA")),
    //     consumerAddress: get(billDetails, "payerAddress",  get(item, "additionalDetails.payerAddress", "NA")),
    //     tenantId: get(item, "tenantId"),
    //     connectionType: get(item, "additionalDetails.connectionType", 'Metered')
    //   };
    // });


    // if (respObj && Object.keys(respObj).length > 0) {

    //   Object.values(respObj).map(billDetail => {
    //     if (billDetail) {
    //       billTableData.push({
    //         businessService: get(billDetail, "businessService"),
    //         amendmentId: 'NA',
    //         consumerCode: get(billDetail, "consumerCode"),
    //         status: "NA",
    //         consumerName: get(billDetail, "payerName", 'NA'),
    //         consumerAddress: get(billDetail, "payerAddress", 'NA'),
    //         tenantId: get(billDetail, "tenantId"),
    //         connectionType: 'Metered'
    //       })
    //     }
    //   })
    // }
    // dispatch(
    //   prepareFinalObject("searchScreenMdmsData.searchResponse", bills)
    // );

    try {
      let data = billTableData.map(item => ({

        ['BILL_COMMON_SERVICE_TYPE']: item.businessService || "-",
        ["BILL_COMMON_APPLICATION_NO"]: item.amendmentId || "NA",
        ["PAYMENT_COMMON_CONSUMER_CODE"]: item.consumerCode || "-",

        ['BILL_COMMON_TABLE_COL_CONSUMER_NAME']: item.consumerName || "-",
        ['BILL_COMMON_TABLE_CONSUMER_ADDRESS']: item.consumerAddress || "-",

        ['BILL_COMMON_TABLE_COL_STATUS']: item.status || "-",

        ["TENANT_ID"]: item.tenantId || '',
        ['BUSINESS_SERVICE']: item.businessService || "-",
        ['SERVICE_CONST']: item.businessService == 'WS' ? 'WATER' : (item.businessService == 'SW' ? 'SEWERAGE' : 'NA'),
        ['CONNECTION_TYPE']: item.connectionType || "NA"

      }));


      dispatch(
        handleField(
          "search",
          "components.div.children.searchResults",
          "props.data",
          data
        )
      );
      dispatch(
        handleField(
          "search",
          "components.div.children.searchResults",
          "props.tableData",
          billTableData
        )
      );
      dispatch(
        handleField(
          "search",
          "components.div.children.searchResults",
          "props.rows",
          billTableData.length
        )
      );

      showHideTable(true, dispatch);
    } catch (error) {
      dispatch(toggleSnackbar(true, error.message, "error"));
    }
  }
};

const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "search",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};
