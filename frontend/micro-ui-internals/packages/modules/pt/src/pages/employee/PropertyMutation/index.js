import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import MutationForm from "./mutationForm";

const MutateProperty = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();

  let { id: applicationNumber } = useParams();

  const { isLoading, data: applicationDetails } = Digit.Hooks.pt.useApplicationDetail(t, tenantId, applicationNumber);

  return applicationDetails && !isLoading ? <MutationForm applicationData={applicationDetails?.applicationData} tenantId={tenantId} /> : null;
};
export default MutateProperty;
