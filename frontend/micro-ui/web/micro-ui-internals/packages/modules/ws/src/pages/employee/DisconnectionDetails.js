import React, { useEffect, useState, Fragment } from "react";
import { useTranslation } from "react-i18next";

import { Header, MultiLink } from "@egovernments/digit-ui-react-components";
import ApplicationDetailsTemplate from "../../../../templates/ApplicationDetails";
import WSInfoLabel from "../../pageComponents/WSInfoLabel";
import * as func from "../../utils";
const GetDisconnectionDetails = () => {
  const { t } = useTranslation();
  let filters = func.getQueryStringParams(location.search);
  const [showOptions, setShowOptions] = useState(false);

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const applicationNumber = filters?.applicationNumber;
  const serviceType = filters?.service;

  const { isLoading, isError, data: applicationDetails, error } = Digit.Hooks.ws.useConnectionDetail(t, tenantId, applicationNumber, serviceType);
  const {
    isLoading: updatingApplication,
    isError: updateApplicationError,
    data: updateResponse,
    error: updateError,
    mutate,
  } = Digit.Hooks.ws.useWSApplicationActions(serviceType);

  const mobileView = Digit.Utils.browser.isMobile();

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
          isLoading={isLoading}
          isDataLoading={isLoading}
          applicationDetails={applicationDetails}
          moduleCode="WS"
          labelComponent={<WSInfoLabel t={t} />}
          mutate={mutate}
          businessService={applicationDetails?.processInstancesDetails?.[0]?.businessService}
          applicationData={applicationDetails?.applicationData}
        />
      </div>
    </Fragment>
  );
};

export default GetDisconnectionDetails;
