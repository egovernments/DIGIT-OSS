import {
    getCommonCard,
    getCommonTitle,
    getDateField,
    getSelectField,
    getCommonContainer,
    getPattern,
    getCommonParagraph,
    getBreak,
    getTextField,
    getCommonGrayCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { onDemandRevisionBasis } from "../../utils";
import get from "lodash/get";

export const AddAdjustmentAmount = getCommonCard({
    header: getCommonTitle(
        {
            labelName: "Add Adjustment Amount",
            labelKey: "BILL_ADJUSTMENT_AMOUNT_TITLE"
        },
        {
            style: {
                marginBottom: 18
            }
        }
    ),
    subText: getCommonParagraph({
        labelName: "Please mention the adjustment amount against from respective Tax Head for generation of Credit/Debit Note.",
        labelKey: "BILL_ADJUSTMENT_AMOUNT_SUBTEXT"
    }),
    break: getBreak(),
    AddAdjustmentAmountContainer: getCommonGrayCard({
        uploadedfile: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-billamend",
            componentPath: "AdjustmentAmountContainer",
            props: {
                label: {
                  labelName: "Uploaded Diagram",
                  labelKey: "BPA_BASIC_DETAILS_UPLOADED_DIAGRAM"
                },
                linkDetail: {
                  labelName: "uploadedDiagram.dxf",
                  labelKey: "BPA_BASIC_DETAILS_UPLOADED_DIAGRAM_DXF"
                },
                jsonPath: "scrutinyDetails.updatedDxfFile",
            },
            type: "array"
          },
    })
});

export const AddDemandRevisionBasis = getCommonCard({
    header: getCommonTitle(
        {
            labelName: "Add Demand Revision Basis",
            labelKey: "BILL_DEMAND_REVISION_BASIS_TITLE"
        },
        {
            style: {
                marginBottom: 18
            }
        }
    ),
    subText: getCommonParagraph({
        labelName: "Please select the reason for demand revision",
        labelKey: "BILL_DEMAND_REVISION_SUBTEXT"
    }),
    break: getBreak(),
    demandRevisionContainer: getCommonContainer({
        demandRevisionBasis: getSelectField({
            label: {
                labelName: "Demand Revison Basis",
                labelKey: "BILL_DEMAND_REVISON_BASIS_LABEL"
            },
            placeholder: {
                labelName: "Select Demand Revison Basis",
                labelKey: "BILL_DEMAND_REVISON_BASIS_PLACEHOLDER"
            },
            jsonPath: "Amendment.amendmentReason",
            sourceJsonPath: "applyScreenMdmsData.BillAmendment.DemandRevisionBasis",
            required: true,
            gridDefination: {
                xs: 12,
                sm: 12,
                md: 6
            },
            afterFieldChange: (action, state, dispatch) => {
                // const isPreviousDemandRevBasisValueChange = get (state.screenConfiguration.preparedFinalObject, "AmendmentTemp.isPreviousDemandRevBasisValue", false);
                const isPreviousDemandRevBasisValueChange = get (state.screenConfiguration.preparedFinalObject, "AmendmentTemp.amendmentReason", true);
                onDemandRevisionBasis(state, dispatch, true, isPreviousDemandRevBasisValueChange);
            }
        }),
        courtOrderNo: getTextField({
            label: {
                labelName: "Court Order No",
                labelKey: "BILL_COURT_ORDER_NO_LABEL"
            },
            placeholder: {
                labelName: "Enter Court Order No",
                labelKey: "BILL_COURT_ORDER_NO_PLACEHOLDER"
            },
            visible: false,
            required: true,
            jsonPath: "Amendment.reasonDocumentNumber",
            gridDefination: {
                xs: 12,
                sm: 12,
                md: 6
            }
        }),
        dateEffectiveFrom: getDateField({
            label: {
                labelName: "Date Effective From",
                labelKey: "BILL_DATE_EFFECTIVE_FROM_LABEL"
            },
            placeholder: {
                labelName: "Select Date Effective From",
                labelKey: "BILL_DATE_EFFECTIVE_FROM_PLACEHOLDER"
            },
            visible: false,
            required: true,
            jsonPath: "Amendment.effectiveFrom",
            gridDefination: {
                xs: 12,
                sm: 12,
                md: 6
            },
            pattern: getPattern("Date"),
            errorMessage: "ERR_INVALID_DATE",
        }),
        govtNotificationNumber: getTextField({
            label: {
                labelName: "Govt Notification No",
                labelKey: "BILL_GOVT_NOTIFICATION_NO_LABEL"
            },
            placeholder: {
                labelName: "Enter Govt Notification No",
                labelKey: "BILL_GOVT_NOTIFICATION_NO_PLACEHOLDER"
            },
            visible: false,
            required: true,
            jsonPath: "Amendment.reasonDocumentNumber",
            gridDefination: {
                xs: 12,
                sm: 12,
                md: 6
            }
        }),
        documentNo: getTextField({
            label: {
                labelName: "Document No",
                labelKey: "BILL_DOCUMNET_NO_LABEL"
            },
            placeholder: {
                labelName: "Enter Document No",
                labelKey: "BILL_DOCUMENT_NO_PLACEHOLDER"
            },
            visible: false,
            required: true,
            jsonPath: "Amendment.reasonDocumentNumber",
            gridDefination: {
                xs: 12,
                sm: 12,
                md: 6
            }
        }),
        fromDate: getDateField({
            label: {
                labelName: "From Date",
                labelKey: "BILL_COMMON_FROM_DATE_LABEL"
            },
            placeholder: {
                labelName: "Select From Date",
                labelKey: "BILL_FROM_DATE_PLACEHOLDER"
            },
            visible: false,
            required: true,
            jsonPath: "Amendment.effectiveFrom",
            gridDefination: {
                xs: 12,
                sm: 12,
                md: 6
            },
            pattern: getPattern("Date"),
            errorMessage: "ERR_INVALID_DATE",
        }),
        toDate: getDateField({
            label: {
                labelName: "To Date",
                labelKey: "BILL_COMMON_TO_DATE_LABEL"
            },
            placeholder: {
                labelName: "Select to Date",
                labelKey: "BILL_COMMON_TO_DATE_PLACEHOLDER"
            },
            visible: false,
            required: true,
            jsonPath: "Amendment.effectiveTill",
            gridDefination: {
                xs: 12,
                sm: 12,
                md: 6
            },
            pattern: getPattern("Date"),
            errorMessage: "ERR_INVALID_DATE",
        })
    })
});