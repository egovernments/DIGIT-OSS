import { BackButton, CardLabel, CheckBox, FormStep, TextArea, Toast } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import Timeline from "../components/Timeline";
import { useForm } from "react-hook-form";
import { Button, Form, FormLabel } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { Modal,ModalHeader,ModalBody,ModalFooter} from "reactstrap";
import axios from "axios";
import { useLocation } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
const DeveloperCapacity = ({ t, config, onSelect, value, userType, formData }) => {
    const { pathname: url } = useLocation();
    let validation = {};
    const devRegId = localStorage.getItem('devRegId');
    const onSkip = () => onSelect();
    const getDeveloperData = async ()=>{
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
            const getDevDetails = await axios.get(`/user/developer/_getDeveloperById?id=${devRegId}&isAllData=true`,requestResp,{

            });
            const developerDataGet = getDevDetails?.data; 
            console.log(developerDataGet);
            console.log("TECHEXP",developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalExpertEngaged[0]?.engineerName);
            setValueHrdu(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.permissionGrantedHRDU);
            setValueTechExpert(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalExpert);
            setValueDesignatedDirectors(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.designatedDirectors);
            setValueAlreadyObtainedLic(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.alreadtObtainedLic);
            setModalCapacityDevelopColonyHdruAct(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.capacityDevelopColonyHdruAct || "");
            setCapacityDevelopColonyLawAct(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.capacityDevelopColonyLawAct || "");
            setModalLcNo(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.licenceNumber);
            setEngineerName(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalExpertEngaged[0]?.engineerName)
            setEngineerQualification(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalExpertEngaged[0]?.engineerQualification)
            setEngineerSign(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalExpertEngaged[0]?.engineerSign)
            setEngineerDegree(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalExpertEngaged[0]?.engineerDegree)
            setArchitectName(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalExpertEngaged[0]?.architectName)
            setArchitectQualification(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalExpertEngaged[0]?.architectQualification)
            setArchitectSign(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalExpertEngaged[0]?.architectSign)
            setArchitectDegree(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalExpertEngaged[0]?.architectDegree)
            setTownPlannerName(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalExpertEngaged[0]?.townPlannerName)
            setTownPlannerQualification(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalExpertEngaged[0]?.townPlannerQualification)
            setTownPlannerSign(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalExpertEngaged[0]?.townPlannerSign)
            setTownPlannerDegree(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalExpertEngaged[0]?.townPlannerDegree)
            setExistingDev(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.existingDeveloperAgreement)
            setExistingDevDoc(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.existingDeveloperAgreementDoc)
            setTechnicalCapacity(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalCapacity)
            setTechnicalCapacityDoc(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalCapacityDoc)
            setengineerNameN(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalExpertEngaged?.engineerNameN)
            setEngineerDocN(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.engineerDocN)
            setArchitectNameN(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.architectNameN)
            setArchitectDocN(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.architectDocN)
            setUplaodSpaBoard(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.uplaodSpaBoard)
            setUplaodSpaBoardDoc(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.uplaodSpaBoardDoc)
            setAgreementDoc(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.agreementDoc)
            setBoardDoc(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.boardDoc)
            setRegisteredDoc(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.registeredDoc)
            setBoardDocY(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.boardDocY)
            setEarlierDocY(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.earlierDocY)
            setBoardDocN(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.boardDocN)
            setEarlierDocN(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.earlierDocN)
            setTechnicalAssistanceAgreementDoc(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalAssistanceAgreementDoc)
            setDocuploadData(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.docUpload)
            setFile(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.file)
            setIndividualCertificateCA(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.individualCertificateCA)
            setCompanyBalanceSheet(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.companyBalanceSheet)
            setPaidUpCapital(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.paidUpCapital)
            setNetworthPartners(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.networthPartners)
            setNetworthFirm(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.networthFirm)
            console.log("Developer-Capacity",getDevDetails?.data?.devDetail[0]?.capacityDevelopAColony);
        } catch (error) {
            console.log(error);
        }
      }
      useEffect(() => {
        getDeveloperData()
      }, []);
    const [Correspondenceaddress, setCorrespondenceaddress] = useState(formData?.LicneseDetails?.Correspondenceaddress || formData?.formData?.LicneseDetails?.Correspondenceaddress || "");
    const [isAddressSame, setisAddressSame] = useState(formData?.LicneseDetails?.isAddressSame || formData?.formData?.LicneseDetails?.isAddressSame || false);
    const [error, setError] = useState(null);
    const [showToast, setShowToast] = useState(null);
    const [isDisableForNext, setIsDisableForNext] = useState(false);
    const [isDevType, setIsDevType] = useState(false)
    const [isDevTypeComp, setIsDevTypeComp] = useState(false)
    const [modal, setmodal] = useState(false);
    const [modalColony, setmodalColony] = useState(false);
    const [capacityDevelopColonyHdruAct, setModalCapacityDevelopColonyHdruAct] = useState([]);
    // const [modalColonyDevGrpValuesArray, setModalColonyDevGrpValuesArray] = useState([]);
    const [capacityDevelopColonyLawAct, setCapacityDevelopColonyLawAct] = useState(formData?.LicneseDetails?.capacityDevelopColonyLawAct || []);
    const [capacityDevelopAColony, setcapacityDevelopAColony] = useState([]);
  
    const [licenceNumber, setModalLcNo] = useState(formData?.LicneseDetails?.licenceNumber || "");
    const [nameOfDeveloper, setModalDevName] = useState(formData?.LicneseDetails?.nameOfDeveloper || "");
    const [purposeOfColony, setModalPurposeCol] = useState(formData?.LicneseDetails?.purposeOfColony || "");
    const [sectorAndDevelopmentPlan, setModalDevPlan] = useState(formData?.LicneseDetails?.sectorAndDevelopmentPlan || "");
    const [validatingLicence, setModalDevValidity] = useState(formData?.LicneseDetails?.validatingLicence || "");
  
    
    const [coloniesDeveloped,setColonyDev] = useState(formData?.LicneseDetails?.coloniesDeveloped || "");
    const [area,setColonyArea] = useState(formData?.LicneseDetails?.area || "");
    const [purpose,setColonyPurpose] = useState(formData?.LicneseDetails?.purpose || "");
    const [statusOfDevelopment,setColonyStatusDev] = useState(formData?.LicneseDetails?.statusOfDevelopment || "");
    const [outstandingDues,setColonyoutstandingDue] = useState(formData?.LicneseDetails?.outstandingDues || "");
  
    const [engineerName,setEngineerName] = useState(formData?.LicneseDetails?.engineerName || "")
    const [engineerQualification,setEngineerQualification] = useState(formData?.LicneseDetails?.engineerQualification || "")
    const [engineerSign,setEngineerSign] = useState(formData?.LicneseDetails?.engineerSign || "")
    const [engineerDegree,setEngineerDegree] = useState(formData?.LicneseDetails?.engineerDegree || "")
    const [architectName,setArchitectName] = useState(formData?.LicneseDetails?.architectName || "")
    const [architectQualification,setArchitectQualification] = useState(formData?.LicneseDetails?.architectQualification || "")
    const [architectSign,setArchitectSign] = useState(formData?.LicneseDetails?.architectSign || "")
    const [architectDegree,setArchitectDegree] = useState(formData?.LicneseDetails?.architectDegree || "")
    const [townPlannerName,setTownPlannerName] = useState(formData?.LicneseDetails?.townPlannerName || "")
    const [townPlannerQualification,setTownPlannerQualification] = useState(formData?.LicneseDetails?.townPlannerQualification || "")
    const [townPlannerSign,setTownPlannerSign] = useState(formData?.LicneseDetails?.townPlannerSign || "")
    const [townPlannerDegree,setTownPlannerDegree] = useState(formData?.LicneseDetails?.townPlannerDegree || "")
    const [existingDeveloperAgreement,setExistingDev] = useState(formData?.LicneseDetails?.existingDeveloperAgreement || "")
    const [existingDeveloperAgreementDoc,setExistingDevDoc] = useState(formData?.LicneseDetails?.existingDeveloperAgreementDoc || "")
    const [technicalCapacity,setTechnicalCapacity] = useState(formData?.LicneseDetails?.technicalCapacity || "")
    const [technicalCapacityDoc,setTechnicalCapacityDoc] = useState(formData?.LicneseDetails?.technicalCapacityDoc || "")
    const [engineerNameN,setengineerNameN] = useState(formData?.LicneseDetails?.engineerNameN || "")
    const [engineerDocN,setEngineerDocN] = useState(formData?.LicneseDetails?.engineerDocN || "")
    const [architectNameN,setArchitectNameN] = useState(formData?.LicneseDetails?.architectNameN || "")
    const [architectDocN,setArchitectDocN] = useState(formData?.LicneseDetails?.architectDocN || "")
    const [uplaodSpaBoard,setUplaodSpaBoard] = useState(formData?.LicneseDetails?.uplaodSpaBoard || "")
    const [uplaodSpaBoardDoc,setUplaodSpaBoardDoc] = useState(formData?.LicneseDetails?.uplaodSpaBoardDoc || "")
    const [agreementDoc,setAgreementDoc] = useState(formData?.LicneseDetails?.agreementDoc || "")
    const [boardDoc,setBoardDoc] = useState(formData?.LicneseDetails?.boardDoc || "")
    const [registeredDoc,setRegisteredDoc] = useState(formData?.LicneseDetails?.registeredDoc || "")
    const [boardDocY,setBoardDocY] = useState(formData?.LicneseDetails?.boardDocY || "")
    const [earlierDocY,setEarlierDocY] = useState(formData?.LicneseDetails?.earlierDocY || "")
    const [boardDocN,setBoardDocN] = useState(formData?.LicneseDetails?.boardDocN || "")
    const [earlierDocN,setEarlierDocN] = useState(formData?.LicneseDetails?.earlierDocN || "")
    const [technicalAssistanceAgreementDoc,setTechnicalAssistanceAgreementDoc] = useState(formData?.LicneseDetails?.technicalAssistanceAgreementDoc || "")
    const [docUpload,setDocuploadData]=useState([])
    const [file,setFile]=useState(null);
    const [individualCertificateCA,setIndividualCertificateCA] = useState("");
    const [companyBalanceSheet,setCompanyBalanceSheet] = useState("");
    const [paidUpCapital,setPaidUpCapital] = useState("");
    const [networthPartners,setNetworthPartners] = useState("");
    const [networthFirm,setNetworthFirm] = useState("");
  const [permissionGrantedHRDU, setValueHrdu] = useState("");
  const [technicalExpert, setValueTechExpert] = useState("");
  const [designatedDirectors, setValueDesignatedDirectors] = useState("");
  const [alreadtObtainedLic, setValueAlreadyObtainedLic] = useState("");
  const [showhide1, setShowhide1] = useState("Y");
  const [showhide0, setShowhide0] = useState("Y");
  // const [showhide2, setShowhide2] = useState("No");
  // const [showhide3, setShowhide3] = useState("No");
  // const [showhide4, setShowhide4] = useState("No");
  // const [showhide5, setShowhide5] = useState("No");
  const [showhide6, setShowhide6] = useState("no");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  let isopenlink = window.location.href.includes("/openlink/");
  const isCitizenUrl = Digit.Utils.browser.isMobile() ? true : false;

  if(isopenlink)  
  window.onunload = function () {
    sessionStorage.removeItem("Digit.BUILDING_PERMIT");
  }
 
  function selectChecked(e) {
    if (isAddressSame == false) {
      setisAddressSame(true);
      setCorrespondenceaddress(formData?.LicneseDetails?.PermanentAddress ? formData?.LicneseDetails?.PermanentAddress : formData?.formData?.LicneseDetails?.PermanentAddress);
    }
    else {
      Array.from(document.querySelectorAll("input")).forEach((input) => (input.value = ""));
      setisAddressSame(false);
      setCorrespondenceaddress("");
    }
  }
  function selectCorrespondenceaddress(e) {
    setCorrespondenceaddress(e.target.value);
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm([{ XLongitude: "", YLatitude: "" }]);
  const formSubmit = (data) => {
    console.log("data", data);
  };
  const [AppliedDetailFormSubmitted, SetAppliedDetailFormSubmitted] = useState(false);
  // const AppliedDetailFormSubmitHandler = (e) => {
  //   e.preventDefault();
  //   SetAppliedDetailFormSubmitted(true);
  // };
  // useEffect(() => {
  //   if (AppliedDetailFormSubmitted) {
  //     props.AppliedDetailsFormSubmit(true);
  //   }
  // }, [AppliedDetailFormSubmitted]);
  const changeValueHrdu = (e) => {
    console.log(e.target.value);
    setValueHrdu(e.target.value)
  }
  const changeTechnicalExpert = (e) => {
    console.log(e.target.value);
    setValueTechExpert(e.target.value)
  }
  const changeDesignatedDirectors = (e) => {
    console.log(e.target.value);
    setValueDesignatedDirectors(e.target.value)
  }
  const changeAlreadyObtainedLic = (e) => {
    console.log(e.target.value);
    setValueAlreadyObtainedLic(e.target.value)
  }

  const handleshow = (e) => {
    const getshow = e.target.value;
    console.log(getshow)
  };
  const handleshow0 = (e) => {
    const getshow = e.target.value;
    setShowhide0(getshow);
  };
  const handleshow1 = (e) => {
    const getshow = e.target.value;
    setShowhide1(getshow);
  };
  const handleshow6 = (e) => {
    const getshow = e.target.value;
    setShowhide6(getshow);
  };

  const handleChange = (e) => {
    this.setState({ isRadioSelected: true });
  };
  
  const devTypeFlagVal = localStorage.getItem('devTypeValueFlag');
  const getDocumentData = async () => {
    if(file===null){
       return
    }
       const formData = new FormData();
       formData.append(
           "file",file.file      );
       formData.append(
           "tenantId","hr"      );  
       formData.append(
           "module","property-upload"      );
        formData.append(
            "tag","tag-property"      );
   
        console.log("File",formData)

       try {
           const Resp = await axios.post("/filestore/v1/files",formData,
           {headers:{
               "content-type":"multipart/form-data"
           }}).then((response) => {
               return response
           });
           setDocuploadData(Resp.data)
           
       } catch (error) {
           console.log(error.message);
       }

      

  }
  useEffect(() => {
    getDocumentData();
  }, [file]);



const handleArrayValues = () => {

//   if (licenceNumber !== "" && nameOfDeveloper !== "" && purposeOfColony !== "") {

    const values = {
      
        licenceNumber: licenceNumber,
        nameOfDeveloper: nameOfDeveloper,
        purposeOfColony: purposeOfColony,
        sectorAndDevelopmentPlan: sectorAndDevelopmentPlan,
        validatingLicence: validatingLicence
      
    }
    setModalCapacityDevelopColonyHdruAct((prev) => [...prev, values]);
    setmodal(!modal)
//   }
  console.log("DevCapacityFirst", capacityDevelopColonyHdruAct);
  localStorage.setItem("DevCapacityDetails", JSON.stringify(capacityDevelopColonyHdruAct))
}

const handleColonyDevGrp=()=>{
  const colonyDevValues = {
    
      coloniesDeveloped:coloniesDeveloped,
      area:area,
      purpose:purpose,
      statusOfDevelopment:statusOfDevelopment,
      outstandingDues:outstandingDues
    
    
  }
  setCapacityDevelopColonyLawAct((prev) => [...prev, colonyDevValues]);
  setmodalColony(!modalColony)
  console.log("DevCapacityColony", capacityDevelopColonyLawAct);
}
  const goNext = async (e) => {
    if (!(formData?.result && formData?.result?.Licenses[0]?.id)) {
    //   setIsDisableForNext(true);
      let payload = {
        "Licenses": [
          {
            "tradeLicenseDetail": {
              "owners": [
                {
                  "gender": formData?.LicneseDetails?.gender?.code,
                  "mobileNumber": formData?.LicneseDetails?.mobileNumber,
                  "name": formData?.LicneseDetails?.name,
                  "dob": null,
                  "emailId": formData?.LicneseDetails?.email,
                  "permanentAddress": "dfdjsfdsf",
                  "correspondenceAddress": Correspondenceaddress,
                  "pan":formData?.LicneseDetails?.PanNumber,
                  // "permanentPinCode": "143001"
                }
              ],
              "subOwnerShipCategory": "INDIVIDUAL",
              "tradeUnits": [
                {
                  "tradeType": formData?.LicneseType?.LicenseType?.tradeType,
                }
              ],
              "additionalDetail": {
                "counsilForArchNo": formData?.LicneseType?.ArchitectNo,
              },
              "address": {
                "city": "",
                "landmark": "",
                "pincode": ""
              },
              "institution": null,
              "applicationDocuments": null
            },
            "licenseType": "PERMANENT",
            "businessService": "BPAREG",
            "tenantId": stateId,
            "action": "NOWORKFLOW"
          }
        ]
      }

      Digit.OBPSService.BPAREGCreate(payload, tenantId)
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

        
      const developerRegisterData = {
        "id":devRegId,
        "pageName":"capacityDevelopAColony",
        "devDetail": {
          
            "capacityDevelopAColony": {
                "individualCertificateCA": "",
                "companyBalanceSheet": "",
                "paidUpCapital": "",
                "networthPartners": "",
                "networthFirm": "",
                "permissionGrantedHRDU":permissionGrantedHRDU,
                "technicalExpert":technicalExpert,
                "designatedDirectors":designatedDirectors,
                "alreadtObtainedLic":alreadtObtainedLic,
                capacityDevelopColonyHdruAct: capacityDevelopColonyHdruAct,
                capacityDevelopColonyLawAct: capacityDevelopColonyLawAct,
                technicalExpertEngaged: [{
                    engineerName: engineerName,
                    engineerQualification: engineerQualification,
                    engineerSign: engineerSign,
                    engineerDegree: engineerDegree,
                    architectName: architectName,
                    architectQualification: architectQualification,
                    architectSign: architectSign,
                    architectDegree: architectDegree,
                    townPlannerName: townPlannerName,
                    townPlannerQualification: townPlannerQualification,
                    townPlannerSign: townPlannerSign,
                    townPlannerDegree: townPlannerDegree,
                    existingDeveloperAgreement: existingDeveloperAgreement,
                    existingDeveloperAgreementDoc: existingDeveloperAgreementDoc,
                    technicalCapacity: technicalCapacity,
                    technicalCapacityDoc: technicalCapacityDoc,
                    engineerNameN: engineerNameN,
                    engineerDocN: engineerDocN,
                    architectNameN: architectNameN,
                    architectDocN: architectDocN,
                    uplaodSpaBoard: uplaodSpaBoard,
                    uplaodSpaBoardDoc: uplaodSpaBoardDoc
                }],
                designationDirector: [{
                    agreementDoc: agreementDoc,
                    boardDoc: boardDoc
                }],
                obtainedLicense: [{
                    registeredDoc: registeredDoc,
                    boardDocY: boardDocY,
                    earlierDocY: earlierDocY,
                    boardDocN: boardDocN,
                    earlierDocN: earlierDocN,
                    technicalAssistanceAgreementDoc: technicalAssistanceAgreementDoc
                }]
            }
        }
      }

      Digit.OBPSService.CREATEDeveloper(developerRegisterData, tenantId)
      .then((result, err) => {
        console.log("DATA",result?.id);
        // localStorage.setItem('devRegId',JSON.stringify(result?.id));
        setIsDisableForNext(false);
        let data = { 
          result: result, 
          formData: formData, 
          Correspondenceaddress: Correspondenceaddress,
          addressLineOneCorrespondence: addressLineOneCorrespondence,
          addressLineTwoCorrespondence: addressLineTwoCorrespondence,

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
      formData.Correspondenceaddress = Correspondenceaddress;
      formData.isAddressSame = isAddressSame;
      onSelect("", formData, "", true);
    }
    // sessionStorage.setItem("CurrentFinancialYear", FY);
    // onSelect(config.key, { TradeName });
  };

  return (
    <React.Fragment>
      <div className={isopenlink ? "OpenlinkContainer" : ""}>

        {isopenlink && <BackButton style={{ border: "none" }}>{t("CS_COMMON_BACK")}</BackButton>}
        <Timeline currentStep={4} flow="STAKEHOLDER" />
        <FormStep
          config={config}
          onSelect={goNext}
          onSkip={onSkip}
          t={t}
          isDisabled={isDisableForNext}
        >
          {/* <CheckBox
            label={t("BPA_SAME_AS_PERMANENT_ADDRESS")}
            onChange={(e) => selectChecked(e)}
            //value={field.isPrimaryOwner}
            checked={isAddressSame}
            style={{ paddingBottom: "10px", paddingTop: "10px" }}
          />
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
          /> */}
          {devTypeFlagVal === "Individual" &&(
                <div className="card-body">
                    <div className="form-group row mb-12">
                        {/* <label className="col-sm-3 col-form-label">Individual</label> */}
                        <div className="col-sm-12">
                        {/* <textarea type="text" className="employee-card-input" id="details" placeholder="Enter Details" /> */}
                        <table className="table table-bordered" size="sm">
                            <thead>
                            <tr>
                                <th>S.No.</th>
                                <th>Particulars of document</th>
                                <th>Details </th>
                                <th>Annexure </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td> 1 </td>
                                <td>
                                Net Worth in case of individual certified by
                                CA
                                </td>
                                <td>
                                <input
                                    type="file"
                                    name="upload"
                                    placeholder=""
                                    class="employee-card-input"
                                    onChange={(e)=>setFile({file:e.target.files[0]})}
                                />
                                </td>
                                <td align="center" size="large">
                                {/* <FileUploadIcon /> */}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>)}
                {devTypeFlagVal === "Company" &&(
                <div className="card-body">
                    <div className="form-group row">
                        {/* <label className="col-sm-3 col-form-label">Company</label> */}
                        <div className="col-sm-12">
                        {/* <input type="text" className="employee-card-input" id="Email" placeholder="Enter Email" /> */}
                        <table className="table table-bordered" size="sm">
                            <thead>
                            <tr>
                                <th>S.No.</th>
                                <th>Particulars of document</th>
                                <th>Details </th>
                                <th>Annexure </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td> 1 </td>
                                <td>Balance sheet of last 3 years </td>
                                <td>
                                <input
                                    type="file"
                                    name="upload"
                                    placeholder=""
                                    class="employee-card-input"
                                    onChange={(e)=>setFile({file:e.target.files[0]})}
                                />
                               
                                </td>
                                <td align="center" size="large">
                                {/* <FileUploadIcon /> */}
                                </td>
                            </tr>
                            <tr>
                                <td> 2 </td>
                                <td>Ps-3(Representing Paid-UP capital)</td>
                                <td>
                                <input
                                    type="file"
                                    name="upload"
                                    placeholder=""
                                    class="employee-card-input"
                                    onChange={(e)=>setFile({file:e.target.files[0]})}
                                />
                                </td>
                                <td align="center" size="large">
                                {/* <FileUploadIcon /> */}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>)}
                {devTypeFlagVal === "LLP" &&(
                <div className="card-body">
                    <div className="form-group row">
                        {/* <label className="col-sm-3 col-form-label">LLP</label> */}
                        <div className="col-sm-12">
                        {/* <input type="text" className="employee-card-input" id="llp" placeholder="Enter Email" /> */}
                        <table className="table table-bordered" size="sm">
                            <thead>
                            <tr>
                                <th>S.No.</th>
                                <th>Particulars of document</th>
                                <th>Details </th>
                                <th>Annexure </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td> 1 </td>
                                <td>Networth of partners </td>
                                <td>
                                <input
                                    type="file"
                                    name="upload"
                                    placeholder=""
                                    class="employee-card-input"
                                    onChange={(e)=>setFile({file:e.target.files[0]})}
                                />
                                </td>
                                <td align="center" size="large">
                                {/* <FileUploadIcon /> */}
                                </td>
                            </tr>
                            <tr>
                                <td> 2 </td>
                                <td>Net worth of firm</td>
                                <td>
                                <input
                                    type="file"
                                    name="upload"
                                    placeholder=""
                                    class="employee-card-input"
                                    onChange={(e)=>setFile({file:e.target.files[0]})}
                                />
                                </td>
                                <td align="center" size="large">
                                {/* <FileUploadIcon /> */}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>)}
                {/* <div>
                    <h5 className="card-h">
                    {" "}
                    Capacity of Developer to develop a colony:
                    </h5>
                </div> */}
                <div className="card-body">
                    <p>
                    1. I/ We hereby submit the following information/ enclose the
                    relevant documents:-
                    </p>
                    <p>
                    &nbsp;&nbsp;&nbsp; (i) Whether the Developer/ group company has
                    earlier been granted permission to set up a colony under HDRU
                    Act, 1975: *{" "}
                    </p>
                    <div className="form-group">
                    <input
                        type="radio"
                        value="Y"
                        id="permissionGrantedHRDU"
                        className="mx-2 mt-1"
                        onChange={changeValueHrdu}
                        name="permissionGrantedHRDU"
                    />
                    <label for="Yes">Yes</label>

                    <input
                        type="radio"
                        value="N"
                        id="permissionGrantedHRDUN"
                        className="mx-2 mt-1"
                        onChange={changeValueHrdu}
                        name="permissionGrantedHRDU"
                    />
                    <label for="No">No</label>
                    {permissionGrantedHRDU === "Y" && (
                        <div className="card-body">
                        {/* <h5 className="card-h">Add/Remove Authorized Users</h5> */}
                        <div className="table-bd">
                            <Table className="table table-bordered">
                            <thead>
                                <tr>
                                <th>S. no</th>
                                <th> Licence No / year and date of grant of licence </th>
                                <th>Name of developer *</th>
                                <th>Purpose of colony </th>
                                <th>Sector and development plan </th>
                                <th>Validity of licence including renewals if any</th>
                                {/* <th>Remove</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                (capacityDevelopColonyHdruAct.length > 0) ?
                                    capacityDevelopColonyHdruAct.map((elementInArray, input) => {
                                    return (
                                    <tr>

                                        <td>{input + 1}</td>
                                        <td>
                                            <input
                                            type="text"
                                            value={elementInArray.licenceNumber}
                                            placeholder={elementInArray.licenceNumber}
                                            class="employee-card-input"
                                            />
                                        </td>
                                        <td>
                                            <input
                                            type="text"
                                            value={elementInArray.nameOfDeveloper}
                                            placeholder={elementInArray.nameOfDeveloper}
                                            class="employee-card-input"
                                            />
                                        </td>
                                        <td>
                                            <input
                                            type="text"
                                            value={elementInArray.purposeOfColony}
                                            placeholder={elementInArray.purposeOfColony}
                                            class="employee-card-input"
                                            />
                                        </td>
                                        <td>
                                            <div className="row">
                                            <button className="btn btn-sm col-md-6">
                                                <VisibilityIcon color="info" className="icon"/>
                                            </button>
                                            <button className="btn btn-sm col-md-6">
                                                <FileDownloadIcon color="primary"  />
                                            </button>
                                            
                                            </div>
                                        </td>
                                        <td>
                                            <div className="row">
                                            <button className="btn btn-sm col-md-6">
                                                <VisibilityIcon color="info" className="icon" />
                                            </button>
                                            <button className="btn btn-sm col-md-6">
                                                <FileDownloadIcon color="primary"  />
                                            </button>
                                            
                                            </div>
                                        </td>
                                    </tr>
                                    )
                                    }) : <p>Click on Add more</p>
                                }
                            </tbody>
                            </Table>
                            <div>
                            <button
                                type="button"
                                style={{
                                float: "left",
                                backgroundColor: "#0b3629",
                                color: "white",
                                }}
                                className="btn mt-3"
                                // onClick={() => setNoOfRows(noofRows + 1)}
                                onClick={() => setmodal(true)}
                            >
                                Add More
                            </button>

                            <div>
                                <Modal
                                size="lg"
                                isOpen={modal}
                                toggle={() => setmodal(!modal)}
                                >
                                <ModalHeader
                                    toggle={() => setmodal(!modal)}
                                ></ModalHeader>

                                <ModalBody>
                                    <div className="card2">
                                    <div className="popupcard">


                                        <form className="text1">
                                        <Row>
                                            <Col md={4} xxl lg="4">
                                            <label htmlFor="name" className="text">Licence No / year of licence</label>
                                            <input
                                                type="text"
                                                onChange={(e) => setModalLcNo(e.target.value)}
                                                placeholder=""
                                                class="employee-card-input"
                                            />
                                            </Col>
                                            <Col md={4} xxl lg="4">
                                            <label htmlFor="name" className="text">Name of developer *</label>
                                            <input
                                                type="text"
                                                onChange={(e) => setModalDevName(e.target.value)}
                                                placeholder=""
                                                class="employee-card-input"
                                            />
                                            </Col>
                                            <Col md={4} xxl lg="4">
                                            <label htmlFor="name" className="text">Purpose of colony</label>
                                            <input
                                                type="text"
                                                onChange={(e) => setModalPurposeCol(e.target.value)}
                                                placeholder=""
                                                class="employee-card-input"
                                            />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={4} xxl lg="4">
                                            <label htmlFor="name" className="text">Sector and development plan</label>
                                            <input
                                                type="file"
                                                // onChange={(e) => setModalDevPlan(e.target.value)}
                                                onChange={(e)=>setFile({file:e.target.files[0]})}
                                                placeholder=""
                                                class="employee-card-input"
                                            />
                                            </Col>
                                            <Col md={4} xxl lg="4">
                                            <label htmlFor="name" className="text">Validity of licence </label>
                                            <input
                                                type="file"
                                                // onChange={(e) => setModalDevValidity(e.target.value)}
                                                onChange={(e)=>setFile({file:e.target.files[0]})}
                                                placeholder=""
                                                class="employee-card-input"
                                            />
                                            </Col>

                                        </Row>
                                        </form>

                                    </div>
                                    <div className="submit-btn">
                                        <div className="form-group col-md6 mt-6">
                                        <button
                                            type="button"
                                            onClick={handleArrayValues}
                                            style={{ float: "right" }}
                                            className="btn btn-success"
                                        >
                                            Submit
                                        </button>
                                        </div>
                                    </div>
                                    </div>
                                </ModalBody>
                                <ModalFooter
                                    toggle={() => setmodal(!modal)}
                                ></ModalFooter>
                                </Modal>
                            </div>
                            </div>

                            <br></br>
                            <br></br>
                        </div>

                        </div>
                    )}
                    </div>

                    <div className="hl"></div>
                    <p>
                    &nbsp;&nbsp;&nbsp;(ii) Licences/permissions granted to
                    Developer/ group company for development of colony under any
                    other law/Act as .
                    </p>
                    <div>
                    <div className="card-body">
                        {/* <h5 className="card-h">Add/Remove Authorized Users</h5> */}
                        <div className="table-bd">
                        <Table className="table table-bordered">
                            <thead>
                            <tr>
                                {/* <th>Add More</th> */}
                                <th>S.No</th>
                                <th>Colonies developed</th>
                                <th>Area</th>
                                <th>Purpose</th>
                                <th>Status of development</th>
                                <th>Outstanding Dues</th>
                                {/* <th>Action</th> */}
                            </tr>
                            </thead>
                            <tbody>
                            {
                                (capacityDevelopColonyLawAct.length > 0) ?
                                capacityDevelopColonyLawAct.map((elementInArray, input) => {
                                    return (
                                    <tr>
                                        <td>{input+1}</td>
                                        <td>
                                            <input
                                                type="text"
                                                value={elementInArray.coloniesDeveloped}
                                                placeholder={elementInArray.coloniesDeveloped}
                                                class="employee-card-input"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={elementInArray.area}
                                                placeholder={elementInArray.area}
                                                class="employee-card-input"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={elementInArray.purpose}
                                                placeholder={elementInArray.purpose}
                                                class="employee-card-input"
                                            />
                                        </td>
                                        <td>
                                            <div className="row">
                                                <button className="btn btn-sm col-md-6">
                                                    <VisibilityIcon color="info" className="icon" />
                                                </button>
                                                <button className="btn btn-sm col-md-6">
                                                    <FileDownloadIcon color="primary"  />
                                                </button>
                                                
                                            </div>
                                        </td>
                                        <td>
                                            <div className="row">
                                                <button className="btn btn-sm col-md-6">
                                                    <VisibilityIcon color="info" className="icon" />
                                                </button>
                                                <button className="btn btn-sm col-md-6">
                                                    <FileDownloadIcon color="primary"  />
                                                </button>
                                                
                                            </div>
                                        </td>
                                    </tr>
                                    )}
                                    ):<p>Click on add more</p>
                        }
                            </tbody>
                        </Table>
                        <div>
                            <button
                            type="button"
                            style={{
                                float: "left",
                                backgroundColor: "#0b3629",
                                color: "white",
                            }}
                            className="btn mt-3"
                            // onClick={() => setNoOfRows(noofRows + 1)}
                            onClick={() => setmodalColony(true)}
                            >
                            Add More
                            </button>

                            <div>
                            <Modal
                                size="lg"
                                isOpen={modalColony}
                                toggle={() => setmodalColony(!modalColony)}
                            >
                                <ModalHeader
                                toggle={() => setmodalColony(!modalColony)}
                                ></ModalHeader>

                                <ModalBody>
                                <div className="card2">
                                    <div className="popupcard">
                                    <form className="text1">
                                        <Row>
                                        <Col md={4} xxl lg="4">
                                            <label htmlFor="name" className="text">Colonies developed</label>
                                            <input
                                            type="text"
                                            onChange={(e) => setColonyDev(e.target.value)}
                                            placeholder=""
                                            class="employee-card-input"
                                            />
                                        </Col>
                                        <Col md={4} xxl lg="4">
                                            <label htmlFor="name" className="text">Area</label>
                                            <input
                                            type="number"
                                            onChange={(e) => setColonyArea(e.target.value)}
                                            placeholder=""
                                            class="employee-card-input"
                                            />
                                        </Col>
                                        <Col md={4} xxl lg="4">
                                            <label htmlFor="name" className="text">Purpose</label>
                                            <input
                                            type="text"
                                            onChange={(e) => setColonyPurpose(e.target.value)}
                                            placeholder=""
                                            class="employee-card-input"
                                            />
                                        </Col>
                                        </Row>
                                        <Row>
                                        <Col md={4} xxl lg="4">
                                            <label htmlFor="name" className="text">Status of development</label>
                                            <input
                                            type="file"
                                            // onChange={(e) => setColonyStatusDev(e.target.value)}
                                            onChange={(e)=>setFile({file:e.target.files[0]})}
                                            placeholder=""
                                            class="employee-card-input"
                                            />
                                        </Col>
                                        <Col md={4} xxl lg="4">
                                            <label htmlFor="name" className="text">Outstanding Dues</label>
                                            <input
                                            type="file"
                                            // onChange={(e) => setColonyoutstandingDue(e.target.value)}
                                            onChange={(e)=>setFile({file:e.target.files[0]})}
                                            placeholder=""
                                            class="employee-card-input"
                                            />
                                        </Col>

                                        </Row>
                                    </form>

                                    </div>
                                    <div className="submit-btn">
                                    <div className="form-group col-md6 mt-6">
                                        <button
                                        type="button"
                                        style={{ float: "right" }}
                                        className="btn btn-success"
                                        onClick={handleColonyDevGrp}
                                        >
                                        Submit
                                        </button>
                                    </div>
                                    </div>
                                </div>
                                </ModalBody>
                                <ModalFooter
                                toggle={() => setmodalColony(!modalColony)}
                                ></ModalFooter>
                            </Modal>
                            </div>
                        </div>
                        <br></br>
                        <br></br>
                        </div>
                    </div>
                    </div>

                    <div className="hl"></div>
                    <p>
                    &nbsp;&nbsp;&nbsp;(iii) Whether any technical expert(s) engaged
                    </p>

                    <div className="form-group">
                    <input
                        type="radio"
                        value="Y"
                        id="technicalExpert"
                        className="mx-2 mt-1"
                        onChange={changeTechnicalExpert}
                        name="technicalExpert"
                    />
                    <label for="Yes">Yes</label>

                    <input
                        type="radio"
                        value="N"
                        id="technicalExpertN"
                        className="mx-2 mt-1"
                        onChange={changeTechnicalExpert}
                        name="technicalExpert"
                    />
                    <label for="No">No</label>
                    {technicalExpert === "Y" && (
                        <div className="row ">
                        <div className="form-group row">
                            <div className="col-sm-12">
                            <div className="table-bd">
                                <Table className="table table-bordered">
                                <thead>
                                    <tr>
                                    <th>S.No</th>
                                    <th>Professional </th>
                                    <th>Qualification</th>
                                    <th>Signature</th>
                                    <th>Annexure</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                    <td>1</td>
                                    <td>
                                        <input
                                        typr="text"
                                        onChange={(e) => setEngineerName(e.target.value)}
                                        value={engineerName}
                                        placeholder="Name of Engineer"
                                        class="employee-card-input"
                                        />
                                    </td>
                                    <td>
                                        <input
                                        type="text"
                                        onChange={(e) => setEngineerQualification(e.target.value)}
                                        value={engineerQualification}
                                        placeholder=""
                                        class="employee-card-input"
                                        />
                                    </td>

                                    <td>
                                        <input
                                        type="file"
                                        // onChange={(e) => setEngineerSign(e.target.value)}
                                        onChange={(e)=>setFile({file:e.target.files[0]})}
                                        placeholder=""
                                        class="employee-card-input"
                                        />
                                    </td>
                                    <td align="center" size="large">
                                    <input
                                        type="file"
                                        // onChange={(e) => setEngineerDegree(e.target.value)}
                                        onChange={(e)=>setFile({file:e.target.files[0]})}
                                        placeholder=""
                                        class="employee-card-input"
                                        />
                                    </td>
                                    </tr>

                                    <tr>
                                    <td>2</td>
                                    <td> 
                                    <input
                                        typr="text"
                                        onChange={(e) => setArchitectName(e.target.value)}
                                        value={architectName}
                                        placeholder="Name of Architect"
                                        class="employee-card-input"
                                        />
                                    </td>
                                    <td>
                                        <input
                                        type="text"
                                        onChange={((e) => setArchitectQualification(e.target.value))}
                                        value={architectQualification}
                                        placeholder=""
                                        class="employee-card-input"
                                        />
                                    </td>

                                    <td>
                                        <input
                                        type="file"
                                        // onChange={((e) => setArchitectSign(e.target.value))}
                                        onChange={(e)=>setFile({file:e.target.files[0]})}
                                        placeholder=""
                                        class="employee-card-input"
                                        />
                                    </td>
                                    <td align="center" size="large">
                                        <input
                                        type="file"
                                        // onChange={((e) => setArchitectDegree(e.target.value))}
                                        onChange={(e)=>setFile({file:e.target.files[0]})}
                                        class="employee-card-input"
                                        />
                                    </td>
                                    </tr>

                                    <tr>
                                    <td>3</td>
                                    <td> 
                                    <input
                                        type="text"
                                        onChange={((e) => setTownPlannerName(e.target.value))}
                                        value={townPlannerName}
                                        placeholder="Name of Town Planner"
                                        class="employee-card-input"
                                        />
                                    </td>
                                    <td>
                                        <input
                                        type="text"
                                        onChange={((e) => setTownPlannerQualification(e.target.value))}
                                        value={townPlannerQualification}
                                        placeholder=""
                                        class="employee-card-input"
                                        />
                                    </td>

                                    <td>
                                        <input
                                        type="file"
                                        // onChange={((e) => setTownPlannerSign(e.target.value))}
                                        onChange={(e)=>setFile({file:e.target.files[0]})}
                                        placeholder=""
                                        class="employee-card-input"
                                        />
                                    </td>
                                    <td align="center" size="large">
                                    <input
                                        type="file"
                                        // onChange={((e) => setTownPlannerDegree(e.target.value))}
                                        onChange={(e)=>setFile({file:e.target.files[0]})}
                                        placeholder=""
                                        class="employee-card-input"
                                        />
                                    </td>
                                    </tr>
                                    
                                </tbody>
                                </Table>
                            </div>
                            </div>
                        </div>
                        </div>
                    )}
                    {technicalExpert === "N" && (
                        <div className="row ">
                        <div className="form-group row">
                            {/* <label className="col-sm-3 col-form-label">Company</label> */}
                            <div className="col-sm-12">
                            <div className="table-bd">
                                <Table className="table table-bordered" size="sm">
                                <thead>
                                    <tr>
                                    <th>S.No.</th>
                                    <th>Professional </th>
                                    <th> Annexure</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                    <td> 1 &nbsp;&nbsp;</td>
                                    <td>
                                        {" "}
                                        Agreement with existing colonizer/developer
                                        who has already developed a colony
                                        {/* <input
                                        type="text"
                                        onChange={((e) => setExistingDev(e.target.value))}
                                        placeholder=""
                                        /> */}
                                    </td>
                                    <td align="center" size="large">
                                    <input
                                        type="file"
                                        onChange={((e) => setExistingDevDoc(e.target.value))}
                                        placeholder=""
                                        class="employee-card-input"
                                        />
                                    </td>
                                    </tr>
                                    <tr>
                                    <td> 2&nbsp;&nbsp; </td>
                                    <td>
                                    <input
                                        type="text"
                                        onChange={((e) => setTechnicalCapacity(e.target.value))}
                                        placeholder="Technical Capacity"
                                        value={technicalCapacity}
                                        class="employee-card-input"
                                        />
                                    </td>
                                    <td align="center" size="large">
                                        <input
                                        type="file"
                                        onChange={((e) => setTechnicalCapacityDoc(e.target.value))}
                                        placeholder=""
                                        class="employee-card-input"
                                        />
                                    </td>
                                    </tr>
                                    <tr>
                                    <td> 3 &nbsp;&nbsp;</td>
                                    {/* <td colSpan={2}>Larry the Bird</td> */}
                                    <td>
                                        <input 
                                        type="text"
                                        placeholder="Name of Engineer"
                                        onChange={((e)=> setengineerNameN(e.target.value))}
                                        value={engineerNameN}
                                        class="employee-card-input"
                                        />
                                    </td>
                                    <td align="center" size="large">
                                    <input
                                        type="file"
                                        // onChange={((e) => setEngineerDocN(e.target.value))}
                                        onChange={(e)=>setFile({file:e.target.files[0]})}
                                        placeholder=""
                                        class="employee-card-input"
                                        />
                                    </td>
                                    </tr>
                                    <tr>
                                    <td> 4&nbsp;&nbsp; </td>
                                    <td>
                                    <input 
                                        type="text"
                                        placeholder="Name of Architect"
                                        onChange={((e)=> setArchitectNameN(e.target.value))}
                                        value={architectNameN}
                                        class="employee-card-input"
                                        />
                                    </td>
                                    <td align="center" size="large">
                                    <input
                                        type="file"
                                        // onChange={((e) => setArchitectDocN(e.target.value))}
                                        onChange={(e)=>setFile({file:e.target.files[0]})}
                                        placeholder=""
                                        class="employee-card-input"
                                        />
                                    </td>
                                    </tr>
                                    <tr>
                                    <td> 5&nbsp;&nbsp; </td>
                                    <td>
                                        {/* <input
                                        type="text"
                                        onChange={((e) => setUplaodSpaBoard(e.target.value))} 
                                        placeholder=""
                                        class="employee-card-input"
                                        /> */}
                                        Upload SPA/GPA/ Board Resolution to sign
                                        collaboration agreement on behalf of land
                                        owner(s)
                                    </td>
                                    <td align="center" size="large">
                                        <input 
                                        type="file"
                                        class="employee-card-input"
                                        // onChange={((e)=> setUplaodSpaBoardDoc(e.target.value))}
                                        onChange={(e)=>setFile({file:e.target.files[0]})}
                                        />
                                    </td>
                                    </tr>
                                </tbody>
                                </Table>
                            </div>
                            </div>
                        </div>

                        {/* <input type="text" className="employee-card-input" /> */}
                        </div>
                    )}
                    </div>

                    <div className="hl"></div>
                    <p>
                    &nbsp;&nbsp;&nbsp;(iv) If director/partner of the proposed
                    developer company/firm also holds designation of
                    director/partner in any other company/firm who has already
                    obtained license(s) under act of 1975:
                    </p>

                    <div className="form-group">
                    <input
                        type="radio"
                        value="Y"
                        id="designatedDirectors"
                        className="mx-2 mt-1"
                        onChange={changeDesignatedDirectors}
                        name="designatedDirectors"
                    />
                    <label for="Yes">Yes</label>

                    <input
                        type="radio"
                        value="N"
                        id="designatedDirectorsN"
                        className="mx-2 mt-1"
                        onChange={changeDesignatedDirectors}
                        name="designatedDirectors"
                    />
                    <label for="No">No</label>
                    {designatedDirectors === "Y" && (
                        <div className="row ">
                        <div className="form-group row">
                            <div className="col-sm-12">
                            <Col xs="12" md="12" sm="12">
                                <Table className="table table-bordered" size="sm">
                                <thead>
                                    <tr>
                                    <th>S.No.</th>
                                    <th>Professional </th>
                                    <th> Annexure</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                    <td> 1 &nbsp;&nbsp;</td>
                                    <td>
                                        {" "}
                                        Agreement between the entities to provide
                                        technical assistance
                                    </td>
                                    <td align="center" size="large">
                                        <input
                                        type="file"
                                        onChange={(e)=>setFile({file:e.target.files[0]})}
                                        class="employee-card-input"
                                        />
                                    </td>
                                    </tr>
                                    <tr>
                                    <td> 2&nbsp;&nbsp; </td>
                                    <td>
                                        Board resolutions of authorized signatory of
                                        firm/company provided technical assistance
                                    </td>
                                    <td align="center" size="large">
                                    <input
                                        type="file"
                                        onChange={(e)=>setFile({file:e.target.files[0]})}
                                        class="employee-card-input"
                                        />
                                    </td>
                                    </tr>
                                </tbody>
                                </Table>
                            </Col>
                            </div>
                        </div>
                        </div>
                    )}
                    </div>

                    <div className="hl"></div>
                    <p>
                    2. In case of technical capacity sought from another
                    company/firm who has already obtained license(s) under act of
                    1975 or outside Haryana:
                    </p>
                    <div className="form-group">
                    <input
                        type="radio"
                        value="Y"
                        id="alreadtObtainedLic"
                        className="mx-2 mt-1"
                        onChange={changeAlreadyObtainedLic}
                        name="alreadtObtainedLic"
                    />
                    <label for="Yes">Yes</label>

                    <input
                        type="radio"
                        value="N"
                        id="alreadtObtainedLicN"
                        className="mx-2 mt-1"
                        onChange={changeAlreadyObtainedLic}
                        name="alreadtObtainedLic"
                        onClick={handleshow6}
                    />
                    <label for="No">No</label>
                    {alreadtObtainedLic === "Y" && (
                        <div className="row ">
                        <div className="form-group row">
                            <div className="col-sm-12">
                            <Col xs="12" md="12" sm="12">
                                <div>
                                <Table className="table table-bordered" size="sm">
                                    <thead>
                                    <tr>
                                        <th>S.No.</th>
                                        <th>Agreement*</th>
                                        <th>Annexure </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td> 1 </td>
                                        <td> Registered and Irrevocable Agreement</td>
                                        <td align="center" size="large">
                                        <input 
                                            type="file"
                                            // onChange={((e)=> setRegisteredDoc(e.target.value))}
                                            onChange={(e)=>setFile({file:e.target.files[0]})}
                                            class="employee-card-input"
                                        />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td> 2 </td>
                                        <td>
                                        Board resolutions of authorized signatory of
                                        firm/company provided technical assistance
                                        </td>
                                        <td align="center" size="large">
                                        <input 
                                            type="file"
                                            // onChange={((e)=> setBoardDocY(e.target.value))}
                                            onChange={(e)=>setFile({file:e.target.files[0]})}
                                            class="employee-card-input"
                                        />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td> 3 </td>

                                        <td>
                                        Auto populate details of earlier license(s)
                                        granted to existing developer company/firm
                                        to set up a colony under act of 1975.
                                        </td>
                                        <td align="center" size="large">
                                        <input 
                                            type="file"
                                            // onChange={((e)=> setEarlierDocY(e.target.value))}
                                            onChange={(e)=>setFile({file:e.target.files[0]})}
                                            class="employee-card-input"
                                        />
                                        </td>
                                    </tr>
                                    </tbody>{" "}
                                </Table>
                                </div>
                            </Col>
                            </div>
                        </div>
                        </div>
                    )}
                    {alreadtObtainedLic === "N" && (
                        <div className="row ">
                        <div className="form-group row">
                            <div className="col-sm-12">
                            <div>
                                <Table className="table table-bordered" size="sm">
                                <thead>
                                    <tr>
                                    <th>S.No.</th>
                                    <th>Agreement*</th>
                                    <th>Annexure </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                    <td> 1 </td>
                                    <td>
                                        Agreement between the entities to provide
                                        technical assistance
                                    </td>
                                    <td align="center" size="large">
                                        <input 
                                        type="file"
                                        // onChange={((e)=> setTechnicalAssistanceAgreementDoc(e.target.value))}
                                        onChange={(e)=>setFile({file:e.target.files[0]})}
                                        class="employee-card-input"
                                        />
                                    </td>
                                    </tr>

                                    <tr>
                                    <td> 2 </td>
                                    <td>
                                        Board resolutions of authorized signatory of
                                        firm/company provided technical assistance
                                    </td>
                                    <td align="center" size="large">
                                    <input 
                                        type="file"
                                        // onChange={((e)=> setBoardDocN(e.target.value))}
                                        onChange={(e)=>setFile({file:e.target.files[0]})}
                                        class="employee-card-input"
                                        />
                                    </td>
                                    </tr>
                                    <tr>
                                    <td> 3 </td>

                                    <td>
                                        Auto populate details of earlier license(s)
                                        granted to existing developer company/firm to
                                        set up a colony under act of 1975.
                                    </td>
                                    <td align="center" size="large">
                                    <input 
                                            type="file"
                                            // onChange={((e)=> setEarlierDocN(e.target.value))}
                                            onChange={(e)=>setFile({file:e.target.files[0]})}
                                            class="employee-card-input"
                                        />
                                    </td>
                                    </tr>
                                </tbody>
                                </Table>
                            </div>
                            </div>

                        </div>
                        </div>
                    )}
                    </div>
                    {/* </Col> */}
                </div>
                {/* <div className="form-group col-md2 mt-4">
                    <button 
                        className="btn btn-success" 
                        style={{ float: "right" }} 
                        >
                    Submit
                    </button>
                </div> */}
               
        </FormStep>
      </div>
      <div style={{ disabled: "true", height: "30px", width: "100%", fontSize: "14px" }}></div>
      {showToast && <Toast error={showToast?.key === "error" ? true : false} label={error} isDleteBtn={true} onClose={() => { setShowToast(null); setError(null); }} />}
    </React.Fragment>
  );
};

export default DeveloperCapacity;