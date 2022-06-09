import { CardLabel, LabelFieldPair, LinkButton, Loader, TextInput } from "@egovernments/digit-ui-react-components";
import React from "react";
import { Link } from "react-router-dom";

const WSPropertyDetails = ({ t, config, onSelect, userType, formData, setError, formState, clearErrors }) => {
  const redirectBackUrl = `/digit-ui/${userType}/ws/new-application`;
  const [propertyId, setPropertyId] = React.useState("");
  const tenantId = Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code;
  const { isLoading: loading, data: propertyDetails } = Digit.Hooks.pt.usePropertySearch(
    { filters: { propertyIds: formData?.cptId?.id }, tenantId: tenantId },
    { filters: { propertyIds: formData?.cptId?.id }, tenantId: tenantId }
  );

  const getPropertyAddress = () => {
    const property = propertyDetails?.Properties?.at(0);
    const doorNo = property?.doorNo;
    const street = property?.address?.street;
    const landMark = property?.address?.landmark;
    const locality = property?.address?.locality?.name;
    const city = property?.address?.city;
    const pinCode = property?.address?.pincode;

    return `${doorNo ? doorNo + ", " : ""}
      ${street ? street + ", " : ""}
      ${landMark ? landMark + ", " : ""}
      ${locality ? locality + ", " : ""}
      ${city ? city : ""}
      ${pinCode ? ", " + pinCode : ""}`;
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{`${t(`PROPERTY_ID`)}`}</CardLabel>
        <div className="field" style={{ marginTop: "20px" }}>
          <TextInput
            key={config.key}
            value={propertyId}
            onChange={(e) => {
              setPropertyId(e.target.value);
              onSelect(config.key, { id: e.target.value });
            }}
            style={{ width: "65%", float: "left", marginRight: "20px" }}
          />
          <button className="submit-bar" type="button" onClick={() => setPropertyId(propertyId)}>
            {`${t("PT_SEARCH")}`}
          </button>
        </div>
      </LabelFieldPair>
      <Link to={`/digit-ui/employee/commonpt/search?redirectToUrl=${redirectBackUrl}`}>
        <LinkButton label={t("CPT_SEARCH_PROPERTY")} style={{ color: "#f47738", display: "inline-block" }} />
      </Link>
      &nbsp; | &nbsp;
      <Link to={`/digit-ui/employee/commonpt/new-application?redirectToUrl=${redirectBackUrl}`}>
        <LinkButton label={t("CPT_CREATE_PROPERTY")} style={{ color: "#f47738", display: "inline-block" }} />
      </Link>
      {propertyDetails && propertyDetails?.Properties.length && (
        <React.Fragment>
          <header className="card-section-header" style={{ marginBottom: 0, marginTop: "20px" }}>
            {t("PT_DETAILS")}
          </header>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t(`PROPERTY_ID`)}`}</CardLabel>
            <div className="field">
              <p>{propertyDetails?.Properties[0]?.propertyId}</p>
            </div>
          </LabelFieldPair>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t(`OWNER_NAME`)}`}</CardLabel>
            <div className="field">
              <p>{propertyDetails?.Properties[0]?.owners[0]?.name}</p>
            </div>
          </LabelFieldPair>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t(`PROPERTY_ADDRESS`)}`}</CardLabel>
            <div className="field">
              <p>{getPropertyAddress()}</p>
            </div>
          </LabelFieldPair>
          <Link to={`/digit-ui/employee/commonpt/view-property?propertyId=${propertyId}&tenantId=${tenantId}`}>
            <LinkButton label={t("CPT_COMPLETE_PROPERTY_DETAILS")} style={{ color: "#f47738" }} />
          </Link>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default WSPropertyDetails;
