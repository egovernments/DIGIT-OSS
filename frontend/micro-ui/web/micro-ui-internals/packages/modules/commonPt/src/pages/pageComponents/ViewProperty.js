import { Header, ActionBar, SubmitBar } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useLocation, Link } from "react-router-dom";
import ApplicationDetails from "../../../../templates/ApplicationDetails";

/**
 * Page which renders a
 * Generic property screen using property id and tenant id
 *
 * @author jagankumar-egov
 *
 * @example
 *   for employee
 *   digit-ui/employee/commonpt/view-property?propertyId={propertyId}&tenantId={tenantId}
 *
 *   for citizen
 *   digit-ui/citizen/commonpt/view-property?propertyId={propertyId}&tenantId={tenantId}
 *
 * @returns {Screen}  Property Details screen
 */
const ViewProperty = () => {
  const { t } = useTranslation();
  const { propertyId, tenantId, redirectToUrl } = Digit.Hooks.useQueryParams();
  const { isLoading, data: applicationDetails } = Digit.Hooks.pt.useGenericViewProperty(t, tenantId, propertyId, {});
  const { state } = useLocation();
  const history = useHistory();
  let workflowDetails = {};

  const onSubmit = () => {
    setTimeout(() => window.scrollTo(0, 1600), 400);
    return history.push(`${redirectToUrl}?propertyId=${propertyId}&tenantId=${applicationDetails?.tenantId || tenantId}`, { ...state });
  };

  return (
    <div>
      <div>
        <Header>{t("PT_PROPERTY_INFO_HEADER")}</Header>
      </div>
      <ApplicationDetails
        applicationDetails={applicationDetails}
        isLoading={isLoading}
        isDataLoading={isLoading}
        workflowDetails={workflowDetails}
        applicationData={applicationDetails?.applicationData}
        moduleCode="PT"
      />
      {window.location.href.includes("redirectToUrl") && applicationDetails?.applicationData?.status !== "INACTIVE" && (
        <ActionBar style={{ display: "flex", justifyContent: "flex-end", alignItems: "baseline" }}>
          <div>
            <SubmitBar label={t("PT_ADD_PROPERTY_TO_APP")} onSubmit={() => onSubmit()} />
          </div>
        </ActionBar>
      )}
    </div>
  );
};

export default ViewProperty;
