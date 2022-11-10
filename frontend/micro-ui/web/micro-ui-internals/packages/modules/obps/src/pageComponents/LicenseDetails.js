import { BackButton, Card, CardLabel, CardLabelError, FormStep, Loader, Dropdown, MobileNumber, RadioButtons, RadioOrSelect, TextInput, TextArea, CheckBox, DatePicker } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { Form, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Timeline from "../components/Timeline";
import { convertEpochToDate } from "../utils/index";
import axios from "axios";
import { useForm } from "react-hook-form";
const LicenseDetails = ({ t, config, onSelect, userType, formData, ownerIndex }) => {

  const { pathname: url } = useLocation();
  const userInfo = Digit.UserService.getUser();
  const USERID = userInfo?.info?.id
  console.log("USERID",USERID)
  let validation = {};
  const devRegId = localStorage.getItem('devRegId');
  let isOpenLinkFlow = window.location.href.includes("openlink");
  // const [id,setId] = useState("")
  const [name, setName] = useState((!isOpenLinkFlow ? userInfo?.info?.name : "") || formData?.LicneseDetails?.name || formData?.formData?.LicneseDetails?.name || "");
  const [email, setEmail] = useState(formData?.LicneseDetails?.email || formData?.formData?.LicneseDetails?.email || "");
  const [gender, setGender] = useState(formData?.LicneseDetails?.gender || formData?.formData?.LicneseDetails?.gender);
  const [mobileNumber, setMobileNumber] = useState((!isOpenLinkFlow ? userInfo?.info?.mobileNumber : "") ||
    formData?.LicneseDetails?.mobileNumber || formData?.formData?.LicneseDetails?.mobileNumber || ""
  );
  const [dob, setDOB] = useState(formData?.LicneseDetails?.dob || formData?.formData?.LicneseDetails?.dob || "");
  const [PanNumber, setPanNumber] = useState(
    formData?.LicneseDetails?.PanNumber || formData?.formData?.LicneseDetails?.PanNumber || ""
  );
  const [PermanentAddress, setPermanentAddress] = useState(formData?.LicneseDetails?.PermanentAddress || formData?.formData?.LicneseDetails?.PermanentAddress);
  const [addressLineOne, setAddressLineOne] = useState(formData?.LicneseDetails?.addressLineOne || formData?.formData?.LicneseDetails?.addressLineOne || "");
  const [addressLineTwo, setAddressLineTwo] = useState(formData?.LicneseDetails?.addressLineTwo || formData?.formData?.LicneseDetails?.addressLineTwo || "");
  const [addressLineThree, setAddressLineThree] = useState(formData?.LicneseDetails?.addressLineThree || formData?.formData?.LicneseDetails?.addressLineThree || "");
  const [addressLineFour, setAddressLineFour] = useState(formData?.LicneseDetails?.addressLineFour || formData?.formData?.LicneseDetails?.addressLineFour || "");
  const [city, setCity] = useState(formData?.LicneseDetails?.city || formData?.formData?.LicneseDetails?.city || "");
  const [pincode, setPincode] = useState(formData?.LicneseDetails?.pincode || formData?.formData?.LicneseDetails?.pincode || "");
  const [addressSameAsPermanent, setSelectedChecked] = useState(formData?.LicenseDetails?.addressSameAsPermanent || formData?.LicenseDetails?.addressSameAsPermanent || "")
  const [Correspondenceaddress, setCorrespondenceaddress] = useState(formData?.Correspondenceaddress || formData?.formData?.Correspondenceaddress || "");
  const [addressLineOneCorrespondence, setAddressLineOneCorrespondence] = useState(formData?.addressLineOneCorrespondence || formData?.formData?.addressLineOneCorrespondence || "");
  const [addressLineTwoCorrespondence, setAddressLineTwoCorrespondence] = useState(formData?.addressLineTwoCorrespondence || formData?.formData?.addressLineTwoCorrespondence || "");
  const [addressLineThreeCorrespondence, setAddressLineThreeCorrespondence] = useState(formData?.addressLineThreeCorrespondence || formData?.formData?.addressLineThreeCorrespondence || "");
  const [addressLineFourCorrespondence, setAddressLineFourCorrespondence] = useState(formData?.addressLineFourCorrespondence || formData?.formData?.addressLineFourCorrespondence || "");
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
        isRequired: true,
        title: t("CORE_COMMON_APPLICANT_NAME_INVALID"),
      },
      isMandatory: false,
    },
  ];

  const [panValidation, setPanValidation] = useState("");
  const [PanValError, setPanValError] = useState("");
  // function setValue(value, input) {
  //   setDOB(config.key, { ...formData[config.key], [input]: value });
  // }
  const isCitizenUrl = Digit.Utils.browser.isMobile() ? true : false;

  if (isOpenLinkFlow)
    window.onunload = function () {
      sessionStorage.removeItem("Digit.BUILDING_PERMIT");
    }

  const { isLoading, data: genderTypeData } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["GenderType"]);

  let menu = [];
  genderTypeData &&
    genderTypeData["common-masters"].GenderType.filter(data => data.active).map((genderDetails) => {
      menu.push({ i18nKey: `COMMON_GENDER_${genderDetails.code}`, code: `${genderDetails.code}`, value: `${genderDetails.code}` });
    });
  const editScreen = false;
  // if (isLoading) return <Loader />;
  const panVerification = async () => {
    try {
      const panVal = {
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
              "mobile": mobileNumber,
              "email": email
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
      const panResp = await axios.post(`/certificate/v3/pan/pancr`, panVal, {
        headers: {
          'Content-Type': 'application/json',
          'X-APISETU-APIKEY': 'PDSHazinoV47E18bhNuBVCSEm90pYjEF',
          'X-APISETU-CLIENTID': 'in.gov.tcpharyana',
          'Access-Control-Allow-Origin': "*",
        }
      })
      // console.log("PANDET", panResp?.data);
    } catch (error) {
      console.log(error?.response?.data?.errorDescription);
      setPanValError(error?.response?.data?.errorDescription)
    }
  }
  // console.log(panValidation);
  useEffect(() => {
    if (PanNumber.length === 10) {
      panVerification();
    }
  }, [PanNumber]);

  const getDeveloperData = async () => {
    try {
      const requestResp = {

        "RequestInfo": {
          "api_id": "1",
          "ver": "1",
          "ts": "",
          "action": "_getDeveloperById",
          "did": "",
          "key": "",
          "msg_id": "",
          "requester_id": "",
          "auth_token": ""
        },
      }
      const getDevDetails = await axios.get(`/user/developer/_getDeveloperById?id=${devRegId}&isAllData=true`, requestResp, {

      });
      // console.log(getDevDetails?.data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getDeveloperData()
  }, []);
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
    setPanNumber(e.target.value.toUpperCase());
  }
  function selectPermanentAddress(e) {
    setPermanentAddress(e.target.value);
  }
  function selectHouseNumber(e) {
    setAddressLineOne(e.target.value);
  }
  function selectColonyName(e) {
    setAddressLineTwo(e.target.value);
  }
  function selectStreetName(e) {
    setAddressLineThree(e.target.value);
  }
  function selectLocality(e) {
    setAddressLineFour(e.target.value);
  }
  function selectCity(e) {
    setCity(e.target.value);
  }
  function selectPincode(e) {
    setPincode(e.target.value);
  }
  function selectChecked(e) {
    // console.log(e.target.value);
    setSelectedChecked(e.target.value);
    if (isAddressSame == false) {
      setisAddressSame(true);
      setSelectedChecked(formData?.LicenseDetails?.addressSameAsPermanent ? formData?.LicenseDetails?.addressSameAsPermanent : formData?.LicenseDetails?.addressSameAsPermanent)
      setCorrespondenceaddress(formData?.LicneseDetails?.PermanentAddress ? formData?.LicneseDetails?.PermanentAddress : formData?.formData?.LicneseDetails?.PermanentAddress);
      setAddressLineOneCorrespondence(formData?.LicneseDetails?.addressLineOneCorrespondence ? formData?.LicneseDetails?.addressLineOneCorrespondence : formData?.LicneseDetails?.addressLineOne);
      setAddressLineTwoCorrespondence(formData?.LicneseDetails?.addressLineTwo ? formData?.LicneseDetails?.addressLineTwo : formData?.formData?.LicneseDetails?.addressLineTwo);
      setAddressLineThreeCorrespondence(formData?.LicneseDetails?.addressLineThree ? formData?.LicneseDetails?.addressLineThree : formData?.formData?.LicneseDetails?.addressLineThree);
      setAddressLineFourCorrespondence(formData?.LicneseDetails?.addressLineFour ? formData?.LicneseDetails?.addressLineFour : formData?.formData?.LicneseDetails?.addressLineFour);
      setCityCorrespondence(formData?.LicneseDetails?.city ? formData?.LicneseDetails?.city : formData?.formData?.LicneseDetails?.city);
      setPincodeCorrespondence(formData?.LicneseDetails?.pincode ? formData?.LicneseDetails?.pincode : formData?.formData?.LicneseDetails?.pincode);
    }
    else {
      Array.from(document.querySelectorAll("input")).forEach((input) => (input.value = ""));
      setisAddressSame(false);
      setCorrespondenceaddress("");
      setAddressLineOneCorrespondence("");
      setAddressLineTwoCorrespondence("");
      setAddressLineThreeCorrespondence("");
      setAddressLineFourCorrespondence("");
      setCityCorrespondence("");
      setPincodeCorrespondence("");
    }
  }
  function selectCorrespondenceaddress(e) {
    setCorrespondenceaddress(e.target.value);
  }
  function selecthouseNumberCorrespondenceaddress(e) {
    setAddressLineOneCorrespondence(e.target.value);
  }
  function selectColonyNameCorrespondence(e) {
    setAddressLineTwoCorrespondence(e.target.value);
  }
  function selectStreetNameCorrespondence(e) {
    setAddressLineThreeCorrespondence(e.target.value);
  }
  function selectLocalityCorrespondence(e) {
    setAddressLineFourCorrespondence(e.target.value);
  }
  function selectCityCorrespondence(e) {
    setCityCorrespondence(e.target.value);
  }
  function selectPincodeCorrespondence(e) {
    setPincodeCorrespondence(e.target.value);
  }

  const goNext = async () => {

    if (!(formData?.result && formData?.result?.Licenses[0]?.id)) {
      let licenseDet = {
        name: name,
        mobileNumber: mobileNumber,
        gender: gender,
        email: email,
        dob: dob,
        PanNumber: PanNumber,
        addressLineOne: addressLineOne,
        addressLineTwo: addressLineTwo,
        addressLineThree: addressLineThree,
        addressLineFour: addressLineFour,
        city: city,
        pincode: pincode,
        addressSameAsPermanent: addressSameAsPermanent,
        addressLineOneCorrespondence: addressLineOneCorrespondence,
        addressLineTwoCorrespondence: addressLineTwoCorrespondence,
        addressLineThreeCorrespondence: addressLineThreeCorrespondence,
        addressLineFourCorrespondence: addressLineFourCorrespondence,
        cityCorrespondence: cityCorrespondence,
        pincodeCorrespondence: pincodeCorrespondence
      }

      onSelect(config.key, licenseDet);
      // console.log("DATALICDET", licenseDet);
      localStorage.setItem("licenceDetails", JSON.stringify(licenseDet));
      Digit.OBPSService.BPAREGCreate(licenseDet, tenantId)
        .then((result, err) => {
          setIsDisableForNext(false);
          let data = {
            result: result,
            formData: formData,
            Correspondenceaddress: Correspondenceaddress,
            addressLineOneCorrespondence: addressLineOneCorrespondence,
            addressLineTwoCorrespondence: addressLineTwoCorrespondence,

            isAddressSame: isAddressSame
          }
          //1, units
          onSelect("", data, "", true);

        })
        .catch((e) => {
          setIsDisableForNext(false);
          setShowToast({ key: "error" });
          setError(e?.response?.data?.Errors[0]?.message || null);
        });

      const developerRegisterData = {

        "devDetail": {
          "id":USERID,
          "licenceDetails": {
            name: name,
            mobileNumber: mobileNumber,
            gender: [{gender}],
            email: email,
            dob: dob,
            PanNumber: PanNumber,
            addressLineOne: addressLineOne,
            addressLineTwo: addressLineTwo,
            addressLineThree: addressLineThree,
            addressLineFour: addressLineFour,
            city: city,
            pincode: pincode,
            addressSameAsPermanent: addressSameAsPermanent,
            addressLineOneCorrespondence: addressLineOneCorrespondence,
            addressLineTwoCorrespondence: addressLineTwoCorrespondence,
            addressLineThreeCorrespondence: addressLineThreeCorrespondence,
            addressLineFourCorrespondence: addressLineFourCorrespondence,
            cityCorrespondence: cityCorrespondence,
            pincodeCorrespondence: pincodeCorrespondence
          }
        }

      }
      Digit.OBPSService.CREATEDeveloper(developerRegisterData, tenantId)
        .then((result, err) => {
          // console.log("DATA", result?.id);
          localStorage.setItem('devRegId', JSON.stringify(result?.id));
          setIsDisableForNext(false);
          let data = {
            result: result,
            formData: formData,
            Correspondenceaddress: Correspondenceaddress,
            addressLineOneCorrespondence: addressLineOneCorrespondence,
            addressLineTwoCorrespondence: addressLineTwoCorrespondence,

            isAddressSame: isAddressSame
          }
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
      formData.addressLineOneCorrespondence = addressLineOneCorrespondence;
      formData.addressSameAsPermanent = addressSameAsPermanent;
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
            isDisabled={!name || !mobileNumber || !gender || !dob || !email || !PanNumber}
          >
            <Card className="mb-3">
              {/* <h4></h4> */}
              <Row className="justify-content-between">
                <Form.Group className="col-md-4">
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
                <Form.Group className="col-md-4">
                  <CardLabel>{`${t("BPA_APPLICANT_GENDER_LABEL")}*`}</CardLabel>
                  <div className="row">
                    <Dropdown
                      style={{ width: "100%" }}
                      className="form-field"
                      selected={gender?.length === 1 ? gender[0] : gender}
                      disable={gender?.length === 1 || editScreen}
                      option={menu}
                      select={setGenderName}
                      value={gender}
                      optionKey="code"
                      t={t}
                      name="gender"
                    />
                    {/* <RadioButtons
                  t={t}
                  options={menu}
                  optionsKey="code"
                  name="gender"
                  value={gender}
                  selectedOption={gender}
                  onSelect={setGenderName}
                  isDependent={true}
                  labelKey="COMMON_GENDER"
                  /> */}
                  </div>
                </Form.Group>
                <Form.Group className="col-md-4">
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
                  <Form.Group className="col-md-4">
                    <CardLabel>{`${"Enter Date of Birth"}*`}</CardLabel>
                    {/* <DatePicker 
                  t={t}
                  type="date"
                  isMandatory={false}
                  optionKey="i18nKey"
                  value={dob}
                  name="dob"
                  onChange={setDateofBirth}
                /> */}
                    <DatePicker
                      isMandatory={true}
                      date={dob}
                      onChange={(e) => setDOB(e)}
                      disable={false}
                      max={convertEpochToDate(new Date().setFullYear(new Date().getFullYear() - 18))}
                    />
                  </Form.Group>
                )
                )}
                <Form.Group className="col-md-4">
                  <CardLabel>{`${t("BPA_APPLICANT_EMAIL_LABEL")}*`}</CardLabel>
                  <TextInput
                    t={t}
                    type={"email"}
                    isMandatory={true}
                    optionKey="i18nKey"
                    name="email"
                    value={email}
                    placeholder={email}
                    onChange={selectEmail}
                  //disable={editScreen}

                  />
                  {email && email.length > 0 && !email.match(Digit.Utils.getPattern('Email')) && <CardLabelError style={{ width: "100%", marginTop: '-15px', fontSize: '16px', marginBottom: '12px', color: 'red' }}>{("Invalid Email Address")}</CardLabelError>}
                </Form.Group>
                <Form.Group className="col-md-4">
                  <CardLabel>{`${t("BPA_APPLICANT_PAN_NO")}*`}</CardLabel>
                  <TextInput
                    t={t}
                    type={"text"}
                    isMandatory={true}
                    optionKey="i18nKey"
                    name="PanNumber"
                    required={true}
                    value={PanNumber}
                    placeholder={PanNumber}
                    onChange={selectPanNumber}
                    {...{ required: true, pattern: "[A-Z]{5}[0-9]{4}[A-Z]{1}", title: t("BPA_INVALID_PAN_NO") }}
                  />
                  {PanNumber && PanNumber.length > 0 && !PanNumber.match(Digit.Utils.getPattern('PAN')) && <CardLabelError style={{ width: "100%", marginTop: '-15px', fontSize: '16px', marginBottom: '12px', color: 'red' }}>{t("BPA_INVALID_PAN_NO")}</CardLabelError>}
                  <h3 className="error-message" style={{ color: "red" }}>{PanValError}</h3>
                </Form.Group>
              </Row>
            </Card>
            <Card className="mb-3">
              <h4 className="mb-2 fw-bold">Permanent Address</h4>
              <Row className="justify-content-between">
                {/* <Form.Group className="col-md-4">
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
                <Form.Group className="col-md-4">
                  <CardLabel>{`${"Address Line 1"}*`}</CardLabel>
                  <TextInput
                    t={t}
                    type={"text"}
                    isMandatory={false}
                    optionKey="i18nKey"
                    name="addressLineOne"
                    value={addressLineOne}
                    placeholder={addressLineOne}
                    onChange={selectHouseNumber}
                    {...(validation = {
                      isRequired: true,
                      type: "text",
                      title: ("Please Enter Address line 1"),
                    })}
                  />
                  {/* <Form.Control type="text" placeholder="N/A" {...register("addressLineOne")}   onChange={(e) => setAddressLineOne(e.target.value)} value={addressLineOne}/>
              <h3 className="error-message"style={{color:"red"}}>{errors?.addressLineOne && errors?.addressLineOne?.message}</h3> */}
                </Form.Group>
                <Form.Group className="col-md-4">
                  <CardLabel>{`${"Address Line 2"}`}</CardLabel>
                  <TextInput
                    t={t}
                    type={"text"}
                    isMandatory={false}
                    optionKey="i18nKey"
                    name="addressLineTwo"
                    value={addressLineTwo}
                    placeholder={addressLineTwo}
                    onChange={selectColonyName}
                  />
                </Form.Group>
                <Form.Group className="col-md-4">
                  <CardLabel>{`${"Address Line 3"}`}</CardLabel>
                  <TextInput
                    t={t}
                    type={"text"}
                    isMandatory={false}
                    optionKey="i18nKey"
                    name="addressLineThree"
                    value={addressLineThree}
                    placeholder={addressLineThree}
                    onChange={selectStreetName}
                  />
                </Form.Group>
                <Form.Group className="col-md-4">
                  <CardLabel>{`${"Address Line 4"}`}</CardLabel>
                  <TextInput
                    t={t}
                    type={"text"}
                    isMandatory={false}
                    optionKey="i18nKey"
                    name="addressLineFour"
                    value={addressLineFour}
                    placeholder={addressLineFour}
                    onChange={selectLocality}
                  />
                </Form.Group>
                <Form.Group className="col-md-4">
                  <CardLabel>{`${"City"}*`}</CardLabel>
                  <TextInput
                    t={t}
                    type={"text"}
                    isMandatory={false}
                    optionKey="i18nKey"
                    name="city"
                    value={city}
                    placeholder={city}
                    onChange={selectCity}
                    {...(validation = {
                      isRequired: true,
                      type: "text",
                      title: ("Please Enter City"),
                    })}
                  />
                </Form.Group>
                <Form.Group className="col-md-4">
                  <CardLabel>{`${"Pincode"}*`}</CardLabel>
                  <TextInput
                    t={t}
                    type={"text"}
                    isMandatory={false}
                    optionKey="i18nKey"
                    name="pincode"
                    value={pincode}
                    placeholder={pincode}
                    onChange={selectPincode}
                    maxlength={"6"}
                    {...(validation = {
                      isRequired: true,
                      type: "text",
                      title: ("Please Enter Pincode"),
                    })}
                  />
                  {pincode && pincode.length > 0 && !pincode.match(Digit.Utils.getPattern('Pincode')) && <CardLabelError style={{ width: "100%", marginTop: '-15px', fontSize: '16px', marginBottom: '12px', color: 'red' }}>{t("Please enter valid Pincode")}</CardLabelError>}
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
                    value={isAddressSame}
                    checked={isAddressSame}
                    style={{ paddingBottom: "10px", paddingTop: "10px" }}
                  />
                </Form.Group>
                {/* <Form.Group className="col-md-4">
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
                <Form.Group className="col-md-4">
                  <CardLabel>{`${"Address Line 1"}*`}</CardLabel>
                  <TextInput
                    t={t}
                    type={"text"}
                    isMandatory={true}
                    optionKey="i18nKey"
                    name="addressLineOneCorrespondence"
                    value={addressLineOneCorrespondence}
                    placeholder={addressLineOneCorrespondence}
                    onChange={selecthouseNumberCorrespondenceaddress}
                    disable={isAddressSame}
                  />
                </Form.Group>
                <Form.Group className="col-md-4">
                  <CardLabel>{`${"Address Line 2"}`}</CardLabel>
                  <TextInput
                    t={t}
                    type={"text"}
                    isMandatory={false}
                    optionKey="i18nKey"
                    name="addressLineTwoCorrespondence"
                    value={addressLineTwoCorrespondence}
                    placeholder={addressLineTwoCorrespondence}
                    onChange={selectColonyNameCorrespondence}
                    disable={isAddressSame}
                  />
                </Form.Group>
                <Form.Group className="col-md-4">
                  <CardLabel>{`${"Address Line 3"}`}</CardLabel>
                  <TextInput
                    t={t}
                    type={"text"}
                    isMandatory={false}
                    optionKey="i18nKey"
                    name="addressLineThreeCorrespondence"
                    value={addressLineThreeCorrespondence}
                    placeholder={addressLineThreeCorrespondence}
                    onChange={selectStreetNameCorrespondence}
                    disable={isAddressSame}
                  />
                </Form.Group>
                <Form.Group className="col-md-4">
                  <CardLabel>{`${"Address Line 4"}`}</CardLabel>
                  <TextInput
                    t={t}
                    type={"text"}
                    isMandatory={false}
                    optionKey="i18nKey"
                    name="addressLineFourCorrespondence"
                    value={addressLineFourCorrespondence}
                    placeholder={addressLineFourCorrespondence}
                    onChange={selectLocalityCorrespondence}
                    disable={isAddressSame}
                  />
                </Form.Group>
                <Form.Group className="col-md-4">
                  <CardLabel>{`${"City"}*`}</CardLabel>
                  <TextInput
                    t={t}
                    type={"text"}
                    isMandatory={true}
                    optionKey="i18nKey"
                    name="cityCorrespondence"
                    value={cityCorrespondence}
                    placeholder={cityCorrespondence}
                    onChange={selectCityCorrespondence}
                    disable={isAddressSame}
                  />
                </Form.Group>
                <Form.Group className="col-md-4">
                  <CardLabel>{`${"Pincode"}*`}</CardLabel>
                  <TextInput
                    t={t}
                    type={"text"}
                    isMandatory={true}
                    optionKey="i18nKey"
                    name="pincodeCorrespondence"
                    value={pincodeCorrespondence}
                    placeholder={pincodeCorrespondence}
                    onChange={selectPincodeCorrespondence}
                    disable={isAddressSame}
                  />
                </Form.Group>
              </Row>
            </Card>
          </FormStep> : <Loader />}
      </div>
    </div>
  );
};

export default LicenseDetails;