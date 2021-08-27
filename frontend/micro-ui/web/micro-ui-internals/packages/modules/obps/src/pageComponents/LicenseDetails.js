import React, { useEffect, useState } from "react";
import { FormStep, TextInput, CardLabel, RadioButtons, LabelFieldPair, Dropdown, Menu, MobileNumber, Card } from "@egovernments/digit-ui-react-components";
import { useLocation, useRouteMatch } from "react-router-dom";

const LicenseDetails = ({ t, config, onSelect, userType, formData, ownerIndex }) => {
  const { pathname: url } = useLocation();
  const userInfo = Digit.UserService.getUser();
  let validation = {};
  const [name, setName] = useState(userInfo?.info?.name || formData?.LicneseDetails?.name || "");
  const [email, setEmail] = useState( formData?.LicneseDetails?.emailId || "");
  const [gender, setGender] = useState(formData?.LicneseDetails?.gender);
  const [mobileNumber, setMobileNumber] = useState(userInfo?.info?.mobileNumber || 
    formData?.LicneseDetails?.mobileNumber || ""
  );
  const [PanNumber, setPanNumber] = useState(
    formData?.LicneseDetails?.PanNumber || ""
  );
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];

  const { data: genderTypeData } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["GenderType"]);

  let menu = [];
  genderTypeData &&
  genderTypeData["common-masters"].GenderType.map((genderDetails) => {
      menu.push({ i18nKey: `COMMON_GENDER_${genderDetails.code}`, code: `${genderDetails.code}`, value: `${genderDetails.code}` });
    });

  function SelectName(e) {
    setName(e.target.value);
  }
  function selectEmail(e) {
    setEmail(e.target.value);
  }
  function setGenderName(value) {
    setGender(value);
  }

  function setMobileNo(e) {
    setMobileNumber(e.target.value);
  }
  function selectPanNumber(e) {
    setPanNumber(e.target.value);
  }


  const goNext = () => {
    let licenseDet = {name:name, mobileNumber:mobileNumber,gender:gender,email:email,PanNumber:PanNumber}
    onSelect(config.key,licenseDet);

  };

  const onSkip = () => onSelect();

  return (
    <FormStep
      config={config}
      onSelect={goNext}
      onSkip={onSkip}
      t={t}
      isDisabled={!name || !mobileNumber || !gender || !PanNumber}
    >
      <div>
        <CardLabel>{`${t("BPA_APPLICANT_NAME_LABEL")}`}</CardLabel>
        <TextInput
          t={t}
          type={"text"}
          isMandatory={false}
          optionKey="i18nKey"
          name="name"
          value={name}
          onChange={SelectName}
          disable={name?true:false}
          {...(validation = {
            isRequired: true,
            pattern: "^[a-zA-Z-.`' ]*$",
            type: "text",
            title: t("PT_NAME_ERROR_MESSAGE"),
          })}
        />
        <CardLabel>{`${t("BPA_APPLICANT_GENDER_LABEL")}`}</CardLabel>
        <RadioButtons
          t={t}
          options={menu}
          optionsKey="code"
          name="gender"
          value={gender}
          selectedOption={gender}
          onSelect={setGenderName}
          isDependent={true}
          labelKey="COMMON_GENDER"
          //disabled={isUpdateProperty || isEditProperty}
        />
        <CardLabel>{`${t("BPA_OWNER_MOBILE_NO_LABEL")}`}</CardLabel>
        <MobileNumber
          value={mobileNumber}
          name="mobileNumber"
          onChange={(value) => setMobileNo({ target: { value } })}
          disable={mobileNumber?true:false}
          {...{ required: true, pattern: "[6-9]{1}[0-9]{9}", type: "tel", title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID") }}
        />
        <CardLabel>{t("BPA_APPLICANT_EMAIL_LABEL")}</CardLabel>
        <TextInput
              t={t}
              type={"email"}
              isMandatory={false}
              optionKey="i18nKey"
              name="email"
              value={email}
              onChange={selectEmail}
              //disable={editScreen}
              {...{ required: true, pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$", type: "email", title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID") }}
            />
        <CardLabel>{`${t("BPA_APPLICANT_PAN_NO")}`}</CardLabel>
        <TextInput
          t={t}
          type={"text"}
          isMandatory={false}
          optionKey="i18nKey"
          name="PanNumber"
          value={PanNumber}
          onChange={selectPanNumber}
        />
      </div>
    </FormStep>
  );
};

export default LicenseDetails;