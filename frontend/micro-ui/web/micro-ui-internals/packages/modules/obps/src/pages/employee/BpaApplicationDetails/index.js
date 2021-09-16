import React, { useState, Fragment } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header, Card, CardSectionHeader, PDFSvg, Loader, StatusTable, Row, ActionBar, SubmitBar } from "@egovernments/digit-ui-react-components";
import ApplicationDetailsTemplate from "../../../../../templates/ApplicationDetails";

const BpaApplicationDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [showToast, setShowToast] = useState(null);
  const [appDetails, setAppDetails] = useState({});

  const workflowDetails = Digit.Hooks.useWorkflowDetails({
    tenantId: tenantId,
    id: id,
    moduleCode: "BPA",
  });

  const { data, isLoading } = Digit.Hooks.obps.useBPADetailsPage(tenantId, { applicationNo: id });
  return (
    <Fragment>
      <div>
        <Header>{t("ES_TITLE_APPLICATION_DETAILS")}</Header>
      </div>
      <ApplicationDetailsTemplate
        applicationDetails={data}
        isLoading={isLoading}
        isDataLoading={isLoading}
        workflowDetails={workflowDetails}
        businessService={workflowDetails?.data?.applicationBusinessService ? workflowDetails?.data?.applicationBusinessService : data?.applicationData?.businessService}
      />
    </Fragment>
  )
};

export default BpaApplicationDetail;