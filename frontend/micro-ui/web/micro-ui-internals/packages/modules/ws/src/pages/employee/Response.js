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
            {(isSuccess || !!data?.Amendments?.[0]?.amendmentId) && !isError && (<div className="primary-label-btn d-grid" style={{ marginLeft: "unset", marginBottom: "10px", padding: "0px 8px" }} onClick={handleDownloadPdf}>
                  <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginTop:"3px"}}>
                    <path d="M17 5H3C1.34 5 0 6.34 0 8V14H4V18H16V14H20V8C20 6.34 18.66 5 17 5ZM14 16H6V11H14V16ZM17 9C16.45 9 16 8.55 16 8C16 7.45 16.45 7 17 7C17.55 7 18 7.45 18 8C18 8.55 17.55 9 17 9ZM16 0H4V4H16V0Z" fill="#F47738" />
                  </svg>
              {t("WS_PRINT_APPLICATION_LABEL")}
            </div>)}
            <ActionBar style={{ display: "flex", justifyContent: "flex-end", alignItems: "baseline" }}>
                <Link to={`/digit-ui/employee`} style={{ marginRight: "1rem" }}>
                <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
                </Link> 
            </ActionBar>
        </Card>}
    </div>
}

export default Response