import { ActionBar, Banner, Card, CardText, Loader, SubmitBar } from "@egovernments/digit-ui-react-components"
import React, { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Link, useLocation } from "react-router-dom"

const Response = () => {
    const { state } = useLocation()
    const { t } = useTranslation()
    const {mutate, isSuccess, isError, isLoading} = Digit.Hooks.ws.useCreateBillAmendment()
    useEffect(()=>{
        if(state?.Amendment){
            mutate(state)
        }
    },[])

    return <div>
        {isLoading ? <Loader/> : <Card>
            <Banner
                message={isSuccess ? t("WS_BILL_AMENDMENT_BANNER") : t("WS_BILL_AMENDMENT_FAILURE")}
                applicationNumber={state?.data?.[0]?.consumerCode}
                info={""}
                successful={isSuccess ? true : false}
            />
            {isError ? null : <CardText>{t("WS_BILL_AMENDMENT_MESSAGE")}</CardText>}
            <ActionBar style={{ display: "flex", justifyContent: "flex-end", alignItems: "baseline" }}>
                <Link to={`/digit-ui/employee`} style={{ marginRight: "1rem" }}>
                <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
                </Link> 
            </ActionBar>
        </Card>}
    </div>
}

export default Response