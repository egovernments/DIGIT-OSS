import {
    getCommonGrayCard,
    getCommonSubHeader,
    getLabel,
    getCommonParagraph
  } from "egov-ui-framework/ui-config/screens/specs/utils";

import {
    ReGetCheckbox,
    getButtonVisibility,
    getCheckBoxJsonpath,
   } from "../../utils";
   import get from "lodash/get";
import set from "lodash/set";
import { getLocalization } from "egov-ui-framework/ui-utils/localStorageUtils";





  export const getDeclaration = (isEditable ) => {
   
    return getCommonGrayCard({
      headerDiv: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        children: {
          header: {
            gridDefination: {
              xs: 12,
              sm: 10
            },
            ...getCommonSubHeader({
              labelName: "Declaration",
              //labelKey: "TL_COMMON_DOCS"
            })
          },
         
          checkBoxContainer: ReGetCheckbox(
            {
              labelName: "TL Renewal Declaration message",
              labelKey: "TL_RENEWAL_CONFIRM_MESSAGE"
            },
            "Licenses[0].tradeLicenseDetail.additionalDetail.declaration" ,
          ),
        },
        /* roleDefination: {
          rolePath: "user-info.roles",
          roles: ["CITIZEN"]
        },  */
       visible:process.env.REACT_APP_NAME === "Citizen" ? true : false

      },
    });
  };
  