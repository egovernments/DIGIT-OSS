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
  typeOf,
} from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import FormControl from "@mui/material/FormControl";
import { useForm } from "react-hook-form";
import OutlinedInput from "@mui/material/OutlinedInput";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import { Dialog } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Modal, ModalHeader, ModalFooter, ModalBody } from "react-bootstrap";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import CusToaster from "../../../../../../components/Toaster";
import Spinner from "../../../../../../components/Loader";
import { useTranslation } from "react-i18next";
// import TextareaAutosize from "@mui/base/TextareaAutosize";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import axios from "axios";
import { getDocShareholding } from "../../../docView/docView.help";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileUpload from "@mui/icons-material/FileUpload";
import { useLocation } from "react-router-dom";
import { IconButton } from "@mui/material";
import SearchLicenceComp from "../../../../../../components/SearchLicence";
import Item from "antd/lib/list/Item";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function LayoutPlanClu() {
    const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickOpen1 = () => {
    setOpen1(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClose1 = () => {
    setOpen1(false);
    
  };
  const { t } = useTranslation();
  const location = useLocation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const userInfo = Digit.UserService.getUser()?.info || {};
  const [loader, setLoader] = useState(false);
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
    const [applicationNumber, setApplicationNumber] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
    resetField,
  } = useForm({ reValidateMode: "onChange", mode: "onChange" });
  // const { register, handleSubmit, setValue, getValues, watch } = useForm();
  const [layOutPlanData, setLayOutPlanData] = useState([]);
  const [showToastError, setShowToastError] = useState({ label: "", error: false, success: false });
  const [toastError, setToastError] = useState("");
  const [applicantId, setApplicantId] = useState("");
  const [modalValue, setModalValue] = useState([]);
  const [licenseNoModal, setLicenseNoModal] = useState("");
  const [areaModal, setAreaModal] = useState("");
  const [Documents, setDocumentsData] = useState();
  const [fileStoreId, setFileStoreId] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const[totalArea,setTotalArea]=useState(0);
  const [licenseNoVal, setLicNumber] = useState("");
  const [existingAreaVal, setExistingArea] = useState("");
  const [proposedAreaRevisionVal, setProposedAreaRevision] = useState("");
  const [areaCommercialVal, setAreaCommercial] = useState("");
  const [areaResidentialVal, setAreaResidential] = useState("");
  const [anyOtherRemarkVal, setAnyOtherRemark] = useState("");
  const [anyOtherRemarkTextVal, setAnyOtherRemarkTextVal] = useState("");
  const [reasonRevisionLayoutDoc, setReasonRevisionLayoutDoc] = useState("");
  const [earlierApprovedlayoutDoc, setEarlierApprovedlayoutDoc] = useState("");
  const [copyProposedlayoutDoc, setCopyProposedlayoutDoc] = useState("");
  const [statusCreationAffidavitDocVal, setStatusCreationAffidavitDocVal] = useState("");
  const [boardResolutionAuthSignatoryDocVal, setBoardResolutionAuthSignatoryDocVal] = useState("");
  const [anyOtherDocVal, setAnyOtherDocVal] = useState("");
  const [getTotalArea, setTotlArea] = useState();
  const handleshowhide = (event) => {
    const getuser = event.target.value;
    setShowhide(getuser);
  };

  const getApplicantUserData = async (id) => {
    const token = window?.localStorage?.getItem("token");
    const payload = {
      apiId: "Rainmaker",
      msgId: "1669293303096|en_IN",
      authToken: token,
    };
    try {
      const Resp = await axios.post(`/tl-services/revisedPlan/_search?applicationNumber=${id}`, payload);
      const userDataArray = Resp?.data?.revisedPlan?.[0];
      const userData = Resp?.data?.revisedPlan?.[0];
      // setValue(userData);
      setLayOutPlanData(userDataArray);
      // setLayOutPlanData(userData);
      console.log("dasd", userDataArray);
      setLicNumber(userData?.licenseNo);
      setExistingArea(userData?.additionalDetails?.existingArea);
      setModalValue(userData?.additionalDetails?.existingAreaDetails);
      setProposedAreaRevision(userData?.additionalDetails?.areaProposedRevision);
      setAreaCommercial(userData?.additionalDetails?.areaCommercial);
      setAreaResidential(userData?.additionalDetails?.areaResidential);
      setAnyOtherRemark(userData?.additionalDetails?.anyOtherFeature);
      setAnyOtherRemarkTextVal(userData?.additionalDetails?.anyOtherRemarks);
      setReasonRevisionLayoutDoc(userData?.additionalDetails?.reasonRevisionLayoutPlanDoc);
      setEarlierApprovedlayoutDoc(userData?.additionalDetails?.earlierApprovedlayoutPlan);
      setCopyProposedlayoutDoc(userData?.additionalDetails?.copyProposedlayoutPlan);
      setStatusCreationAffidavitDocVal(userData?.additionalDetails?.statusCreationAffidavitDoc);
      setBoardResolutionAuthSignatoryDocVal(userData?.additionalDetails?.boardResolutionAuthSignatoryDoc);
      setAnyOtherDocVal(userData?.additionalDetails?.anyOther);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    const search = location?.search;
    const params = new URLSearchParams(search);
    const id = params.get("id");
    // const id = "TCP_RLP_20230408_000282";
    setApplicantId(id);
    if (id) getApplicantUserData(id);
  }, []);

  useEffect(()=>{
    console.log("totalarea1")
    if(modalValue?.length){
      let totalArea1 = 0
      modalValue.forEach((item,index)=>{
         totalArea1 += Number(item?.areaModalPop)
      }
      )
       setValue("existingArea",totalArea1)
       console.log("totalarea1",totalArea1)
    }
  },[modalValue]
  )
  const layoutPlan = async (data) => {
    const numberLic = data?.licenceNo;
    const token = window?.localStorage?.getItem("token");
    console.log(data);

    try {
      if (!applicantId) {
        const postLayoutPlan = {
          RevisedPlan: 
            {
              action: "APPLY",
              tenantId: tenantId,
              licenseNo: numberLic,
              newAdditionalDetails: {
              selectLicence: data?.selectLicence?.label,
              validUpto: data?.validUpto,
              colonizerName: data?.colonizerName,
              // periodOfRenewal: "",
              colonyType: data?.colonyType,
              areaAcres: data?.areaAcres,
              sectorNo: data?.sectorNo,
              revenueEstate: data?.revenueEstate,
              developmentPlan: data?.developmentPlan,
              tehsil: data?.tehsil,
              district: data?.district,
            },
              ReviseLayoutPlan: {
                ...data,
                existingAreaDetails: modalValue,
              },
            },
          
          RequestInfo: {
            apiId: "Rainmaker",
            ver: "v1",
            ts: 0,
            action: "_search",
            did: "",
            key: "",
            msgId: "090909",
            requesterId: "",
            authToken: token,
            userInfo: userInfo,
          },
        };
        console.log("LAY", postLayoutPlan);
        const Resp = await axios.post("/tl-services/revisedPlan/_create", postLayoutPlan);
        setLoader(false);
         setApplicationNumber(Resp.data.revisedPlan[0].applicationNumber);
        // const useData = Resp?.data?.RevisedPlan?.[0];
      } else {
        // layOutPlanData.licenseNo = data?.licenseNo ? data?.licenseNo : layOutPlanData.additionalDetails?.licenseNo;
        layOutPlanData.additionalDetails.existingArea = data?.existingArea ? data?.existingArea : layOutPlanData.additionalDetails?.existingArea;
        layOutPlanData.additionalDetails.existingAreaDetails = data?.existingAreaDetails
          ? data?.existingAreaDetails
          : layOutPlanData.additionalDetails?.existingAreaDetails;
        layOutPlanData.additionalDetails.areaProposedRevision = data?.areaProposedRevision
          ? data?.areaProposedRevision
          : layOutPlanData.additionalDetails?.areaProposedRevision;
        layOutPlanData.additionalDetails.areaCommercial = data?.areaCommercial
          ? data?.areaCommercial
          : layOutPlanData.additionalDetails?.areaCommercial;
        layOutPlanData.additionalDetails.areaResidential = data?.areaResidential
          ? data?.areaResidential
          : layOutPlanData.additionalDetails?.areaResidential;
        layOutPlanData.additionalDetails.anyOtherFeature = data?.anyOtherFeature
          ? data?.anyOtherFeature
          : layOutPlanData.additionalDetails?.anyOtherFeature;
        layOutPlanData.additionalDetails.anyOtherRemarks = data?.anyOtherRemarks
          ? data?.anyOtherRemarks
          : layOutPlanData.additionalDetails?.anyOtherRemarks;
        layOutPlanData.additionalDetails.reasonRevisionLayoutPlanDoc = data?.reasonRevisionLayoutPlanDoc
          ? data?.reasonRevisionLayoutPlanDoc
          : layOutPlanData.additionalDetails?.reasonRevisionLayoutPlanDoc;
        layOutPlanData.additionalDetails.earlierApprovedlayoutPlan = data?.earlierApprovedlayoutPlan
          ? data?.earlierApprovedlayoutPlan
          : layOutPlanData.additionalDetails?.earlierApprovedlayoutPlan;
        layOutPlanData.additionalDetails.copyProposedlayoutPlan = data?.copyProposedlayoutPlan
          ? data?.copyProposedlayoutPlan
          : layOutPlanData.additionalDetails?.copyProposedlayoutPlan;
        layOutPlanData.additionalDetails.statusCreationAffidavitDoc = data?.statusCreationAffidavitDoc
          ? data?.statusCreationAffidavitDoc
          : layOutPlanData.additionalDetails?.statusCreationAffidavitDoc;
        layOutPlanData.additionalDetails.boardResolutionAuthSignatoryDoc = data?.boardResolutionAuthSignatoryDoc
          ? data?.boardResolutionAuthSignatoryDoc
          : layOutPlanData.additionalDetails?.boardResolutionAuthSignatoryDoc;
        layOutPlanData.additionalDetails.anyOther = data?.anyOther ? data?.anyOther : layOutPlanData.additionalDetails?.anyOther;

  //  useEffect(() => {
  //   var nameArray = modalValue?.map(function (itm) {
  //     if (isNaN(itm?.areaModal)) return 0;
  //     return itm?.areaModal;
  //   });
  //     const mixedSum = (nameArray = []) => {
  //     let sum = 0;
  //     for (let i = 0; i < nameArray.length; i++) {
  //       const el = nameArray[i];
  //       sum += +el;
  //     }
  //     return sum;
  //   };
  //    const totalVal = mixedSum(nameArray) + mixedSumB(nameArrayB);
  //   setTotlArea(totalVal?.toFixed(3));
  // }, [modalValue]);

        const updateRequest = {
          RequestInfo: {
            api_id: "Rainmaker",
            ver: "1",
            ts: null,
            action: "create",
            did: "",
            key: "",
            msg_id: "",
            requester_id: "",
            authToken: token,
            userInfo: userInfo,
          },
          revisedPlan: [
            {
              ...layOutPlanData,

              // "action": "FORWARD",
              // "tenantId":  tenantId,
              // "businessService": "SERVICE_PLAN",
              workflowCode: "REVISED_LAYOUT_PLAN",
              // "comment": "",
              // "assignee": null
            },
          ],
        };
        const Resp = await axios.post("/tl-services/revisedPlan/_update", updateRequest);
        setOpen(true);
        setApplicationNumber(Resp.data.servicePlanResponse[0].applicationNumber);
      }
    } catch (error) {
      setLoader(false);
      setToastError(error?.response?.data?.Errors?.[0]?.code);
      setTimeout(() => {
        setToastError(null);
      }, 2000);
      return error.message;
    }
  };
  const [showAuthuser, setModalShow] = useState(false);
  const handleShowAuthuser = () => {
    setModalShow(true);
  };
  const handleCloseAuthuser = () => {
    // setValue("modalFiles", []);
    setModalShow(false);
  };

  const handleSubmitExistingArea = () => {
    if (licenseNoModal !== "" && areaModal !== "") {
      const values = {
        licenseNoPop: licenseNoModal,
        areaModalPop: areaModal,
      };

      // console.log("DATFRM", values);
      setModalValue((prev) => [...prev, values]);
      // getDocDirector();
      setModalShow(false);
    }
  };

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

  const deleteTableRows = (i) => {
    const rows = [...modalValue];
    let tempRows = rows.splice(i, 1);
    // }
    setModalValue(rows);
  };

  const getDocumentData = async (file, fieldName) => {
    if (selectedFiles.includes(file.name)) {
      setShowToastError({ label: "Duplicate file Selected", error: true, success: false });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("tenantId", "hr");
    formData.append("module", "property-upload");
    formData.append("tag", "tag-property");
    setLoader(true);
    try {
      const Resp = await axios.post("/filestore/v1/files", formData, {});
      setValue(fieldName, Resp?.data?.files?.[0]?.fileStoreId);
      setFileStoreId({ ...fileStoreId, [fieldName]: Resp?.data?.files?.[0]?.fileStoreId });
      setSelectedFiles([...selectedFiles, file.name]);
      // setDocumentsData({ ...Documents, ...getValues() });
      setLoader(false);
      setShowToastError({ label: "File Uploaded Successfully", error: false, success: true });
    } catch (error) {
      setLoader(false);

      return error.message;
    }
  };

  const viewDocument = async (documentId) => {
    try {
      const response = await axios.get(`/filestore/v1/files/url?tenantId=hr&fileStoreIds=${documentId}`, {});
      const FILDATA = response.data?.fileStoreIds[0]?.url;
      window.open(FILDATA);
    } catch (error) {
      console.log(error);
    }
  };

  

  //  const [showhide19, setShowhide19] = useState("true");
  // const handleshow19 = (e) => {
  
  //  console.log("modalValue1234", modalValue?.[0]?.areaModalPop);
  //  const query = modalValue?.map((elementInArray) => 
  //  {elementInArray.areaModalPop} );
    // let query = DetailsofAppliedLand?.dgpsDetails.map((array) => array.map((object) => `${object.latitude},${object.longitude}`).join(":")).join("|")
    // console.log("Qurey", query);
    
  // };
 


// const users = []

//   const getAverageAge = (users) => {
//     let sum = 0
//     for (let i = 0; i < users.length; i++) {
//       sum += users[i].age
//     }
//     return sum / users.length
//   }


  return (
    <React.Fragment>
    <div className="w-100">
      {loader && <Spinner />}
      <form onSubmit={handleSubmit(layoutPlan)}>
        <div className="card">
          <h4 className="my-2">
            <b>{`${t("REV_LAYOUT_APPROVAL_OF_REVISED_LAYOUT_PLAN_OF_LICENCE")}`}</b>
          </h4>
          <div className="card">
            <div className="row gy-3">
              {/* <FormLabel id="lic_no" sx={{ fontWeight: "bold" }}>
                  {`${t("REV_LAYOUT_LICENSE_NO")}`} <span style={{ color: "red" }}>*</span>
                </FormLabel> */}
              <SearchLicenceComp
                watch={watch}
                register={register}
                control={control}
                setLoader={setLoader}
                errors={errors}
                setValue={setValue}
                resetField={resetField}
              />
              {/* <OutlinedInput
                  aria-labelledby="lic_no"
                  type="number"
                  placeholder=""
                  className="Inputcontrol"
                  {...register("licenseNo")}
                  onChange={(e) => setLicNumber(e.target.value)}
                  value={licenseNoVal}
                /> */}

              <Col md={4} lg={4} mb={3}>
                <FormControl>
                  <FormLabel id="existing_area" sx={{ fontWeight: "bold" }}>
                    {`${t("REV_LAYOUT_EXISTING_AREAS")}`} <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                </FormControl>
              </Col>
            </div>
            <Col md={12} lg={12} mb={3} sx={{ marginY: 2 }}>
              <Paper sx={{ width: "100%", overflow: "hidden", marginY: 2 }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell> {`${t("REV_LAYOUT_SR_NO")}`}
                        {/* Sr No. */}
                        </StyledTableCell>
                        <StyledTableCell>{`${t("REV_LAYOUT_LICENCE_NO")}`}
                        {/* License No. */}
                        </StyledTableCell>
                        <StyledTableCell>{`${t("REV_LAYOUT_AREA")}`}
                        {/* Area */}
                        </StyledTableCell>
                        <StyledTableCell>{`${t("REV_LAYOUT_ACTION")}`}
                         {/* Action */}
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      
                      {modalValue?.length > 0 ? (
                        modalValue.map((elementInArray, input) => {
                          return (
                            <StyledTableRow key={input} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                              <StyledTableCell component="th" scope="row">
                                {input + 1}
                              </StyledTableCell>
                              <StyledTableCell>{elementInArray.licenseNoPop}</StyledTableCell>
                              <StyledTableCell>{elementInArray.areaModalPop}</StyledTableCell>
                              
                              

                              <StyledTableCell >
                                <a href="javascript:void(0)" title="Delete record" onClick={() => deleteTableRows(-1)}>
                                  <DeleteIcon style={{ fill: "#ff1a1a" }} />
                                </a>
                              </StyledTableCell>
                            </StyledTableRow>
                          );
                        })
                      ) : (
                        <div className="d-none">Click on Add </div>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={modalValue?.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
              <div className="row">
              <Col sx={{ marginY: 2 }}>
                <button
                  type="button"
                  style={{
                    margin: "1rem 0rem",
                    backgroundColor: "#0b3629",
                    color: "white",
                  }}
                  className="btn"
                  // onClick={() => setNoOfRows(noofRows + 1)}
                  onClick={handleShowAuthuser}
                >
                  {`${t("REV_LAYOUT_ADD_MORES")}`}
                  {/* Add More */}
                </button>
              </Col>
               <Col md={4} lg={4} mb={3}>
                <FormControl>
                  <FormLabel id="existing_area" sx={{ fontWeight: "bold" }}>{`${t("REV_LAYOUT_TOTAL_AREAS")}`}
                    {/* Total Area:{getTotalArea}  */}
                    <span style={{ color: "red" }}>*</span>
                    
                
                  <OutlinedInput
                    aria-labelledby="existing_area"
                    type="text"
                    placeholder=""
                    className="Inputcontrol"
                    {...register("existingArea")}
                  disabled
                  />
                    </FormLabel>
                </FormControl>
              </Col>
               
                </div>
            </Col>
             <div className="table table-bordered table-responsive">
                        {/* <caption>List of users</caption> */}
                        <thead>
                          <tr>
                             <th class="fw-normal"></th>
                            <th class="fw-normal" style={{ textAlign: "center" }}>{`${t("REV_LAYOUT_AREA_IN_ACRES")}`}
                              {/* In Acres */}
                              </th>
                            <th class="fw-normal"style={{ textAlign: "center" }}>{`${t("REV_LAYOUT_AREA_IN_SQ_M")}`}
                              {/* In sq.m */}
                              </th>
                           
                          </tr>
                        </thead>
                      <tbody>
                         <tr>
                            <td>{`${t("REV_LAYOUT_AREA_PROPOSED_REVISION")}`}</td>
                            <td><input type="number"className="form-control" {...register("areaProposedRevision")} id="areaProposedRevision" /></td>
                            <td style={{ textAlign: "center" }}>{(watch("areaProposedRevision") * 4046.86)?.toFixed(3)}</td>
                          </tr>
                          <tr>
                            <td> {`${t("REV_LAYOUT_AREA_COMMERCIAL")}`}</td>
                            <td><input type="number"className="form-control"  {...register("areaCommercial")} id="areaCommercial"/></td>
                            <td style={{ textAlign: "center" }}>{(watch("areaCommercial") * 4046.86)?.toFixed(3)}</td>
                          </tr>
                          <tr>
                            <td>{`${t("REV_LAYOUT_AREA_RESIDENTIAL")}`}</td>
                            <td><input type="number"className="form-control" {...register("areaResidential")} id="areaResidential"/></td>
                            <td style={{ textAlign: "center" }}>{(watch("areaResidential") * 4046.86)?.toFixed(3)}</td>
                          </tr>
                       
                      </tbody>
                      </div>
            {/* <div className="row">

              <Col md={4} lg={4} mb={3}>
                <FormControl>
                  <FormLabel id="propesed_revision" sx={{ fontWeight: "bold" }}>
                    {`${t("REV_LAYOUT_AREA_PROPOSED_REVISION")}`}
                     <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <OutlinedInput
                    type="text"
                    aria-labelledby="propesed_revision"
                    placeholder=""
                    className="Inputcontrol"
                    {...register("areaProposedRevision")}
                    onChange={(e) => setProposedAreaRevision(e.target.value)}
                    value={proposedAreaRevisionVal}
                  />
                </FormControl>
                </Col>
        
              <Col md={4} lg={4} mb={3}>
                <FormControl>
                  <FormLabel id="commercial_area" sx={{ fontWeight: "bold" }}>
                    {`${t("REV_LAYOUT_AREA_COMMERCIAL")}`} <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <OutlinedInput
                    type="text"
                    aria-aria-labelledby="commercial_area"
                    placeholder=""
                    className="Inputcontrol"
                    {...register("areaCommercial")}
                    onChange={(e) => setAreaCommercial(e.target.value)}
                    value={areaCommercialVal}
                  />
                </FormControl>
              </Col>
              <Col md={4} lg={4} mb={3}>
                <FormControl>
                  <FormLabel id="residential_area" sx={{ fontWeight: "bold" }}>
                    {`${t("REV_LAYOUT_AREA_RESIDENTIAL")}`} <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <OutlinedInput
                    type="text"
                    aria-aria-labelledby="residential_area"
                    placeholder=""
                    className="Inputcontrol"
                    {...register("areaResidential")}
                    onChange={(e) => setAreaResidential(e.target.value)}
                    value={areaResidentialVal}
                  />
                </FormControl>
              </Col>
            </div> */}

            <br></br>
              <div className="col col-12">
                                    <h2>
                                      {`${t("REV_LAYOUT_ANY_OTHER_REMARK")}`}<span style={{ color: "red" }}>*</span>&nbsp; &nbsp;&nbsp;
                                    </h2>

                                    <label htmlFor="anyOtherFeature">
                                      <input {...register("anyOtherFeature")} type="radio" value="Y" id="anyOtherFeature" />
                                      &nbsp; Yes &nbsp;&nbsp;
                                    </label>
                                    <label htmlFor="anyOtherFeature">
                                      <input {...register("anyOtherFeature")} type="radio" value="N" id="anyOtherFeature" />
                                      &nbsp; No &nbsp;&nbsp;
                                    </label>
                                     {watch("anyOtherFeature") === "Y" && (
                                      <div className="row ">
                                        <Col md={4} lg={4}>
                  <FormControl>
                    {/* <FormLabel id="any_remarks">Any other remark</FormLabel> */}
                    <textarea
                      className="form-control"
                      aria-labelledby="any_remarks"
                      {...register("anyOtherRemarks")}
                      onChange={(e) => setAnyOtherRemarkTextVal(e.target.value)}
                      value={anyOtherRemarkTextVal}
                    ></textarea>
                  </FormControl>
                </Col>
                                      </div>
                                    )}
                                    </div>
            {/* <div className="row-12">
              <Col md={4} lg={4}>
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label" sx={{ fontWeight: "bold" }}>
                    {`${t("REV_LAYOUT_ANY_OTHER_REMARK")}`} <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                    <FormControlLabel
                      value="Y"
                      control={<Radio />}
                      {...register("anyOtherFeature")}
                      label="Yes"
                      checked={anyOtherRemarkVal == "Y" ? true : false}
                      onChange={(e) => setAnyOtherRemark(e.target.value)}
                    />
                    <FormControlLabel
                      value="N"
                      control={<Radio />}
                      {...register("anyOtherFeature")}
                      label="No"
                      checked={anyOtherRemarkVal == "N" ? true : false}
                      onChange={(e) => setAnyOtherRemark(e.target.value)}
                    />
                  </RadioGroup>
                </FormControl>
              </Col>
              {watch("anyOtherFeature") == "Y" || anyOtherRemarkVal == "Y" ? (
                <Col md={4} lg={4}>
                  <FormControl>
                   
                    <textarea
                      className="form-control"
                      aria-labelledby="any_remarks"
                      {...register("anyOtherRemarks")}
                      onChange={(e) => setAnyOtherRemarkTextVal(e.target.value)}
                      value={anyOtherRemarkTextVal}
                    ></textarea>
                  </FormControl>
                </Col>
              ) : (
                <p></p>
              )}
            </div> */}
          </div>
          <div className=" col-12 m-auto">
            <div className="card">
              <div className="table table-bordered table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "center" }}>{`${t("REV_LAYOUT_S_No")}`}
                        {/* Sr.No */}
                        </th>
                      <th style={{ textAlign: "center" }}>{`${t("REV_LAYOUT_FIELD_NAME")}`}
                      {/* Field Name */}
                      </th>
                      <th style={{ textAlign: "center" }}>{`${t("REV_LAYOUT_UPLOAD_DOC")}`}
                      {/* Upload Documents */}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td scope="row">1</td>
                      <td>
                        {`${t("REV_LAYOUT_REASON_REVISION_LAYOUT_PLAN")}`}
                        <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <label for="reasonRevisionLayoutPlanDoc" title="Upload Document">
                          <FileUpload style={{ cursor: "pointer" }} color="primary" />
                        </label>
                        <input
                          id="reasonRevisionLayoutPlanDoc"
                          type="file"
                          style={{ display: "none" }}
                          accept="application/pdf/jpeg/png"
                          className="form-control"
                          onChange={(e) => getDocumentData(e?.target?.files[0], "reasonRevisionLayoutPlanDoc")}
                        />
                        <span>
                          {/* {watch("reasonRevisionLayoutPlanDoc") && (
                            <a onClick={() => getDocShareholding(watch("reasonRevisionLayoutPlanDoc"), setLoader)} className="btn btn-sm ">
                              <VisibilityIcon color="info" className="icon" />
                            </a>
                          )} */}
                          {fileStoreId?.reasonRevisionLayoutPlanDoc ? (
                            <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.reasonRevisionLayoutPlanDoc)}>
                              {" "}
                            </VisibilityIcon>
                          ) : (
                            ""
                          )}
                          {applicantId && !fileStoreId?.reasonRevisionLayoutPlanDoc && (
                            <div className="btn btn-sm col-md-4">
                              <IconButton onClick={() => viewDocument(reasonRevisionLayoutDoc)}>
                                <VisibilityIcon color="info" className="icon" />
                              </IconButton>
                            </div>
                          )}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td scope="row">2</td>
                      <td>
                        {`${t("REV_LAYOUT_COPY_EARLIER_LAYOUT_PLAN")}`}
                        <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <label for="earlierApprovedlayoutPlan" title="Upload Document">
                          <FileUpload style={{ cursor: "pointer" }} color="primary" />
                        </label>
                        <input
                          id="earlierApprovedlayoutPlan"
                          type="file"
                          style={{ display: "none" }}
                          accept="application/pdf/jpeg/png"
                          className="form-control"
                          onChange={(e) => getDocumentData(e?.target?.files[0], "earlierApprovedlayoutPlan")}
                        />
                        <span>
                          {/* {watch("earlierApprovedlayoutPlan") && (
                            <a onClick={() => getDocShareholding(watch("earlierApprovedlayoutPlan"), setLoader)} className="btn btn-sm ">
                              <VisibilityIcon color="info" className="icon" />
                            </a>
                          )} */}
                          {fileStoreId?.earlierApprovedlayoutPlan ? (
                            <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.earlierApprovedlayoutPlan)}>
                              {" "}
                            </VisibilityIcon>
                          ) : (
                            ""
                          )}
                          {applicantId && !fileStoreId?.earlierApprovedlayoutPlan && (
                            <div className="btn btn-sm col-md-4">
                              <IconButton onClick={() => viewDocument(earlierApprovedlayoutDoc)}>
                                <VisibilityIcon color="info" className="icon" />
                              </IconButton>
                            </div>
                          )}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td scope="row">3</td>
                      <td>
                        {`${t("REV_LAYOUT_COPY_PROPOSED_LAYOUT_PLAN")}`}
                        <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <label for="copyProposedlayoutPlan" title="Upload Document">
                          <FileUpload style={{ cursor: "pointer" }} color="primary" />
                        </label>
                        <input
                          id="copyProposedlayoutPlan"
                          type="file"
                          style={{ display: "none" }}
                          accept="application/pdf/jpeg/png"
                          className="form-control"
                          onChange={(e) => getDocumentData(e?.target?.files[0], "copyProposedlayoutPlan")}
                        ></input>
                        <span>
                          {/* {watch("copyProposedlayoutPlan") && (
                            <a onClick={() => getDocShareholding(watch("copyProposedlayoutPlan"), setLoader)} className="btn btn-sm ">
                              <VisibilityIcon color="info" className="icon" />
                            </a>
                          )} */}
                          {fileStoreId?.copyProposedlayoutPlan ? (
                            <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.copyProposedlayoutPlan)}>
                              {" "}
                            </VisibilityIcon>
                          ) : (
                            ""
                          )}
                          {applicantId && !fileStoreId?.copyProposedlayoutPlan && (
                            <div className="btn btn-sm col-md-4">
                              <IconButton onClick={() => viewDocument(copyProposedlayoutDoc)}>
                                <VisibilityIcon color="info" className="icon" />
                              </IconButton>
                            </div>
                          )}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td scope="row">4</td>
                      <td>
                        {`${t("REV_LAYOUT_STATUS_CREATION_THIRD_PARTY_AFFIDAVIT")}`}
                        <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <label for="statusCreationAffidavitDoc" title="Upload Document">
                          <FileUpload style={{ cursor: "pointer" }} color="primary" />
                        </label>
                        <input
                          id="statusCreationAffidavitDoc"
                          type="file"
                          style={{ display: "none" }}
                          accept="application/pdf/jpeg/png"
                          className="form-control"
                          onChange={(e) => getDocumentData(e?.target?.files[0], "statusCreationAffidavitDoc")}
                        ></input>
                        <span>
                          {/* {watch("statusCreationAffidavitDoc") && (
                            <a onClick={() => getDocShareholding(watch("statusCreationAffidavitDoc"), setLoader)} className="btn btn-sm ">
                              <VisibilityIcon color="info" className="icon" />
                            </a>
                          )} */}

                          {fileStoreId?.statusCreationAffidavitDoc ? (
                            <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.statusCreationAffidavitDoc)}>
                              {" "}
                            </VisibilityIcon>
                          ) : (
                            ""
                          )}
                          {applicantId && !fileStoreId?.statusCreationAffidavitDoc && (
                            <div className="btn btn-sm col-md-4">
                              <IconButton onClick={() => viewDocument(statusCreationAffidavitDocVal)}>
                                <VisibilityIcon color="info" className="icon" />
                              </IconButton>
                            </div>
                          )}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td scope="row">5</td>
                      <td>
                        {`${t("REV_LAYOUT_BOARD_RESOLUTION_AUTHORISED_SIGNATORY")}`} <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <label for="boardResolutionAuthSignatoryDoc" title="Upload Document">
                          <FileUpload style={{ cursor: "pointer" }} color="primary" />
                        </label>
                        <input
                          id="boardResolutionAuthSignatoryDoc"
                          type="file"
                          style={{ display: "none" }}
                          accept="application/pdf/jpeg/png"
                          className="form-control"
                          onChange={(e) => getDocumentData(e?.target?.files[0], "boardResolutionAuthSignatoryDoc")}
                        ></input>
                        <span>
                          {/* {watch("boardResolutionAuthSignatoryDoc") && (
                            <a onClick={() => getDocShareholding(watch("boardResolutionAuthSignatoryDoc"), setLoader)} className="btn btn-sm ">
                              <VisibilityIcon color="info" className="icon" />
                            </a>
                          )} */}
                          {fileStoreId?.boardResolutionAuthSignatoryDoc ? (
                            <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.boardResolutionAuthSignatoryDoc)}>
                              {" "}
                            </VisibilityIcon>
                          ) : (
                            ""
                          )}
                          {applicantId && !fileStoreId?.boardResolutionAuthSignatoryDoc && (
                            <div className="btn btn-sm col-md-4">
                              <IconButton onClick={() => viewDocument(boardResolutionAuthSignatoryDocVal)}>
                                <VisibilityIcon color="info" className="icon" />
                              </IconButton>
                            </div>
                          )}
                        </span>
                      </td>
                    </tr>
                    {/* <tr>
                      <td scope="row">6</td>
                      <td>
                        {`${t("REV_LAYOUT_ANY_OTHER")}`}
                        <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <label for="anyOther" title="Upload Document">
                          <FileUpload style={{ cursor: "pointer" }} color="primary" />
                        </label>
                        <input
                          id="anyOther"
                          type="file"
                          style={{ display: "none" }}
                          accept="application/pdf/jpeg/png"
                          className="form-control"
                          onChange={(e) => getDocumentData(e?.target?.files[0], "anyOther")}
                        ></input>
                        <span>
                          {/* {watch("anyOther") && (
                            <a onClick={() => getDocShareholding(watch("anyOther"), setLoader)} className="btn btn-sm ">
                              <VisibilityIcon color="info" className="icon" />
                            </a>
                          )} */}
                    {/* {fileStoreId?.anyOther ? (
                            <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.anyOther)}>
                              {" "}
                            </VisibilityIcon>
                          ) : (
                            ""
                          )}
                          {applicantId && !fileStoreId?.anyOther && (
                            <div className="btn btn-sm col-md-4">
                              <IconButton onClick={() => viewDocument(anyOtherDocVal)}>
                                <VisibilityIcon color="info" className="icon" />
                              </IconButton>
                            </div>
                          )}
                        </span>
                      </td>
                    </tr> */}
                  </tbody>
                </table>
              </div>
            </div>
  <div class="row">
                <div class="col-sm-12 text-right">
                  <button type="submit" onClick={handleClickOpen1}  class="btn btn-primary btn-md center-block">
                    Submit
                  </button>
                </div>
                <div class="col-sm-12 text-right">
                  <button id="btnSearch" class="btn btn-primary btn-md center-block" style={{ marginTop: "-63px", marginRight: "97px" }}>
                   Cancel
                  </button>
                </div>
              </div>
            {/* <div className="col-sm-12 text-right">
              <Button variant="contained" className="btn btn-primary " type="submit">
                Submit
              </Button>
            </div> */}
          </div>
        </div>
      </form>

      <Modal show={showAuthuser} onHide={handleCloseAuthuser} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>{`${t("REV_LAYOUT_ADD_AUTHORIZED_USER")}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="text1">
            <Row>
              <Col md={3} xxl lg="3">
                <FormControl>
                  <label htmlFor="licenseNoModal" className="text">{`${t("REV_LAYOUT_LICENCE_NO")}`}
                    <span className="text-danger font-weight-bold">*</span>
                  </label>
                  <OutlinedInput
                    type="text"
                    placeholder=""
                    className="Inputcontrol"
                    name="licenseNoModal"
                    onChange={(e) => setLicenseNoModal(e.target.value)}
                  />
                </FormControl>
              </Col>
              <Col md={3} xxl lg="3">
                <FormControl>
                  <label htmlFor="areaModal" className="text">
                    {`${t("REV_LAYOUT_AREA")}`} <span className="text-danger font-weight-bold">*</span>
                  </label>
                  <OutlinedInput
                    type="text"
                    placeholder=""
                    className="Inputcontrol"
                    name="areaModal"
                    onChange={(e) => setAreaModal(e.target.value)}
                  />
                </FormControl>
              </Col>
            </Row>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button class="btn btn-primary btn-md center-block" onClick={handleSubmitExistingArea}>
            Submit
          </Button>
          <Button class="btn btn-primary btn-md center-block" onClick={handleCloseAuthuser}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

        <Dialog open={open1} onClose={handleClose1} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Approval of Revised Layout Plan Submission</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p>
              Your Approval of Revised Layout Plan is submitted successfully{" "}
              <span>
                <CheckCircleOutlineIcon style={{ color: "blue", variant: "filled" }} />
              </span>
            </p>
            <p>
              Please Note down your Application Number <span style={{ padding: "5px", color: "blue" }}>{applicationNumber}</span> for further
              assistance
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose1} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>

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
    </div>
    </React.Fragment>
  );
}

export default LayoutPlanClu;
