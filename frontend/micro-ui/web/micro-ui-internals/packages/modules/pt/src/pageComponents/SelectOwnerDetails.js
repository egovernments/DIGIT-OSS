import React, { useEffect, useState } from "react";
import { FormStep, TextInput, CardLabel, RadioButtons, LabelFieldPair, Dropdown, Menu, MobileNumber } from "@egovernments/digit-ui-react-components";
import { cardBodyStyle } from "../utils";
import { useLocation, useRouteMatch } from "react-router-dom";
import Timeline from "../components/TLTimeline";

const SelectOwnerDetails = ({ t, config, onSelect, userType, formData, ownerIndex }) => {
  const { pathname: url } = useLocation();
  const editScreen = url.includes("/modify-application/");
  const mutationScreen = url.includes("/property-mutation/");

  let index = mutationScreen ? ownerIndex : window.location.href.charAt(window.location.href.length - 1);
  let validation = {};
  const [name, setName] = useState((formData.owners && formData.owners[index] && formData.owners[index].name) || formData?.owners?.name || "");
  const [email, setEmail] = useState((formData.owners && formData.owners[index] && formData.owners[index].email) || formData?.owners?.emailId || "");
  const [gender, setGender] = useState((formData.owners && formData.owners[index] && formData.owners[index].gender) || formData?.owners?.gender);
  const [mobileNumber, setMobileNumber] = useState(
    (formData.owners && formData.owners[index] && formData.owners[index].mobileNumber) || formData?.owners?.mobileNumber || ""
  );
  const [fatherOrHusbandName, setFatherOrHusbandName] = useState(
    (formData.owners && formData.owners[index] && formData.owners[index].fatherOrHusbandName) || formData?.owners?.fatherOrHusbandName || ""
  );
  const [relationship, setRelationship] = useState(
    (formData.owners && formData.owners[index] && formData.owners[index].relationship) || formData?.owners?.relationship || {}
  );
  const isUpdateProperty = formData?.isUpdateProperty || false;
  let isEditProperty = formData?.isEditProperty || false;

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();

  const { data: Menu } = Digit.Hooks.pt.useGenderMDMS(stateId, "common-masters", "GenderType");

  let menu = [];
  Menu &&
    Menu.map((genderDetails) => {
      menu.push({ i18nKey: `PT_COMMON_GENDER_${genderDetails.code}`, code: `${genderDetails.code}`, value: `${genderDetails.code}` });
    });

  function setOwnerName(e) {
    setName(e.target.value);
  }
  function setOwnerEmail(e) {
    setEmail(e.target.value);
  }
  function setGenderName(value) {
    setGender(value);
  }

  function setMobileNo(e) {
    setMobileNumber(e.target.value);
  }
  function setGuardiansName(e) {
    setFatherOrHusbandName(e.target.value);
  }
  function setGuardianName(value) {
    setRelationship(value);
  }

  const goNext = () => {
    let owner = formData.owners && formData.owners[index];
    let ownerStep;
    if (userType === "employee") {
      ownerStep = { ...owner, name, gender, mobileNumber, fatherOrHusbandName, relationship, emailId: email };
      onSelect(config.key, { ...formData[config.key], ...ownerStep }, false, index);
    } else {
      if (mutationScreen) {
        ownerStep = { ...owner, name, gender, mobileNumber, fatherOrHusbandName, relationship };
        onSelect("", ownerStep);
        return;
      }
      ownerStep = { ...owner, name, gender, mobileNumber, fatherOrHusbandName, relationship };
      onSelect(config.key, ownerStep, false, index);
    }
  };

  const onSkip = () => onSelect();
  // As Ticket RAIN-2619 other option in gender and gaurdian will be enhance , dont uncomment it
  const options = [
    { name: "Female", value: "FEMALE", code: "FEMALE" },
    { name: "Male", value: "MALE", code: "MALE" },
    { name: "Transgender", value: "TRANSGENDER", code: "TRANSGENDER" },
    { name: "OTHERS", value: "OTHERS", code: "OTHERS" },
    // { name: "Other", value: "OTHER", code: "OTHER" },
  ];

  const GuardianOptions = [
    { name: "HUSBAND", code: "HUSBAND", i18nKey: "PT_RELATION_HUSBAND" },
    { name: "Father", code: "FATHER", i18nKey: "PT_RELATION_FATHER" },
    // { name: "Husband/Wife", code: "HUSBANDWIFE", i18nKey: "PT_RELATION_HUSBANDWIFE" },
    // { name: "Other", code: "OTHER", i18nKey: "PT_RELATION_OTHER" },
  ];

  useEffect(() => {
    if (userType === "employee") {
      goNext();
    }
  }, [name, gender, mobileNumber, fatherOrHusbandName, relationship]);

  if (userType === "employee") {
    return (
      <div>
        <LabelFieldPair>
          <CardLabel style={editScreen ? { color: "#B1B4B6" } : {}}>{`${t("PT_FORM3_MOBILE_NUMBER")}`}</CardLabel>
          <div className="field">
            <TextInput
              type={"text"}
              t={t}
              isMandatory={false}
              name="mobileNumber"
              value={mobileNumber}
              onChange={setMobileNo}
              ValidationRequired = {true}
              {...(validation = {
                isRequired: true,
                pattern: "[6-9]{1}[0-9]{9}",
                type: "tel",
                title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID"),
              })}
              disable={editScreen}
            />
          </div>
        </LabelFieldPair>
        <LabelFieldPair>
          <CardLabel style={editScreen ? { color: "#B1B4B6" } : {}}>{`${t("PT_OWNER_NAME")}`}</CardLabel>
          <div className="field">
            <TextInput
              t={t}
              type={"text"}
              isMandatory={false}
              name="name"
              value={name}
              onChange={setOwnerName}
              ValidationRequired = {true}
              {...(validation = {
                isRequired: true,
                pattern: "^[a-zA-Z-.`' ]*$",
                type: "tel",
                title: t("PT_NAME_ERROR_MESSAGE"),
              })}
              disable={editScreen}
            />
          </div>
        </LabelFieldPair>
        <LabelFieldPair>
          <CardLabel style={editScreen ? { color: "#B1B4B6" } : {}}>{`${t("PT_FORM3_GUARDIAN_NAME")}`}</CardLabel>
          <div className="field">
            <TextInput
              t={t}
              type={"text"}
              isMandatory={false}
              name="fatherOrHusbandName"
              value={fatherOrHusbandName}
              onChange={setGuardiansName}
              ValidationRequired = {true}
              {...(validation = {
                pattern: "^[a-zA-Z-.`' ]*$",
                title: t("PT_NAME_ERROR_MESSAGE"),
              })}
              disable={editScreen}
            />
          </div>
        </LabelFieldPair>
        <LabelFieldPair>
          <CardLabel style={editScreen ? { color: "#B1B4B6" } : {}}>{`${t("PT_FORM3_RELATIONSHIP")}`}</CardLabel>
          <Dropdown
            className="form-field"
            selected={relationship?.length === 1 ? relationship[0] : relationship}
            disable={relationship?.length === 1 || editScreen}
            option={GuardianOptions}
            select={setGuardianName}
            optionKey="i18nKey"
            t={t}
            name="relationship"
          />
        </LabelFieldPair>
        <LabelFieldPair>
          <CardLabel style={editScreen ? { color: "#B1B4B6" } : {}}>{`${t("PT_FORM3_GENDER")}`}</CardLabel>
          <Dropdown
            className="form-field"
            selected={gender?.length === 1 ? gender[0] : gender}
            disable={gender?.length === 1 || editScreen}
            option={menu}
            select={setGenderName}
            optionKey="code"
            t={t}
            name="gender"
          />
        </LabelFieldPair>
        <LabelFieldPair>
          <CardLabel style={editScreen ? { color: "#B1B4B6" } : {}}>{`${t("PT_OWNER_EMAIL")}`}</CardLabel>
          <div className="field">
            <TextInput
              t={t}
              type={"email"}
              isMandatory={false}
              optionKey="i18nKey"
              name="email"
              value={email}
              onChange={setOwnerEmail}
              disable={editScreen}
            />
          </div>
        </LabelFieldPair>
      </div>
    );
  }

  return (
    <React.Fragment>
    {
      window.location.href.includes("/citizen") ?
        window.location.href.includes("/citizen/pt/property/property-mutation") ? 
          <Timeline currentStep={1} flow="PT_MUTATE" /> : <Timeline currentStep={2} />
    : null
    }

    <FormStep
      config={config}
      onSelect={goNext}
      onSkip={onSkip}
      t={t}
      isDisabled={!name || !mobileNumber || !gender || !relationship || !fatherOrHusbandName}
    >
      <div>
        <CardLabel>{`${t("PT_OWNER_NAME")}`}</CardLabel>
        <TextInput
          t={t}
          type={"text"}
          isMandatory={false}
          optionKey="i18nKey"
          name="name"
          value={name}
          onChange={setOwnerName}
          disable={isUpdateProperty || isEditProperty}
          ValidationRequired = {true}
          {...(validation = {
            isRequired: true,
            pattern: "^[a-zA-Z-.`' ]*$",
            type: "text",
            title: t("PT_NAME_ERROR_MESSAGE"),
          })}
        />
        <CardLabel>{`${t("PT_FORM3_GENDER")}`}</CardLabel>
        <RadioButtons
          t={t}
          options={menu}
          optionsKey="code"
          name="gender"
          value={gender}
          selectedOption={gender}
          onSelect={setGenderName}
          isDependent={true}
          labelKey="PT_COMMON_GENDER"
          disabled={isUpdateProperty || isEditProperty}
        />
        <CardLabel>{`${t("PT_FORM3_MOBILE_NUMBER")}`}</CardLabel>
        <MobileNumber
          value={mobileNumber}
          name="mobileNumber"
          onChange={(value) => setMobileNo({ target: { value } })}
          disable={isUpdateProperty || isEditProperty}
          {...{ required: true, pattern: "[6-9]{1}[0-9]{9}", type: "tel", title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID") }}
        />
        <CardLabel>{`${t("PT_FORM3_GUARDIAN_NAME")}`}</CardLabel>
        <TextInput
          t={t}
          type={"text"}
          isMandatory={false}
          optionKey="i18nKey"
          name="fatherOrHusbandName"
          value={fatherOrHusbandName}
          onChange={setGuardiansName}
          disable={isUpdateProperty || isEditProperty}
          ValidationRequired = {true}
          {...(validation = {
            isRequired: true,
            pattern: "^[a-zA-Z-.`' ]*$",
            type: "text",
            title: t("PT_NAME_ERROR_MESSAGE"),
          })}
        />
        <CardLabel>{`${t("PT_FORM3_RELATIONSHIP")}`}</CardLabel>
        <RadioButtons
          t={t}
          optionsKey="i18nKey"
          name="relationship"
          options={GuardianOptions}
          value={relationship}
          selectedOption={relationship}
          onSelect={setGuardianName}
          isDependent={true}
          labelKey="PT_RELATION"
          disabled={isUpdateProperty || isEditProperty}
        />
      </div>
    </FormStep>
    </React.Fragment>
  );
};

export default SelectOwnerDetails;
