import { Header } from "@egovernments/digit-ui-react-components";
import React, { Fragment } from "react"
import { useTranslation } from "react-i18next";
import ApplicationDetailsTemplate from "../../../../templates/ApplicationDetails";

const ApplicationDetailsBillAmendment = () => {
	const {applicationNumber} = Digit.Hooks.useQueryParams();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const {t} = useTranslation()
    const serviceType = "SW"

    const { isLoading, isError, data: applicationDetails, error } = Digit.Hooks.ws.useWSDetailsPage(t, tenantId, applicationNumber, serviceType);
    const workflowDetails = Digit.Hooks.useWorkflowDetails({tenantId,id: applicationNumber,moduleCode: applicationDetails?.processInstancesDetails?.[0]?.businessService});
    const {
        isLoading: updatingApplication,
        isError: updateApplicationError,
        data: updateResponse,
        error: updateError,
        mutate,
    } = Digit.Hooks.ws.useWSApplicationActions(serviceType);

    debugger
    return <Fragment>
        <div className={"employee-main-application-details"}>
            <div className={"employee-application-details"} style={{ marginBottom: "15px" }}>
                <Header styles={{ marginLeft: "0px", paddingTop: "10px", fontSize: "32px" }}>{t("CS_TITLE_APPLICATION_DETAILS")}</Header>
            </div>
            <ApplicationDetailsTemplate
                applicationDetails={applicationDetails}
                isLoading={isLoading}
                isDataLoading={isLoading}
                applicationData={applicationDetails?.applicationData}
                mutate={mutate}
                workflowDetails={workflowDetails}
                businessService={applicationDetails?.processInstancesDetails?.[0]?.businessService} // businessService
                moduleCode="WS"
                showToast={false}
                setShowToast={()=>{}}
                closeToast={()=>{}}
                timelineStatusPrefix={`WF_${applicationDetails?.processInstancesDetails?.[0]?.businessService?.toUpperCase()}_`}
            />
        </div>
    </Fragment>
}

export default ApplicationDetailsBillAmendment