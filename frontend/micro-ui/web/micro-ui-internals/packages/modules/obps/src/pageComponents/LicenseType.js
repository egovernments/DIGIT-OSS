import { CardLabel, Dropdown, FormStep, RadioOrSelect, TextInput, OpenLinkContainer, CardLabelError, BackButton } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { stringReplaceAll } from "../utils";
import Timeline from "../components/Timeline";
import { Form, Row } from "react-bootstrap";
import { MenuItem, Select } from "@mui/material";
import axios from "axios";
import { newConfig } from "../config/stakeholderConfig";
import Spinner from "../components/Loader/index";

const LicenseType = ({ t, config, onSelect, userType, formData }) => {
  const userInfo = Digit.UserService.getUser();

  const [loader, setLoading] = useState(false);

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
      const getDevDetails = await axios.get(`/user/developer/_getDeveloperById?id=${userInfo?.info?.id}&isAllData=true`, requestResp, {
        
      });
      const developerDataGet = getDevDetails?.data;
      setShowDevTypeFields(developerDataGet?.devDetail[0]?.applicantType?.developerType || devType);
      setLicenseType(developerDataGet?.devDetail[0]?.applicantType?.LicneseType);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getDeveloperData()
  }, []);

  if (JSON.parse(sessionStorage.getItem("BPAREGintermediateValue")) !== null) {
    formData = JSON.parse(sessionStorage.getItem("BPAREGintermediateValue"));
    sessionStorage.setItem("BPAREGintermediateValue", null);
  }
  else
    formData = formData
  
    

  let index = window.location.href.split("/").pop();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();

  

  const setDevType = (data) => {
    const getDevTypeValue = data?.value;
    console.log("data123", data)
    setShowDevTypeFields(getDevTypeValue);
    localStorage.setItem('devTypeValueFlag', getDevTypeValue)
    setLicenseTypeCom(`${LicenseType?.tradeType}.${getDevTypeValue}`);
    // alert(licenceTypeCombined);
  }

  
  const [LicenseType, setLicenseType] = useState(formData?.LicneseType?.LicenseType || formData?.formData?.LicneseType?.LicenseType || "");
  const [ArchitectNo, setArchitectNo] = useState(formData?.LicneseType?.ArchitectNo || formData?.formData?.LicneseType?.ArchitectNo || null);
  const [showDevTypeFields, setShowDevTypeFields] = useState(formData?.LicneseType?.showDevTypeFields || formData?.formData?.LicneseType?.showDevTypeFields || "");
  const [licenceTypeCombined, setLicenseTypeCom] = useState("");
  const { data, isLoading } = Digit.Hooks.obps.useMDMS(stateId, "StakeholderRegistraition", "TradeTypetoRoleMapping");
  let isopenlink = window.location.href.includes("/openlink/");
  const isCitizenUrl = Digit.Utils.browser.isMobile() ? true : false;

  const { data: optionsArrList } = Digit.Hooks.obps.useMDMS(stateId, "Developer-type", ["DeveloperType"]);
  let arrayDevList = [];
  optionsArrList &&
  optionsArrList["Developer-type"].DeveloperType.map((devTypeDetails) => {
    arrayDevList.push({ code: `${devTypeDetails.code}`, value: `${devTypeDetails.code}` });
  });

  // console.log("HASHGSHSGA",arrayDevList);

  if (isopenlink)
    window.onunload = function () {
      sessionStorage.removeItem("Digit.BUILDING_PERMIT");
    };

  function getLicenseType() {
    let list = [];
    let found = false;
    data?.StakeholderRegistraition?.TradeTypetoRoleMapping.map((ob) => {
      found = list.some((el) => el.i18nKey.includes(ob.tradeType.split(".")[0]));
      if (!found) list.push({ role: ob.role, i18nKey: `TRADELICENSE_TRADETYPE_${ob.tradeType.split(".")[0]}`, tradeType: ob.tradeType });
    });
    return list;
  }

  const onSkip = () => onSelect();

  function selectLicenseType(value) {
    // console.log("log123", value)
    setLicenseType(value);
  }

  function selectArchitectNo(e) {
    setArchitectNo(e.target.value.toUpperCase()); 
  }

  // console.log("++++",`${LicenseType?.tradeType}.${showDevTypeFields}`);

  function goNext() {
    // if (!(formData?.result && formData?.result?.Licenses[0]?.id)){
      
      // console.log("log1234...",config,formData,LicenseType?.tradeType);

      let applicantType = {
        "licenceType": licenceTypeCombined || LicenseType?.tradeType,
        "developerType": showDevTypeFields,
      }
      const developerRegisterData = {
        "id": userInfo?.info?.id,
        "pageName": "applicantType",
        "createdBy": userInfo?.info?.id,
        "updatedBy": userInfo?.info?.id,
        "devDetail": {

          "applicantType": applicantType
        }
      }
      
      // console.log("logger123",config,applicantType);
      if(LicenseType?.tradeType === 'ARCHITECT.CLASSA'){
        onSelect(config.key, applicantType);
      } else {
        onSelect(config.key, applicantType,null,null,"license-add-info");
      }
      setLoading(true);
      Digit.OBPSService.CREATEDeveloper(developerRegisterData, tenantId)
        .then((result, err) => {
          // console.log("DATA",result?.id);
          // localStorage.setItem('devRegId',JSON.stringify(result?.id));
          // setIsDisableForNext(false);
          let data = {
            result: result,
            formData: formData,
            licenceType: licenceType,
            developerType: developerType
          }
          //1, units
          if(LicenseType?.tradeType === 'ARCHITECT.CLASSA'){
            onSelect("", data, "", true);
          } else {
            onSelect("", data, "", true,"license-add-info");
          }
          setLoading(false);
        })
        
        .catch((e) => {
          // setIsDisableForNext(false);
          // setShowToast({ key: "error" });
          setLoading(false);
          setError(e?.response?.data?.Errors[0]?.message || null);
        });
    // }
      
    // else {
    //   let data = formData?.formData;
    //   data.LicneseType.LicenseType = LicenseType;
    //   data.LicneseType.ArchitectNo = ArchitectNo;
    //   onSelect("", formData)
    // }
  }

  return (
    <div>
      {loader && <Spinner />}
      <div className={isopenlink ? "OpenlinkContainer" : ""}>
        {isopenlink && <BackButton style={{ border: "none" }}>{t("CS_COMMON_BACK")}</BackButton>}
        <Timeline currentStep={1} flow={LicenseType?.tradeType === 'ARCHITECT.CLASSA'?'ARCHITECT.CLASSA':"STAKEHOLDER"} />
        <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={LicenseType && LicenseType?.i18nKey.includes("ARCHITECT") ? !LicenseType || !ArchitectNo : !LicenseType}>
          <Row className="justify-content-between">
            <Form.Group className="col-md-5">
              <CardLabel>{t("Select applicant type")} <span className="font-weight-bold text-danger">*</span></CardLabel>
              {/* <CardLabel>{t("BPA_LICENSE_TYPE_TEXT")} <span className="font-weight-bold text-danger">*</span></CardLabel> */}
              <div className={"form-pt-dropdown-only"}>
                {/* {JSON.stringify(LicenseType?.i18nKey)} */}
                {data && (
                  <div>
                    <RadioOrSelect
                      t={t}
                      optionKey="i18nKey"
                      isMandatory={config.isMandatory}
                      options={getLicenseType() || {}}
                      selectedOption={LicenseType}
                      onSelect={selectLicenseType}
                      placeholder="Select option"
                    />
                  </div>
                )}
              </div>
            </Form.Group>

            <Form.Group className="col-md-5">
              {LicenseType && LicenseType?.i18nKey.includes("ARCHITECT") && <div><CardLabel>{`${t("BPA_COUNCIL_NUMBER")}`} <span className="font-weight-bold text-danger">*</span></CardLabel>
                <TextInput
                  t={t}
                  type={"text"}
                  isMandatory={false}
                  optionKey="i18nKey"
                  name="ArchitectNo"
                  value={ArchitectNo}
                  onChange={selectArchitectNo}
                  maxlength={"15"}
                />
                {ArchitectNo && ArchitectNo.length > 0 && !ArchitectNo.match(Digit.Utils.getPattern('architectNumber')) && <CardLabelError style={{ width: "100%", marginTop: '-15px', fontSize: '16px', marginBottom: '12px', color: 'red' }}>{t("Invalid Architect Number")}</CardLabelError>}

                
              </div>}

              {LicenseType && LicenseType?.i18nKey.includes("DEVELOPER") && <div><CardLabel>{`${t("Select Developer Type")}`} <span className="font-weight-bold text-danger">*</span></CardLabel>
                
                <Dropdown
                  labels="Select Type"
                  className="form-field"
                  selected={{ code: showDevTypeFields, value: showDevTypeFields }}
                  option={arrayDevList}
                  select={setDevType}
                  optionKey="code"
                  name="showDevTypeFields"
                  placeholder={showDevTypeFields}
                  style={{ width: "100%" }}
                  t={t}
                  required
                />
              </div>}
            </Form.Group>
            {/* {LicenseType && LicenseType?.i18nKey.includes("CITIZEN") && <a className="submit-bar col-md-4" onClick={() => history.push("/digit-ui/citizen")}>Submit</a>} */}
          </Row>
        </FormStep>
      </div>
    </div>
  );
};

export default LicenseType;
