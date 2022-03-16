import React, { useEffect, useState, Fragment, useRef } from "react";
import { useTranslation } from "react-i18next";
import ApplicationDetailsTemplate from "../../../../../templates/ApplicationDetails";
import cloneDeep from "lodash/cloneDeep";
import { useParams } from "react-router-dom";
import { Header, DownloadIcon, PrintIcon } from "@egovernments/digit-ui-react-components";
import * as func from "../../../utils"

const GetConnectionDetails = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  // const { connectionNumber, service, connectionType  } = useParams();
  const [showToast, setShowToast] = useState(null);
  let filters = func.getQueryStringParams(location.search);
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

  const downloadConnectionDetails = async () => {
    const ConnectionDetailsfile = await Digit.PaymentService.generatePdf(tenantId, { WaterConnection: applicationDetails?.applicationData } ,"ws-consolidatedacknowlegment");
    const file = await Digit.PaymentService.printReciept(tenantId, { fileStoreIds: ConnectionDetailsfile.filestoreIds[0] });
    window.open(file[ConnectionDetailsfile.filestoreIds[0]], "_blank");
  };

  const closeToast = () => {
    setShowToast(null);
  };
    

  return (
    <Fragment>
    <div>
      <div className="options">
        <Header>{t("WS_CONNECTION_DETAILS")}</Header>
        <div>
        {/* <div className="mrsm" onClick={null}>
          <PrintIcon/>
            {t(`CS_COMMON_PRINT`)}
          </div> */}
        <div className="mrsm" onClick={downloadConnectionDetails}>
          <DownloadIcon className="mrsm"/>
            {t(`CS_COMMON_DOWNLOAD`)}
          </div>
        </div>
      </div>
      <ApplicationDetailsTemplate
        applicationDetails={applicationDetails}
        isLoading={isLoading}
        isDataLoading={isLoading}
        applicationData={applicationDetails?.applicationData}
        mutate={mutate}
        businessService={applicationDetails?.processInstancesDetails?.[0]?.businessService}
        moduleCode="WS"
        showToast={showToast}
        setShowToast={setShowToast}
        closeToast={closeToast}
      />
    </div>
    </Fragment>
  );
};

export default GetConnectionDetails;
