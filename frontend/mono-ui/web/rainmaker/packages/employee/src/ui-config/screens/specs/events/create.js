import {
  getCommonCard, getCommonContainer, getCommonHeader,
  getDateField, getPattern, getSelectField, getTextField, getTimeField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from "lodash/set";
import { footer, getDeleteButton, getMapLocator, getMdmsData, getSingleMessage, showHideMapPopup } from "../utils";

const header = getCommonHeader({
  labelName: getQueryArg(window.location.href, "uuid") ? "Edit Event" : "Add New Event",
  labelKey: getQueryArg(window.location.href, "uuid") ? "EVENT_EDIT_LABEL" : "EVENT_ADD_NEW_LABEL",
});

export const createForm = getCommonCard({
  createContainer: getCommonContainer({
    ulb: {
      ...getSelectField({
        label: {
          labelName: "ULB",
          labelKey: "EVENTS_ULB_LABEL",
        },
        localePrefix: {
          moduleName: "TENANT",
          masterName: "TENANTS",
        },
        optionLabel: "name",
        placeholder: { labelName: "Select City", labelKey: "TL_SELECT_CITY" },
        sourceJsonPath: "applyScreenMdmsData.tenant.tenants",
        jsonPath: "events[0].tenantId",
        required: true,
        props: {
          required: true,
          // disabled: true,
          style: {
            marginBottom: 10,
          },
        },
      }),
    },
    dummyDiv5: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      gridDefination: {
        xs: 12,
        sm: 6,
      },
      props: {
        disabled: true,
      },
    },
    title1: getTextField({
      label: {
        labelName: "Event Name",
        labelKey: "EVENTS_NAME_LABEL",
      },
      placeholder: {
        labelName: "Enter Event Name",
        labelKey: "EVENTS_NAME_PLACEHOLDER",
      },
      required: true,
      pattern: getPattern("Name"),
      jsonPath: "events[0].name",
      gridDefination: {
        xs: 12,
        sm: 6,
      },
    }),
    dummyDiv1: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      gridDefination: {
        xs: 12,
        sm: 6,
      },
      props: {
        disabled: true,
      },
    },
    newCat: {
      ...getSelectField({
        label: {
          labelName: "Event Category",
          labelKey: "EVENTS_CATEGORY_LABEL",
        },
        localePrefix: {
          moduleName: "MSEVA",
          masterName: "EVENTCATEGORIES",
        },
        optionLabel: "name",
        placeholder: { labelName: "Select Event Category", labelKey: "EVENTS_SELECT_CATEGORY_LABEL" },
        sourceJsonPath: "applyScreenMdmsData.mseva.EventCategories",
        jsonPath: "events[0].eventCategory",
        required: true,
        props: {
          required: true,
          // disabled: true,
          style: {
            marginBottom: 10,
          },
        },
      }),
    },
    dummyDiv111: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      gridDefination: {
        xs: 12,
        sm: 6,
      },
      props: {
        disabled: true,
      },
    },
    comments: getTextField({
      label: {
        labelName: "Description",
        labelKey: "EVENTS_DESCRIPTION_LABEL",
      },
      placeholder: {
        labelName: "Description (Max Char Limit : 500)",
        labelKey: "EVENTS_DESCRIPTION_LIMIT_PLACEHOLDER",
      },
      pattern: getPattern("Address"),
      required: true,
      jsonPath: "events[0].description",
      props: {
        required: true,
        multiline: true,
        rows: 6,
        InputProps: {
          disableUnderline: true,
          marginTop: 50,
          style: {
            border: "1px solid #ced4da",
          },
        },
        style: {
          marginBottom: 10,
        },
      },
    }),
    dummyDiv2: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      gridDefination: {
        xs: 12,
        sm: 6,
      },
      props: {
        disabled: true,
      },
    },
    fromDate: {
      ...getDateField({
        label: {
          labelName: "Event From Date",
          labelKey: "EVENTS_FROM_DATE_LABEL",
        },
        required: true,
        pattern: getPattern("Date"),
        jsonPath: "events[0].eventDetails.fromDate",
        gridDefination: {
          xs: 12,
          sm: 3,
        },
        props: {
          // inputProps: {
          //   min: getTodaysDateInYMD(),
          //   max: getFinancialYearDates("yyyy-mm-dd").endDate,
          // },
          // iconObj: { position: "end", iconName: "calendar_today" },
          // style: { marginBottom: 10 },
        },
      }),
    },
    fromTime: {
      ...getTimeField({
        label: {
          labelName: "Event From Time",
          labelKey: "EVENTS_FROM_TIME_LABEL",
        },

        required: true,
        pattern: getPattern("Time"),
        jsonPath: "events[0].eventDetails.fromTime",
        gridDefination: {
          xs: 12,
          sm: 3,
        },
        defaultValue: "00:00",
        props: {
          // inputProps: {
          //   min: getTodaysDateInYMD(),
          //   max: getFinancialYearDates("yyyy-mm-dd").endDate,
          // },
          // iconObj: { position: "end", iconName: " access_time" },
          defaultValue: "00:00",
          style: { paddingRight: 80 },
        },
      }),
    },
    dummyDiv12: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      gridDefination: {
        xs: 12,
        sm: 6,
      },
      props: {
        disabled: true,
      },
    },
    toDate: {
      ...getDateField({
        label: { labelName: "Event To Date", labelKey: "EVENTS_TO_DATE_LABEL" },
        placeholder: { labelName: "hh:mm", labelKey: "hh:mm" },
        required: true,
        pattern: getPattern("Date"),
        jsonPath: "events[0].eventDetails.toDate",
        gridDefination: {
          xs: 12,
          sm: 3,
        },
        props: {
          //   inputProps: {
          //     min: getNextMonthDateInYMD(),
          //     max: getFinancialYearDates("yyyy-mm-dd").endDate,
          //   },
          // iconObj: { position: "end", iconName: "calendar_today" },
          // style: { marginBottom: 10 },
        },
      }),
    },
    toTime: {
      ...getTimeField({
        label: {
          labelName: "Event To Time",
          labelKey: "EVENTS_TO_TIME_LABEL",
        },
        placeholder: { labelName: "hh:mm", labelKey: "hh:mm" },
        required: true,
        pattern: getPattern("Time"),
        jsonPath: "events[0].eventDetails.toTime",
        gridDefination: {
          xs: 12,
          sm: 3,
        },
        props: {
          // inputProps: {
          //   min: getTodaysDateInYMD(),
          //   max: getFinancialYearDates("yyyy-mm-dd").endDate,
          // },
          defaultValue: "00:00",
          // iconObj: { position: "end", iconName: " access_time" },
          style: { paddingRight: 80 },
        },
      }),
    },
    dummyDiv21: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      gridDefination: {
        xs: 12,
        sm: 6,
      },
      props: {
        disabled: true,
      },
    },
    title3: getTextField({
      label: {
        labelName: "Event Address",
        labelKey: "EVENTS_ADDRESS_LABEL",
      },
      placeholder: {
        labelName: "Enter Event Address",
        labelKey: "EVENTS_NAME_ADDRESS_PLACEHOLDER",
      },
      required: true,
      jsonPath: "events[0].eventDetails.address",
      gridDefination: {
        xs: 12,
        sm: 6,
      },
    }),
    dummyDiv51: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      gridDefination: {
        xs: 12,
        sm: 6,
      },
      props: {
        disabled: true,
      },
    },
    eventLocGISCoord: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "gis-div-css",
        style: {
          width: "100%",
          cursor: "pointer",
        },
      },
      jsonPath: "events[0].eventDetails.latitude",
      onClickDefination: {
        action: "condition",
        callBack: showHideMapPopup,
      },
      gridDefination: {
        xs: 12,
        sm: 6,
      },
      children: {
        gisTextField: {
          ...getTextField({
            label: {
              labelName: "GIS Coordinates",
              labelKey: "TL_NEW_TRADE_DETAILS_GIS_CORD_LABEL",
            },
            placeholder: {
              labelName: "Select your trade location on map",
              labelKey: "TL_NEW_TRADE_DETAILS_GIS_CORD_PLACEHOLDER",
            },
            jsonPath: "events[0].eventDetails.latitude",
            iconObj: {
              iconName: "gps_fixed",
              position: "end",
            },
            gridDefination: {
              xs: 12,
              sm: 12,
            },
            props: {
              disabled: true,
              cursor: "pointer",
            },
          }),
        },
      },
    },
    dummyDiv9: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      gridDefination: {
        xs: 12,
        sm: 6,
      },
      props: {
        disabled: true,
      },
    },
    title4: getTextField({
      label: {
        labelName: "Organizer Name",
        labelKey: "EVENTS_ORGANIZER_NAME_LABEL",
      },
      placeholder: {
        labelName: "Enter Organizer Name",
        labelKey: "EVENTS_ENTER_ORGANIZER_NAME_PLACEHOLDER",
      },
      required: false,
      jsonPath: "events[0].eventDetails.organizer",
      gridDefination: {
        xs: 12,
        sm: 3,
      },
    }),
    title5: getTextField({
      label: {
        labelName: "Entry Fee (INR)",
        labelKey: "EVENTS_ENTRY_FEE_INR_LABEL",
      },
      placeholder: {
        labelName: "Enter Entry Fee",
        labelKey: "EVENTS_ENTER_ENTRY_FEE_PLACEHOLDER",
      },
      required: false,
      jsonPath: "events[0].eventDetails.fees",
      gridDefination: {
        xs: 12,
        sm: 3,
      },
      props: {
        style: {
          paddingRight: 80,
        },
      },
    }),
  }),
  mapsDialog: {
    componentPath: "Dialog",
    props: {
      open: false,
    },
    children: {
      dialogContent: {
        componentPath: "DialogContent",
        children: {
          popup: getMapLocator(),
        },
      },
    },
  },
});

