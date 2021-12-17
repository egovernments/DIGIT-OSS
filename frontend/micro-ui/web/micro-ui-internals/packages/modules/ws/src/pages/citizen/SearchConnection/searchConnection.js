import React, { useState, useEffect } from "react";
import { FormComposer, CardLabelDesc, Loader, Menu } from "@egovernments/digit-ui-react-components";
import { FormStep, CardLabel, RadioButtons, RadioOrSelect, Localities } from "@egovernments/digit-ui-react-components";
import { TextInput, LabelFieldPair, Dropdown } from "@egovernments/digit-ui-react-components";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
//import useMCollectMDMS from "../../../../../../libraries/src/hooks/mcollect/useMCollectMDMS";
//import ServiceCategory from "../../../components/inbox/ServiceCategory";

const SearchConnection = ({ config: propsConfig, formData }) => {
  const { t } = useTranslation();
  let validation = {};
  const history = useHistory();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const logginedUser = Digit.UserService.getUser();
  console.log(logginedUser,"loo");
  const [mobileNumber, setMobileNumber] = useState(formData?.mobileNumber || "");
  const [consumerNumber, setconsumerNumber] = useState(formData?.consumerNumber || "");
  const [doorNumber, setdoorNumber] = useState(formData?.doorNumber || "");
  const [propertyId, setpropertyId] = useState(formData?.propertyId || "");
  const [consumerName, setconsumerName] = useState(formData?.consumerName || "");
  const [Servicecateogry, setServicecateogry] = useState(formData?.Servicecateogry || "");
  const [city, setcity] = useState(formData?.city || "");
  const [locality, setLocality] = useState(formData?.locality || "");
  const [searchType, setSearchType] = useState(formData?.searchType || "");
  const allCities = Digit.Hooks.ws.usewsTenants()?.sort((a, b) => a?.i18nKey?.localeCompare?.(b?.i18nKey));
  const [mobileNumberError, setmobileNumberError] = useState(null);
  // moduleCode, type, config = {}, payload = []

  const { data: Menu, isLoading } = Digit.Hooks.mcollect.useMCollectMDMS(tenantId, "BillingService", "BusinessService");
  if (isLoading) {
    return <Loader />;
  }
  const onConnectionSearch = async (data) => {
    //history.push(`/digit-ui/citizen/mcollect/search-results`);
    debugger;
    if (!mobileNumber && !challanNo && !Servicecateogry && !city) {
      return alert("Provide at least one parameter");
    } else if (!Servicecateogry) {
      return alert("Please Provide Service Category");
    } else if (!city.code)
    {
      return alert("Please Provide City");
    }
     else {
      history.push(
        `/digit-ui/citizen/ws/search-results?mobileNumber=${mobileNumber}&challanNo=${challanNo}&Servicecategory=${
          Servicecateogry ? Servicecateogry.code.split("_")[Servicecateogry.code.split("_").length - 1] : ""
        }&tenantId=${city.code}`
      );
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
//   Menu &&
//     Menu.map((searchcat) => {
//       if (searchcat.billGineiURL) {
//         SCMenu.push({ i18nKey: `${searchcat.i18nKey.toUpperCase().replaceAll(".", "_")}`, code: searchcat.i18nKey });
//       }
//     });

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

  function selectdoorNumber(e) {
    setdoorNumber(e.target.value);
  }

  function selectpropertyId(e) {
    setpropertyId(e.target.value);
  }

  function selectconsumerName(e) {
    setconsumerName(e.target.value);
  }

//   function setServicecateogryvalue(value) {
//     setServicecateogry(value);
//   }

  function selectCity(value) {
      console.log(value);
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
      {/* <FormComposer
        onSubmit={onChallanSearch}
        noBoxShadow
        inline
        submitInForm
        config={config}
        label={propsConfig.texts.submitButtonLabel}
        heading={propsConfig.texts.header}
        text={propsConfig.texts.text}
        cardStyle={{ margin: "auto" }}
        headingStyle={{ fontSize: "32px", marginBottom: "16px" }}
      > */}
      <FormStep
        config={propsConfig}
        label={propsConfig.texts.submitButtonLabel}
        heading={propsConfig.texts.header}
        text={propsConfig.texts.text}
        cardStyle={{ margin: "auto" }}
        headingStyle={{ fontSize: "32px", marginBottom: "16px" }}
        onSelect={onConnectionSearch}
        componentInFront={<div className="employee-card-input employee-card-input--front">+91</div>}
        isDisabled={!Servicecateogry || !city.code}
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
        <CardLabel>{`${t("UC_CITY_LABEL")}*`}</CardLabel>
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
        {city && !logginedUser && <CardLabel>{`${t("Locality")}*`}</CardLabel>}
        {city && !logginedUser && <Localities
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
        <CardLabel>{`${t("Consumer Mobile Number")}`}</CardLabel>
        <div className="field-container">
          <span className="employee-card-input employee-card-input--front" style={{ marginTop: "-1px" }}>
            +91
          </span>
          <TextInput
            type={"mobileNumber"}
            style={{background:"#FAFAFA"}}
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
        <CardLabel>{`${t("Consumer Number")}`}</CardLabel>
        <TextInput
          t={t}
          type={"any"}
          isMandatory={false}
          style={{background:"#FAFAFA"}}
          //optionKey="i18nKey"
          name="consumerNumber"
          value={consumerNumber}
          onChange={selectconsumerNumber}
        />
        <CardLabel style={{textAlign:"center",color:"#505A5F"}}>{`${t("(or)")}`}</CardLabel>
        <CardLabel>{`${t("Property ID")}`}</CardLabel>
        <TextInput
          t={t}
          type={"any"}
          isMandatory={false}
          style={{background:"#FAFAFA"}}
          //optionKey="i18nKey"
          name="propertyId"
          value={propertyId}
          onChange={selectpropertyId}
        />
        </div>}
        {searchType && searchType?.code == "CONNECTION_DETAILS" && <div style={{border:"solid",borderRadius:"5px",padding:"10px",paddingTop:"20px",marginTop:"10px",borderColor:"#f3f3f3",background:"#FAFAFA",marginBottom:"20px"}} >
        <CardLabel>{`${t("Door Number")}`}</CardLabel>
        <TextInput
          t={t}
          type={"any"}
          isMandatory={false}
          style={{background:"#FAFAFA"}}
          //optionKey="i18nKey"
          name="doorNumber"
          value={doorNumber}
          onChange={selectdoorNumber}
        />
        <CardLabel>{`${t("Consumer Name")}`}</CardLabel>
        <TextInput
          t={t}
          type={"any"}
          isMandatory={false}
          style={{background:"#FAFAFA"}}
          //optionKey="i18nKey"
          name="consumerName"
          value={consumerName}
          onChange={selectconsumerName}
        />
        </div>}
      </FormStep>
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
