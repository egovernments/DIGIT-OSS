import {
    getCommonCard,
    getCommonContainer,
    getCommonGrayCard,
    getCommonTitle,
    getBreak,
    getLabelWithValue,
    getCommonHeader,
    getLabel,
    getCommonSubHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getReviewDocuments } from "../document-review";
import { changeStep } from "../applyResource/footer";


export const getFeesEstimateCard = props => {
    const { sourceJsonPath, ...rest } = props;
    return {
        uiFramework: "custom-containers-local",
        moduleName: "egov-billamend",
        componentPath: "EstimateCardContainer",
        props: {
            sourceJsonPath: "AmendmentTemp[0].estimateCardData"
        }
    };
};
const getHeader = label => {
    return {
        uiFramework: "custom-molecules-local",
        moduleName: "egov-billamend",
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

const headerrow = getCommonContainer({
    header: getCommonHeader({
        labelName: "Generate Note",
        labelKey: "BILL_GENERATE_NOTE"
    }),
    applicationNumber: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-billamend",
        componentPath: "ConsumerNo",
        props: {
            number: "WS-2018-PB-246464",
            label: { labelValue: "Consumer No.", labelKey: "BILL_CONSUMER_NO" }
        }
    },
});

const summary = getCommonCard({
    title: getCommonTitle({ labelName: "Summary", labelKey: "BILL_SUMMARY" }),
    grayDiv: getCommonGrayCard({
        headerDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
            children: {
                header: {
                    gridDefination: {
                        xs: 12,
                        sm: 10
                    },
                    ...getCommonSubHeader({
                        labelName: "Amount Details",
                        labelKey: "BILL_AMOUNT_DETAILS"
                    })
                },
                editSection: {
                    componentPath: "Button",
                    props: {
                        color: "primary"
                    },
                    gridDefination: {
                        xs: 12,
                        sm: 2,
                        align: "right"
                    },
                    visible: true,
                    children: {
                        editIcon: {
                            uiFramework: "custom-atoms",
                            componentPath: "Icon",
                            props: {
                                iconName: "edit"
                            }
                        },
                        buttonLabel: getLabel({
                            labelName: "Edit",
                            labelKey: "BILL_SUMMARY_EDIT"
                        })
                    },
                    onClickDefination: {
                        action: "condition",
                        callBack: (state, dispatch) => {
                            changeStep(state, dispatch, "", 0);
                        }
                    }
                },

            }
        },
        subtitle: getHeader({
            labelName: "Adjustment Amount Details",
            labelKey: "BILL_ADJUSTMENT_AMOUNT_DETAILS"
        }),
        estimate:
            getFeesEstimateCard({
                sourceJsonPath: "LicensesTemp[0].estimateCardData"
            }),
        demandRevisionHeader: getHeader({
            labelName: "Demand Revision Basis Details",
            labelKey: "BILL_DEMAND_REVISION_BASIS_DETAILS"
        }),
        break1: getBreak(),
        demandRevisionContainer: getCommonContainer({
            demandRevisionBasis: getLabelWithValue(
                {
                    labelName: "Demand Revison Basis",
                    labelKey: "BILL_DEMAND_REVISON_BASIS_LABEL"
                },
                {
                    jsonPath: "Amendment.amendmentReason"
                }
            ),
            courtOrderNo: getLabelWithValue(
                {
                    labelName: "Court Order No",
                    labelKey: "BILL_COURT_ORDER_NO_LABEL"
                },
                {
                    jsonPath: "Amendment.reasonDocumentNumber"
                }
            ),
            dateEffectiveFrom: getLabelWithValue(
                {
                    labelName: "Date Effective From",
                    labelKey: "BILL_DATE_EFFECTIVE_FROM_LABEL"
                },
                {
                    jsonPath: "AmendmentTemp.effectiveFrom"
                }
            ),
            govtNotificationNumber: getLabelWithValue(
                {
                    labelName: "Govt Notification No",
                    labelKey: "BILL_GOVT_NOTIFICATION_NO_LABEL"
                },
                {
                    jsonPath: "Amendment.reasonDocumentNumber"
                }
            ),
            documentNo: getLabelWithValue(
                {
                    labelName: "Document No",
                    labelKey: "BILL_DOCUMNET_NO_LABEL"
                },
                {
                    jsonPath: "Amendment.reasonDocumentNumber"
                }
            ),
            fromDate: getLabelWithValue(
                {
                    labelName: "From Date",
                    labelKey: "BILL_COMMON_FROM_DATE_LABEL"
                },
                {
                    jsonPath: "AmendmentTemp.effectiveFrom"
                }
            ),
            toDate: getLabelWithValue(
                {
                    labelName: "To Date",
                    labelKey: "BILL_COMMON_TO_DATE_LABEL"
                },
                {
                    jsonPath: "AmendmentTemp.effectiveTill"
                }
            )
        }),

    }),
    documents: getReviewDocuments(true, false)
})
export default summary;
