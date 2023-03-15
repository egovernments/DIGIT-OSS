import { getMeterReadingData } from "../../../../ui-utils/commons"
import { getCommonHeader, getLabel, getCommonContainer } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCommonCard, getCommonTitle } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject, toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { meterReadingEditable } from "./meterReading/meterReadingEditable";
import { getMdmsDataForMeterStatus } from "../../../../ui-utils/commons"
import { getSearchResults, getMdmsDataForAutopopulated, isWorkflowExists } from "../../../../ui-utils/commons"
import get from "lodash/get";
import set from "lodash/set";
import { convertEpochToDate } from "../utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { sortpayloadDataObj } from './connection-details'
const addMeterReading = async (state, dispatch) => {
    dispatch(toggleSpinner());
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const connectionNos = getQueryArg(window.location.href, "connectionNos");
    let queryObject = [{ key: "tenantId", value: tenantId }, { key: "connectionNumber", value: connectionNos }];
    let payloadData = await getSearchResults(queryObject);
    if (payloadData !== null && payloadData !== undefined && payloadData.WaterConnection.length > 0) {
        payloadData.WaterConnection = sortpayloadDataObj(payloadData.WaterConnection);
        let applicationNos = getApplicationNo(payloadData.WaterConnection);
        const queryObj = [
            { key: "businessIds", value: applicationNos },
            { key: "tenantId", value: tenantId }
        ];        
        
        let isApplicationApproved = await isWorkflowExists(queryObj);
        if(!isApplicationApproved){
            dispatch(toggleSpinner());
            dispatch(
                toggleSnackbar(
                    true,
                    {
                        labelName: "WorkFlow already Initiated",
                        labelKey: "WS_WORKFLOW_ALREADY_INITIATED"
                    },
                    "error"
                )
            );
            return;
        } else {
            await getMdmsDataForAutopopulated(dispatch)
            await getMdmsDataForMeterStatus(dispatch)
            await setAutopopulatedvalues(state, dispatch)
            showHideCard(true, dispatch); 
        }

    }  
    dispatch(toggleSpinner());
};

const setAutopopulatedvalues = async (state, dispatch) => {
    let billingFrequency = get(state, "screenConfiguration.preparedFinalObject.billingCycle");
    let consumptionDetails = {};
    let date = new Date();
    let status = get(state, "screenConfiguration.preparedFinalObject.meterMdmsData.['ws-services-calculation'].MeterStatus[0].code");
    let checkBillingPeriod = await get(state, "screenConfiguration.preparedFinalObject.consumptionDetails");
    try {
        let lastReadingDate = convertEpochToDate(checkBillingPeriod[0].currentReadingDate);
        let lastDF = new Date();
        let endDate = ("0" + lastDF.getDate()).slice(-2) + '/' + ("0" + (lastDF.getMonth() + 1)).slice(-2) + '/' + lastDF.getFullYear()
        consumptionDetails['billingPeriod'] = lastReadingDate + " - " + endDate
        consumptionDetails['lastReading'] = checkBillingPeriod[0].currentReading
        consumptionDetails['consumption'] = ''
        consumptionDetails['lastReadingDate'] = lastReadingDate
    }catch (e) { 
        dispatch(
            toggleSnackbar(
                true,
                {
                    labelName: "Failed to parse meter reading data.",
                    labelKey: "ERR_FAILED_TO_PARSE_METER_READING_DATA"
                },
                "warning"
            )
        );
        return;
    }

    dispatch(
        handleField(
            "meter-reading",
            "components.div.children.meterReadingEditable.children.card.children.cardContent.children.firstContainer.children.billingCont.children.billingPeriod.props",
            "labelName",
            consumptionDetails.billingPeriod
        )
    );
    dispatch(
        handleField(
            "meter-reading",
            "components.div.children.meterReadingEditable.children.card.children.cardContent.children.thirdContainer.children.secCont.children.billingPeriod.props",
            "labelName",
            consumptionDetails.lastReading
        )
    );
    dispatch(
        handleField(
            "meter-reading",
            "components.div.children.meterReadingEditable.children.card.children.cardContent.children.lastReadingContainer.children.secCont.children.billingPeriod.props",
            "labelName",
            consumptionDetails.lastReadingDate
        )
    );
    dispatch(
        handleField(
            "meter-reading",
            "components.div.children.meterReadingEditable.children.card.children.cardContent.children.sixthContainer.children.secCont.children.billingPeriod.props",
            "labelName",
            consumptionDetails.consumption
        )
    );
    dispatch(
        handleField(
            "meter-reading",
            "components.div.children.meterReadingEditable.children.card.children.cardContent.children.secondContainer.children.status.props",
            "value",
            status
        )
    );
    let todayDate = new Date()
    dispatch(
        handleField(
            "meter-reading",
            "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fifthContainer.children.currentReadingDate.props",
            "value",
            todayDate
        )
    );
    dispatch(prepareFinalObject("autoPopulatedValues", consumptionDetails));

}


