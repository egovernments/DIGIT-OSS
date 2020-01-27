
import get from "lodash/get";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../ui-utils/commons";
import { convertDateToEpoch } from "../utils/index";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { validateFields, getTextToLocalMapping } from "../utils/index";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";

export const propertySearch= async (state,dispatch)=>{
  searchApiCall(state,dispatch,0)
}

export const applicationSearch= async (state,dispatch)=>{
  searchApiCall(state,dispatch,1)
}

 const searchApiCall = async (state, dispatch,index) => {
  showHideTable(false, dispatch,0);
  showHideTable(false, dispatch,1);
  let queryObject = [
    {
      key: "tenantId",
      value: getTenantId()
    }
    // { key: "limit", value: "10" },
    // { key: "offset", value: "0" }
  ];
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );

  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.captureMutationDetails.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchProperty.children.searchPropertyDetails.children.ulbCityContainer.children",
    state,
    dispatch,
    "propertySearch"
  );

  const isownerCityRowValid= validateFields(
    "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.ulbCity",
    state,
    dispatch,
    "propertySearch"
  );


  const isownerMobNoRowValid= validateFields(
    "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.ownerMobNo",
    state,
    dispatch,
    "propertySearch"
  );

  const ispropertyTaxUniqueIdRowValid= validateFields(
    "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.propertyTaxUniqueId",
    state,
    dispatch,
    "propertySearch"
  );

  const isexistingPropertyIdRowValid= validateFields(
    "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.existingPropertyId",
    state,
    dispatch,
    "propertySearch"
  );

  const ispropertyTaxApplicationNoRowValid= validateFields(
    "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.appNumberContainer.children.propertyTaxApplicationNo",
    state,
    dispatch,
    "propertySearch"
  );

  if (!(isSearchBoxFirstRowValid)) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill valid fields to search",
          labelKey: "ERR_FIRENOC_FILL_VALID_FIELDS"
        },
        "error"
      )
    );
  } 
  if (isSearchBoxFirstRowValid  && isownerCityRowValid && !(ispropertyTaxUniqueIdRowValid || isexistingPropertyIdRowValid || isownerMobNoRowValid || ispropertyTaxApplicationNoRowValid)){
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Please fill at least one field along with city",
            labelKey: "PT_SEARCH_SELECT_AT_LEAST_ONE_TOAST_MESSAGE_OTHER_THAN_CITY"
          },
          "error"
        )
      );
    }
  
   if (
    Object.keys(searchScreenObject).length == 0 || Object.keys(searchScreenObject).length == 1 ||
    (Object.values(searchScreenObject).every(x => x === ""))
  ) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill at least one field along with city",
          labelKey: "PT_SEARCH_SELECT_AT_LEAST_ONE_TOAST_MESSAGE_OTHER_THAN_CITY"
        },
        "error"
      )
    );
  } 
//   else if (
//     (searchScreenObject["fromDate"] === undefined ||
//       searchScreenObject["fromDate"].length === 0) &&
//     searchScreenObject["toDate"] !== undefined &&
//     searchScreenObject["toDate"].length !== 0
//   ) {
//     dispatch(
//       toggleSnackbar(
//         true,
//         { labelName: "Please fill From Date", labelKey: "ERR_FILL_FROM_DATE" },
//         "warning"
//       )
//     );
//   } 
  else {
    //  showHideProgress(true, dispatch);
    for (var key in searchScreenObject) {
      if (
        searchScreenObject.hasOwnProperty(key) &&
        searchScreenObject[key].trim() !== ""
      ) {
        if (key === "fromDate") {
          queryObject.push({
            key: key,
            value: convertDateToEpoch(searchScreenObject[key], "daystart")
          });
        } else if (key === "toDate") {
          queryObject.push({
            key: key,
            value: convertDateToEpoch(searchScreenObject[key], "dayend")
          });
        }
        // else if (key === "status") {
        //   queryObject.push({
        //     key: "action",
        //     value: searchScreenObject[key].trim()
        //   });
        // }
        else {
          queryObject.push({ key: key, value: searchScreenObject[key].trim() });
        }
      }
    }
    try {
      const response = await getSearchResults(queryObject);
      // const response = searchSampleResponse();

      let propertyData = response.Properties.map(item => ({
        [getTextToLocalMapping("Property Tax Unique Id")]:
          item.propertyId || "-",
        [getTextToLocalMapping("Owner Name")]: item.propertyDetails[0].owners[0].name || "-",
        [getTextToLocalMapping("Guardian Name")]:
          item.propertyDetails[0].owners[0].fatherOrHusbandName || "-",
        [getTextToLocalMapping("Existing Property Id")]:  
        item.oldPropertyId || "-",
        [getTextToLocalMapping("Address")]:
        item.propertyDetails[0].owners[0].permanentAddress || "-",
        tenantId: item.tenantId,
        [getTextToLocalMapping("Status")]: item.status || "-"
      }));

      let applicationData = response.Properties.map(item => ({
        // [getTextToLocalMapping("Application No")]:
        //   item.applicationNo || "-",
          [getTextToLocalMapping("Application No")]:
          item.propertyId || "-",
        [getTextToLocalMapping("Property Tax Unique Id")]: item.propertyId || "-",
        [getTextToLocalMapping("Application Type")]:
          item.applicationNo || "PT",
        [getTextToLocalMapping("Owner Name")]:  
        item.propertyDetails[0].owners[0].name || "-",
        [getTextToLocalMapping("Address")]:
        item.propertyDetails[0].owners[0].permanentAddress || "-",
        tenantId: item.tenantId,
        [getTextToLocalMapping("Status")]: item.status || "-"
      }));

      dispatch(
        handleField(
          "propertySearch",
          "components.div.children.searchPropertyTable",
          "props.data",
          propertyData
        )
      );
      dispatch(
        handleField(
          "propertySearch",
          "components.div.children.searchPropertyTable",
          "props.title",
          `${getTextToLocalMapping(
            "Search Results for Properties"
          )} (${response.Properties.length})`
        )
      );
      dispatch(
        handleField(
          "propertySearch",
          "components.div.children.searchApplicationTable",
          "props.data",
          applicationData
        )
      );
      dispatch(
        handleField(
          "propertySearch",
          "components.div.children.searchApplicationTable",
          "props.title",
          `${getTextToLocalMapping(
            "Search Results for Property Application"
          )} (${response.Properties.length})`
        )
      );
      //showHideProgress(false, dispatch);
      showHideTable(true, dispatch,index);
    } catch (error) {
      //showHideProgress(false, dispatch);
      dispatch(
        toggleSnackbar(
          true,
          { labelName: error.message, labelKey: error.message },
          "error"
        )
      );
      console.log(error);
    }
  }
};
const showHideTable = (booleanHideOrShow, dispatch,index) => {
  if(index==0){
  dispatch(
    handleField(
      "propertySearch",
      "components.div.children.searchPropertyTable",
      "visible",
      booleanHideOrShow
    )
  );
}
else{
  dispatch(
    handleField(
      "propertySearch",
      "components.div.children.searchApplicationTable",
      "visible",
      booleanHideOrShow
    )
  );
    }
};
