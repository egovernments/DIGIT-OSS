import {
    getCommonCard,
    getCommonContainer,
    getCommonGrayCard,
    getCommonTitle,
    getBreak,
    getLabelWithValue,
    getCommonHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getReviewDocuments } from "./document-review"


export const getFeesEstimateCard = props => {
    const { sourceJsonPath, ...rest } = props;
    return {
        uiFramework: "custom-containers-local",
        moduleName: "egov-billamend",
        componentPath: "EstimateCardContainer",
        props: {
            sourceJsonPath: "LicensesTemp[0].estimateCardData"
            // ...rest
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

const screenConfig = {
    uiFramework: "material-ui",
    name: "search-preview",
    beforeInitScreen: (action, state, dispatch) => {
        dispatch(prepareFinalObject("bill-amend-review-document-data",
        [
            { "title": "Court Order", "link": "https://minio-egov-micro-qa.egovernments.org/egov-rainmaker-1/pb/undefined/October/16/1602857173091JPEG.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIOSFODNN7EXAMPLE%2F20201027%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20201027T080407Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=cc9a4105a881665ff4624337648ef5820f133d6cad3d15b3db183412aceb996a", "linkText": "View", "name": "CourtOrder.jpeg" },
            { "title": "Past Bills", "link": "https://minio-egov-micro-qa.egovernments.org/egov-rainmaker-1/pb/undefined/October/16/1602857173091JPEG.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIOSFODNN7EXAMPLE%2F20201027%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20201027T080407Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=cc9a4105a881665ff4624337648ef5820f133d6cad3d15b3db183412aceb996a", "linkText": "View", "name": "PastBills.jpeg" },
            { "title": "Identity Proof", "link": "https://minio-egov-micro-qa.egovernments.org/egov-rainmaker-1/pb/undefined/October/16/1602857173091JPEG.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIOSFODNN7EXAMPLE%2F20201027%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20201027T080407Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=cc9a4105a881665ff4624337648ef5820f133d6cad3d15b3db183412aceb996a", "linkText": "View", "name": "IdentityProof.jpeg" },
            { "title": "Address Proof", "link": "https://minio-egov-micro-qa.egovernments.org/egov-rainmaker-1/pb/undefined/October/16/1602857173091JPEG.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIOSFODNN7EXAMPLE%2F20201027%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20201027T080407Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=cc9a4105a881665ff4624337648ef5820f133d6cad3d15b3db183412aceb996a", "linkText": "View", "name": "AddressProof.jpeg" },
            { "title": "Self Declaration", "link": "https://minio-egov-micro-qa.egovernments.org/egov-rainmaker-1/pb/undefined/October/16/1602857173091JPEG.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIOSFODNN7EXAMPLE%2F20201027%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20201027T080407Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=cc9a4105a881665ff4624337648ef5820f133d6cad3d15b3db183412aceb996a", "linkText": "View", "name": "SelfDeclaration.jpeg" }
        ]
        ))
        return action;
    },
    components: {
        div: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            props: {
                className: "common-div-css search-preview"
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
                                style: { justifyContent: "flex-end" }
                            },
                            gridDefination: {
                                xs: 12,
                                sm: 4,
                                align: "right"
                            }
                        },

                    }
                },
                bodyDiv: getCommonCard({
                    title: getCommonTitle({ labelName: "Summary",labelKey:"BILL_SUMMARY" }),
                    grayDiv: getCommonGrayCard({
                        title: getCommonTitle({
                            labelName: "Amount Details",
                            labelKey: "BILL_AMOUNT_DETAILS"
                        }),
                        subtitle: getHeader({
                            labelName: "Adjustment Amount Details",
                            labelKey: "BILL_ADJUSTMENT_AMOUNT_DETAILS"
                        }),
                        estimate:
                            getFeesEstimateCard({
                                sourceJsonPath: "LicensesTemp[0].estimateCardData"
                            }),
                        bpaBasicDetailsContainer: getHeader({
                            labelName: "Demand Revision Basis Details",
                            labelKey: "BILL_DEMAND_REVISION_BASIS_DETAILS"
                        }),
                        break1: getBreak(),
                        basicDetailsContainer: getCommonContainer({
                            scrutinynumber: getLabelWithValue(
                                {
                                    labelName: "Demand Revision Basis",
                                    labelKey: "BILL_DEMAND_REVISION_BASIS"
                                },
                                {
                                    jsonPath: "BPA.edcrNumber",
                                    // callBack: checkValueForNA
                                }
                            ),
                            occupancy: getLabelWithValue(
                                {
                                    labelName: "Court Order No.",
                                    labelKey: "BILL_COURT_ORDER_NO"
                                },
                                {
                                    jsonPath:
                                        "scrutinyDetails.planDetail.planInformation.occupancy",
                                    // callBack: checkValueForNA
                                }
                            ),
                            applicationtype: getLabelWithValue(
                                {
                                    labelName: "Date Effective From",
                                    labelKey: "BILL_DATE_EFFECTIVE_FROM"
                                },
                                {
                                    jsonPath:
                                        "BPA.applicationType",
                                    // callBack: checkValueForNA
                                }
                            ),

                        }),

                    }),

                    documents: getReviewDocuments(false, false)

                    // demand:getReviewOwner()

                }),


            }
        },
        breakUpDialog: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-tradelicence",
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
