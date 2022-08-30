import React from "react";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import { handleScreenConfigurationFieldChange as handleField, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { getSearchResults } from "../../../../ui-utils/commons";
import { convertDateToEpoch, getTextToLocalMapping, validateFields } from "../utils/index";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { ComponentJsonPath, fetchBill, getPropertyWithBillAmount } from "./publicSearchResource/publicSearchUtils";

import {
  getPayload,
  getTenantName
} from "./publicSearchResource/publicSearchUtils";
import {
  enableField,disableField
 } from "egov-ui-framework/ui-utils/commons";
export const iSearch = async (state, dispatch) => {
  searchApiCall(state, dispatch, 0)
}


const removeValidation = (state, dispatch, index) => {
 
  dispatch(
    handleField(
      "public-search",
      "components.div.children.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.ownerMobNo",
      "props.error",
      false
    )
  );
  dispatch(
    handleField(
      "public-search",
      "components.div.children.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.propertyTaxUniqueId",
      "props.error",
      false
    )
  );
  dispatch(
    handleField(
      "public-search",
      "components.div.children.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.existingPropertyId",
      "props.error",
      false
    )
  );
  dispatch(
    handleField(
      "public-search",
      "components.div.children.iSearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.appNumberContainer.children.propertyTaxApplicationNo",
      "props.error",
      false
    )
  );
  dispatch(
    handleField(
      "public-search",
      "components.div.children.iSearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.appNumberContainer.children.ownerMobNoProp",
      "props.error",
      false
    )
  );
  dispatch(
    handleField(
      "public-search",
      "components.div.children.iSearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.appNumberContainer.children.applicationPropertyTaxUniqueId",
      "props.error",
      false
    )
  );


  dispatch(
    handleField(
      "public-search",
      "components.div.children.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.ownerMobNo",
      "isFieldValid",
      true
    )
  );
  dispatch(
    handleField(
      "public-search",
      "components.div.children.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.propertyTaxUniqueId",
      "isFieldValid",
      true
    )
  );
  dispatch(
    handleField(
      "public-search",
      "components.div.children.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.existingPropertyId",
      "isFieldValid",
      true
    )
  );
  dispatch(
    handleField(
      "public-search",
      "components.div.children.iSearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.appNumberContainer.children.propertyTaxApplicationNo",
      "isFieldValid",
      true
    )
  );
  dispatch(
    handleField(
      "public-search",
      "components.div.children.iSearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.appNumberContainer.children.ownerMobNoProp",
      "isFieldValid",
      true
    )
  );
  dispatch(
    handleField(
      "public-search",
      "components.div.children.iSearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.appNumberContainer.children.applicationPropertyTaxUniqueId",
      "isFieldValid",
      true
    )
  );

}

const getAddress = (item) => {
  let doorNo = item.address.doorNo != null ? (item.address.doorNo + ",") : '';
  let buildingName = item.address.buildingName != null ? (item.address.buildingName + ",") : '';
  let street = item.address.street != null ? (item.address.street + ",") : '';
  let mohalla = item.address.locality.name ? (item.address.locality.name + ",") : '';
  let city = item.address.city != null ? (item.address.city) : '';
  return (doorNo + buildingName + street + mohalla + city);
}


const searchApiCall = async (state, dispatch, index) => {
   showHideTable(false, dispatch, 0);
  showHideTable(false, dispatch, 1);

  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "publicSearchScreen",
    {}
  );

  if(searchScreenObject.selected=="OptionPID")
  {
    searchScreenObject.doorNo="";
    searchScreenObject.name="";
    searchScreenObject.locality="";
  }
  else if(searchScreenObject.selected=="OptionPD")
  {
    searchScreenObject.ids="";
    searchScreenObject.oldPropertyId="";
    
  }

  if (!searchScreenObject.tenantId ) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill valid fields to search",
          labelKey: "ERR_PT_FILL_TENATID_FIELD"
        },
        "error"
      )
    );
    return;

  } 

  let tenants = state.common.cities && state.common.cities;

  let filterTenant ;

 if (process.env.REACT_APP_NAME === "Citizen")
 {
    filterTenant = tenants && tenants.filter(m=>m.key===searchScreenObject.tenantId);
 }
 else
 {
    filterTenant = tenants && tenants.filter(m=>m.key===getTenantId());
 }


