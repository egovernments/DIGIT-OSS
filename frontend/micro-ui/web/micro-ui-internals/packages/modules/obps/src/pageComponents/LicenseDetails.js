import { BackButton, CardLabel, FormStep, Loader, MobileNumber, RadioButtons, TextInput, TextArea, CheckBox } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { Form, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Timeline from "../components/Timeline";

const LicenseDetails = ({ t, config, onSelect, userType, formData, ownerIndex }) => {
  const { pathname: url } = useLocation();
  const userInfo = Digit.UserService.getUser();
  let validation = {};
  let isOpenLinkFlow = window.location.href.includes("openlink");
  const [name, setName] = useState((!isOpenLinkFlow ? userInfo?.info?.name: "") || formData?.LicneseDetails?.name || formData?.formData?.LicneseDetails?.name || "");
  const [email, setEmail] = useState(formData?.LicneseDetails?.email || formData?.formData?.LicneseDetails?.email || "");
  const [gender, setGender] = useState(formData?.LicneseDetails?.gender || formData?.formData?.LicneseDetails?.gender);
  const [mobileNumber, setMobileNumber] = useState((!isOpenLinkFlow ? userInfo?.info?.mobileNumber: "") ||
    formData?.LicneseDetails?.mobileNumber || formData?.formData?.LicneseDetails?.mobileNumber || ""
  );
  const [PanNumber, setPanNumber] = useState(
    formData?.LicneseDetails?.PanNumber || formData?.formData?.LicneseDetails?.PanNumber || ""
  );
  const [PermanentAddress, setPermanentAddress] = useState(formData?.LicneseDetails?.PermanentAddress || formData?.formData?.LicneseDetails?.PermanentAddress);
  const [houseNumber, setHouseNumber] = useState(formData?.LicneseDetails?.houseNumber || formData?.formData?.LicneseDetails?.houseNumber);
  const [Correspondenceaddress, setCorrespondenceaddress] = useState(formData?.Correspondenceaddress || formData?.formData?.Correspondenceaddress || "");
  const [houseNumberCorrespondesnce, sethouseNumberCorrespondesnce] = useState(formData?.houseNumberCorrespondesnce || formData?.formData?.houseNumberCorrespondesnce || "");
  const [isAddressSame, setisAddressSame] = useState(formData?.isAddressSame || formData?.formData?.isAddressSame || false);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const tenantId = Digit.ULBService.getCurrentTenantId();
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

  // if (isLoading) return <Loader />;

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
  function selectPermanentAddress(e) {
    setPermanentAddress(e.target.value);
  }
  function selectHouseNumber(e) {
    setHouseNumber(e.target.value);
  }
  function selectChecked(e) {
    if (isAddressSame == false) {
      setisAddressSame(true);
      setCorrespondenceaddress(formData?.LicneseDetails?.PermanentAddress ? formData?.LicneseDetails?.PermanentAddress : formData?.formData?.LicneseDetails?.PermanentAddress);
      sethouseNumberCorrespondesnce(formData?.LicneseDetails?.houseNumber ? formData?.LicneseDetails?.houseNumber : formData?.formData?.LicneseDetails?.houseNumber);
    }
    else {
      Array.from(document.querySelectorAll("input")).forEach((input) => (input.value = ""));
      setisAddressSame(false);
      setCorrespondenceaddress("");
      sethouseNumberCorrespondesnce("");
    }
  }
  function selectCorrespondenceaddress(e) {
    setCorrespondenceaddress(e.target.value);
  }
  function selecthouseNumberCorrespondenceaddress(e) {
    sethouseNumberCorrespondesnce(e.target.value);
  }
  const goNext = () => {

    if (!(formData?.result && formData?.result?.Licenses[0]?.id)) {
      let licenseDet = { name: name, mobileNumber: mobileNumber, gender: gender, email: email, PanNumber: PanNumber }
      onSelect(config.key, licenseDet);
      Digit.OBPSService.BPAREGCreate(licenseDet, tenantId)
        .then((result, err) => {
          setIsDisableForNext(false);
          let data = { result: result, formData: formData, Correspondenceaddress: Correspondenceaddress, isAddressSame: isAddressSame }
          //1, units
          onSelect("", data, "", true);

        })
        .catch((e) => {
          setIsDisableForNext(false);
          setShowToast({ key: "error" });
          setError(e?.response?.data?.Errors[0]?.message || null);
        });
    }
    else {
      let data = formData?.formData;
      data.LicneseDetails.name = name;
      data.LicneseDetails.mobileNumber = mobileNumber;
      data.LicneseDetails.gender = gender;
      data.LicneseDetails.email = email;
      data.LicneseDetails.PanNumber = PanNumber;
      formData.Correspondenceaddress = Correspondenceaddress;
      formData.isAddressSame = isAddressSame;
      onSelect("", formData, "", true);
      // onSelect("", formData)
    }

  };

  const onSkip = () => onSelect();

  return (
    <div>
      <div className={isOpenLinkFlow ? "OpenlinkContainer" : ""}>

        {isOpenLinkFlow && <BackButton style={{ border: "none" }}>{t("CS_COMMON_BACK")}</BackButton>}
        <Timeline currentStep={1} flow="STAKEHOLDER" />
        {!isLoading ? 
        <FormStep
          config={config}
          onSelect={goNext}
          onSkip={onSkip}
          t={t}
          isDisabled={!name || !mobileNumber || !gender}
        >
          <Row className="justify-content-between">
            <Form.Group className="col-md-5">
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
            </Form.Group>
            <Form.Group className="col-md-5">
              <CardLabel>{`${t("BPA_APPLICANT_GENDER_LABEL")}*`}</CardLabel>
              <div className="row">
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
              </div>
            </Form.Group>
            <Form.Group className="col-md-5">
              <CardLabel>{`${t("BPA_OWNER_MOBILE_NO_LABEL")}*`}</CardLabel>
              <MobileNumber
                value={mobileNumber}
                name="mobileNumber"
                onChange={(value) => setMobileNo({ target: { value } })}
                disable={mobileNumber && !isOpenLinkFlow ? true : false}
                {...{ required: true, pattern: "[6-9]{1}[0-9]{9}", type: "tel", title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID") }}
              />
            </Form.Group>
            <Form.Group className="col-md-5">
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
                {...{ required: true, pattern: "[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$", type: "email", title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID") }}
              />
            </Form.Group>
            <Form.Group className="col-md-5">
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
            </Form.Group>
          </Row>
          <Row>
            <Form.Group className="col-md-5">
              <CardLabel>{`${t("BPA_PERMANANT_ADDRESS_LABEL")}*`}</CardLabel>
              <TextArea
                t={t}
                isMandatory={false}
                type={"text"}
                optionKey="i18nKey"
                name="PermanentAddress"
                onChange={selectPermanentAddress}
                value={PermanentAddress}
                />
            </Form.Group>
            <Form.Group className="col-md-5">
              <CardLabel>{`${"Door/House No."}`}</CardLabel>
              <TextInput
                t={t}
                type={"text"}
                isMandatory={false}
                optionKey="i18nKey"
                name="houseNumber"
                value={houseNumber}
                onChange={selectHouseNumber}
                {...{ required: true, pattern: "[A-Z]{5}[0-9]{4}[A-Z]{1}", title: "Invalid House no." }}
                />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group className="col-md-12">
              <CheckBox
                label={t("BPA_SAME_AS_PERMANENT_ADDRESS")}
                onChange={(e) => selectChecked(e)}
                //value={field.isPrimaryOwner}
                checked={isAddressSame}
                style={{ paddingBottom: "10px", paddingTop: "10px" }}
                />
            </Form.Group>
            <Form.Group className="col-md-5">
              <CardLabel>{`${t("BPA_APPLICANT_CORRESPONDENCE_ADDRESS_LABEL")}`}</CardLabel>
              <TextArea
                t={t}
                isMandatory={false}
                type={"text"}
                optionKey="i18nKey"
                name="Correspondenceaddress"
                onChange={selectCorrespondenceaddress}
                value={Correspondenceaddress}
                disable={isAddressSame}
                />
            </Form.Group>
            <Form.Group className="col-md-5">
              <CardLabel>{`${"Door/House No."}`}</CardLabel>
              <TextInput
                t={t}
                type={"text"}
                isMandatory={false}
                optionKey="i18nKey"
                name="houseNumberCorrespondesnce"
                value={houseNumberCorrespondesnce}
                onChange={selecthouseNumberCorrespondenceaddress}
                disable={isAddressSame}
                {...{ required: true, pattern: "[A-Z][0-9]", title: "Invalid House no." }}
                />
            </Form.Group>
          </Row>
        </FormStep> : <Loader /> }
      </div>
    </div>
  );
};

export default LicenseDetails;