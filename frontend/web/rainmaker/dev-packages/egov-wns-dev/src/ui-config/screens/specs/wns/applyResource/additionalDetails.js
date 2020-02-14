import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getSelectField,
  getCommonContainer,
  getCommonParagraph,
  getPattern,
  getDateField,
  getLabel,
  getCommonHeader,
  getCommonGrayCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
//   import { searchApiCall } from "./functions";
import commonConfig from "config/common.js";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getHeaderSideText } from "../../utils";
import get from 'lodash/get';
import { httpRequest } from '../../../../../ui-utils/index';

const resetFields = (state, dispatch) => {
  dispatch(
    handleField(
      "search",
      "components.div.children.showSearches.children.showSearchScreens.props.tabs[1].tabContent.searchApplications.children.cardContent.children.wnsApplicationSearch.children.consumerNo",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.showSearches.children.showSearchScreens.props.tabs[1].tabContent.searchApplications.children.cardContent.children.wnsApplicationSearch.children.applicationNo",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.showSearches.children.showSearchScreens.props.tabs[1].tabContent.searchApplications.children.cardContent.children.wnsApplicationSearch.children.ownerMobNo",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.showSearches.children.showSearchScreens.props.tabs[1].tabContent.searchApplications.children.cardContent.children.wnsApplicationSearch.children.applicationstatus",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.showSearches.children.showSearchScreens.props.tabs[1].tabContent.searchApplications.children.cardContent.children.wnsApplicationSearch.children.fromDate",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.showSearches.children.showSearchScreens.props.tabs[1].tabContent.searchApplications.children.cardContent.children.wnsApplicationSearch.children.toDate",
      "props.value",
      ""
    )
  );
};

const getPlumberRadioButton = {
  uiFramework: "custom-containers",
  componentPath: "RadioGroupContainer",
  gridDefination: { xs: 12, sm: 12 },
  props: {
    label: { key: "WS_ADDN_DETAILS_PLUMBER_PROVIDED_BY" },
    buttons: [
      { labelKey: "WS_PLUMBER_ULB", value: "ULB" },
      { labelKey: "WS_PLUMBER_SELF", value: "Self" },
    ],
    jsonPath: "applyScreen.plumberDetails",
    required: false
  },
  type: "array"
};

const waterSubSourceType = async (state, dispatch, code) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [{ moduleName: "ws-services-masters", code }]
    }
  };
  try {
    let payload = null;
    payload = await httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody);
    dispatch(prepareFinalObject("applyScreenMdmsData.ws-services-masters.waterSubSource[0].subsource", payload.MdmsRes));
  } catch (e) { console.log(e); }
}

