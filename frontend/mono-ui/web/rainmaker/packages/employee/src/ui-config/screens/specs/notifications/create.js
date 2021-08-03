import {
  getCommonCard, getCommonContainer, getCommonHeader, getCommonParagraph, getCommonSubHeader, getDateField, getPattern, getSelectField, getTextField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from "lodash/set";
import { footer, getDeleteButton, getMdmsData, getSingleMessage } from "../utils";

const header = getCommonHeader({
  labelName: getQueryArg(window.location.href, "uuid") ? "Edit Public Message" : "Add New Public Message",
  labelKey: getQueryArg(window.location.href, "uuid") ? "EDIT_NEW_PUBLIC_MESSAGE" : "ADD_NEW_PUBLIC_MESSAGE",
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
    title: getTextField({
      label: {
        labelName: "Title",
        labelKey: "EVENTS_TITLE_LABEL",
      },
      placeholder: {
        labelName: "Enter message title",
        labelKey: "EVENTS_TITLE_LABEL_PLACEHOLDER",
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
    comments: getTextField({
      label: {
        labelName: "Message Content",
        labelKey: "EVENTS_COMMENTS_LABEL",
      },
      // placeholder: {
      //   labelName: "Message Content ( Character Length:280)",
      //   labelKey: "EVENTS_COMMENTS_PLACEHOLDER",
      // },
      placeholder: {
        labelName: "Description (Max Char Limit : 500)",
        labelKey: "EVENTS_DESCRIPTION_LIMIT_PLACEHOLDER",
      },
      required: true,
      pattern: getPattern("Address"),
      jsonPath: "events[0].description",
      props: {
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
    uploadFile: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      gridDefination: {
        xs: 12,
        sm: 6,
      },
      children: {
        subheader: getCommonSubHeader(
          {
            labelName: "Attachment",
            labelKey: "EVENTS_ATTACHMENT_LABEL",
          },
          {
            style: {
              fontSize: "12px",
              fontWeight: 500,
              color: "rgba(0, 0, 0, 0.60)",
            },
          }
        ),
        uploadButton: {
          uiFramework: "custom-molecules",
          componentPath: "UploadMultipleFiles",
          gridDefination: {
            xs: 12,
            sm: 6,
          },
          props: {
            maxFiles: 4,
            inputProps: {
              accept: "image/*, .pdf, .png, .jpeg",
            },
            buttonLabel: { labelName: "UPLOAD FILES", labelKey: "EVENTS_UPLOAD_FILE" },
            jsonPath: "events[0].eventDetails.documents",
            maxFileSize: 5000,
          },
          jsonPath: "events[0].eventDetails.documents",
        },

        uploadFileInfo: getCommonParagraph(
          {
            labelName: "Only .jpg and .pdf files. 5MB max file size.",
            labelKey: "TL_APPROVAL_UPLOAD_SUBHEAD",
          },
          {
            style: {
              fontSize: 12,
              marginBottom: 10,
              marginTop: 5,
              color: "rgba(0, 0, 0, 0.6000000238418579)",
            },
          }
        ),
      },
    },
    dummyDiv3: {
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
          labelName: "Display From Date",
          labelKey: "EVENTS_FROM_DATE_LABEL",
        },
        required: true,
        pattern: getPattern("Date"),
        jsonPath: "events[0].eventDetails.fromDate",
        props: {
          // iconObj: { position: "end", iconName: "calendar_today", style: { width: 24, height: 24 } },
          // style: { marginBottom: 10 },
        },
      }),
    },
    dummyDiv4: {
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
        label: { labelName: "To Date", labelKey: "TL_COMMON_TO_DATE_LABEL" },
        placeholder: {
          labelName: "Display To Date",
          labelKey: "EVENTS_TO_DATE_LABEL",
        },
        required: true,
        pattern: getPattern("Date"),
        jsonPath: "events[0].eventDetails.toDate",
        props: {
          // iconObj: { position: "end", iconName: "calendar_today" },
          // style: { marginBottom: 10 },
        },
      }),
    },
  }),
});

const screenConfig = {
  uiFramework: "material-ui",
  name: "create",
  beforeInitScreen: (action, state, dispatch) => {
    const tenantId = getTenantId();
    const uuid = getQueryArg(window.location.href, "uuid");
    const messageTenant = getQueryArg(window.location.href, "tenantId");
    dispatch(handleField("search", "components.div.children.searchResults", "visible", false));
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
            deleteButton: getDeleteButton("BROADCAST"),
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
            footer: footer("BROADCAST"),
          },
        },
      },
    },
  },
};

export default screenConfig;
