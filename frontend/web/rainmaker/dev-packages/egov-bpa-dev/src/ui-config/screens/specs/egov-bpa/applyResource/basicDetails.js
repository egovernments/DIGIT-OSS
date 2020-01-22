import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getDateField,
  getSelectField,
  getCommonContainer,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getTodaysDateInYMD, calculationType, getScrutinyDetails } from "../../utils";
import "./index.css";

export const basicDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Basic Details",
      labelKey: "BPA_BASIC_DETAILS_TITLE"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  basicDetailsContainer: getCommonContainer({
    scrutinynumber: getTextField({
      label: {
        labelName: "Building plan scrutiny number",
        labelKey: "BPA_BASIC_DETAILS_SCRUTINY_NO_LABEL"
      },
      placeholder: {
        labelName: "Enter Scrutiny Number",
        labelKey: "BPA_BASIC_DETAILS_SCRUTINY_NUMBER_PLACEHOLDER"
      },
      title: {
        value: "Please search scrutiny details linked to the scrutiny number",
        key: "BPA_BASIC_DETAILS_SCRUTINY_NUMBER_SEARCH_TITLE"
      },
      infoIcon: "info_circle",
      pattern: "^[a-zA-Z0-9]*$",
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "BPA.edcrNumber",
      props:{
        className:"textfield-enterable-selection"
      },
      iconObj: {
        iconName: "search",
        position: "end",
        color: "#FE7A51",
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch, fieldInfo) => {
            getScrutinyDetails(state, dispatch, fieldInfo);
          }
        }
      },
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      }
    }),
    occupancy: getTextField({
      label: {
        labelName: "Occupancy",
        labelKey: "BPA_BASIC_DETAILS_OCCUPANCY_LABEL"
      },
      required: true,
      jsonPath: 'scrutinyDetails.planDetail.planInformation.occupancy',
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props: {
        disabled: true,
        className : "tl-trade-type"
      }
    }),
    applicationType: getSelectField({
      label: {
        labelName: "Application Type",
        labelKey: "BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL"
      },
      placeholder: {
        labelName: "Select Application Type",
        labelKey: "BPA_BASIC_DETAILS_APPLICATION_TYPE_PLACEHOLDER"
      },
      localePrefix: {
        moduleName: "WF",
        masterName: "BPA"
      },
      props: {
        disabled: true,
        className : "tl-trade-type"
      },
      jsonPath: "BPA.applicationType",
      sourceJsonPath: "applyScreenMdmsData.BPA.ApplicationType",
      required: true,
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      }
    }),
    riskType: getTextField({
      label: {
        labelName: "Risk Type",
        labelKey: "BPA_BASIC_DETAILS_RISK_TYPE_LABEL"
      },
      localePrefix: {
        moduleName: "WF",
        masterName: "BPA"
      },
      jsonPath: "BPA.riskType",
      required: true,
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props: {
        disabled: true,
        className : "tl-trade-type"
      }
    }),
    servicetype: getSelectField({
      label: {
        labelName: "Service type",
        labelKey: "BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL"
      },
      placeholder: {
        labelName: "Select service type",
        labelKey: "BPA_BASIC_DETAILS_SERVICE_TYPE_PLACEHOLDER"
      },
      localePrefix: {
        moduleName: "WF",
        masterName: "BPA"
      },
      props:{
        className:"textfield-enterable-selection"
      },
      required: true,
      jsonPath: "BPA.serviceType",
      sourceJsonPath: "applyScreenMdmsData.BPA.ServiceType",
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      afterFieldChange: (action, state, dispatch) => {
        calculationType(state, dispatch)
      }
    }),
    applicationdate: getDateField({
      label: {
        labelName: "Application Date",
        labelKey: "BPA_BASIC_DETAILS_APP_DATE_LABEL"
      },
      jsonPath: "BPA.appdate",
      props: {
        disabled: true,
        className : "tl-trade-type"
      },
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      }
    }),
    // applicationFee: getTextField({
    //   label: {
    //     labelName: "Application Fee",
    //     labelKey: "BPA_BASIC_DETAILS_APP_FEE_LABEL"
    //   },
    //   jsonPath: "BPAs[0].appfee",
    //   // value: 1000,
    //   props: {
    //     // value: 100,
    //     disabled: true
    //   },
    //   gridDefination: {
    //     xs: 12,
    //     sm: 12,
    //     md: 6
    //   }
    // }),
    remarks: getTextField({
      label: {
        labelName: "Remarks",
        labelKey: "BPA_BASIC_DETAILS_REMARKS_LABEL"
      },
      placeholder: {
        labelName: "Enter Remarks Here",
        labelKey: "BPA_BASIC_DETAILS_REMARKS_PLACEHOLDER"
      },
      jsonPath: "BPA.remarks",
      props:{
        className:"textfield-enterable-selection",
        multiline: true,
        rows: "4"
      },
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      }
    })
  })
});