const showHideCard = (booleanHideOrShow, dispatch) => {
    dispatch(
        handleField(
            "meter-reading",
            "components.div.children.meterReadingEditable",
            "visible",
            booleanHideOrShow
        )
    );
}
const header = getCommonContainer({
    header: getCommonHeader({
        labelKey: "WS_CONSUMPTION_DETAILS_HEADER"
    }),
    applicationNumber: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-wns",
        componentPath: "ConsumerNoContainer",
        props: {
            number: getQueryArg(window.location.href, "connectionNos")
        }
    },
    classes: {
        root: "common-header-cont"
    }

});

const screenConfig = {
    uiFramework: "material-ui",
    name: "meter-reading",
    beforeInitScreen: (action, state, dispatch) => {
        getMeterReadingData(dispatch);
        set(
            action,
            "screenConfig.components.div.children.header.children.applicationNumber.props.number", getQueryArg(window.location.href, "connectionNos"))
        return action;
    },
    components: {
        div: {
            uiFramework: "custom-atoms",
            componentPath: "Form",
            props: {
                className: "common-div-css",
                id: "meter-reading"
            },
            children: {
                header: header,
                newApplicationButton: {
                    componentPath: "Button",
                    gridDefination: {
                        xs: 12,
                        sm: 12,
                        align: "right"
                    },
                    visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
                    props: {
                        variant: "contained",
                        color: "primary",
                        style: {
                            color: "white",
                            borderRadius: "2px",
                            width: "250px",
                            height: "48px",
                            margin: '9px'
                        }
                    },
                    children: {
                        // plusIconInsideButton: {
                        //     uiFramework: "custom-atoms",
                        //     componentPath: "Icon",
                        //     props: {
                        //         iconName: "add",
                        //         style: {
                        //             fontSize: "24px"
                        //         }
                        //     }
                        // },
                        buttonLabel: getLabel({
                            labelName: "ADD METER READING",
                            labelKey: "WS_CONSUMPTION_DETAILS_BUTTON_METER_READING"
                        }),
                    },
                    onClickDefination: {
                        action: "condition",
                        callBack: addMeterReading
                    }
                },
                meterReadingEditable,
                viewTwo: {
                    uiFramework: "custom-molecules-local",
                    moduleName: "egov-wns",
                    componentPath: "MeterReading"
                },
                // applicationsCard: {
                //     uiFramework: "custom-molecules-local",
                //     moduleName: "egov-wns",
                //     componentPath: "MeterReading"
                // },
            },
        }
    }
};

const demo = getCommonCard({
    subHeader: getCommonTitle({
        labelName: "Search Employee",
        labelKey: "HR_HOME_SEARCH_RESULTS_HEADING"
    }),
});

const getApplicationNo = (connectionsObj) => {
    let appNos = "";
    if(connectionsObj.length > 1){
      for(var i=0; i< connectionsObj.length; i++){
        appNos += connectionsObj[i].applicationNo +",";
      }
      appNos = appNos.slice(0,-1);
    }else{
      appNos = connectionsObj[0].applicationNo;
    }
    return appNos;
}

export default screenConfig;