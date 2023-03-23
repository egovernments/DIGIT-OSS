import {
  FormStep,
  TextInput,
  MobileNumber,
  CardLabel,
  CardLabelError,
  Dropdown,
  Toast,
  RemoveIcon,
  DeleteIcon,
  MuiTables,
} from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
// import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useHistory, useLocation, useParams } from "react-router-dom";
// import "../Developer/AddInfo.css";
// import DashboardScreen from "../../src/Screens/DashboardScreen/DashboardScreen";
import { useForm } from "react-hook-form";
import Timeline from "../components/Timeline";
import Popup from "reactjs-popup";
// import {
//   Modal,
//   ModalHeader,
//   ModalBody,
//   Row,
//   Col,
//   ModalFooter,
// } from "reactstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Modal, ModalHeader, ModalFooter, ModalBody } from "react-bootstrap";
// import { Button } from "react-bootstrap";
import { convertEpochToDate } from "../utils/index";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileUpload from "@mui/icons-material/FileUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import axios from "axios";
import { getDocShareholding } from "../../../tl/src/pages/employee/ScrutinyBasic/ScrutinyDevelopment/docview.helper";
const TYPE_REGISTER = { type: "register" };
const TYPE_LOGIN = { type: "login" };
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
// import Button from "@mui/material/Button";
// const tenantId = Digit.ULBService.getCurrentTenantId();

//for Redux use only
// import { setAurthorizedUserData } from "../Redux/Slicer/Slicer";
// import { useDispatch } from "react-redux";
import CusToaster from "../components/Toaster";

