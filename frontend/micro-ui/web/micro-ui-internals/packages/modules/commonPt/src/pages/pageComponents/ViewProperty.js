import { Header } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
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
  const { propertyId, tenantId } = Digit.Hooks.useQueryParams();
  const { isLoading, data: applicationDetails } = Digit.Hooks.pt.useGenericViewProperty(t, tenantId, propertyId, {});

  return (
    <div>
      <div>
        <Header>{t("PT_PROPERTY_INFO_HEADER")}</Header>
      </div>
      <ApplicationDetails
        applicationDetails={applicationDetails}
        isLoading={isLoading}
        isDataLoading={isLoading}
        applicationData={applicationDetails?.applicationData}
        moduleCode="PT"
      />
    </div>
  );
};

export default ViewProperty;
