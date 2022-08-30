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
  StatusTable,
  Row,
  UnMaskComponent,
} from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import { useLocation, Link, useHistory } from "react-router-dom";
const getAddress = (address, t) => {
  return `${address?.doorNo ? `${address?.doorNo}, ` : ""} ${address?.street ? `${address?.street}, ` : ""}${
    address?.landmark ? `${address?.landmark}, ` : ""
  }${t(Digit.Utils.pt.getMohallaLocale(address?.locality.code, address?.tenantId))}, ${t(Digit.Utils.pt.getCityLocale(address?.tenantId))}${
    address?.pincode && t(address?.pincode) ? `, ${address.pincode}` : " "
  }`;
};

const PropertySearchNSummary = ({ config, onSelect, userType, formData, setError, formState, clearErrors }) => {
  const { t } = useTranslation();
  const history = useHistory();
  let { pathname, state } = useLocation();
  state = state && (typeof state === "string" || state instanceof String) ? JSON.parse(state) : state;
  const isEditScreen = pathname.includes("/modify-application/");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const isEmpNewApplication = window.location.href.includes("/employee/tl/new-application");
  const isEmpRenewLicense = window.location.href.includes("/employee/tl/renew-application-details") || window.location.href.includes("/employee/tl/edit-application-details");
  const search = useLocation().search;
  const urlPropertyId = new URLSearchParams(search).get("propertyId");
  const [propertyId, setPropertyId] = useState(formData?.cptId?.id || (urlPropertyId !== "null" ?urlPropertyId:"") || "");
  const [searchPropertyId, setSearchPropertyId] = useState(urlPropertyId !== "null" ?urlPropertyId:"");
  const [showToast, setShowToast] = useState(null);
  const isMobile = window.Digit.Utils.browser.isMobile();
  const serachParams = window.location.href.includes("?")? window.location.href.substring(window.location.href.indexOf("?")+1,window.location.href.length) : "";

  const { isLoading, isError, error, data: propertyDetails } = Digit.Hooks.pt.usePropertySearch(
    { filters: { propertyIds: searchPropertyId }, tenantId: tenantId },
    { filters: { propertyIds: searchPropertyId }, tenantId: tenantId, enabled: searchPropertyId ? true : false, privacy : Digit.Utils.getPrivacyObject() }
  );

  useEffect(() => {
    if (propertyId && (window.location.href.includes("/renew-application-details/") || window.location.href.includes("/edit-application-details/"))) setSearchPropertyId(propertyId);
  }, [propertyId]);

  useEffect(() => {
    if ((isLoading == false && error && error == true) || propertyDetails?.Properties?.length == 0) {
      setShowToast({ error: true, label: "PT_ENTER_VALID_PROPERTY_ID" });
    }
  }, [error, propertyDetails]);
  useEffect(() => {
    onSelect("cpt", { details: propertyDetails?.Properties[0] });
  }, [propertyDetails, pathname]);

  const searchProperty = () => {
    if (!propertyId) {
      setShowToast({ error: true, label: "PT_ENTER_PROPERTY_ID_AND_SEARCH" });
    }
    setSearchPropertyId(propertyId);
    if(window.location.pathname.includes("/tl/new-application")){
      history.push(`/digit-ui/employee/tl/new-application?propertyId=${propertyId}`)
      const scrollConst =  1600 
      setTimeout(() => window.scrollTo(0, scrollConst), 0);
    }
    
    else if (window.location.pathname.includes("/ws/new-application"))
      history.push(`/digit-ui/employee/ws/new-application?propertyId=${propertyId}`)
  };

  if (isEditScreen) {
    return <React.Fragment />;
  }

  const redirectBackUrl = window.location.pathname;

  let propertyAddress = "";

  if (propertyDetails && propertyDetails?.Properties.length) {
    propertyAddress = getAddress(propertyDetails?.Properties[0]?.address, t);
  }
  const getInputStyles = () => {
    if (window.location.href.includes("/ws/")) {
      return { fontWeight: "700" }
    } else return {};
  }

  const getOwnerNames = (propertyData) => {
    const getActiveOwners = propertyData?.owners?.filter(owner => owner?.active);
    const getOwnersList = getActiveOwners?.map(activeOwner => activeOwner?.name)?.join(",");
    return getOwnersList ? getOwnersList : t("NA");
  }

  let clns = "";
  if (window.location.href.includes("/ws/")) clns = ":"

  return (
    <React.Fragment>
     {(window.location.href.includes("/tl/") ? (!(formData?.tradedetils?.[0]?.structureType?.code === "MOVABLE") || isEmpNewApplication ) : true) && <div>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller" style={getInputStyles()}>{`${t(`PROPERTY_ID`)}`}</CardLabel>
        <div className="field" style={{ marginTop: "20px", display: "flex" }}>
          <TextInput
            key={config.key}
            value={propertyId}
            //isMandatory={true}
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
      <span onClick={() => history.push(`/digit-ui/employee/commonpt/search?redirectToUrl=${redirectBackUrl}&${serachParams}`, { ...state })}>
        <LinkButton label={t("CPT_SEARCH_PROPERTY")} style={{ color: "#f47738", display: "inline-block" }} />
      </span>
      &nbsp; | &nbsp;
      <span onClick={() => history.push(`/digit-ui/employee/commonpt/new-application?redirectToUrl=${redirectBackUrl}&${serachParams}`, { ...state })}>
        <LinkButton label={t("CPT_CREATE_PROPERTY")} style={{ color: "#f47738", display: "inline-block" }} />
      </span>
      {propertyDetails && propertyDetails?.Properties.length ? (
        <React.Fragment>
          <header className="card-section-header" style={{ marginBottom: "5px", marginTop: "20px" }}>
            {t("PT_DETAILS")}
          </header>
          <StatusTable>
            <div style={isMobile ? {} : { maxWidth: "60%" }}>
              <Row
                className="border-none"
                labelStyle={isMobile ? { width: "40%" } : {}}
                label={t(`PROPERTY_ID`)}
                text={propertyDetails?.Properties[0]?.propertyId}
              />
              <Row
                className="border-none"
                labelStyle={isMobile ? { width: "40%" } : {}}
                label={t(`OWNER_NAME`)}
                text={getOwnerNames(propertyDetails?.Properties[0])}
              />
               {/* <span style={{ display: "inline-flex", width: "fit-content"}}> */}
              <Row
                className="border-none"
                labelStyle={isMobile ? { width: "40%" } : {}}
                textStyle={{ wordBreak: "break-word" }}
                label={t(`PROPERTY_ADDRESS`)}
                text={propertyAddress}
                privacy={{ 
                  uuid:propertyDetails?.Properties[0]?.propertyId, 
                  fieldName: ["doorNo","street","landmark"], 
                  model: "Property" }}
              />
            </div>
          </StatusTable>
            <Link to={`/digit-ui/employee/commonpt/view-property?propertyId=${propertyId}&tenantId=${tenantId}&from=${window.location.pathname?.includes("employee/ws/new-application") ? "ES_COMMON_WS_NEW_CONNECTION" : window.location.pathname?.includes("employee/ws/modify-application") ?"WS_MODIFY_CONNECTION_BUTTON": window.location.pathname?.includes("employee/tl/new-application")
        ?"ES_TITLE_NEW_TRADE_LICESE_APPLICATION"
        :"WF_EMPLOYEE_NEWTL_RENEWAL_SUBMIT_BUTTON"}`}>
            <LinkButton label={t("CPT_COMPLETE_PROPERTY_DETAILS")} style={{ color: "#f47738", textAlign: "Left" }} />
          </Link>
        </React.Fragment>
      ) : null}
      {showToast && (
        <Toast
          isDleteBtn={true}
          labelstyle={{ width: "100%" }}
          error={showToast.error}
          warning={showToast.warning}
          label={t(showToast.label)}
          onClose={() => {
            setShowToast(null);
          }}
        />
      )}
      </div>}
    </React.Fragment>
  );
};

export default PropertySearchNSummary;
