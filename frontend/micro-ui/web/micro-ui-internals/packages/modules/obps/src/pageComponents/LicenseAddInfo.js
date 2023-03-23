import {
  BackButton,
  CardLabel,
  CheckBox,
  CardLabelError,
  FormStep,
  Loader,
  MobileNumber,
  RadioButtons,
  Toast,
  TextInput,
  ViewsIcon,
  DownloadIcon,
  Dropdown,
  DatePicker,
  RemoveIcon,
} from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Timeline from "../components/Timeline";
import Form from "react-bootstrap/Form";
// import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useForm } from "react-hook-form";
// import Select from 'react-bootstrap/Select';
import { Button, Placeholder } from "react-bootstrap";
import Popup from "reactjs-popup";
// import {
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
// } from "reactstrap";
import { Modal, ModalHeader, ModalFooter, ModalBody } from "react-bootstrap";
import axios from "axios";
import ReactMultiSelect from "../../../../react-components/src/atoms/ReactMultiSelect";
import SearchDropDown from "../../../../react-components/src/atoms/searchDropDown";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUpload from "@mui/icons-material/FileUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import Delete from "@mui/icons-material/Delete";
import { getDocShareholding } from "../../../tl/src/pages/employee/ScrutinyBasic/ScrutinyDevelopment/docview.helper";
import { MenuItem, Select } from "@mui/material";
import { convertEpochToDate } from "../utils/index";
import Spinner from "../components/Loader/index";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import CusToaster from "../components/Toaster";

