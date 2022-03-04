import {
    getCommonHeader,
    getLabel,
    getBreak
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { SearchChallanCard } from "./universalCollectionResources/searchChallanCard";
  import get from "lodash/get";
  import { setServiceCategory } from "../utils";
  
  import { SearchChallanResults } from "./universalCollectionResources/searchChallanResults";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { httpRequest } from "../../../../ui-utils";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import "./index.css";
  
  const tenantId = getTenantId();
  const header = getCommonHeader({
    labelName: "Challan Search",
    labelKey: "ACTION_TEST_CHALLAN_SEARCH"
  });
  
  const hasButton = getQueryArg(window.location.href, "hasButton");
  let enableButton = true;
  enableButton = hasButton && hasButton === "false" ? false : true;
  
  const getData = async (action, state, dispatch) => {
    await getMDMSData(action, state, dispatch);
  };
  
  const getMDMSData = async (action, state, dispatch) => {
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: tenantId,
        moduleDetails: [
          {
            moduleName: "BillingService",
            masterDetails: [
              { name: "BusinessService", filter: "[?(@.type=='Adhoc')]" }
            ]
          },
          {
            moduleName: "common-masters",
            masterDetails: [
              {
                name: "uiCommonPay"
              }
            ]
          },
        ]
      }
    };
    try {
      const payload = await httpRequest(
        "post",
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
      // setServiceCategory(
      //   get(payload, "MdmsRes.BillingService.BusinessService", []),
      //   dispatch
      // ); 
      dispatch(prepareFinalObject("applyScreenMdmsData.BillingService.BusinessService",get(payload.MdmsRes ,"BillingService.BusinessService")));
      dispatch(prepareFinalObject("applyScreenMdmsData.uiCommonConfig" , get(payload.MdmsRes ,"common-masters.uiCommonPay")))
      } catch (e) {
      
    }
  };
  
  const SearchChallanAndResult = {
    uiFramework: "material-ui",
    name: "searchChallan",
    beforeInitScreen: (action, state, dispatch) => {
      dispatch(prepareFinalObject("challanSearchScreen", {}));
      getData(action, state, dispatch);
      return action;
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Form",
        props: {
          className: "common-div-css",
          id: "searchChallan"
        },
        children: {
          headerDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
  
            children: {
              header: {
                gridDefination: {
                  xs: 12,
                  sm: 6
                },
                ...header 
              },
              newChallanButton: {
                componentPath: "Button",
                gridDefination: {
                  xs: 12,
                  sm: 6,
                  align: "right"
                },
                visible: enableButton,
                props: {
                  variant: "contained",
                  color: "primary",
                  className:"gen-challan-btn",
                },
  
                children: {
                  plusIconInsideButton: {
                    uiFramework: "custom-atoms",
                    componentPath: "Icon",
                    props: {
                      iconName: "add",
                      style: {
                        fontSize: "24px"
                      }
                    }
                  },
  
                  buttonLabel: getLabel({
                    labelName: "NEW CHALLAN",
                    labelKey: "NEW_CHALLAN_BUTTON"
                  })
                },
                onClickDefination: {
                  action: "condition",
                  callBack: (state, dispatch) => {
                    openNewChallanForm(state, dispatch);
                  }
                }
              }
            }
          },
          SearchChallanCard,
          breakAfterSearch: getBreak(),
          SearchChallanResults
        }
      }
    }
  };
  

  const openNewChallanForm = (state, dispatch) => {
   
    dispatch(setRoute(`/uc/newCollection`));
  };

  export default SearchChallanAndResult;
  
  
  