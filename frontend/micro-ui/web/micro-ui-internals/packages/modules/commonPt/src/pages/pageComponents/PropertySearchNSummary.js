import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  CardLabel,
  LabelFieldPair,
  SearchAction,
  Dropdown,
  TextInput,
  LinkButton,
  CardLabelError,
  MobileNumber,
  DatePicker,
  Loader,
  Toast,
} from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import { useLocation, Link, useHistory } from "react-router-dom";

const PropertySearchNSummary = ({ config, onSelect, userType, formData, setError, formState, clearErrors }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { pathname, state } = useLocation();
  const isEditScreen = pathname.includes("/modify-application/");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const search = useLocation().search;
  const urlPropertyId = new URLSearchParams(search).get("propertyId");
  const [propertyId, setPropertyId] = useState(formData?.cptId?.id || urlPropertyId || "");
  const [searchPropertyId, setSearchPropertyId] = useState(urlPropertyId);
  const [showToast, setShowToast] = useState(null);

  const { isLoading, isError, error, data: propertyDetails } = Digit.Hooks.pt.usePropertySearch(
    { filters: { propertyIds: searchPropertyId }, tenantId: tenantId },
    { filters: { propertyIds: searchPropertyId }, tenantId: tenantId, enabled: searchPropertyId ? true : false },
  );

  useEffect(() => {
    if(propertyId && window.location.href.includes("/renew-application-details/"))
    setSearchPropertyId(propertyId);
  },[propertyId])

  useEffect(() => {
    if(isLoading == false && (error && error == true ) || propertyDetails?.Properties?.length == 0)
    {
      setShowToast({ error: true, label: "PT_ENTER_VALID_PROPERTY_ID" });
    }
  },[error,propertyDetails])
  useEffect(() => {
    onSelect("cpt", { details: propertyDetails?.Properties[0] });
  }, [propertyDetails, pathname]);

  const searchProperty = () => {
    setSearchPropertyId(propertyId);
  };

  if (isEditScreen) {
    return <React.Fragment />;
  }

  const redirectBackUrl = window.location.pathname;

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
  return (
    <React.Fragment>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{`${t(`PROPERTY_ID`)} *:`}</CardLabel>
        <div className="field" style={{ marginTop: "20px", display: "flex" }}>
          <TextInput
            key={config.key}
            value={propertyId}
            isMandatory={true}
            onChange={(e) => {
              setPropertyId(e.target.value);
              onSelect(config.key, { id: e.target.value });
            }}
            style={{ width: "80%", float: "left", marginRight: "20px" }}
          />
          <button className="submit-bar" type="button" style={{ color: "white" }} onClick={searchProperty}>
            {`${t("PT_SEARCH")}`}
          </button>
        </div>
      </LabelFieldPair>
      <span onClick={() => history.push(`/digit-ui/employee/commonpt/search?redirectToUrl=${redirectBackUrl}`, { ...state })}>
        <LinkButton label={t("CPT_SEARCH_PROPERTY")} style={{ color: "#f47738", display: "inline-block" }} />
      </span>
      &nbsp; | &nbsp;
      <span onClick={() => history.push(`/digit-ui/employee/commonpt/new-application?redirectToUrl=${redirectBackUrl}`, { ...state })}>
        <LinkButton label={t("CPT_CREATE_PROPERTY")} style={{ color: "#f47738", display: "inline-block" }} />
      </span>
      {propertyDetails && propertyDetails?.Properties.length ? (
        <React.Fragment>
          <header className="card-section-header" style={{ marginBottom: 0, marginTop: "20px" }}>
            {t("PT_DETAILS")}
          </header>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t(`PROPERTY_ID`)}:`}</CardLabel>
            <div className="field">
              <p>{propertyDetails?.Properties[0]?.propertyId}</p>
            </div>
          </LabelFieldPair>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t(`OWNER_NAME`)}:`}</CardLabel>
            <div className="field">
              <p>{propertyDetails?.Properties[0]?.owners[0]?.name}</p>
            </div>
          </LabelFieldPair>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t(`PROPERTY_ADDRESS`)}:`}</CardLabel>
            <div className="field">
              <p>{propertyAddress}</p>
            </div>
          </LabelFieldPair>
          <Link to={`/digit-ui/employee/pt/property-details/${propertyId}`}>
            <LinkButton label={t("CPT_COMPLETE_PROPERTY_DETAILS")} style={{ color: "#f47738" }} />
          </Link>
        </React.Fragment>
      ) : null}
      {showToast && (
        <Toast
          isDleteBtn={true}
          labelstyle={{width:"100%"}}
          error={showToast.error}
          warning={showToast.warning}
          label={t(showToast.label)}
          onClose={() => {
            setShowToast(null);
          }}
        />
      )}
    </React.Fragment>
  );
};

export default PropertySearchNSummary;
