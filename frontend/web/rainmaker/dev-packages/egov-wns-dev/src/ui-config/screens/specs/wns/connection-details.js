import {
  getCommonHeader,
  getCommonCard,
  getCommonTitle,
  getCommonGrayCard,
  getCommonContainer,
  convertEpochToDate
} from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import set from "lodash/set";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg, setBusinessServiceDataToLocalStorage, getFileUrlFromAPI } from "egov-ui-framework/ui-utils/commons";
import { footerReview } from "./viewBillResource/footer";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults, getSearchResultsForSewerage } from "../../../../ui-utils/commons";

import { connectionDetailsFooter } from "./connectionDetailsResource/connectionDetailsFooter";
import { getServiceDetails } from "./connectionDetailsResource/service-details";
import { getPropertyDetails } from "./connectionDetailsResource/property-details";
import { getOwnerDetails } from "./connectionDetailsResource/owner-deatils";
const tenantId = getQueryArg(window.location.href, "tenantId")
let connectionNumber = getQueryArg(window.location.href, "connectionNumber");
const service = getQueryArg(window.location.href, "service")
let headerSideText = { word1: "", word2: "" };

const setDocuments = async (
  payload,
  sourceJsonPath,
  destJsonPath,
  dispatch
) => {
  const uploadedDocData = get(payload, sourceJsonPath);

  const fileStoreIds =
    uploadedDocData &&
    uploadedDocData
      .map(item => {
        return item.fileStoreId;
      })
      .join(",");
  const fileUrlPayload =
    fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
  const reviewDocData =
    uploadedDocData &&
    uploadedDocData.map((item, index) => {
      return {
        title: `TL_${item.documentType}` || "",
        link:
          (fileUrlPayload &&
            fileUrlPayload[item.fileStoreId] &&
            fileUrlPayload[item.fileStoreId].split(",")[0]) ||
          "",
        linkText: "View",
        name:
          (fileUrlPayload &&
            fileUrlPayload[item.fileStoreId] &&
            decodeURIComponent(
              fileUrlPayload[item.fileStoreId]
                .split(",")[0]
                .split("?")[0]
                .split("/")
                .pop()
                .slice(13)
            )) ||
          `Document - ${index + 1}`
      };
    });
  reviewDocData && dispatch(prepareFinalObject(destJsonPath, reviewDocData));
};

const searchResults = async (action, state, dispatch, connectionNumber) => {
  /**
   * This methods holds the api calls and the responses of fetch bill and search connection for both water and sewerage service
   */
  let queryObject = [{ key: "tenantId", value: tenantId }, { key: "connectionNumber", value: connectionNumber }];
  if (service === "SEWERAGE") {
    let payloadData = await getSearchResultsForSewerage(queryObject, dispatch);
    if (payloadData !== null && payloadData !== undefined && payloadData.SewerageConnections.length > 0) {
      payloadData.SewerageConnections[0].service = service
      payloadData.SewerageConnections[0].connectionExecutionDate = convertEpochToDate(payloadData.SewerageConnections[0].connectionExecutionDate)
      const lat = payloadData.SewerageConnections[0].property.address.locality.latitude ? payloadData.SewerageConnections[0].property.address.locality.latitude : ' '
      const long = payloadData.SewerageConnections[0].property.address.locality.longitude ? payloadData.SewerageConnections[0].property.address.locality.longitude : ' '
      payloadData.SewerageConnections[0].property.address.locality.locationOnMap = `${lat} ${long}`
      dispatch(prepareFinalObject("WaterConnection[0]", payloadData.SewerageConnections[0]))
    }
  } else if (service === "WATER") {
    let payloadData = await getSearchResults(queryObject);
    if (payloadData !== null && payloadData !== undefined && payloadData.WaterConnection.length > 0) {
      payloadData.WaterConnection[0].service = service;
      if (payloadData.WaterConnection[0].connectionExecutionDate !== undefined && payloadData.WaterConnection[0].connectionExecutionDate !== null) {
        payloadData.WaterConnection[0].connectionExecutionDate = convertEpochToDate(payloadData.WaterConnection[0].connectionExecutionDate)
      } else {
        payloadData.WaterConnection[0].connectionExecutionDate = ' '
      }

      const lat = payloadData.WaterConnection[0].property.address.locality.latitude ? payloadData.WaterConnection[0].property.address.locality.latitude : ' '
      const long = payloadData.WaterConnection[0].property.address.locality.longitude ? payloadData.WaterConnection[0].property.address.locality.longitude : ' '
      payloadData.WaterConnection[0].property.address.locality.locationOnMap = `${lat} ${long}`
      dispatch(prepareFinalObject("WaterConnection[0]", payloadData.WaterConnection[0]));
    }
  }
};

