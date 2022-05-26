import { getAddress } from 'egov-billamend/ui-config/screens/specs/bill-amend/searchResources/function.js';
import {
    convertEpochToDate, getBreak, getCommonCard,
    getCommonContainer,
    getCommonGrayCard,



    getCommonHeader, getCommonTitle,

    getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
    getFileUrl, getFileUrlFromAPI, getQueryArg,

    getTransformedLocale,

    setBusinessServiceDataToLocalStorage
} from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { generateBillAmendAcknowledgement } from "egov-ui-kit/utils/pdfUtils/generateBillAmendAcknowledgement";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import commonConfig from "../../../../config/common";
import { getBillAmdSearchResult, searchBill } from "../../../../ui-utils/commons";
import { getReviewDocuments } from "./document-review";
import { generateBillAmendPdf } from "./utils";
import "./index.css";



export const downloadPrintContainer = (
    action,
    state,
    dispatch,
) => {
    /** MenuButton data based on status */
    let downloadMenu = [];
    let printMenu = [];
    let ptMutationCertificateDownloadObject = {
        label: { labelName: "PT Certificate", labelKey: "MT_CERTIFICATE" },
        link: () => {
        },
        leftIcon: "book"
    };
    let ptMutationCertificatePrintObject = {
        label: { labelName: "PT Certificate", labelKey: "MT_CERTIFICATE" },
        link: () => {
        },
        leftIcon: "book"
    };


    downloadMenu = [ptMutationCertificateDownloadObject];
    printMenu = [ptMutationCertificatePrintObject];

    /** END */

    return {
        rightdiv: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            props: {
                style: { textAlign: "right", display: "flex" }
            },
            children: {
                downloadMenu: {
                    uiFramework: "custom-atoms-local",
                    moduleName: "egov-billamend",
                    componentPath: "MenuButton",
                    props: {
                        data: {
                            label: { labelName: "DOWNLOAD", labelKey: "BILL_AMEND_DOWNLOAD" },
                            leftIcon: "cloud_download",
                            rightIcon: "arrow_drop_down",
                            props: { variant: "outlined", style: { height: "60px", color: "#FE7A51", marginRight: "5px" }, className: "pt-download-button" },
                            menu: downloadMenu
                        }
                    }
                },
                printMenu: {
                    uiFramework: "custom-atoms-local",
                    moduleName: "egov-billamend",
                    componentPath: "MenuButton",
                    props: {
                        data: {
                            label: { labelName: "PRINT", labelKey: "BILL_AMEND_PRINT" },
                            leftIcon: "print",
                            rightIcon: "arrow_drop_down",
                            props: { variant: "outlined", style: { height: "60px", color: "#FE7A51" }, className: "pt-print-button" },
                            menu: printMenu
                        }
                    }
                }

            },
            // gridDefination: {
            //   xs: 12,
            //   sm: 6
            // }
        }
    }
};



const setDownloadMenu = (state, dispatch, applicationNumber) => {
    /** MenuButton data based on status */
    let status = get(
        state,
        "screenConfiguration.preparedFinalObject.Amendment.status"
    );
    let downloadMenu = [];
    let printMenu = [];
    let certificateDownloadObject = {
        label: { labelName: "PT Certificate", labelKey: "BILL_AMEND_COUPON" },
        link: () => {
            generateBillAmendPdf([get(
                state,
                "screenConfiguration.preparedFinalObject.Amendment", {}
            )], commonConfig.tenantId, 'download');
        },
        leftIcon: "book"
    };
    let certificatePrintObject = {
        label: { labelName: "PT Certificate", labelKey: "BILL_AMEND_COUPON" },
        link: () => {
            generateBillAmendPdf([get(
                state,
                "screenConfiguration.preparedFinalObject.Amendment", {}
            )], commonConfig.tenantId, 'print');
        },
        leftIcon: "book"
    };
    let applicationDownloadObject = {
        label: { labelName: "Application", labelKey: "BILL_AMEND_ACK" },
        link: () => {
            generateBillAmendAcknowledgement(get(
                state,
                "screenConfiguration.preparedFinalObject", {}), `billamend-acknowledgement-${applicationNumber}.pdf`);
        },
        leftIcon: "assignment"
    };
    let applicationPrintObject = {
        label: { labelName: "Application", labelKey: "BILL_AMEND_ACK" },
        link: () => {
            generateBillAmendAcknowledgement(get(
                state,
                "screenConfiguration.preparedFinalObject", {}), 'print');
        },
        leftIcon: "assignment"
    };


    switch (status) {
        case "ACTIVE":
        case "CONSUMED":
            downloadMenu = [applicationDownloadObject,
                certificateDownloadObject
            ];
            printMenu = [applicationPrintObject,
                certificatePrintObject
            ];
            break;
        case "INWORKFLOW":
            downloadMenu = [applicationDownloadObject];
            printMenu = [applicationPrintObject];
            break;
        default:
            downloadMenu = [applicationDownloadObject];
            printMenu = [applicationPrintObject];
    }
    dispatch(
        handleField(
            "search-preview",
            "components.div.children.headerDiv.children.helpSection.children.rightdiv.children.downloadMenu",
            "props.data.menu",
            downloadMenu
        )
    );
    dispatch(
        handleField(
            "search-preview",
            "components.div.children.headerDiv.children.helpSection.children.rightdiv.children.printMenu",
            "props.data.menu",
            printMenu
        )
    );
    /** END */
};


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
            number: "NA",
            label: { labelValue: "Consumer No.", labelKey: "BILL_CONSUMER_NO" }
        }
    },
});