const screenConfig = {
  uiFramework: "material-ui",
  name: "create",
  beforeInitScreen: (action, state, dispatch) => {
    const tenantId = getTenantId();
    //const isEditable = getQueryArg(window.location.href, "edit");
    const uuid = getQueryArg(window.location.href, "uuid");
    const messageTenant = getQueryArg(window.location.href, "tenantId");
    getMdmsData(action, state, dispatch);
    let props = get(
      action.screenConfig,
      "components.div.children.createCard.children.createForm.children.cardContent.children.createContainer.children.ulb.props",
      {}
    );
    props.value = tenantId;
    props.disabled = true;
    set(
      action.screenConfig,
      "components.div.children.createCard.children.createForm.children.cardContent.children.createContainer.children.ulb.props",
      props
    );
    dispatch(handleField("search", "components.div.children.searchResults", "visible", false));
    dispatch(prepareFinalObject("events[0].tenantId", tenantId));
    if (uuid) {
      getSingleMessage(state, dispatch, messageTenant, uuid);
    }
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "search",
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",

          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 6,
              },
              ...header,
            },
            deleteButton: getDeleteButton("EVENTSONGROUND"),
          },
        },
        createCard: {
          uiFramework: "custom-atoms",
          componentPath: "Form",
          props: {
            id: "create_form",
          },
          children: {
            createForm,
            footer: footer("EVENTSONGROUND"),
          },
        },
      },
    },
  },
};
export default screenConfig;
