import commonConfig from "config/common.js";
import {
  getCommonCard,
  getCommonContainer,
  getCommonGrayCard, getCommonHeader, getCommonSubHeader, getCommonTitle,
  getLabel, getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getQueryArg,
  setBusinessServiceDataToLocalStorage
} from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from "lodash/set";
import { httpRequest } from "../../../../ui-utils/api";
import { getNocSearchResults } from "../../../../ui-utils/commons";
import { checkValueForNA, ifUserRoleExists } from "../utils/index";
import { requiredDocumentsData } from "../utils/noc-functions";

export const getRedirectionURL = () => {
  const redirectionURL = ifUserRoleExists("CITIZEN")
    ? "/bpastakeholder-citizen/home"
    : "/inbox";
  return redirectionURL;
};
const titlebar = {
  uiFramework: "custom-atoms",
  componentPath: "Div",
  children: {
    leftContainerH: getCommonContainer({
      header: getCommonHeader({
        labelName: "NOC Application",
        labelKey: "BPA_NOC_APPLICATION_HEADER"
      }),
    }),
  }
}

const titlebar2 = {
  uiFramework: "custom-atoms",
  componentPath: "Div",
  // visible: false,
  props: {
    style: { textAlign: "right", display: "flex" }
  },
  children: {
    nocApprovalNumber: {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-bpa",
      componentPath: "NocNumber",
      gridDefination: { },
      props: {
        number: "NA"
      },
    }
  }
}
const applicationOverview = getCommonContainer({
  header: getCommonTitle(
    {
      labelName: "Application Overview",
      labelKey: "NOC_APP_OVER_VIEW_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  appOverViewDetailsContainer: getCommonContainer({
    applicationNo: getLabelWithValue(
      {
        labelName: "Application No",
        labelKey: "BPA_NOC_APP_NO_LABEL"
      },
      {
        jsonPath: "Noc.applicationNo",
        callBack: checkValueForNA
      }
    ),
    module: getLabelWithValue(
      {
        labelName: "Module/Source",
        labelKey: "BPA_NOC_MODULE_SOURCE_LABEL"
      },
      {
        jsonPath: "Noc.source",
        callBack: checkValueForNA
      }
    ),
    status: getLabelWithValue(
      {
        labelName: "Status",
        labelKey: "BPA_NOC_STATUS_LABEL"
      },
      {
        jsonPath: "Noc.applicationStatus",
        callBack: checkValueForNA
      }
    ),
    viewApplication: {
      componentPath: "Button",
      gridDefination: {
        xs: 12,
        sm: 3
      },
      props: {
        variant: "outlined",
        style: {
          color: "#FE7A51",
          border: "#FE7A51 solid 1px",
          borderRadius: "2px"
        }
      },
      children: {
        buttonLabel: getLabel({
          labelName: "VIEW APPLICATION",
          labelKey: "BPA_NOC_VIEW_APP_BUTTON"
        })
      },

      onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => {
          let nocData = get(state.screenConfiguration.preparedFinalObject, "Noc", "");
          let checkingApp = getTenantId().split('.')[1] ? "employee" : "citizen";
          let appendUrl = window.location.origin;
          if (process.env.NODE_ENV === "production") {
            appendUrl = `${window.location.origin}/${checkingApp}`
          }
          if (nocData && nocData.source === "BPA") {
            let bpaAppurl = appendUrl + '/egov-bpa/search-preview?applicationNumber=' + nocData.sourceRefId + '&tenantId=' + nocData.tenantId;
            window.open(bpaAppurl, '_blank');

          } else if (nocData && nocData.source === "BPA_OC") {
            let bpaAppurl = appendUrl + '/oc-bpa/search-preview?applicationNumber=' + nocData.sourceRefId + '&tenantId=' + nocData.tenantId;
            window.open(bpaAppurl, '_blank');
          }
        }
      }

    },
  }),
});

const nocDetails = getCommonGrayCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" }
    },
    children: {
      header: {
        gridDefination: {
          xs: 12
        },
        ...getCommonSubHeader({
          labelName: "Fire NOC",
          // labelKey: "BPA_NOC_FIRE_TITLE"
        })
      },
    }
  },
  documentDetailsCard: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-bpa",
    componentPath: "PreviewContainer",
    props: {
      sourceJsonPath: "documentDetailsPreview",
      className: "noc-review-documents",
      buttonLabel: {
        labelName: "UPLOAD FILE",
        labelKey: "NOC_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
      },
      inputProps: {
        accept: "image/*, .pdf, .png, .jpeg",
        multiple: false
      },
      maxFileSize: 5000
    }
  }
});

