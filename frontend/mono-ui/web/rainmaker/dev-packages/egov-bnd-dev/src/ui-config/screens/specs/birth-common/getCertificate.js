import {getCommonCardWithHeader,getLabel} from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject,  handleScreenConfigurationFieldChange as handleField} 
  from "egov-ui-framework/ui-redux/screen-configuration/actions";   //returns action object
import { getCommonCard, getCommonContainer, getCommonHeader, getCommonParagraph, getCommonTitle, getStepperObject, getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getLocaleLabelsforTL } from "../../../../ui-utils/commons";
import {birthSearchCard} from "./birthSearchResources/birthSearchCard";
import {searchResults} from "./birthSearchResources/searchResults";
import {loadMdmsData} from "./../utils";
import {get,set} from "lodash";
import jp from "jsonpath";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";


const header = getCommonHeader({
  labelName: "Search Certificate",
  labelKey: "BND_BIRTH_SEARCH_DOWNLOAD"
});

const getCertificate = {
  uiFramework: "material-ui",
  name: "getCertificate",
  beforeInitScreen:(action, state, dispatch) => {
  
    loadMdmsData(action, state, dispatch).then((response) => {
      const tenants = get(response, "MdmsRes.tenant.tenants");
      //Requires City Module Updations of MDMS? tobechanged
      let jpFilter = "$[?(@.code != 'pb')]";
      let onlyCBs = jp.query(tenants, jpFilter);
      if(!(process.env.REACT_APP_NAME === "Citizen"))
      {
        let tenantId = getTenantId();
        let currentCbFilter = "$[?(@.code == '"+tenantId+"')]";
        onlyCBs = jp.query(onlyCBs, currentCbFilter );
      } 
      onlyCBs.sort((a, b) => (a.code > b.code) ? 1 : -1)
      dispatch(prepareFinalObject("bnd.allTenants", onlyCBs));
    });

    return action;
  },
  components:{
  div: {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      className: "common-div-css",
      id: "bndBirthSearch"
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
          // groupBillButton: {
          //   componentPath: "Button",
          //   gridDefination: {
          //     xs: 12,
          //     sm: 6,
          //     align: "right"
          //   },
          //   visible: enableButton,
          //   props: {
          //     variant: "contained",
          //     color: "primary",
          //     style: {
          //       color: "white",
          //       borderRadius: "2px",
          //       width: "250px",
          //       height: "48px"
          //     }
          //   },
          //   children: {
          //     ButtonLabel: getLabel({
          //       labelName: "Group Bills",
          //       labelKey: "ABG_COMMON_HEADER"
          //     })
          //   },
          //   onClickDefination: {
          //     action: "page_change",
          //     path:
          //       process.env.REACT_APP_SELF_RUNNING === "true"
          //         ? `/egov-ui-framework/abg/groupBills`
          //         : `/abg/groupBills`
          //   },
          //   visible: false
          // },
          howitWorksButton:{
            componentPath:"Button",
            gridDefination: {
              xs: 12,
              sm: 6,
              align: "right"
            },
            visible:process.env.REACT_APP_NAME === "Citizen" ? true : false,
            props:{
              //variant: "outlined",
              color:"primary",                 
                style:{
                minWidth:"180px",
                height:"48px",
                marginRight:"45",
                borderRadius: "inherit"
              }
            },
            onClickDefination: {
              action: "page_change",
              path:`/birth-common/how-it-works-birth`
            },
            children:{
              helpButtonIcon:{
                uiFramework:"custom-atoms",
                componentPath:"Icon",
                props:{
                  iconName:"help-circle"
                }
              },
              helpButtonLabel:getLabel({
                labelName:"Birth How it Works",
                labelKey:"BND_HELP"
              }),
            },        
           }, 
        }
      },
      birthSearchCard,
      breakAfterSearch: getBreak(),
      searchResults
    }
  }
}
}

export default getCertificate;
