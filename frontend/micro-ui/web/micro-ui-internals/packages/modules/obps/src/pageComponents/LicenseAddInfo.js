import { BackButton, CardLabel, CardLabelError, FormStep, Loader, MobileNumber, RadioButtons, TextInput, ViewsIcon, DownloadIcon, Dropdown, DatePicker, RemoveIcon } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Timeline from "../components/Timeline";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useForm } from "react-hook-form";
// import Select from 'react-bootstrap/Select';
import { Button } from 'react-bootstrap';
import Popup from "reactjs-popup";
// import {
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
// } from "reactstrap";
import { Modal, ModalHeader, ModalFooter, ModalBody } from 'react-bootstrap';
import axios from "axios";
import ReactMultiSelect from "../../../../react-components/src/atoms/ReactMultiSelect";
import SearchDropDown from "../../../../react-components/src/atoms/searchDropDown";
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUpload from '@mui/icons-material/FileUpload'
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from "@mui/icons-material/Delete";
import { getDocShareholding } from "../../../tl/src/pages/employee/ScrutinyBasic/ScrutinyDevelopment/docview.helper";
import { MenuItem, Select } from "@mui/material";
const LicenseAddInfo = ({ t, config, onSelect, userType, formData, ownerIndex }) => {
  let validation = {};
  const { pathname: url } = useLocation();
  const devRegId = localStorage.getItem('devRegId');
  const userInfo = Digit.UserService.getUser();
  const [designation, setDesignation] = useState();
  const [aadharNumber, setAadharNumber] = useState();
  const [panNumber, setPanNumber] = useState();
  const [dob, setDOB] = useState();
  const [developerDataAddinfo, setDeveloperDataAddinfo] = useState([]);
  const [existingColonizer, setExistingColonizer] = useState();
  const [existingColonizerDetails, setExistingColonizerDetails] = useState({
    name: "",
    mobile: "",
    email: "",
    dob: "",
    pan: "",
    licNo: "",
    licDate: "",
    licValidity: "",
    licPurpose: "",
    aggreementBtw: "",
    boardResolution: ""
  })

  let isOpenLinkFlow = window.location.href.includes("openlink");


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
      const developerDataGetDocs = getDevDetails?.data?.devDetail[0]?.addInfo;
      setDeveloperDataAddinfo(developerDataGetDocs);


      // console.log("STAKEHOLDER",getDevDetails?.data?.devDetail[0]?.addInfo?.registeredContactNo); 
      setShowDevTypeFields(developerDataGet?.devDetail[0]?.addInfo?.showDevTypeFields);
      // setName(developerDataGet?.devDetail[0]?.addInfo?.name);
      setCompanyName(developerDataGet?.devDetail[0]?.addInfo?.companyName);
      setIncorporation(developerDataGet?.devDetail[0]?.addInfo?.incorporationDate);
      setRegistered(developerDataGet?.devDetail[0]?.addInfo?.registeredAddress);
      setUserEmail(developerDataGet?.devDetail[0]?.addInfo?.email);
      setUserEmailInd(developerDataGet?.devDetail[0]?.licenceDetails?.email);
      // setMobile(developerDataGet?.devDetail[0]?.addInfo?.mobileNumber);
      setGST(developerDataGet?.devDetail[0]?.addInfo?.gst_Number);
      setTbName(developerDataGet?.devDetail[0]?.addInfo?.sharName);
      setDesignition(developerDataGet?.devDetail[0]?.addInfo?.designition);
      setPercetage(developerDataGet?.devDetail[0]?.addInfo?.percentage);
      setUploadPDF(developerDataGet?.devDetail[0]?.addInfo?.uploadPdf);
      setSerialNumber(developerDataGet?.devDetail[0]?.addInfo?.serialNumber);
      setDirectorData(developerDataGet?.devDetail[0]?.addInfo?.directorsInformation || []);
      setCinNo(developerDataGet?.devDetail[0]?.addInfo?.cin_Number);
      setModalNAme(developerDataGet?.devDetail[0]?.addInfo?.modalNAme);
      setModaldesignition(developerDataGet?.devDetail[0]?.addInfo?.modaldesignition);
      setModalPercentage(developerDataGet?.devDetail[0]?.addInfo?.modalPercentage);
      setModalValuesArray(developerDataGet?.devDetail[0]?.addInfo?.shareHoldingPatterens || []);
      setOthersArray(developerDataGet?.devDetail[0]?.addInfo?.othersDetails || othersArray)
      setExistingColonizerDetails(developerDataGet?.devDetail[0]?.addInfo?.existingColonizerData || existingColonizerDetails)
      setExistingColonizer(developerDataGet?.devDetail[0]?.addInfo?.existingColonizer || "")
      setFinancialCapacity(developerDataGet?.devDetail[0]?.addInfo?.financialCapacity);
      setRegisteredMobileNumber(developerDataGet?.devDetail[0]?.addInfo?.registeredContactNo)
      // setShowDevTypeFields(valueOfDrop);
      let totalRemainingShareholdingPattern = 100;
      console.log("log123", developerDataGet?.devDetail[0]?.addInfo)
      developerDataGet?.devDetail[0]?.addInfo?.shareHoldingPatterens.forEach((item, index) => {
        console.log("log123", item, item.percentage, item.percentage.split("%"))
        totalRemainingShareholdingPattern -= Number(item.percentage.split("%")[0]);
        console.log("log123", item.percentage, item.percentage.split("%")[0], totalRemainingShareholdingPattern)
      })
      setRemainingStakeholderPercentage(Number(totalRemainingShareholdingPattern));
      console.log("log123", totalRemainingShareholdingPattern, developerDataGet?.devDetail[0]?.addInfo?.shareHoldingPatterens, developerDataGet?.devDetail[0]?.addInfo?.shareHoldingPatterens[0].percentage.split("%")[0])

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const interval = setTimeout(function () {
      getDeveloperData()
    }, 300);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [])



  const [name, setName] = useState((!isOpenLinkFlow ? userInfo?.info?.name : "") || formData?.LicneseDetails?.name || formData?.formData?.LicneseDetails?.name || "");
  const [mobileNumberUser, setMobileNumber] = useState((!isOpenLinkFlow ? userInfo?.info?.mobileNumber : "") ||
    formData?.LicneseDetails?.mobileNumberUser || formData?.formData?.LicneseDetails?.mobileNumberUser || ""
  );
  const [emailId, setUserEmailInd] = useState( formData?.LicneseDetails?.emailId || formData?.formData?.LicneseDetails?.emailId || "")
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const [developerTypeOptions, setDevTypeOptions] = useState({ data: [], isLoading: true })

  const isCitizenUrl = Digit.Utils.browser.isMobile() ? true : false;

  if (isOpenLinkFlow)
    window.onunload = function () {
      sessionStorage.removeItem("Digit.BUILDING_PERMIT");
    }
  const { isLoading, data: genderTypeData } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["GenderType"]);
  const { data: optionsArrList } = Digit.Hooks.obps.useMDMS(stateId, "Developer-type", ["DeveloperType"]);

  let menu = [];
  genderTypeData &&
    genderTypeData["common-masters"].GenderType.filter(data => data.active).map((genderDetails) => {
      menu.push({ code: `${genderDetails.code}`, value: `${genderDetails.code}` });
    });
  // console.log("GENDERs",menu);

  let arrayDevList = [];
  optionsArrList &&
    optionsArrList["Developer-type"].DeveloperType.map((devTypeDetails) => {
      arrayDevList.push({ code: `${devTypeDetails.code}`, value: `${devTypeDetails.code}` });
    });


  const { setValue, getValues, watch } = useForm();
  const [Documents, setDocumentsData] = useState([]);

  const DevelopersAllData = getValues();
  // console.log("DEVEDATAGEGT",DevelopersAllData);


  const [modal, setmodal] = useState(false);
  const [modalDirectors, setmodalDirector] = useState(false);
  const [data, setData] = useState([])
  const [devDetail, setdevDetail] = useState([])
  const [othersArray, setOthersArray] = useState([]);
  const [othersDetails, setOthersDetails] = useState({
    name: "",
    designation: "",
    aadharNumber: "",
    panNumber: "",
    dob: ""
  })
  const [addPeopleModal, setAddPeopleModal] = useState(false);
  const [purposeOptions, setPurposeOptions] = useState({ data: [], isLoading: true });

  const { data: PurposeType } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["Purpose"]);

  useEffect(() => {
    const purpose = PurposeType?.["common-masters"]?.Purpose?.map(function (data) {
      return { value: data?.purposeCode, label: data?.name };
    });
    console.log("log123", purpose)
    setPurposeOptions({ data: purpose, isLoading: false });
  }, [PurposeType])

  // useEffect(() => {
  //   fetch("https://apisetu.gov.in/mca/v1/companies/U72200CH1998PTC022006").then((result) => {
  //     result.json().then((resp) => {
  //       setData(resp)
  //     })
  //   })
  // }, [])
  // console.warn(data)

  const {
    register,
    handleSumit,
    formState: { error },
  } = useForm([
    { Sr: "", name: "", mobileNumber: "", email: "", PAN: "", Aadhar: "" },
  ]);

  const handleChange = (e) => {
    this.setState({ isRadioSelected: true });
  };
  const [showhide0, setShowhide0] = useState("No");
  const [showDevTypeFields, setShowDevTypeFields] = useState(formData?.LicneseDetails?.showDevTypeFields || formData?.formData?.LicneseDetails?.showDevTypeFields || "");
  const [FormSubmitted, setFormSubmitted] = useState(false);
  const [showhide, setShowhide] = useState("No");
  const [cin_Number, setCinNo] = useState(formData?.LicneseDetails?.cin_Number || formData?.formData?.LicneseDetails?.cin_Number || "");
  const [companyName, setCompanyName] = useState(formData?.LicneseDetails?.companyName || formData?.LicneseDetails?.companyName || "");
  const [incorporationDate, setIncorporation] = useState(formData?.LicneseDetails?.incorporationDate || formData?.LicneseDetails?.incorporationDate || "");
  const [registeredAddress, setRegistered] = useState(formData?.LicneseDetails?.registeredAddress || formData?.LicneseDetails?.registeredAddress || "");
  // const [email, setEmail] = useState(formData?.LicneseDetails?.email || formData?.LicneseDetails?.email || "");
  const [email, setUserEmail] = useState(formData?.LicneseDetails?.email || formData?.formData?.LicneseDetails?.email || "");
  const [registeredContactNo, setRegisteredMobileNumber] = useState(formData?.LicneseDetails?.registeredContactNo || formData?.LicneseDetails?.registeredContactNo || "");
  const [gst_Number, setGST] = useState("");
  const [sharName, setTbName] = useState("");
  const [designition, setDesignition] = useState("");
  const [percentage, setPercetage] = useState("");
  const [uploadPdf, setUploadPDF] = useState(DevelopersAllData?.uploadPdf || "");
  const [serialNumber, setSerialNumber] = useState("");
  const [DirectorData, setDirectorData] = useState([]);
  const [modalNAme, setModalNAme] = useState("");
  const [modaldesignition, setModaldesignition] = useState("");
  const [modalPercentage, setModalPercentage] = useState("");
  // const dispatch = useDispatch();

  const [modalValuesArray, setModalValuesArray] = useState([]);
  const [modalDirectorValuesArray, setModalDirectorValuesArray] = useState([]);
  const [modalDIN, setModalDIN] = useState("")
  const [modalDirectorName, setModalDirectorName] = useState("")
  const [modalDirectorContact, setModalContactDirector] = useState("")
  const [financialCapacity, setFinancialCapacity] = useState([]);

  const [docUpload, setDocuploadData] = useState([])
  const [file, setFile] = useState(null);
  const [cinValError, setCINValError] = useState("")
  const [showDevTypeFieldsValue, setShowDevTypeFieldsValue] = useState("")
  const [remainingStakeholderPercentage, setRemainingStakeholderPercentage] = useState(100);
  const [show, setShow] = useState(false);
  const [showStake, setShowStakeholder] = useState(false);

  // console.log("ADINFO",developerDataAddinfo);

  const [urlGetShareHoldingDoc, setDocShareHoldingUrl] = useState("")
  const [urlGetDirectorDoc, setDocDirectorUrl] = useState("")
  const handleShowStakeholder = () => {
    setShowStakeholder(true)
    setModalNAme("");
    setModaldesignition("");
    setModalPercentage("");
  };
  const handleCloseStakeholder = () => setShowStakeholder(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true)
    setModalDIN("");
    setModalDirectorName("");
    setModalContactDirector("");
  };
  // console.log(devRegId);
  const handleshow = (e) => {
    const getshow = e.target.value;
    setShowhide(getshow);
  };
  function selectModalContactDirector(value) {
    setModalContactDirector(value)
  }
  function SelectName(e) {
    setName(e.target.value);
  }
  function setMobileNo(e) {
    setMobileNumber(e.target.value);
  }
  function selectRegisteredMobile(value) {
    setRegisteredMobileNumber(value);
  }
  function setUserEmailId(value) {
    setUserEmail(value);
  }
  function setUserEmailIndVal(e) {
    setUserEmailInd(e.target.value);
  }
  function selectCinNumber(e) {
    setCinNo(e.target.value.toUpperCase())
  }
  function selectDinNumber(value) {
    setModalDIN(value)
  }
  const handleshow0 = (e) => {
    const getshow = e.target.value;
    setShowhide0(getshow);
    localStorage.setItem('devTypeFlag', getshow)
  };

  const setDevType = (data) => {
    const getDevTypeValue = data?.value;
    setShowDevTypeFields(getDevTypeValue);
    localStorage.setItem('devTypeValueFlag', getDevTypeValue)
  }
  // function setDevType(value){
  //   setShowDevTypeFields(value)
  //   console.log(value);
  // }
  const getDocumentData = async (file, fieldName, type, index) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("tenantId", "hr");
    formData.append("module", "property-upload");
    formData.append("tag", "tag-property");
    // setLoader(true);
    try {
      const Resp = await axios.post("/filestore/v1/files", formData, {}).then((response) => {
        return response;
      });
      console.log(Resp?.data?.files?.[0]?.fileStoreId, fieldName,type, index);

      if (type === "existingColonizer") {
        console.log("log123 ====> ", fieldName, Resp?.data?.files?.[0]?.fileStoreId, Resp)
        setExistingColonizerDetails({ ...existingColonizerDetails, [fieldName]: Resp?.data?.files?.[0]?.fileStoreId })
      } else if( type === "shareholdingPattern" ) {
        console.log("entered into shareholding case");
        let temp = modalValuesArray;
        temp[index].uploadPdf = Resp?.data?.files?.[0]?.fileStoreId;
        setModalValuesArray([...temp])
        console.log("set into shareholding case",temp,modalValuesArray);
      } else if ( type === "directorInfoPdf" ){
        console.log("entered into directorInfo case");
        let temp = DirectorData;
        temp[index].uploadPdf = Resp?.data?.files?.[0]?.fileStoreId;
        setDirectorData([...temp])
        console.log("set into directorInfo case",temp,DirectorData);
      } else {
        setValue(fieldName, Resp?.data?.files?.[0]?.fileStoreId);
        // setDocId(Resp?.data?.files?.[0]?.fileStoreId);
        console.log("getValues()=====", getValues());
        setDocumentsData(getValues())
      }

    } catch (error) {
      //   setLoader(false);
      console.log(error.message);
    }
  };
  // useEffect(() => {
  //   getDocumentData();
  // }, [file]);

  // const getDocShareholding = async () => {
  //   if ((Documents?.uploadPdf !== null || Documents?.uploadPdf !== undefined) && (uploadPdf !== null || uploadPdf !== "")) {

  //     try {
  //       const response = await axios.get(`/filestore/v1/files/url?tenantId=${tenantId}&fileStoreIds=${Documents?.uploadPdf}`, {

  //       });
  //       const FILDATA = response.data?.fileStoreIds[0]?.url;
  //       setDocShareHoldingUrl(FILDATA)
  //     } catch (error) {
  //       console.log(error.message);
  //     }
  //   }
  // }

  // useEffect(() => {
  //   if ((Documents?.uploadPdf !== null || Documents?.uploadPdf !== undefined) && (uploadPdf !== null || uploadPdf !== "")) {
  //     getDocShareholding(Documents?.uploadPdf);
  //   }
  // }, [Documents?.uploadPdf]);


  // const getDocDirector = async () => {
  //   if ((Documents?.uploadPdf !== null || Documents?.uploadPdf !== undefined) && (uploadPdf !== null || uploadPdf !== "")) {

  //     try {
  //       const response = await axios.get(`/filestore/v1/files/url?tenantId=${tenantId}&fileStoreIds=${Documents?.uploadPdf}`, {

  //       });
  //       const FILDATA = response.data?.fileStoreIds[0]?.url;
  //       setDocDirectorUrl(FILDATA)
  //     } catch (error) {
  //       console.log(error.message);
  //     }
  //   }
  // }

  // useEffect(() => {
  //     getDocDirector();
  // }, [Documents?.uploadPdf]);


  const HandleGetMCNdata = async () => {
    try {
      if (cin_Number.length === 21) {
        const Resp = await axios.get(`/mca/v1/companies/${cin_Number}`, {
          headers: {
            'Content-Type': 'application/json',
            'X-APISETU-APIKEY': 'PDSHazinoV47E18bhNuBVCSEm90pYjEF',
            'X-APISETU-CLIENTID': 'in.gov.tcpharyana',
            'Access-Control-Allow-Origin': "*",
          }
        })

        const Directory = await axios.get(`/mca-directors/v1/companies/${cin_Number}`, {
          headers: {
            'Content-Type': 'application/json',
            'X-APISETU-APIKEY': 'PDSHazinoV47E18bhNuBVCSEm90pYjEF',
            'X-APISETU-CLIENTID': 'in.gov.tcpharyana',
            'Access-Control-Allow-Origin': "*",
          }
        })

        // console.log("CIN",Resp.data)
        // console.log(Directory.data);
        if(DirectorData && DirectorData.length){
          console.log("log1", DirectorData, Directory.data)
        } else {
          console.log("log2", DirectorData, Directory.data)
          setDirectorData(Directory.data);
        }
        setCompanyName(Resp.data.companyName)
        setIncorporation(Resp.data.incorporationDate)
        setUserEmail(Resp.data.email)
        //console.log(Resp.data.Email)
        setRegistered(Resp.data.registeredAddress)
        setMobile(Resp.data.registeredContactNo)
        //  setGST(Resp.data.GST)

      }
    } catch (error) {

      console.log(error?.response?.data?.error_description);
      setCINValError(error?.response?.data?.error_description)
    }
  }


  const handleArrayValues = () => {

    if (modalNAme !== "" && modaldesignition !== "" && modalPercentage !== "") {
      setRemainingStakeholderPercentage(Number(Number(remainingStakeholderPercentage) - Number(modalPercentage)).toFixed(2));
      const values = {
        "name": modalNAme,
        "designition": modaldesignition,
        "percentage": modalPercentage + "%",
        "uploadPdf": Documents?.uploadPdf,
        "serialNumber": null
      }
      setModalValuesArray((prev) => [...prev, values]);
      setDocumentsData([]);
      handleCloseStakeholder();
    }
  }

  const handleAddPeople = () => {

    if (othersDetails.name && othersDetails.designation && othersDetails.aadharNumber && othersDetails.panNumber && othersDetails.dob) {
      setOthersArray((prev) => [...prev, othersDetails]);
      setOthersDetails({
        name: "",
        designation: "",
        aadharNumber: "",
        panNumber: "",
        dob: ""
      })
      setAddPeopleModal(false)
    }
  }

  const handleDirectorsArrayValues = () => {

    if (modalDIN !== "" && modalDirectorName !== "" && modalDirectorContact !== "") {

      const values = {
        "din": modalDIN,
        "name": modalDirectorName,
        "contactNumber": modalDirectorContact,
        "uploadPdf": Documents?.directorInfoPdf,
        "serialNumber": null
      }

      setDirectorData((prev) => [...prev, values]);
      setDocumentsData([]);
      // getDocDirector();
      handleClose();
    }
  }
  // console.log("FORMARRAYVAL",modalValuesArray);
  useEffect(() => {
    HandleGetMCNdata();
  }, [cin_Number])



  const [noofRows, setNoOfRows] = useState(1);
  const [aoofRows, setAoOfRows] = useState(1);


  const deleteTableRows = (i) => {
    const rows = [...modalValuesArray];
    let tempRows = rows.splice(i, 1);
    console.log("log123", tempRows)
    // if(remainingStakeholderPercentage === 100){
    setRemainingStakeholderPercentage(Number(remainingStakeholderPercentage) + Number(tempRows[0].percentage.split("%")[0]))
    // }
    setModalValuesArray(rows);
  }
  const deleteDirectorTableRows = (i) => {
    const DirectorTableRows = [...DirectorData];
    DirectorTableRows.splice(i, 1);
    setDirectorData(DirectorTableRows);
  }

  // if (isLoading) return <Loader />;
  const goNext = async (e) => {
    // const cin_match = cin_Number.match(Digit.Utils.getPattern('CIN'));
    // if(!cin_match) {
    //   alert("NOT Matched");
    // } else {
    //   alert("Matched");
    // }
    if (!(formData?.result && formData?.result?.Licenses[0]?.id)) {
      let addInfo = {
        showDevTypeFields: showDevTypeFields,
        name: name,
        mobileNumberUser: mobileNumberUser,
        cin_Number: cin_Number,
        companyName: companyName,
        incorporationDate: incorporationDate,
        registeredAddress: registeredAddress,
        email: email,
        emailId: emailId,
        registeredContactNo: registeredContactNo,
        gst_Number: gst_Number,
        directorsInformation: DirectorData || modalDirectorValuesArray,
        shareHoldingPatterens: modalValuesArray,
        othersDetails: othersArray,
        existingColonizerData: existingColonizerDetails,
        existingColonizer: existingColonizer
      }
      onSelect(config.key, addInfo);
      // console.log("DATALICDET",addInfo);
      // localStorage.setItem("addInfo",JSON.stringify(addInfo));

      const developerRegisterData = {
        "id": userInfo?.info?.id,
        "pageName": "addInfo",
        "createdBy": userInfo?.info?.id,
        "updatedBy": userInfo?.info?.id,
        "devDetail": {

          "addInfo": addInfo
        }
      }
      Digit.OBPSService.CREATEDeveloper(developerRegisterData, tenantId)
        .then((result, err) => {
          // console.log("DATA",result?.id);
          // localStorage.setItem('devRegId',JSON.stringify(result?.id));
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
      data.LicneseDetails.showDevTypeFields = showDevTypeFields,
        data.LicneseDetails.cin_Number = cin_Number,
        data.LicneseDetails.companyName = companyName,
        data.LicneseDetails.incorporationDate = incorporationDate,
        data.LicneseDetails.registeredAddress = registeredAddress,
        data.LicneseDetails.email = email,

        data.LicneseDetails.registeredContactNo = registeredContactNo,
        data.LicneseDetails.gst_Number = gst_Number,
        data.LicneseDetails.directorsInformation = DirectorData,
        data.LicneseDetails.shareHoldingPatterens = modalValuesArray
      data.LicneseDetails.othersDetails = othersArray

      onSelect("", formData)
    }



  };

  var regNumber = /^\d+$/;
  //   const handleStakeholderPercentageChange = (value) => {
  //     console.log("loggg",value,value.split("%")[0],reg.test(value.split("%")[0]))
  //     if(value && reg.test(value)){
  //       setModalPercentage(value);
  //     }
  // }


  const onSkip = () => onSelect();

  return (
    <div>
      <div className={isOpenLinkFlow ? "OpenlinkContainer" : ""}>
        {/* {JSON.stringify(showDevTypeFields)}efewfewfef */}
        {isOpenLinkFlow && <BackButton style={{ border: "none" }}>{t("CS_COMMON_BACK")}</BackButton>}
        <Timeline currentStep={2} flow="STAKEHOLDER" />
        {!isLoading ?
          <FormStep
            // onSubmit={AddInfoForm}
            config={config}
            onSelect={goNext}
            onSkip={onSkip}
            // isDisabled={
            //   (showDevTypeFields === "00" || showDevTypeFields == undefined) ||
            //   !cin_Number?.match(Digit.Utils.getPattern('CIN')) ||
            //   !registeredContactNo?.match(Digit.Utils.getPattern('MobileNo')) ||
            //   !gst_Number?.match(Digit.Utils.getPattern('GSTNo'))
            // }
            // isDisabled={
            //   !showDevTypeFields || (showDevTypeFields === "Individual" && (!name || !mobileNumberUser?.match(Digit.Utils.getPattern('MobileNo')) || !emailId?.match(Digit.Utils.getPattern('Email')))) || (showDevTypeFields === "Others" && othersArray.length) || (showDevTypeFields === "Proprietorship Firm") || (showDevTypeFields && showDevTypeFields !== "Proprietorship Firm" && showDevTypeFields !== "Individual" && showDevTypeFields !== "Others" && (!cin_Number?.match(Digit.Utils.getPattern('CIN')) || !registeredContactNo?.match(Digit.Utils.getPattern('MobileNo')) || !gst_Number?.match(Digit.Utils.getPattern('GSTNo')) || !((existingColonizer === "N") || (existingColonizer === "Y" && existingColonizerDetails.aggreementBtw && existingColonizerDetails.boardResolution && existingColonizerDetails.dob && existingColonizerDetails.pan && existingColonizerDetails.pan.match(Digit.Utils.getPattern('PAN')) && existingColonizerDetails.licNo && existingColonizerDetails.licDate && existingColonizerDetails.licValidity && existingColonizerDetails.licPurpose))))
            // }
            isDisabled={ ( showDevTypeFields === "Individual" || showDevTypeFields === "Proprietorship Firm" ) ? !(name && mobileNumberUser?.match(Digit.Utils.getPattern('MobileNo')) && emailId?.match(Digit.Utils.getPattern('Email'))) : (showDevTypeFields === "Others") ? (!othersArray.length) : (showDevTypeFields === "Proprietorship Firm") ? false : (showDevTypeFields && showDevTypeFields !== "Proprietorship Firm" && showDevTypeFields !== "Individual" && showDevTypeFields !== "Others") ? (!cin_Number?.match(Digit.Utils.getPattern('CIN')) || !registeredContactNo?.match(Digit.Utils.getPattern('MobileNo')) || !gst_Number?.match(Digit.Utils.getPattern('GSTNo')) || !((existingColonizer === "N") || (existingColonizer === "Y" && existingColonizerDetails.aggreementBtw && existingColonizerDetails.boardResolution && existingColonizerDetails.dob && existingColonizerDetails.pan && existingColonizerDetails.pan.match(Digit.Utils.getPattern('PAN')) && existingColonizerDetails.licNo && existingColonizerDetails.licDate && existingColonizerDetails.licValidity && existingColonizerDetails.licPurpose))) : true}
            t={t}
          >
            <div className="happy">
              <div className="card mb-3">
                <h5 className="card-title fw-bold">Developer's type</h5>
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="form-group row">
                        <div className="col-sm-4">
                          <CardLabel class="required">{`${t("Select Developer's Type")}`}<span class="text-danger font-weight-bold mx-2">*</span></CardLabel>
                          <Dropdown
                            labels="Select Type"
                            className="form-field"
                            selected={showDevTypeFields}
                            option={arrayDevList}
                            select={setDevType}
                            value={showDevTypeFields}
                            optionKey="code"
                            name="showDevTypeFields"
                            placeholder={showDevTypeFields}
                            style={{ width: "100%" }}
                            t={t}
                            required
                          />
                          {/* <Select
                            onChange={(e) => setDevType({showDevTypeFields: e.target.value })}
                            value={showDevTypeFields}
                            className="w-100"
                            variant="standard"
                          >
                            {
                              arrayDevList.map((item, index) => (
                                <MenuItem value={item.code} >{item?.code}</MenuItem>
                              ))
                            }
                          </Select> */}
                          {/* <MuiDropdown 
                          listOfData={optionsArrList}
                          labels="text"
                        /> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FOR INDIVIDUAL */}
              {(showDevTypeFields === "Individual" || showDevTypeFields == "Proprietorship Firm") && (
                <div className="card mb-3">
                  {/* <div className="card-header">
              <h5 className="card-title"> Developer</h5>
            </div> */}
                  <h5 className="card-title fw-bold">Developer Details</h5>
                  <div className="card-body">
                    <div className="row">
                      <div className="col col-4">
                        <div className="form-group">

                          <label htmlFor="name">Name</label>

                          <input
                            type="text"
                            value={name}
                            name="name"
                            // onChange={SelectName}
                            onChange={(e) => setName(e.target.value)}
                            disabled
                            className="employee-card-input"

                          />
                        </div>
                      </div>
                      <div className="col col-4">
                        <div className="form-group ">
                          <label htmlFor="email"> Email </label>
                          <input
                            type="text"
                            value={emailId}
                            placeholder={emailId}
                            name="emailId"
                            onChange={(e) => setUserEmailIndVal(e.target.value)}
                            // disabled="disabled"
                            className="employee-card-input"
                          // name="email"
                          // className={`employee-card-input`}
                          // placeholder=""
                          // {...register("email", {
                          //   required: "Email is required",
                          //   pattern: {
                          //     value: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
                          //     message: "Email must be a valid email address",
                          //   },
                          // })}
                          />
                          {emailId && emailId.length > 0 && !emailId.match(Digit.Utils.getPattern('Email')) && <CardLabelError style={{ width: "100%", marginTop: '-15px', fontSize: '16px', marginBottom: '12px', color: 'red' }}>{("Invalid Email Address")}</CardLabelError>}
                        </div>
                      </div>
                      <div className="col col-4">
                        <div className="form-group">
                          <label htmlFor="name">Mobile No.</label>
                          <input
                            value={mobileNumberUser}
                            placeholder={mobileNumberUser}
                            name="mobileNumberUser"
                            onChange={(e) => setMobileNumber(e.target.value)}
                            disabled
                            className="employee-card-input"
                          // name="name"
                          // className={`employee-card-input`}
                          // placeholder=""
                          // {...register("name", {
                          //   required: "Name is required",
                          //   pattern: {
                          //     value: /^[a-zA-Z]+$/,
                          //     message: "Name must be a valid string",
                          //   },
                          //   minLength: {
                          //     value: 3,
                          //     message:
                          //       "Name should be greater than 3 characters",
                          //   },
                          //   maxLength: {
                          //     value: 20,
                          //     message:
                          //       "Name shouldn't be greater than 20 characters",
                          //   },
                          // })}
                          />
                          {mobileNumberUser && mobileNumberUser.length > 0 && !mobileNumberUser.match(Digit.Utils.getPattern('MobileNo')) && <CardLabelError style={{ width: "100%", marginTop: '-15px', fontSize: '16px', marginBottom: '12px', color: 'red' }}>{t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID")}</CardLabelError>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FOR PROPR */}

              {showDevTypeFields === "Others" && (
                <div className="card mb-3">
                  {/* <div className="card-header">
              <h5 className="card-title"> Developer</h5>
            </div> */}
                  <h5 className="card-title fw-bold">Developer Details</h5>
                  <div className="card-body">

                    <div className="table-bd">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Sr. No</th>
                            <th>Name</th>
                            <th>Designition</th>
                            <th>Aadhar Number</th>
                            <th>Pan Number</th>
                            <th>Date of Birth (DOB)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            (othersArray?.length > 0) ?
                              othersArray.map((elementInArray, input) => {
                                return (
                                  <tr>
                                    <td>{input + 1}</td>
                                    <td>
                                      <input
                                        type="text"
                                        value={elementInArray?.name}
                                        placeholder={elementInArray?.name}
                                        readOnly
                                        disabled="disabled"
                                        class="employee-card-input"
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        value={elementInArray?.designation}
                                        placeholder={elementInArray?.designation}
                                        readOnly
                                        disabled="disabled"
                                        class="employee-card-input"
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        value={elementInArray.aadharNumber}
                                        placeholder={elementInArray.aadharNumber}
                                        readOnly
                                        disabled="disabled"
                                        class="employee-card-input"
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        value={elementInArray.panNumber}
                                        placeholder={elementInArray.panNumber}
                                        readOnly
                                        disabled="disabled"
                                        class="employee-card-input"
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        value={elementInArray.dob}
                                        placeholder={elementInArray.dob}
                                        readOnly
                                        disabled="disabled"
                                        class="employee-card-input"
                                      />
                                    </td>
                                  </tr>
                                );
                              })
                              :
                              <p className="text-danger text-center d-none">Click on the Add More Button</p>
                          }
                        </tbody>
                      </table>
                    </div>

                    <div>
                      <button
                        type="button"
                        style={{
                          color: "white",
                        }}
                        // disabled={!remainingStakeholderPercentage}
                        className="btn btn-primary mt-3"
                        // onClick={() => setNoOfRows(noofRows + 1)}
                        // onClick={() => setmodal(true)}
                        onClick={() => setAddPeopleModal(true)}
                      >
                        Add More
                      </button>
                      <Modal show={addPeopleModal} onHide={() => setAddPeopleModal(false)} animation={false}>
                        <Modal.Header closeButton>
                          <Modal.Title>Add People</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <form className="text1" id="myForm">
                            <Row>
                              <Col md={3} xxl lg="4">
                                <label htmlFor="name" className="text">Name <span className="text-danger font-weight-bold">*</span></label>
                                <TextInput
                                  type="text"
                                  isMandatory={false}
                                  onChange={(e) => setOthersDetails({ ...othersDetails, name: e.target.value })}
                                  placeholder=""
                                  required
                                  class="employee-card-input"
                                  value={othersDetails.name}
                                  maxlength={"50"}
                                />
                              </Col>
                              <Col md={3} xxl lg="4">
                                <label htmlFor="designation" className="text">  Designition <span className="text-danger font-weight-bold">*</span></label>
                                <TextInput
                                  type="text"
                                  isMandatory={false}
                                  onChange={(e) => setOthersDetails({ ...othersDetails, designation: e.target.value })}
                                  placeholder=""
                                  class="employee-card-input"
                                  value={othersDetails.designation}
                                  maxlength={"2"}
                                />
                              </Col>

                              <Col md={3} xxl lg="4">
                                <label htmlFor="name" className="text"> Aadhar Number <span className="text-danger font-weight-bold">*</span></label>
                                <TextInput
                                  type="number"
                                  isMandatory={false}
                                  value={othersDetails.aadharNumber}
                                  onChange={(e) => setOthersDetails({ ...othersDetails, aadharNumber: e.target.value })}
                                  placeholder=""
                                  class="aadhar-card-input"
                                  maxlength={"12"}
                                />

                                {othersDetails.aadharNumber && othersDetails.aadharNumber.length > 0 && !othersDetails.aadharNumber.match(Digit.Utils.getPattern('AadharNo')) && <CardLabelError style={{ width: "100%", marginTop: '-15px', fontSize: '16px', marginBottom: '12px', color: 'red' }}>{t("BPA_INVALID_AADHAR_NO")}</CardLabelError>}

                                {/* {
                              (modalPercentage && (remainingStakeholderPercentage < modalPercentage || modalPercentage<=0 )) &&
                            <CardLabelError style={{ width: "100%", marginTop: '-15px', fontSize: '16px', marginBottom: '12px', color: 'red' }}>Please enter a valid percentage for the stakeholder</CardLabelError>
                            } */}

                                {/* {
                              (modalPercentage && (remainingStakeholderPercentage < modalPercentage || modalPercentage<=0 )) &&
                            <CardLabelError style={{ width: "100%", marginTop: '-15px', fontSize: '16px', marginBottom: '12px', color: 'red' }}>{t("BPA_INVALID_PERCENTAGE")}</CardLabelError>
                            } */}


                                {/* {((modalPercentage && !modalPercentage+"%".match(Digit.Utils.getPattern('Percentage')) )&& (modalPercentage > remainingStakeholderPercentage || modalPercentage > 0 ))&& <CardLabelError style={{ width: "100%", marginTop: '-15px', fontSize: '16px', marginBottom: '12px', color: 'red' }}>Please enter a valid percentage fot the stakeholder</CardLabelError>} */}

                                {/* {modalPercentage && modalPercentage.length > 0 && !modalPercentage+"%".match(Digit.Utils.getPattern('Percentage')) && modalPercentage <= remainingStakeholderPercentage && <CardLabelError style={{ width: "100%", marginTop: '-15px', fontSize: '16px', marginBottom: '12px', color: 'red' }}>{t("BPA_INVALID_PERCENTAGE")}</CardLabelError>} */}

                              </Col>

                              <Col md={3} xxl lg="4">
                                <label htmlFor="pan" className="text">  Pan Number <span className="text-danger font-weight-bold">*</span></label>
                                <TextInput
                                  type="text"
                                  isMandatory={false}
                                  onChange={(e) => setOthersDetails({ ...othersDetails, panNumber: e.target.value })}
                                  placeholder=""
                                  class="employee-card-input"
                                  value={othersDetails.panNumber}
                                  maxlength={"10"}
                                />

                                {othersDetails.panNumber && othersDetails.panNumber.length > 0 && !othersDetails.panNumber.match(Digit.Utils.getPattern('PAN')) && <CardLabelError style={{ width: "100%", marginTop: '-15px', fontSize: '16px', marginBottom: '12px', color: 'red' }}>{t("BPA_INVALID_PAN_NO")}</CardLabelError>}

                              </Col>

                              <Col md={3} xxl lg="4">
                                <label htmlFor="dob" className="text">  Date of Birth (DOB) <span className="text-danger font-weight-bold">*</span></label>
                                <input
                                  type="date"
                                  required
                                  onChange={(e) => setOthersDetails({ ...othersDetails, dob: e.target.value })}
                                  placeholder=""
                                  class="employee-card-input"
                                  value={othersDetails.dob}
                                />

                              </Col>

                            </Row>
                          </form>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={() => setAddPeopleModal(false)}>
                            Close
                          </Button>
                          <Button variant="primary" disabled={!othersDetails.name || !othersDetails.designation || !othersDetails.aadharNumber || !othersDetails.panNumber || !othersDetails.panNumber.match(Digit.Utils.getPattern('PAN')) || !othersDetails.aadharNumber.match(Digit.Utils.getPattern('AadharNo')) || !othersDetails.dob} onClick={handleAddPeople}>
                            Save Changes
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </div>

                  </div>
                </div>
              )}


              {/* FOR COMPANY */}
              {(showDevTypeFields && showDevTypeFields !== "Individual" && showDevTypeFields !== "Proprietorship Firm" && showDevTypeFields !== "Others") && (
                <div className="card mb-3">
                  {/* <div className="card-header">
              <h5 className="card-title"> Developer</h5>
            </div> */}
                  <h5 className="card-title fw-bold">Developer Details</h5>
                  <div className="card-body">
                    <div className="row">
                      <div className="col col-4">
                        <div className="form-group">
                          <label htmlFor="name">CIN Number <span className="text-danger font-weight-bold">*</span></label>
                          <TextInput
                            type="text"
                            onChange={selectCinNumber}
                            // onChange={(e) => setCinNo(e.target.value)}
                            value={cin_Number}
                            name="cin_Number"
                            // isMendatory={false}
                            placeholder={cin_Number}
                            className="employee-card-input text-uppercase"
                            max={"21"}
                            {...(validation = {
                              // isRequired: true,
                              pattern: "^[A-Z0-9]*$",
                              type: "text",
                              maxlength: "21",
                              title: "Please Enter CIN Number"
                            })}
                          />
                          {cin_Number && cin_Number.length > 0 && !cin_Number.match(Digit.Utils.getPattern('CIN')) && <CardLabelError style={{ width: "100%", marginTop: '-15px', fontSize: '16px', marginBottom: '12px', color: 'red' }}>{t("BPA_INVALID_CIN_NO")}</CardLabelError>}
                          <h3 className="error-message" style={{ color: "red" }}>{cinValError}</h3>
                        </div>
                      </div>
                      <div className="col col-4">
                        <div className="form-group">

                          <label htmlFor="name">Company Name <span className="text-danger font-weight-bold">*</span></label>

                          <TextInput
                            type="text"
                            value={companyName}
                            placeholder={companyName}
                            name="companyName"

                            onChange={(e) => setCompanyName(e.target.value)}
                            // disabled="disabled"
                            className="employee-card-input"
                            // isMendatory={false}
                            {...(validation = {
                              // isRequired: true,
                              type: "text",
                              maxlength: "50",
                              title: "Please Enter Company Name"
                            })}
                          // placeholder=""
                          // {...register("name", {
                          //   required: "Name is required",
                          //   pattern: {
                          //     value: /^[a-zA-Z]+$/,
                          //     message: "Name must be a valid string",
                          //   },
                          //   minLength: {
                          //     value: 3,
                          //     message:
                          //       "Name should be greater than 3 characters",
                          //   },
                          //   maxLength: {
                          //     value: 20,
                          //     message:
                          //       "Name shouldn't be greater than 20 characters",
                          //   },
                          // })}
                          />
                        </div>
                      </div>
                      <div className="col col-4">
                        <div className="form-group">
                          <label htmlFor="name">Date of Incorporation <span className="text-danger font-weight-bold">*</span></label>
                          <DatePicker
                            // isMandatory={false}

                            date={incorporationDate}
                            name="incorporationDate"
                            onChange={(e) => setIncorporation(e)}
                            disable={false}
                            {...(validation = {
                              // isRequired: true,
                              type: "date",
                              title: "Please Enter Date of Incorporation"
                            })}
                          />
                          {/* <input
                        type="text"
                        value={incorporationDate}
                        placeholder={incorporationDate}
                        onChange={(e) => setIncorporation(e.target.value)}
                        // disabled="disabled"
                        className="employee-card-input"
                      /> */}
                        </div>
                      </div>
                      <div className="col col-4">
                        <div className="form-group">
                          <label htmlFor="name">Registered Address <span className="text-danger font-weight-bold">*</span></label>
                          <TextInput
                            type="text"
                            name="registeredAddress"
                            value={registeredAddress}
                            placeholder={registeredAddress}
                            onChange={(e) => setRegistered(e.target.value)}
                            // disabled="disabled"
                            className="employee-card-input"
                            // isMandatory={false}

                            {...(validation = {
                              isRequired: true,
                              error: "Address is required"
                            })}
                          />
                          {registeredAddress && !registeredAddress.length > 0 && <CardLabelError style={{ width: "100%", marginTop: '-15px', fontSize: '16px', marginBottom: '12px', color: 'red' }}>{t("BPA_INVALID_CIN_NO")}</CardLabelError>}
                        </div>
                      </div>
                      <div className="col col-4">
                        <div className="form-group ">
                          <label htmlFor="email"> Email <span className="text-danger font-weight-bold">*</span></label>

                          <TextInput
                            t={t}
                            type={"email"}
                            // isMandatory={false}
                            optionKey="i18nKey"
                            name="email"

                            value={email}
                            placeholder={email}
                            // onChange={setEmail}
                            onChange={(e) => setUserEmailId(e.target.value)}
                            //disable={editScreen}
                            {...(validation = {
                              isRequired: true,
                              required: "Email is required"
                            })}

                          />
                          {email && email.length > 0 && !email.match(Digit.Utils.getPattern('Email')) && <CardLabelError style={{ width: "100%", marginTop: '-15px', fontSize: '16px', marginBottom: '12px', color: 'red' }}>{("Invalid Email Address")}</CardLabelError>}
                        </div>
                      </div>
                      <div className="col col-4">
                        <div className="form-group">
                          <label htmlFor="name">Mobile No. <span className="text-danger font-weight-bold">*</span></label>

                          {/* <MobileNumber
                        value={registeredContactNo}
                        maxlength={"10"}
                        pattern={"[6-9]{1}[0-9]{9}"}                        
                        name="registeredContactNo"
                        onChange={selectRegisteredMobile}
                        isMandatory={false}
                        {...(validation = {
                          isRequired: true,
                          title: "Please enter Mobile no."
                        })}
                        
                      /> */}
                          <MobileNumber
                            value={registeredContactNo}
                            name="registeredContactNo"
                            maxlength={"10"}

                            onChange={selectRegisteredMobile}
                            // disable={mobileNumber && !isOpenLinkFlow ? true : false}
                            {...{ required: true, pattern: "[6-9]{1}[0-9]{9}", type: "tel", title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID") }}
                          />
                          {registeredContactNo && registeredContactNo.length > 0 && !registeredContactNo.match(Digit.Utils.getPattern('MobileNo')) && <CardLabelError style={{ width: "100%", marginTop: '-15px', fontSize: '16px', marginBottom: '12px', color: 'red' }}>{t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID")}</CardLabelError>}
                        </div>
                      </div>
                      <div className="col col-4">
                        <div className="form-group">
                          <label htmlFor="name">GST No. <span className="text-danger font-weight-bold">*</span></label>
                          <TextInput
                            type="text"

                            value={gst_Number}
                            placeholder={gst_Number}
                            onChange={(e) => setGST(e.target.value.toUpperCase())}
                            className="employee-card-input"
                            name="gst_Number"
                            {...{ required: true, maxlength: "15", title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID") }}
                          // className={`employee-card-input`}
                          // placeholder=""
                          // {...register("name", {
                          //   required: "Name is required",
                          //   pattern: {
                          //     value: /^[a-zA-Z]+$/,
                          //     message: "Name must be a valid string",
                          //   },
                          //   minLength: {
                          //     value: 3,
                          //     message:
                          //       "Name should be greater than 3 characters",
                          //   },
                          //   maxLength: {
                          //     value: 20,
                          //     message:
                          //       "Name shouldn't be greater than 20 characters",
                          //   },
                          // })}
                          />
                          {gst_Number && gst_Number.length > 0 && !gst_Number.match(Digit.Utils.getPattern('GSTNo')) && <CardLabelError style={{ width: "100%", marginTop: '-15px', fontSize: '16px', marginBottom: '12px', color: 'red' }}>{t("BPA_INVALID_GST_NO")}</CardLabelError>}
                          {/* <div className="invalid-feedback">
                        {errors?.name?.message}
                      </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {(showDevTypeFields && showDevTypeFields !== "Individual" && showDevTypeFields !== "Proprietorship Firm" && showDevTypeFields !== "Others") && (
                <div className="card mb-3">
                  <h5 className="card-title fw-bold">Shareholding Patterns</h5>
                  {/* {JSON.stringify(modalValuesArray)} */}
                  <div className="card-body">
                    <div className="table-bd">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Sr. No</th>
                            <th>Name</th>
                            <th>Designition</th>
                            <th>Percentage</th>
                            <th>View Document</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            (modalValuesArray?.length > 0) ?
                              modalValuesArray.map((elementInArray, input) => {
                                return (
                                  <tr>
                                    <td>{input + 1}</td>
                                    <td>
                                      <input
                                        type="text"
                                        value={elementInArray.name}
                                        placeholder={elementInArray.name}
                                        readOnly
                                        disabled="disabled"
                                        class="employee-card-input"
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        value={elementInArray.designition}
                                        placeholder={elementInArray.designition}
                                        readOnly
                                        disabled="disabled"
                                        class="employee-card-input"
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        value={elementInArray.percentage}
                                        placeholder={elementInArray.percentage}
                                        readOnly
                                        disabled="disabled"
                                        class="employee-card-input"
                                      />
                                    </td>
                                    <td>
                                      <div className="row">
                                        {(elementInArray.uploadPdf) ?
                                          <button type="button" onClick={()=>getDocShareholding(elementInArray?.uploadPdf)} className="btn btn-sm col-md-6">
                                            <VisibilityIcon color="info" className="icon" />
                                          </button> 
                                          : <p></p>
                                        }
                                        <div className="btn btn-sm col-md-6">
                                          <label for={"uploadshareholdingPattern"+input}> <FileUpload color="primary" for={"uploadshareholdingPattern"+input} /></label>
                                          <input
                                            id={"uploadshareholdingPattern"+input}
                                            type="file"
                                            style={{ display: "none" }}
                                            onChange={(e) => getDocumentData(e?.target?.files[0], "uploadPdf","shareholdingPattern",input)}
                                          />
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <a href="javascript:void(0)"
                                        onClick={() => (deleteTableRows(-1))}
                                      >
                                        <DeleteIcon color="danger" className="icon" />
                                      </a>
                                    </td>
                                  </tr>
                                );
                              })
                              :
                              <p className="text-danger text-center d-none">Click on the Add More Button</p>
                          }
                        </tbody>
                      </table>
                    </div>
                    {/* <div className="form-group col-md2 mt-4">
                      <button  className="btn btn-success" >Add More
                        
                      </button>
                    </div> */}

                    {/* <button
                    type="button"
                    style={{ float: "left" }}
                    className="btn btn-primary"
                    onClick={() => setNoOfRows(noofRows + 1)}
                  >
                    Add More
                  </button> */}
                    {/* <div> {remainingStakeholderPercentage} */}
                    <div>
                      <button
                        type="button"
                        style={{
                          color: "white",
                        }}
                        disabled={Number(remainingStakeholderPercentage) === 0}
                        className="btn btn-primary mt-3"
                        // onClick={() => setNoOfRows(noofRows + 1)}
                        // onClick={() => setmodal(true)}
                        onClick={handleShowStakeholder}
                      >
                        Add More
                      </button>
                      <Modal show={showStake} onHide={handleCloseStakeholder} animation={false}>
                        <Modal.Header closeButton>
                          <Modal.Title>Add Stakeholders</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          {/* {JSON.stringify(Documents)}efewfewf */}
                          <form className="text1" id="myForm">
                            <Row>
                              <Col md={3} xxl lg="4">
                                <label htmlFor="name" className="text">Name <span className="text-danger font-weight-bold">*</span></label>
                                <TextInput
                                  type="text"
                                  isMandatory={false}
                                  onChange={(e) => setModalNAme(e.target.value)}
                                  placeholder=""
                                  required
                                  class="employee-card-input"
                                  {...(validation = {
                                    isRequired: true,
                                    pattern: "^[a-zA-Z]*$",
                                    type: "text",
                                    title: "Please Enter Name"
                                  })}
                                />
                              </Col>
                              <Col md={3} xxl lg="4">
                                <label htmlFor="name" className="text"> Designition <span className="text-danger font-weight-bold">*</span></label>
                                <TextInput
                                  type="text"
                                  isMandatory={false}
                                  onChange={(e) => setModaldesignition(e.target.value)}
                                  placeholder=""
                                  class="employee-card-input"
                                  {...(validation = {
                                    isRequired: true,
                                    pattern: "^[a-z A-Z]*$",
                                    type: "text",
                                    title: "Please Enter Designition"
                                  })}
                                />
                              </Col>

                              <Col md={3} xxl lg="4">
                                <label htmlFor="name" className="text">Percentage "%" <span className="text-danger font-weight-bold">*</span></label>
                                <TextInput
                                  type="number"
                                  isMandatory={false}
                                  value={modalPercentage}
                                  onChange={(e) => setModalPercentage(e.target.value)}
                                  placeholder=""
                                  class="employee-card-input"
                                  {...(validation = {
                                    isRequired: true,
                                    title: "Please Enter Percentage"
                                  })}
                                />

                                {/* {
                              (modalPercentage && (remainingStakeholderPercentage < modalPercentage || modalPercentage<=0 )) &&
                            <CardLabelError style={{ width: "100%", marginTop: '-15px', fontSize: '16px', marginBottom: '12px', color: 'red' }}>Please enter a valid percentage for the stakeholder</CardLabelError>
                            } */}

                                {
                                  (modalPercentage && (remainingStakeholderPercentage < modalPercentage || modalPercentage <= 0)) &&
                                  <CardLabelError style={{ width: "100%", marginTop: '-15px', fontSize: '16px', marginBottom: '12px', color: 'red' }}>{t("BPA_INVALID_PERCENTAGE")}</CardLabelError>
                                }


                                {/* {((modalPercentage && !modalPercentage+"%".match(Digit.Utils.getPattern('Percentage')) )&& (modalPercentage > remainingStakeholderPercentage || modalPercentage > 0 ))&& <CardLabelError style={{ width: "100%", marginTop: '-15px', fontSize: '16px', marginBottom: '12px', color: 'red' }}>Please enter a valid percentage fot the stakeholder</CardLabelError>} */}

                                {/* {modalPercentage && modalPercentage.length > 0 && !modalPercentage+"%".match(Digit.Utils.getPattern('Percentage')) && modalPercentage <= remainingStakeholderPercentage && <CardLabelError style={{ width: "100%", marginTop: '-15px', fontSize: '16px', marginBottom: '12px', color: 'red' }}>{t("BPA_INVALID_PERCENTAGE")}</CardLabelError>} */}

                              </Col>
                              <Col md={3} xxl lg="4">
                                <label htmlFor="name" className="text">Upload Document</label>
                                <input
                                  type="file"
                                  // value={file}
                                  placeholder=""
                                  name="uploadPdf"
                                  class="employee-card-input"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "uploadPdf")}
                                  {...(validation = {
                                    isRequired: true,
                                    title: "Please upload document"
                                  })}
                                />
                              </Col>

                            </Row>
                          </form>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleCloseStakeholder}>
                            Close
                          </Button>
                          <Button variant="primary" disabled={!modalNAme || !modaldesignition || !modalPercentage || (remainingStakeholderPercentage < modalPercentage || modalPercentage <= 0)} onClick={handleArrayValues}>
                            Save Changes
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </div>
                  </div>
                </div>
              )}
              {(showDevTypeFields && showDevTypeFields !== "Individual" && showDevTypeFields !== "Proprietorship Firm" && showDevTypeFields !== "Others") && (
                <div className="card mb-3">
                  <h5 className="card-title fw-bold">Directors Information</h5>
                  <div className="card-body">
                    {/* {JSON.stringify(DirectorData)}ewewfewf */}
                    <div className="table-bd">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Sr. No</th>
                            <th>DIN Number</th>
                            <th>Name</th>
                            <th>Contact Number</th>
                            <th>View Document</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            (DirectorData?.length > 0) ?
                              DirectorData.map((elementInArray, input) => {
                                return (
                                  <tr key={input}>
                                    <td>{input + 1}</td>
                                    <td>
                                      <input
                                        type="text"
                                        disabled="disabled"
                                        value={elementInArray.din}
                                        placeholder={elementInArray.din}
                                        class="employee-card-input"
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        disabled="disabled"
                                        value={elementInArray.name}
                                        placeholder={elementInArray.name}
                                        class="employee-card-input"
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        disabled="disabled"
                                        value={elementInArray.contactNumber}
                                        placeholder={elementInArray.contactNumber}
                                        class="employee-card-input"
                                      />
                                    </td>
                                    <td>
                                      <div className="row">
                                        {/* {JSON.stringify(elementInArray?.uploadPdf)} */}
                                        {(elementInArray?.uploadPdf) ?
                                          <button type="button" onClick={()=>getDocShareholding(elementInArray?.uploadPdf)} className="btn btn-sm col-md-6 text-center">
                                            <VisibilityIcon color="info" className="icon" />
                                          </button> 
                                          : <p></p>
                                        }
                                        <div className="btn btn-sm col-md-6">
                                          <label for={"uploaddirectorInfoPdf"+input}> 
                                          <FileUpload color="primary" for={"uploaddirectorInfoPdf"+input} />
                                          </label>
                                          <input
                                            id={"uploaddirectorInfoPdf"+input}
                                            type="file"
                                            style={{ display: "none" }}
                                            onChange={(e) => getDocumentData(e?.target?.files[0], "directorInfoPdf", "directorInfoPdf", input)}
                                          />
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <a href="javascript:void(0)"
                                        onClick={() => (deleteDirectorTableRows(-1))}
                                      >
                                        <DeleteIcon color="danger" className="icon" />
                                      </a>
                                    </td>
                                  </tr>
                                );
                              }) : <p></p>}
                        </tbody>
                      </table>
                    </div>
                    <div>
                      <button
                        type="button"
                        style={{
                          color: "white",
                        }}
                        className="btn btn-primary mt-3"
                        // onClick={() => setNoOfRows(noofRows + 1)}
                        // onClick={() => setmodalDirector(true)}
                        onClick={handleShow}
                      >
                        Add More
                      </button>
                      <Modal show={show} onHide={handleClose} animation={false}>
                        <Modal.Header closeButton>
                          <Modal.Title>Add Directors Info</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <form className="text1">
                            <Row>
                              <Col md={3} xxl lg="4">
                                <label htmlFor="name" className="text">DIN Number</label>
                                <MobileNumber
                                  value={modalDIN}
                                  name="modalDIN"
                                  maxlength={"8"}
                                  hideSpan="true"
                                  // onChange={(e) => setModalDIN(e.target.value)}
                                  onChange={selectDinNumber}
                                  // disable={mobileNumber && !isOpenLinkFlow ? true : false}
                                  {...{ required: true, pattern: "[1-9][0-9]{7}", type: "tel", title: t("Enter Valid DIN") }}
                                />
                                {/* <MobileNumber
                              
                              isMandatory={false}
                              onChange={(e) => setModalDIN(e.target.value.toUpperCase())}
                              placeholder=""
                              max= {8}
                              class="employee-card-input"
                              {...(validation = {
                                isRequired: true,
                                maxlength: "8",
                                type: "tel",
                                title: "Please Enter DIN No."
                              })}
                            /> */}
                                {modalDIN && modalDIN.length > 0 && !modalDIN.match(Digit.Utils.getPattern('DIN')) && <CardLabelError style={{ width: "100%", marginTop: '-15px', fontSize: '16px', marginBottom: '12px', color: 'red' }}>{t("BPA_INVALID_DIN_NO")}</CardLabelError>}
                              </Col>
                              <Col md={3} xxl lg="4">
                                <label htmlFor="name" className="text">Name</label>
                                <input
                                  type="text"

                                  onChange={(e) => setModalDirectorName(e.target.value)}
                                  placeholder=""
                                  class="employee-card-input"
                                  {...(validation = {
                                    isRequired: true,
                                    pattern: "^[a-zA-Z]*$",
                                    type: "text",
                                    title: "Please Enter Name"
                                  })}
                                />
                              </Col>
                              <Col md={3} xxl lg="4">
                                <label htmlFor="name" className="text"> Contact Number <span className="text-danger font-weight-bold">*</span></label>

                                <MobileNumber
                                  value={modalDirectorContact}
                                  name="modalDirectorContact"
                                  onChange={selectModalContactDirector}
                                  // disable={modalDirectorContact && !isOpenLinkFlow ? true : false}
                                  {...{ required: true, pattern: "[6-9]{1}[0-9]{9}", type: "tel", title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID") }}
                                />
                                {modalDirectorContact && modalDirectorContact.length > 0 && !modalDirectorContact.match(Digit.Utils.getPattern('MobileNo')) && <CardLabelError style={{ width: "100%", marginTop: '-15px', fontSize: '16px', marginBottom: '12px', color: 'red' }}>{t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID")}</CardLabelError>}
                              </Col>
                              <Col md={3} xxl lg="4">
                                <label htmlFor="name" className="text">Upload document</label>
                                <input
                                  type="file"
                                  name="uploadPdf"
                                  class="employee-card-input"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "directorInfoPdf")}
                                  {...(validation = {
                                    isRequired: true,
                                    title: "Please upload document"
                                  })}
                                />
                              </Col>

                            </Row>
                          </form>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose}>
                            Close
                          </Button>
                          <Button variant="primary" onClick={handleDirectorsArrayValues}>
                            Save Changes
                          </Button>
                        </Modal.Footer>
                      </Modal>

                    </div>
                  </div>

                  <p className="ml-1">
                    In case the Partner/director of the applicant firm/company is common with any existing colonizer who has been granted a license under the 1975 act Yes/No.

                  </p>

                  <div className="form-group ml-2">
                    <input
                      type="radio"
                      value="Y"
                      checked={existingColonizer === "Y" ? true : false}
                      id="existingColonizer"
                      className="mx-2 mt-1"
                      onChange={(e) => setExistingColonizer(e.target.value)}
                      name="existingColonizer"
                    />
                    <label for="Yes">Yes</label>

                    <input
                      type="radio"
                      value="N"
                      checked={existingColonizer === "N" ? true : false}
                      id="existingColonizerN"
                      className="mx-2 mt-1"
                      onChange={(e) => setExistingColonizer(e.target.value)}
                      name="existingColonizer"
                    />
                    <label for="No">No</label>
                    {existingColonizer === "Y" && (
                      <div>
                        <div className="row ">
                          <div className="form-group row">
                            <div className="col-sm-12">
                              <Col xs="12" md="12" sm="12">
                                <Table className="table table-bordered" size="sm">
                                  <thead>
                                    <tr>
                                      <th>S.No.</th>
                                      <th>Document Name </th>
                                      <th> Upload Documents</th>
                                      <th> Annexure</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td> 1 &nbsp;&nbsp;</td>
                                      <td>
                                        {" "}
                                        Agreement between the proposed developer and existing colonizer
                                      </td>
                                      <td align="center" size="large">
                                        <input
                                          type="file"
                                          accept="application/pdf"
                                          name="agreementDoc"
                                          onChange={(e) => getDocumentData(e?.target?.files[0], "aggreementBtw", "existingColonizer")}
                                          class="employee-card-input"
                                        />
                                      </td>
                                      <td>
                                        {existingColonizerDetails.aggreementBtw?
                                          <button type="button" onClick={() => getDocShareholding(existingColonizerDetails.aggreementBtw)} className="btn btn-sm col-md-6">
                                            <VisibilityIcon color="info" className="icon" />
                                          </button> : <p></p>
                                        }
                                      </td>
                                    </tr>
                                    <tr>
                                      <td> 2&nbsp;&nbsp; </td>
                                      <td>
                                        Board resolution of authorised signatory of the existing colonizer
                                      </td>
                                      <td align="center" size="large">
                                        <input
                                          type="file"
                                          accept="application/pdf"
                                          name="boardDoc"
                                          onChange={(e) => getDocumentData(e?.target?.files[0], "boardResolution", "existingColonizer")}
                                          class="employee-card-input"
                                        />
                                      </td>
                                      <td>
                                        {existingColonizerDetails.boardResolution ?
                                          <button type="button" onClick={() => getDocShareholding(existingColonizerDetails.boardResolution)} className="btn btn-sm col-md-6">
                                            <VisibilityIcon color="info" className="icon" />
                                          </button> : <p></p>
                                        }
                                      </td>
                                    </tr>
                                  </tbody>
                                </Table>
                              </Col>
                            </div>
                          </div>
                        </div>

                        <div className="row mx-2">

                          {/* <div className="col col-4">
                        <div className="form-group">
                          <label htmlFor="name">Name</label>
                          <input
                            type="text"
                            value={existingColonizerDetails.name}
                            name="name"
                            // onChange={SelectName}
                            onChange={(e) => setExistingColonizerDetails({...existingColonizerDetails,name:e.target.value})}
                            className="employee-card-input"
                          />
                        </div>
                      </div>

                      <div className="col col-4">
                        <div className="form-group">
                          <label htmlFor="mobile">Mobile</label>
                          <input
                            type="text"
                            value={existingColonizerDetails.mobile}
                            name="mobile"
                            // onChange={SelectName}
                            onChange={(e) => setExistingColonizerDetails({...existingColonizerDetails,mobile:e.target.value})}
                            className="employee-card-input"
                          />
                        </div>
                      </div>

                      <div className="col col-4">
                        <div className="form-group">
                          <label htmlFor="email">Email ID</label>
                          <input
                            type="text"
                            value={existingColonizerDetails.email}
                            name="email"
                            // onChange={SelectName}
                            onChange={(e) => setExistingColonizerDetails({...existingColonizerDetails,email:e.target.value})}
                            className="employee-card-input"
                          />
                        </div>
                      </div> */}

                          <div className="col col-4">
                            <div className="form-group">
                              <label htmlFor="dob">DOB</label>
                              <input
                                type="date"
                                value={existingColonizerDetails.dob}
                                name="dob"
                                // onChange={SelectName}
                                onChange={(e) => setExistingColonizerDetails({ ...existingColonizerDetails, dob: e.target.value })}
                                className="employee-card-input"
                              />
                            </div>
                          </div>

                          <div className="col col-4">
                            <div className="form-group">
                              <label htmlFor="pan">PAN Number</label>
                              <input
                                type="pan"
                                value={existingColonizerDetails.pan}
                                name="dob"
                                // onChange={SelectName}
                                onChange={(e) => setExistingColonizerDetails({ ...existingColonizerDetails, pan: e.target.value })}
                                className="employee-card-input"
                                maxLength={10}
                              />
                              {existingColonizerDetails.pan && existingColonizerDetails.pan.length > 0 && !existingColonizerDetails.pan.match(Digit.Utils.getPattern('PAN')) && <CardLabelError style={{ width: "100%", marginTop: '-15px', fontSize: '16px', marginBottom: '12px', color: 'red' }}>{t("BPA_INVALID_PAN_NO")}</CardLabelError>}
                            </div>
                          </div>

                          <div className="col col-4">
                            <div className="form-group">
                              <label htmlFor="licNo">License No.</label>
                              <input
                                type="text"
                                value={existingColonizerDetails.licNo}
                                name="licNo"
                                // onChange={SelectName}
                                onChange={(e) => setExistingColonizerDetails({ ...existingColonizerDetails, licNo: e.target.value })}
                                className="employee-card-input"
                                maxLength={10}
                              />
                            </div>
                          </div>

                          <div className="col col-4">
                            <div className="form-group">
                              <label htmlFor="licDate">Date</label>
                              <input
                                type="date"
                                value={existingColonizerDetails.licDate}
                                name="licDate"
                                // onChange={SelectName}
                                onChange={(e) => setExistingColonizerDetails({ ...existingColonizerDetails, licDate: e.target.value })}
                                className="employee-card-input"
                                maxLength={10}
                              />
                            </div>
                          </div>

                          <div className="col col-4">
                            <div className="form-group">
                              <label htmlFor="licValidity">Validity</label>
                              <input
                                type="date"
                                value={existingColonizerDetails.licValidity}
                                name="licValidity"
                                // onChange={SelectName}
                                onChange={(e) => setExistingColonizerDetails({ ...existingColonizerDetails, licValidity: e.target.value })}
                                className="employee-card-input"
                              // maxLength={10}
                              />
                            </div>
                          </div>

                          <div className="col col-4">
                            <div className="form-group">
                              <label htmlFor="licValidity">Purpose</label>
                              <Select
                                onChange={(e) => setExistingColonizerDetails({ ...existingColonizerDetails, licPurpose: e.target.value })}
                                value={existingColonizerDetails.licPurpose}
                                className="w-100"
                                variant="standard"
                              >
                                {
                                  purposeOptions?.data?.map((item, index) => (
                                    <MenuItem value={item.value} >{item?.label}</MenuItem>
                                  ))
                                }
                              </Select>

                            </div>
                          </div>


                        </div>
                      </div>
                    )}
                  </div>


                </div>
              )}

              {/* FOR COMPANY */}
              {showDevTypeFields === "LLP" && (
                <div className="card mb-3">
                  {/* <div className="card-header">
              <h5 className="card-title"> Developer</h5>
            </div> */}
                  <h5 className="card-title fw-bold">Developer Details</h5>
                  <div className="card-body">
                    <div className="row">
                      <div className="col col-4">
                        <div className="form-group">
                          <label htmlFor="name">LLP Pin *</label>
                          <input
                            type="text"
                            onChange={(e) => setCinNo(e.target.value)}
                            value={cin_Number}
                            className="employee-card-input"
                            {...(validation = {
                              isRequired: true,
                              required: "Name is required",
                              pattern: "^[a-zA-Z0-9]*$",
                              type: "text",

                              title: "Please Enter LLP Pin"
                            })}
                          // placeholder=""
                          // {...register("name", {
                          //   required: "Name is required",
                          //   pattern: {
                          //     value: /^[a-zA-Z]+$/,
                          //     message: "Name must be a valid string",
                          //   },
                          //   minLength: {
                          //     value: 3,
                          //     message:
                          //       "Name should be greater than 3 characters",
                          //   },
                          //   maxLength: {
                          //     value: 20,
                          //     message:
                          //       "Name shouldn't be greater than 20 characters",
                          //   },
                          // })}
                          />
                        </div>
                      </div>
                      <div className="col col-4">
                        <div className="form-group">

                          <label htmlFor="name">LLP Name</label>

                          <input
                            type="text"
                            disabled="disabled"
                            value={companyName}
                            placeholder={companyName}
                            className="employee-card-input"
                          // placeholder=""
                          // {...register("name", {
                          //   required: "Name is required",
                          //   pattern: {
                          //     value: /^[a-zA-Z]+$/,
                          //     message: "Name must be a valid string",
                          //   },
                          //   minLength: {
                          //     value: 3,
                          //     message:
                          //       "Name should be greater than 3 characters",
                          //   },
                          //   maxLength: {
                          //     value: 20,
                          //     message:
                          //       "Name shouldn't be greater than 20 characters",
                          //   },
                          // })}
                          />
                        </div>
                      </div>
                      <div className="col col-4">
                        <div className="form-group">
                          <label htmlFor="name">Date of Incorporation</label>
                          <input
                            type="text"
                            disabled="disabled"
                            value={incorporationDate}
                            placeholder={incorporationDate}
                            className="employee-card-input"
                          // placeholder=""
                          // {...register("name", {
                          //   required: "Name is required",
                          //   pattern: {
                          //     value: /^[a-zA-Z]+$/,
                          //     message: "Name must be a valid string",
                          //   },
                          //   minLength: {
                          //     value: 3,
                          //     message:
                          //       "Name should be greater than 3 characters",
                          //   },
                          //   maxLength: {
                          //     value: 20,
                          //     message:
                          //       "Name shouldn't be greater than 20 characters",
                          //   },
                          // })}
                          />
                        </div>
                      </div>
                      <div className="col col-4">
                        <div className="form-group">
                          <label htmlFor="name">Registered Address</label>
                          <input
                            type="text"
                            disabled="disabled"
                            value={registeredAddress}
                            placeholder={registeredAddress}
                            className="employee-card-input"
                          // name="name"
                          // className={`employee-card-input`}
                          // placeholder=""
                          // {...register("name", {
                          //   required: "Name is required",
                          //   pattern: {
                          //     value: /^[a-zA-Z]+$/,
                          //     message: "Name must be a valid string",
                          //   },
                          //   minLength: {
                          //     value: 3,
                          //     message:
                          //       "Name should be greater than 3 characters",
                          //   },
                          //   maxLength: {
                          //     value: 20,
                          //     message:
                          //       "Name shouldn't be greater than 20 characters",
                          //   },
                          // })}
                          />
                        </div>
                      </div>
                      <div className="col col-4">
                        <div className="form-group ">
                          <label htmlFor="email"> Email </label>
                          <input
                            type="text"
                            disabled="disabled"
                            value={email}
                            placeholder={email}
                            className="employee-card-input"
                          // name="email"
                          // className={`employee-card-input`}
                          // placeholder=""
                          // {...register("email", {
                          //   required: "Email is required",
                          //   pattern: {
                          //     value: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
                          //     message: "Email must be a valid email address",
                          //   },
                          // })}
                          />
                          {/* <div className="invalid-feedback">
                        {errors?.email?.message}
                      </div> */}
                        </div>
                      </div>
                      <div className="col col-4">
                        <div className="form-group">
                          <label htmlFor="name">Mobile No.</label>
                          <input
                            type="text"
                            disabled="disabled"
                            value={registeredContactNo}
                            placeholder={registeredContactNo}
                            className="employee-card-input"
                            maxlength={"10"}
                          // name="name"
                          // className={`employee-card-input`}
                          // placeholder=""
                          // {...register("name", {
                          //   required: "Name is required",
                          //   pattern: {
                          //     value: /^[a-zA-Z]+$/,
                          //     message: "Name must be a valid string",
                          //   },
                          //   minLength: {
                          //     value: 3,
                          //     message:
                          //       "Name should be greater than 3 characters",
                          //   },
                          //   maxLength: {
                          //     value: 20,
                          //     message:
                          //       "Name shouldn't be greater than 20 characters",
                          //   },
                          // })}
                          />
                          {/* <div className="invalid-feedback">
                        {errors?.name?.message}
                      </div> */}
                        </div>
                      </div>
                      <div className="col col-4">
                        <div className="form-group">
                          <label htmlFor="name">GST No.</label>
                          <input
                            type="text"
                            value={gst_Number}
                            placeholder={gst_Number}
                            className="employee-card-input"
                          // className={`employee-card-input`}
                          // placeholder=""
                          // {...register("name", {
                          //   required: "Name is required",
                          //   pattern: {
                          //     value: /^[a-zA-Z]+$/,
                          //     message: "Name must be a valid string",
                          //   },
                          //   minLength: {
                          //     value: 3,
                          //     message:
                          //       "Name should be greater than 3 characters",
                          //   },
                          //   maxLength: {
                          //     value: 20,
                          //     message:
                          //       "Name shouldn't be greater than 20 characters",
                          //   },
                          // })}
                          />
                          {/* <div className="invalid-feedback">
                        {errors?.name?.message}
                      </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* {showDevTypeFields === "LLP" && (
            <div className="card mb-3">
            <h5 className="card-title fw-bold">Shareholding Patterns</h5>
              <div className="card-body">
                <div className="table-bd">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Sr. No</th>
                        <th>Name</th>
                        <th>Designition</th>
                        <th>Percentage</th>
                        <th>View PDF</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        ( modalValuesArray.length>0)?
                        modalValuesArray.map((elementInArray, input) => {
                          return (
                            <tr>
                              <td>{input+ 1}</td>
                              <td>
                                <input
                                  type="text"
                                  value={elementInArray.name}
                                  placeholder={elementInArray.name}
                                  readOnly
                                  disabled="disabled"
                                  class="employee-card-input"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={elementInArray.designition}
                                  placeholder={elementInArray.designition}
                                  readOnly
                                  disabled="disabled"
                                  class="employee-card-input"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={elementInArray.percentage}
                                  placeholder={elementInArray.percentage}
                                  readOnly
                                  disabled="disabled"
                                  class="employee-card-input"
                                />
                              </td>
                              <td>
                                <div className="text-center">
                                  <button className="btn btn-success btn-sm">View</button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                        :
                        <p className="text-danger text-center">Click on the Add More Button</p>
                      }
                    </tbody>
                  </table>
                </div> */}
              {/* <div className="form-group col-md2 mt-4">
                      <button  className="btn btn-success" >Add More
                        
                      </button>
                    </div> */}

              {/* <button
                    type="button"
                    style={{ float: "left" }}
                    className="btn btn-primary"
                    onClick={() => setNoOfRows(noofRows + 1)}
                  >
                    Add More
                  </button> */}
              {/* <div>
                  <button
                    type="button"
                    style={{
                      color: "white",
                    }}
                    className="btn btn-primary mt-3"
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
                                <Col md={3} xxl lg="4">
                                  <label htmlFor="name" className="text">Name *</label>
                                  <input
                                    type="text"
                                    
                                    onChange={(e)=>setModalNAme(e.target.value)}
                                    placeholder=""
                                    class="employee-card-input"
                                    {...(validation = {
                                      isRequired: true,
                                      pattern: "^[a-zA-Z]*$",
                                      type: "text",
                                      title: "Please Enter Name"
                                    })}
                                  />
                                </Col>
                                <Col md={3} xxl lg="4">
                                  <label htmlFor="name" className="text"> Designition *</label>
                                  <input
                                    type="text"
                                    
                                    onChange={(e)=>setModaldesignition(e.target.value)}
                                    placeholder=""
                                    class="employee-card-input"
                                    {...(validation = {
                                      isRequired: true,
                                      pattern: "^[a-zA-Z]*$",
                                      type: "text",
                                      title: "Please Enter Designition"
                                    })}
                                  />
                                </Col>

                                <Col md={3} xxl lg="4">
                                  <label htmlFor="name" className="text">Percentage *</label>
                                  <input
                                    type="flot"
                                    
                                    onChange={(e)=>setModalPercentage(e.target.value)}
                                    placeholder=""
                                    class="employee-card-input"
                                    {...(validation = {
                                      isRequired: true,
                                      pattern: "^[a-zA-Z]*$",
                                      type: "text",
                                      title: "Please Enter Percentage"
                                    })}
                                  />
                                </Col>
                                <Col md={3} xxl lg="4">
                                  <label htmlFor="name" className="text">Upload PDF</label>
                                  <input
                                    type="file"
                                    value={uploadPdf}
                                    placeholder=""
                                    class="employee-card-input"
                                    {...(validation = {
                                      isRequired: true,
                                      pattern: "^[a-zA-Z]*$",
                                      type: "text",
                                      title: "Please upload document"
                                    })}
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
                                onClick={handleArrayValues}
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
                </div> */}
              {/* <button
                    type="button"
                    style={{ float: "right" }}
                    className="btn btn-danger"
                    onClick={() => setNoOfRows(noofRows - 1)}
                  >
                    Remove
                  </button> */}

              {/* <div className="form-group">
                      <button type="submit" className="btn btn-success">
                        {" "}
                        Save{" "}
                      </button>
                    </div> */}
              {/* </div>
            </div>
             )}
            {showDevTypeFields === "LLP" && (
            <div className="card mb-3">
            <h5 className="card-title fw-bold">Directors Information</h5>
              <div className="card-body">
                <div className="table-bd">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Sr. No</th>
                        <th>DIN Number</th>
                        <th>Name</th>
                        <th>Contact Number</th>
                        <th>Upload PDF</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                      (DirectorData.length>0)?
                      DirectorData.map((elementInArray, input) => {
                        return (
                          <tr key={input}>
                            <td>{input}</td>
                            <td>
                              <input
                                type="text"
                                disabled="disabled"
                                value={elementInArray.din}
                                placeholder={elementInArray.din}
                                class="employee-card-input"
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                disabled="disabled"
                                value={elementInArray.name}
                                placeholder={elementInArray.name}
                                class="employee-card-input"
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                disabled="disabled"
                                value={elementInArray.contactNumber}
                                placeholder={elementInArray.contactNumber}
                                class="employee-card-input"
                              />
                            </td>
                            <td>
                              <input
                                type="file"
                                value={uploadPdf}
                                placeholder=""
                                class="employee-card-input"
                              />
                            </td>
                          </tr>
                        );
                      }):<p></p>}
                    </tbody>
                  </table>
                </div>
                
              </div>
            </div>
            )} */}
              {/* <div className="col-md-12 text-end">
              <button
                className="btn btn-success"
              >
                Save and Continue
              </button>
            </div> */}


            </div>

          </FormStep> : <Loader />}
      </div>
    </div>
  );
};

export default LicenseAddInfo;