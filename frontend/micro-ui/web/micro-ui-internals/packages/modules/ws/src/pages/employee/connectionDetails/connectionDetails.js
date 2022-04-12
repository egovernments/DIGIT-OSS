import React, { useEffect, useState, Fragment, useRef } from "react";
import { useTranslation } from "react-i18next";
import ApplicationDetailsTemplate from "../../../../../templates/ApplicationDetails";
import cloneDeep from "lodash/cloneDeep";
import { useParams, useHistory } from "react-router-dom";
import { Header, DownloadIcon, PrintIcon, ActionBar } from "@egovernments/digit-ui-react-components";
import * as func from "../../../utils"
import { DownloadBtnColored } from "../../../components/DownloadBtnColored";
import { ifUserRoleExists } from "../../../utils";

const GetConnectionDetails = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const history = useHistory();

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
    const ConnectionDetailsfile = serviceType === "WATER" ? await Digit.PaymentService.generatePdf(tenantId, { WaterConnection: [applicationDetails?.applicationData] } ,"ws-consolidatedacknowlegment")
      : await Digit.PaymentService.generatePdf(tenantId, { SewerageConnections: [applicationDetails?.applicationData] } ,"ws-consolidatedsewerageconnection");
    const file = await Digit.PaymentService.printReciept(tenantId, { fileStoreIds: ConnectionDetailsfile.filestoreIds[0] });
    window.open(file[ConnectionDetailsfile.filestoreIds[0]], "_blank");
  };

  const closeToast = () => {
    setShowToast(null);
  };
  
  function onActionSelect(action) {
    let pathname = `/digit-ui/employee/ws/modify-application?applicationNumber=${applicationDetails?.applicationData?.applicationNo}&service=${serviceType}&propertyId=${applicationDetails?.propertyDetails?.propertyId}`;
    history.push(`${pathname}`, { data: applicationDetails });
  }

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
          <DownloadBtnColored className="mrsm"/>
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
        {ifUserRoleExists('WS_CEMP') ?
          <ActionBar>
            <button
              style={{ color: "#FFFFFF", fontSize: "19px" }}
              className={"submit-bar"}
              name={"WS_MODIFY_CONNECTION_BUTTON"}
              value={"WS_MODIFY_CONNECTION_BUTTON"}
              onClick={(e) => { onActionSelect("WS_MODIFY_CONNECTION_BUTTON" || {}) }}
            >
              {t(`WS_MODIFY_CONNECTION_BUTTON`)}
            </button>
          </ActionBar> : null
        }
    </div>
    </Fragment>
  );
};

export default GetConnectionDetails;
