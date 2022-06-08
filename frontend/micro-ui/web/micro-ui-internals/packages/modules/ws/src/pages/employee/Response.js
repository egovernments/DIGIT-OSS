import { ActionBar, Banner, Card, CardText, Loader, SubmitBar } from "@egovernments/digit-ui-react-components"
import React, { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Link, useLocation } from "react-router-dom"
import getPDFData from "../../utils/getWsAckDataForBillAmendPdf";

const Response = () => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const { state } = useLocation()
    const { t } = useTranslation()
    const connNumber = state?.Amendment?.consumerCode
    let serviceType = "WATER";
    if (connNumber.includes("SW"))
        serviceType = "SEWERAGE"
    const {mutate, isSuccess, isError, isLoading,data} = Digit.Hooks.ws.useCreateBillAmendment()

    const getAckPdf = async (amendment, tenantId, t, tableData, app) => {
        const PDFdata = getPDFData(amendment, tenantId, t, tableData, app);
        PDFdata.then((ress) => Digit.Utils.pdf.generateBillAmendPDF(ress));
    };

    const { isLoading:isLoadingAppDetails, isError:isErrorAppDetails, data: applicationDetails, error } = Digit.Hooks.ws.useWSApplicationDetailsBillAmendment(
        t,
        tenantId,
        data?.Amendments?.[0]?.amendmentId,
        serviceType,
        {enabled:isSuccess}
    );
    
    useEffect(()=>{
        if(state?.Amendment){
            mutate(state)
        }
    },[])

    const handleDownloadPdf = () => {
        getAckPdf(applicationDetails?.amendment, tenantId, t, applicationDetails?.applicationDetails, applicationDetails)
    }

    return <div>
        {isLoading || isLoadingAppDetails ? <Loader/> : <Card>
            <Banner
                message={isSuccess ? t("WS_APPLICATION_SUBMITTED_SUCCESSFULLY_LABEL") : t("CS_WATER_UPDATE_APPLICATION_FAILED")}
                applicationNumber={data?.Amendments?.[0]?.amendmentId}
                info={isSuccess ? t("WS_MYCONNECTIONS_APPLICATION_NO"):""}
                successful={isSuccess ? true : false}
            />
            {isError ? null : <CardText>{t("WS_MESSAGE_SUB_DESCRIPTION_LABEL")}</CardText>}
            {(isSuccess || !!data?.Amendments?.[0]?.amendmentId) && !isError && (
                <SubmitBar style={{ overflow: "hidden" }} label={t("WS_DOWNLOAD_ACK")} onSubmit={handleDownloadPdf} />
            )}
            <ActionBar style={{ display: "flex", justifyContent: "flex-end", alignItems: "baseline" }}>
                <Link to={`/digit-ui/employee`} style={{ marginRight: "1rem" }}>
                <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
                </Link> 
            </ActionBar>
        </Card>}
    </div>
}

export default Response