export const adjustmentAmountDetails = async (state, dispatch, amendment) => {
    let amountType = amendment && amendment.demandDetails &&
        amendment.demandDetails.length > 0 && amendment.demandDetails.filter(details => details.taxAmount < 0);
    if (amountType && amountType.length > 0) {
        amountType = "reducedAmount"
    } else {
        amountType = "additionalAmount"
    }
    let billDetails = [];
    amendment.demandDetails.map(bill => {
        if (bill && bill.taxAmount) {
            billDetails.push({
                taxHeadMasterCode: bill.taxHeadMasterCode,
                taxAmount: Math.abs(parseFloat(bill.taxAmount)),
                amountType: amountType
            });
        }
    });
    dispatch(prepareFinalObject("AmendmentTemp[0].estimateCardData", billDetails, []));
}

const documentMaping = async (documentsPreview) => {
    let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
    let fileUrls =
        fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};
    let documentsPreviews = documentsPreview.map((doc, index) => {
        doc["link"] =
            (fileUrls &&
                fileUrls[doc.fileStoreId] &&
                getFileUrl(fileUrls[doc.fileStoreId])) ||
            "";
        doc["name"] =
            (fileUrls[doc.fileStoreId] &&
                decodeURIComponent(
                    getFileUrl(fileUrls[doc.fileStoreId])
                        .split("?")[0]
                        .split("/")
                        .pop()
                        .slice(13)
                )) ||
            `Document - ${index + 1}`;
        return doc;
    });
    return documentsPreviews;
}

export const documentDetailsPreview = async (state, dispatch, amendment) => {
    let documentsPreview = [];
    amendment.documents.forEach(doc => {
        documentsPreview.push({
            title: getTransformedLocale(doc.documentType),
            fileStoreId: doc.fileStoreId,
            linkText: "View"
        });
    });
    let appDocuments = await documentMaping(documentsPreview);
    dispatch(prepareFinalObject("bill-amend-review-document-data", appDocuments));
}

export const onDemandRevisionBasisHidendShowFields = async (state, dispatch, action, amendment) => {
    let demandRevisionBasis = get(amendment, "amendmentReason", "");
    switch (demandRevisionBasis) {
        case "COURT_CASE_SETTLEMENT":
            set(
                action,
                "screenConfig.components.div.children.bodyDiv.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.courtOrderNo.visible",
                true
            );
            set(
                action,
                "screenConfig.components.div.children.bodyDiv.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.dateEffectiveFrom.visible",
                true
            );
            set(
                action,
                "screenConfig.components.div.children.bodyDiv.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.govtNotificationNumber.visible",
                false
            );
            set(
                action,
                "screenConfig.components.div.children.bodyDiv.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.documentNo.visible",
                false
            );
            set(
                action,
                "screenConfig.components.div.children.bodyDiv.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.fromDate.visible",
                false
            );
            set(
                action,
                "screenConfig.components.div.children.bodyDiv.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.toDate.visible",
                false
            );
            break;
        case "ARREAR_WRITE_OFF":
        case "ONE_TIME_SETTLEMENT":
            set(
                action,
                "screenConfig.components.div.children.bodyDiv.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.courtOrderNo.visible",
                false
            );
            set(
                action,
                "screenConfig.components.div.children.bodyDiv.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.dateEffectiveFrom.visible",
                false
            );
            set(
                action,
                "screenConfig.components.div.children.bodyDiv.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.govtNotificationNumber.visible",
                true
            );
            set(
                action,
                "screenConfig.components.div.children.bodyDiv.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.documentNo.visible",
                false
            );
            set(
                action,
                "screenConfig.components.div.children.bodyDiv.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.fromDate.visible",
                true
            );
            set(
                action,
                "screenConfig.components.div.children.bodyDiv.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.toDate.visible",
                true
            );
            break;
        case "DCB_CORRECTION":
        case "REMISSION_FOR_PROPERTY_TAX":
        case "OTHERS":
            set(
                action,
                "screenConfig.components.div.children.bodyDiv.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.courtOrderNo.visible",
                false
            );
            set(
                action,
                "screenConfig.components.div.children.bodyDiv.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.dateEffectiveFrom.visible",
                false
            );
            set(
                action,
                "screenConfig.components.div.children.bodyDiv.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.govtNotificationNumber.visible",
                false
            );

            set(
                action,
                "screenConfig.components.div.children.bodyDiv.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.documentNo.visible",
                true
            );
            set(
                action,
                "screenConfig.components.div.children.bodyDiv.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.fromDate.visible",
                true
            );
            set(
                action,
                "screenConfig.components.div.children.bodyDiv.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.toDate.visible",
                true
            );


            break;
        default:

            break;
    }
}

