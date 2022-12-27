import { BackButton, CardLabel, FormStep, Loader, MobileNumber, RadioButtons, TextInput } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Timeline from "../components/Timeline";

const LicenseDetails = ({ t, config, onSelect, userType, formData, ownerIndex }) => {
  const { pathname: url } = useLocation();
  const userInfo = Digit.UserService.getUser();
  let validation = {};
  const tenantId = Digit.ULBService.getCurrentTenantId();
  let isOpenLinkFlow = window.location.href.includes("openlink");
  const uuid = userInfo?.info?.uuid;
      const {data: userDetails, isLoading:isUserLoading} = Digit.Hooks.useUserSearch(
        tenantId,
        { uuid: [uuid] },
        {},
        { enabled: uuid ? true : false }
      );
  const [name, setName] = useState((!isOpenLinkFlow ? userInfo?.info?.name: "") || formData?.LicneseDetails?.name || formData?.formData?.LicneseDetails?.name || "");
  const [email, setEmail] = useState((!isOpenLinkFlow ? userInfo?.info?.emailId: "") ||formData?.LicneseDetails?.email || formData?.formData?.LicneseDetails?.email || "");
  const [gender, setGender] = useState((!isOpenLinkFlow && userDetails ? {i18nKey: `COMMON_GENDER_${userDetails?.user?.[0]?.gender}`, code: userDetails?.user?.[0]?.gender, value: userDetails?.user?.[0]?.gender}: "") || formData?.LicneseDetails?.gender || formData?.formData?.LicneseDetails?.gender);
  const [mobileNumber, setMobileNumber] = useState((!isOpenLinkFlow ? userInfo?.info?.mobileNumber: "") ||
    formData?.LicneseDetails?.mobileNumber || formData?.formData?.LicneseDetails?.mobileNumber || ""
  );
  const [PanNumber, setPanNumber] = useState(
    formData?.LicneseDetails?.PanNumber || formData?.formData?.LicneseDetails?.PanNumber || ""
  );

  useEffect(() => {
    if(!gender?.code && userDetails?.user?.[0]?.gender && !isOpenLinkFlow){
      setGender({i18nKey: `COMMON_GENDER_${userDetails?.user?.[0]?.gender}`, code: userDetails?.user?.[0]?.gender, value: userDetails?.user?.[0]?.gender})
    }
  },[userDetails])
  const stateId = Digit.ULBService.getStateId();

  
  const isCitizenUrl = Digit.Utils.browser.isMobile() ? true : false;

  if(isOpenLinkFlow)  
    window.onunload = function () {
      sessionStorage.removeItem("Digit.BUILDING_PERMIT");
    }
  
  const { isLoading, data: genderTypeData } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["GenderType"]);

  let menu = [];
  genderTypeData &&
    genderTypeData["common-masters"].GenderType.filter(data => data.active).map((genderDetails) => {
      menu.push({ i18nKey: `COMMON_GENDER_${genderDetails.code}`, code: `${genderDetails.code}`, value: `${genderDetails.code}` });
    });

   if (isUserLoading) return <Loader />;

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

    if (!(formData?.result && formData?.result?.Licenses[0]?.id)) {
      let licenseDet = { name: name, mobileNumber: mobileNumber, gender: gender, email: email, PanNumber: PanNumber }
      onSelect(config.key, licenseDet);
    }
    else {
      let data = formData?.formData;
      data.LicneseDetails.name = name;
      data.LicneseDetails.mobileNumber = mobileNumber;
      data.LicneseDetails.gender = gender;
      data.LicneseDetails.email = email;
      data.LicneseDetails.PanNumber = PanNumber;
      onSelect("", formData)
    }

  };

  const onSkip = () => onSelect();

  return (
    <div>
      <div className={isOpenLinkFlow ? "OpenlinkContainer" : ""}>

        {isOpenLinkFlow && <BackButton style={{ border: "none" }}>{t("CS_COMMON_BACK")}</BackButton>}
        <Timeline currentStep={1} flow="STAKEHOLDER" />
        {!isLoading || !isUserLoading ? 
        <FormStep
          config={config}
          onSelect={goNext}
          onSkip={onSkip}
          t={t}
          isDisabled={!name || !mobileNumber || !gender}
        >
          <div>
            <CardLabel>{`${t("BPA_APPLICANT_NAME_LABEL")}*`}</CardLabel>
            <TextInput
              t={t}
              type={"text"}
              isMandatory={false}
              optionKey="i18nKey"
              name="name"
              value={name}
              onChange={SelectName}
              disable={name && !isOpenLinkFlow ? true : false}
              {...(validation = {
                isRequired: true,
                pattern: "^[a-zA-Z-.`' ]*$",
                type: "text",
                title: t("PT_NAME_ERROR_MESSAGE"),
              })}
            />
            <CardLabel>{`${t("BPA_APPLICANT_GENDER_LABEL")}*`}</CardLabel>
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
              disable={gender && !isOpenLinkFlow ? true : false}
            //disabled={isUpdateProperty || isEditProperty}
            />
            <CardLabel>{`${t("BPA_OWNER_MOBILE_NO_LABEL")}*`}</CardLabel>
            <MobileNumber
              value={mobileNumber}
              name="mobileNumber"
              onChange={(value) => setMobileNo({ target: { value } })}
              disable={mobileNumber && !isOpenLinkFlow ? true : false}
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
              disable={userInfo?.info?.emailId && !isOpenLinkFlow ? true : false}
              //disable={editScreen}
              {...{ required: true, pattern: "[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$", type: "email", title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID") }}
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
              {...{ required: true, pattern: "[A-Z]{5}[0-9]{4}[A-Z]{1}", title: t("BPA_INVALID_PAN_NO") }}
            />
          </div>
        </FormStep> : <Loader /> }
      </div>
    </div>
  );
};

export default LicenseDetails;