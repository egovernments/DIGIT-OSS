import React, { useState, useEffect } from "react";
import { FormComposer, CardLabelDesc, Loader, Menu, CardText } from "@egovernments/digit-ui-react-components";
import { FormStep, CardLabel, RadioButtons, RadioOrSelect, Localities, InfoBannerIcon } from "@egovernments/digit-ui-react-components";
import { TextInput, LabelFieldPair, Dropdown, Toast } from "@egovernments/digit-ui-react-components";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SearchConnection = ({ config: propsConfig, formData }) => {
  const { t } = useTranslation();
  let validation = {};
  const history = useHistory();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const logginedUser = Digit.UserService.getUser();
  const [mobileNumber, setMobileNumber] = useState(formData?.mobileNumber || "");
  const [consumerNumber, setconsumerNumber] = useState(formData?.consumerNumber || "");
  const [oldconsumerNumber, setoldconsumerNumber] = useState(formData?.oldconsumerNumber || "");
  const [doorNumber, setdoorNumber] = useState(formData?.doorNumber || "");
  const [propertyId, setpropertyId] = useState(formData?.propertyId || "");
  const [consumerName, setconsumerName] = useState(formData?.consumerName || "");
  const [Servicecateogry, setServicecateogry] = useState(formData?.Servicecateogry || "");
  const [city, setcity] = useState(formData?.city || "");
  const [showToast, setShowToast] = useState(null);
  const [locality, setLocality] = useState(formData?.locality || "");
  const [searchType, setSearchType] = useState(formData?.searchType || {code : "CONSUMER_NUMBER",i18nKey:"WS_CONSUMER_NUMBER_SEARCH"});
  const allCities = Digit.Hooks.ws.usewsTenants()?.sort((a, b) => a?.i18nKey?.localeCompare?.(b?.i18nKey));
  const [mobileNumberError, setmobileNumberError] = useState(null);
  let filters = {}

  const { data: Menu, isLoading } = Digit.Hooks.mcollect.useMCollectMDMS(tenantId, "BillingService", "BusinessService");

  const { data: ptSearchConfig, isLoading : isValidationLoading } = Digit.Hooks.pt.useMDMS(Digit.ULBService.getStateId(), "DIGIT-UI", "HelpText", {
    select: (data) => {
      return data?.["DIGIT-UI"]?.["HelpText"]?.[0]?.PT;
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  const onConnectionSearch = async (data) => {
    if(searchType.code === "CONSUMER_NUMBER")
    {
      if (!city.code)
      setShowToast({ key: true, label: "WS_PLEASE_PROVIDE_CITY" });
      // If search type is consumer no whey do we need locality check? It will always fail for open search
      // else if(logginedUser == null && !locality)
      // setShowToast({ key: true, label: "WS_PLEASE_PROVIDE_LOCALITY" });
      else if (!mobileNumber && !consumerNumber && !oldconsumerNumber && !propertyId) {
      setShowToast({ key: true, label: "WS_HOME_SEARCH_CONN_RESULTS_DESC" });
      }
      else {
        history.push(
          `/digit-ui/citizen/ws/search-results?mobileNumber=${mobileNumber}&consumerNumber=${consumerNumber}&oldconsumerNumber=${oldconsumerNumber}&propertyId=${propertyId}&tenantId=${city.code}&locality=${undefined}`
        );
      }
    }
    else
    {
      if (!city.code)
      setShowToast({ key: true, label: "WS_PLEASE_PROVIDE_CITY" });
      else if(logginedUser == null && !locality)
      setShowToast({ key: true, label: "WS_PLEASE_PROVIDE_LOCALITY" });
      else if(!doorNumber && !consumerName)
      setShowToast({ key: true, label: "WS_HOME_SEARCH_CONN_RESULTS_DESC" });
      else{
          if (locality !== "undefined") filters.locality = locality?.code;
          if (doorNumber) filters.doorNo = doorNumber;
          if (consumerName) filters.ownerName = consumerName;
          filters = {...filters , searchType:"CONNECTION"}
        const response = await Digit.WSService.search({tenantId : city?.code, filters: { ...filters }, businessService:"WS"})
        const SWresponse = await Digit.WSService.search({tenantId : city?.code, filters: { ...filters }, businessService:"SW"})
        let totalResponse = response?.TotalCount + SWresponse?.TotalCount;
        if(ptSearchConfig?.maxResultValidation && totalResponse > ptSearchConfig?.maxPropertyResult)
        setShowToast({ key: true, label: "Refine your search" });
        else
        history.push(
          `/digit-ui/citizen/ws/search-results?doorNumber=${doorNumber}&consumerName=${consumerName}&tenantId=${city.code}&locality=${locality.code}`
        );
        }
    } 
  };
  let SCMenu = [];
  let SearchTypes = [ 
      {
        code : "CONSUMER_NUMBER",
        i18nKey:"WS_CONSUMER_NUMBER_SEARCH"
      },
      {
        code : "CONNECTION_DETAILS",
        i18nKey:"WS_CONNECTION_DETAILS_SEARCH"
      }
    ];

  function setMobileNo(e) {
    setmobileNumberError(null)
    let validation = "^\\d{10}$";
    if(!e.target.value.match(validation))
    {
      setmobileNumberError("CORE_COMMON_PHONENO_INVALIDMSG");
    }
    setMobileNumber(e.target.value);
  }

  function selectconsumerNumber(e) {
    setconsumerNumber(e.target.value);
  }

  function selectoldconsumerNumber(e) {
    setoldconsumerNumber(e.target.value);
  }

  function selectdoorNumber(e) {
    setdoorNumber(e.target.value);
  }

  function selectpropertyId(e) {
    setpropertyId(e.target.value);
  }

  function selectconsumerName(e) {
    setconsumerName(e.target.value);
  }

  function selectCity(value) {
    setcity(value);
    setLocality("");
  }

  function selectLocality(value) {
    setLocality(value);
  }

  function selectSearchType(value) {
    setSearchType(value);
  }

  return (
    <div style={{ marginTop: "16px" }}>
      <FormStep
        config={propsConfig}
        label={propsConfig.texts.submitButtonLabel}
        heading={propsConfig.texts.header}
        text={propsConfig.texts.text}
        cardStyle={{ margin: "auto", maxWidth:"960px" }}
        headingStyle={{ fontSize: "32px", marginBottom: "16px" }}
        onSelect={onConnectionSearch}
        componentInFront={<div className="employee-card-input employee-card-input--front">+91</div>}
        isDisabled={false}
        forcedError={t(mobileNumberError)}
        //onSkip={onSkip}
        t={t}
      >
        <RadioOrSelect
             className="form-field"
             isMandatory={true}
              t={t}
              optionKey="code"
              name="SearchType"
              options={SearchTypes}
              value={searchType}
              selectedOption={searchType}
              onSelect={selectSearchType}
              {...(validation = {
                isRequired: true,
                title: t("WS_SEARCH_TYPE_MANDATORY"),
              })}
          />
        <CardLabel>{`${t("WS_PROP_DETAIL_CITY")}*`}</CardLabel>
        <RadioOrSelect
             className="form-field"
             isMandatory={true}
              t={t}
              optionKey="code"
              name="City"
              options={allCities}
              value={city}
              selectedOption={city}
              onSelect={selectCity}
              {...(validation = {
                isRequired: true,
                title: t("UC_CITY_MANDATORY"),
              })}
          />
        {city && searchType && searchType?.code == "CONNECTION_DETAILS"  && <CardLabel>{`${t("WS_PROP_DETAIL_LOCALITY_LABEL")}*`}</CardLabel>}
        {city && searchType && searchType?.code == "CONNECTION_DETAILS"  && <Localities
                selectLocality={selectLocality}
                tenantId={city?.code}
                boundaryType="revenue"
                keepNull={false}
                optionCardStyles={{ height: "600px", overflow: "auto", zIndex: "10" }}
                selected={locality}
                //disable={!city?.code}
                disableLoader={false}
              />}
        {searchType && searchType?.code == "CONSUMER_NUMBER" && <div style={{border:"solid",borderRadius:"5px",padding:"10px",paddingTop:"20px",marginTop:"10px",borderColor:"#f3f3f3",background:"#FAFAFA",marginBottom:"20px"}} >
        <CardText>{t("WS_SEARCH_TEXT")}</CardText>
        <CardLabel>{`${t("WS_CONSUMER_NUMBER_LABEL")}`}</CardLabel>
        <div className="field-container">
          <span className="employee-card-input employee-card-input--front" style={{ marginTop: "-1px" }}>
            +91
          </span>
          <TextInput
            type={"mobileNumber"}
            style={{background:"#FAFAFA",maxWidth:"500px"}}
            t={t}
            isMandatory={false}
            optionKey="i18nKey"
            name="mobileNumber"
            value={mobileNumber}
            onChange={setMobileNo}
            {...(validation = {
              isRequired: false,
              pattern: "[6-9]{1}[0-9]{9}",
              type: "tel",
              title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID"),
            })}
          />
        </div>
        <CardLabel style={{textAlign:"center",color:"#505A5F"}}>{`${t("(or)")}`}</CardLabel>           
        <div className="tooltip">
        <div style={{display: "flex", gap: "0 4px"}}>
        <CardLabel>{`${t("WS_MYCONNECTIONS_CONSUMER_NO")}`}</CardLabel>
        <InfoBannerIcon fill="#0b0c0c" />
        <span className="tooltiptext" style={{ position:"absolute",width:"70%", marginLeft:"50%", fontSize:"medium" }}>
        {t("WS_CONSUMER_NO_DESCRIPTION") + " " + t("WS_CONSUMER_NO_FORMAT")}
        </span>
        </div>
        </div>
        <TextInput
          t={t}
          type={"any"}
          isMandatory={false}
          style={{background:"#FAFAFA"}}
          name="consumerNumber"
          value={consumerNumber}
          onChange={selectconsumerNumber}
          {...(validation = {
            isRequired: false,
            pattern: "[A-Za-z]{2}\/[0-9]{3,4}\/[0-9]{4}\-[0-9]{2}\/[0-9]{6}",
            type: "text",
            title: t("ERR_INVALID_CONSUMER_NO"),
          })}
        />
        {<CardLabel style={{textAlign:"center",color:"#505A5F"}}>{`${t("(or)")}`}</CardLabel>}
        {
        <div className="tooltip">
        <div style={{display: "flex", gap: "0 4px"}}>
        <CardLabel>{`${t("WS_SEARCH_CONNNECTION_OLD_CONSUMER_LABEL")}`}</CardLabel>
        <InfoBannerIcon fill="#0b0c0c" />
        <span className="tooltiptext" style={{ position:"absolute",width:"55%", marginLeft:"50%", fontSize:"medium" }}>
        {t("WS_CONSUMER_NO_DESCRIPTION") + " " + t("WS_CONSUMER_NO_FORMAT")}
        </span>
        </div>
        </div>}
        {<TextInput
          t={t}
          type={"any"}
          isMandatory={false}
          style={{background:"#FAFAFA"}}
          //optionKey="i18nKey"
          name="oldconsumerNumber"
          value={oldconsumerNumber}
          onChange={selectoldconsumerNumber}
          {...(validation = {
            isRequired: false,
            pattern: "[A-Za-z]{2}\/[0-9]{3}\/[0-9]{4}\-[0-9]{2}\/[0-9]{6}",
            type: "text",
            title: t("ERR_INVALID_CONSUMER_NO"),
          })}
        />}
        <CardLabel style={{textAlign:"center",color:"#505A5F"}}>{`${t("(or)")}`}</CardLabel>
        <CardLabel>{`${t("WS_PROPERTY_ID_LABEL")}`}</CardLabel>
        <TextInput
          t={t}
          type={"any"}
          isMandatory={false}
          style={{background:"#FAFAFA"}}
          //optionKey="i18nKey"
          name="propertyId"
          value={propertyId}
          onChange={selectpropertyId}
          {...(validation = {
            isRequired: false,
            pattern: "[A-Za-z]{2}\-[A-Za-z]{2}\-[0-9]{4}\-[0-9]{2}\-[0-9]{2}\-[0-9]{6}",
            type: "text",
            title: t("ERR_INVALID_PROPERTY_ID"),
          })}
        />
        </div>}
        {searchType && searchType?.code == "CONNECTION_DETAILS" && <div style={{border:"solid",borderRadius:"5px",padding:"10px",paddingTop:"20px",marginTop:"10px",borderColor:"#f3f3f3",background:"#FAFAFA",marginBottom:"20px"}} >
        <CardText>{t("WS_SEARCH_TEXT")}</CardText>
        <CardLabel>{`${t("WS_DOOR_NO_LABEL")}`}</CardLabel>
        <TextInput
          t={t}
          type={"any"}
          isMandatory={false}
          style={{background:"#FAFAFA"}}
          name="doorNumber"
          value={doorNumber}
          onChange={selectdoorNumber}
          {...(validation = {
            isRequired: false,
            pattern: "^([1-9][0-9]*)$",
            type: "text",
            title: t("ERR_INVALID_DOOR_NO"),
          })}
        />
        <CardLabel>{`${t("WS_CONSUMER_NAME_LABEL")}`}</CardLabel>
        <TextInput
          t={t}
          type={"any"}
          isMandatory={false}
          style={{background:"#FAFAFA"}}
          name="consumerName"
          value={consumerName}
          onChange={selectconsumerName}
        />
        </div>}
      </FormStep>
      {showToast && (
        <Toast
          isDleteBtn={true}
          error={showToast.key}
          label={t(showToast.label)}
          onClose={() => {
            setShowToast(null);
          }}
        />
      )}
    </div>
  );
};

SearchConnection.propTypes = {
  loginParams: PropTypes.any,
};

SearchConnection.defaultProps = {
  loginParams: null,
};

export default SearchConnection;
