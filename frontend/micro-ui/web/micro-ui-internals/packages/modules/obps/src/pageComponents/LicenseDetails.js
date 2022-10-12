import { BackButton, Card, CardLabel, FormStep, Loader, MobileNumber, RadioButtons, RadioOrSelect, TextInput, TextArea, CheckBox, DatePicker } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { Form, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Timeline from "../components/Timeline";
// import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
import { convertEpochToDate } from "../utils/index";
import axios from "axios";
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
  const [dob, setDOB] = useState(formData?.LicneseDetails?.dob || formData?.formData?.LicneseDetails?.dob || "");
  const [PanNumber, setPanNumber] = useState(
    formData?.LicneseDetails?.PanNumber || formData?.formData?.LicneseDetails?.PanNumber || ""
  );
  const [PermanentAddress, setPermanentAddress] = useState(formData?.LicneseDetails?.PermanentAddress || formData?.formData?.LicneseDetails?.PermanentAddress);
  const [houseNumber, setHouseNumber] = useState(formData?.LicneseDetails?.houseNumber || formData?.formData?.LicneseDetails?.houseNumber || "");
  const [colonyName, setColonyName] = useState(formData?.LicneseDetails?.colonyName || formData?.formData?.LicneseDetails?.colonyName || "");
  const [streetName, setStreetName] = useState(formData?.LicneseDetails?.streetName || formData?.formData?.LicneseDetails?.streetName || "");
  const [locality, setLocality] = useState(formData?.LicneseDetails?.locality || formData?.formData?.LicneseDetails?.locality || "");
  const [city, setCity] = useState(formData?.LicneseDetails?.city || formData?.formData?.LicneseDetails?.city || "");
  const [pincode, setPincode] = useState(formData?.LicneseDetails?.pincode || formData?.formData?.LicneseDetails?.pincode || "");

  const [Correspondenceaddress, setCorrespondenceaddress] = useState(formData?.Correspondenceaddress || formData?.formData?.Correspondenceaddress || "");
  const [houseNumberCorrespondesnce, sethouseNumberCorrespondesnce] = useState(formData?.houseNumberCorrespondesnce || formData?.formData?.houseNumberCorrespondesnce || "");
  const [colonyNameCorrespondesnce, setColonyNameCorrespondesnce] = useState(formData?.colonyNameCorrespondesnce || formData?.formData?.colonyNameCorrespondesnce || "");
  const [streetNameCorrespondesnce, setStreetNameCorrespondesnce] = useState(formData?.streetNameCorrespondesnce || formData?.formData?.streetNameCorrespondesnce || "");
  const [localityCorrespondence, setLocalityCorrespondence] = useState(formData?.localityCorrespondence || formData?.formData?.localityCorrespondence || "");
  const [cityCorrespondence, setCityCorrespondence] = useState(formData?.cityCorrespondence || formData?.formData?.cityCorrespondence || "");
  const [pincodeCorrespondence, setPincodeCorrespondence] = useState(formData?.pincodeCorrespondence || formData?.formData?.pincodeCorrespondence || "");
  const [isAddressSame, setisAddressSame] = useState(formData?.isAddressSame || formData?.formData?.isAddressSame || false);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const inputs = [
    {
      label: "HR_BIRTH_DATE_LABEL",
      type: "date",
      name: "dob",
      validation: {
        isRequired: false,
        title: t("CORE_COMMON_APPLICANT_NAME_INVALID"),
      },
      isMandatory: false,
    },
  ];
  function setValue(value, input) {
    // onSelect(config.key, { ...formData[config.key], [input]: value });
    setDOB(config.key, { ...formData[config.key], [input]: value });
  }
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
  const panVerification = async () => {
    try {
      const panVal =  {
        "txnId": "f7f1469c-29b0-4325-9dfc-c567200a70f7",
        "format": "xml",
        "certificateParameters": {
          "panno": PanNumber,
          "PANFullName": name,
          "FullName": name,
          "DOB": dob,
          "GENDER": gender.value
        },
        "consentArtifact": {
          "consent": {
            "consentId": "ea9c43aa-7f5a-4bf3-a0be-e1caa24737ba",
            "timestamp": "2022-10-08T06:21:51.321Z",
            "dataConsumer": {
              "id": "string"
            },
            "dataProvider": {
              "id": "string"
            },
            "purpose": {
              "description": "string"
            },
            "user": {
              "idType": "string",
              "idNumber": "string",
              "mobile": "8126287097",
              "email": "sudeeptamta3@gmail.com"
            },
            "data": {
              "id": "string"
            },
            "permission": {
              "access": "string",
              "dateRange": {
                "from": "2022-10-08T06:21:51.321Z",
                "to": "2022-10-08T06:21:51.321Z"
              },
              "frequency": {
                "unit": "string",
                "value": 0,
                "repeats": 0
              }
            }
          },
          "signature": {
            "signature": "string"
          }
        }
      }
      const panResp = await axios.post(`/certificate/v3/pan/pancr`,panVal, {headers:{
        'Content-Type': 'application/json',
        'X-APISETU-APIKEY':'PDSHazinoV47E18bhNuBVCSEm90pYjEF',
        'X-APISETU-CLIENTID':'in.gov.tcpharyana',
        'Access-Control-Allow-Origin':"*",
      }}) 
      console.log("PANDET",panResp.data);
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    if(PanNumber.length === 10){
      panVerification();
    }
  }, [PanNumber])
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
  function setDateofBirth(e) {
    setDOB(e.target.value);
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
  function selectColonyName(e) {
    setColonyName(e.target.value);
  }
  function selectStreetName(e) {
    setStreetName(e.target.value);
  }
  function selectLocality(e) {
    setLocality(e.target.value);
  }
  function selectCity(e) {
    setCity(e.target.value);
  }
  function selectPincode(e) {
    setPincode(e.target.value);
  }
  function selectChecked(e) {
    if (isAddressSame == false) {
      setisAddressSame(true);
      setCorrespondenceaddress(formData?.LicneseDetails?.PermanentAddress ? formData?.LicneseDetails?.PermanentAddress : formData?.formData?.LicneseDetails?.PermanentAddress);
      sethouseNumberCorrespondesnce(formData?.LicneseDetails?.houseNumber || formData?.formData?.LicneseDetails?.houseNumber);
      setColonyNameCorrespondesnce(formData?.LicneseDetails?.colonyName ? formData?.LicneseDetails?.colonyName : formData?.formData?.LicneseDetails?.colonyName);
      setStreetNameCorrespondesnce(formData?.LicneseDetails?.streetName ? formData?.LicneseDetails?.streetName : formData?.formData?.LicneseDetails?.streetName);
      setLocalityCorrespondence(formData?.LicneseDetails?.locality ? formData?.LicneseDetails?.locality : formData?.formData?.LicneseDetails?.locality);
      setCityCorrespondence(formData?.LicneseDetails?.city ? formData?.LicneseDetails?.city : formData?.formData?.LicneseDetails?.city);
      setPincodeCorrespondence(formData?.LicneseDetails?.pincode ? formData?.LicneseDetails?.pincode : formData?.formData?.LicneseDetails?.pincode);
    }
    else {
      Array.from(document.querySelectorAll("input")).forEach((input) => (input.value = ""));
      setisAddressSame(false);
      setCorrespondenceaddress("");
      sethouseNumberCorrespondesnce("");
      setColonyNameCorrespondesnce("");
      setStreetNameCorrespondesnce("");
      setLocalityCorrespondence("");
      setCityCorrespondence("");
      setPincodeCorrespondence("");
    }
  }
  function selectCorrespondenceaddress(e) {
    setCorrespondenceaddress(e.target.value);
  }
  function selecthouseNumberCorrespondenceaddress(e) {
    sethouseNumberCorrespondesnce(e.target.value);
  }
  function selectColonyNameCorrespondesnce(e) {
    setColonyNameCorrespondesnce(e.target.value);
  }
  function selectStreetNameCorrespondesnce(e) {
    setStreetNameCorrespondesnce(e.target.value);
  }
  function selectLocalityCorrespondence(e) {
    setLocalityCorrespondence(e.target.value);
  }
  function selectCityCorrespondence(e) {
    setCityCorrespondence(e.target.value);
  }
  function selectPincodeCorrespondence(e) {
    setPincodeCorrespondence(e.target.value);
  }
  
  const goNext = () => {

    if (!(formData?.result && formData?.result?.Licenses[0]?.id)) {
      let licenseDet = {
        name: name,
        mobileNumber: mobileNumber,
        gender: gender,
        email: email, 
        dob:dob,
        PanNumber: PanNumber,
        houseNumber: houseNumber,
        colonyName: colonyName,
        streetName: streetName,
        locality: locality,
        city:city,
        pincode: pincode,
        houseNumberCorrespondesnce: houseNumberCorrespondesnce,
        colonyNameCorrespondesnce: colonyNameCorrespondesnce,
        streetNameCorrespondesnce: streetNameCorrespondesnce,
        localityCorrespondence: localityCorrespondence,
        cityCorrespondence: cityCorrespondence,
        pincodeCorrespondence: pincodeCorrespondence
        }
      onSelect(config.key, licenseDet);
      console.log("DATALICDET",licenseDet);
      localStorage.setItem("licenceDetails",JSON.stringify(licenseDet));
      Digit.OBPSService.BPAREGCreate(licenseDet, tenantId)
        .then((result, err) => {
          setIsDisableForNext(false);
          let data = { 
            result: result, 
            formData: formData, 
            Correspondenceaddress: Correspondenceaddress,
            houseNumberCorrespondesnce: houseNumberCorrespondesnce,
            colonyNameCorrespondesnce: colonyNameCorrespondesnce,

            isAddressSame: isAddressSame }
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
      formData.houseNumberCorrespondesnce = houseNumberCorrespondesnce;
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
          <Card className="mb-3">
            {/* <h4></h4> */}
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
                  disabled="disabled"
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
              {inputs?.map((input, index) => (
              <Form.Group className="col-md-5">
              <CardLabel>{`${"Enter Date of Birth"}*`}</CardLabel>
                <DatePicker 
                  t={t}
                  type="date"
                  isMandatory={false}
                  optionKey="i18nKey"
                  value={dob}
                  name="dob"
                  onChange={setDateofBirth}
                />
                {/* <DatePicker
                key={input.name}
                date={formData && formData[config.key] ? formData[config.key][input.name] : undefined}
                onChange={(e) => setValue(e, input.name)}
                disable={false}
                max={convertEpochToDate(new Date().setFullYear(new Date().getFullYear() - 18))}
                defaultValue={undefined}
                {...input.validation}
              /> */}
              </Form.Group>
              )
              )}
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
          </Card>
          <Card className="mb-3">
            <h4 className="mb-2 fw-bold">Permanent Address</h4>
            <Row className="justify-content-between">
              {/* <Form.Group className="col-md-5">
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
              </Form.Group> */}
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
                  />
              </Form.Group>
              <Form.Group className="col-md-5">
                <CardLabel>{`${"Building/Colony Name"}`}</CardLabel>
                <TextInput
                  t={t}
                  type={"text"}
                  isMandatory={false}
                  optionKey="i18nKey"
                  name="colonyName"
                  value={colonyName}
                  onChange={selectColonyName}
                  />
              </Form.Group>
              <Form.Group className="col-md-5">
                <CardLabel>{`${"Street Name"}`}</CardLabel>
                <TextInput
                  t={t}
                  type={"text"}
                  isMandatory={false}
                  optionKey="i18nKey"
                  name="streetName"
                  value={streetName}
                  onChange={selectStreetName}
                  />
              </Form.Group>
              <Form.Group className="col-md-5">
                <CardLabel>{`${"Locality"}`}</CardLabel>
                <TextInput
                  t={t}
                  type={"text"}
                  isMandatory={false}
                  optionKey="i18nKey"
                  name="locality"
                  value={locality}
                  onChange={selectLocality}
                  />
              </Form.Group>
              <Form.Group className="col-md-5">
                <CardLabel>{`${"City"}`}</CardLabel>
                <TextInput
                  t={t}
                  type={"text"}
                  isMandatory={false}
                  optionKey="i18nKey"
                  name="city"
                  value={city}
                  onChange={selectCity}
                  />
              </Form.Group>
              <Form.Group className="col-md-5">
                <CardLabel>{`${"Pincode"}`}</CardLabel>
                <TextInput
                  t={t}
                  type={"text"}
                  isMandatory={false}
                  optionKey="i18nKey"
                  name="pincode"
                  value={pincode}
                  onChange={selectPincode}
                  />
              </Form.Group>
            </Row>
          </Card>
          <Card className="mb-3">
            <h4 className="mb-2 fw-bold">Correspondence Address</h4>
            <Row className="justify-content-between">
              <Form.Group className="col-md-12">
                <CheckBox
                  label={t("BPA_SAME_AS_PERMANENT_ADDRESS")}
                  onChange={(e) => selectChecked(e)}
                  //value={field.isPrimaryOwner}
                  checked={isAddressSame}
                  style={{ paddingBottom: "10px", paddingTop: "10px" }}
                  />
              </Form.Group> 
              {/* <Form.Group className="col-md-5">
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
              </Form.Group> */}
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
                  />
              </Form.Group>
              <Form.Group className="col-md-5">
                <CardLabel>{`${"Building/Colony Name"}`}</CardLabel>
                <TextInput
                  t={t}
                  type={"text"}
                  isMandatory={false}
                  optionKey="i18nKey"
                  name="colonyNameCorrespondesnce"
                  value={colonyNameCorrespondesnce}
                  onChange={selectColonyNameCorrespondesnce}
                  disable={isAddressSame}
                  />
              </Form.Group>
              <Form.Group className="col-md-5">
                <CardLabel>{`${"Street Name"}`}</CardLabel>
                <TextInput
                  t={t}
                  type={"text"}
                  isMandatory={false}
                  optionKey="i18nKey"
                  name="streetNameCorrespondesnce"
                  value={streetNameCorrespondesnce}
                  onChange={selectStreetNameCorrespondesnce}
                  disable={isAddressSame}
                  />
              </Form.Group>
              <Form.Group className="col-md-5">
                <CardLabel>{`${"Locality"}`}</CardLabel>
                <TextInput
                  t={t}
                  type={"text"}
                  isMandatory={false}
                  optionKey="i18nKey"
                  name="localityCorrespondence"
                  value={localityCorrespondence}
                  onChange={selectLocalityCorrespondence}
                  disable={isAddressSame}
                  />
              </Form.Group>
              <Form.Group className="col-md-5">
                <CardLabel>{`${"City"}`}</CardLabel>
                <TextInput
                  t={t}
                  type={"text"}
                  isMandatory={false}
                  optionKey="i18nKey"
                  name="cityCorrespondence"
                  value={cityCorrespondence}
                  onChange={selectCityCorrespondence}
                  disable={isAddressSame}
                  />
              </Form.Group>
              <Form.Group className="col-md-5">
                <CardLabel>{`${"Pincode"}`}</CardLabel>
                <TextInput
                  t={t}
                  type={"text"}
                  isMandatory={false}
                  optionKey="i18nKey"
                  name="pincodeCorrespondence"
                  value={pincodeCorrespondence}
                  onChange={selectPincodeCorrespondence}
                  disable={isAddressSame}
                  />
              </Form.Group>
            </Row>
          </Card>
        </FormStep> : <Loader /> }
      </div>
    </div>
  );
};

export default LicenseDetails;