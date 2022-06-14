import React, { Fragment } from "react";
import { BackButton, Card, AddNewIcon, InboxIcon, ViewReportIcon, CardText, CardHeader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const FstpOperations = () => {
    const { t } = useTranslation();
    const state = Digit.ULBService.getStateId();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const stateId = Digit.ULBService.getStateId();
    const history = useHistory();

    return (
        <React.Fragment>
            <Card style={{ backgroundColor: "transparent", boxShadow: "none" }}>
                <CardHeader> {t("ES_COMMON_FSTP_OPERATION")} </CardHeader>
                <div style={{ display: "flex", flexWrap: "wrap", alignContent: "center", justifyContent: "space-between", textAlign: "-webkit-center" }}>
                    <Card style={{ minWidth: "100px" }} onClick={() => history.push('/digit-ui/employee/fsm/fstp-add-vehicle')} children={<> <AddNewIcon /> <p> {t("ES_FSM_ADD_NEW_BUTTON")} </p> </>}></Card>
                    <Card style={{ maxWidth: "100px" }} children={<> <ViewReportIcon /> <p> {t("ES_FSM_VIEW_REPORTS_BUTTON")} </p> </>}></Card>
                    <Card style={{ minWidth: "100px" }} onClick={() => history.push('/digit-ui/employee/fsm/fstp-inbox')} children={<> <InboxIcon /> <p> {t("ES_COMMON_INBOX")} </p> </>}></Card>
                </div>
            </Card>
        </React.Fragment>
    );
};

export default FstpOperations;