export const additionDetails = getCommonCard({
  header: getCommonHeader({
    labelKey: "WS_COMMON_ADDN_DETAILS"
  }),
  connectiondetailscontainer: getCommonGrayCard({
    subHeader: getCommonTitle({
      labelKey: "WS_COMMON_CONNECTION_DETAILS"
    }),

    connectionDetails: getCommonContainer({
      connectionType: getSelectField({
        label: { labelKey: "WS_SERV_DETAIL_CONN_TYPE" },
        placeholder: { labelKey: "WS_ADDN_DETAILS_CONN_TYPE_PLACEHOLDER" },
        required: false,
        sourceJsonPath: "applyScreenMdmsData.ws-services-masters.connectionType",
        gridDefination: { xs: 12, sm: 6 },
        errorMessage: "ERR_INVALID_BILLING_PERIOD",
        jsonPath: "applyScreen.connectionType"
      }),

      numberOfTaps: getTextField({
        label: { labelKey: "WS_SERV_DETAIL_NO_OF_TAPS" },
        placeholder: { labelKey: "WS_SERV_DETAIL_NO_OF_TAPS_PLACEHOLDER" },
        gridDefination: { xs: 12, sm: 6 },
        jsonPath: "applyScreen.noOfTaps"
      }),

      waterSourceType: {
        ...getSelectField({
          label: { labelKey: "WS_SERV_DETAIL_WATER_SOURCE" },
          placeholder: { labelKey: "WS_ADDN_DETAILS_WARER_SOURCE_PLACEHOLDER" },
          required: false,
          sourceJsonPath: "applyScreenMdmsData.ws-services-masters.waterSource",
          gridDefination: { xs: 12, sm: 6 },
          errorMessage: "ERR_INVALID_BILLING_PERIOD",
          jsonPath: "applyScreen.waterSource"
        }),
        beforeFieldChange: async (action, state, dispatch) => {
          let waterSource = get(state, "screenConfiguration.preparedFinalObject.applyScreen.waterSourceType");
          if (waterSource === "GROUND") {
            let code = `masterDetails":[{"name":"waterSubSource","filter": "[?(@.code  == 'GROUND')]"}]`
            await waterSubSourceType(state, dispatch, code)
          } else if (waterSource === "SURFACE") {
            let code = `masterDetails":[{"name":"waterSubSource","filter": "[?(@.code  == 'SURFACE')]"}]`
            await waterSubSourceType(state, dispatch, code)
          } else {
            let code = `masterDetails":[{"name":"waterSubSource","filter": "[?(@.code  == 'BULKSUPPLY')]"}]`
            await waterSubSourceType(state, dispatch, code)
          }
        }
      },

      waterSubSource: getSelectField({
        label: { labelKey: "WS_SERV_DETAIL_WATER_SUB_SOURCE" },
        placeholder: { labelKey: "WS_ADDN_DETAILS_WARER_SUB_SOURCE_PLACEHOLDER" },
        required: false,
        sourceJsonPath: "applyScreenMdmsData.ws-services-masters.waterSubSource[0].subsource",
        gridDefination: { xs: 12, sm: 6 },
        errorMessage: "ERR_INVALID_BILLING_PERIOD",
        jsonPath: "applyScreen.waterSubSource"
      }),

      pipeSize: getSelectField({
        label: { labelKey: "WS_SERV_DETAIL_PIPE_SIZE" },
        placeholder: { labelKey: "WS_SERV_DETAIL_PIPE_SIZE_PLACEHOLDER" },
        gridDefination: { xs: 12, sm: 6 },
        sourceJsonPath: "applyScreenMdmsData.ws-services-calculation.pipeSize",
        jsonPath: "applyScreen.pipeSize"
      }),

      //Removed - Confirmed by Aditya
      // billingType: getSelectField({
      //   label: {
      //     labelKey: "WS_ADDN_DETAILS_BILLING_TYPE"
      //   },
      //   placeholder: {
      //     labelKey: "WS_ADDN_DETAILS_BILLING_TYPE_PLACEHOLDER"
      //   },
      //   required: false,
      //   jsonPath: "applyScreen.status",
      //   sourceJsonPath: "applyScreenMdmsData.applyScreen.status",
      //   gridDefination: {
      //     xs: 12,
      //     sm: 6
      //   },
      //   required: false,
      //   errorMessage: "ERR_INVALID_BILLING_PERIOD",
      //   jsonPath: "applyScreen.status"
      // }),

      waterClosets: getTextField({
        label: { labelKey: "WS_ADDN_DETAILS_NO_OF_WATER_CLOSETS" },
        placeholder: { labelKey: "WS_ADDN_DETAILS_NO_OF_WATER_CLOSETS_PLACEHOLDER" },
        gridDefination: { xs: 12, sm: 6 },
        jsonPath: "applyScreen.waterClosets"
      }),

    }),
  }),
  plumberDetailsContainer: getCommonGrayCard({
    subHeader: getCommonTitle({
      labelKey: "WS_COMMON_PLUMBER_DETAILS"
    }),
    plumberDetails: getCommonContainer({
      getPlumberRadioButton,
      plumberLicenceNo: getTextField({
        label: {
          labelKey: "WS_ADDN_DETAILS_PLUMBER_LICENCE_NO_LABEL"
        },
        placeholder: {
          labelKey: "WS_ADDN_DETAILS_PLUMBER_LICENCE_NO_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: false,
        pattern: getPattern("consumerNo"),
        errorMessage: "ERR_INVALID_CONSUMER_NO",
        jsonPath: "applyScreen.plumberLicenceNo"
      }),
      plumberName: getTextField({
        label: {
          labelKey: "WS_ADDN_DETAILS_PLUMBER_NAME_LABEL"
        },
        placeholder: {
          labelKey: "WS_ADDN_DETAILS_PLUMBER_NAME_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: false,
        pattern: getPattern("consumerNo"),
        errorMessage: "ERR_INVALID_CONSUMER_NO",
        jsonPath: "applyScreen.plumberName"
      }),
      plumberMobNo: getTextField({
        label: {
          labelKey: "WS_ADDN_DETAILS_PLUMBER_MOB_NO_LABEL"
        },
        placeholder: {
          labelKey: "WS_ADDN_DETAILS_PLUMBER_MOB_NO_LABEL_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        iconObj: {
          label: "+91 |",
          position: "start"
        },
        required: false,
        pattern: getPattern("MobileNo"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "applyScreen.mobileNumber"
      }),
    })
  }),
  roadCuttingChargeContainer: getCommonGrayCard({
    subHeader: getCommonTitle({
      labelKey: "WS_ROAD_CUTTING_CHARGE_DETAILS"
    }),
    roadDetails: getCommonContainer({
      roadType: getSelectField({
        label: {
          labelKey: "WS_ADDN_DETAIL_ROAD_TYPE"
        },
        placeholder: {
          labelKey: "WS_ADDN_DETAILS_ROAD_TYPE_PLACEHOLDER"
        },
        required: false,
        sourceJsonPath: "applyScreenMdmsData.sw-services-calculation.RoadType",
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: false,
        errorMessage: "ERR_INVALID_BILLING_PERIOD",
        jsonPath: "applyScreen.roadType"
      }),
      enterArea: getTextField({
        label: {
          labelKey: "WS_ADDN_DETAILS_AREA_LABEL"
        },
        placeholder: {
          labelKey: "WS_ADDN_DETAILS_AREA_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: false,
        pattern: getPattern("consumerNo"),
        errorMessage: "ERR_INVALID_CONSUMER_NO",
        jsonPath: "applyScreen.enterArea"
      })
    }),
  }),
  activationDetailsContainer: getCommonGrayCard({
    subHeader: getCommonTitle({
      labelKey: "WS_ACTIVATION_DETAILS"
    }),
    activeDetails: getCommonContainer({
      connectionExecutionDate: getDateField({
        label: { labelName: "connectionExecutionDate", labelKey: "WS_SERV_DETAIL_CONN_EXECUTION_DATE" },
        // placeholder: {
        //   labelName: "Select From Date",
        //   labelKey: "WS_FROM_DATE_PLACEHOLDER"
        // },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: false,
        pattern: getPattern("Date"),
        errorMessage: "ERR_INVALID_DATE",
        jsonPath: "applyScreen.connectionExecutionDate"
      }),
      meterID: getTextField({
        label: {
          labelKey: "WS_SERV_DETAIL_METER_ID"
        },
        placeholder: {
          labelKey: "WS_ADDN_DETAILS_METER_ID_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: false,
        pattern: getPattern("consumerNo"),
        errorMessage: "ERR_INVALID_CONSUMER_NO",
        jsonPath: "applyScreen.meterID"
      }),
      meterInstallationDate: getDateField({
        label: { labelName: "meterInstallationDate", labelKey: "WS_ADDN_DETAIL_METER_INSTALL_DATE" },
        // placeholder: {
        //   labelName: "Select From Date",
        //   labelKey: "WS_FROM_DATE_PLACEHOLDER"
        // },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: false,
        pattern: getPattern("Date"),
        errorMessage: "ERR_INVALID_DATE",
        jsonPath: "applyScreen.meterInstallationDate"
      }),
      initialMeterReading: getTextField({
        label: {
          labelKey: "WS_ADDN_DETAILS_INITIAL_METER_READING"
        },
        placeholder: {
          labelKey: "WS_ADDN_DETAILS_INITIAL_METER_READING_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: false,
        pattern: getPattern("consumerNo"),
        errorMessage: "ERR_INVALID_CONSUMER_NO",
        jsonPath: "applyScreen.initialMeterReading"
      }),
    }),
  })
});