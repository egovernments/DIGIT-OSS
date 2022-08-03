import React, { useEffect, useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Header, MultiLink } from "@egovernments/digit-ui-react-components";
import ApplicationDetailsTemplate from "../../../../templates/ApplicationDetails";
import * as func from "../../utils";
import cloneDeep from "lodash/cloneDeep";

const GetDisconnectionDetails = () => {
  const { t } = useTranslation();
  let filters = func.getQueryStringParams(location.search);
  const [showOptions, setShowOptions] = useState(false);
  const [showToast, setShowToast] = useState(null);

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const applicationNumber = filters?.applicationNumber;
  const serviceType = filters?.service;

  let { isLoading, isError, data: applicationDetails, error } = Digit.Hooks.ws.useDisConnectionDetails(t, tenantId, applicationNumber, serviceType);

  let workflowDetails = Digit.Hooks.useWorkflowDetails(
    {
      tenantId: tenantId,
      id: applicationNumber,
      moduleCode: applicationDetails?.processInstancesDetails?.[0]?.businessService,
    },
    {
      enabled: applicationDetails?.processInstancesDetails?.[0]?.businessService ? true : false,
    }
  );

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

  const mobileView = Digit.Utils.browser.isMobile();

  if (
    workflowDetails?.data?.nextActions?.length > 0 &&
    workflowDetails?.data?.actionState?.nextActions?.length > 0 &&
    !workflowDetails?.data?.actionState?.nextActions?.find((e) => e.action === "EDIT") &&
    !workflowDetails?.data?.actionState?.nextActions?.find((e) => e.action === "RESUBMIT_APPLICATION") &&
    !workflowDetails?.data?.actionState?.nextActions?.find((e) => e.action === "EXECUTE_DISCONNECTION") && 
    !workflowDetails?.data?.actionState?.nextActions?.find((e) => e.action === "SUBMIT_APPLICATION") &&
    !workflowDetails?.data?.actionState?.nextActions?.find((e) => e.action === "DISCONNECTION_EXECUTED")
  ) {
    workflowDetails?.data?.nextActions?.forEach((data) => {
      if (data.action == "EDIT") workflowDetails.data.actionState.nextActions.push(data);
    });
  }


  if (applicationDetails?.applicationData?.applicationStatus == "DISCONNECTION_EXECUTED") {
    if (workflowDetails?.data?.actionState?.nextActions) workflowDetails.data.actionState.nextActions = []; 
    if (workflowDetails?.data?.nextActions) workflowDetails.data.nextActions = [];
  }

  workflowDetails?.data?.nextActions?.forEach((action) => {
    if (action?.action === "PAY") {
      action.redirectionUrll = {
        pathname: `${serviceType == "WATER" ? "WS" : "SW"}/${applicationDetails?.applicationData?.connectionNo}/${applicationDetails?.tenantId}?tenantId=${
          applicationDetails?.tenantId
        }&ISWSAPP&applicationNumber=${applicationDetails?.applicationData?.connectionNo}`,
        state: applicationDetails?.tenantId,
      };
    }
  });

  workflowDetails?.data?.actionState?.nextActions?.forEach((action) => {
    if (action?.action === "PAY") {
      action.redirectionUrll = {
        pathname: `${serviceType == "WATER" ? "WS" : "SW"}/${applicationDetails?.applicationData?.connectionNo}/${applicationDetails?.tenantId}?tenantId=${
          applicationDetails?.tenantId
        }&ISWSAPP&applicationNumber=${applicationDetails?.applicationData?.connectionNo}`,
        state: applicationDetails?.tenantId,
      };
    }
  });


  if (workflowDetails?.data?.nextActions?.length > 0) {
    const nextActionsData = cloneDeep(workflowDetails?.data?.nextActions);
    const nextActionsList = nextActionsData?.filter(action => action.action != "EDIT");
    workflowDetails.data.nextActions = nextActionsList;
  }

  if (workflowDetails?.data?.actionState?.nextActions?.length > 0) {
    const nxtActions = cloneDeep(workflowDetails.data.actionState.nextActions);
    const dataList = nxtActions?.filter(action => action?.action != "EDIT");
    workflowDetails.data.actionState.nextActions = dataList;
  }

  let dowloadOptions = [];

  return (
    <Fragment>
      <div>
        <div className={"employee-application-details"} style={{ marginBottom: "15px" }}>
          <Header>{t("WS_APPLICATION_DETAILS")} </Header>
          <MultiLink
            className="multilinkWrapper employee-mulitlink-main-div"
            onHeadClick={() => setShowOptions(!showOptions)}
            displayOptions={showOptions}
            options={dowloadOptions}
            downloadBtnClassName={"employee-download-btn-className"}
            optionsClassName={"employee-options-btn-className"}
          />
        </div>
        <ApplicationDetailsTemplate
          applicationDetails={applicationDetails}
          isLoading={isLoading}
          isDataLoading={isLoading}
          applicationData={applicationDetails?.applicationData}
          mutate={mutate}
          workflowDetails={workflowDetails}
          businessService={applicationDetails?.processInstancesDetails?.[0]?.businessService?.toUpperCase()}
          moduleCode="WS"
          showToast={showToast}
          setShowToast={setShowToast}
          closeToast={closeToast}
          timelineStatusPrefix={`WF_${applicationDetails?.processInstancesDetails?.[0]?.businessService?.toUpperCase()}_`}
          isInfoLabel={true}
        />
      </div>
    </Fragment>
  );
};

export default GetDisconnectionDetails;
