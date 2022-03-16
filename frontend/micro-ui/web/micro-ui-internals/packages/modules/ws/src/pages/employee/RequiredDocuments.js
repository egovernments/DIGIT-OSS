import { ActionBar, Card, CardHeader, CardLabel, CardLabelDesc, CardText, Header, Loader, SubmitBar } from "@egovernments/digit-ui-react-components"
import React, {Fragment} from "react"
import { useTranslation } from "react-i18next"
import { useHistory, useLocation, useParams } from "react-router-dom"

const RequiredDocuments = ({path}) => {
    //connectionNumber=WS/107/2021-22/227166&tenantId=pb.amritsar&service=WATER&connectionType=Metered
    const {search} = useLocation()
    const history = useHistory()
    const { t } = useTranslation()
    const stateId = Digit.ULBService.getStateId();
    const { isLoading: BillAmendmentMDMSLoading, data: BillAmendmentMDMS } = Digit.Hooks.ws.WSSearchMdmsTypes.useWSMDMSBillAmendment({
        tenantId: stateId,
        // config:{
        //     select: ({BillAmendment}) => {
        //         const allRequiredDocuments = BillAmendment?.documentObj?.reduce((acc, curr) => {
        //             const a = [...curr.allowedDocs, ...acc]
        //             return a
        //         },[]).filter(function({documentType}) {
        //             return !this[documentType] && (this[documentType] = documentType)
        //         }, {})
        //         return allRequiredDocuments
        //     }
        // }
    });
    // debugger
    const redirectToBillAmdmentPage = () => {
        history.push(`${path}/bill-amendment${search}`);
    }

    return <>
        <Header>{t("BILLAMENDMENT_REQ_DOCS_HEADER")}</Header>
        <Card style={{ position: "relative" }} className={"employeeCard-override"}>
            {BillAmendmentMDMSLoading ? <Loader /> : 
                BillAmendmentMDMS?.map( e => {
                    return <>
                        <CardHeader>{t(e.i18nKey)}</CardHeader>
                        <CardLabel>{t(`${e.i18nKey}_NOTE`)}</CardLabel>
                        {e.allowedDocuments.allowedDocs.map((e, i) => 
                            <CardLabelDesc>{i}. {t(`WS_${e.documentType}`)}</CardLabelDesc>
                        )}
                    </>
                })
            }
            {/* <CardHeader>{t("BILLAMENDMENT_COURT_CASE_SETTLEMENT_HEADING")}</CardHeader>
            <CardLabel>{t("BILLAMENDMENT_DOCUMENT_NOTE")}</CardLabel>
            <CardLabelDesc>1. {t("BILLAMENDMENT_COURTORDER_LABEL")}</CardLabelDesc>
            <CardLabelDesc>2. {t("BILLAMENDMENT_PASTBILLS_LABEL")}</CardLabelDesc>
            <CardLabelDesc>3. {t("BILLAMENDMENT_IDENTITYPROOF_LABEL")}</CardLabelDesc>
            <CardLabelDesc>4. {t("BILLAMENDMENT_ADDRESSPROOF_LABEL")}</CardLabelDesc>
            <CardLabelDesc>5. {t("BILLAMENDMENT_SELFDECLARATION_LABEL")}</CardLabelDesc>
            
            <CardHeader>{t("BILLAMENDMENT_ARREAR_WRITE_OFF_HEADING")}</CardHeader>
            <CardLabel>{t("BILLAMENDMENT_DOCUMENT_NOTE")}</CardLabel>
            <CardLabelDesc>1. {t("BILLAMENDMENT_GOVTNOTIFICATION_LABEL")}</CardLabelDesc>
            <CardLabelDesc>2. {t("BILLAMENDMENT_PASTBILLS_LABEL")}</CardLabelDesc>
            <CardLabelDesc>3. {t("BILLAMENDMENT_IDENTITYPROOF_LABEL")}</CardLabelDesc>
            <CardLabelDesc>4. {t("BILLAMENDMENT_ADDRESSPROOF_LABEL")}</CardLabelDesc>
            
            <CardHeader>{t("BILLAMENDMENT_DCB_CORRECTION_HEADING")}</CardHeader>
            <CardLabel>{t("BILLAMENDMENT_DOCUMENT_NOTE")}</CardLabel>
            <CardLabelDesc>1. {t("BILLAMENDMENT_OFFICENOTEORDER_LABEL")}</CardLabelDesc>
            <CardLabelDesc>2. {t("BILLAMENDMENT_PASTBILLS_LABEL")}</CardLabelDesc>
            <CardLabelDesc>3. {t("BILLAMENDMENT_IDENTITYPROOF_LABEL")}</CardLabelDesc>
            <CardLabelDesc>4. {t("BILLAMENDMENT_ADDRESSPROOF_LABEL")}</CardLabelDesc>
            
            <CardHeader>{t("BILLAMENDMENT_ONE_TIME_SETTLEMENT_HEADING")}</CardHeader>
            <CardLabel>{t("BILLAMENDMENT_DOCUMENT_NOTE")}</CardLabel>
            <CardLabelDesc>1. {t("BILLAMENDMENT_GOVTNOTIFICATION_LABEL")}</CardLabelDesc>
            <CardLabelDesc>2. {t("BILLAMENDMENT_PASTBILLS_LABEL")}</CardLabelDesc>
            <CardLabelDesc>3. {t("BILLAMENDMENT_IDENTITYPROOF_LABEL")}</CardLabelDesc>
            <CardLabelDesc>4. {t("BILLAMENDMENT_ADDRESSPROOF_LABEL")}</CardLabelDesc>
            
            <CardHeader>{t("BILLAMENDMENT_REMISSION_FOR_PROPERTY_TAX_HEADING")}</CardHeader>
            <CardLabel>{t("BILLAMENDMENT_DOCUMENT_NOTE")}</CardLabel>
            <CardLabelDesc>1. {t("BILLAMENDMENT_OFFICENOTEORDER_LABEL")}</CardLabelDesc>
            <CardLabelDesc>2. {t("BILLAMENDMENT_IDENTITYPROOF_LABEL")}</CardLabelDesc>
            <CardLabelDesc>3. {t("BILLAMENDMENT_ADDRESSPROOF_LABEL")}</CardLabelDesc>
            <CardLabelDesc>4. {t("BILLAMENDMENT_SELFDECLARATION_LABEL")}</CardLabelDesc>
            <CardLabelDesc>5. {t("BILLAMENDMENT_PASTBILLS_LABEL")}</CardLabelDesc>
            
            <CardHeader>{t("BILLAMENDMENT_OTHERS_HEADING")}</CardHeader>
            <CardLabel>{t("BILLAMENDMENT_DOCUMENT_NOTE")}</CardLabel>
            <CardLabelDesc>1. {t("BILLAMENDMENT_SELFDECLARATION_LABEL")}</CardLabelDesc>
            <CardLabelDesc>2. {t("BILLAMENDMENT_SUPPORTINGDOCUMENT_LABEL")}</CardLabelDesc>
            <CardLabelDesc>3. {t("BILLAMENDMENT_PASTBILLS_LABEL")}</CardLabelDesc>
            <CardLabelDesc>4. {t("BILLAMENDMENT_IDENTITYPROOF_LABEL")}</CardLabelDesc>
            <CardLabelDesc>5. {t("BILLAMENDMENT_ADDRESSPROOF_LABEL")}</CardLabelDesc> */}

        </Card>

        <ActionBar>
              <SubmitBar label={t("ES_COMMON_TAKE_ACTION")} onSubmit={() => redirectToBillAmdmentPage()} />
        </ActionBar>
    </>
}

export default RequiredDocuments