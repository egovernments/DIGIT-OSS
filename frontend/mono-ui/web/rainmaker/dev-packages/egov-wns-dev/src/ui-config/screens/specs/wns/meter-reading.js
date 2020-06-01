import { getMeterReadingData } from "../../../../ui-utils/commons"
import { getCommonHeader, getLabel, getCommonContainer } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCommonCard, getCommonTitle } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject, toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { meterReadingEditable } from "./meterReading/meterReadingEditable";
import { getMdmsDataForMeterStatus } from "../../../../ui-utils/commons"
import { getMdmsDataForAutopopulated } from "../../../../ui-utils/commons"
import get from "lodash/get";
import { convertEpochToDate } from "../utils";

const addMeterReading = async (state, dispatch) => {
    dispatch(toggleSpinner());
    await getMdmsDataForAutopopulated(dispatch)
    await getMdmsDataForMeterStatus(dispatch)
    await setAutopopulatedvalues(state, dispatch)
    showHideCard(true, dispatch);
    dispatch(toggleSpinner());
};

const setAutopopulatedvalues = async (state, dispatch) => {
    let billingFrequency = get(state, "screenConfiguration.preparedFinalObject.billingCycle");
    let consumptionDetails = {};
    let date = new Date();
    let status = get(state, "screenConfiguration.preparedFinalObject.meterMdmsData.['ws-services-calculation'].MeterStatus[0].code");
    let checkBillingPeriod = await get(state, "screenConfiguration.preparedFinalObject.consumptionDetails");
    if (checkBillingPeriod === undefined || checkBillingPeriod === []) {
        let presYear = date.getFullYear();
        if (billingFrequency === "quarterly") {
            presYear = date.getFullYear();
            let prevYear = date.getFullYear() - 1;
            consumptionDetails['billingPeriod'] = 'Q1-' + prevYear + '-' + presYear.toString().substring(2);
        }
        if (billingFrequency === "monthly") {
            date.setMonth(new Date().getMonth())
            const month = date.toLocaleString('default', { month: 'short' });
            let prevBillingPeriod = month + ' - ' + presYear
            consumptionDetails['billingPeriod'] = prevBillingPeriod
        }
        consumptionDetails['lastReading'] = 0;
        consumptionDetails['consumption'] = 0;
        consumptionDetails['lastReadingDate'] = convertEpochToDate(new Date().setMonth(new Date().getMonth() - 1));
    } else {
        let prevBillingPeriod = get(state, `screenConfiguration.preparedFinalObject.consumptionDetails[0].billingPeriod`);
        let tempprevBillingPeriod = prevBillingPeriod.trim().split("-")[1].trim()
        let dateStr = tempprevBillingPeriod.split('/');
        let newDF = new Date(dateStr[1] + '-' + dateStr[0] + '-' +dateStr[2]);
        newDF = newDF.setDate(newDF.getDate() + 1);
        newDF = new Date(newDF)
        if (billingFrequency === "quarterly") {
            let quarter = Math.floor((newDF.getMonth() / 3));
            let firstDate = new Date(newDF.getFullYear(), quarter * 3, 1);
            let endDate = new Date(firstDate.getFullYear(), firstDate.getMonth() + 3, 0);
            firstDate = firstDate.getDate() + '/' + (firstDate.getMonth()+1) + '/' + firstDate.getFullYear()
            endDate = endDate.getDate() + '/' + (endDate.getMonth()+1) + '/' + endDate.getFullYear()
            consumptionDetails['billingPeriod'] = firstDate + " - " + endDate            
        }
        if (billingFrequency === "monthly") {
            // Added for billing Period           
            let lastDate = new Date(newDF.getFullYear(), newDF.getMonth() + 1, 0)
            let firstDate = newDF.getDate() + '/' + (newDF.getMonth()+1) + '/' + newDF.getFullYear()
            lastDate = lastDate.getDate() + '/' + (lastDate.getMonth()+1) + '/' + lastDate.getFullYear()
            console.log(firstDate + ' - ' + lastDate);
            consumptionDetails['billingPeriod'] = firstDate + ' - ' + lastDate            
        }
        consumptionDetails['lastReading'] = get(state, `screenConfiguration.preparedFinalObject.consumptionDetails[0].currentReading`);
        consumptionDetails['consumption'] = ''
        consumptionDetails['lastReadingDate'] = convertEpochToDate(get(state, `screenConfiguration.preparedFinalObject.consumptionDetails[0].currentReadingDate`))
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

const queryValueAN = getQueryArg(window.location.href, "connectionNos");
// console.log('123', queryValueAN)
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
            number: queryValueAN
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

export default screenConfig;