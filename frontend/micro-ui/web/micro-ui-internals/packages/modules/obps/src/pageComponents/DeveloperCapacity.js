import {
  BackButton,
  CardLabel,
  CheckBox,
  FormStep,
  CardLabelError,
  TextArea,
  TextInput,
  Dropdown,
  Toast,
  RemoveIcon,
  UploadFile,
} from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import Timeline from "../components/Timeline";
import { useForm } from "react-hook-form";
import { Button, Form, FormLabel } from "react-bootstrap";
// import { Card, Row, Col } from "react-bootstrap";
// import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Modal, ModalHeader, ModalFooter, ModalBody } from "react-bootstrap";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileUpload from "@mui/icons-material/FileUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import { getDocShareholding } from "../../../tl/src/pages/employee/ScrutinyBasic/ScrutinyDevelopment/docview.helper";
import { MenuItem, Select } from "@mui/material";
import { convertEpochToDate } from "../utils/index";
import Spinner from "../components/Loader/index";

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

const DeveloperCapacity = ({ t, config, onSelect, value, userType, formData }) => {
  const { pathname: url } = useLocation();
  let validation = {};
  const userInfo = Digit.UserService.getUser();
  console.log("USERNAME", userInfo?.info?.name);
  const devRegId = localStorage.getItem("devRegId");
  let isOpenLinkFlow = window.location.href.includes("openlink");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const [data, setData] = useState();
  const [loader, setLoading] = useState(false);
  React.useEffect(async () => {
    const uuid = userInfo?.info?.uuid;
    const usersResponse = await Digit.UserService.userSearch(tenantId, { uuid: [uuid] }, {});
    setParentId(usersResponse?.user[0]?.parentId);
    setGenderMF(usersResponse?.user[0]?.gender);
    // console.log("USERID", usersResponse?.user[0]?.gender);
  }, [userInfo?.info?.uuid]);

  const { data: optionsArrList } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["Purpose"]);

  let arrayDevList = [];
  optionsArrList &&
    optionsArrList["common-masters"].Purpose.map((purposeTypeDetails) => {
      arrayDevList.push({ code: `${purposeTypeDetails.name}`, value: `${purposeTypeDetails.purposeCode}` });
    });

  const { setValue, getValues, watch } = useForm();

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

  const DevelopersAllData = getValues();
  console.log("DEVEDATAGEGT", DevelopersAllData);
  // const [Documents,getValues] = useState([]);

  const onSkip = () => onSelect();
  const getDeveloperData = async () => {
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
      console.log("log123ergergreg", developerDataGet);
      setData(developerDataGet);
      console.log("TECHEXP", developerDataGet?.devDetail[0]?.capacityDevelopAColony?.capacityDevelopColonyHdruAct?.sectorAndDevelopmentPlan);
      setValueHrdu(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.permissionGrantedHRDU);
      setValueTechExpert(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalExpert);
      setValueDesignatedDirectors(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.designatedDirectors);
      setValueAlreadyObtainedLic(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.alreadtObtainedLic);
      setModalCapacityDevelopColonyHdruAct(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.capacityDevelopColonyHdruAct || "");
      setModalDevPlan(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.capacityDevelopColonyHdruAct[1]?.sectorAndDevelopmentPlan || "");
      setModalDevValidity(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.capacityDevelopColonyHdruAct[1]?.validatingLicence || "");
      setCapacityDevelopColonyLawAct(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.capacityDevelopColonyLawAct || "");
      setModalLcNo(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.licenceNumber);
      setEngineerName(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalExpertEngaged[0]?.engineerName);
      setEngineerQualification(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalExpertEngaged[0]?.engineerQualification);
      setEngineerSign(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalExpertEngaged[0]?.engineerSign);
      setEngineerDegree(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalExpertEngaged[0]?.engineerDegree);
      setArchitectName(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalExpertEngaged[0]?.architectName);
      setArchitectQualification(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalExpertEngaged[0]?.architectQualification);
      setArchitectSign(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalExpertEngaged[0]?.architectSign);
      setArchitectDegree(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalExpertEngaged[0]?.architectDegree);
      setTownPlannerName(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalExpertEngaged[0]?.townPlannerName);
      setTownPlannerQualification(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalExpertEngaged[0]?.townPlannerQualification);
      setTownPlannerSign(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalExpertEngaged[0]?.townPlannerSign);
      setTownPlannerDegree(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalExpertEngaged[0]?.townPlannerDegree);
      setExistingDev(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.existingDeveloperAgreement);
      setExistingDevDoc(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.existingDeveloperAgreementDoc);
      setTechnicalCapacity(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalCapacity);
      setTechnicalCapacityDoc(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalCapacityDoc);
      setengineerNameN(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalExpertEngaged?.engineerNameN);
      setEngineerDocN(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.engineerDocN);
      setArchitectNameN(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.architectNameN);
      setArchitectDocN(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.architectDocN);
      setUplaodSpaBoard(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.uplaodSpaBoard);
      setUplaodSpaBoardDoc(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.uplaodSpaBoardDoc);
      setAgreementDoc(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.agreementDoc);
      setBoardDoc(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.boardDoc);
      setRegisteredDoc(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.registeredDoc);
      setBoardDocY(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.boardDocY);
      setEarlierDocY(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.earlierDocY);
      setBoardDocN(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.boardDocN);
      setEarlierDocN(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.earlierDocN);
      setTechnicalAssistanceAgreementDoc(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalAssistanceAgreementDoc);
      setDocuploadData(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.docUpload);
      setFile(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.file);
      setIndividualCertificateCA(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.individualCertificateCA);
      setCompanyBalanceSheet(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.companyBalanceSheet);
      setPaidUpCapital(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.paidUpCapital);
      setNetworthPartners(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.networthPartners);
      setNetworthFirm(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.networthFirm);
      console.log("Developer-Capacity", getDevDetails?.data?.devDetail[0]?.capacityDevelopAColony);
      setPanNumber(developerDataGet?.devDetail[0]?.licenceDetails?.PanNumber);
      setTechnicalCapacityOutsideHaryana(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalCapacityOutsideHaryana);
      setTechnicalCapacityOutsideHaryanaDetails(
        developerDataGet?.devDetail[0]?.capacityDevelopAColony?.technicalCapacityOutsideHaryanaDetails || technicalCapacityOutsideHaryanaDetails
      );
      setTechnicalCapacitySoughtFromAnyColonizer({
        licNo: developerDataGet?.devDetail[0]?.capacityDevelopAColony?.obtainedLicense[0]?.licNo || "",
        dateOfGrantingLic: developerDataGet?.devDetail[0]?.capacityDevelopAColony?.obtainedLicense[0]?.dateOfGrantingLic || "",
        licValidity: developerDataGet?.devDetail[0]?.capacityDevelopAColony?.obtainedLicense[0]?.licValidity || "",
        purpose: developerDataGet?.devDetail[0]?.capacityDevelopAColony?.obtainedLicense[0]?.purpose || "",
      });
      setDocumentsData(developerDataGet?.devDetail[0]?.capacityDevelopAColony?.documents);
      setTradeType(developerDataGet?.devDetail[0]?.applicantType?.licenceType);
      // console.log("TRADETYPE", developerDataGet?.devDetail[0]?.applicantType?.licenceType);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDeveloperData();
  }, []);

  const [tradeType, setTradeType] = useState("");
  const [Documents, setDocumentsData] = useState();
  const [genderUser, setGenderMF] = useState(formData?.LicneseDetails?.genderUser || formData?.formData?.LicneseDetails?.genderUser || "");
  const [name, setName] = useState(
    (!isOpenLinkFlow ? userInfo?.info?.name : "") || formData?.LicneseDetails?.name || formData?.formData?.LicneseDetails?.name || ""
  );
  const [email, setEmail] = useState(formData?.LicneseDetails?.email || formData?.formData?.LicneseDetails?.email || "");
  const [mobileNumber, setMobileNumber] = useState(
    (!isOpenLinkFlow ? userInfo?.info?.mobileNumber : "") ||
      formData?.LicneseDetails?.mobileNumber ||
      formData?.formData?.LicneseDetails?.mobileNumber ||
      ""
  );
  const [PermanentAddress, setPermanentAddress] = useState(
    formData?.LicneseDetails?.PermanentAddress || formData?.formData?.LicneseDetails?.PermanentAddress
  );
  const [PanNumber, setPanNumber] = useState(formData?.LicneseDetails?.PanNumber || formData?.formData?.LicneseDetails?.PanNumber || "");
  const [purposeOfColony, setShowPurposeType] = useState(
    formData?.LicneseDetails?.purposeOfColony || formData?.formData?.LicneseDetails?.purposeOfColony || ""
  );
  const [Correspondenceaddress, setCorrespondenceaddress] = useState(
    formData?.LicneseDetails?.Correspondenceaddress || formData?.formData?.LicneseDetails?.Correspondenceaddress || "HR"
  );
  const [isAddressSame, setisAddressSame] = useState(
    formData?.LicneseDetails?.isAddressSame || formData?.formData?.LicneseDetails?.isAddressSame || false
  );
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [isDisableForNext, setIsDisableForNext] = useState(false);
  const [isDevType, setIsDevType] = useState(false);
  const [isDevTypeComp, setIsDevTypeComp] = useState(false);
  const [modal, setmodal] = useState(false);
  const [modalColony, setmodalColony] = useState(false);
  const [capacityDevelopColonyHdruAct, setModalCapacityDevelopColonyHdruAct] = useState([]);
  // const [modalColonyDevGrpValuesArray, setModalColonyDevGrpValuesArray] = useState([]);
  const [capacityDevelopColonyLawAct, setCapacityDevelopColonyLawAct] = useState(formData?.LicneseDetails?.capacityDevelopColonyLawAct || []);
  const [capacityDevelopAColony, setcapacityDevelopAColony] = useState([]);

  const [licenceNumber, setModalLcNo] = useState(formData?.LicneseDetails?.licenceNumber || "");
  const [nameOfDeveloper, setModalDevName] = useState(formData?.LicneseDetails?.nameOfDeveloper || "");
  // const [purposeOfColony, setModalPurposeCol] = useState(formData?.LicneseDetails?.purposeOfColony || "");
  const [sectorAndDevelopmentPlan, setModalDevPlan] = useState(formData?.LicneseDetails?.sectorAndDevelopmentPlan || "");
  const [validatingLicence, setModalDevValidity] = useState(formData?.LicneseDetails?.validatingLicence || "");

  const [coloniesDeveloped, setColonyDev] = useState(formData?.LicneseDetails?.coloniesDeveloped || "");
  const [area, setColonyArea] = useState(formData?.LicneseDetails?.area || "");
  const [purpose, setColonyPurpose] = useState(formData?.LicneseDetails?.purpose || "");
  const [statusOfDevelopment, setColonyStatusDev] = useState(formData?.LicneseDetails?.statusOfDevelopment || "");
  const [outstandingDues, setColonyoutstandingDue] = useState(formData?.LicneseDetails?.outstandingDues || "");

  const [engineerName, setEngineerName] = useState(formData?.LicneseDetails?.engineerName || "");
  const [engineerQualification, setEngineerQualification] = useState(formData?.LicneseDetails?.engineerQualification || "");
  const [engineerSign, setEngineerSign] = useState(formData?.LicneseDetails?.engineerSign || DevelopersAllData?.engineerSign || "");
  const [engineerDegree, setEngineerDegree] = useState(formData?.LicneseDetails?.engineerDegree || DevelopersAllData?.engineerDegree || "");
  const [architectName, setArchitectName] = useState(formData?.LicneseDetails?.architectName || "");
  const [architectQualification, setArchitectQualification] = useState(formData?.LicneseDetails?.architectQualification || "");
  const [architectSign, setArchitectSign] = useState(formData?.LicneseDetails?.architectSign || DevelopersAllData?.architectSign || "");
  const [architectDegree, setArchitectDegree] = useState(formData?.LicneseDetails?.architectDegree || DevelopersAllData?.architectDegree || "");
  const [townPlannerName, setTownPlannerName] = useState(formData?.LicneseDetails?.townPlannerName || "");
  const [townPlannerQualification, setTownPlannerQualification] = useState(formData?.LicneseDetails?.townPlannerQualification || "");
  const [townPlannerSign, setTownPlannerSign] = useState(formData?.LicneseDetails?.townPlannerSign || DevelopersAllData?.architectDegree || "");
  const [townPlannerDegree, setTownPlannerDegree] = useState(formData?.LicneseDetails?.townPlannerDegree || "");
  const [existingDeveloperAgreement, setExistingDev] = useState(
    formData?.LicneseDetails?.existingDeveloperAgreement || DevelopersAllData?.existingDeveloperAgreement || ""
  );
  const [existingDeveloperAgreementDoc, setExistingDevDoc] = useState(
    formData?.LicneseDetails?.existingDeveloperAgreementDoc || DevelopersAllData?.existingDeveloperAgreementDoc || ""
  );
  const [technicalCapacity, setTechnicalCapacity] = useState(formData?.LicneseDetails?.technicalCapacity || "");
  const [technicalCapacityDoc, setTechnicalCapacityDoc] = useState(formData?.LicneseDetails?.technicalCapacityDoc || "");
  const [engineerNameN, setengineerNameN] = useState(formData?.LicneseDetails?.engineerNameN || "");
  const [engineerDocN, setEngineerDocN] = useState(formData?.LicneseDetails?.engineerDocN || "");
  const [architectNameN, setArchitectNameN] = useState(formData?.LicneseDetails?.architectNameN || "");
  const [architectDocN, setArchitectDocN] = useState(formData?.LicneseDetails?.architectDocN || "");
  const [uplaodSpaBoard, setUplaodSpaBoard] = useState(formData?.LicneseDetails?.uplaodSpaBoard || "");
  const [uplaodSpaBoardDoc, setUplaodSpaBoardDoc] = useState(formData?.LicneseDetails?.uplaodSpaBoardDoc || "");
  const [agreementDoc, setAgreementDoc] = useState(formData?.LicneseDetails?.agreementDoc || DevelopersAllData?.agreementDoc || "");
  const [boardDoc, setBoardDoc] = useState(formData?.LicneseDetails?.boardDoc || DevelopersAllData?.boardDoc || "");
  const [registeredDoc, setRegisteredDoc] = useState(formData?.LicneseDetails?.registeredDoc || DevelopersAllData?.registeredDoc || "");
  const [boardDocY, setBoardDocY] = useState(formData?.LicneseDetails?.boardDocY || DevelopersAllData?.boardDocY || "");
  const [earlierDocY, setEarlierDocY] = useState(formData?.LicneseDetails?.earlierDocY || DevelopersAllData?.earlierDocY || "");
  const [boardDocN, setBoardDocN] = useState(formData?.LicneseDetails?.boardDocN || DevelopersAllData?.boardDocN || "");
  const [earlierDocN, setEarlierDocN] = useState(formData?.LicneseDetails?.earlierDocN || DevelopersAllData?.earlierDocN || "");
  const [technicalAssistanceAgreementDoc, setTechnicalAssistanceAgreementDoc] = useState(
    formData?.LicneseDetails?.technicalAssistanceAgreementDoc || DevelopersAllData?.technicalAssistanceAgreementDoc || ""
  );
  const [docUpload, setDocuploadData] = useState("");
  const [file, setFile] = useState("");
  const [filesUp, setFilesUp] = useState(null);
  const [individualCertificateCA, setIndividualCertificateCA] = useState(DevelopersAllData?.individualCertificateCA || "");
  const [companyBalanceSheet, setCompanyBalanceSheet] = useState(DevelopersAllData?.companyBalanceSheet || "");
  const [paidUpCapital, setPaidUpCapital] = useState(DevelopersAllData?.paidUpCapital || "");
  const [networthPartners, setNetworthPartners] = useState(DevelopersAllData?.networthPartners || "");
  const [networthFirm, setNetworthFirm] = useState("");
  const [permissionGrantedHRDU, setValueHrdu] = useState("");
  const [technicalExpert, setValueTechExpert] = useState("");
  const [designatedDirectors, setValueDesignatedDirectors] = useState("");
  const [alreadtObtainedLic, setValueAlreadyObtainedLic] = useState("");
  const [showhide1, setShowhide1] = useState("Y");
  const [showhide0, setShowhide0] = useState("Y");
  const [showhide6, setShowhide6] = useState("no");
  let isopenlink = window.location.href.includes("/openlink/");
  const isCitizenUrl = Digit.Utils.browser.isMobile() ? true : false;
  const [uploadedFile, setUploadedFile] = useState(null);
  const [urlGetForFile, setFIleUrl] = useState("");
  const [urlGetValidateLicFile, setValidateLicUrl] = useState("");
  const [urlGetStatusDevFile, setStatusDevUrl] = useState("");
  const [urlGetOutstandingFile, setOutStandingUrl] = useState("");
  const [urlGetCompanyBalanceSheet, setCompanyBalanceSheetUrl] = useState("");
  const [urlGetPaidUpCapital, setPaidUpCapitalUrl] = useState("");
  const [urlGetIndividualCertificateCA, setIndividualCertificatCAUrl] = useState("");
  const [urlGetEngineerSignUrl, setEngineerSignUrl] = useState("");
  const [urlGetArchitectSignUrl, setArchitectSignUrl] = useState("");
  const [urlGetTownPlannerSignUrl, setTownPlannerSignUrl] = useState("");
  const [urlGetAgreementDocUrl, setAgreementDocUrl] = useState("");
  const [urlGetBoardDocUrl, setBoardDocUrl] = useState("");
  const [urlGetRegisteredDocUrl, setRegisteredDocUrl] = useState("");
  const [urlGetBoardDocYUrl, setBoardDocYUrl] = useState("");
  const [urlGetEarlierDocYUrl, setEarlierDocYUrl] = useState("");
  const [hrduModalData, setHrduModalData] = useState({
    licNo: "",
    dateOfGrantingLic: "",
    purposeOfColony: "",
    licValidity: "",
    // technicalExpertEngaged: "",
    // engineerDegree: "",
    // architectDegree: "",
    // townPlannerDegree: "",
  });
  const [technicalCapacityOutsideHaryana, setTechnicalCapacityOutsideHaryana] = useState();
  const [technicalCapacityOutsideHaryanaDetails, setTechnicalCapacityOutsideHaryanaDetails] = useState({
    project: "",
    authority: "",
    statusOfDevelopment: "",
    permissionLetterDoc: "",
    projectArea: "",
    location: "",
    hrDetailAnyDoc: "",
  });
  const [purposeOptions, setPurposeOptions] = useState({ data: [], isLoading: true });
  const [technicalCapacitySoughtFromAnyColonizer, setTechnicalCapacitySoughtFromAnyColonizer] = useState({
    licNo: "",
    dateOfGrantingLic: "",
    licValidity: "",
    purpose: "",
  });

  // console.log("LIC NO...",technicalCapacitySoughtFromAnyColonizer.licNo)
  const { data: PurposeType } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["Purpose"]);

  useEffect(() => {
    const purpose = PurposeType?.["common-masters"]?.Purpose?.map(function (data) {
      return { value: data?.purposeCode, label: data?.name };
    });
    // console.log("log123", purpose);
    setPurposeOptions({ data: purpose, isLoading: false });
  }, [PurposeType]);

  if (isopenlink)
    window.onunload = function () {
      sessionStorage.removeItem("Digit.BUILDING_PERMIT");
    };

  function selectChecked(e) {
    if (isAddressSame == false) {
      setisAddressSame(true);
      setCorrespondenceaddress(
        formData?.LicneseDetails?.PermanentAddress ? formData?.LicneseDetails?.PermanentAddress : formData?.formData?.LicneseDetails?.PermanentAddress
      );
    } else {
      Array.from(document.querySelectorAll("input")).forEach((input) => (input.value = ""));
      setisAddressSame(false);
      setCorrespondenceaddress("");
    }
  }
  function selectCorrespondenceaddress(e) {
    setCorrespondenceaddress(e.target.value);
  }

  // const formSubmit = (data) => {
  //     console.log("data", data);
  // };

  const [AppliedDetailFormSubmitted, SetAppliedDetailFormSubmitted] = useState(false);

  const [showCapacityDevelopColony, setShowCapacityDevelopColony] = useState(false);
  const handleShowCapacityDevelopColony = () => {
    setShowCapacityDevelopColony(true);
    setModalLcNo("");
    setModalDevName("");
    setShowPurposeType("");
    // setAurthorizedEmail("");
    // setAurthorizedDob("");
    // setGender("");
    // setAurthorizedPan("");
  };
  const handleCloseCapacityDevelopColony = () => {
    setValue("hrduModalActFile", []);
    setShowCapacityDevelopColony(false);
  };

  const [showColoniesDeveloped, setShowColoniesDeveloped] = useState(false);
  const handleShowColoniesDeveloped = () => {
    setShowColoniesDeveloped(true);
    setColonyArea("");
    setColonyPurpose("");
    // setAurthorizedEmail("");
    // setAurthorizedDob("");
    // setGender("");
    // setAurthorizedPan("");
  };
  const handleCloseColoniesDeveloped = () => setShowColoniesDeveloped(false);

  const changeValueHrdu = (e) => {
    console.log(e.target.value);
    setValueHrdu(e.target.value);
    setValueDesignatedDirectors("");
    setDocumentsData({ ...Documents, agreementDoc: "", boardDoc: "" });
    setModalCapacityDevelopColonyHdruAct([]);
  };
  const changeTechnicalExpert = (e) => {
    console.log(e.target.value);
    setValueTechExpert(e.target.value);
  };
  const changeDesignatedDirectors = (e) => {
    console.log(e.target.value);
    setValueDesignatedDirectors(e.target.value);
    setDocumentsData({ ...Documents, agreementDoc: "", boardDoc: "" });
  };
  const changeAlreadyObtainedLic = (e) => {
    console.log(e.target.value);
    setValueAlreadyObtainedLic(e.target.value);
  };

  const handleshow = (e) => {
    const getshow = e.target.value;
    console.log(getshow);
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
  const [showToastError, setShowToastError] = useState(null);
  const devTypeFlagVal = localStorage.getItem("devTypeValueFlag");
  // const getDocumentData = async () => {
  //     if (file === null) {
  //         return
  //     }
  //     const formData = new FormData();
  //     formData.append("file", file.file);
  //     formData.append("tenantId", tenantId);
  //     formData.append("module", "property-upload");
  //     try {
  //         const Resp = await axios.post("/filestore/v1/files", formData,
  //             {
  //                 headers: {
  //                     "content-type": "multipart/form-data"
  //                 }
  //             }).then((response) => {
  //                 return response
  //             });
  //         const docValue = Resp.data?.files[0]?.fileStoreId
  //         setModalDevPlan(docValue);
  //     } catch (error) {
  //         console.log(error.message);
  //     }
  //     getDocData();
  // }

  const getDocumentData = async (file, fieldName, formType) => {
    if (formType === "devTypeDocument") {
      if (getValues("devTypeDocument")?.includes(file.name)) {
        setShowToastError({ label: "Duplicate file Selected", error: true, success: false });
        return;
      }
    } else if (formType === "hrduModalActFile") {
      if (getValues("hrduModalActFile")?.includes(file.name)) {
        setShowToastError({ label: "Duplicate file Selected", error: true, success: false });
        return;
      }
    } else if (formType === "designatedDirectorsFile") {
      if (getValues("designatedDirectorsFile")?.includes(file.name)) {
        setShowToastError({ label: "Duplicate file Selected", error: true, success: false });
        return;
      }
    } else if (formType === "alreadyObtaileLicFile") {
      if (getValues("alreadyObtaileLicFile")?.includes(file.name)) {
        setShowToastError({ label: "Duplicate file Selected", error: true, success: false });
        return;
      }
    } else if (formType === "outsideHrDocY") {
      if (getValues("outsideHrDocY")?.includes(file.name)) {
        setShowToastError({ label: "Duplicate file Selected", error: true, success: false });
        return;
      }
    } else if (formType === "techicalExpertFile") {
      if (getValues("techicalExpertFile")?.includes(file.name)) {
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

      // console.log(Resp?.data?.files);
      setValue(fieldName, Resp?.data?.files?.[0]?.fileStoreId);
      // setDocId(Resp?.data?.files?.[0]?.fileStoreId);
      // console.log("getValues()=====", getValues(), { ...Documents, ...getValues() }, Documents);
      setDocumentsData({ ...Documents, ...getValues() });
      //   setLoader(false);

      if (formType === "devTypeDocument") {
        if (getValues("devTypeDocument")) {
          setValue("devTypeDocument", [...getValues("devTypeDocument"), file.name]);
        } else {
          setValue("devTypeDocument", [file.name]);
        }
      } else if (formType === "hrduModalActFile") {
        if (getValues("hrduModalActFile")) {
          setValue("hrduModalActFile", [...getValues("hrduModalActFile"), file.name]);
        } else {
          setValue("hrduModalActFile", [file.name]);
        }
      } else if (formType === "designatedDirectorsFile") {
        if (getValues("designatedDirectorsFile")) {
          setValue("designatedDirectorsFile", [...getValues("designatedDirectorsFile"), file.name]);
        } else {
          setValue("designatedDirectorsFile", [file.name]);
        }
      } else if (formType === "alreadyObtaileLicFile") {
        if (getValues("alreadyObtaileLicFile")) {
          setValue("alreadyObtaileLicFile", [...getValues("alreadyObtaileLicFile"), file.name]);
        } else {
          setValue("alreadyObtaileLicFile", [file.name]);
        }
      } else if (formType === "outsideHrDocY") {
        if (getValues("outsideHrDocY")) {
          setValue("outsideHrDocY", [...getValues("outsideHrDocY"), file.name]);
        } else {
          setValue("outsideHrDocY", [file.name]);
        }
      } else if (formType === "techicalExpertFile") {
        if (getValues("techicalExpertFile")) {
          setValue("techicalExpertFile", [...getValues("techicalExpertFile"), file.name]);
        } else {
          setValue("techicalExpertFile", [file.name]);
        }
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const setpurposeType = (data) => {
    const getDevTypeValue = data?.value;
    setShowPurposeType(getDevTypeValue);
  };

  const handleArrayValues = () => {
    if (hrduModalData.licNo && hrduModalData.licValidity && hrduModalData.dateOfGrantingLic && purposeOfColony) {
      const values = {
        licenceNumber: hrduModalData.licNo,
        dateOfGrantingLic: hrduModalData.dateOfGrantingLic,
        purposeOfColony: purposeOfColony,
        // sectorAndDevelopmentPlan: Documents?.sectorAndDevelopmentPlan,
        licValidity: hrduModalData.licValidity,
        // technicalExpertEngaged: hrduModalData.technicalExpertEngaged,
        // engineerDegree: Documents?.engineerDegree,
        // architectDegree: Documents?.architectDegree,
        // townPlannerDegree: Documents?.townPlannerDegree
      };
      setModalCapacityDevelopColonyHdruAct((prev) => [...prev, values]);
      console.log("WIHT DOC", values);
      // getDocData();
      // getDocValidLic();
      handleCloseCapacityDevelopColony();
      setHrduModalData({
        licNo: "",
        dateOfGrantingLic: "",
        purposeOfColony: "",
        licValidity: "",
      });
      // setShowCapacityDevelopColony(false)
    }
    // setShowCapacityDevelopColony(false)
    console.log("DevCapacityTwo", hrduModalData);
    console.log("DevCapacityFirst", capacityDevelopColonyHdruAct);
    localStorage.setItem("DevCapacityDetails", JSON.stringify(capacityDevelopColonyHdruAct));
  };

  const deleteTableRows = (i) => {
    const rows = [...capacityDevelopColonyHdruAct];
    rows.splice(i, 1);
    setModalCapacityDevelopColonyHdruAct(rows);
  };

  const handleColonyDevGrp = () => {
    if (coloniesDeveloped !== "" && area !== "" && purpose !== "") {
      const colonyDevValues = {
        coloniesDeveloped: coloniesDeveloped,
        area: area,
        purpose: purpose,
        statusOfDevelopment: Documents?.statusOfDevelopment,
        outstandingDues: Documents?.outstandingDues,
      };
      setCapacityDevelopColonyLawAct((prev) => [...prev, colonyDevValues]);
      getDocStatusDev();
      getOutstandingDues();
      handleCloseColoniesDeveloped();
      console.log("DevCapacityColony", capacityDevelopColonyLawAct);
    }
  };

  const deleteLawActTableRows = (i) => {
    const rows = [...capacityDevelopColonyLawAct];
    rows.splice(i, 1);
    setCapacityDevelopColonyLawAct(rows);
  };

  const goNext = async (e) => {
    // if (!(formData?.result && formData?.result?.Licenses[0]?.id)) {
    // if(!capacityDevelopColonyHdruAct?.length){
    //   alert('Please add details');
    //   return;
    // }
    let payload = {
      parentId: userInfo?.info?.id,
      Licenses: [
        {
          applicationType: "NEW",
          tradeLicenseDetail: {
            owners: [
              {
                parentid: userInfo?.info?.id,
                gender: "MALE",
                mobileNumber: userInfo?.info?.mobileNumber,
                name: userInfo?.info?.name,
                dob: null,
                emailId: email,
                permanentAddress: PermanentAddress,
                correspondenceAddress: Correspondenceaddress,
                pan: PanNumber,
                // "permanentPinCode": "143001"
              },
            ],
            subOwnerShipCategory: "INDIVIDUAL",
            tradeType: tradeType,
            additionalDetail: {
              counsilForArchNo: null,
            },
            address: {
              city: "",
              landmark: "",
              pincode: "",
            },
            institution: null,
            applicationDocuments: null,
          },
          licenseType: "PERMANENT",
          businessService: "BPAREG",
          tenantId: stateId,
          action: "NOWORKFLOW",
        },
      ],
    };
    setLoading(true);
    Digit.OBPSService.BPAREGCreate(payload, tenantId)
      .then((result, err) => {
        setIsDisableForNext(false);
        let data = { result: result, formData: formData, Correspondenceaddress: Correspondenceaddress, isAddressSame: isAddressSame };
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

    const developerRegisterData = {
      id: userInfo?.info?.id,
      pageName: "capacityDevelopAColony",
      createdBy: userInfo?.info?.id,
      updatedBy: userInfo?.info?.id,
      devDetail: {
        capacityDevelopAColony: {
          individualCertificateCA: individualCertificateCA,
          companyBalanceSheet: companyBalanceSheet,
          paidUpCapital: paidUpCapital,
          networthPartners: networthPartners,
          networthFirm: networthFirm,
          permissionGrantedHRDU: permissionGrantedHRDU,
          technicalExpert: technicalExpert,
          designatedDirectors: designatedDirectors,
          alreadtObtainedLic: alreadtObtainedLic,
          capacityDevelopColonyHdruAct: capacityDevelopColonyHdruAct,
          // capacityDevelopColonyLawAct: capacityDevelopColonyLawAct,
          technicalExpertEngaged: [
            {
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
              uplaodSpaBoardDoc: uplaodSpaBoardDoc,
            },
          ],
          designationDirector: [
            {
              agreementDoc: agreementDoc,
              boardDoc: boardDoc,
            },
          ],
          obtainedLicense: [
            {
              registeredDoc: registeredDoc,
              boardDocY: boardDocY,
              earlierDocY: earlierDocY,
              boardDocN: boardDocN,
              earlierDocN: earlierDocN,
              technicalAssistanceAgreementDoc: technicalAssistanceAgreementDoc,
              licNo: technicalCapacitySoughtFromAnyColonizer.licNo,
              dateOfGrantingLic: technicalCapacitySoughtFromAnyColonizer.dateOfGrantingLic,
              licValidity: technicalCapacitySoughtFromAnyColonizer.licValidity,
              purpose: technicalCapacitySoughtFromAnyColonizer.purpose,
            },
          ],
          technicalCapacityOutsideHaryana: technicalCapacityOutsideHaryana,
          technicalCapacityOutsideHaryanaDetails: technicalCapacityOutsideHaryanaDetails,
          documents: Documents,
        },
      },
    };

    Digit.OBPSService.CREATEDeveloper(developerRegisterData, tenantId)
      .then((result, err) => {
        console.log("DATA", result?.id);
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
      })
      .catch((e) => {
        setIsDisableForNext(false);
        // setShowToast({ key: "error" });
        setError(e?.response?.data?.Errors[0]?.message || null);
      });
    // }
    // else {
    //     formData.Correspondenceaddress = Correspondenceaddress;
    //     formData.isAddressSame = isAddressSame;
    //     onSelect("", formData, "", true);
    // }
    // sessionStorage.setItem("CurrentFinancialYear", FY);
    // onSelect(config.key, { TradeName });
  };

  const navigate = useHistory();

  const changeStep = (step) => {
    switch (step) {
      case 1:
        navigate.replace("/digit-ui/citizen/obps/stakeholder/apply/provide-license-type");
        break;
      case 2:
        navigate.replace("/digit-ui/citizen/obps/stakeholder/apply/license-add-info");
        break;
      case 3:
        navigate.replace("/digit-ui/citizen/obps/stakeholder/apply/add-authorized-user");
        break;
    }
  };

  return (
    <React.Fragment>
      <div className={isopenlink ? "OpenlinkContainer" : ""}>
        {loader && <Spinner />}
        {/* {JSON.stringify(data?.devDetail[0]?.addInfo?.showDevTypeFields)}efwefewfewf
                {JSON.stringify(data)}efewfewf */}
        {isopenlink && <BackButton style={{ border: "none" }}>{t("CS_COMMON_BACK")}</BackButton>}
        <Timeline currentStep={4} flow="STAKEHOLDER" onChangeStep={changeStep} />
        <FormStep
          config={config}
          onSelect={goNext}
          onSkip={onSkip}
          t={t}
          isDisabled={
            (data?.devDetail[0]?.addInfo?.showDevTypeFields === "Individual" ||
            data?.devDetail[0]?.addInfo?.showDevTypeFields === "Proprietorship Firm" ||
            data?.devDetail[0]?.addInfo?.showDevTypeFields === "Hindu Undivided Family"
              ? !Documents?.companyBalanceSheet || !Documents?.individualCertificateCA
              : data?.devDetail[0]?.addInfo?.showDevTypeFields === "Company" ||
                data?.devDetail[0]?.addInfo?.showDevTypeFields === "Society" ||
                data?.devDetail[0]?.addInfo?.showDevTypeFields === "Trust" ||
                data?.devDetail[0]?.addInfo?.showDevTypeFields === "Institution"
              ? !Documents?.companyBalanceSheet || !Documents?.paidUpCapital || !Documents?.reservesAndSurplus
              : data?.devDetail[0]?.addInfo?.showDevTypeFields === "Limited Liability Partnership" ||
                data?.devDetail[0]?.addInfo?.showDevTypeFields === "Firm" ||
                data?.devDetail[0]?.addInfo?.showDevTypeFields === "Partnership Firm"
              ? !Documents?.networthPartners || !Documents?.networthFirm || !Documents?.fullyConvertibleDebenture
              : false) ||
            ((permissionGrantedHRDU === "Y" && capacityDevelopColonyHdruAct?.length) ||
            (permissionGrantedHRDU === "N" && technicalCapacityOutsideHaryana === "N")
              ? false
              : technicalCapacityOutsideHaryana === "Y" &&
                technicalCapacityOutsideHaryanaDetails.authority &&
                technicalCapacityOutsideHaryanaDetails.project &&
                technicalCapacityOutsideHaryanaDetails.statusOfDevelopment &&
                technicalCapacityOutsideHaryanaDetails.location &&
                technicalCapacityOutsideHaryanaDetails.projectArea
              ? false
              : true)
          }
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
          <div className="happy">
            <div className="card">
              {(data?.devDetail[0]?.addInfo?.showDevTypeFields === "Individual" ||
                data?.devDetail[0]?.addInfo?.showDevTypeFields === "Proprietorship Firm" ||
                data?.devDetail[0]?.addInfo?.showDevTypeFields === "Hindu Undivided Family") && (
                <div className="card-body">
                  <div className="form-group row mb-12">
                    {/* <label className="col-sm-3 col-form-label">Individual</label> */}
                    <div className="col-sm-12">
                      <Paper sx={{ width: "100%", overflow: "hidden" }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                          <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                              <TableRow>
                                <StyledTableCell>Sr No.</StyledTableCell>
                                <StyledTableCell>Particulars of document</StyledTableCell>
                                <StyledTableCell>Annexure</StyledTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <StyledTableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                <StyledTableCell component="th" scope="row">
                                  1
                                </StyledTableCell>
                                <StyledTableCell>
                                  Net Worth in case of individual certified by CA/ Or Income tax return in case of an individual (for the last three
                                  years) <span className="text-danger font-weight-bold">*</span>
                                </StyledTableCell>
                                <StyledTableCell>
                                  <div className="row">
                                    {Documents?.individualCertificateCA ? (
                                      <a
                                        onClick={() => getDocShareholding(Documents?.individualCertificateCA)}
                                        title="View Document"
                                        className="btn btn-sm col-md-6"
                                      >
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    ) : (
                                      <p></p>
                                    )}
                                    <div className="btn btn-sm col-md-6">
                                      <label for="individualCertificateCA" title="Upload Document">
                                        {" "}
                                        <FileUpload color="primary" />
                                      </label>
                                      <input
                                        id="individualCertificateCA"
                                        type="file"
                                        style={{ display: "none" }}
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "individualCertificateCA", "devTypeDocument")}
                                      />
                                    </div>
                                  </div>
                                </StyledTableCell>
                              </StyledTableRow>
                              <StyledTableRow>
                                <StyledTableCell> 2 </StyledTableCell>
                                <StyledTableCell>
                                  Bank statement for the last 3 years <span className="text-danger font-weight-bold">*</span>
                                </StyledTableCell>

                                <StyledTableCell align="center" size="large">
                                  <div className="row">
                                    {Documents?.companyBalanceSheet ? (
                                      <a onClick={() => getDocShareholding(Documents?.companyBalanceSheet)} className="btn btn-sm col-md-6">
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    ) : (
                                      <p></p>
                                    )}
                                    <div className="btn btn-sm col-md-6">
                                      <label for="companyBalanceSheet">
                                        {" "}
                                        <FileUpload color="primary" />
                                      </label>
                                      <input
                                        id="companyBalanceSheet"
                                        type="file"
                                        accept="addplication/pdf"
                                        style={{ display: "none" }}
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "companyBalanceSheet", "devTypeDocument")}
                                      />
                                    </div>
                                  </div>
                                </StyledTableCell>
                              </StyledTableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                        {/* <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={capacityDevelopColonyHdruAct?.length}
                            rowsPerPage={rowsPerPageStack}
                            page={pageStack}
                            onPageChange={handleChangePageStack}
                            onRowsPerPageChange={handleChangeRowsPerPageStack}
                          /> */}
                      </Paper>
                    </div>
                  </div>
                </div>
              )}
              {(data?.devDetail[0]?.addInfo?.showDevTypeFields === "Company" ||
                data?.devDetail[0]?.addInfo?.showDevTypeFields === "Society" ||
                data?.devDetail[0]?.addInfo?.showDevTypeFields === "Trust" ||
                data?.devDetail[0]?.addInfo?.showDevTypeFields === "Institution") && (
                <div className="card-body">
                  <div className="form-group row">
                    {/* <label className="col-sm-3 col-form-label">Company</label> */}
                    <div className="col-sm-12">
                      <Paper sx={{ width: "100%", overflow: "hidden" }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                          <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                              <TableRow>
                                <StyledTableCell>Sr No.</StyledTableCell>
                                <StyledTableCell>Particulars of document</StyledTableCell>
                                <StyledTableCell>Annexure</StyledTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <StyledTableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                <StyledTableCell component="th" scope="row">
                                  1
                                </StyledTableCell>
                                <StyledTableCell>
                                  Balance sheet of last 3 years <span className="text-danger font-weight-bold">*</span>
                                </StyledTableCell>
                                <StyledTableCell>
                                  <div className="row">
                                    {Documents?.companyBalanceSheet ? (
                                      <a
                                        onClick={() => getDocShareholding(Documents?.companyBalanceSheet)}
                                        title="View Document"
                                        className="btn btn-sm col-md-6"
                                      >
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    ) : (
                                      <p></p>
                                    )}
                                    <div className="btn btn-sm col-md-6">
                                      <label for="uploadBalanceDoc" title="Upload Document">
                                        {" "}
                                        <FileUpload color="primary" />
                                      </label>
                                      <input
                                        id="uploadBalanceDoc"
                                        type="file"
                                        accept="application/pdf"
                                        style={{ display: "none" }}
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "companyBalanceSheet", "devTypeDocument")}
                                      />
                                    </div>
                                  </div>
                                </StyledTableCell>
                              </StyledTableRow>
                              <StyledTableRow>
                                <StyledTableCell> 2 </StyledTableCell>
                                <StyledTableCell>
                                  Ps-3(Representing Paid-UP capital) <span className="text-danger font-weight-bold">*</span>
                                </StyledTableCell>

                                <StyledTableCell align="center" size="large">
                                  <div className="row">
                                    {Documents?.paidUpCapital ? (
                                      <a
                                        onClick={() => getDocShareholding(Documents?.paidUpCapital)}
                                        title="View Document"
                                        className="btn btn-sm col-md-6"
                                      >
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    ) : (
                                      <p></p>
                                    )}
                                    <div className="btn btn-sm col-md-6">
                                      <label for="uploadPaidUpDoc" title="Upload Document">
                                        {" "}
                                        <FileUpload color="primary" />
                                      </label>
                                      <input
                                        id="uploadPaidUpDoc"
                                        type="file"
                                        accept="application/pdf"
                                        style={{ display: "none" }}
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "paidUpCapital", "devTypeDocument")}
                                      />
                                    </div>
                                  </div>
                                </StyledTableCell>
                              </StyledTableRow>

                              <StyledTableRow>
                                <StyledTableCell> 3 </StyledTableCell>
                                <StyledTableCell>
                                  Reserves and surpluses <span className="text-danger font-weight-bold">*</span>
                                </StyledTableCell>
                                <StyledTableCell align="center" size="large">
                                  <div className="row">
                                    {Documents?.reservesAndSurplus ? (
                                      <a
                                        onClick={() => getDocShareholding(Documents?.reservesAndSurplus)}
                                        title="View Document"
                                        className="btn btn-sm col-md-6"
                                      >
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    ) : (
                                      <p></p>
                                    )}
                                    <div className="btn btn-sm col-md-6">
                                      <label for="reservesAndSurplus" title="Upload Document">
                                        {" "}
                                        <FileUpload color="primary" />
                                      </label>
                                      <input
                                        id="reservesAndSurplus"
                                        type="file"
                                        accept="application/pdf"
                                        style={{ display: "none" }}
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "reservesAndSurplus", "devTypeDocument")}
                                      />
                                    </div>
                                  </div>
                                </StyledTableCell>
                              </StyledTableRow>
                              <StyledTableRow>
                                <StyledTableCell> 4 </StyledTableCell>
                                <StyledTableCell>Fully Convertible Debenture </StyledTableCell>
                                <StyledTableCell align="center" size="large">
                                  <div className="row">
                                    {Documents?.fullyConvertibleDebenture ? (
                                      <a
                                        onClick={() => getDocShareholding(Documents?.fullyConvertibleDebenture)}
                                        title="View Document"
                                        className="btn btn-sm col-md-6"
                                      >
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    ) : (
                                      <p></p>
                                    )}
                                    <div className="btn btn-sm col-md-6">
                                      <label for="fullyConvertibleDebentureId" title="Upload Document">
                                        {" "}
                                        <FileUpload color="primary" />
                                      </label>
                                      <input
                                        id="fullyConvertibleDebentureId"
                                        type="file"
                                        accept="application/pdf"
                                        style={{ display: "none" }}
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "fullyConvertibleDebenture", "devTypeDocument")}
                                      />
                                    </div>
                                  </div>
                                </StyledTableCell>
                              </StyledTableRow>
                              <StyledTableRow>
                                <StyledTableCell> 5 </StyledTableCell>
                                <StyledTableCell>Any other documents</StyledTableCell>
                                <StyledTableCell align="center" size="large">
                                  <div className="row">
                                    {Documents?.anyOtherDoc ? (
                                      <a
                                        onClick={() => getDocShareholding(Documents?.anyOtherDoc)}
                                        title="View Document"
                                        className="btn btn-sm col-md-6"
                                      >
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    ) : (
                                      <p></p>
                                    )}
                                    <div className="btn btn-sm col-md-6">
                                      <label for="anyOtherDoc" title="Upload Document">
                                        {" "}
                                        <FileUpload color="primary" />
                                      </label>
                                      <input
                                        id="anyOtherDoc"
                                        type="file"
                                        accept="application/pdf"
                                        style={{ display: "none" }}
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "anyOtherDoc", "devTypeDocument")}
                                      />
                                    </div>
                                  </div>
                                </StyledTableCell>
                              </StyledTableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                        {/* <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={capacityDevelopColonyHdruAct?.length}
                            rowsPerPage={rowsPerPageStack}
                            page={pageStack}
                            onPageChange={handleChangePageStack}
                            onRowsPerPageChange={handleChangeRowsPerPageStack}
                          /> */}
                      </Paper>
                    </div>
                  </div>
                </div>
              )}
              {(data?.devDetail[0]?.addInfo?.showDevTypeFields === "Limited Liability Partnership" ||
                data?.devDetail[0]?.addInfo?.showDevTypeFields === "Firm" ||
                data?.devDetail[0]?.addInfo?.showDevTypeFields === "Partnership Firm") && (
                <div className="card-body">
                  <div className="form-group row">
                    {/* <label className="col-sm-3 col-form-label">LLP</label> */}
                    <div className="col-sm-12">
                      {/* <input type="text" className="employee-card-input" id="llp" placeholder="Enter Email" /> */}
                      {/* <table className="table table-bordered" size="sm">
                        <thead>
                          <tr>
                            <th>S.No.</th>
                            <th>Particulars of document</th>
                            <th>Annexure </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td> 1 </td>
                            <td>
                              Networth of partners <span className="text-danger font-weight-bold">*</span>
                            </td>
                            <td align="center" size="large">
                              <div className="row">
                                {Documents?.networthPartners ? (
                                  <a
                                    onClick={() => getDocShareholding(Documents?.networthPartners)}
                                    title="View Document"
                                    className="btn btn-sm col-md-6"
                                  >
                                    <VisibilityIcon color="info" className="icon" />
                                  </a>
                                ) : (
                                  <p></p>
                                )}
                                <div className="btn btn-sm col-md-6">
                                  <label for="netWorthOfPartnersId" title="Upload Document">
                                    {" "}
                                    <FileUpload color="primary" />
                                  </label>
                                  <input
                                    id="netWorthOfPartnersId"
                                    type="file"
                                    accept="application/pdf"
                                    style={{ display: "none" }}
                                    onChange={(e) => getDocumentData(e?.target?.files[0], "networthPartners", "devTypeDocument")}
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td> 2 </td>
                            <td>
                              Net worth of firm <span className="text-danger font-weight-bold">*</span>
                            </td>
                            <td align="center" size="large">
                              <div className="row">
                                {Documents?.networthFirm ? (
                                  <a
                                    onClick={() => getDocShareholding(Documents?.networthFirm)}
                                    title="View Document"
                                    className="btn btn-sm col-md-6"
                                  >
                                    <VisibilityIcon color="info" className="icon" />
                                  </a>
                                ) : (
                                  <p></p>
                                )}
                                <div className="btn btn-sm col-md-6">
                                  <label for="netWorthOfFirmId" title="Upload Document">
                                    {" "}
                                    <FileUpload color="primary" />
                                  </label>
                                  <input
                                    id="netWorthOfFirmId"
                                    type="file"
                                    accept="application/pdf"
                                    style={{ display: "none" }}
                                    onChange={(e) => getDocumentData(e?.target?.files[0], "networthFirm", "devTypeDocument")}
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td> 3 </td>
                            <td>
                              Upload Fully Convertible Debenture <span className="text-danger font-weight-bold">*</span>
                            </td>
                            <td align="center" size="large">
                              <div className="row">
                                {Documents?.fullyConvertibleDebenture ? (
                                  <a
                                    onClick={() => getDocShareholding(Documents?.fullyConvertibleDebenture)}
                                    title="View Document"
                                    className="btn btn-sm col-md-6"
                                  >
                                    <VisibilityIcon color="info" className="icon" />
                                  </a>
                                ) : (
                                  <p></p>
                                )}
                                <div className="btn btn-sm col-md-6">
                                  <label for="fullyConvertibleDebentureId" title="Upload Document">
                                    {" "}
                                    <FileUpload color="primary" />
                                  </label>
                                  <input
                                    id="fullyConvertibleDebentureId"
                                    type="file"
                                    accept="application/pdf"
                                    style={{ display: "none" }}
                                    onChange={(e) => getDocumentData(e?.target?.files[0], "fullyConvertibleDebenture", "devTypeDocument")}
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table> */}
                      <Paper sx={{ width: "100%", overflow: "hidden" }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                          <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                              <TableRow>
                                <StyledTableCell>Sr No.</StyledTableCell>
                                <StyledTableCell>Particulars of document</StyledTableCell>
                                <StyledTableCell>Annexure</StyledTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <StyledTableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                <StyledTableCell component="th" scope="row">
                                  1
                                </StyledTableCell>
                                <StyledTableCell>
                                  Networth of partners <span className="text-danger font-weight-bold">*</span>
                                </StyledTableCell>
                                <StyledTableCell>
                                  <div className="row">
                                    {Documents?.networthPartners ? (
                                      <a
                                        onClick={() => getDocShareholding(Documents?.networthPartners)}
                                        title="View Document"
                                        className="btn btn-sm col-md-6"
                                      >
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    ) : (
                                      <p></p>
                                    )}
                                    <div className="btn btn-sm col-md-6">
                                      <label for="netWorthOfPartnersId" title="Upload Document">
                                        {" "}
                                        <FileUpload color="primary" />
                                      </label>
                                      <input
                                        id="netWorthOfPartnersId"
                                        type="file"
                                        accept="application/pdf"
                                        style={{ display: "none" }}
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "networthPartners", "devTypeDocument")}
                                      />
                                    </div>
                                  </div>
                                </StyledTableCell>
                              </StyledTableRow>
                              <StyledTableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                <StyledTableCell component="th" scope="row">
                                  2
                                </StyledTableCell>
                                <StyledTableCell>
                                  Net worth of firm <span className="text-danger font-weight-bold">*</span>
                                </StyledTableCell>
                                <StyledTableCell>
                                  <div className="row">
                                    {Documents?.networthFirm ? (
                                      <a
                                        onClick={() => getDocShareholding(Documents?.networthFirm)}
                                        title="View Document"
                                        className="btn btn-sm col-md-6"
                                      >
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    ) : (
                                      <p></p>
                                    )}
                                    <div className="btn btn-sm col-md-6">
                                      <label for="netWorthOfFirmId" title="Upload Document">
                                        {" "}
                                        <FileUpload color="primary" />
                                      </label>
                                      <input
                                        id="netWorthOfFirmId"
                                        type="file"
                                        accept="application/pdf"
                                        style={{ display: "none" }}
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "networthFirm", "devTypeDocument")}
                                      />
                                    </div>
                                  </div>
                                </StyledTableCell>
                              </StyledTableRow>
                              <StyledTableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                <StyledTableCell component="th" scope="row">
                                  3
                                </StyledTableCell>
                                <StyledTableCell>
                                  Upload Fully Convertible Debenture <span className="text-danger font-weight-bold">*</span>
                                </StyledTableCell>
                                <StyledTableCell>
                                  <div className="row">
                                    {Documents?.fullyConvertibleDebenture ? (
                                      <a
                                        onClick={() => getDocShareholding(Documents?.fullyConvertibleDebenture)}
                                        title="View Document"
                                        className="btn btn-sm col-md-6"
                                      >
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    ) : (
                                      <p></p>
                                    )}
                                    <div className="btn btn-sm col-md-6">
                                      <label for="fullyConvertibleDebentureId" title="Upload Document">
                                        {" "}
                                        <FileUpload color="primary" />
                                      </label>
                                      <input
                                        id="fullyConvertibleDebentureId"
                                        type="file"
                                        accept="application/pdf"
                                        style={{ display: "none" }}
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "fullyConvertibleDebenture", "devTypeDocument")}
                                      />
                                    </div>
                                  </div>
                                </StyledTableCell>
                              </StyledTableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                        {/* <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={capacityDevelopColonyHdruAct?.length}
                            rowsPerPage={rowsPerPageStack}
                            page={pageStack}
                            onPageChange={handleChangePageStack}
                            onRowsPerPageChange={handleChangeRowsPerPageStack}
                          /> */}
                      </Paper>
                    </div>
                  </div>
                </div>
              )}
              {/* <div>
                    <h5 className="card-h">
                    {" "}
                    Capacity of Developer to develop a colony:
                    </h5>
                </div> */}
              <div className="card-body">
                <p>1. I/ We hereby submit the following information/ enclose the relevant documents:-</p>
                {data?.devDetail[0]?.addInfo?.showDevTypeFields === "Individual" ||
                data?.devDetail[0]?.addInfo?.showDevTypeFields === "Limited Liability Partnership" ||
                data?.devDetail[0]?.addInfo?.showDevTypeFields === "Proprietorship Firm" ||
                data?.devDetail[0]?.addInfo?.showDevTypeFields === "Hindu Undivided Family" ? (
                  <p className="ml-1">
                    (i) Whether the Developer has earlier been granted permission to set up a colony under HDRU Act, 1975:{" "}
                    <span className="text-danger font-weight-bold">*</span>
                  </p>
                ) : (
                  <p className="d-none"></p>
                )}
                {data?.devDetail[0]?.addInfo?.showDevTypeFields === "Company" ||
                data?.devDetail[0]?.addInfo?.showDevTypeFields === "Partnership Firm" ? (
                  <p className="ml-1">
                    (i) Whether the Developer has earlier been granted permission to set up a colony under HDRU Act, 1975:{" "}
                    <span className="text-danger font-weight-bold">*</span>
                  </p>
                ) : (
                  <p className="d-none"></p>
                )}
                <div className="form-group ml-1">
                  <input
                    type="radio"
                    value="Y"
                    checked={permissionGrantedHRDU === "Y" ? true : false}
                    id="permissionGrantedHRDU"
                    className="mx-2 mt-1"
                    onChange={changeValueHrdu}
                    name="permissionGrantedHRDU"
                  />
                  <label for="permissionGrantedHRDU">Yes</label>

                  <input
                    type="radio"
                    value="N"
                    checked={permissionGrantedHRDU === "N" ? true : false}
                    id="permissionGrantedHRDUN"
                    className="mx-2 mt-1"
                    onChange={changeValueHrdu}
                    name="permissionGrantedHRDU"
                  />
                  <label for="permissionGrantedHRDUN">No</label>
                  {permissionGrantedHRDU === "Y" && (
                    <div className="card-body">
                      {/* <h5 className="card-h">Add/Remove Authorized Users</h5> */}
                      <div className="table-bd">
                        <Paper sx={{ width: "100%", overflow: "hidden" }}>
                          <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                              <TableHead>
                                <TableRow>
                                  <StyledTableCell>Sr No.</StyledTableCell>
                                  <StyledTableCell>Licence No.</StyledTableCell>
                                  <StyledTableCell>Date of grant of license</StyledTableCell>
                                  <StyledTableCell>Purpose of colony</StyledTableCell>
                                  <StyledTableCell>Validity of Licence</StyledTableCell>
                                  <StyledTableCell>Action</StyledTableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {capacityDevelopColonyHdruAct?.length > 0 ? (
                                  capacityDevelopColonyHdruAct.map((elementInArray, input) => {
                                    return (
                                      <StyledTableRow key={elementInArray.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                        <StyledTableCell component="th" scope="row">
                                          {input + 1}
                                        </StyledTableCell>
                                        <StyledTableCell>{elementInArray.licenceNumber}</StyledTableCell>
                                        <StyledTableCell>{elementInArray.dateOfGrantingLic}</StyledTableCell>
                                        <StyledTableCell>{elementInArray.purposeOfColony}</StyledTableCell>
                                        <StyledTableCell>{elementInArray.licValidity}</StyledTableCell>
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
                            count={capacityDevelopColonyHdruAct?.length}
                            rowsPerPage={rowsPerPageStack}
                            page={pageStack}
                            onPageChange={handleChangePageStack}
                            onRowsPerPageChange={handleChangeRowsPerPageStack}
                          />
                        </Paper>
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
                            onClick={handleShowCapacityDevelopColony}
                          >
                            Add More
                          </button>
                          <Modal show={showCapacityDevelopColony} onHide={handleCloseCapacityDevelopColony} animation={false}>
                            <Modal.Header closeButton>
                              <Modal.Title>Add Details</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <form className="text1">
                                <Row>
                                  <Col md={4} xxl lg="4">
                                    <label htmlFor="name" className="text">
                                      Licence No. <span className="text-danger font-weight-bold">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={hrduModalData.licNo}
                                      onChange={(e) => setHrduModalData({ ...hrduModalData, licNo: e.target.value.toUpperCase() })}
                                      placeholder=""
                                      class="form-control"
                                      required="required"
                                      maxLength={11}
                                    />
                                    {hrduModalData.licNo &&
                                      hrduModalData.licNo.length > 0 &&
                                      !hrduModalData.licNo.match(Digit.Utils.getPattern("LicNumber")) && (
                                        <CardLabelError
                                          style={{ width: "100%", marginTop: "5px", fontSize: "16px", marginBottom: "12px", color: "red" }}
                                        >
                                          {t("Invalid Licence No.")}
                                        </CardLabelError>
                                      )}
                                  </Col>
                                  <Col md={4} xxl lg="4">
                                    <label htmlFor="name" className="text">
                                      Date of grant of a license <span className="text-danger font-weight-bold">*</span>
                                    </label>
                                    <input
                                      type="date"
                                      value={hrduModalData.dateOfGrantingLic}
                                      onChange={(e) => setHrduModalData({ ...hrduModalData, dateOfGrantingLic: e.target.value })}
                                      placeholder=""
                                      class="form-control"
                                      isMandatory={false}
                                      {...(validation = {
                                        isRequired: true,
                                        title: "Please enter Name",
                                      })}
                                      max={convertEpochToDate(new Date().setFullYear(new Date().getFullYear()))}
                                    />
                                  </Col>
                                  <Col md={3} xxl lg="4">
                                    <label htmlFor="name" className="text">
                                      {`${t("Purpose of colony")}`}
                                      <span class="text-danger font-weight-bold mx-2">*</span>
                                    </label>

                                    <Select
                                      value={purposeOfColony || ""}
                                      onChange={(e) => setShowPurposeType(e.target.value)}
                                      className="w-100 form-control"
                                      variant="standard"
                                    >
                                      {purposeOptions?.data?.map((item, index) => (
                                        <MenuItem value={item.value}>{item?.label}</MenuItem>
                                      ))}
                                    </Select>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col md={4} xxl lg="4">
                                    <label htmlFor="name" className="text">
                                      Validity of licence <span className="text-danger font-weight-bold">*</span>
                                    </label>
                                    <input
                                      type="date"
                                      name="validatingLicence"
                                      value={hrduModalData.licValidity}
                                      disabled={!hrduModalData.dateOfGrantingLic}
                                      onChange={(e) => setHrduModalData({ ...hrduModalData, licValidity: e.target.value })}
                                      placeholder=""
                                      class="form-control"
                                      min={hrduModalData.dateOfGrantingLic}
                                    />
                                  </Col>
                                </Row>

                                {/* <p>(iii) Whether any technical expert(s) engaged</p> */}

                                {/* <div className="form-group">
                                                            <input
                                                                type="radio"
                                                                value="Y"
                                                                id="technicalExpert"
                                                                className="mx-2 mt-1"
                                                                onChange={(e) => setHrduModalData({ ...hrduModalData, technicalExpertEngaged: e.target.value })}
                                                                name="technicalExpert"
                                                            />
                                                            <label for="Yes">Yes</label>

                                                            <input
                                                                type="radio"
                                                                value="N"
                                                                id="technicalExpertN"
                                                                className="mx-2 mt-1"
                                                                onChange={(e) => setHrduModalData({ ...hrduModalData, technicalExpertEngaged: e.target.value })}
                                                                name="technicalExpert"
                                                            />
                                                            <label for="No">No</label>
                                                        </div> */}

                                {/* {
                                                            hrduModalData.technicalExpertEngaged === "Y" &&
                                                            <Row>
                                                                <Col md={4} xxl lg="4">
                                                                    <label htmlFor="name" className="text"> Copy of degree of engineer <span className="text-danger font-weight-bold">*</span></label>
                                                                    <input
                                                                        type="file"
                                                                        accept="application/pdf"
                                                                        name="validatingLicence"
                                                                        onChange={(e) => getDocumentData(e?.target?.files[0], "engineerDegree","hrduModalActFile")}
                                                                        placeholder=""
                                                                        class="employee-card-input"
                                                                    />

                                                                </Col>
                                                                <Col md={4} xxl lg="4">
                                                                    <label htmlFor="name" className="text"> Copy of degree of architect <span className="text-danger font-weight-bold">*</span></label>
                                                                    <input
                                                                        type="file"
                                                                        accept="application/pdf"
                                                                        name="validatingLicence"
                                                                        onChange={(e) => getDocumentData(e?.target?.files[0], "architectDegree","hrduModalActFile")}
                                                                        placeholder=""
                                                                        class="employee-card-input"
                                                                    />

                                                                </Col>
                                                                <Col md={4} xxl lg="4">
                                                                    <label htmlFor="name" className="text"> Copy of degree of Town planer <span className="text-danger font-weight-bold">*</span></label>
                                                                    <input
                                                                        type="file"
                                                                        accept="application/pdf"
                                                                        name="validatingLicence"
                                                                        onChange={(e) => getDocumentData(e?.target?.files[0], "townPlannerDegree","hrduModalActFile")}
                                                                        placeholder=""
                                                                        class="employee-card-input"
                                                                    />

                                                                </Col>
                                                            </Row>
                                                        } */}
                              </form>
                            </Modal.Body>
                            <Modal.Footer>
                              <Button variant="secondary" onClick={handleCloseCapacityDevelopColony}>
                                Close
                              </Button>
                              <Button
                                disabled={
                                  !(
                                    hrduModalData.licNo &&
                                    hrduModalData.licValidity &&
                                    hrduModalData.dateOfGrantingLic &&
                                    purposeOfColony &&
                                    hrduModalData.licNo.match(Digit.Utils.getPattern("LicNumber"))
                                  )
                                }
                                variant="primary"
                                onClick={handleArrayValues}
                              >
                                Submit
                              </Button>
                            </Modal.Footer>
                          </Modal>
                        </div>

                        <br></br>
                        <br></br>
                      </div>
                    </div>
                  )}
                </div>

                {permissionGrantedHRDU === "N" && (
                  <div className="ml-1">
                    {data?.devDetail[0]?.addInfo?.showDevTypeFields === "Individual" ||
                    data?.devDetail[0]?.addInfo?.showDevTypeFields === "Proprietorship Firm" ? (
                      <p>
                        (ii) Have you developed projects outside Haryana:- <span className="text-danger font-weight-bold">*</span>
                      </p>
                    ) : (
                      <p>
                        (ii) Have your company/firm developed projects outside Haryana:- <span className="text-danger font-weight-bold">*</span>
                      </p>
                    )}

                    <div className="form-group">
                      <input
                        type="radio"
                        value="Y"
                        checked={technicalCapacityOutsideHaryana === "Y" ? true : false}
                        id="technicalCapacityOutsideHaryana"
                        className="mx-2 mt-1"
                        onChange={(e) => setTechnicalCapacityOutsideHaryana(e.target.value)}
                        name="technicalCapacityOutsideHaryana"
                      />
                      <label for="technicalCapacityOutsideHaryana">Yes</label>

                      <input
                        type="radio"
                        value="N"
                        checked={technicalCapacityOutsideHaryana === "N" ? true : false}
                        id="technicalCapacityOutsideHaryanaN"
                        className="mx-2 mt-1"
                        onChange={(e) => setTechnicalCapacityOutsideHaryana(e.target.value)}
                        name="technicalCapacityOutsideHaryana"
                      />
                      <label for="technicalCapacityOutsideHaryanaN">No</label>
                      {technicalCapacityOutsideHaryana === "Y" && (
                        <Row>
                          <Col md={3} xxl lg="3" className="mb-2">
                            <label htmlFor="project" className="">
                              {" "}
                              Name of Project <span className="text-danger font-weight-bold">*</span>
                            </label>
                            <input
                              type="text"
                              name="project"
                              value={technicalCapacityOutsideHaryanaDetails.project}
                              onChange={(e) =>
                                setTechnicalCapacityOutsideHaryanaDetails({ ...technicalCapacityOutsideHaryanaDetails, project: e.target.value })
                              }
                              placeholder=""
                              class="form-control"
                            />
                            {technicalCapacityOutsideHaryanaDetails.project &&
                              technicalCapacityOutsideHaryanaDetails.project.length > 0 &&
                              !technicalCapacityOutsideHaryanaDetails.project.match(Digit.Utils.getPattern("Name")) && (
                                <CardLabelError style={{ width: "100%", marginTop: "-15px", fontSize: "16px", marginBottom: "12px", color: "red" }}>
                                  {t("Please enter valid details")}
                                </CardLabelError>
                              )}
                          </Col>

                          <Col md={3} xxl lg="3" className="mb-2">
                            <label htmlFor="authority" className="">
                              {" "}
                              Name of Authority <span className="text-danger font-weight-bold">*</span>
                            </label>
                            <input
                              type="text"
                              name="authority"
                              value={technicalCapacityOutsideHaryanaDetails.authority}
                              onChange={(e) =>
                                setTechnicalCapacityOutsideHaryanaDetails({ ...technicalCapacityOutsideHaryanaDetails, authority: e.target.value })
                              }
                              placeholder=""
                              class="form-control"
                            />
                            {technicalCapacityOutsideHaryanaDetails.authority &&
                              technicalCapacityOutsideHaryanaDetails.authority.length > 0 &&
                              !technicalCapacityOutsideHaryanaDetails.authority.match(Digit.Utils.getPattern("Name")) && (
                                <CardLabelError style={{ width: "100%", marginTop: "-15px", fontSize: "16px", marginBottom: "12px", color: "red" }}>
                                  {t("Please enter valid details")}
                                </CardLabelError>
                              )}
                          </Col>

                          <Col md={3} xxl lg="3" className="mb-2">
                            <label htmlFor="statusOfDevelopment" className="">
                              Status of Development <span className="text-danger font-weight-bold">*</span>
                            </label>
                            <input
                              type="text"
                              name="statusOfDevelopment"
                              value={technicalCapacityOutsideHaryanaDetails.statusOfDevelopment}
                              onChange={(e) =>
                                setTechnicalCapacityOutsideHaryanaDetails({
                                  ...technicalCapacityOutsideHaryanaDetails,
                                  statusOfDevelopment: e.target.value,
                                })
                              }
                              placeholder=""
                              class="form-control"
                            />
                            {technicalCapacityOutsideHaryanaDetails.statusOfDevelopment &&
                              technicalCapacityOutsideHaryanaDetails.statusOfDevelopment.length > 0 &&
                              !technicalCapacityOutsideHaryanaDetails.statusOfDevelopment.match(Digit.Utils.getPattern("Name")) && (
                                <CardLabelError style={{ width: "100%", marginTop: "-15px", fontSize: "16px", marginBottom: "12px", color: "red" }}>
                                  {t("Please enter valid details")}
                                </CardLabelError>
                              )}
                          </Col>
                          <Col md={3} xxl lg="3" className="mb-2">
                            <label htmlFor="permissionLetterDoc" className="">
                              Permission letter <span className="text-danger font-weight-bold">*</span>
                            </label>
                            <div className="d-flex">
                              <input
                                id="permissionLetterYId"
                                type="file"
                                className="form-control"
                                name="permissionLetterDoc"
                                // accept="addplication/pdf"
                                onChange={(e) => getDocumentData(e?.target?.files[0], "permissionLetterDoc", "outsideHrDocY")}
                              />
                              <span>
                                {Documents?.permissionLetterDoc ? (
                                  <a onClick={() => getDocShareholding(Documents?.permissionLetterDoc)} className="btn btn-sm col-md-6">
                                    <VisibilityIcon color="info" className="icon" />
                                  </a>
                                ) : (
                                  <p></p>
                                )}
                              </span>
                            </div>
                          </Col>
                          <Col md={3} xxl lg="3" className="mb-2">
                            <label htmlFor="projectArea" className="">
                              Area of the project in acres <span className="text-danger font-weight-bold">*</span>
                            </label>
                            <input
                              type="number"
                              name="projectArea"
                              value={technicalCapacityOutsideHaryanaDetails.projectArea}
                              onChange={(e) =>
                                setTechnicalCapacityOutsideHaryanaDetails({ ...technicalCapacityOutsideHaryanaDetails, projectArea: e.target.value })
                              }
                              placeholder=""
                              class="form-control"
                            />
                          </Col>
                          <Col md={3} xxl lg="3" className="mb-2">
                            <label htmlFor="location" className="">
                              Location <span className="text-danger font-weight-bold">*</span>
                            </label>
                            <input
                              type="text"
                              name="location"
                              value={technicalCapacityOutsideHaryanaDetails.location}
                              onChange={(e) =>
                                setTechnicalCapacityOutsideHaryanaDetails({ ...technicalCapacityOutsideHaryanaDetails, location: e.target.value })
                              }
                              placeholder=""
                              class="form-control"
                            />
                          </Col>
                          <Col md={3} xxl lg="3" className="mb-2">
                            <label htmlFor="hrDetailAnyDoc" className="">
                              Any other document/ Photo
                            </label>
                            <div className="d-flex">
                              <input
                                id="hrDetailAnyDocId"
                                type="file"
                                className="form-control"
                                name="hrDetailAnyDoc"
                                // accept="addplication/pdf"
                                onChange={(e) => getDocumentData(e?.target?.files[0], "hrDetailAnyDoc", "outsideHrDocY")}
                              />
                              <span>
                                {Documents?.hrDetailAnyDoc ? (
                                  <a
                                    onClick={() => getDocShareholding(Documents?.hrDetailAnyDoc)}
                                    title="View Document"
                                    className="btn btn-sm col-md-6"
                                  >
                                    <VisibilityIcon color="info" className="icon" />
                                  </a>
                                ) : (
                                  <p></p>
                                )}
                              </span>
                            </div>
                          </Col>
                        </Row>
                      )}
                    </div>
                  </div>
                )}

                <div className="hl"></div>

                <div className="hl"></div>
                {(data?.devDetail[0]?.addInfo?.showDevTypeFields === "Individual NOT USES" ||
                  data?.devDetail[0]?.addInfo?.showDevTypeFields === "Proprietorship Firm NOT USES") && (
                  <div>
                    <p>
                      (iii). In case of technical capacity sought from another company/firm who has already obtained license(s) under act of 1975
                      Haryana:
                      <span className="text-danger font-weight-bold">*</span>
                    </p>

                    <div className="form-group">
                      <input
                        type="radio"
                        value="Y"
                        checked={alreadtObtainedLic === "Y" ? true : false}
                        id="alreadtObtainedLic"
                        className="mx-2 mt-1"
                        onChange={changeAlreadyObtainedLic}
                        name="alreadtObtainedLic"
                      />
                      <label for="Yes">Yes</label>

                      <input
                        type="radio"
                        value="N"
                        checked={alreadtObtainedLic === "N" ? true : false}
                        id="alreadtObtainedLicN"
                        className="mx-2 mt-1"
                        onChange={changeAlreadyObtainedLic}
                        name="alreadtObtainedLic"
                        onClick={handleshow6}
                      />
                      <label for="No">No</label>
                      {alreadtObtainedLic === "Y" && (
                        <div>
                          <div className="row ">
                            <div className="form-group row">
                              <div className="col-sm-12">
                                <Col xs="12" md="12" sm="12">
                                  <div>
                                    <Table className="table table-bordered" size="sm">
                                      <thead>
                                        <tr>
                                          <th>S.No.</th>
                                          <th>Agreement </th>
                                          <th>Upload Document </th>
                                          <th>Annexure </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td> 1 </td>

                                          <td>
                                            Agreement between the proposed developer and existing colonizer{" "}
                                            <span className="text-danger font-weight-bold">*</span>
                                          </td>
                                          <td align="center" size="large" style={{ textAlign: "center" }}>
                                            <label for="agreementDocYId" title="Upload Document">
                                              {" "}
                                              <FileUpload color="primary" />
                                            </label>
                                            <input
                                              id="agreementDocYId"
                                              type="file"
                                              name="agreementDocY"
                                              // accept="addplication/pdf"
                                              style={{ display: "none" }}
                                              onChange={(e) => getDocumentData(e?.target?.files[0], "agreementDocY", "alreadyObtaileLicFile")}
                                            />
                                            {/* <input
                                                                                type="file"
                                                                                name="agreementDocY"
                                                                                onChange={(e) => getDocumentData(e?.target?.files[0], "agreementDocY")}
                                                                                class="employee-card-input"
                                                                            /> */}
                                          </td>
                                          <td>
                                            {Documents?.agreementDocY ? (
                                              <a onClick={() => getDocShareholding(Documents?.agreementDocY)}>
                                                <VisibilityIcon color="info" className="icon" />
                                              </a>
                                            ) : (
                                              <p></p>
                                            )}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td> 2 </td>

                                          <td>
                                            Board resolution of authorised signatory of the existing colonizer{" "}
                                            <span className="text-danger font-weight-bold">*</span>
                                          </td>
                                          <td align="center" size="large" style={{ textAlign: "center" }}>
                                            <label for="boardDocXId">
                                              {" "}
                                              <FileUpload color="primary" />
                                            </label>
                                            <input
                                              id="boardDocXId"
                                              type="file"
                                              name="boardDocX"
                                              // accept="addplication/pdf"
                                              style={{ display: "none" }}
                                              onChange={(e) => getDocumentData(e?.target?.files[0], "boardDocX", "alreadyObtaileLicFile")}
                                            />
                                            {/* <input
                                                                                type="file"
                                                                                name="boardDocX"
                                                                                onChange={(e) => getDocumentData(e?.target?.files[0], "boardDocX")}
                                                                                class="employee-card-input"
                                                                            /> */}
                                          </td>
                                          <td>
                                            {Documents?.boardDocX ? (
                                              <a onClick={() => getDocShareholding(Documents?.boardDocX)}>
                                                <VisibilityIcon color="info" className="icon" />
                                              </a>
                                            ) : (
                                              <p></p>
                                            )}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td> 3 </td>
                                          <td>
                                            {" "}
                                            Registered and Irrevocable Agreement <span className="text-danger font-weight-bold">*</span>
                                          </td>
                                          <td align="center" size="large" style={{ textAlign: "center" }}>
                                            <label for="registeredDocId">
                                              {" "}
                                              <FileUpload color="primary" />
                                            </label>
                                            <input
                                              id="registeredDocId"
                                              type="file"
                                              name="registeredDoc"
                                              // accept="addplication/pdf"
                                              style={{ display: "none" }}
                                              onChange={(e) => getDocumentData(e?.target?.files[0], "registeredDoc", "alreadyObtaileLicFile")}
                                            />
                                            {/* <input
                                                                                type="file"
                                                                                name="registeredDoc"
                                                                                onChange={(e) => getDocumentData(e?.target?.files[0], "registeredDoc")}
                                                                                class="employee-card-input"
                                                                            /> */}
                                          </td>
                                          <td>
                                            {Documents?.registeredDoc ? (
                                              <a onClick={() => getDocShareholding(Documents?.registeredDoc)}>
                                                <VisibilityIcon color="info" className="icon" />
                                              </a>
                                            ) : (
                                              <p></p>
                                            )}
                                          </td>
                                        </tr>

                                        <tr>
                                          <td> 4 </td>
                                          <td>
                                            Board resolutions of authorized signatory of firm/company provided technical assistance{" "}
                                            <span className="text-danger font-weight-bold">*</span>
                                          </td>
                                          <td align="center" size="large" style={{ textAlign: "center" }}>
                                            <label for="boardDocYId">
                                              {" "}
                                              <FileUpload color="primary" />
                                            </label>
                                            <input
                                              id="boardDocYId"
                                              type="file"
                                              name="boardDocY"
                                              // accept="addplication/pdf"
                                              style={{ display: "none" }}
                                              onChange={(e) => getDocumentData(e?.target?.files[0], "boardDocY", "alreadyObtaileLicFile")}
                                            />
                                            {/* <input
                                                                                type="file"
                                                                                onChange={(e) => getDocumentData(e?.target?.files[0], "boardDocY")}
                                                                                class="employee-card-input"
                                                                            /> */}
                                          </td>
                                          <td>
                                            {Documents?.boardDocY ? (
                                              <a onClick={() => getDocShareholding(Documents?.boardDocY)}>
                                                <VisibilityIcon color="info" className="icon" />
                                              </a>
                                            ) : (
                                              <p></p>
                                            )}
                                          </td>
                                        </tr>
                                      </tbody>{" "}
                                    </Table>
                                  </div>
                                </Col>
                              </div>
                            </div>
                          </div>

                          <div className="row mx-1">
                            <div className="col col-4">
                              <div className="form-group">
                                <label htmlFor="licNo">
                                  License No. <span className="text-danger font-weight-bold">*</span>
                                </label>
                                <input
                                  type="text"
                                  name="licNo"
                                  value={technicalCapacitySoughtFromAnyColonizer.licNo}
                                  onChange={(e) =>
                                    setTechnicalCapacitySoughtFromAnyColonizer({
                                      ...technicalCapacitySoughtFromAnyColonizer,
                                      licNo: e.target.value.toUpperCase(),
                                    })
                                  }
                                  className="form-control"
                                  maxLength={11}
                                />
                                {technicalCapacitySoughtFromAnyColonizer.licNo &&
                                  technicalCapacitySoughtFromAnyColonizer.licNo.length > 0 &&
                                  !technicalCapacitySoughtFromAnyColonizer.licNo.match(Digit.Utils.getPattern("LicNumber")) && (
                                    <CardLabelError
                                      style={{ width: "100%", marginTop: "-15px", fontSize: "16px", marginBottom: "12px", color: "red" }}
                                    >
                                      {t("Please enter valid Licence Number")}
                                    </CardLabelError>
                                  )}
                              </div>
                            </div>

                            <div className="col col-4">
                              <div className="form-group">
                                <label htmlFor="licDate">
                                  Date <span className="text-danger font-weight-bold">*</span>
                                </label>
                                <input
                                  type="date"
                                  name="licDate"
                                  value={technicalCapacitySoughtFromAnyColonizer.dateOfGrantingLic}
                                  onChange={(e) =>
                                    setTechnicalCapacitySoughtFromAnyColonizer({
                                      ...technicalCapacitySoughtFromAnyColonizer,
                                      dateOfGrantingLic: e.target.value,
                                    })
                                  }
                                  className="form-control"
                                  maxLength={10}
                                  max={convertEpochToDate(new Date().setFullYear(new Date().getFullYear()))}
                                />
                              </div>
                            </div>

                            <div className="col col-4">
                              <div className="form-group">
                                <label htmlFor="licValidity">
                                  Validity <span className="text-danger font-weight-bold">*</span>
                                </label>
                                <input
                                  type="date"
                                  name="licValidity"
                                  disabled={!technicalCapacitySoughtFromAnyColonizer.dateOfGrantingLic}
                                  value={technicalCapacitySoughtFromAnyColonizer.licValidity}
                                  onChange={(e) =>
                                    setTechnicalCapacitySoughtFromAnyColonizer({
                                      ...technicalCapacitySoughtFromAnyColonizer,
                                      licValidity: e.target.value,
                                    })
                                  }
                                  className="form-control"
                                  min={technicalCapacitySoughtFromAnyColonizer.dateOfGrantingLic}
                                />
                              </div>
                            </div>

                            <div className="col col-4">
                              <div className="form-group">
                                <label htmlFor="licValidity">
                                  Purpose <span className="text-danger font-weight-bold">*</span>
                                </label>
                                <Select
                                  value={technicalCapacitySoughtFromAnyColonizer.purpose}
                                  onChange={(e) =>
                                    setTechnicalCapacitySoughtFromAnyColonizer({
                                      ...technicalCapacitySoughtFromAnyColonizer,
                                      purpose: e.target.value,
                                    })
                                  }
                                  className="w-100 form-control"
                                  variant="standard"
                                  placeholder="Select purpose"
                                >
                                  {purposeOptions?.data?.map((item, index) => (
                                    <MenuItem value={item.value}>{item?.label}</MenuItem>
                                  ))}
                                </Select>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className="mb-3"></div>
                {data?.devDetail[0]?.addInfo?.showDevTypeFields === "Individual NOT USES" ||
                data?.devDetail[0]?.addInfo?.showDevTypeFields === "Proprietorship Firm NOT USES" ? (
                  <p>
                    (iii) Whether any technical expert(s) engaged <span className="text-danger font-weight-bold">*</span>
                  </p>
                ) : (
                  <p className="d-none">
                    (iv) Whether any technical expert(s) engaged <span className="text-danger font-weight-bold">*</span>
                  </p>
                )}

                <div className="form-group d-none">
                  <input
                    type="radio"
                    value="Y"
                    checked={technicalExpert === "Y" ? true : false}
                    id="technicalExpert"
                    className="mx-2 mt-1"
                    onChange={changeTechnicalExpert}
                    name="technicalExpert"
                  />
                  <label for="Yes">Yes</label>

                  <input
                    type="radio"
                    value="N"
                    checked={technicalExpert === "N" ? true : false}
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
                                  <th>
                                    Professional <span className="text-danger font-weight-bold">*</span>{" "}
                                  </th>
                                  <th>
                                    Qualification <span className="text-danger font-weight-bold">*</span>
                                  </th>
                                  <th>
                                    Signature <span className="text-danger font-weight-bold">*</span>
                                  </th>
                                  <th>
                                    Annexure <span className="text-danger font-weight-bold">*</span>
                                  </th>
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
                                    {engineerName && engineerName.length > 0 && !engineerName.match(Digit.Utils.getPattern("Name")) && (
                                      <CardLabelError
                                        style={{ width: "100%", marginTop: "-15px", fontSize: "16px", marginBottom: "12px", color: "red" }}
                                      >
                                        {t("Please enter valid details")}
                                      </CardLabelError>
                                    )}
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      onChange={(e) => setEngineerQualification(e.target.value)}
                                      value={engineerQualification}
                                      placeholder=""
                                      class="employee-card-input"
                                    />
                                    {engineerQualification &&
                                      engineerQualification.length > 0 &&
                                      !engineerQualification.match(Digit.Utils.getPattern("Name")) && (
                                        <CardLabelError
                                          style={{ width: "100%", marginTop: "-15px", fontSize: "16px", marginBottom: "12px", color: "red" }}
                                        >
                                          {t("Please enter valid details")}
                                        </CardLabelError>
                                      )}
                                  </td>

                                  <td style={{ textAlign: "center" }}>
                                    <label for="engineerSignId">
                                      {" "}
                                      <FileUpload color="primary" />
                                    </label>
                                    <input
                                      id="engineerSignId"
                                      type="file"
                                      name="engineerSign"
                                      style={{ display: "none" }}
                                      onChange={(e) => getDocumentData(e?.target?.files[0], "engineerSign", "techicalExpertFile")}
                                    />
                                  </td>
                                  <td align="center" size="large">
                                    {Documents?.engineerSign ? (
                                      <a onClick={() => getDocShareholding(Documents?.engineerSign)} className="btn btn-sm col-md-6">
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    ) : (
                                      <p></p>
                                    )}
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
                                    {architectName && architectName.length > 0 && !architectName.match(Digit.Utils.getPattern("Name")) && (
                                      <CardLabelError
                                        style={{ width: "100%", marginTop: "-15px", fontSize: "16px", marginBottom: "12px", color: "red" }}
                                      >
                                        {t("Please enter valid details")}
                                      </CardLabelError>
                                    )}
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      onChange={(e) => setArchitectQualification(e.target.value)}
                                      value={architectQualification}
                                      placeholder=""
                                      class="employee-card-input"
                                    />
                                    {architectQualification &&
                                      architectQualification.length > 0 &&
                                      !architectQualification.match(Digit.Utils.getPattern("Name")) && (
                                        <CardLabelError
                                          style={{ width: "100%", marginTop: "-15px", fontSize: "16px", marginBottom: "12px", color: "red" }}
                                        >
                                          {t("Please enter valid details")}
                                        </CardLabelError>
                                      )}
                                  </td>

                                  <td style={{ textAlign: "center" }}>
                                    <label for="architectSignId">
                                      {" "}
                                      <FileUpload color="primary" />
                                    </label>
                                    <input
                                      id="architectSignId"
                                      type="file"
                                      name="architectSign"
                                      style={{ display: "none" }}
                                      onChange={(e) => getDocumentData(e?.target?.files[0], "architectSign", "techicalExpertFile")}
                                    />
                                    {/* <input
                                                                    type="file"
                                                                    onChange={(e) => getDocumentData(e?.target?.files[0], "architectSign")}
                                                                    placeholder=""
                                                                    class="employee-card-input"
                                                                /> */}
                                  </td>
                                  <td align="center" size="large">
                                    {Documents?.architectSign ? (
                                      <a onClick={() => getDocShareholding(Documents?.architectSign)} className="btn btn-sm col-md-6">
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    ) : (
                                      <p></p>
                                    )}
                                  </td>
                                </tr>

                                <tr>
                                  <td>3</td>
                                  <td>
                                    <input
                                      type="text"
                                      onChange={(e) => setTownPlannerName(e.target.value)}
                                      value={townPlannerName}
                                      placeholder="Name of Town Planner"
                                      class="employee-card-input"
                                    />
                                    {townPlannerName && townPlannerName.length > 0 && !townPlannerName.match(Digit.Utils.getPattern("Name")) && (
                                      <CardLabelError
                                        style={{ width: "100%", marginTop: "-15px", fontSize: "16px", marginBottom: "12px", color: "red" }}
                                      >
                                        {t("Please enter valid details")}
                                      </CardLabelError>
                                    )}
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      onChange={(e) => setTownPlannerQualification(e.target.value)}
                                      value={townPlannerQualification}
                                      placeholder=""
                                      class="employee-card-input"
                                    />
                                    {townPlannerQualification &&
                                      townPlannerQualification.length > 0 &&
                                      !townPlannerQualification.match(Digit.Utils.getPattern("Name")) && (
                                        <CardLabelError
                                          style={{ width: "100%", marginTop: "-15px", fontSize: "16px", marginBottom: "12px", color: "red" }}
                                        >
                                          {t("Please enter valid details")}
                                        </CardLabelError>
                                      )}
                                  </td>

                                  <td style={{ textAlign: "center" }}>
                                    <label for="townPlannerSignId">
                                      {" "}
                                      <FileUpload color="primary" />
                                    </label>
                                    <input
                                      id="townPlannerSignId"
                                      type="file"
                                      name="townPlannerSign"
                                      style={{ display: "none" }}
                                      onChange={(e) => getDocumentData(e?.target?.files[0], "townPlannerSign", "techicalExpertFile")}
                                    />
                                    {/* <input
                                                                    type="file"
                                                                    onChange={(e) => getDocumentData(e?.target?.files[0], "townPlannerSign")}
                                                                    placeholder=""
                                                                    class="employee-card-input"
                                                                /> */}
                                  </td>
                                  <td align="center" size="large">
                                    {Documents?.townPlannerSign ? (
                                      <a onClick={() => getDocShareholding(Documents?.townPlannerSign)} className="btn btn-sm col-md-6">
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    ) : (
                                      <p></p>
                                    )}
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
              </div>
            </div>
          </div>
        </FormStep>
      </div>
      {/* <div style={{ disabled: "true", height: "30px", width: "100%", fontSize: "14px" }}></div> */}
      {/* {showToast && <Toast error={showToast?.key === "error" ? true : false} label={error} isDleteBtn={true} onClose={() => { setShowToast(null); setError(null); }} />} */}
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
    </React.Fragment>
  );
};

export default DeveloperCapacity;