const setSearchResponse = async (
  state,
  dispatch,
  applicationNumber,
  tenantId, action
) => {
  await getRequiredMdmsDetails(state, dispatch);

  const response = await getNocSearchResults([
    {
      key: "tenantId",
      value: tenantId
    },
    { key: "applicationNo", value: applicationNumber }
  ]);
  dispatch(prepareFinalObject("Noc", get(response, "Noc[0]", { })));
  const queryObject = [
    { key: "tenantId", value: tenantId },
    { key: "businessServices", value: get(response, "Noc[0].additionalDetails.workflowCode") }
  ];
  setBusinessServiceDataToLocalStorage(queryObject, dispatch);

  if (response && get(response, "Noc[0].nocNo")) {
    dispatch(
      handleField(
        "noc-search-preview",
        "components.div.children.headerDiv.children.header2.children.titlebar2.children.nocApprovalNumber",
        "props.number",
        get(response, "Noc[0].nocNo")
      )
    );
  } else {

    dispatch(
      handleField(
        "noc-search-preview",
        "components.div.children.headerDiv.children.header2.children.titlebar2.children.nocApprovalNumber",
        "visible",
        false
      )
    )
  }
  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.nocDetails.children.cardContent.children.header.children.header.children.key.props.labelKey",
    `NOC_NOC_TYPE_${get(response, "Noc[0].nocType")}`
  );

  requiredDocumentsData(state, dispatch, action);
};

const getRequiredMdmsDetails = async (state, dispatch, action) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "common-masters",
          masterDetails: [
            {
              name: "DocumentType"
            }
          ]
        },
        {
          moduleName: "NOC",
          masterDetails: [
            {
              name: "DocumentTypeMapping"
            },
          ]
        }
      ]
    }
  };
  let payload = await httpRequest(
    "post",
    "/egov-mdms-service/v1/_search",
    "_search",
    [],
    mdmsBody
  );
  dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
}

export const prepareDocsInEmployee = (state, dispatch, action) => {
  let applicationDocuments = get(
    state,
    "screenConfiguration.preparedFinalObject.applyScreenMdmsData.NOC.DocumentTypeMapping",
    []
  );
  let documentsDropDownValues = get(
    state,
    "screenConfiguration.preparedFinalObject.applyScreenMdmsData.common-masters.DocumentType",
    []
  );
  let nocType = get(
    state,
    "screenConfiguration.preparedFinalObject.Noc.nocType", ""
  );

  let documents = [];
  applicationDocuments && applicationDocuments.length > 0 &&
    applicationDocuments.forEach(doc => {
      if (doc.applicationType === "NEW" && doc.nocType === nocType) {
        documents.push(doc.docTypes);
      }
    });

  let documentsList = [];
  if (documents[0] && documents[0].length > 0) {
    documents[0].forEach(doc => {
      let code = doc.documentType;
      doc.dropDownValues = [];
      documentsDropDownValues.forEach(value => {
        let values = value.code.slice(0, code.length);
        if (code === values) {
          doc.hasDropdown = true;
          doc.dropDownValues.push(value);
        }
      });
      documentsList.push(doc);
    });
  }
  const bpaDocuments = documentsList;
  let documentsContract = [];
  let tempDoc = { };

  if (bpaDocuments && bpaDocuments.length > 0) {
    bpaDocuments.forEach(doc => {
      let card = { };
      card["code"] = doc.documentType.split(".")[0];
      card["title"] = doc.documentType.split(".")[0];
      card["cards"] = [];
      tempDoc[doc.documentType.split(".")[0]] = card;
    });
    bpaDocuments.forEach(doc => {
      let card = { };
      card["name"] = doc.documentType;
      card["code"] = doc.documentType;
      card["required"] = doc.required ? true : false;
      if (doc.hasDropdown && doc.dropDownValues) {
        let dropDownValues = { };
        dropDownValues.label = "BPA_SELECT_DOCS_LABEL";
        dropDownValues.required = doc.required;
        dropDownValues.menu = doc.dropDownValues.filter(item => {
          return item.active;
        });
        dropDownValues.menu = dropDownValues.menu.map(item => {
          return { code: item.documentType, label: item.documentType };
        });
        card["dropDownValues"] = dropDownValues;
      }
      tempDoc[doc.documentType.split(".")[0]].cards.push(card);
    });
  }

  if (tempDoc) {
    Object.keys(tempDoc).forEach(key => {
      documentsContract.push(tempDoc[key]);
    });
  }

  dispatch(prepareFinalObject("documentDetailsPreview", documentsContract));

}
const screenConfig = {
  uiFramework: "material-ui",
  name: "search-preview",
  beforeInitScreen: (action, state, dispatch) => {
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    const tenantId = getQueryArg(window.location.href, "tenantId");
    setSearchResponse(state, dispatch, applicationNumber, tenantId, action);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css bpa-searchpview"
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
                md: 6
              },
              ...titlebar
            },
            header2: {
              uiFramework: "custom-atoms",
              componentPath: "Container",
              props: {
                color: "primary",
                style: { justifyContent: "flex-end" }
              },
              gridDefination: {
                xs: 12,
                sm: 6,
                md: 6,
                align: "right"
              },
              children: {
                titlebar2
              }
            }
          }
        },

        taskStatus: {
          uiFramework: "custom-containers-local",
          componentPath: "WorkFlowContainer",
          moduleName: "egov-workflow",
          visible: true,
          props: {
            dataPath: "Noc",
            moduleName: "Noc",
            updateUrl: "/noc-services/v1/noc/_update"
          }
        },
        applicationOverviewContainer: getCommonCard({
          applicationOverview: applicationOverview
        }),
        body: getCommonCard({
          nocDetails: nocDetails
        }),
      }
    }
  }
};

export default screenConfig;