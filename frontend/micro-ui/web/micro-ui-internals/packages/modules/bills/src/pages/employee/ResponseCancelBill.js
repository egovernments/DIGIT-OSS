import { ActionBar, Banner, Card, CardText, Loader, SubmitBar } from "@egovernments/digit-ui-react-components"
import React, { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Link, useLocation } from "react-router-dom"

const ResponseCancelBill = () => {
    
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const { state } = useLocation()
    const { t } = useTranslation() 
    
    const {filters,currentBill, bill} = state

    const { isLoading: hookLoading, data, ...rest } = Digit.Hooks.useCancelBill({
        filters: { ...filters },
    });
   
    return <div>
        {hookLoading  ? <Loader /> : <Card>
            <Banner
                message={!hookLoading && data?.Message ? t("ABG_BILL_CANCELLED") : t("AGB_BILL_CANCEL_FAILED")}
                applicationNumber={currentBill?.billNumber || bill?.billNumber}
                info={!hookLoading && data?.Message ? t("ABG_BILL_NUMBER_LABEL") : ""}
                successful={!hookLoading && data?.Message ? true : false}
            />
            {!hookLoading && data?.Message ? <CardText>{t("COMMON_RESPONSE_SUCCESS_MESSAGE_CANCEL_BILL")}</CardText> : null}
            <ActionBar style={{ display: "flex", justifyContent: "flex-end", alignItems: "baseline" }}>
                <Link to={`/digit-ui/employee`} style={{ marginRight: "1rem" }}>
                    <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
                </Link>
            </ActionBar>
        </Card>}
    </div>
}

export default ResponseCancelBill