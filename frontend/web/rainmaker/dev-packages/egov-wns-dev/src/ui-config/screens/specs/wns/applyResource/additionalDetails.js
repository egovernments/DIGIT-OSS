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
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getHeaderSideText } from "../../utils";

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
  jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].gender",
  props: {
    label: { key: "WS_ADDN_DETAILS_PLUMBER_PROVIDED_BY" },
    buttons: [
      { labelKey: "WS_PLUMBER_ULB", value: "ULB" },
      { labelKey: "WS_PLUMBER_SELF", value: "Self" },
    ],
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].gender",
    required: false
  },
  type: "array"
};

export const additionDetails = getCommonCard({
  header:getCommonHeader({
labelKey:"WS_COMMON_ADDN_DETAILS"
  }),
  connectiondetailscontainer: getCommonGrayCard({
    subHeader: getCommonTitle({
      labelKey: "WS_COMMON_CONNECTION_DETAILS"
    }),
    connectionDetails: getCommonContainer({
      connectionType: getSelectField({
        label: {
          labelKey: "WS_SERV_DETAIL_CONN_TYPE"
        },
        placeholder: {
          labelKey: "WS_ADDN_DETAILS_CONN_TYPE_PLACEHOLDER"
        },
        required: false,
        jsonPath: "searchScreen.status",
        sourceJsonPath: "applyScreenMdmsData.searchScreen.status",
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: false,
        errorMessage: "ERR_INVALID_BILLING_PERIOD",
        jsonPath: "searchScreen.status"
      }),
      numberOfTaps: getTextField({
        label: { labelKey: "WS_SERV_DETAIL_NO_OF_TAPS" },
        placeholder: { labelKey: "WS_SERV_DETAIL_NO_OF_TAPS_PLACEHOLDER" },
        gridDefination: { xs: 12, sm: 6 },
        jsonPath: "WaterConnection[0].noOfTaps"
      }),
      waterSource: getSelectField({
        label: {
          labelKey: "WS_SERV_DETAIL_WATER_SOURCE"
        },
        placeholder: {
          labelKey: "WS_ADDN_DETAILS_WARER_SOURCE_PLACEHOLDER"
        },
        required: false,
        jsonPath: "searchScreen.status",
        sourceJsonPath: "applyScreenMdmsData.searchScreen.status",
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: false,
        errorMessage: "ERR_INVALID_BILLING_PERIOD",
        jsonPath: "searchScreen.status"
      }),
      waterSubSource: getSelectField({
        label: {
          labelKey: "WS_SERV_DETAIL_WATER_SUB_SOURCE"
        },
        placeholder: {
          labelKey: "WS_ADDN_DETAILS_WARER_SUB_SOURCE_PLACEHOLDER"
        },
        required: false,
        jsonPath: "searchScreen.status",
        sourceJsonPath: "applyScreenMdmsData.searchScreen.status",
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: false,
        errorMessage: "ERR_INVALID_BILLING_PERIOD",
        jsonPath: "searchScreen.status"
      }),
      pipeSize: getSelectField({
        label: { labelKey: "WS_SERV_DETAIL_PIPE_SIZE" },
        placeholder: { labelKey: "WS_SERV_DETAIL_PIPE_SIZE_PLACEHOLDER" },
        gridDefination: { xs: 12, sm: 6 },
        jsonPath: "WaterConnection[0].pipeSize"
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
      //   jsonPath: "searchScreen.status",
      //   sourceJsonPath: "applyScreenMdmsData.searchScreen.status",
      //   gridDefination: {
      //     xs: 12,
      //     sm: 6
      //   },
      //   required: false,
      //   errorMessage: "ERR_INVALID_BILLING_PERIOD",
      //   jsonPath: "searchScreen.status"
      // }),
      waterClosets: getTextField({
        label: { labelKey: "WS_ADDN_DETAILS_NO_OF_WATER_CLOSETS" },
        placeholder: { labelKey: "WS_ADDN_DETAILS_NO_OF_WATER_CLOSETS_PLACEHOLDER" },
        gridDefination: { xs: 12, sm: 6 },
        jsonPath: "WaterConnection[0].noOfTaps"
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
        jsonPath: "searchScreen.connectionNumber"
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
        jsonPath: "searchScreen.connectionNumber"
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
        jsonPath: "searchScreen.mobileNumber"
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
        jsonPath: "searchScreen.status",
        sourceJsonPath: "applyScreenMdmsData.searchScreen.status",
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: false,
        errorMessage: "ERR_INVALID_BILLING_PERIOD",
        jsonPath: "searchScreen.status"
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
        jsonPath: "searchScreen.connectionNumber"
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
        jsonPath: "searchScreen.fromDate",
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: false,
        pattern: getPattern("Date"),
        errorMessage: "ERR_INVALID_DATE",
        jsonPath: "searchScreen.billingPeriodValue"
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
        jsonPath: "searchScreen.connectionNumber"
      }),
      meterInstallationDate: getDateField({
        label: { labelName: "meterInstallationDate", labelKey: "WS_ADDN_DETAIL_METER_INSTALL_DATE" },
        // placeholder: {
        //   labelName: "Select From Date",
        //   labelKey: "WS_FROM_DATE_PLACEHOLDER"
        // },
        jsonPath: "searchScreen.fromDate",
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: false,
        pattern: getPattern("Date"),
        errorMessage: "ERR_INVALID_DATE",
        jsonPath: "searchScreen.billingPeriodValue"
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
        jsonPath: "searchScreen.connectionNumber"
      }),
    }),
  })
});








