import {
  getCommonCard,
  getCommonGrayCard,
  getCommonTitle,
  getCommonSubHeader,
  getTextField,
  getSelectField,
  getCommonContainer,
  getDateField,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";

import {
  getDetailsForOwner,
  getTodaysDateInYMD,
  getHundredYearOldDateForDOB,
  // getEighteenYearOldDateForDOB,
  getRadioGroupWithLabel
} from "../../utils";

import { prepareFinalObject as pFO } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getRadioButton } from "egov-ui-framework/ui-config/screens/specs/utils";

export const getGenderRadioButton = {
  uiFramework: "custom-containers",
  componentPath: "RadioGroupContainer",
  gridDefination: {
    xs: 12,
    sm: 12,
    md: 6
  },
  jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].gender",
  props: {
    label: {
      // name: "Gender",
      key: "WS_SERV_DETAIL_CONN_RAIN_WATER_HARVESTING_FAC"
    },

    buttons: [
      {
        labelName: "Yes",
        // labelKey: "COMMON_GENDER_MALE",
        value: "MALE"
      },
      {
        labelName: "No",
        // labelKey: "COMMON_GENDER_FEMALE",
        value: "FEMALE"
      },
    ],
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].gender",
    required: true
  },
  required: true,
  type: "array"
};

export const getCheckboxContainer= {
  uiFramework: "custom-containers-local",
  moduleName: "egov-wns",
  componentPath: "CheckboxContainer",
  gridDefination: {
    xs: 12,
    sm: 12,
    md: 12
  },
  props: {
    label: {
      name: "Apply For",
      key: "BPA_SAME_AS_PERMANENTADDR_LABEL"
    },
    
    jsonPath: "LicensesTemp[0].userData.isSameAddress",
    buttons: [
      {
        labelName: "Yes",
        // labelKey: "COMMON_GENDER_MALE",
        value: "MALE"
      },
      {
        labelName: "No",
        // labelKey: "COMMON_GENDER_FEMALE",
        value: "FEMALE"
      },
    ],
  },
  
  required:true,
  type: "array"
};

export const OwnerInfoCard = getCommonCard({
  header: getCommonSubHeader(
    {
      labelName: "Connection Details",
      labelKey: "WS_COMMON_CONNECTION_DETAILS"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  tradeUnitCardContainer: getCommonContainer({
    getCheckboxContainer,
      oldConsumerNo: getTextField({
            label: {
                labelKey: "WS_SEARCH_CONNNECTION_OLD_CONSUMER_LABEL"
            },
            placeholder: {
                labelKey: "WS_SEARCH_CONNNECTION_OLD_CONSUMER_PLACEHOLDER"
            },
            gridDefination: {
                xs: 12,
                sm: 6
            },
            required: false,
            pattern: /^[a-zA-Z0-9-]*$/i,
            errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
            jsonPath: "searchScreen.oldConnectionNumber"
        }),
          numberOfTaps: getTextField({
         label:{
       labelKey: "WS_SERV_DETAIL_NO_OF_TAPS"
       },
     placeholder: {
      labelName:"Number of taps"
  },
  gridDefination: {
    xs: 12,
    sm: 6
},
       jsonPath: "WaterConnection[0].noOfTaps" 
      }),
            pipeSize: getSelectField({ 
        label:{
          labelKey: "WS_SERV_DETAIL_PIPE_SIZE"
         }, 
         placeholder:{
           labelName:"select size"
         },
         gridDefination: {
          xs: 12,
          sm: 6
      },
         
         jsonPath: "WaterConnection[0].pipeSize"
         }),
    getGenderRadioButton,
    
    // getOwnerMobNoField,
    // getOwnerEmailField,
    
  })
});

// export const tradeOwnerDetails = getCommonCard({
//   // header: getCommonTitle(
//   //   {
//   //     labelName: "Trade Owner Details",
//   //     labelKey: "TL_NEW_OWNER_DETAILS_HEADER"
//   //   },
//   //   {
//   //     style: {
//   //       marginBottom: 18
//   //     }
//   //   }
//   // ),
//   OwnerInfoCard
// });

// export const getOwnerEmailField = getTextField({
//   label: {
//     labelName: "Email",
//     labelKey: "TL_NEW_OWNER_DETAILS_EMAIL_LABEL"
//   },
//   placeholder: {
//     labelName: "Enter Email",
//     labelKey: "TL_NEW_OWNER_DETAILS_EMAIL_PLACEHOLDER"
//   },
//   pattern: getPattern("Email"),
//   jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].emailId",
//   required: true
// });