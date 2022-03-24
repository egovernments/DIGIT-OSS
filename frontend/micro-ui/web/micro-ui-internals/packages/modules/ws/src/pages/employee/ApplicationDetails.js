import React, { useState, Fragment, useEffect } from "react";
import { FormComposer, Header, Card, CardSectionHeader, PDFSvg, Loader, StatusTable, Row, ActionBar, SubmitBar, MultiLink } from "@egovernments/digit-ui-react-components";
import { useParams, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ApplicationDetailsTemplate from "../../../../templates/ApplicationDetails";
import get from "lodash/get";
import orderBy from "lodash/orderBy";
import cloneDeep from "lodash/cloneDeep";
import * as func from "../../utils"
import getPDFData from "../../utils/getWSAcknowledgementData";
import { getFiles } from "../../utils";


const ApplicationDetails = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const userInfo = Digit.UserService.getUser();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const stateCode = Digit.ULBService.getStateId();
    const [showToast, setShowToast] = useState(null);
    const [canSubmit, setSubmitValve] = useState(false);
    const defaultValues = {};
    const history = useHistory();
    const stateId = Digit.ULBService.getStateId();
    const isMobile = window.Digit.Utils.browser.isMobile();
    const [showOptions, setShowOptions] = useState(false);
    let filters = func.getQueryStringParams(location.search);
    const applicationNumber = filters?.applicationNumber;
    const serviceType = filters?.service;

    const { isLoading, isError, data: applicationDetails, error } = Digit.Hooks.ws.useWSDetailsPage(t, tenantId, applicationNumber, serviceType);

    let workflowDetails = Digit.Hooks.useWorkflowDetails({
        tenantId: tenantId,
        id: applicationNumber,
        moduleCode: applicationDetails?.processInstancesDetails?.[0]?.businessService,
    });

    const {
        isLoading: updatingApplication,
        isError: updateApplicationError,
        data: updateResponse,
        error: updateError,
        mutate,
    } = Digit.Hooks.ws.useWSApplicationActions(serviceType);


    const closeToast = () => {
        setShowToast(null);
        // setError(null);
    };

    workflowDetails?.data?.actionState?.nextActions?.forEach(action => {
        if (action?.action === "ACTIVATE_CONNECTION") {
            action.redirectionUrll = {
                action: action?.action,
                pathname: `/digit-ui/employee/ws/activate-connection?applicationNumber=${applicationNumber}&service=${serviceType}&action=ACTIVATE_CONNECTION`,
                state: applicationDetails?.applicationData
            }
        }
    });

    //   if (workflowDetails?.data?.actionState?.nextActions) {
    //     workflowDetails?.data?.nextActions?.forEach(data => {
    //         if(data.action == "EDIT") workflowDetails.data.actionState.nextActions.push(data);
    //     })
    //   }


    const handleDownloadPdf = async () => {
        const tenantInfo = applicationDetails?.applicationData?.tenantId;
        let res = applicationDetails?.applicationData;
        const PDFdata = getPDFData({ ...res },{...applicationDetails?.propertyDetails}, tenantInfo, t);
        PDFdata.then((ress) => Digit.Utils.pdf.generate(ress));
      };

    let dowloadOptions = [], appStatus = applicationDetails?.applicationData?.applicationStatus || "";

    
    const wsEstimateDownloadObject = {
        order: 1,
        label: t("WS_ESTIMATION_NOTICE"),
        onClick: () => getFiles( [applicationDetails?.applicationData?.additionalDetails?.estimationFileStoreId], stateCode ),
      }

      const sanctionDownloadObject = {
        order: 2,
        label: t("WS_SANCTION_LETTER"),
        onClick: () => getFiles([applicationDetails?.applicationData?.additionalDetails?.sanctionFileStoreId], stateCode ),
      }

      const applicationDownloadObject = {
        order: 3,
        label: t("WS_APPLICATION"),
        onClick: handleDownloadPdf,
      }

    switch (appStatus) {
        case "PENDING_FOR_DOCUMENT_VERIFICATION":
        case "PENDING_FOR_CITIZEN_ACTION":
        case "PENDING_FOR_FIELD_INSPECTION":
            dowloadOptions = [applicationDownloadObject];
          break;
        case "PENDING_APPROVAL_FOR_CONNECTION":
        case "PENDING_FOR_PAYMENT":
            dowloadOptions = [applicationDownloadObject, wsEstimateDownloadObject];
          break;
        case "PENDING_FOR_CONNECTION_ACTIVATION":
        case "CONNECTION_ACTIVATED":
            dowloadOptions = [sanctionDownloadObject, wsEstimateDownloadObject, applicationDownloadObject];
          break;
        case "REJECTED":
            dowloadOptions = [applicationDownloadObject];
          break;
        default: dowloadOptions = [applicationDownloadObject];
          break;
      }

      dowloadOptions.sort(function (a, b) { return a.order - b.order; });

    return (
        <Fragment>
            <div className={"employee-main-application-details"}>
                <div className={"employee-application-details"} style={{ marginBottom: "15px" }}>
                    <Header styles={{ marginLeft: "0px", paddingTop: "10px", fontSize: "32px" }}>{t("CS_TITLE_APPLICATION_DETAILS")}</Header>
                    {dowloadOptions && dowloadOptions.length > 0 && <MultiLink
                        className="multilinkWrapper employee-mulitlink-main-div"
                        onHeadClick={() => setShowOptions(!showOptions)}
                        displayOptions={showOptions}
                        options={dowloadOptions}
                        downloadBtnClassName={"employee-download-btn-className"}
                        optionsClassName={"employee-options-btn-className"}
                    />}
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
                    showToast={showToast}
                    setShowToast={setShowToast}
                    closeToast={closeToast}
                    timelineStatusPrefix={`WF_${applicationDetails?.processInstancesDetails?.[0]?.businessService?.toUpperCase()}_`}
                />
            </div>
        </Fragment>
    )
};

export default ApplicationDetails;