const AddAuthorizeduser = ({ t, config, onSelect, formData, isUserRegistered = true }) => {
  const { pathname: url } = useLocation();
  const userInfo = Digit.UserService.getUser();
  const devRegId = localStorage.getItem("devRegId");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const [success, setError] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [showToastError, setShowToastError] = useState({ label: "", error: false, success: false });
  const { setValue, getValues, watch } = useForm();
  const [Documents, setDocumentsData] = useState({});
  const [data, setData] = useState();
  const DevelopersAllData = getValues();
  const [userDelete, setUserDelete] = useState([]);
  const [loader, setLoading] = useState(false);
  const [aurthorizedUserInfoArray, setAurthorizedUserInfoArray] = useState([]);
  const [panIsValid, setPanIsValid] = useState(false);
  const [toastError, setToastError] = useState("");

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
      setData(developerDataGet);
      // console.log("ADDAUTHUSER", getDevDetails?.data?.devDetail[0]?.aurthorizedUserInfoArray);
      // setAurthorizedUserInfoArray(getDevDetails?.data?.devDetail[0]?.aurthorizedUserInfoArray || [
      //   {
      //     userName: getDevDetails?.data?.devDetail[0]?.licenceDetails?.mobileNumber,
      //     name: getDevDetails?.data?.devDetail[0]?.licenceDetails?.name,
      //     gender: getDevDetails?.data?.devDetail[0]?.licenceDetails?.gender,
      //     mobileNumber: getDevDetails?.data?.devDetail[0]?.licenceDetails?.mobileNumber,
      //     emailId: getDevDetails?.data?.devDetail[0]?.licenceDetails?.email,
      //     dob: getDevDetails?.data?.devDetail[0]?.licenceDetails?.dob,
      //     pan: getDevDetails?.data?.devDetail[0]?.licenceDetails?.panNumber,
      //     uploadBoardResolution: getDevDetails?.data?.devDetail[0]?.licenceDetails?.uploadBoardResolution,
      //     uploadDigitalSignaturePdf: getDevDetails?.data?.devDetail[0]?.licenceDetails?.uploadDigitalSignaturePdf
      //     ,
      //     uuid: userInfo.info.uuid
      //   }
      // ]);

      setAurthorizedUserInfoArray(getDevDetails?.data?.devDetail[0]?.aurthorizedUserInfoArray || []);
    } catch (error) {
      return error;
    }
  };
  useEffect(() => {
    getDeveloperData();
  }, []);

  const authUserSearch = async () => {
    try {
      const requestResp = {
        RequestInfo: {
          api_id: "org.egov.pgr",
          ver: "1.0",
          ts: "",
          res_msg_id: "uief87324",
          msg_id: "654654",
          status: "successful",
          auth_token: "",
        },
        parentid: userInfo?.info?.id,
        tenantId: tenantId,
      };
      const getAuthUserDetails = await axios.post(`/user/_search`, requestResp, {});
      const developerDataGet = getAuthUserDetails?.data;
      // const filterAuthUser = [...getAuthUserDetails?.data.map(user => user.active.includes('true'))];

      // setAurthorizedUserInfoArray(developerDataGet?.user);
    } catch (error) {
      return error;
    }
  };
  useEffect(() => {
    authUserSearch();
  }, []);
  let validation = {};
  let isOpenLinkFlow = window.location.href.includes("openlink");
  const [PanValError, setPanValError] = useState("");

  const getUserType = () => Digit.UserService.getType();
  const [params, setParmas] = useState(isUserRegistered ? {} : location?.state?.data);
  const [modal, setmodal] = useState(false);
  const [aurthorizedUserName, setAurtorizedUserName] = useState(
    formData?.LicneseDetails?.aurthorizedUserName || formData?.LicneseDetails?.aurthorizedUserName || ""
  );
  const [aurthorizedMobileNumber, setAurthorizedMobileNumber] = useState(
    formData?.LicneseDetails?.aurthorizedMobileNumber || formData?.LicneseDetails?.aurthorizedMobileNumber || ""
  );
  const [aurthorizedEmail, setAurthorizedEmail] = useState(
    formData?.LicneseDetails?.aurthorizedEmail || formData?.LicneseDetails?.aurthorizedEmail || ""
  );
  const [aurthorizedDob, setAurthorizedDob] = useState(formData?.LicneseDetails?.aurthorizedDob || formData?.LicneseDetails?.aurthorizedDob || "");
  const [gender, setGender] = useState(formData?.LicneseDetails?.gender || formData?.LicneseDetails?.gender);
  const [aurthorizedPan, setAurthorizedPan] = useState(formData?.LicneseDetails?.aurthorizedPan || formData?.LicneseDetails?.aurthorizedPan || "");

  const [docUpload, setDocuploadData] = useState([]);
  const [uploadBoardResolution, setAdhaarPdf] = useState(DevelopersAllData?.uploadBoardResolution || "");
  const [uploadDigitalSignaturePdf, setDigitalSignPdf] = useState(DevelopersAllData?.uploadDigitalSignaturePdf || "");
  const [file, setFile] = useState(null);
  const [urlGetAdhaarPdf, setAdhaarPdfUrl] = useState("");
  const [urlGetDigitalSign, setDigitalSignPdfUrl] = useState("");

  const [showAuthuser, setShowAuthuser] = useState(false);
  const handleShowAuthuser = () => {
    setShowAuthuser(true);
    setAurtorizedUserName("");
    setAurthorizedMobileNumber("");
    setAurthorizedEmail("");
    setAurthorizedDob("");
    setGender("");
    setAurthorizedPan("");
  };
  const handleCloseAuthuser = () => {
    setValue("modalFiles", []);
    setShowAuthuser(false);
  };

  const {
    register,
    handleSumit,
    formState: { error },
  } = useForm([{ Sr: "", Name: "", Mobile: "", Email: "", PAN: "", Aadhar: "" }]);
  const [showhide, setShowhide] = useState("No");

  function setGenderName(value) {
    // console.log("GENDER", value);
    setGender(value);
    setPanIsValid(false);
  }
  function selectPanNumber(e) {
    if (!e.target.value || /^\w+$/.test(e.target.value)) {
      setAurthorizedPan(e.target.value.toUpperCase());
      setPanIsValid(false);
      // if(e.target.value === 10){
      //   panVerification();
      // }
    }
  }
  function selectAurthorizedMobileNumber(value) {
    setAurthorizedMobileNumber(value);
    setPanIsValid(false);
  }

  const { isLoading, data: genderTypeData } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["GenderType"]);

  let menu = [];
  genderTypeData &&
    genderTypeData["common-masters"].GenderType.filter((data) => data.active).map((genderDetails) => {
      menu.push({ i18nKey: `COMMON_GENDER_${genderDetails.code}`, code: `${genderDetails.code}`, value: `${genderDetails.code}` });
    });
  const editScreen = false;

  const panVerification = async () => {
    setLoading(true);
    try {
      const panVal = {
        txnId: "f7f1469c-29b0-4325-9dfc-c567200a70f7",
        format: "xml",
        certificateParameters: {
          panno: aurthorizedPan,
          PANFullName: aurthorizedUserName,
          FullName: aurthorizedUserName,
          DOB: aurthorizedDob,
          GENDER: gender.value,
          // "GENDER": gender.value
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
              mobile: aurthorizedMobileNumber,
              email: aurthorizedEmail,
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
      // console.log("",panResp.data);
      setPanIsValid(true);
      setPanValError("");
      setLoading(false);
    } catch (errdata) {
      setLoading(false);
      setPanIsValid(false);
      setPanValError(errdata?.response?.data?.errorDescription);
    }
  };

  // useEffect(() => {
  //   if(aurthorizedPan.length === 10){
  //     panVerification();
  //   }
  // }, [aurthorizedPan])

  const sendOtp = async (data) => {
    try {
      const res = await Digit.UserService.sendOtp(data, stateCode);
      return [res, null];
    } catch (err) {
      return [null, err];
    }
  };

  const getDocumentData = async (file, fieldName, fromTable, index) => {
    if (fromTable) {
      if (getValues("authorizedUserFiles")?.includes(file.name)) {
        setShowToastError({ label: "Duplicate file Selected", error: true, success: false });
        return;
      }
    } else {
      if (getValues("modalFiles")?.includes(file.name)) {
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
      if (fromTable) {
        let temp = aurthorizedUserInfoArray;
        temp[index][fieldName] = Resp?.data?.files?.[0]?.fileStoreId;
        setAurthorizedUserInfoArray([...temp]);
        if (getValues("authorizedUserFiles")) {
          setValue("authorizedUserFiles", [...getValues("authorizedUserFiles"), file.name]);
        } else {
          setValue("authorizedUserFiles", [file.name]);
        }
      } else {
        setValue(fieldName, Resp?.data?.files?.[0]?.fileStoreId);
        // setDocId(Resp?.data?.files?.[0]?.fileStoreId);
        setDocumentsData(getValues());
        if (getValues("modalFiles")) {
          setValue("modalFiles", [...getValues("modalFiles"), file.name]);
        } else {
          setValue("modalFiles", [file.name]);
        }
      }

      //   setLoader(false);
    } catch (error) {
      //   setLoader(false);
      setLoading(false);
      alert(error?.response?.data?.Errors?.[0]?.description);
    }
  };

  const handleUserNameChange = (e) => {
    if (!e.target.value || e.target.value.match("^[a-zA-Z ]*$")) {
      setAurtorizedUserName(e.target.value);
      setPanIsValid(false);
    }
  };

  const validateUser = (pan, mobile, email) => {
    // Iterate through the array of users and check if any of them have the same PAN, mobile number, or email address
    for (const user of aurthorizedUserInfoArray) {
      if (user.pan === pan || user.mobileNumber === mobile || user.emailId === email) {
        return true;
      }
    }
    return false;
  };

  const [noofRows, setNoOfRows] = useState(1);
  const handleSubmitFormdata = async () => {
    if (validateUser(aurthorizedPan, aurthorizedMobileNumber, aurthorizedEmail)) {
      return alert("PLease Enter Unique PAN, Email and Mobile Number for every user");
    }
    setLoading(true);
    // if(aurthorizedMobileNumber!=="" && aurthorizedUserName!=="" && aurthorizedMobileNumber!=="" && aurthorizedEmail!==""){
    const user = {
      userName: aurthorizedEmail,
      name: aurthorizedUserName,
      gender: gender.value,
      mobileNumber: aurthorizedMobileNumber,
      emailId: aurthorizedEmail,
      dob: aurthorizedDob,
      pan: aurthorizedPan,
      uploadBoardResolution: Documents?.uploadBoardResolution,
      uploadDigitalSignaturePdf: Documents?.uploadDigitalSignaturePdf,
      parentId: userInfo?.info?.id,
      type: "CITIZEN",
      password: "Password@123",

      roles: [
        {
          code: "CITIZEN",
          name: "Citizen",
          tenantId: tenantId,
        },
        {
          code: "BPA_BUILDER",
          name: "BPA BUILDER",
          tenantId: tenantId,
        },
        {
          code: "BPA_DEVELOPER",
          name: "BPA DEVELOPER",
          tenantId: tenantId,
        },
      ],
      tenantId: "hr",
    };

    try {
      const requestResp = {
        RequestInfo: {
          apiId: "Rainmaker",
          msgId: "1669293303096|en_IN",
          authToken: "",
          active: true,
          tenantId: "hr",
          permanentCity: null,
        },
        user: user,
      };
      const postDataAuthUser = await axios.post(`/user/users/_createnovalidate`, requestResp, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      setAurthorizedUserInfoArray([...aurthorizedUserInfoArray, { ...user, uuid: postDataAuthUser?.data?.user?.[0]?.uuid }]);
      if (getValues("authorizedUserFiles")) {
        setValue("authorizedUserFiles", [...getValues("authorizedUserFiles"), ...getValues("modalFiles")]);
      } else {
        setValue("authorizedUserFiles", [...getValues("modalFiles")]);
      }
      setDocumentsData({});
      setLoading(false);
      setPanIsValid(false);
      handleCloseAuthuser();
    } catch (error) {
      setLoading(false);
      setShowToastError({ label: error?.response?.data?.Errors?.[0]?.code, error: true, success: false });
      // console.log("ERROR ====> ", error.response, error);
    }
    // getAdhaarPdf();
    // getDigitalSignPdf();
    // }
  };

  const deleteTableRows = (i) => {
    const rows = [...aurthorizedUserInfoArray];
    rows.splice(i, 1);
    setAurthorizedUserInfoArray(rows);
  };
  // const {id} = useParams();
  const viewRecord = (elementInArray, index) => {
    // setUserDelete(elementInArray);
    const removedData = {
      user: { ...elementInArray, active: false },
      RequestInfo: {
        active: true,
        tenantId: tenantId,
        permanentCity: null,
      },
    };

    Digit.OBPSService.UpdateDeveloper(removedData, tenantId)
      .then((result, err) => {
        deleteTableRows(index);
      })
      .catch((error) => {
        return error;
      });
  };

  const goNext = async (e) => {
    //   e.preventDefault();
    // if (!(formData?.result && formData?.result?.Licenses[0]?.id)) {
    const addAuthUserformData = {
      aurthorizedUserInfoArray: aurthorizedUserInfoArray,
    };
    onSelect(config.key, formData);
    localStorage.setItem("data_user", JSON.stringify(addAuthUserformData));

    const developerRegisterData = {
      id: userInfo?.info?.id,
      pageName: "aurthorizedUserInfoArray",
      createdBy: userInfo?.info?.id,
      updatedBy: userInfo?.info?.id,
      devDetail: {
        aurthorizedUserInfoArray: aurthorizedUserInfoArray,
      },
    };
    setLoading(true);
    Digit.OBPSService.CREATEDeveloper(developerRegisterData, tenantId)
      .then((result, err) => {
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
        setShowToast({ key: "error" });
        setError(e?.response?.data?.Errors[0]?.message || null);
      });
    // }else {
    //   let data = formData?.formData;
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
      case 2:
        navigate.replace("/digit-ui/citizen/obps/stakeholder/apply/license-add-info");
        break;
    }
  };

  return (
    <div className={isOpenLinkFlow ? "OpenlinkContainer" : ""}>
      {loader && <Spinner />}
      {/* {JSON.stringify(aurthorizedUserInfoArray)} */}
      <Timeline currentStep={3} flow="STAKEHOLDER" onChangeStep={changeStep} />
      <FormStep
        className="card"
        // onSubmit={handleAurthorizedUserFormSubmit}
        config={config}
        onSelect={goNext}
        onSkip={onSkip}
        isDisabled={!(aurthorizedUserInfoArray && aurthorizedUserInfoArray.length)}
        t={t}
      >
        <div className="happy">
          <div className="card">
            {/* <h5 className="card-h">Add/Remove Authorized Users</h5> */}
            <div className="table-bd">
              {/* <Table className="table table-bordered table-striped table-responsive">
                <thead>
                  <tr>
                    <th>Sr. No</th>
                    <th>Name</th>
                    <th>Mobile Number</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>PAN No.</th>
                    <th>
                      {data?.devDetail[0]?.addInfo?.showDevTypeFields === "Individual" ||
                      data?.devDetail[0]?.addInfo?.showDevTypeFields === "Proprietorship Firm" ||
                      data?.devDetail[0]?.addInfo?.showDevTypeFields === "Hindu Undivided Family" ? (
                        <label htmlFor="name" className="text">
                          Upload Power of Attorney{" "}
                        </label>
                      ) : (
                        <label htmlFor="name" className="text">
                          {" "}
                          Upload Board Resolution
                        </label>
                      )}
                    </th>
                    <th>View Digital Signature PDF</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {aurthorizedUserInfoArray?.length > 0 ? (
                    aurthorizedUserInfoArray.map((elementInArray, input) => {
                      return (
                        <tr key={elementInArray.id}>
                          <td>{input + 1}</td>
                          <td>{elementInArray.name}</td>
                          <td>{elementInArray.mobileNumber}</td>
                          <td>{elementInArray.emailId}</td>
                          <td>{elementInArray.gender}</td>
                          <td>{elementInArray.pan}</td>
                          <td>
                            <div className="row">
                              {elementInArray.uploadBoardResolution !== "" ? (
                                <button
                                  type="button"
                                  title="View Document"
                                  onClick={() => getDocShareholding(elementInArray?.uploadBoardResolution)}
                                  className="btn btn-sm col-md-6"
                                >
                                  <VisibilityIcon color="info" className="icon" />
                                </button>
                              ) : (
                                <p></p>
                              )}
                              <div className="btn btn-sm col-md-6">
                                <label for={"uploadAdhaarDoc" + input} title="Upload Document">
                                  {" "}
                                  <FileUpload color="primary" />
                                </label>
                                <input
                                  id={"uploadAdhaarDoc" + input}
                                  type="file"
                                  accept="application/pdf"
                                  style={{ display: "none" }}
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "uploadBoardResolution", true, input)}
                                />
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="row">
                              {elementInArray.uploadDigitalSignaturePdf ? (
                                <button
                                  type="button"
                                  title="View Document"
                                  onClick={() => getDocShareholding(elementInArray?.uploadDigitalSignaturePdf)}
                                  className="btn btn-sm col-md-6"
                                >
                                  <VisibilityIcon color="info" className="icon" />
                                </button>
                              ) : (
                                <p></p>
                              )}
                              <div className="btn btn-sm col-md-6">
                                <label for={"uploadSignDoc" + input}>
                                  {" "}
                                  <FileUpload color="primary" />
                                </label>
                                <input
                                  id={"uploadSignDoc" + input}
                                  type="file"
                                  accept="application/pdf"
                                  style={{ display: "none" }}
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "uploadDigitalSignaturePdf", true, input)}
                                />
                              </div>
                            </div>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <a
                              title="Delete record"
                              onClick={() => viewRecord(elementInArray, input)}
                            >
                              <DeleteIcon style={{ fill: "#ff1a1a" }} />
                            </a>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <div className="d-none">Click on Add to add a aurthorized user</div>
                  )}
                </tbody>
              </Table> */}
              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Sr No.</StyledTableCell>
                        <StyledTableCell>Name</StyledTableCell>
                        <StyledTableCell>Mobile Number</StyledTableCell>
                        <StyledTableCell>Email</StyledTableCell>
                        <StyledTableCell>Gender</StyledTableCell>
                        <StyledTableCell>PAN No.</StyledTableCell>
                        <StyledTableCell>
                          {data?.devDetail[0]?.addInfo?.showDevTypeFields === "Individual" ||
                          data?.devDetail[0]?.addInfo?.showDevTypeFields === "Proprietorship Firm" ||
                          data?.devDetail[0]?.addInfo?.showDevTypeFields === "Hindu Undivided Family" ? (
                            <label htmlFor="name" className="text">
                              Upload/View Power of Attorney{" "}
                            </label>
                          ) : (
                            <label htmlFor="name" className="text">
                              {" "}
                              Upload/View Board Resolution
                            </label>
                          )}
                        </StyledTableCell>
                        <StyledTableCell>Upload/View Digital Signature PDF</StyledTableCell>
                        <StyledTableCell>Action</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {aurthorizedUserInfoArray?.length > 0 ? (
                        aurthorizedUserInfoArray.map((elementInArray, input) => {
                          return (
                            <StyledTableRow key={elementInArray.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                              <StyledTableCell component="th" scope="row">
                                {input + 1}
                              </StyledTableCell>
                              <StyledTableCell>{elementInArray.name}</StyledTableCell>
                              <StyledTableCell>{elementInArray.mobileNumber}</StyledTableCell>
                              <StyledTableCell>{elementInArray.emailId}</StyledTableCell>
                              <StyledTableCell>{elementInArray.gender}</StyledTableCell>
                              <StyledTableCell>{elementInArray.pan}</StyledTableCell>
                              <StyledTableCell>
                                <div className="row">
                                  {elementInArray.uploadBoardResolution !== "" ? (
                                    <button
                                      type="button"
                                      title="View Document"
                                      onClick={() => getDocShareholding(elementInArray?.uploadBoardResolution)}
                                      className="btn btn-sm col-md-6"
                                    >
                                      <VisibilityIcon color="info" className="icon" />
                                    </button>
                                  ) : (
                                    <p></p>
                                  )}
                                  <div className="btn btn-sm col-md-6">
                                    <label for={"uploadAdhaarDoc" + input} title="Upload Document">
                                      {" "}
                                      <FileUpload color="primary" />
                                    </label>
                                    <input
                                      id={"uploadAdhaarDoc" + input}
                                      type="file"
                                      accept="application/pdf"
                                      style={{ display: "none" }}
                                      onChange={(e) => getDocumentData(e?.target?.files[0], "uploadBoardResolution", true, input)}
                                    />
                                  </div>
                                </div>
                              </StyledTableCell>
                              <StyledTableCell>
                                <div className="row">
                                  {elementInArray.uploadDigitalSignaturePdf ? (
                                    <button
                                      type="button"
                                      title="View Document"
                                      onClick={() => getDocShareholding(elementInArray?.uploadDigitalSignaturePdf)}
                                      className="btn btn-sm col-md-6"
                                    >
                                      <VisibilityIcon color="info" className="icon" />
                                    </button>
                                  ) : (
                                    <p></p>
                                  )}
                                  <div className="btn btn-sm col-md-6">
                                    <label for={"uploadSignDoc" + input} title="Upload Document">
                                      {" "}
                                      <FileUpload color="primary" />
                                    </label>
                                    <input
                                      id={"uploadSignDoc" + input}
                                      type="file"
                                      accept="application/pdf"
                                      style={{ display: "none" }}
                                      onChange={(e) => getDocumentData(e?.target?.files[0], "uploadDigitalSignaturePdf", true, input)}
                                    />
                                  </div>
                                </div>
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {/* <Button variant="contained" color={"primary"} title="Delete record" onClick={() => viewRecord(elementInArray, input)}>
                                <DeleteIcon style={{ fill: "#ff1a1a" }} />
                              </Button> */}
                                <a
                                  // onClick={()=>(viewRecord(elementInArray.id))}
                                  title="Delete record"
                                  onClick={() => viewRecord(elementInArray, input)}
                                >
                                  <DeleteIcon style={{ fill: "#ff1a1a" }} />
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
                  count={aurthorizedUserInfoArray?.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
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
                  onClick={handleShowAuthuser}
                >
                  Add More
                </button>

                <Modal show={showAuthuser} onHide={handleCloseAuthuser} animation={false}>
                  <Modal.Header closeButton>
                    <Modal.Title>Add Authorised User</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <form className="text1">
                      <Row>
                        <Col md={3} xxl lg="3">
                          <label htmlFor="name" className="text">
                            Enter Full Name <span className="text-danger font-weight-bold">*</span>
                          </label>
                          <input type="text" value={aurthorizedUserName} class="form-control" onChange={handleUserNameChange} />
                          {aurthorizedUserName && aurthorizedUserName.length > 0 && !aurthorizedUserName.match(Digit.Utils.getPattern("Name")) && (
                            <CardLabelError style={{ width: "100%", marginTop: "-15px", fontSize: "16px", marginBottom: "12px", color: "red" }}>
                              {t("Please enter valid Name")}
                            </CardLabelError>
                          )}
                        </Col>
                        <Col md={3} xxl lg="3">
                          <label htmlFor="name" className="text">
                            Mobile Number <span className="text-danger font-weight-bold">*</span>
                          </label>
                          <MobileNumber
                            value={aurthorizedMobileNumber}
                            name="registeredContactNo"
                            maxlength={"10"}
                            required
                            onChange={selectAurthorizedMobileNumber}
                            // disable={mobileNumber && !isOpenLinkFlow ? true : false}
                            {...{ required: true, pattern: "[6-9]{1}[0-9]{9}", type: "tel" }}
                          />
                          {aurthorizedMobileNumber &&
                            aurthorizedMobileNumber.length > 0 &&
                            !aurthorizedMobileNumber.match(Digit.Utils.getPattern("MobileNo")) && (
                              <CardLabelError style={{ width: "100%", marginTop: "-15px", fontSize: "16px", marginBottom: "12px", color: "red" }}>
                                {t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID")}
                              </CardLabelError>
                            )}
                        </Col>
                        <Col md={3} xxl lg="3">
                          <label htmlFor="name" className="text">
                            Email <span className="text-danger font-weight-bold">*</span>
                          </label>
                          {/* <input
                                  type="email"
                                  name="name[]"
                                  placeholder=""
                                  class="employee-card-input"
                                  onChange={(e) => setAurthorizedEmail(e.target.value)}
                                /> */}
                          <TextInput
                            t={t}
                            type={"email"}
                            isMandatory={false}
                            optionKey="i18nKey"
                            name="aurthorizedEmail"
                            // value={aurthorizedEmail}
                            placeholder=""
                            // onChange={setEmail}
                            onChange={(e) => {
                              setAurthorizedEmail(e.target.value);
                              setPanIsValid(false);
                            }}
                            //disable={editScreen}
                            {...(validation = {
                              isRequired: true,
                              title: "Please enter Email",
                            })}
                          />
                          {aurthorizedEmail && aurthorizedEmail.length > 0 && !aurthorizedEmail.match(Digit.Utils.getPattern("Email")) && (
                            <CardLabelError style={{ width: "100%", marginTop: "-15px", fontSize: "16px", marginBottom: "12px", color: "red" }}>
                              {"Invalid Email Address"}
                            </CardLabelError>
                          )}
                        </Col>
                        <Col md={3} xxl lg="3">
                          <label htmlFor="name" className="text">
                            Gender <span className="text-danger font-weight-bold">*</span>
                          </label>
                          <Dropdown
                            style={{ width: "100%" }}
                            className="form-field"
                            selected={gender?.length === 1 ? gender[0] : gender}
                            disable={gender?.length === 1 || editScreen}
                            option={menu}
                            select={setGenderName}
                            // value={gender}
                            optionKey="code"
                            t={t}
                            name="gender"
                            placeholder="Select Gender"
                          />
                        </Col>
                        <Col md={3} xxl lg="3">
                          <label htmlFor="name" className="text">
                            Date of Birth <span className="text-danger font-weight-bold">*</span>
                          </label>
                          <input
                            type="date"
                            name="dob[]"
                            placeholder=""
                            class="employee-card-input"
                            onChange={(e) => {
                              setAurthorizedDob(e.target.value);
                              setPanIsValid(false);
                            }}
                            max={convertEpochToDate(new Date().setFullYear(new Date().getFullYear() - 18))}
                          />
                        </Col>
                        <Col md={3} xxl lg="3">
                          <label htmlFor="name" className="text">
                            PAN No <span className="text-danger font-weight-bold">*</span>
                          </label>
                          {/* <input
                                  type="text"
                                  name="name[]"
                                  placeholder=""
                                  class="employee-card-input"
                                  onChange={(e) => setAurthorizedPan(e.target.value)}
                                /> */}
                          <div className="d-flex align-items-baseline">
                            <TextInput
                              t={t}
                              type={"text"}
                              isMandatory={false}
                              optionKey="i18nKey"
                              name="aurthorizedPan"
                              value={aurthorizedPan}
                              placeholder=""
                              // onChange={(e) => setAurthorizedPan(e.target.value.toUpperCase())}
                              onChange={selectPanNumber}
                              {...{ required: true, maxlength: "10" }}
                            />
                            <Button className="ml-3" onClick={panVerification}>
                              {panIsValid ? "Verified" : "Verify"}
                            </Button>
                          </div>
                          {aurthorizedPan && aurthorizedPan.length > 0 && !aurthorizedPan.match(Digit.Utils.getPattern("PAN")) && (
                            <CardLabelError style={{ width: "100%", marginTop: "-15px", fontSize: "16px", marginBottom: "12px" }}>
                              {t("BPA_INVALID_PAN_NO")}
                            </CardLabelError>
                          )}
                          <h3 className="error-message" style={{ color: "red" }}>
                            {panIsValid ? "" : PanValError}
                          </h3>
                        </Col>
                        <Col md={3} xxl lg="3">
                          {data?.devDetail[0]?.addInfo?.showDevTypeFields === "Individual" ||
                          data?.devDetail[0]?.addInfo?.showDevTypeFields === "Proprietorship Firm" ||
                          data?.devDetail[0]?.addInfo?.showDevTypeFields === "Hindu Undivided Family" ? (
                            <label htmlFor="name" className="text">
                              Upload Power of Attorney <span className="text-danger font-weight-bold">*</span>
                            </label>
                          ) : (
                            <label htmlFor="name" className="text">
                              {" "}
                              Upload Board Resolution<span className="text-danger font-weight-bold">*</span>
                            </label>
                          )}
                          <input
                            type="file"
                            name="uploadBoardResolution"
                            accept="application/pdf"
                            placeholder=""
                            class="employee-card-input"
                            onChange={(e) => getDocumentData(e?.target?.files[0], "uploadBoardResolution")}
                          />
                        </Col>
                        <Col md={3} xxl lg="3">
                          <label htmlFor="name" className="text">
                            Upload Digital Signature PDF <span className="text-danger font-weight-bold">*</span>
                          </label>
                          <input
                            type="file"
                            name="uploadDigitalSignaturePdf"
                            accept="application/pdf"
                            placeholder=""
                            class="employee-card-input"
                            onChange={(e) => getDocumentData(e?.target?.files[0], "uploadDigitalSignaturePdf")}
                          />
                        </Col>
                      </Row>
                    </form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAuthuser}>
                      Close
                    </Button>
                    <Button
                      disabled={
                        !aurthorizedUserName ||
                        !aurthorizedDob ||
                        !aurthorizedEmail ||
                        !panIsValid ||
                        !aurthorizedMobileNumber ||
                        !aurthorizedPan ||
                        !aurthorizedEmail.match(Digit.Utils.getPattern("Email")) ||
                        !aurthorizedUserName.match(Digit.Utils.getPattern("Name")) ||
                        !aurthorizedPan.match(Digit.Utils.getPattern("PAN")) ||
                        !aurthorizedMobileNumber.match(Digit.Utils.getPattern("MobileNo")) ||
                        !Documents?.uploadBoardResolution ||
                        !Documents?.uploadDigitalSignaturePdf
                      }
                      variant="primary"
                      onClick={handleSubmitFormdata}
                    >
                      Submit
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
            {/* <MuiTables /> */}
          </div>
        </div>
        {/* <div className="form-group col-md6 mt-6">
                <button
                type="submit"
                style={{ float: "right" }}
                className="btn btn-success"
                
                
                >
                Submit
                </button>
            </div> */}
        {toastError && (
          <Toast
            error={"error" ? true : false}
            label={toastError}
            isDleteBtn={true}
            onClose={() => {
              setToastError(null);
            }}
          />
        )}
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
    </div>
  );
};

export default AddAuthorizeduser;
