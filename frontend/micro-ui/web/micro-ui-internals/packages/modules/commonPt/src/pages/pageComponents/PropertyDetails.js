import {
  CardHeader, FormStep, LinkButton, Loader, Row, StatusTable, SubmitBar
} from "@egovernments/digit-ui-react-components";
import React from "react";
import { Link } from "react-router-dom";
import Timeline from "../../components/CPTTimeline";

const PropertyDetails = ({ t, config, onSelect, userType, formData }) => {
  const tenantId = (formData?.knowyourproperty?.KnowProperty?.code === "YES" ? formData?.cptSearchQuery?.city : formData?.cpt?.details?.tenantId ) || Digit.ULBService.getCitizenCurrentTenant();
  if (window.location.href.includes("/tl/tradelicence/edit-application/") || window.location.href.includes("/renew-trade/")) {
    sessionStorage.setItem("EditFormData", JSON.stringify(formData));
  }
  const { isLoading, isError, error, data: propertyDetails } = Digit.Hooks.pt.usePropertySearch(
    {
      filters: { propertyIds: formData?.knowyourproperty?.KnowProperty?.code === "YES" ? formData?.cptId?.id : formData?.cpt?.details?.propertyId },
      tenantId: tenantId,
    },
    { filters: { propertyIds: formData?.knowyourproperty?.KnowProperty?.code === "YES" ? formData?.cptId?.id : formData?.cpt?.details?.propertyId }, tenantId: tenantId }
  );

  const onSkip = () => onSelect();

  const goNext = () => {
    sessionStorage.setItem("cpt", propertyDetails?.Properties[0]);
    onSelect("cpt", { details: propertyDetails?.Properties[0] });
  };

  let propertyAddress = "";
  if (propertyDetails && propertyDetails?.Properties.length) {
    if (propertyDetails?.Properties[0]?.address?.doorNo) {
      propertyAddress += propertyDetails?.Properties[0]?.address?.doorNo;
      if (propertyDetails?.Properties[0]?.address?.street) {
        propertyAddress += ", ";
      }
    }
    if (propertyDetails?.Properties[0]?.address?.street) {
      propertyAddress += propertyDetails?.Properties[0]?.address?.street;
      if (propertyDetails?.Properties[0]?.address?.landmark) {
        propertyAddress += ", ";
      }
    }
    if (propertyDetails?.Properties[0]?.address?.landmark) {
      propertyAddress += propertyDetails?.Properties[0]?.address?.landmark;
      if (propertyDetails?.Properties[0]?.address?.locality?.code) {
        propertyAddress += ", ";
      }
    }
    if (propertyDetails?.Properties[0]?.address?.locality?.code) {
      propertyAddress +=
        propertyDetails?.Properties[0]?.address?.locality?.code &&
        t(Digit.Utils.pt.getMohallaLocale(propertyDetails?.Properties[0]?.address?.locality?.code, propertyDetails?.Properties[0]?.tenantId));
      if (propertyDetails?.Properties[0]?.address?.city) {
        propertyAddress += ", ";
      }
    }
    if (propertyDetails?.Properties[0]?.address?.city) {
      propertyAddress += propertyDetails?.Properties[0]?.tenantId && t(Digit.Utils.pt.getCityLocale(propertyDetails?.Properties[0]?.tenantId));
      if (propertyDetails?.Properties[0]?.address?.pincode) {
        propertyAddress += ", ";
      }
    }
    if (propertyDetails?.Properties[0]?.address?.pincode) {
      propertyAddress += propertyDetails?.Properties[0]?.address?.pincode;
    }
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      {window.location.href.includes("/citizen") ? <Timeline currentStep={2} /> : null}
      <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip}>
        {propertyDetails && propertyDetails?.Properties.length && (
          <React.Fragment>
            <CardHeader>{t("PT_DETAILS")}</CardHeader>
            <StatusTable>
              <Row className="border-none" label={t(`PROPERTY_ID`)} text={propertyDetails?.Properties[0]?.propertyId} />
              <Row className="border-none" label={t(`OWNER_NAME`)} text={propertyDetails?.Properties[0]?.owners[0]?.name} />
              <Row className="border-none" textStyle={{ wordBreak: "break-word" }} label={t(`PROPERTY_ADDRESS`)} text={propertyAddress} />
              <Row className="border-none" label={t(`PT_MUTATION_STATUS`)} text={propertyDetails?.Properties[0]?.status} />
              <div style={{ textAlign: "left" }}>
                <Link
                  to={`/digit-ui/citizen/commonpt/view-property?propertyId=${propertyDetails?.Properties[0]?.propertyId}&tenantId=${propertyDetails?.Properties[0]?.tenantId}`}
                >
                  <LinkButton style={{ textAlign: "left" }} label={t("PT_VIEW_MORE_DETAILS")} />
                </Link>
                <Link
                  to={
                    window.location.href.includes("/edit-application/") || window.location.href.includes("/renew-trade/")
                      ? `/digit-ui/citizen/tl/tradelicence/edit-application/${formData?.applicationNumber}/${formData?.tenantId}/know-your-property`
                      : `/digit-ui/citizen/tl/tradelicence/new-application/know-your-property`
                  }
                >
                  <LinkButton style={{ textAlign: "left" }} label={t("PT_CHANGE_PROPERTY")} />
                </Link>
              </div>
            </StatusTable>
            <SubmitBar style={{ marginTop: "10px" }} onSubmit={goNext} label={t("CS_COMMON_NEXT")} />
          </React.Fragment>
        )}
      </FormStep>
    </React.Fragment>
  );
};
export default PropertyDetails;