export const setSearchResponse = async (state, dispatch, action) => {
    const tenantId = getTenantId() || getQueryArg(window.location.href, "tenantId");
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    const businessService = getQueryArg(window.location.href, "businessService");

    let billAMDSearch = await getBillAmdSearchResult([
        {
            key: "tenantId",
            value: tenantId
        },
        {
            key: "amendmentId",
            value: applicationNumber
        },
        {
            key: "businessService",
            value: businessService
        }
    ], dispatch);
    let amendments = get(billAMDSearch, "Amendments", []);
    if (amendments && amendments.length > 0) {
        let newQuery = [{
            key: "tenantId",
            value: tenantId
        },
        {
            key: "consumerCode",
            value: get(amendments[0], "consumerCode")
        },
        {
            key: "businessService",
            value: businessService
        }]
        let resp = await searchBill(newQuery, dispatch);
        let connectionDetail = get(resp, 'Bill[0]', {});

        let consumerName = get(connectionDetail, "additionalDetails.ownerName", "NA");
        let consumerAddress = getAddress(get(connectionDetail, "tenantId"), get(connectionDetail, "additionalDetails.locality"));
        set(amendments[0], 'additionalDetails.ownerName', consumerName);
        set(amendments[0], 'additionalDetails.ownerAddress', consumerAddress);
        dispatch(prepareFinalObject("Amendment", amendments[0]));
        dispatch(prepareFinalObject("searchBillDetails-bill", get(amendments[0],"additionalDetails.searchBillDetails",{})));
        dispatch(prepareFinalObject("AmendmentUpdate", amendments[0]));
        adjustmentAmountDetails(state, dispatch, amendments[0]);
        documentDetailsPreview(state, dispatch, amendments[0]);
        onDemandRevisionBasisHidendShowFields(state, dispatch, action, amendments[0]);
        setDownloadMenu(state, dispatch, applicationNumber);
        set(
            action,
            "screenConfig.components.div.children.headerDiv.children.header1.children.applicationNumber.props.number",
            get(amendments[0], "consumerCode")
        );
    }
}

export const billAmendDemandRevisionContainer = {
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
            jsonPath: "Amendment.effectiveFrom",
            callBack: value => {
                return convertEpochToDate(value);
            }
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
            jsonPath: "Amendment.effectiveFrom",
            callBack: value => {
                return convertEpochToDate(value);
            }
        }
    ),
    toDate: getLabelWithValue(
        {
            labelName: "To Date",
            labelKey: "BILL_COMMON_TO_DATE_LABEL"
        },
        {
            jsonPath: "Amendment.effectiveTill",
            callBack: value => {
                return convertEpochToDate(value);
            }
        }
    )
}

export const getData = async (action, state, dispatch) => {
    await setSearchResponse(state, dispatch, action);
}

const screenConfig = {
    uiFramework: "material-ui",
    name: "search-preview",
    beforeInitScreen: (action, state, dispatch) => {
        const printCont = downloadPrintContainer(
            action,
            state,
            dispatch,
        );

        set(
            action,
            "screenConfig.components.div.children.headerDiv.children.helpSection.children",
            printCont
        );
        const businessService = "BS.AMENDMENT";
        const tenantId = getQueryArg(window.location.href, "tenantId");
        const queryObject = [
            { key: "tenantId", value: tenantId },
            { key: "businessServices", value: businessService }
        ];
        setBusinessServiceDataToLocalStorage(queryObject, dispatch);
        getData(action, state, dispatch).then(responseAction => { });
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
                taskStatus: {
                    uiFramework: "custom-containers-local",
                    componentPath: "WorkFlowContainer",
                    moduleName: "egov-workflow",
                    visible: true,
                    props: {
                        dataPath: "AmendmentUpdate",
                        moduleName: "Amendment",
                        updateUrl: "billing-service/amendment/_update",
                    }
                },
                bodyDiv: getCommonCard({
                    title: getCommonTitle({ labelName: "Summary", labelKey: "BILL_SUMMARY" }),
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
                        demandRevisionHeader: getHeader({
                            labelName: "Demand Revision Basis Details",
                            labelKey: "BILL_DEMAND_REVISION_BASIS_DETAILS"
                        }),
                        break1: getBreak(),
                        demandRevisionContainer: getCommonContainer(billAmendDemandRevisionContainer),

                    }),
                    documents: getReviewDocuments(false, false)
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
