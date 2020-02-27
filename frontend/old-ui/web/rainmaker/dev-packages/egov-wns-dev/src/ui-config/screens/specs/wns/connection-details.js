import {
  getCommonHeader,
  getCommonCard,
  getCommonTitle,
  getCommonGrayCard,
  getCommonContainer,
  convertEpochToDate
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults, getSearchResultsForSewerage, getDescriptionFromMDMS } from "../../../../ui-utils/commons";

import { connectionDetailsFooter } from "./connectionDetailsResource/connectionDetailsFooter";
import { getServiceDetails } from "./connectionDetailsResource/service-details";
import { getPropertyDetails } from "./connectionDetailsResource/property-details";
import { getOwnerDetails } from "./connectionDetailsResource/owner-deatils";
const tenantId = getQueryArg(window.location.href, "tenantId")
let connectionNumber = getQueryArg(window.location.href, "connectionNumber");
const service = getQueryArg(window.location.href, "service")

const searchResults = async (action, state, dispatch, connectionNumber) => {
  /**
   * This methods holds the api calls and the responses of fetch bill and search connection for both water and sewerage service
   */
  let queryObject = [{ key: "tenantId", value: tenantId }, { key: "connectionNumber", value: connectionNumber }];
  if (service === "SEWERAGE") {
    let payloadData = await getSearchResultsForSewerage(queryObject, dispatch);
    if (payloadData !== null && payloadData !== undefined && payloadData.SewerageConnections.length > 0) {
      payloadData.SewerageConnections[0].service = service

      if (payloadData.SewerageConnections[0].property.propertyType !== undefined) {
        const propertyTpe = "[?(@.code  == " + JSON.stringify(payloadData.SewerageConnections[0].property.propertyType) + ")]"
        let propertyTypeParams = { MdmsCriteria: { tenantId: "pb", moduleDetails: [{ moduleName: "PropertyTax", masterDetails: [{ name: "PropertyType", filter: `${propertyTpe}` }] }] } }
        const mdmsPropertyType = await getDescriptionFromMDMS(propertyTypeParams, dispatch)
        if (mdmsPropertyType !== undefined && mdmsPropertyType !== null && mdmsPropertyType.MdmsRes.PropertyTax.PropertyType[0].name !== undefined && mdmsPropertyType.MdmsRes.PropertyTax.PropertyType[0].name !== null) {
          payloadData.SewerageConnections[0].property.propertyTypeData = mdmsPropertyType.MdmsRes.PropertyTax.PropertyType[0].name;//propertyType from Mdms
        } else {
          payloadData.SewerageConnections[0].property.propertyTypeData = "NA"
        }
      }

      if (payloadData.SewerageConnections[0].noOfToilets === undefined) { payloadData.SewerageConnections[0].noOfToilets = "NA" }
      if (payloadData.SewerageConnections[0].noOfToilets === 0) { payloadData.SewerageConnections[0].noOfToilets = "0" }
      payloadData.SewerageConnections[0].connectionExecutionDate = convertEpochToDate(payloadData.SewerageConnections[0].connectionExecutionDate)
      const lat = payloadData.SewerageConnections[0].property.address.locality.latitude ? payloadData.SewerageConnections[0].property.address.locality.latitude : 'NA'
      const long = payloadData.SewerageConnections[0].property.address.locality.longitude ? payloadData.SewerageConnections[0].property.address.locality.longitude : 'NA'
      payloadData.SewerageConnections[0].property.address.locality.locationOnMap = `${lat} ${long}`

      if (payloadData.SewerageConnections[0].property.usageCategory !== undefined) {
        const propertyUsageType = "[?(@.code  == " + JSON.stringify(payloadData.SewerageConnections[0].property.usageCategory) + ")]"
        let propertyUsageTypeParams = { MdmsCriteria: { tenantId: "pb", moduleDetails: [{ moduleName: "PropertyTax", masterDetails: [{ name: "UsageCategoryMajor", filter: `${propertyUsageType}` }] }] } }
        const mdmsPropertyUsageType = await getDescriptionFromMDMS(propertyUsageTypeParams, dispatch)
        if (mdmsPropertyUsageType !== undefined && mdmsPropertyUsageType !== null && mdmsPropertyUsageType.MdmsRes.PropertyTax.PropertyType !== undefined && mdmsPropertyUsageType.MdmsRes.PropertyTax.PropertyType[0].name !== null) {
          payloadData.SewerageConnections[0].property.propertyUsageType = mdmsPropertyUsageType.MdmsRes.PropertyTax.UsageCategoryMajor[0].name;//propertyUsageType from Mdms
        } else {
          payloadData.SewerageConnections[0].property.propertyTypeData = "NA"
        }
      }

      dispatch(prepareFinalObject("WaterConnection[0]", payloadData.SewerageConnections[0]))
    }
  } else if (service === "WATER") {
    let payloadData = await getSearchResults(queryObject);
    if (payloadData !== null && payloadData !== undefined && payloadData.WaterConnection.length > 0) {
      payloadData.WaterConnection[0].service = service;
      if (payloadData.WaterConnection[0].connectionExecutionDate !== undefined) {
        payloadData.WaterConnection[0].connectionExecutionDate = convertEpochToDate(payloadData.WaterConnection[0].connectionExecutionDate)
      } else {
        payloadData.WaterConnection[0].connectionExecutionDate = 'NA'
      }
      if (payloadData.WaterConnection[0].noOfTaps === undefined) { payloadData.WaterConnection[0].noOfTaps = "NA" }
      if (payloadData.WaterConnection[0].noOfTaps === 0) { payloadData.WaterConnection[0].noOfTaps = "0" }
      if (payloadData.WaterConnection[0].pipeSize === 0) { payloadData.WaterConnection[0].pipeSize = "0" }
      if (payloadData.WaterConnection[0].property.propertyType !== undefined) {
        const propertyTpe = "[?(@.code  == " + JSON.stringify(payloadData.WaterConnection[0].property.propertyType) + ")]"
        let propertyTypeParams = { MdmsCriteria: { tenantId: "pb", moduleDetails: [{ moduleName: "PropertyTax", masterDetails: [{ name: "PropertyType", filter: `${propertyTpe}` }] }] } }
        const mdmsPropertyType = await getDescriptionFromMDMS(propertyTypeParams, dispatch)
        payloadData.WaterConnection[0].property.propertyTypeData = mdmsPropertyType.MdmsRes.PropertyTax.PropertyType[0].name !== undefined ? mdmsPropertyType.MdmsRes.PropertyTax.PropertyType[0].name : "NA";//propertyType from Mdms
      }
      const lat = payloadData.WaterConnection[0].property.address.locality.latitude;
      const long = payloadData.WaterConnection[0].property.address.locality.longitude;
      payloadData.WaterConnection[0].property.address.locality.locationOnMap = `${lat} ${long}`

      if (payloadData.WaterConnection[0].property.usageCategory !== undefined) {
        const propertyUsageType = "[?(@.code  == " + JSON.stringify(payloadData.WaterConnection[0].property.usageCategory) + ")]"
        let propertyUsageTypeParams = { MdmsCriteria: { tenantId: "pb", moduleDetails: [{ moduleName: "PropertyTax", masterDetails: [{ name: "UsageCategoryMajor", filter: `${propertyUsageType}` }] }] } }
        const mdmsPropertyUsageType = await getDescriptionFromMDMS(propertyUsageTypeParams, dispatch)
        if (mdmsPropertyUsageType !== undefined && mdmsPropertyUsageType !== null && mdmsPropertyUsageType.MdmsRes.PropertyTax.PropertyType !== undefined && mdmsPropertyUsageType.MdmsRes.PropertyTax.PropertyType[0].name !== null) {
          payloadData.WaterConnection[0].property.propertyUsageType = mdmsPropertyUsageType.MdmsRes.PropertyTax.UsageCategoryMajor[0].name;//propertyUsageType from Mdms
        } else {
          payloadData.WaterConnection[0].property.propertyTypeData = "NA"
        }
      }

      dispatch(prepareFinalObject("WaterConnection[0]", payloadData.WaterConnection[0]));
    }
  }
};

const beforeInitFn = async (action, state, dispatch, connectionNumber) => {
  //Search details for given application Number
  if (connectionNumber) {
    (await searchResults(action, state, dispatch, connectionNumber));
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
        connectionDetails,
        connectionDetailsFooter
      }
    }
  }
};

export default screenConfig;