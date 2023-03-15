import {
    getCommonGrayCard,
    getCommonSubHeader,
    getCommonContainer,
    getLabelWithValueForModifiedLabel,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { serviceConst } from "../../../../../ui-utils/commons";

const service = getQueryArg(window.location.href, "service")
const applicationNumber = getQueryArg(window.location.href, "applicationNumber");

// let pageUrl = window.location.href;
// let arrayOfUrl = pageUrl && pageUrl.split("applicationNumber=");
// let applicationNumberUrl = arrayOfUrl && arrayOfUrl[1].split("&");
// let applicationNumber = applicationNumberUrl && applicationNumberUrl.length > 0 && applicationNumberUrl[0];

const getHeader = label => {
    return {
        uiFramework: "custom-molecules-local",
        moduleName: "egov-wns",
        componentPath: "DividerWithLabel",
        props: {
            className: "hr-generic-divider-label",
            labelProps: {},
            dividerProps: {},
            label
        },
        type: "array"
    };
};

export const connectionDetailsHeader = getHeader({
    labelKey: "WS_COMMON_CONNECTION_DETAILS"
});


export const getConnectionDetails = () => {
    return ({
        uiFramework: "custom-containers",
        componentPath: "MultiItem",
        props: {
            className: "common-div-css search-preview",
            scheama: getCommonGrayCard({
                div4: connectionDetailsHeader,
                // serviceCardContainer: renderService()
                serviceCardContainerForWater: renderServiceForWater(),
                serviceCardContainerForSW: renderServiceForSW(),

            }),
            items: [],
            hasAddItem: false,
            isReviewPage: true,
            sourceJsonPath: "WaterConnection[0]",
            prefixSourceJsonPath:
                "children.cardContent.children.getConnectionContainer.children",
            afterPrefixJsonPath: "children.value.children.key"
        },
        type: "array"
    });
}

 export const connectionDetailsWater={
    taskApplicationType : getLabelWithValueForModifiedLabel(
        {
            labelName:"Apply For",
            labelKey: "WS_APPLY_FOR"
        },
        {
            jsonPath: "WaterConnection[0].service",
            localePrefix: {
                moduleName: "WS",
                masterName: "APPLY"
              },
        },  {
            labelKey: "WS_OLD_LABEL_NAME"
          },
          { jsonPath: "WaterConnectionOld[0].service",
          localePrefix: {
            moduleName: "WS",
            masterName: "APPLY"
          }, }),
    
     taskNumberOfTapsPropsed : getLabelWithValueForModifiedLabel(
        {
            labelName:"No of Taps Proposed",
            labelKey: "WS_TASK_DETAILS_CONN_DETAIL_NO_OF_TAPS_PROPOSED"
        },
        {
            jsonPath: "WaterConnection[0].proposedTaps",
        },  {
            labelKey: "WS_OLD_LABEL_NAME"
          },
          { jsonPath: "WaterConnectionOld[0].proposedTaps" }),
     taskPipeSizeProposed : getLabelWithValueForModifiedLabel(
        {
            labelName:"No of pipe size proposed",
            labelKey: "WS_TASK_DETAILS_CONN_DETAIL_PIPE_SIZE_PROPOSED"
        },
        { jsonPath: "WaterConnection[0].proposedPipeSize" },  {
            labelKey: "WS_OLD_LABEL_NAME"
          },
          { jsonPath: "WaterConnectionOld[0].proposedPipeSize" })

}
 export const connectionDetailsSewerage={
    taskApplicationType : getLabelWithValueForModifiedLabel(
        {
            labelName:"Apply For",
            labelKey: "WS_APPLY_FOR"
        },
        {
            jsonPath: "WaterConnection[0].service",
            localePrefix: {
                moduleName: "WS",
                masterName: "APPLY"
              },
        },  {
            labelKey: "WS_OLD_LABEL_NAME"
          },
          { jsonPath: "WaterConnectionOld[0].service",
          localePrefix: {
            moduleName: "WS",
            masterName: "APPLY"
          }, }),
    taskNoOfClosets : getLabelWithValueForModifiedLabel(
        {
            labelName:"No of closets proposed",
            labelKey: "WS_TASK_DETAILS_CONN_DETAIL_NO_OF_CLOSETS_PROPOSED"
        },
        { jsonPath: "WaterConnection[0].proposedWaterClosets" },  {
            labelKey: "WS_OLD_LABEL_NAME"
          },
          { jsonPath: "WaterConnectionOld[0].proposedWaterClosets" }
    ),
     taskNoOfToilets : getLabelWithValueForModifiedLabel(
        {
            labelName:"No of toilets proposed",
            labelKey: "WS_TASK_DETAILS_CONN_DETAIL_NO_OF_TOILETS_PROPOSED"
        },
        { jsonPath: "WaterConnection[0].proposedToilets" },  {
            labelKey: "WS_OLD_LABEL_NAME"
          },
          { jsonPath: "WaterConnectionOld[0].proposedToilets" }
    )

}

 const connectionDetails=(applicationNumber!==null&&applicationNumber!==undefined)?(applicationNumber.includes("WS"))?connectionDetailsWater:connectionDetailsSewerage:"";

export const connDetailsWater=connectionDetailsWater;

export const connDetailsSewerage=connectionDetailsSewerage;
export const renderService = () => {
    return getCommonContainer(connectionDetails)
}

export const renderServiceForWater = () => {
    return getCommonContainer(connectionDetailsWater)
}

export const renderServiceForSW = () => {
    return getCommonContainer(connectionDetailsSewerage)
}