const LicenseAddInfo = ({ t, config, onSelect, userType, formData, ownerIndex }) => {
  let validation = {};
  const { pathname: url } = useLocation();
  const devRegId = localStorage.getItem("devRegId");
  const userInfo = Digit.UserService.getUser();
  const [designation, setDesignation] = useState();
  const [aadharNumber, setAadharNumber] = useState();
  // const [panNumber, setPanNumber] = useState();
  const [developerDataAddinfo, setDeveloperDataAddinfo] = useState([]);
  const [existingColonizer, setExistingColonizer] = useState();
  const [existingDirectors, setExistingDirectors] = useState();
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
    boardResolution: "",
  });
  const [llp_Number, setLLPNumber] = useState("");
  const [csrNumber, setCSRNumber] = useState("");
  const devType = localStorage.getItem("devTypeValueFlag");

  let isOpenLinkFlow = window.location.href.includes("openlink");
  const [isUndertaken, setIsUndertaken] = useState(formData?.isUndertaken || formData?.formData?.isUndertaken || false);
  const [loader, setLoading] = useState(false);
  const [panIsValid, setPanIsValid] = useState(false);

  // -----Shareholding Pageination
  const [rowsPerPageStack, setRowsPerPageStack] = React.useState(10);
  const handleChangePageStack = (event, newPageStack) => {
    setPageStack(newPageStack);
  };
  const [pageStack, setPageStack] = React.useState(0);
  const handleChangeRowsPerPageStack = (event) => {
    setRowsPerPageStack(+event.target.value);
    setPageStack(0);
  };
  //-------------------//

  const [rowsPerPageMca, setRowsPerPageMca] = React.useState(10);
  const handleChangePageMca = (event, newPageMca) => {
    setPageMca(newPageMca);
  };
  const [pageMca, setPageMca] = React.useState(0);
  const handleChangeRowsPerPageMca = (event) => {
    setRowsPerPageMca(+event.target.value);
    setPageMca(0);
  };
  //--------------------//

  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const [page, setPage] = React.useState(0);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const getDeveloperData = async () => {
    setLoading(true);
    try {
      const requestResp = {
        RequestInfo: {
          api_id: "1",
          ver: "1",
          ts: "",
          action: "_getDeveloperById",
          did: "",
          key: "",
          msg_id: "",
          requester_id: "",
          auth_token: "",
        },
      };
      const getDevDetails = await axios.get(`/user/developer/_getDeveloperById?id=${userInfo?.info?.id}&isAllData=true`, requestResp, {});

      const developerDataGet = getDevDetails?.data;
      const developerDataGetDocs = getDevDetails?.data?.devDetail[0]?.addInfo;
      setDeveloperDataAddinfo(developerDataGetDocs);

      // console.log("STAKEHOLDER",getDevDetails?.data?.devDetail[0]?.addInfo?.registeredContactNo);
      setShowDevTypeFields(developerDataGet?.devDetail[0]?.applicantType?.developerType);
      setName(developerDataGet?.devDetail[0]?.addInfo?.name);
      setCompanyName(developerDataGet?.devDetail[0]?.addInfo?.companyName);
      setIncorporation(developerDataGet?.devDetail[0]?.addInfo?.incorporationDate);
      setRegistered(developerDataGet?.devDetail[0]?.addInfo?.registeredAddress);
      setUserEmail(developerDataGet?.devDetail[0]?.addInfo?.email);
      setUserEmailInd(developerDataGet?.devDetail[0]?.addInfo?.emailId);
      setDOB(developerDataGet?.devDetail[0]?.addInfo?.dob);
      setGender(developerDataGet?.devDetail[0]?.addInfo?.gender);
      setPanNumber(developerDataGet?.devDetail[0]?.addInfo?.PanNumber);
      setPanIsValid(developerDataGet?.devDetail[0]?.addInfo?.PanNumber ? true : false);
      // setMobile(developerDataGet?.devDetail[0]?.addInfo?.mobileNumber);
      setGST(developerDataGet?.devDetail[0]?.addInfo?.gst_Number);
      setTbName(developerDataGet?.devDetail[0]?.addInfo?.sharName);
      setDesignition(developerDataGet?.devDetail[0]?.addInfo?.designition);
      setPercetage(developerDataGet?.devDetail[0]?.addInfo?.percentage);
      setUploadPDF(developerDataGet?.devDetail[0]?.addInfo?.uploadPdf);
      setSerialNumber(developerDataGet?.devDetail[0]?.addInfo?.serialNumber);
      setDirectorData([...DirectorData, ...developerDataGet?.devDetail[0]?.addInfo?.DirectorsInformation]);
      setDirectorDataMCA(developerDataGet?.devDetail[0]?.addInfo?.DirectorsInformationMCA || []);
      // setDirectorData(developerDataGet?.devDetail[0]?.addInfo?.DirectorsInformationMCA || []);
      setCinNo(developerDataGet?.devDetail[0]?.addInfo?.cin_Number);
      setLLPNumber(developerDataGet?.devDetail[0]?.addInfo?.llp_Number);
      setCSRNumber(developerDataGet?.devDetail[0]?.addInfo?.csr_Number);
      setModalNAme(developerDataGet?.devDetail[0]?.addInfo?.modalNAme);
      setModaldesignition(developerDataGet?.devDetail[0]?.addInfo?.modaldesignition);
      setModalPercentage(developerDataGet?.devDetail[0]?.addInfo?.modalPercentage);
      setModalValuesArray(developerDataGet?.devDetail[0]?.addInfo?.shareHoldingPatterens || []);
      setOthersArray(developerDataGet?.devDetail[0]?.addInfo?.othersDetails || othersArray);
      setExistingColonizerDetails(developerDataGet?.devDetail[0]?.addInfo?.existingColonizerData || existingColonizerDetails);
      setExistingColonizer(developerDataGet?.devDetail[0]?.addInfo?.existingColonizer || "");
      setExistingDirectors(developerDataGet?.devDetail[0]?.addInfo?.existingDirectors || "");
      setFinancialCapacity(developerDataGet?.devDetail[0]?.addInfo?.financialCapacity);
      setIsUndertaken(developerDataGet?.devDetail[0]?.addInfo?.isUndertaken);
      setRegisteredMobileNumber(developerDataGet?.devDetail[0]?.addInfo?.registeredContactNo);
      // setShowDevTypeFields(valueOfDrop);
      let totalRemainingShareholdingPattern = 100;
      // console.log("log123", developerDataGet?.devDetail[0]?.addInfo);
      developerDataGet?.devDetail[0]?.addInfo?.shareHoldingPatterens.forEach((item, index) => {
        // console.log("log123", item, item.percentage, item.percentage.split("%"));
        totalRemainingShareholdingPattern -= Number(item.percentage.split("%")[0]);
        // console.log("log123", item.percentage, item.percentage.split("%")[0], totalRemainingShareholdingPattern);
      });
      setRemainingStakeholderPercentage(Number(totalRemainingShareholdingPattern));
      // console.log(
      //   "log123",
      //   totalRemainingShareholdingPattern,
      //   developerDataGet?.devDetail[0]?.addInfo?.shareHoldingPatterens,
      //   developerDataGet?.devDetail[0]?.addInfo?.shareHoldingPatterens[0].percentage.split("%")[0]
      // );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    const interval = setTimeout(function () {
      setLoading(true);
      getDeveloperData();
      setLoading(false);
    }, 3000);

    return () => clearInterval(interval);

    // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);

  const [name, setName] = useState(formData?.LicneseDetails?.name || formData?.formData?.LicneseDetails?.name || "");
  const [mobileNumberUser, setMobileNumber] = useState(
    (!isOpenLinkFlow ? userInfo?.info?.mobileNumber : "") ||
      formData?.LicneseDetails?.mobileNumberUser ||
      formData?.formData?.LicneseDetails?.mobileNumberUser ||
      ""
  );
  const [emailId, setUserEmailInd] = useState(formData?.LicneseDetails?.emailId || formData?.formData?.LicneseDetails?.emailId || "");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const [developerTypeOptions, setDevTypeOptions] = useState({ data: [], isLoading: true });

  const isCitizenUrl = Digit.Utils.browser.isMobile() ? true : false;

  if (isOpenLinkFlow)
    window.onunload = function () {
      sessionStorage.removeItem("Digit.BUILDING_PERMIT");
    };
  const { isLoading, data: genderTypeData } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["GenderType"]);
  const { data: optionsArrList } = Digit.Hooks.obps.useMDMS(stateId, "Developer-type", ["DeveloperType"]);

  let menu = [];
  genderTypeData &&
    genderTypeData["common-masters"].GenderType.filter((data) => data.active).map((genderDetails) => {
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
  const [data, setData] = useState([]);
  const [devDetail, setdevDetail] = useState([]);
  const [othersArray, setOthersArray] = useState([]);
  const [othersDetails, setOthersDetails] = useState({
    name: "",
    designation: "",
    aadharNumber: "",
    panNumber: "",
    dob: "",
  });
  const [addPeopleModal, setAddPeopleModal] = useState(false);
  const [purposeOptions, setPurposeOptions] = useState({ data: [], isLoading: true });

  const { data: PurposeType } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["Purpose"]);

  useEffect(() => {
    const purpose = PurposeType?.["common-masters"]?.Purpose?.map(function (data) {
      return { value: data?.purposeCode, label: data?.name };
    });
    // console.log("log123", purpose);
    setPurposeOptions({ data: purpose, isLoading: false });
  }, [PurposeType]);

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
  } = useForm([{ Sr: "", name: "", mobileNumber: "", email: "", PAN: "", Aadhar: "" }]);
  const [success, setError] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [showToastError, setShowToastError] = useState({ label: "", error: false, success: false });
  // const handleChange = (e) => {
  //   this.setState({ isRadioSelected: true });
  // };

  const [checked, setChecked] = React.useState(false);
  const [showhide0, setShowhide0] = useState("No");
  const [showDevTypeFields, setShowDevTypeFields] = useState(
    formData?.LicneseDetails?.showDevTypeFields || formData?.formData?.LicneseDetails?.showDevTypeFields || ""
  );
  const [FormSubmitted, setFormSubmitted] = useState(false);
  const [showhide, setShowhide] = useState("No");
  const [cin_Number, setCinNo] = useState(formData?.LicneseDetails?.cin_Number || formData?.formData?.LicneseDetails?.cin_Number || "");
  const [companyName, setCompanyName] = useState(formData?.LicneseDetails?.companyName || formData?.LicneseDetails?.companyName || "");
  const [incorporationDate, setIncorporation] = useState(
    formData?.LicneseDetails?.incorporationDate || formData?.LicneseDetails?.incorporationDate || ""
  );
  const [registeredAddress, setRegistered] = useState(
    formData?.LicneseDetails?.registeredAddress || formData?.LicneseDetails?.registeredAddress || ""
  );
  const [gender, setGender] = useState(formData?.LicneseDetails?.gender || formData?.LicneseDetails?.gender);
  const [PanNumber, setPanNumber] = useState(formData?.LicneseDetails?.PanNumber || formData?.formData?.LicneseDetails?.PanNumber || "");
  const [dob, setDOB] = useState(formData?.LicneseDetails?.dob || formData?.formData?.LicneseDetails?.dob || "");
  // const [email, setEmail] = useState(formData?.LicneseDetails?.email || formData?.LicneseDetails?.email || "");
  const [email, setUserEmail] = useState(formData?.LicneseDetails?.email || formData?.formData?.LicneseDetails?.email || "");
  const [registeredContactNo, setRegisteredMobileNumber] = useState(
    formData?.LicneseDetails?.registeredContactNo || formData?.LicneseDetails?.registeredContactNo || ""
  );
  const [gst_Number, setGST] = useState("");
  const [sharName, setTbName] = useState("");
  const [designition, setDesignition] = useState("");
  const [percentage, setPercetage] = useState("");
  const [uploadPdf, setUploadPDF] = useState(DevelopersAllData?.uploadPdf || "");
  const [serialNumber, setSerialNumber] = useState("");
  const [DirectorData, setDirectorData] = useState([]);
  const [DirectorDataMCA, setDirectorDataMCA] = useState([]);
  const [modalNAme, setModalNAme] = useState("");
  const [modaldesignition, setModaldesignition] = useState("");
  const [modalPercentage, setModalPercentage] = useState("");
  // const dispatch = useDispatch();

  const [modalValuesArray, setModalValuesArray] = useState([]);
  const [modalDirectorValuesArray, setModalDirectorValuesArray] = useState([]);
  const [modalDIN, setModalDIN] = useState("");
  const [modalDirectorName, setModalDirectorName] = useState("");
  const [modalDirectorContact, setModalContactDirector] = useState("");
  const [financialCapacity, setFinancialCapacity] = useState([]);

  const [docUpload, setDocuploadData] = useState([]);
  const [file, setFile] = useState(null);
  const [cinValError, setCINValError] = useState("");
  const [showDevTypeFieldsValue, setShowDevTypeFieldsValue] = useState("");
  const [remainingStakeholderPercentage, setRemainingStakeholderPercentage] = useState(100);
  const [show, setShow] = useState(false);
  const [showStake, setShowStakeholder] = useState(false);

  // console.log("ADINFO",developerDataAddinfo);

  const [urlGetShareHoldingDoc, setDocShareHoldingUrl] = useState("");
  const [urlGetDirectorDoc, setDocDirectorUrl] = useState("");
  const handleShowStakeholder = () => {
    setShowStakeholder(true);
    setModalNAme("");
    setModaldesignition("");
    setModalPercentage("");
  };
  const handleCloseStakeholder = () => setShowStakeholder(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    setModalDIN("");
    setModalDirectorName("");
    setModalContactDirector("");
  };
  // console.log(devRegId);
  const handleshow = (e) => {
    const getshow = e.target.value;
    setShowhide(getshow);
  };

  function selectModalNameDirector(e) {
    if (!e.target.value || e.target.value.match("^[a-zA-z ]*$")) {
      setModalDirectorName(e.target.value);
    }
  }

  function selectModalContactDirector(e) {
    if (!e.target.value || e.target.value.match("^[6-90-9]*$")) {
      setModalContactDirector(e.target.value);
    }
  }
  function SelectName(e) {
    if (!e.target.value || e.target.value.match("^[a-zA-z ]*$")) {
      setName(e.target.value);
      setPanIsValid(false);
    }
  }
  function setMobileNo(e) {
    setMobileNumber(e.target.value);
  }
  function selectRegisteredMobile(e) {
    if (!e.target.value || e.target.value.match("^[6-90-9]*$")) {
      setRegisteredMobileNumber(e.target.value);
    }
  }
  function setUserEmailId(value) {
    setUserEmail(value);
  }
  function setUserEmailIndVal(e) {
    setUserEmailInd(e.target.value);
  }
  function selectCinNumber(e) {
    resetFormInfoData();
    setCinNo(e.target.value.toUpperCase());
  }

  const resetFormInfoData = () => {
    setCinNo("");
    setLLPNumber("");
    setCSRNumber("");
    setCompanyName("");
    setIncorporation("");
    setRegistered("");
    setUserEmailId("");
    setRegisteredMobileNumber("");
    setGST("");
    setExistingDirectors();
    setExistingColonizer();
    setDirectorData([]);
    setDirectorDataMCA([]);
  };
  function selectLlpNumber(e) {
    setLLPNumber(e.target.value.toUpperCase());
  }
  function selectCsrNumber(e) {
    setCSRNumber(e.target.value.toUpperCase());
  }
  function selectDinNumber(e) {
    if (!e.target.value || e.target.value.match("^[0-9]*$")) {
      setModalDIN(e.target.value);
    }
  }
  function setDateofBirth(e) {
    setDOB(e.target.value);
    setPanIsValid(false);
  }

  function setGenderName(value) {
    // console.log("GENDER", value.target.value);
    setGender(value.target.value);
    setPanIsValid(false);
  }

  function selectPanNumber(e) {
    // setPanNumber(e.target.value.toUpperCase());
    // if(e.target.value === 10){
    //   panVerification();
    // }
    if (!e.target.value || /^\w+$/.test(e.target.value)) {
      setPanNumber(e.target.value.toUpperCase());
      setPanIsValid(false);
      // if (e.target.value === 10) {
      //   alert("HEY")
      //   panVerification();
      // }
    }
  }

  const panVerification = async () => {
    setLoading(true);
    try {
      const panVal = {
        txnId: "f7f1469c-29b0-4325-9dfc-c567200a70f7",
        format: "xml",
        certificateParameters: {
          panno: PanNumber,
          PANFullName: name,
          FullName: name,
          DOB: dob,
          GENDER: gender,
        },
        consentArtifact: {
          consent: {
            consentId: "ea9c43aa-7f5a-4bf3-a0be-e1caa24737ba",
            timestamp: "2022-10-08T06:21:51.321Z",
            dataConsumer: {
              id: "string",
            },
            dataProvider: {
              id: "string",
            },
            purpose: {
              description: "string",
            },
            user: {
              idType: "string",
              idNumber: "string",
              mobile: mobileNumberUser,
              email: emailId,
            },
            data: {
              id: "string",
            },
            permission: {
              access: "string",
              dateRange: {
                from: "2022-10-08T06:21:51.321Z",
                to: "2022-10-08T06:21:51.321Z",
              },
              frequency: {
                unit: "string",
                value: 0,
                repeats: 0,
              },
            },
          },
          signature: {
            signature: "string",
          },
        },
      };
      const panResp = await axios.post(`/certificate/v3/pan/pancr`, panVal, {
        headers: {
          "Content-Type": "application/json",
          "X-APISETU-APIKEY": "PDSHazinoV47E18bhNuBVCSEm90pYjEF",
          "X-APISETU-CLIENTID": "in.gov.tcpharyana",
          "Access-Control-Allow-Origin": "*",
        },
      });
      setPanIsValid(true);
      setPanValError("");
      setLoading(false);
      // console.log("PANDET", panResp?.data);
    } catch (error) {
      setLoading(false);
      console.log(error?.response?.data?.errorDescription);
      setPanValError(error?.response?.data?.errorDescription);
    }
  };
  const handleshow0 = (e) => {
    const getshow = e.target.value;
    setShowhide0(getshow);
    localStorage.setItem("devTypeFlag", getshow);
  };
  // console.log("LOCALVAL",localStorage.getItem('devTypeValueFlag'));

  const resetForm = () => {
    setCinNo("");
    setLLPNumber("");
    setCSRNumber("");
    setCompanyName("");
    setIncorporation("");
    setRegistered("");
    setUserEmailId("");
    setRegisteredMobileNumber("");
    setGST("");
    setModalValuesArray([]);
    setRemainingStakeholderPercentage(100);
    setDirectorData([]);
    setExistingDirectors();
    setExistingColonizer();
    setExistingColonizerDetails({
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
      boardResolution: "",
    });
    setOthersArray([]);
  };

  function selectCompname(e) {
    if (e.target.value.match("^[a-zA-z ]*$")) {
      setCompanyName(e.target.value);
    }
  }

  function SelectExistingColonizerName(e) {
    if (!e.target.value || e.target.value.match("^[a-zA-Z ]*$")) {
      setExistingColonizerDetails({ ...existingColonizerDetails, name: e.target.value });
    }
  }

  const setDevType = (data) => {
    const getDevTypeValue = data?.value;
    // console.log("data123", data);
    setShowDevTypeFields(getDevTypeValue);
    // localStorage.setItem('devTypeValueFlag', getDevTypeValue)
    resetForm();
  };
  // function setDevType(value){
  //   setShowDevTypeFields(value)
  //   console.log(value);
  // }
  const getDocumentData = async (file, fieldName, type, index) => {
    // console.log("logFile", file);
    if (type === "existingColonizer") {
      if (getValues("existingColonizerFiles")?.includes(file.name)) {
        setShowToastError({ label: "Duplicate file Selected", error: true, success: false });
        return;
      }
    } else if (type === "shareholdingPattern") {
      if (getValues("shareholdingPatternFiles")?.includes(file.name)) {
        setShowToastError({ label: "Duplicate file Selected", error: true, success: false });
        return;
      }
    } else if (type === "directorInfoPdf") {
      if (getValues("directorInfoPdfFiles")?.includes(file.name)) {
        setShowToastError({ label: "Duplicate file Selected", error: true, success: false });
        return;
      }
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("tenantId", "hr");
    formData.append("module", "property-upload");
    formData.append("tag", "tag-property");
    // setLoader(true);
    try {
      setLoading(true);
      const Resp = await axios.post("/filestore/v1/files", formData, {}).then((response) => {
        return response;
      });
      setLoading(false);
      setShowToastError({ label: "File Uploaded Successfully", error: false, success: true });
      console.log(Resp?.data?.files?.[0]?.fileStoreId, fieldName, type, index);

      if (type === "existingColonizer") {
        console.log("log123 ====> ", fieldName, Resp?.data?.files?.[0]?.fileStoreId, Resp);
        setExistingColonizerDetails({ ...existingColonizerDetails, [fieldName]: Resp?.data?.files?.[0]?.fileStoreId });
        if (getValues("existingColonizerFiles")) {
          setValue("existingColonizerFiles", [...getValues("existingColonizerFiles"), file.name]);
        } else {
          setValue("existingColonizerFiles", [file.name]);
        }
      } else if (type === "shareholdingPattern") {
        console.log("entered into shareholding case");
        let temp = modalValuesArray;
        temp[index].uploadPdf = Resp?.data?.files?.[0]?.fileStoreId;
        setModalValuesArray([...temp]);
        console.log("set into shareholding case", temp, modalValuesArray);
        if (getValues("shareholdingPatternFiles")) {
          setValue("shareholdingPatternFiles", [...getValues("shareholdingPatternFiles"), file.name]);
        } else {
          setValue("shareholdingPatternFiles", [file.name]);
        }
      } else if (type === "directorInfoPdf") {
        console.log("entered into directorInfo case");
        let temp = DirectorData;
        temp[index].uploadPdf = Resp?.data?.files?.[0]?.fileStoreId;
        setDirectorData([...temp]);
        // console.log("set into directorInfo case", temp, DirectorData);
        if (getValues("directorInfoPdfFiles")) {
          setValue("directorInfoPdfFiles", [...getValues("directorInfoPdfFiles"), file.name]);
        } else {
          setValue("directorInfoPdfFiles", [file.name]);
        }
      } else {
        setValue(fieldName, Resp?.data?.files?.[0]?.fileStoreId);
        // setDocId(Resp?.data?.files?.[0]?.fileStoreId);
        // console.log("getValues()=====", getValues());
        setDocumentsData(getValues());
      }
    } catch (error) {
      setLoading(false);
      //   setLoader(false);
      alert(error?.response?.data?.Errors?.[0]?.description);
      console.log(error);
    }
  };

  function selectModalName(e) {
    if (!e.target.value || e.target.value.match("^[a-zA-Z ]*$")) {
      setModalNAme(e.target.value);
    }
  }
  function selectModalDesignition(e) {
    if (!e.target.value || e.target.value.match("^[a-zA-Z ]*$")) {
      setModaldesignition(e.target.value);
    }
  }
  function selectModalPercentage(e) {
    if (!e.target.value || e.target.value.match("^[0-9.{1}0-9]*$")) {
      setModalPercentage(e.target.value);
    }
  }

  const HandleGetMCNdata = async () => {
    try {
      if (cin_Number.length === 21) {
        setLoading(true);
        const Resp = await axios.get(`/mca/v1/companies/${cin_Number}`, {
          headers: {
            "Content-Type": "application/json",
            "X-APISETU-APIKEY": "PDSHazinoV47E18bhNuBVCSEm90pYjEF",
            "X-APISETU-CLIENTID": "in.gov.tcpharyana",
            "Access-Control-Allow-Origin": "*",
          },
        });

        const Directory = await axios.get(`/mca-directors/v1/companies/${cin_Number}`, {
          headers: {
            "Content-Type": "application/json",
            "X-APISETU-APIKEY": "PDSHazinoV47E18bhNuBVCSEm90pYjEF",
            "X-APISETU-CLIENTID": "in.gov.tcpharyana",
            "Access-Control-Allow-Origin": "*",
          },
        });
        setLoading(false);
        // console.log("CIN",Resp.data)
        // console.log(Directory.data);
        // if (DirectorData && DirectorData.length) {
        //   console.log("log1", DirectorData, Directory.data)
        // } else {
        //   console.log("log2", DirectorData, Directory.data)
        // }
        setDirectorDataMCA(Directory.data);

        if (!DirectorData?.length) {
          setDirectorData([...Directory?.data, ...DirectorData]);
        }
        setCompanyName(Resp.data.companyName);
        setIncorporation(Resp.data.incorporationDate);
        setUserEmailInd(Resp.data.email);
        //console.log(Resp.data.Email)
        setRegistered(Resp.data.registeredAddress);
        setMobile(Resp.data.registeredContactNo);
        //  setGST(Resp.data.GST)
      }
    } catch (error) {
      setLoading(false);
      console.log(error?.response?.data?.error_description);
      setCINValError(error?.response?.data?.error_description);
    }
  };
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  const handleArrayValues = () => {
    if (modalNAme !== "" && modaldesignition !== "" && modalPercentage !== "") {
      setRemainingStakeholderPercentage(Number(Number(remainingStakeholderPercentage) - Number(modalPercentage)).toFixed(2));
      const values = {
        name: modalNAme,
        designition: modaldesignition,
        percentage: modalPercentage + "%",
        uploadPdf: Documents?.uploadPdf,
        serialNumber: null,
      };
      setModalValuesArray((prev) => [...prev, values]);
      setDocumentsData([]);
      handleCloseStakeholder();
    }
  };

  const handleAddPeople = () => {
    if (othersDetails.name && othersDetails.designation && othersDetails.aadharNumber && othersDetails.panNumber && othersDetails.dob) {
      setOthersArray((prev) => [...prev, othersDetails]);
      setOthersDetails({
        name: "",
        designation: "",
        aadharNumber: "",
        panNumber: "",
        dob: "",
      });
      setAddPeopleModal(false);
    }
  };

  const handleDirectorsArrayValues = () => {
    if (modalDIN !== "" && modalDirectorName !== "" && modalDirectorContact !== "") {
      const values = {
        din: modalDIN,
        name: modalDirectorName,
        contactNumber: modalDirectorContact,
        uploadPdf: Documents?.directorInfoPdf,
        serialNumber: null,
      };

      setDirectorData((prev) => [...prev, values]);
      setDocumentsData([]);
      // getDocDirector();
      handleClose();
    }
  };
  // console.log("FORMARRAYVAL",modalValuesArray);
  useEffect(() => {
    HandleGetMCNdata();
  }, [cin_Number]);

  function selectChecked(e) {
    if (isUndertaken == false) {
      setIsUndertaken(true);
    } else {
      setIsUndertaken(false);
    }
  }

  const [PanValError, setPanValError] = useState("");

  const deleteTableRows = (i) => {
    const rows = [...modalValuesArray];
    let tempRows = rows.splice(i, 1);
    // console.log("log123", tempRows);
    // if(remainingStakeholderPercentage === 100){
    setRemainingStakeholderPercentage(Number(remainingStakeholderPercentage) + Number(tempRows[0].percentage.split("%")[0]));
    // }
    setModalValuesArray(rows);
  };
  const deleteDirectorTableRows = (i) => {
    const DirectorTableRows = [...DirectorData];
    DirectorTableRows.splice(i, 1);
    setDirectorData(DirectorTableRows);
  };

  // if (isLoading) return <Loader />;
  const goNext = async (e) => {
    // console.log("DIN123", formData?.result, formData?.result?.Licenses[0]?.id, formData);
    // const cin_match = cin_Number.match(Digit.Utils.getPattern('CIN'));
    // if(!cin_match) {
    //   alert("NOT Matched");
    // } else {
    //   alert("Matched");
    // }
    // if (!(formData?.result && formData?.result?.Licenses[0]?.id)) {
    let addInfo = {
      showDevTypeFields: showDevTypeFields,
      name: name,
      mobileNumberUser: mobileNumberUser,
      dob: dob,
      gender: gender,
      PanNumber: PanNumber,
      cin_Number: cin_Number,
      llp_Number: llp_Number,
      csr_Number: csrNumber,
      companyName: companyName,
      incorporationDate: incorporationDate,
      registeredAddress: registeredAddress,
      email: email,
      emailId: emailId,
      registeredContactNo: registeredContactNo,
      gst_Number: gst_Number,
      DirectorsInformationMCA: DirectorDataMCA,
      DirectorsInformation: DirectorData,
      isUndertaken: isUndertaken,
      shareHoldingPatterens: modalValuesArray,
      othersDetails: othersArray,
      existingColonizerData: existingColonizerDetails,
      existingColonizer: existingColonizer,
      existingDirectors: existingDirectors,
    };
    onSelect(config.key, addInfo);
    // console.log("DATALICDET",addInfo);
    // localStorage.setItem("addInfo",JSON.stringify(addInfo));

    const developerRegisterData = {
      id: userInfo?.info?.id,
      pageName: "addInfo",
      createdBy: userInfo?.info?.id,
      updatedBy: userInfo?.info?.id,
      devDetail: {
        addInfo: addInfo,
      },
    };
    setLoading(true);
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

          isAddressSame: isAddressSame,
        };
        //1, units
        onSelect("", data, "", true);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        setIsDisableForNext(false);
        // setShowToast({ key: "error" });
        setError(e?.response?.data?.Errors[0]?.message || null);
      });
    // }
    // else {
    //   let data = formData?.formData;
    //   data.LicenseAddInfo.showDevTypeFields = showDevTypeFields,
    //   data.LicenseAddInfo.cin_Number = cin_Number,
    //   data.LicenseAddInfo.companyName = companyName,
    //   data.LicenseAddInfo.incorporationDate = incorporationDate,
    //   data.LicenseAddInfo.registeredAddress = registeredAddress,
    //   data.LicenseAddInfo.email = email,

    //   data.LicenseAddInfo.registeredContactNo = registeredContactNo,
    //   data.LicenseAddInfo.gst_Number = gst_Number,
    //   data.LicenseAddInfo.DirectorsInformation = DirectorData,
    //   data.LicenseAddInfo.shareHoldingPatterens = modalValuesArray
    //   data.LicenseAddInfo.othersDetails = othersArray

    //   onSelect("", formData)
    // }
  };

  const onSkip = () => onSelect();

  const navigate = useHistory();

  const changeStep = (step) => {
    switch (step) {
      case 1:
        navigate.replace("/digit-ui/citizen/obps/stakeholder/apply/provide-license-type");
        break;
    }
  };

  return (
    <div>
      {loader && <Spinner />}
      <div className={isOpenLinkFlow ? "OpenlinkContainer" : ""}>
        {/* {JSON.stringify(showDevTypeFields)}efewfewfef */}
        {isOpenLinkFlow && <BackButton style={{ border: "none" }}>{t("CS_COMMON_BACK")}</BackButton>}
        <Timeline currentStep={2} flow="STAKEHOLDER" onChangeStep={changeStep} />
        {!isLoading ? (
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
            isDisabled={
              showDevTypeFields === "Individual" || showDevTypeFields === "Proprietorship Firm" || showDevTypeFields === "Hindu Undivided Family"
                ? !(
                    name &&
                    panIsValid &&
                    mobileNumberUser?.match(Digit.Utils.getPattern("MobileNo")) &&
                    emailId?.match(Digit.Utils.getPattern("Email")) &&
                    gst_Number?.match(Digit.Utils.getPattern("GSTNo"))
                  )
                : showDevTypeFields === "Others"
                ? !othersArray.length
                : showDevTypeFields === "Proprietorship Firm"
                ? false
                : showDevTypeFields &&
                  showDevTypeFields !== "Proprietorship Firm" &&
                  showDevTypeFields !== "Individual" &&
                  showDevTypeFields !== "Others" &&
                  showDevTypeFields !== "Limited Liability Partnership"
                ? (showDevTypeFields === "Trust"
                    ? false
                    : !csrNumber?.match(Digit.Utils.getPattern("CSR")) || showDevTypeFields === "Company"
                    ? false
                    : !cin_Number?.match(Digit.Utils.getPattern("CIN"))) ||
                  !registeredContactNo?.match(Digit.Utils.getPattern("MobileNo")) ||
                  (showDevTypeFields === "Trust" ? false : !gst_Number?.match(Digit.Utils.getPattern("GSTNo"))) ||
                  !registeredAddress.match(Digit.Utils.getPattern("Address")) ||
                  !existingColonizerDetails.licNo.match(Digit.Utils.getPattern("OldLicenceNo")) ||
                  !modalValuesArray?.length ||
                  !DirectorData.length ||
                  !isUndertaken ||
                  !(
                    existingColonizer === "N" ||
                    (existingColonizer === "Y" && existingColonizerDetails.name && existingColonizerDetails.licNo && existingColonizerDetails.licDate)
                  )
                : showDevTypeFields === "Limited Liability Partnership"
                ? !(
                    llp_Number &&
                    isUndertaken &&
                    llp_Number.match(Digit.Utils.getPattern("LLP")) &&
                    incorporationDate &&
                    registeredContactNo?.match(Digit.Utils.getPattern("MobileNo")) &&
                    email &&
                    companyName &&
                    registeredContactNo &&
                    registeredAddress &&
                    gst_Number &&
                    gst_Number?.match(Digit.Utils.getPattern("GSTNo"))
                  )
                : true
            }
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
                          <label htmlFor="name">
                            {`${t("Select Developer's Type")}`} <span className="text-danger font-weight-bold">*</span>
                          </label>
                          {/* <Dropdown
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
                            disable
                          /> */}
                          <Select value={showDevTypeFields} onChange={setDevType} className="w-100 form-control" variant="standard" disabled>
                            {arrayDevList?.map((item, index) => (
                              <MenuItem value={item.value}>{item?.code}</MenuItem>
                            ))}
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FOR INDIVIDUAL */}
              {(showDevTypeFields === "Individual" ||
                showDevTypeFields == "Proprietorship Firm" ||
                showDevTypeFields == "Hindu Undivided Family") && (
                <div className="card mb-3">
                  <h5 className="card-title fw-bold">Developer Details</h5>
                  <div className="card-body">
                    <div className="row">
                      <div className="col col-4">
                        <div className="form-group">
                          <label htmlFor="name">
                            Name <span className="text-danger font-weight-bold">*</span>
                          </label>
                          <input
                            type="text"
                            value={name}
                            name="name"
                            onChange={SelectName}
                            // onChange={(e) => setName(e.target.value)}

                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col col-4">
                        <div className="form-group">
                          <label htmlFor="email">
                            {" "}
                            Email <span className="text-danger font-weight-bold">*</span>
                          </label>
                          <input
                            type="text"
                            value={emailId}
                            placeholder={emailId}
                            name="emailId"
                            required={true}
                            onChange={setUserEmailIndVal}
                            className="form-control"
                          />
                          {emailId && emailId.length > 0 && !emailId.match(Digit.Utils.getPattern("Email")) && (
                            <CardLabelError style={{ width: "100%", marginTop: "5px", fontSize: "16px", marginBottom: "12px", color: "red" }}>
                              {"Invalid Email Address"}
                            </CardLabelError>
                          )}
                        </div>
                      </div>
                      <div className="col col-4">
                        <div className="form-group">
                          <label htmlFor="name">
                            Mobile No. <span className="text-danger font-weight-bold">*</span>
                          </label>
                          <input
                            value={mobileNumberUser}
                            placeholder={mobileNumberUser}
                            name="mobileNumberUser"
                            required={true}
                            onChange={(e) => {
                              setMobileNumber(e.target.value);
                              setPanIsValid(false);
                            }}
                            disabled
                            className="form-control"
                          />
                          {mobileNumberUser && mobileNumberUser.length > 0 && !mobileNumberUser.match(Digit.Utils.getPattern("MobileNo")) && (
                            <CardLabelError style={{ width: "100%", marginTop: "5px", fontSize: "16px", marginBottom: "12px", color: "red" }}>
                              {t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID")}
                            </CardLabelError>
                          )}
                        </div>
                      </div>
                      <div className="col col-4">
                        <div className="form-group">
                          <label htmlFor="dob">
                            Date of Birth <span className="text-danger font-weight-bold">*</span>
                          </label>
                          <input
                            type="date"
                            value={dob}
                            date={dob}
                            required={true}
                            onChange={setDateofBirth}
                            className="form-control"
                            name={dob}
                            max={convertEpochToDate(new Date().setFullYear(new Date().getFullYear() - 18))}
                          />
                        </div>
                      </div>
                      <div className="col col-4">
                        <div className="form-group">
                          <label htmlFor="dob">
                            Select gender <span className="text-danger font-weight-bold">*</span>
                          </label>
                          <Select value={gender || ""} onChange={setGenderName} className="w-100 form-control" variant="standard">
                            {menu?.map((item, index) => (
                              <MenuItem value={item.value}>{item?.code}</MenuItem>
                            ))}
                          </Select>
                        </div>
                      </div>
                      <div className="col col-4">
                        <div className="form-group">
                          <label htmlFor="PanNumber">
                            {`${t("BPA_APPLICANT_PAN_NO")}`}
                            <span class="text-danger font-weight-bold mx-2">*</span>
                          </label>
                          <div className="d-flex align-items-baseline">
                            <input
                              type="text"
                              name="PanNumber"
                              required={true}
                              value={PanNumber}
                              className="form-control"
                              onChange={selectPanNumber}
                              max={10}
                              maxlength="10"
                            />
                            <Button className="ml-3" onClick={panVerification}>
                              {panIsValid ? "Verified" : "Verify"}
                            </Button>
                          </div>
                          {PanNumber && PanNumber.length > 0 && !PanNumber.match(Digit.Utils.getPattern("PAN")) && (
                            <CardLabelError style={{ width: "100%", marginTop: "5px", fontSize: "16px", marginBottom: "12px" }}>
                              {t("BPA_INVALID_PAN_NO")}
                            </CardLabelError>
                          )}
                          <h3 className="error-message" style={{ color: "red" }}>
                            {panIsValid ? "" : PanValError}
                          </h3>
                        </div>
                      </div>
                      <div className="col col-4">
                        <div className="form-group">
                          <label htmlFor="name">
                            Registered Address <span className="text-danger font-weight-bold">*</span>
                          </label>

                          <input
                            type="text"
                            required={true}
                            name="registeredAddress"
                            value={registeredAddress}
                            placeholder={registeredAddress}
                            onChange={(e) => setRegistered(e.target.value)}
                            className="form-control"
                          />
                          {registeredAddress && registeredAddress.length > 0 && !registeredAddress.match(Digit.Utils.getPattern("Address")) && (
                            <CardLabelError style={{ width: "100%", marginTop: "5px", fontSize: "16px", marginBottom: "12px", color: "red" }}>
                              {t("Invalid Address")}
                            </CardLabelError>
                          )}
                        </div>
                      </div>
                      <div className="col col-4">
                        <div className="form-group">
                          <label htmlFor="name">
                            GST No. {showDevTypeFields !== "Trust" && <span className="text-danger font-weight-bold">*</span>}
                          </label>
                          <input
                            type="text"
                            name="gst_Number"
                            value={gst_Number}
                            placeholder={gst_Number}
                            onChange={(e) => setGST(e.target.value.toUpperCase())}
                            required={true}
                            className="form-control"
                          />
                          {gst_Number && gst_Number.length > 0 && !gst_Number.match(Digit.Utils.getPattern("GSTNo")) && (
                            <CardLabelError style={{ width: "100%", marginTop: "5px", fontSize: "16px", marginBottom: "12px", color: "red" }}>
                              {t("BPA_INVALID_GST_NO")}
                            </CardLabelError>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FOR PROPR */}

              {showDevTypeFields === "Otherss" && (
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
                          {othersArray?.length > 0 ? (
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
                          ) : (
                            <p className="text-danger text-center d-none">Click on the Add More Button</p>
                          )}
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
                                <label htmlFor="name" className="text">
                                  Name <span className="text-danger font-weight-bold">*</span>
                                </label>
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
                                <label htmlFor="designation" className="text">
                                  {" "}
                                  Designition <span className="text-danger font-weight-bold">*</span>
                                </label>
                                {/* <TextInput
                                  type="text"
                                  isMandatory={false}
                                  onChange={(e) => setOthersDetails({ ...othersDetails, designation: e.target.value })}
                                  placeholder=""
                                  class="employee-card-input"
                                  value={othersDetails.designation}
                                  maxlength={"30"}
                                /> */}
                                <input
                                  type="text"
                                  isMandatory={false}
                                  onChange={(e) => setOthersDetails({ ...othersDetails, designation: e.target.value })}
                                  placeholder=""
                                  class="employee-card-input"
                                  value={othersDetails.designation}
                                  maxlength={"30"}
                                />
                                {othersDetails.designation &&
                                  othersDetails.designation?.length > 0 &&
                                  !othersDetails.designation.match(Digit.Utils.getPattern("onlyAlphabets")) && (
                                    <CardLabelError
                                      style={{ width: "100%", marginTop: "-15px", fontSize: "16px", marginBottom: "12px", color: "red" }}
                                    >
                                      {t("No Numbers and Alphabets allowed ")}
                                    </CardLabelError>
                                  )}
                              </Col>

                              <Col md={3} xxl lg="4">
                                <label htmlFor="name" className="text">
                                  {" "}
                                  Aadhar Number <span className="text-danger font-weight-bold">*</span>
                                </label>
                                <TextInput
                                  type="number"
                                  isMandatory={false}
                                  value={othersDetails.aadharNumber}
                                  onChange={(e) => setOthersDetails({ ...othersDetails, aadharNumber: e.target.value })}
                                  placeholder=""
                                  class="aadhar-card-input"
                                  maxlength={"12"}
                                />

                                {othersDetails.aadharNumber &&
                                  othersDetails.aadharNumber.length > 0 &&
                                  !othersDetails.aadharNumber.match(Digit.Utils.getPattern("AadharNo")) && (
                                    <CardLabelError
                                      style={{ width: "100%", marginTop: "-15px", fontSize: "16px", marginBottom: "12px", color: "red" }}
                                    >
                                      {t("BPA_INVALID_AADHAR_NO")}
                                    </CardLabelError>
                                  )}

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
                                <label htmlFor="pan" className="text">
                                  {" "}
                                  Pan Number <span className="text-danger font-weight-bold">*</span>
                                </label>
                                <TextInput
                                  type="text"
                                  isMandatory={false}
                                  onChange={(e) => setOthersDetails({ ...othersDetails, panNumber: e.target.value?.toUpperCase() })}
                                  placeholder=""
                                  class="employee-card-input"
                                  value={othersDetails.panNumber}
                                  maxlength={"10"}
                                />

                                {othersDetails.panNumber &&
                                  othersDetails.panNumber.length > 0 &&
                                  !othersDetails.panNumber.match(Digit.Utils.getPattern("PAN")) && (
                                    <CardLabelError
                                      style={{ width: "100%", marginTop: "-15px", fontSize: "16px", marginBottom: "12px", color: "red" }}
                                    >
                                      {t("BPA_INVALID_PAN_NO")}
                                    </CardLabelError>
                                  )}
                              </Col>

                              <Col md={3} xxl lg="4">
                                <label htmlFor="dob" className="text">
                                  {" "}
                                  Date of Birth (DOB) <span className="text-danger font-weight-bold">*</span>
                                </label>
                                <input
                                  type="date"
                                  required
                                  onChange={(e) => setOthersDetails({ ...othersDetails, dob: e.target.value })}
                                  placeholder=""
                                  class="employee-card-input"
                                  value={othersDetails.dob}
                                  max={convertEpochToDate(new Date().setFullYear(new Date().getFullYear() - 18))}
                                />

                                {/* <DatePicker
                                  isMandatory={true}
                                  date={dob}
                                  onChange={(e) => setDOB(e)}
                                  disable={false}
                                  max={convertEpochToDate(new Date().setFullYear(new Date().getFullYear() - 18))}
                                /> */}
                              </Col>
                            </Row>
                          </form>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={() => setAddPeopleModal(false)}>
                            Close
                          </Button>
                          <Button
                            variant="primary"
                            disabled={
                              !othersDetails.name ||
                              !othersDetails.designation ||
                              !othersDetails.aadharNumber ||
                              !othersDetails.panNumber ||
                              !othersDetails.panNumber.match(Digit.Utils.getPattern("PAN")) ||
                              !othersDetails.aadharNumber.match(Digit.Utils.getPattern("AadharNo")) ||
                              !othersDetails.dob
                            }
                            onClick={handleAddPeople}
                          >
                            Save Changes
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </div>
                  </div>
                </div>
              )}

              {/* FOR COMPANY */}
              {showDevTypeFields &&
                showDevTypeFields !== "Individual" &&
                showDevTypeFields !== "Proprietorship Firm" &&
                showDevTypeFields !== "Hindu Undivided Family" &&
                showDevTypeFields !== "Others" &&
                showDevTypeFields !== "Society" &&
                showDevTypeFields !== "Firm" && (
                  <div className="card mb-3">
                    {/* <div className="card-header">
              <h5 className="card-title"> Developer</h5>
            </div> */}
                    <h5 className="card-title fw-bold">Developer Details</h5>
                    <div className="card-body">
                      <div className="row">
                        {showDevTypeFields !== "Hindu Undivided Family" && (
                          <div className="col col-4">
                            {/* {JSON.stringify(showDevTypeFields)}rgergerg */}
                            {(() => {
                              switch (showDevTypeFields) {
                                case "Trust":
                                  return (
                                    <div className="form-group">
                                      <label htmlFor="name">
                                        CSR Number <span className="text-danger font-weight-bold">*</span>
                                      </label>
                                      <input
                                        type="text"
                                        onChange={selectCsrNumber}
                                        value={csrNumber}
                                        name="csrNumber"
                                        className="form-control"
                                        max={11}
                                        maxlength="11"
                                      />
                                      {csrNumber && csrNumber.length > 0 && !csrNumber.match(Digit.Utils.getPattern("CSR")) && (
                                        <CardLabelError
                                          style={{ width: "100%", marginTop: "5px", fontSize: "16px", marginBottom: "12px", color: "red" }}
                                        >
                                          {t("BPA_INVALID_CSR_NO")}
                                        </CardLabelError>
                                      )}
                                      <h3 className="error-message" style={{ color: "red" }}>
                                        {cinValError}
                                      </h3>
                                    </div>
                                  );
                                case "Limited Liability Partnership":
                                  return (
                                    <div className="form-group">
                                      <label htmlFor="name">
                                        LLP Number <span className="text-danger font-weight-bold">*</span>
                                      </label>
                                      <input
                                        type="text"
                                        onChange={selectLlpNumber}
                                        value={llp_Number}
                                        name="llp_Number"
                                        className="form-control"
                                        max={8}
                                        maxlength="8"
                                      />
                                      {llp_Number && llp_Number.length > 0 && !llp_Number.match(Digit.Utils.getPattern("LLP")) && (
                                        <CardLabelError
                                          style={{ width: "100%", marginTop: "5px", fontSize: "16px", marginBottom: "12px", color: "red" }}
                                        >
                                          {t("BPA_INVALID_LLP_NO")}
                                        </CardLabelError>
                                      )}
                                      {/* <h3 className="error-message" style={{ color: "red" }}>{cinValError}</h3> */}
                                    </div>
                                  );
                                default:
                                  return (
                                    <div className="form-group">
                                      <label htmlFor="name">
                                        CIN Number <span className="text-danger font-weight-bold">*</span>
                                      </label>
                                      <input
                                        type="text"
                                        onChange={selectCinNumber}
                                        value={cin_Number}
                                        name="cin_Number"
                                        className="form-control"
                                        max={21}
                                        maxlength="21"
                                      />
                                      {cin_Number && cin_Number.length > 0 && !cin_Number.match(Digit.Utils.getPattern("CIN")) && (
                                        <CardLabelError
                                          style={{ width: "100%", marginTop: "5px", fontSize: "16px", marginBottom: "12px", color: "red" }}
                                        >
                                          {t("BPA_INVALID_CIN_NO")}
                                        </CardLabelError>
                                      )}
                                      <h3 className="error-message" style={{ color: "red" }}>
                                        {cinValError}
                                      </h3>
                                    </div>
                                  );
                              }
                            })()}
                          </div>
                        )}
                        <div className="col col-4">
                          <div className="form-group">
                            <label htmlFor="name">
                              {" "}
                              {showDevTypeFields === "Trust" ? "Trust Name" : "Company Name"} <span className="text-danger font-weight-bold">*</span>
                            </label>
                            <input
                              type="text"
                              value={companyName}
                              placeholder={companyName}
                              name="companyName"
                              // onChange={(e) => }
                              onChange={selectCompname}
                              className="form-control"
                              disabled={showDevTypeFields === "Company"}
                              maxlength="50"
                            />
                          </div>
                        </div>
                        <div className="col col-4">
                          <div className="form-group">
                            <label htmlFor="name">
                              Date of Incorporation <span className="text-danger font-weight-bold">*</span>
                            </label>
                            <input
                              type="date"
                              date={incorporationDate}
                              value={incorporationDate}
                              placeholder={incorporationDate}
                              onChange={(e) => setIncorporation(e.target.value)}
                              className="form-control"
                              disabled={showDevTypeFields === "Company"}
                            />
                          </div>
                        </div>
                        <div className="col col-4">
                          <div className="form-group">
                            <label htmlFor="name">
                              Registered Address <span className="text-danger font-weight-bold">*</span>
                            </label>
                            <input
                              type="text"
                              name="registeredAddress"
                              value={registeredAddress}
                              placeholder={registeredAddress}
                              onChange={(e) => setRegistered(e.target.value)}
                              className="form-control"
                              disabled={showDevTypeFields === "Company"}
                            />
                            {registeredAddress && registeredAddress.length > 0 && !registeredAddress.match(Digit.Utils.getPattern("Address")) && (
                              <CardLabelError style={{ width: "100%", marginTop: "-15px", fontSize: "16px", marginBottom: "12px", color: "red" }}>
                                {t("Invalid Address")}
                              </CardLabelError>
                            )}
                          </div>
                        </div>
                        <div className="col col-4">
                          <div className="form-group ">
                            <label htmlFor="emailId">
                              {" "}
                              Email <span className="text-danger font-weight-bold">*</span>
                            </label>
                            <input
                              type="text"
                              value={emailId}
                              placeholder={emailId}
                              name="emailId"
                              required={true}
                              onChange={setUserEmailIndVal}
                              className="form-control"
                            />
                            {emailId && emailId.length > 0 && !emailId.match(Digit.Utils.getPattern("Email")) && (
                              <CardLabelError style={{ width: "100%", marginTop: "5px", fontSize: "16px", marginBottom: "12px", color: "red" }}>
                                {"Invalid Email Address"}
                              </CardLabelError>
                            )}
                          </div>
                        </div>
                        <div className="col col-4">
                          <div className="form-group">
                            <label htmlFor="registeredContactNo">
                              Mobile No. <span className="text-danger font-weight-bold">*</span>
                            </label>
                            <input
                              type="text"
                              value={registeredContactNo}
                              placeholder={registeredContactNo}
                              name="registeredContactNo"
                              required={true}
                              max={10}
                              maxlength={"10"}
                              onChange={selectRegisteredMobile}
                              className="form-control"
                            />
                            {registeredContactNo &&
                              registeredContactNo.length > 0 &&
                              !registeredContactNo.match(Digit.Utils.getPattern("MobileNo")) && (
                                <CardLabelError style={{ width: "100%", marginTop: "5px", fontSize: "16px", marginBottom: "12px", color: "red" }}>
                                  {t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID")}
                                </CardLabelError>
                              )}
                          </div>
                        </div>
                        <div className="col col-4">
                          <div className="form-group">
                            <label htmlFor="gst_Number">
                              GST No. {showDevTypeFields !== "Trust" && <span className="text-danger font-weight-bold">*</span>}
                            </label>
                            <input
                              type="text"
                              value={gst_Number}
                              placeholder={gst_Number}
                              onChange={(e) => setGST(e.target.value.toUpperCase())}
                              name="gst_Number"
                              required={true}
                              className="form-control"
                            />
                            {gst_Number && gst_Number.length > 0 && !gst_Number.match(Digit.Utils.getPattern("GSTNo")) && (
                              <CardLabelError style={{ width: "100%", marginTop: "5px", fontSize: "16px", marginBottom: "12px", color: "red" }}>
                                {t("BPA_INVALID_GST_NO")}
                              </CardLabelError>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              {showDevTypeFields &&
                showDevTypeFields !== "Individual" &&
                showDevTypeFields !== "Proprietorship Firm" &&
                showDevTypeFields !== "Hindu Undivided Family" &&
                showDevTypeFields !== "Others" &&
                showDevTypeFields !== "Society" &&
                showDevTypeFields !== "Firm" &&
                showDevTypeFields !== "Limited Liability Partnership" && (
                  <div className="card mb-3">
                    <h5 className="card-title fw-bold">
                      Shareholding Patterns <span className="text-danger font-weight-bold">*</span>
                    </h5>
                    {/* {JSON.stringify(modalValuesArray)} */}
                    <div className="card-body">
                      <div className="table-bd">
                        {/* <table className="table table-bordered">
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
                            {modalValuesArray?.length > 0 ? (
                              modalValuesArray.map((elementInArray, input) => {
                                return (
                                  <tr>
                                    <td>{input + 1}</td>
                                    <td>{elementInArray.name}</td>
                                    <td>{elementInArray.designition}</td>
                                    <td>{elementInArray.percentage}</td>
                                    <td>
                                      <div className="row">
                                        {elementInArray.uploadPdf ? (
                                          <button
                                            type="button"
                                            title="View Document"
                                            onClick={() => getDocShareholding(elementInArray?.uploadPdf)}
                                            className="btn btn-sm col-md-6"
                                          >
                                            <VisibilityIcon color="info" className="icon" />
                                          </button>
                                        ) : (
                                          <p></p>
                                        )}
                                        <div className="btn btn-sm col-md-6">
                                          <label title="Upload Document" for={"uploadshareholdingPattern" + input}>
                                            {" "}
                                            <FileUpload color="primary" for={"uploadshareholdingPattern" + input} />
                                          </label>
                                          <input
                                            id={"uploadshareholdingPattern" + input}
                                            type="file"
                                            style={{ display: "none" }}
                                            onChange={(e) => getDocumentData(e?.target?.files[0], "uploadPdf", "shareholdingPattern", input)}
                                          />
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <a href="javascript:void(0)" title="Delete record" onClick={() => deleteTableRows(-1)}>
                                        <DeleteIcon color="danger" className="icon" />
                                      </a>
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <p className="text-danger text-center d-none">Click on the Add More Button</p>
                            )}
                          </tbody>
                        </table> */}

                        <Paper sx={{ width: "100%", overflow: "hidden" }}>
                          <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                              <TableHead>
                                <TableRow>
                                  <StyledTableCell>Sr No.</StyledTableCell>
                                  <StyledTableCell>Name</StyledTableCell>
                                  <StyledTableCell>Designition</StyledTableCell>
                                  <StyledTableCell>Percentage</StyledTableCell>
                                  <StyledTableCell>View Document</StyledTableCell>
                                  <StyledTableCell>Action</StyledTableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {modalValuesArray?.length > 0 ? (
                                  modalValuesArray.map((elementInArray, input) => {
                                    return (
                                      <StyledTableRow key={elementInArray.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                        <StyledTableCell component="th" scope="row">
                                          {input + 1}
                                        </StyledTableCell>
                                        <StyledTableCell>{elementInArray.name}</StyledTableCell>
                                        <StyledTableCell>{elementInArray.designition}</StyledTableCell>
                                        <StyledTableCell>{elementInArray.percentage}</StyledTableCell>
                                        <StyledTableCell>
                                          <div className="row">
                                            {elementInArray.uploadPdf ? (
                                              <button
                                                type="button"
                                                title="View Document"
                                                onClick={() => getDocShareholding(elementInArray?.uploadPdf)}
                                                className="btn btn-sm col-md-6"
                                              >
                                                <VisibilityIcon color="info" className="icon" />
                                              </button>
                                            ) : (
                                              <p></p>
                                            )}
                                            <div className="btn btn-sm col-md-6">
                                              <label title="Upload Document" for={"uploadshareholdingPattern" + input}>
                                                {" "}
                                                <FileUpload color="primary" for={"uploadshareholdingPattern" + input} />
                                              </label>
                                              <input
                                                id={"uploadshareholdingPattern" + input}
                                                type="file"
                                                style={{ display: "none" }}
                                                onChange={(e) => getDocumentData(e?.target?.files[0], "uploadPdf", "shareholdingPattern", input)}
                                              />
                                            </div>
                                          </div>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                          <a href="javascript:void(0)" title="Delete record" onClick={() => deleteTableRows(-1)}>
                                            <DeleteIcon color="danger" className="icon" />
                                          </a>
                                        </StyledTableCell>
                                      </StyledTableRow>
                                    );
                                  })
                                ) : (
                                  <div className="d-none">Click on Add More Button</div>
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={modalValuesArray?.length}
                            rowsPerPage={rowsPerPageStack}
                            page={pageStack}
                            onPageChange={handleChangePageStack}
                            onRowsPerPageChange={handleChangeRowsPerPageStack}
                          />
                        </Paper>
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
                                  <label htmlFor="modalNAme" className="text">
                                    Name <span className="text-danger font-weight-bold">*</span>
                                  </label>
                                  {/* <TextInput
                                  type="text"
                                  isMandatory={false}
                                  onChange={(e) => setModalNAme(e.target.value)}
                                  placeholder=""
                                  required
                                  class="employee-card-input"
                                  {...(validation = {
                                    isRequired: true,
                                    pattern: "^[a-zA-Z ]*$",
                                    type: "text",
                                  })}
                                /> */}
                                  <input
                                    type="text"
                                    value={modalNAme}
                                    name="modalNAme"
                                    maxlength={"30"}
                                    max={30}
                                    onChange={selectModalName}
                                    className="form-control"
                                  />
                                  {modalNAme && modalNAme.length > 0 && !modalNAme.match(Digit.Utils.getPattern("Name")) && (
                                    <CardLabelError style={{ width: "100%", marginTop: "5px", fontSize: "16px", marginBottom: "12px", color: "red" }}>
                                      {t("Please enter a valid Name")}
                                    </CardLabelError>
                                  )}
                                </Col>
                                <Col md={3} xxl lg="4">
                                  <label htmlFor="modaldesignition" className="text">
                                    {" "}
                                    Designition <span className="text-danger font-weight-bold">*</span>
                                  </label>
                                  {/* <TextInput
                                  type="text"
                                  isMandatory={false}
                                  onChange={(e) => setModaldesignition(e.target.value)}
                                  placeholder=""
                                  class="employee-card-input"
                                  {...(validation = {
                                    isRequired: true,
                                    pattern: "^[a-z A-Z ]*$",
                                    type: "text",
                                  })}
                                /> */}

                                  <input
                                    type="text"
                                    value={modaldesignition}
                                    name="modaldesignition"
                                    maxlength={"30"}
                                    max={30}
                                    onChange={selectModalDesignition}
                                    className="form-control"
                                  />
                                  {modaldesignition && modaldesignition.length > 0 && !modaldesignition.match(Digit.Utils.getPattern("Name")) && (
                                    <CardLabelError
                                      style={{ width: "100%", marginTop: "-15px", fontSize: "16px", marginBottom: "12px", color: "red" }}
                                    >
                                      {t("Please enter a valid Designition")}
                                    </CardLabelError>
                                  )}
                                </Col>

                                <Col md={3} xxl lg="4">
                                  <label htmlFor="modalPercentage" className="text">
                                    Percentage "%" <span className="text-danger font-weight-bold">*</span>
                                  </label>
                                  {/* <TextInput
                                  type="number"
                                  isMandatory={false}
                                  value={modalPercentage}
                                  onChange={(e) => setModalPercentage(e.target.value)}
                                  maxlength={4}
                                  class="employee-card-input"
                                  {...(validation = {
                                    isRequired: true,
                                  })}
                                /> */}
                                  <input
                                    type="text"
                                    value={modalPercentage}
                                    name="modalPercentage"
                                    maxlength={"4"}
                                    max={4}
                                    onChange={selectModalPercentage}
                                    className="form-control"
                                  />

                                  {modalPercentage && (remainingStakeholderPercentage < modalPercentage || modalPercentage <= 0) && (
                                    <CardLabelError style={{ width: "100%", marginTop: "5px", fontSize: "16px", marginBottom: "12px", color: "red" }}>
                                      {t("BPA_INVALID_PERCENTAGE")}
                                    </CardLabelError>
                                  )}

                                  {/* {((modalPercentage && !modalPercentage+"%".match(Digit.Utils.getPattern('Percentage')) )&& (modalPercentage > remainingStakeholderPercentage || modalPercentage > 0 ))&& <CardLabelError style={{ width: "100%", marginTop: '-15px', fontSize: '16px', marginBottom: '12px', color: 'red' }}>Please enter a valid percentage fot the stakeholder</CardLabelError>} */}

                                  {/* {modalPercentage && modalPercentage.length > 0 && !modalPercentage+"%".match(Digit.Utils.getPattern('Percentage')) && modalPercentage <= remainingStakeholderPercentage && <CardLabelError style={{ width: "100%", marginTop: '-15px', fontSize: '16px', marginBottom: '12px', color: 'red' }}>{t("BPA_INVALID_PERCENTAGE")}</CardLabelError>} */}
                                </Col>
                                <Col md={3} xxl lg="4">
                                  <label htmlFor="uploadPdf" className="text">
                                    Any Supportive Document
                                  </label>
                                  <input
                                    type="file"
                                    // value={file}
                                    placeholder=""
                                    name="uploadPdf"
                                    class="form-control"
                                    onChange={(e) => getDocumentData(e?.target?.files[0], "uploadPdf")}
                                    {...(validation = {
                                      isRequired: true,
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
                            <Button
                              variant="primary"
                              disabled={
                                !modalNAme ||
                                !modalNAme.match(Digit.Utils.getPattern("Name")) ||
                                !modaldesignition.match(Digit.Utils.getPattern("Name")) ||
                                !modaldesignition ||
                                !modalPercentage ||
                                remainingStakeholderPercentage < modalPercentage ||
                                modalPercentage <= 0
                              }
                              onClick={handleArrayValues}
                            >
                              Save Changes
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      </div>
                    </div>
                  </div>
                )}
              {showDevTypeFields &&
                showDevTypeFields !== "Individual" &&
                showDevTypeFields !== "Proprietorship Firm" &&
                showDevTypeFields !== "Hindu Undivided Family" &&
                showDevTypeFields !== "Others" &&
                showDevTypeFields !== "Society" &&
                showDevTypeFields !== "Firm" &&
                showDevTypeFields !== "Limited Liability Partnership" && (
                  <div className="card mb-3">
                    <h5 className="card-title fw-bold">Directors Information</h5>
                    <div className="card-body">
                      {/* {JSON.stringify(DirectorData)}ewewfewf */}
                      <div className="table-bd">
                        {/* <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>Sr. No</th>
                              <th>DIN Number</th>
                              <th>Name</th>
                              <th>Contact Number</th>
                            </tr>
                          </thead>
                          <tbody>
                            {DirectorDataMCA?.length > 0 ? (
                              DirectorDataMCA.map((elementInArray, input) => {
                                return (
                                  <tr key={input}>
                                    <td>{input + 1}</td>
                                    <td>{elementInArray.din}</td>
                                    <td>{elementInArray.name}</td>
                                    <td>{elementInArray.contactNumber}</td>
                                  </tr>
                                );
                              })
                            ) : (
                              <p></p>
                            )}
                          </tbody>
                        </table> */}

                        <Paper sx={{ width: "100%", overflow: "hidden" }}>
                          <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                              <TableHead>
                                <TableRow>
                                  <StyledTableCell>Sr No.</StyledTableCell>
                                  <StyledTableCell>DIN Number</StyledTableCell>
                                  <StyledTableCell>Name</StyledTableCell>
                                  <StyledTableCell>Contact Number</StyledTableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {DirectorDataMCA?.length > 0 ? (
                                  DirectorDataMCA.map((elementInArray, input) => {
                                    return (
                                      <StyledTableRow key={elementInArray.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                        <StyledTableCell component="th" scope="row">
                                          {input + 1}
                                        </StyledTableCell>
                                        <StyledTableCell>{elementInArray.din}</StyledTableCell>
                                        <StyledTableCell>{elementInArray.name}</StyledTableCell>
                                        <StyledTableCell>{elementInArray.contactNumber}</StyledTableCell>
                                      </StyledTableRow>
                                    );
                                  })
                                ) : (
                                  <div className="d-none">Click on Add to add a aurthorized user</div>
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={DirectorDataMCA?.length}
                            rowsPerPage={rowsPerPageMca}
                            page={pageMca}
                            onPageChange={handleChangePageMca}
                            onRowsPerPageChange={handleChangeRowsPerPageMca}
                          />
                        </Paper>
                      </div>
                      <p className="ml-1 mt-4">
                        If the directors are in addition/modification to data fetched from the MCA portal, then the complete details of existing
                        directors may be provided. <span className="text-danger font-weight-bold">*</span>
                      </p>
                      <div className="form-group ml-2">
                        <input
                          type="radio"
                          value="Y"
                          checked={existingDirectors === "Y" ? true : false}
                          id="existingDirectors"
                          className="mx-2 mt-1"
                          onChange={(e) => setExistingDirectors(e.target.value)}
                          name="existingDirectors"
                        />
                        <label for="Yes">Yes</label>

                        <input
                          type="radio"
                          value="N"
                          checked={existingDirectors === "N" ? true : false}
                          id="existingDirectorsN"
                          className="mx-2 mt-1"
                          onChange={(e) => setExistingDirectors(e.target.value)}
                          name="existingDirectors"
                        />
                        <label for="No">No</label>
                        {existingDirectors === "Y" && (
                          <div>
                            <div>
                              <button
                                type="button"
                                style={{
                                  color: "white",
                                }}
                                className="btn btn-primary my-3"
                                onClick={handleShow}
                              >
                                Enter Details
                              </button>
                              <Modal show={show} onHide={handleClose} animation={false}>
                                <Modal.Header closeButton>
                                  <Modal.Title>Add Directors Info</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                  <form className="text1">
                                    <Row>
                                      <Col md={3} xxl lg="4">
                                        <label htmlFor="name" className="text">
                                          DIN Number <span className="text-danger font-weight-bold">*</span>
                                        </label>
                                        {/* <MobileNumber
                                        value={modalDIN}
                                        name="modalDIN"
                                        maxlength={"8"}
                                        hideSpan="true"
                                        onChange={selectDinNumber}
                                        {...{ required: true, pattern: "[1-9][0-9]{7}", type: "tel"}}
                                      /> */}
                                        <input
                                          type="text"
                                          value={modalDIN}
                                          name="modalDIN"
                                          maxlength={"8"}
                                          max={8}
                                          onChange={selectDinNumber}
                                          className="form-control"
                                        />

                                        {modalDIN && modalDIN.length > 0 && !modalDIN.match(Digit.Utils.getPattern("DIN")) && (
                                          <CardLabelError
                                            style={{ width: "100%", marginTop: "5px", fontSize: "16px", marginBottom: "12px", color: "red" }}
                                          >
                                            {t("BPA_INVALID_DIN_NO")}
                                          </CardLabelError>
                                        )}
                                      </Col>
                                      <Col md={3} xxl lg="4">
                                        <label htmlFor="name" className="text">
                                          Name <span className="text-danger font-weight-bold">*</span>
                                        </label>
                                        <input
                                          type="text"
                                          name="modalDirectorName"
                                          value={modalDirectorName}
                                          // onChange={(e) => setModalDirectorName(e.target.value)}
                                          onChange={selectModalNameDirector}
                                          class="form-control"
                                        />
                                        {modalDirectorName &&
                                          modalDirectorName.length > 0 &&
                                          !modalDirectorName.match(Digit.Utils.getPattern("Name")) && (
                                            <CardLabelError
                                              style={{ width: "100%", marginTop: "5px", fontSize: "16px", marginBottom: "12px", color: "red" }}
                                            >
                                              {t("Please enter valid Name")}
                                            </CardLabelError>
                                          )}
                                      </Col>
                                      <Col md={3} xxl lg="4">
                                        <label htmlFor="name" className="text">
                                          {" "}
                                          Contact Number <span className="text-danger font-weight-bold">*</span>
                                        </label>

                                        {/* <MobileNumber
                                        value={modalDirectorContact}
                                        name="modalDirectorContact"
                                        onChange={selectModalContactDirector}
                                        {...{ required: true, pattern: "[6-9]{1}[0-9]{9}", type: "tel", title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID") }}
                                      /> */}
                                        <input
                                          value={modalDirectorContact}
                                          name="modalDirectorContact"
                                          required={true}
                                          onChange={selectModalContactDirector}
                                          className="form-control"
                                          max="10"
                                          maxlength={10}
                                        />
                                        {modalDirectorContact &&
                                          modalDirectorContact.length > 0 &&
                                          !modalDirectorContact.match(Digit.Utils.getPattern("MobileNo")) && (
                                            <CardLabelError
                                              style={{ width: "100%", marginTop: "5px", fontSize: "16px", marginBottom: "12px", color: "red" }}
                                            >
                                              {t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID")}
                                            </CardLabelError>
                                          )}
                                      </Col>
                                      <Col md={3} xxl lg="4">
                                        <label htmlFor="name" className="text">
                                          Upload document
                                        </label>
                                        <input
                                          type="file"
                                          name="uploadPdf"
                                          class="form-control"
                                          onChange={(e) => getDocumentData(e?.target?.files[0], "directorInfoPdf")}
                                          {...(validation = {
                                            isRequired: true,
                                            title: "Please upload document",
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
                                  <Button
                                    variant="primary"
                                    onClick={handleDirectorsArrayValues}
                                    disabled={
                                      !modalDIN ||
                                      !modalDIN.match(Digit.Utils.getPattern("DIN")) ||
                                      !modalDirectorName.match(Digit.Utils.getPattern("Name")) ||
                                      !modalDirectorContact ||
                                      !modalDirectorContact.match(Digit.Utils.getPattern("MobileNo"))
                                    }
                                  >
                                    Save Changes
                                  </Button>
                                </Modal.Footer>
                              </Modal>
                            </div>
                            <div className="table-bd">
                              {/* <table className="table table-bordered">
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
                                  {DirectorData?.length > 0 ? (
                                    DirectorData.map((elementInArray, input) => {
                                      return (
                                        <tr key={input}>
                                          <td>{input + 1}</td>
                                          <td>{elementInArray.din}</td>
                                          <td>{elementInArray.name}</td>
                                          <td>{elementInArray.contactNumber}</td>
                                          <td>
                                            <div className="row">
                                              {elementInArray?.uploadPdf ? (
                                                <button
                                                  type="button"
                                                  title="View Document"
                                                  onClick={() => getDocShareholding(elementInArray?.uploadPdf)}
                                                  className="btn btn-sm col-md-6 text-center"
                                                >
                                                  <VisibilityIcon color="info" className="icon" />
                                                </button>
                                              ) : (
                                                <p></p>
                                              )}
                                              <div className="btn btn-sm col-md-6">
                                                <label title="Upload Document" for={"uploaddirectorInfoPdf" + input}>
                                                  <FileUpload color="primary" for={"uploaddirectorInfoPdf" + input} />
                                                </label>
                                                <input
                                                  id={"uploaddirectorInfoPdf" + input}
                                                  type="file"
                                                  style={{ display: "none" }}
                                                  onChange={(e) => getDocumentData(e?.target?.files[0], "directorInfoPdf", "directorInfoPdf", input)}
                                                />
                                              </div>
                                            </div>
                                          </td>
                                          <td>
                                            <a href="javascript:void(0)" title="Delete record" onClick={() => deleteDirectorTableRows(-1)}>
                                              <DeleteIcon color="danger" className="icon" />
                                            </a>
                                          </td>
                                        </tr>
                                      );
                                    })
                                  ) : (
                                    <p></p>
                                  )}
                                </tbody>
                              </table> */}

                              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                                <TableContainer sx={{ maxHeight: 440 }}>
                                  <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                      <TableRow>
                                        <StyledTableCell>Sr No.</StyledTableCell>
                                        <StyledTableCell>DIN Number</StyledTableCell>
                                        <StyledTableCell>Name</StyledTableCell>
                                        <StyledTableCell>Contact Number</StyledTableCell>
                                        <StyledTableCell>Upload/View Document</StyledTableCell>
                                        <StyledTableCell>Action</StyledTableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {DirectorData?.length > 0 ? (
                                        DirectorData.map((elementInArray, input) => {
                                          return (
                                            <StyledTableRow key={elementInArray.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                              <StyledTableCell component="th" scope="row">
                                                {input + 1}
                                              </StyledTableCell>
                                              <StyledTableCell>{elementInArray.din}</StyledTableCell>
                                              <StyledTableCell>{elementInArray.name}</StyledTableCell>
                                              <StyledTableCell>{elementInArray.contactNumber}</StyledTableCell>
                                              <StyledTableCell>
                                                <div className="row">
                                                  {/* {JSON.stringify(elementInArray?.uploadPdf)} */}
                                                  {elementInArray?.uploadPdf ? (
                                                    <button
                                                      type="button"
                                                      title="View Document"
                                                      onClick={() => getDocShareholding(elementInArray?.uploadPdf)}
                                                      className="btn btn-sm col-md-6 text-center"
                                                    >
                                                      <VisibilityIcon color="info" className="icon" />
                                                    </button>
                                                  ) : (
                                                    <p></p>
                                                  )}
                                                  <div className="btn btn-sm col-md-6">
                                                    <label title="Upload Document" for={"uploaddirectorInfoPdf" + input}>
                                                      <FileUpload color="primary" for={"uploaddirectorInfoPdf" + input} />
                                                    </label>
                                                    <input
                                                      id={"uploaddirectorInfoPdf" + input}
                                                      type="file"
                                                      style={{ display: "none" }}
                                                      onChange={(e) =>
                                                        getDocumentData(e?.target?.files[0], "directorInfoPdf", "directorInfoPdf", input)
                                                      }
                                                    />
                                                  </div>
                                                </div>
                                              </StyledTableCell>
                                              <StyledTableCell align="center">
                                                {/* <Button variant="contained" color={"primary"} title="Delete record" onClick={() => viewRecord(elementInArray, input)}>
                                <DeleteIcon style={{ fill: "#ff1a1a" }} />
                              </Button> */}
                                                <a href="javascript:void(0)" title="Delete record" onClick={() => deleteDirectorTableRows(-1)}>
                                                  <DeleteIcon color="danger" className="icon" />
                                                </a>
                                              </StyledTableCell>
                                            </StyledTableRow>
                                          );
                                        })
                                      ) : (
                                        <div className="d-none">Click on Add to add a aurthorized user</div>
                                      )}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                                <TablePagination
                                  rowsPerPageOptions={[10, 25, 100]}
                                  component="div"
                                  count={DirectorData?.length}
                                  rowsPerPage={rowsPerPage}
                                  page={page}
                                  onPageChange={handleChangePage}
                                  onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                              </Paper>
                            </div>
                          </div>
                        )}
                      </div>

                      <p className="ml-1 my-3">
                        In case the Partner/director of the applicant firm/company is common with any existing colonizer who has been granted a
                        license under the 1975 act Yes/No. <span className="text-danger font-weight-bold">*</span>
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
                            {/* <div className="row ">
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
                                      <td align="center" style={{textAlign:'center'}} size="large">
                                          <label for="aggreementBtwId">
                                            <FileUpload color="primary" for="aggreementBtwId" />
                                          </label>
                                          <input
                                            id="aggreementBtwId"
                                            type="file"
                                            accept="application/pdf"
                                            style={{ display: "none" }}
                                            onChange={(e) => getDocumentData(e?.target?.files[0], "aggreementBtw", "existingColonizer")}
                                          />
                                      </td>
                                      <td style={{textAlign:'center'}}>
                                        {existingColonizerDetails.aggreementBtw ?
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
                                      <td align="center" style={{textAlign:'center'}} size="large">
                                        <label for="boardResolutionId">
                                          <FileUpload color="primary" for="boardResolutionId" />
                                        </label>
                                        <input
                                          id="boardResolutionId"
                                          type="file"
                                          accept="application/pdf"
                                          name="boardDoc"
                                          style={{ display: "none" }}
                                          onChange={(e) => getDocumentData(e?.target?.files[0], "boardResolution", "existingColonizer")}
                                          class="employee-card-input"
                                        />
                                      </td>
                                      <td style={{textAlign:'center'}}>
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
                        </div> */}

                            <div className="row mx-2">
                              {/* <div className="col col-4">
                            <div className="form-group">
                              <label htmlFor="dob">DOB <span className="text-danger font-weight-bold">*</span></label>
                              <input
                                type="date"
                                value={existingColonizerDetails.dob}
                                name="dob"
                                // onChange={SelectName}
                                onChange={(e) => setExistingColonizerDetails({ ...existingColonizerDetails, dob: e.target.value })}
                                className="employee-card-input"
                                max={convertEpochToDate(new Date().setFullYear(new Date().getFullYear() - 18))}
                              />
                            </div>
                          </div> */}

                              {/* <div className="col col-4">
                            <div className="form-group">
                              <label htmlFor="pan">PAN Number <span className="text-danger font-weight-bold">*</span></label>
                              <input
                                type="pan"
                                value={existingColonizerDetails.pan}
                                name="pan"
                                // onChange={SelectName}
                                onChange={(e) => setExistingColonizerDetails({ ...existingColonizerDetails, pan: e.target.value?.toUpperCase() })}
                                className="employee-card-input"
                                maxLength={10}
                              />
                              {existingColonizerDetails.pan && existingColonizerDetails.pan.length > 0 && !existingColonizerDetails.pan.match(Digit.Utils.getPattern('PAN')) && <CardLabelError style={{ width: "100%", marginTop: '-15px', fontSize: '16px', marginBottom: '12px', color: 'red' }}>{t("BPA_INVALID_PAN_NO")}</CardLabelError>}
                            </div>
                          </div> */}

                              <div className="col col-4">
                                <div className="form-group">
                                  <label htmlFor="licNo">
                                    License No. <span className="text-danger font-weight-bold">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={existingColonizerDetails.licNo}
                                    name="licNo"
                                    onChange={(e) =>
                                      setExistingColonizerDetails({ ...existingColonizerDetails, licNo: e.target.value.toUpperCase() })
                                    }
                                    className="form-control"
                                    maxLength={20}
                                  />
                                  {existingColonizerDetails.licNo &&
                                    existingColonizerDetails.licNo.length > 0 &&
                                    !existingColonizerDetails.licNo.match(Digit.Utils.getPattern("LicNumber")) && (
                                      <CardLabelError
                                        style={{ width: "100%", marginTop: "5px", fontSize: "16px", marginBottom: "12px", color: "red" }}
                                      >
                                        {t("Invalid Licence No.")}
                                      </CardLabelError>
                                    )}
                                </div>
                              </div>

                              <div className="col col-4">
                                <div className="form-group">
                                  <label htmlFor="name">
                                    Name of Developer <span className="text-danger font-weight-bold">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={existingColonizerDetails.name}
                                    name="name"
                                    onChange={SelectExistingColonizerName}
                                    // onChange={(e) => setExistingColonizerDetails({ ...existingColonizerDetails, name: e.target.value})}
                                    className="form-control"
                                    maxLength={30}
                                  />
                                  {existingColonizerDetails.name &&
                                    existingColonizerDetails.name.length > 0 &&
                                    !existingColonizerDetails.name.match(Digit.Utils.getPattern("Name")) && (
                                      <CardLabelError
                                        style={{ width: "100%", marginTop: "5px", fontSize: "16px", marginBottom: "12px", color: "red" }}
                                      >
                                        {t("Please enter valid name.")}
                                      </CardLabelError>
                                    )}
                                </div>
                              </div>

                              <div className="col col-4">
                                <div className="form-group">
                                  <label htmlFor="licDate">
                                    Date of Grant of Licence <span className="text-danger font-weight-bold">*</span>
                                  </label>
                                  <input
                                    type="date"
                                    value={existingColonizerDetails.licDate}
                                    name="licDate"
                                    // onChange={SelectName}
                                    onChange={(e) => setExistingColonizerDetails({ ...existingColonizerDetails, licDate: e.target.value })}
                                    className="form-control"
                                    max={convertEpochToDate(new Date().setFullYear(new Date().getFullYear()))}
                                  />
                                </div>
                              </div>

                              {/* <div className="col col-4">
                            <div className="form-group">
                              <label htmlFor="licValidity">Validity <span className="text-danger font-weight-bold">*</span></label>
                              <input
                                type="date"
                                value={existingColonizerDetails.licValidity}
                                name="licValidity"
                                onChange={(e) => setExistingColonizerDetails({ ...existingColonizerDetails, licValidity: e.target.value })}
                                className="employee-card-input"
                                disabled={!existingColonizerDetails.licDate}
                                min={existingColonizerDetails.licDate}
                              />
                            </div>
                          </div> */}

                              {/* <div className="col col-4">
                            <div className="form-group">
                              <label htmlFor="licValidity">Select Purpose</label>
                              <Select
                                onChange={(e) => setExistingColonizerDetails({ ...existingColonizerDetails, licPurpose: e.target.value })}
                                value={existingColonizerDetails.licPurpose}
                                className="w-100"
                                variant="standard"
                                displayEmpty
                                renderValue={
                                  existingColonizerDetails.licPurpose !== "" ? undefined : () => <p>Select Purpose</p>
                                }
                              >
                                {
                                  purposeOptions?.data?.map((item, index) => (
                                    <MenuItem value={item.value} >{item?.label}</MenuItem>
                                  ))
                                }
                              </Select>

                            </div>
                          </div> */}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              {/* FOR COMPANY */}
              {showDevTypeFields !== "Individual" &&
                showDevTypeFields !== "Proprietorship Firm" &&
                showDevTypeFields !== "Hindu Undivided Family" &&
                showDevTypeFields !== "Others" &&
                showDevTypeFields !== "Society" &&
                showDevTypeFields !== "Firm" && (
                  <Col md={12}>
                    {/* <Form.Group className="col-md-12">
                  <CheckBox
                    label={t("It is undertaken that the above information is true and correct for all facts and purposes.")}
                    onChange={(e) => selectChecked(e)}
                    value={isUndertaken}
                    checked={isUndertaken}
                    name={isUndertaken}
                    style={{ paddingBottom: "10px", paddingTop: "10px" }}
                  />
                </Form.Group> */}
                    <Checkbox {...label} onChange={(e) => selectChecked(e)} value={isUndertaken} checked={isUndertaken} name={isUndertaken} />
                    <label>
                      It is undertaken that the above information is true and correct for all facts and purposes.{" "}
                      <span className="text-danger font-weight-bold">*</span>
                    </label>
                  </Col>
                )}
            </div>
            {showToastError && (
              <CusToaster
                label={showToastError?.label}
                success={showToastError?.success}
                error={showToastError?.error}
                onClose={() => {
                  setShowToastError({ label: "", success: false, error: false });
                }}
              />
            )}
          </FormStep>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default LicenseAddInfo;