const beforeInitFn = async (action, state, dispatch, connectionNumber) => {
  //Search details for given application Number
  if (connectionNumber) {
    (await searchResults(action, state, dispatch, connectionNumber));
    let connectionType = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].connectionType")
    if (service !== "SEWERAGE" && connectionType !== "Metered") {
      set(
        action.screenConfig,
        "components.div.children.connectionDetails.children.cardContent.children.serviceDetails.children.cardContent.children.viewOne.children.editSection.visible",
        false
      );
      set(
        action.screenConfig,
        "components.div.children.connectionDetails.children.cardContent.children.serviceDetails.children.cardContent.children.viewOne.children.meterID.visible",
        false
      );
    } else {
      set(
        action.screenConfig,
        "components.div.children.connectionDetails.children.cardContent.children.serviceDetails.children.cardContent.children.viewOne.children.editSection.visible",
        true
      );
      set(
        action.screenConfig,
        "components.div.children.connectionDetails.children.cardContent.children.serviceDetails.children.cardContent.children.viewOne.children.meterID.visible",
        true
      );
    }

    //   const footer = footerReview(action, state, dispatch, status, connectionNumber, tenantId);
    //   process.env.REACT_APP_NAME === "Citizen"
    //     ? set(action, "screenConfig.components.div.children.footer", footer)
    //     : set(action, "screenConfig.components.div.children.footer", {});
  }
};

const headerrow = getCommonContainer({
  header: getCommonHeader({ labelKey: "WS_SEARCH_CONNECTIONS_DETAILS_HEADER" }),
  connectionNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-wns",
    componentPath: "ConsumerNoContainer",
    props: {
      number: connectionNumber
    }
  }
});

const serviceDetails = getServiceDetails();

const propertyDetails = getPropertyDetails(false);

const ownerDetails = getOwnerDetails(false);

export const connectionDetails = getCommonCard({ serviceDetails, propertyDetails, ownerDetails });

const screenConfig = {
  uiFramework: "material-ui",
  name: "connection-details",
  beforeInitScreen: (action, state, dispatch) => {
    set(action.screenConfig, "components.div.children.headerDiv.children.header1.children.connectionNumber.props.number", connectionNumber);
    const tenantId = getQueryArg(window.location.href, "tenantId");
    connectionNumber = getQueryArg(window.location.href, "connectionNumber");
    const queryObject = [{ key: "tenantId", value: tenantId }, { key: "businessService", value: "WS" }];
    setBusinessServiceDataToLocalStorage(queryObject, dispatch);
    beforeInitFn(action, state, dispatch, connectionNumber);
    return action;
  },

  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css search-preview",
        id: "connection-details"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header1: {
              gridDefination: {
                xs: 12,
                sm: 8
              },
              ...headerrow
            },
            helpSection: {
              uiFramework: "custom-atoms",
              componentPath: "Container",
              props: {
                color: "primary",
                style: { justifyContent: "flex-end", display: "block" }
              },
              gridDefination: {
                xs: 12,
                sm: 4,
                align: "right"
              },
              children: {
                word1: {
                  ...getCommonTitle(
                    {
                      labelKey: "WS_CONNECTION_DETAILS_CONNECTION_STATUS_HEADER"
                    },
                    {
                      style: {
                        marginRight: "10px",
                        // color: "rgba(0, 0, 0, 0.6000000238418579)"
                      }
                    }
                  )
                },
                word2: {
                  ...getCommonTitle({
                    labelName: "Active",
                    // jsonPath: "WaterConnection[0].headerSideText.word2"
                  }
                    ,
                    {
                      style: {
                        marginRight: "10px",
                        color: "rgba(0, 0, 0, 0.6000000238418579)"
                      }
                    })
                },
              }
            }
          }
        },
        taskStatus: {
          uiFramework: "custom-containers-local",
          componentPath: "WorkFlowContainer",
          moduleName: "egov-workflow",
          visible: process.env.REACT_APP_NAME === "Citizen" ? false : true
        },
        connectionDetails,
        connectionDetailsFooter
      }
    },
    breakUpDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-wns",
      componentPath: "ViewBreakupContainer",
      props: {
        open: false,
        maxWidth: "md",
        screenKey: "search-preview"
      }
    }
  }
};

export default screenConfig;
