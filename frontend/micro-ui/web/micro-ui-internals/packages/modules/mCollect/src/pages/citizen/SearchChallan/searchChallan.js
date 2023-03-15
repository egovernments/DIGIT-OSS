import React, { useState, useEffect } from "react";
import { FormComposer, CardLabelDesc, Loader, Menu } from "@egovernments/digit-ui-react-components";
import { FormStep, CardLabel, RadioButtons, RadioOrSelect } from "@egovernments/digit-ui-react-components";
import { TextInput, LabelFieldPair, Dropdown } from "@egovernments/digit-ui-react-components";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useMCollectMDMS from "../../../../../../libraries/src/hooks/mcollect/useMCollectMDMS";
import ServiceCategory from "../../../components/inbox/ServiceCategory";

const SearchChallan = ({ config: propsConfig, formData }) => {
  const { t } = useTranslation();
  let validation = {};
  const history = useHistory();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const [mobileNumber, setMobileNumber] = useState(formData?.mobileNumber || "");
  const [challanNo, setchallanNumber] = useState(formData?.challanNo || "");
  const [Servicecateogry, setServicecateogry] = useState(formData?.Servicecateogry || "");
  const [city, setcity] = useState(formData?.city || "");
  const allCities = Digit.Hooks.mcollect.usemcollectTenants()?.sort((a, b) => a?.i18nKey?.localeCompare?.(b?.i18nKey));
  const [mobileNumberError, setmobileNumberError] = useState(null);
  // moduleCode, type, config = {}, payload = []

  const { data: Menu, isLoading } = Digit.Hooks.mcollect.useMCollectMDMS(tenantId, "BillingService", "BusinessService");
  if (isLoading) {
    return <Loader />;
  }
  const onChallanSearch = async (data) => {
    //history.push(`/digit-ui/citizen/mcollect/search-results`);
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
        `/digit-ui/citizen/mcollect/search-results?mobileNumber=${mobileNumber}&challanNo=${challanNo}&Servicecategory=${
          Servicecateogry ? Servicecateogry.code.replace("BILLINGSERVICE_BUSINESSSERVICE_","") : ""
        }&tenantId=${city.code}`
      );
    }
  };
  let SCMenu = [];
  Menu &&
    Menu.map((searchcat) => {
      if (searchcat.billGineiURL) {
        SCMenu.push({ i18nKey: `${searchcat.i18nKey.toUpperCase().replaceAll(".", "_")}`, code: searchcat.i18nKey });
      }
    });

  function setMobileNo(e) {
    setmobileNumberError(null)
    let validation = "^\\d{10}$";
    if(!e.target.value.match(validation))
    {
      setmobileNumberError("CORE_COMMON_PHONENO_INVALIDMSG");
    }
    setMobileNumber(e.target.value);
  }

  function setchallanNo(e) {
    setchallanNumber(e.target.value);
  }

  function setServicecateogryvalue(value) {
    setServicecateogry(value);
  }

  function selectCity(value) {
    setcity(value);
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
        cardStyle={{ margin: "auto",maxWidth:"960px" }}
        headingStyle={{ fontSize: "32px", marginBottom: "16px" }}
        onSelect={onChallanSearch}
        componentInFront={<div className="employee-card-input employee-card-input--front">+91</div>}
        isDisabled={!Servicecateogry || !city.code}
        forcedError={t(mobileNumberError)}
        //onSkip={onSkip}
        t={t}
      >
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
        <CardLabel>{`${t("UC_SERVICE_CATEGORY_LABEL")}*`}</CardLabel>
        {Menu && (
          <RadioOrSelect
            t={t}
            optionKey="i18nKey"
            name="Servicecategory"
            options={SCMenu}
            value={Servicecateogry}
            selectedOption={Servicecateogry}
            onSelect={setServicecateogryvalue}
            //labelKey="PT_RELATION"
            {...(validation = {
              isRequired: true,
              title: t("please enter service category"),
            })}
          />
        )}
        <CardLabel>{`${t("UC_SEARCH_MOBILE_NO_LABEL")}`}</CardLabel>
        <div className="field-container">
          <span className="employee-card-input employee-card-input--front" style={{ marginTop: "-1px" }}>
            +91
          </span>
          <TextInput
            type={"mobileNumber"}
            t={t}
            isMandatory={false}
            style={{maxWidth:"500px"}}
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
        <CardLabel>{`${t("UC_CHALLAN_NO")}`}</CardLabel>
        <TextInput
          t={t}
          type={"any"}
          isMandatory={false}
          optionKey="i18nKey"
          name="ChallanNo"
          value={challanNo}
          onChange={setchallanNo}
          /* {...(validation = {
            isRequired: true,
            //pattern: "^[a-zA-Z-.`' ]*$",
            type: "any",
            title: t("wrong Challan No."),
          })} */
        />
      </FormStep>
    </div>
  );
};

SearchChallan.propTypes = {
  loginParams: PropTypes.any,
};

SearchChallan.defaultProps = {
  loginParams: null,
};

export default SearchChallan;