let tenantUniqueId = filterTenant && filterTenant[0] && filterTenant[0].city && filterTenant[0].city.code;


  





  let queryObject = [
    {
      key: "tenantId",
      value: searchScreenObject.tenantId
    }
  ]; 

    removeValidation(state, dispatch, index);

    //  showHideProgress(true, dispatch);
    for (var key in searchScreenObject) {
      if (
        searchScreenObject.hasOwnProperty(key) &&
        searchScreenObject[key] && searchScreenObject[key].trim() !== ""
      ) {
        if (key === "fromDate") {
          queryObject.push({
            key: key,
            value: convertDateToEpoch(searchScreenObject[key], "daystart")
          });
        } else if (key === "tenantId") {
          // queryObject.push({
          //   key: key,
          //   value: convertDateToEpoch(searchScreenObject[key], "dayend")
          // });

        }
        else if (key === "ids") {
          queryObject.push({
            key: "propertyIds",
            value: tenantUniqueId && "PT-"+tenantUniqueId+"-"+searchScreenObject[key].trim()
          });
        }

        else if (key === "toDate") {
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
      disableField('public-search',"components.div.children.iSearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.button.children.buttonContainer.children.searchButton",dispatch);
      disableField('public-search', "components.div.children.iSearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.button.children.buttonContainer.children.searchButton",dispatch);
      const isAdvancePaymentAllowed = get(state, "screenConfiguration.preparedFinalObject.businessServiceInfo.isAdvanceAllowed");
      const disablepaybutton = get(state, "screenConfiguration.preparedFinalObject.paybuttonconfig");
    const querryObject = getPayload(searchScreenObject);
      const response = await getSearchResults(queryObject);

      if(!response.Properties.length)
      {     
        const { cities } = state.common;

   
      let tenantInfo = cities && cities.filter(e => e.key === searchScreenObject.tenantId );  


      let contactNumber = get(tenantInfo && tenantInfo.length>0 && tenantInfo[0], "contactNumber");  

      
      let email =  get(tenantInfo && tenantInfo.length>0 && tenantInfo[0], "emailId");  


        dispatch(
          toggleSnackbar(
            true,
            {
              labelName: "Please fill valid fields to search",
              labelKey:"PT_NOT_FOUND_MESSAGE",
              dynamicArray: [contactNumber, email],
            },
            "error"
          )
        );
      }
      const getIndexofActive = (item) => {

        if(item && item.status=="INWORKFLOW")
        {
          for(let i=0;i<item.owners.length;i++)
          {
            if(item.owners[i].status=='INACTIVE')
            {
            return i;
            }
            else{
              return i;
            }
          }
        }
        else if(item && item.status==="ACTIVE")
        {
          for(let i=0;i<item.owners.length;i++)
          {          
            if(item.owners[i].status==="ACTIVE")
            {
            return i;
            }
          }
        }
      
      }
      // const response = searchSampleResponse();
      const billResponse = await fetchBill(dispatch, response, searchScreenObject.tenantId, "PT");
      const finalResponse = getPropertyWithBillAmount(response, billResponse);
         
      
      let propertyData = finalResponse.Properties.map(item => ({
        ["PT_MUTATION_PID"]:
          item.propertyId || "-",
        ["PT_COMMON_TABLE_COL_OWNER_NAME"]: item.owners[getIndexofActive(item)].name || "-",
        ["PT_COMMON_COL_ADDRESS"]:
          getAddress(item) || "-",
        ["TENANT_ID"]: item.tenantId,
        ["PT_COMMON_COL_EXISTING_PROP_ID"]: item.oldPropertyId || "-",
        ["PT_COMMON_TABLE_PROPERTY_STATUS"]: item.status || "-",
        ["PT_AMOUNT_DUE"]: (item.totalAmount || item.totalAmount===0) ? item.totalAmount : "-",
        ["PT_COMMON_TABLE_COL_ACTION_LABEL"]: { status: item.status, totalAmount: item.totalAmount, isAdvancePaymentAllowed, disablepaybutton },
    
               
       

      }));

     /*  let applicationData = response.Properties.map(item => ({
        ["PT_COMMON_TABLE_COL_APP_NO"]:
          item || "-",
        ["PT_COMMON_TABLE_COL_PT_ID"]: item || "-",
        ["PT_COMMON_TABLE_COL_APP_TYPE"]:
          item.creationReason ? <LabelContainer labelName={"PT." + item.creationReason} labelKey={"PT." + item.creationReason} /> : "NA",
        ["PT_COMMON_TABLE_COL_OWNER_NAME"]:
          item.owners[0].name || "-",
        ["PT_COMMON_COL_ADDRESS"]:
          getAddress(item) || "-",
        ["TENANT_ID"]: item.tenantId,
        ["PT_COMMON_TABLE_COL_STATUS_LABEL"]: item.status || "-",
        temporary: item
      }));
      enableField('public-search',"components.div.children.iSearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.button.children.buttonContainer.children.searchButton",dispatch);
      enableField('public-search', "components.div.children.iSearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.button.children.buttonContainer.children.searchButton",dispatch);
      */ 
     dispatch(
        handleField(
          "public-search",
          "components.div.children.searchPropertyTable",
          "props.data",
          propertyData
        )
      );
      dispatch(
        handleField(
          "public-search",
          "components.div.children.searchPropertyTable",
          "props.rows",
          response.Properties.length
        )
      );
     /*  dispatch(
        handleField(
          "public-search",
          "components.div.children.searchApplicationTable",
          "props.data",
          applicationData
        )
      ); */
      dispatch(
        handleField(
          "public-search",
          "components.div.children.searchApplicationTable",
          "props.rows",
          response.Properties.length
        )
      );
      //showHideProgress(false, dispatch);
      showHideTable(true, dispatch, index);
    } catch (error) {
      //showHideProgress(false, dispatch);
      enableField('public-search',"components.div.children.iSearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.button.children.buttonContainer.children.searchButton",dispatch);
      enableField('public-search', "components.div.children.iSearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.button.children.buttonContainer.children.searchButton",dispatch);
      dispatch(
        toggleSnackbar(
          true,
          { labelName: error.message, labelKey: error.message },
          "error"
        )
      );
      console.log(error);
    }
  
};
const showHideTable = (booleanHideOrShow, dispatch, index) => {
  if (index == 0) {
    dispatch(
      handleField(
        "public-search",
        "components.div.children.searchPropertyTable",
        "visible",
        booleanHideOrShow
      )
    );
  }
  else {
    dispatch(
      handleField(
        "public-search",
        "components.div.children.searchApplicationTable",
        "visible",
        booleanHideOrShow
      )
    );
  }
};





export const downloadPrintContainer = (
  action,
  state,
  dispatch,
  status,
  applicationNumber,
  tenantId
) => {
  /** MenuButton data based on status */
  let downloadMenu = [];
  let printMenu = [];
  let ptMutationCertificateDownloadObject = {
    label: { labelName: "PT Certificate", labelKey: "MT_CERTIFICATE" },
    link: () => {
      console.log("clicked");
    },
    leftIcon: "book"
  };
  let ptMutationCertificatePrintObject = {
    label: { labelName: "PT Certificate", labelKey: "MT_CERTIFICATE" },
    link: () => {
      console.log("clicked");
    },
    leftIcon: "book"
  };
  let receiptDownloadObject = {
    label: { labelName: "Receipt", labelKey: "MT_RECEIPT" },
    link: () => {
      console.log("clicked");
    },
    leftIcon: "receipt"
  };
  let receiptPrintObject = {
    label: { labelName: "Receipt", labelKey: "MT_RECEIPT" },
    link: () => {
      console.log("clicked");
    },
    leftIcon: "receipt"
  };
  let applicationDownloadObject = {
    label: { labelName: "Application", labelKey: "MT_APPLICATION" },
    link: () => {
      console.log("clicked");
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "Application", labelKey: "MT_APPLICATION" },
    link: () => {
      console.log("clicked");

    },
    leftIcon: "assignment"
  };
  switch (status) {
    case "APPROVED":
      downloadMenu = [
        ptMutationCertificateDownloadObject,
        receiptDownloadObject,
        applicationDownloadObject
      ];
      printMenu = [
        ptMutationCertificatePrintObject,
        receiptPrintObject,
        applicationPrintObject
      ];
      break;
    case "APPLIED":
    case "CITIZENACTIONREQUIRED":
    case "FIELDINSPECTION":
    case "PENDINGAPPROVAL":
    case "PENDINGPAYMENT":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    case "CANCELLED":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    case "REJECTED":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    default:
      break;
  }
  /** END */

  return {
    rightdiv: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: { textAlign: "right", display: "flex" }
      },
      children: {
        downloadMenu: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-pt",
          componentPath: "MenuButton",
          props: {
            data: {
              label: { labelName: "DOWNLOAD", labelKey: "MT_DOWNLOAD" },
              leftIcon: "cloud_download",
              rightIcon: "arrow_drop_down",
              props: { variant: "outlined", style: { height: "60px", color: "#FE7A51",marginRight:"5px" }, className: "pt-download-button" },
              menu: downloadMenu
            }
          }
        },
        printMenu: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-pt",
          componentPath: "MenuButton",
          props: {
            data: {
              label: { labelName: "PRINT", labelKey: "MT_PRINT" },
              leftIcon: "print",
              rightIcon: "arrow_drop_down",
              props: { variant: "outlined", style: { height: "60px", color: "#FE7A51" }, className: "pt-print-button" },
              menu: printMenu
            }
          }
        }

      },
      // gridDefination: {
      //   xs: 12,
      //   sm: 6
      // }
    }
  }
};
