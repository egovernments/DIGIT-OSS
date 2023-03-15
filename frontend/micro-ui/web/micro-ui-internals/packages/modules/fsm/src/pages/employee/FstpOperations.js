import React, { Fragment } from "react";
import { BackButton, Card, AddNewIcon, InboxIcon, ViewReportIcon, CardText, CardHeader, ULBHomeCard } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const FstpOperations = () => {
    const { t } = useTranslation();
    const state = Digit.ULBService.getStateId();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const stateId = Digit.ULBService.getStateId();
    const history = useHistory();
    const title = "ES_COMMON_FSTP_OPERATION"
    const module = [
        {
            name: "ES_FSM_ADD_NEW_BUTTON",
            link: "/digit-ui/employee/fsm/fstp-add-vehicle",
            icon: <AddNewIcon />
        },
        {
            name: "ES_FSM_VIEW_REPORTS_BUTTON",
            link: "/employee/report/fsm/FSMFSTPPlantWithVehicleLogReport",
            hyperlink: true,
            icon: <ViewReportIcon />
        },
        {
            name: "ES_COMMON_INBOX",
            link: "/digit-ui/employee/fsm/fstp-inbox",
            icon: <InboxIcon />
        }
    ]

    return (
        <React.Fragment>
            <ULBHomeCard title={title} module={module} > </ULBHomeCard>
        </React.Fragment>
    );
};

export default FstpOperations;
