import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useForm } from "react-hook-form";
import { Card } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import { styled } from "@mui/material/styles";
import { useStyles } from "../../css/personalInfoChild.style";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Collapse from "react-bootstrap/Collapse";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import FileDownloadIcon from "@mui/icons-material/FileDownloadIcon";
import { useTranslation } from "react-i18next";
import OutlinedInput from "@mui/material/OutlinedInput";

// import AddIcon from "@mui/icons-material/Add";
// import RemoveIcon from "@mui/icons-material/Remove";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ModalChild from "../../Remarks/ModalChild";
// import Collapse from "react-bootstrap/Collapse";
// import { useStyles } from "../../css/personalInfoChild.style";
// import "../../css/personalInfoChild.style.js";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getDocShareholding } from "../../ScrutinyDevelopment/docview.helper";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
// import FormControl from "@mui/material/FormControl";
// import { getDocShareholding } from "../../ScrutinyDevelopment/docview.helper";

function LayoutPlanClu(props) {


  const apiData = props.apiResponse;
  const dataIcons = props.dataForIcons;
  const applicationStatus = props.applicationStatus;
  // const apiData = props.apiData;
  console.log("apiDataLayout", apiData);

  const { t } = useTranslation();
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  // const { register, handleSubmit } = useForm(); 
  const layoutPlan = (data) => console.log(data);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm({});

  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };
  const [open2, setOpen2] = useState(false);

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
  const classes = useStyles();
  const currentRemarks = (data) => {
    props.showTable({ data: data.data });
  };

  const [smShow, setSmShow] = useState(false);
  const [labelValue, setLabelValue] = useState("");
  const Colors = {
    Conditional: "#2874A6",
    approved: "#09cb3d",
    disapproved: "#ff0000",
    info: "#FFB602"
  }
  useEffect(() => {
    if (apiData) {
      setValue("licenseNo", apiData?.licenseNo);
      setValue("selectType", apiData?.additionalDetails?.selectType);
      setValue("affidavitFixedChargesForAdm", apiData?.additionalDetails?.affidavitFixedChargesForAdm);
      setValue("affidavitForLicencedArea", apiData?.additionalDetails?.affidavitForLicencedArea);
      setValue("affidavitForLicencedArea", apiData?.additionalDetails?.affidavitOfAdmCharges);
      setValue("amount", apiData?.additionalDetails?.amount);
      setValue("anyOtherDoc", apiData?.additionalDetails?.anyOtherDoc);
      setValue("areaInAcres", apiData?.additionalDetails?.areaInAcres);
      setValue("boardResolutionDoc", apiData?.additionalDetails?.boardResolutionDoc);
      setValue("changeOfDeveloper", apiData?.additionalDetails?.changeOfDeveloper);
      setValue("colonizerSeekingTransferLicence", apiData?.additionalDetails?.colonizerSeekingTransferLicence);
      setValue("consentLetterDoc", apiData?.additionalDetails?.consentLetterDoc);
      setValue("justificationForRequest", apiData?.additionalDetails?.justificationForRequest);
      setValue("licenceTransferredFromLandOwn", apiData?.additionalDetails?.licenceTransferredFromLandOwn);
    }
  }, [apiData]); const handlemodaldData = (data) => {

    setSmShow(false);
    console.log("here", openedModal, data);
    if (openedModal && data) {
      setFieldIconColors({ ...fieldIconColors, [openedModal]: data.data.isApproved ? Colors.approved : Colors.disapproved });
    }
    setOpennedModal("");
    setLabelValue("");
  };

  const [selectedFieldData, setSelectedFieldData] = useState();
  const [fieldValue, setFieldValue] = useState("");
  const [openedModal, setOpennedModal] = useState("");
  const [fieldIconColors, setFieldIconColors] = useState({
    developer: Colors.info,
    licenseNo: Colors.info,

    selectLicence: Colors.info,
    validUpto: Colors.info,
    renewalRequiredUpto: Colors.info,
    periodOfRenewal: Colors.info,
    colonizerName: Colors.info,
    colonyType: Colors.info,
    areaAcres: Colors.info,
    sectorNo: Colors.info,
    revenueEstate: Colors.info,
    developmentPlan: Colors.info,
    tehsil: Colors.info,
    district: Colors.info,
    agreementDoc: Colors.info,
    anyOtherDoc: Colors.info,

    affidavitForLicencedArea: Colors.info,
    colonizerSeekingTransferLicence: Colors.info,
    consentLetterDoc: Colors.info,
    boardResolutionDoc: Colors.info,
    noObjectionCertificate: Colors.info,
    technicalAndFinancialCapacityDoc: Colors.info,
    justificationForRequest: Colors.info,
    thirdPartyCreationStatus: Colors.info,
    registrationProjectRera: Colors.info,
    anyOtherDoc: Colors.info,
    lciSignedBy: Colors.info,
    lciNotSigned: Colors.info,
    parmanentAddress: Colors.info,
    addressForCommunication: Colors.info,
    authPerson: Colors.info,
    emailForCommunication: Colors.info,
  });

  const fieldIdList = [
    { label: "Licence No", key: "licenseNo" },

    { label: "selectLicence", key: "selectLicence" },
    { label: "selectLicence", key: "selectLicence" },
    { label: "Valid Upto", key: "validUpto" },
    { label: "Renewal required upto", key: "renewalRequiredUpto" },
    { label: "Period of renewal(In Months)", key: "periodOfRenewal" },
    { label: "Name of Colonizer", key: "colonizerName" },
    { label: "Type of Colony", key: "colonyType" },
    { label: "Area in Acres", key: "areaAcres" },
    { label: "Sector No", key: "sectorNo" },
    { label: "Revenue estate", key: "revenueEstate" },
    { label: "Development Plan", key: "developmentPlan" },
    { label: "Tehsil", key: "tehsil" },
    { label: "District", key: "district" },
    { label: "Standard drawing designs", key: "agreementDoc" },
    { label: "Any other Document", key: "anyOtherDoc" },

    { label: "Affidavit regarding the creation of 3rd party right on the licenced area", key: "affidavitForLicencedArea" },
    { label: "The colonizer seeking transfer of whole license/part license shall submit self-certification along with a certificate of the Chartered Accountant that a 15% profit margin is not exceeded from the project cost at the time of submission of application for transfer of license", key: "colonizerSeekingTransferLicence" },
    { label: "A consent letter from the ‘new entity for the proposed change along with justification", key: "consentLetterDoc" },
    { label: "Board resolution of authorized signatory", key: "boardResolutionDoc" },
    { label: "No objection certificate from the existing ‘Developer, filed through its authorized signatory, specifically designated for the purpose; as well as from the ‘land owner licensees’, in person (not through GPA/SPA assignees), to the proposed change/assignment.", key: "noObjectionCertificate" },
    { label: "Documents about the Technical and Financial Capacity of the ‘new entity’ proposed to be inducted as a ‘Developer’ or ‘shareholder(s)’ as per prescribed policy parameters for grant of a license", key: "technicalAndFinancialCapacityDoc" },
    { label: "Justification for request", key: "justificationForRequest" },
    { label: "The status regarding the creation of third-party rights in the colony. In case no third-party rights are claimed to have been created in the colony, an affidavit to the said effect be also submitted by the existing developer", key: "thirdPartyCreationStatus" },
    { label: "Status regarding registration of project in RERA", key: "registrationProjectRera" },
    { label: "Any Other Document", key: "anyOtherDoc" },
    { label: "Email ID for communication", key: "emailForCommunication" },
    { label: "Email ID for communication", key: "emailForCommunication" },
  ];


  const handleselects = (event) => {
    const getu = event.target.value;

    setSelects(getu);
  };
  console.log("apiData", apiData);
  /////////////////////////////////////////////
  const getColorofFieldIcon = () => {
    let tempFieldColorState = fieldIconColors;
    fieldIdList.forEach((item) => {
      if (dataIcons !== null && dataIcons !== undefined) {
        console.log("color method called");
        const fieldPresent = dataIcons.egScrutiny.filter((ele) => ele.fieldIdL === item.label);
        console.log("filteration value111", fieldPresent, fieldPresent[0]?.isApproved);
        if (fieldPresent && fieldPresent.length) {
          console.log("filteration value111", fieldPresent, fieldPresent[0]?.isApproved);
          tempFieldColorState = {
            ...tempFieldColorState,
            [item.key]:
              fieldPresent[0].isApproved === "In Order"
                ? Colors.approved
                : fieldPresent[0].isApproved === "Not In Order"
                  ? Colors.disapproved
                  : fieldPresent[0].isApproved === "Conditional"
                    ? Colors.Conditional
                    : Colors.info,
          };
        }
      }
    });

    setFieldIconColors(tempFieldColorState);
  };

  useEffect(() => {
    getColorofFieldIcon();
    console.log("repeating1...");
  }, [dataIcons]);

  useEffect(() => {
    if (labelValue) {
      const fieldPresent = dataIcons.egScrutiny.filter((ele) => ele.fieldIdL === labelValue);
      setSelectedFieldData(fieldPresent[0]);
    } else {
      setSelectedFieldData(null);
    }
  }, [labelValue]);

  return (
    <form onSubmit={handleSubmit(layoutPlan)}>
      <div
        className="collapse-header"
        onClick={() => setOpen2(!open2)}
        aria-controls="example-collapse-text"
        aria-expanded={open2}
        style={{
          background: "#f1f1f1",
          padding: "0.25rem 1.25rem",
          borderRadius: "0.25rem",
          fontWeight: "600",
          display: "flex",
          cursor: "pointer",
          color: "#817f7f",
          justifyContent: "space-between",
          alignContent: "center",
        }}
      >
        <span style={{ color: "#817f7f" }} className="">
          APPROVAL OF REVISED LAYOUT PLAN OF LICENSE
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
          {/* <Card style={{ width: "126%", border: "5px solid #1266af" }}>
            <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>APPROVAL OF REVISED LAYOUT PLAN OF LICENSE</h4>
            <div className="card">
              <Form>
                <Row>
                  <Col className="col-4">
                    <Form.Group controlId="formGridCase">
                      <Form.Label>
                        License No . <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <input type="number" placeholder="" className="form-control" {...register("licenseNo")} />
                    </Form.Group>
                  </Col>
                  <Col className="col-4">
                    <Form.Group controlId="formGridState">
                      <Form.Label>
                        Existing Area <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <input type="text" placeholder="" className="form-control" {...register("existingArea")} />
                    </Form.Group>
                  </Col>
                  <Col className="col-4">
                    <Form.Group controlId="formGridState">
                      <Form.Label>
                        Area of which planning is being changed <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <input type="text" placeholder="" className="form-control" {...register("areaPlanning")} />
                    </Form.Group>
                  </Col>
                  <Col className="col-4">
                    <fieldset>
                      <Form.Group as={Row} className="mb-4">
                        <Form.Label>
                          Any other feature
                          <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                        <Row>
                          <Col className="col-3">
                            <Form.Check
                              type="radio"
                              value="true"
                              label="Yes"
                              name="Anyotherfeature"
                              id="Anyotherfeature"

                              {...register(" Anyotherfeature")}
                              onChange={(e) => handleselects(e)}
                            />

                            <Form.Check
                              type="radio"

                              value="false"
                              label="No"
                              name="Anyotherfeature"
                              id="Anyotherfeature"
                              {...register("Anyotherfeature")}
                              onChange={(e) => handleselects(e)}
                            />
                          </Col>
                        </Row>


                      </Form.Group>

                    </fieldset>
                  </Col>
                  <Col className="col-4">
                    <Form.Group controlId="formGridState">
                      <Form.Label>
                        Amount <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <input type="text" required={true} disabled={true} placeholder="" className="form-control" {...register("amount")} />
                    </Form.Group>
                  </Col>
                  <Col className="col-4">
                    <Button variant="success" className="col my-4" type="submit" aria-label="right-end">
                      Pay
                    </Button>
                  </Col>
                </Row>
              </Form>
              <div className=" col-12 m-auto">
                <div className="card">
                  <div className="table table-bordered table-responsive">
                    <thead>
                      <tr>
                        <th style={{ textAlign: "center" }}>Sr.No</th>
                        <th style={{ textAlign: "center" }}>Field Name</th>
                        <th style={{ textAlign: "center" }}>Upload Documents</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>
                          Reasons for revision in the layout plan <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                          <input type="file" placeholder="" className="form-control" {...register("reasonRevision")}></input>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">2</th>
                        <td>
                          {" "}
                          Copy of earlier approved layout plan <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                          <input type="file" placeholder="" className="form-control" {...register("earlierApprovedlayoutPlan")}></input>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">3</th>
                        <td>
                          {" "}
                          Any Other <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                          <input type="file" placeholder="" className="form-control" {...register("anyOther")}></input>
                        </td>
                      </tr>
                    </tbody>

                  </div>
                </div>

                <Row className="justify-content-end">
                  <Button variant="outline-primary" className="col-md-2 my-2 mx-2" type="submit" aria-label="right-end">
                    Save as Draft
                  </Button>
                  <Button variant="outline-primary" className="col-md-2 my-2 mx-2" type="submit" aria-label="right-end">
                    Submit
                  </Button>
                </Row>
              </div>
            </div>

          </Card> */}
          <div className="card">
            {/* <h4 className="my-2">
              <b>APPROVAL OF REVISED LAYOUT PLAN OF LICENSE</b>
            </h4> */}
            <div className="card">
              <div className="row gy-3">
                {/* <FormLabel id="lic_no" sx={{ fontWeight: "bold" }}>
                  {`${t("REV_LAYOUT_LICENSE_NO")}`} <span style={{ color: "red" }}>*</span>
                </FormLabel> */}
                {/* <SearchLicenceComp
                watch={watch}
                register={register}
                control={control}
                setLoader={setLoader}
                errors={errors}
                setValue={setValue}
                resetField={resetField}
              /> */}
                <div>
                  <div className="row gy-3">
                    <div className="col col-3">
                      <h2>
                        Licence No.<span style={{ color: "red" }}>*</span>
                      </h2>
                      <div style={{ display: "flex", placeItems: "center" }}>
                        <input type="text" className="form-control" placeholder="LC_XXXXX" {...register("licenseNo")} disabled />
                        <div>
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.licenseNo,
                            }}
                            onClick={() => {
                              setOpennedModal("licenseNo");
                              setLabelValue("Licence No"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(apiData !== null ? apiData.licenseNo : null);
                            }}
                          ></ReportProblemIcon>
                          <ModalChild
                            labelmodal={labelValue}
                            passmodalData={handlemodaldData}
                            displaymodal={smShow}
                            onClose={() => setSmShow(false)}
                            selectedFieldData={selectedFieldData}
                            fieldValue={fieldValue}
                            remarksUpdate={currentRemarks}
                            applicationStatus={applicationStatus}
                          ></ModalChild>
                        </div>
                      </div>

                    </div>

                    <div className="col col-3 ">
                      <h2>
                        Select Licence<span style={{ color: "red" }}>*</span>
                      </h2>
                      <div style={{ display: "flex", placeItems: "center" }}>
                        <input type="text" className="form-control" placeholder="" {...register("selectLicence")} disabled />
                        <div>
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.selectLicence,
                            }}
                            onClick={() => {
                              setOpennedModal("selectLicence");
                              setLabelValue("Select Licence"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(apiData !== null ? apiData.selectLicence : null);
                            }}
                          ></ReportProblemIcon>

                        </div>
                      </div>


                    </div>
                    {/* )} */}
                  </div>

                  {/* {showField.other && ( */}
                  <div className="row gy-3 mt-3">
                    <div className="col col-3 ">
                      <FormControl>
                        <h2>
                          Valid Upto <span style={{ color: "red" }}>*</span>
                        </h2>


                      </FormControl>
                      <div style={{ display: "flex", placeItems: "center" }}>
                        <input type="date" className="form-control" placeholder="" {...register("validUpto")} disabled />
                        <div>
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.validUpto,
                            }}
                            onClick={() => {
                              setOpennedModal("validUpto");
                              setLabelValue("Valid Upto"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(apiData !== null ? apiData.selectLicence : null);
                            }}
                          ></ReportProblemIcon>

                        </div>
                      </div>

                      {/* <h3 className="error-message" style={{ color: "red" }}>
              {errors?.validUpto && errors?.validUpto?.message}
            </h3> */}
                    </div>
                    <div className="col col-3 ">
                      <FormControl>
                        <h2>
                          Renewal required upto <span style={{ color: "red" }}>*</span>
                        </h2>

                      </FormControl>
                      <div style={{ display: "flex", placeItems: "center" }}>
                        <input type="text" className="form-control" placeholder="" {...register("renewalRequiredUpto")} disabled />
                        <div>
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.renewalRequiredUpto,
                            }}
                            onClick={() => {
                              setOpennedModal("renewalRequiredUpto");
                              setLabelValue("Renewal required upto"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(apiData !== null ? apiData.selectLicence : null);
                            }}
                          ></ReportProblemIcon>

                        </div>
                      </div>
                      {/* <h3 className="error-message" style={{ color: "red" }}>
              {errors?.renewalRequiredUpto && errors?.renewalRequiredUpto?.message}
            </h3> */}
                    </div>
                    <div className="col col-3 ">
                      <FormControl>
                        <h2>Period of renewal(In Months)</h2>
                      </FormControl>
                      <div style={{ display: "flex", placeItems: "center" }}>
                        <input type="text" {...register("periodOfRenewal")} className="form-control" disabled />
                        <div>
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.periodOfRenewal,
                            }}
                            onClick={() => {
                              setOpennedModal("periodOfRenewal");
                              setLabelValue("Period of renewal(In Months)"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(apiData !== null ? apiData.periodOfRenewal : null);
                            }}
                          ></ReportProblemIcon>

                        </div>
                      </div>

                    </div>
                    <div className="col col-3 ">
                      <FormControl>
                        <h2>
                          Name of Colonizer <span style={{ color: "red" }}>*</span>
                        </h2>

                      </FormControl>
                      <div style={{ display: "flex", placeItems: "center" }}>
                        <input type="text" className="form-control" placeholder="" {...register("colonizerName")} disabled />
                        <div>
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.colonizerName,
                            }}
                            onClick={() => {
                              setOpennedModal("colonizerName");
                              setLabelValue("Name of Colonizer"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(apiData !== null ? apiData.colonizerName : null);
                            }}
                          ></ReportProblemIcon>

                        </div>
                      </div>

                      {/* <h3 className="error-message" style={{ color: "red" }}>
              {errors?.colonizerName && errors?.colonizerName?.message}
            </h3> */}
                    </div>
                  </div>
                  {/* )} */}

                  {/* {showField.other && ( */}
                  <div className="row gy-3 mt-3">
                    <div className="col col-3 ">
                      <FormControl>
                        <h2>
                          Type of Colony
                          <span style={{ color: "red" }}>*</span>
                        </h2>


                      </FormControl>
                      <div style={{ display: "flex", placeItems: "center" }}>
                        <input type="text" className="form-control" placeholder="" {...register("colonyType")} disabled />
                        <div>
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.colonyType,
                            }}
                            onClick={() => {
                              setOpennedModal("colonyType");
                              setLabelValue("Type of Colony"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(apiData !== null ? apiData.colonyType : null);
                            }}
                          ></ReportProblemIcon>

                        </div>
                      </div>



                      {/* <h3 className="error-message" style={{ color: "red" }}>
              {errors?.colonyType && errors?.colonyType?.message}
            </h3> */}
                    </div>

                    <div className="col col-3 ">
                      <FormControl>
                        <h2>
                          Area in Acres
                          <span style={{ color: "red" }}>*</span>
                        </h2>
                      </FormControl>
                      <div style={{ display: "flex", placeItems: "center" }}>
                        <input type="text" className="form-control" placeholder="" {...register("areaAcres")} disabled />
                        <div>
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.areaAcres,
                            }}
                            onClick={() => {
                              setOpennedModal("areaAcres");
                              setLabelValue("Area in Acres"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(apiData !== null ? apiData.areaAcres : null);
                            }}
                          ></ReportProblemIcon>

                        </div>
                      </div>

                      {/* <h3 className="error-message" style={{ color: "red" }}>
              {errors?.areaAcres && errors?.areaAcres?.message}
            </h3> */}
                    </div>

                    <div className="col col-3 ">
                      <FormControl>
                        <h2>
                          Sector No. <span style={{ color: "red" }}>*</span>
                        </h2>


                      </FormControl>
                      <div style={{ display: "flex", placeItems: "center" }}>
                        <input type="text" className="form-control" placeholder="" {...register("sectorNo")} disabled />
                        <div>
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.sectorNo,
                            }}
                            onClick={() => {
                              setOpennedModal("sectorNo");
                              setLabelValue("Sector No"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(apiData !== null ? apiData.sectorNo : null);
                            }}
                          ></ReportProblemIcon>

                        </div>
                      </div>

                      {/* <h3 className="error-message" style={{ color: "red" }}>
              {errors?.sectorNo && errors?.sectorNo?.message}
            </h3> */}
                    </div>
                    <div className="col col-3 ">
                      <FormControl>
                        <h2>Revenue estate</h2>

                      </FormControl>
                      <div style={{ display: "flex", placeItems: "center" }}>
                        <input type="text" className="form-control" placeholder="" {...register("revenueEstate")} disabled />
                        <div>
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.revenueEstate,
                            }}
                            onClick={() => {
                              setOpennedModal("selectLicence");
                              setLabelValue("Revenue estate"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(apiData !== null ? apiData.revenueEstate : null);
                            }}
                          ></ReportProblemIcon>

                        </div>
                      </div>

                      {/* <h3 className="error-message" style={{ color: "red" }}>
              {errors?.revenueEstate && errors?.revenueEstate?.message}
            </h3> */}
                    </div>
                    <div className="col col-3 ">
                      Development Plan

                      <div style={{ display: "flex", placeItems: "center" }}>
                        <input type="text" className="form-control" placeholder="" {...register("developmentPlan")} disabled />
                        <div>
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.developmentPlan,
                            }}
                            onClick={() => {
                              setOpennedModal("developmentPlan");
                              setLabelValue("Development Plan"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(apiData !== null ? apiData.developmentPlan : null);
                            }}
                          ></ReportProblemIcon>

                        </div>
                      </div>

                    </div>

                  </div>
                  {/* )} */}

                  <div className="row gy-3 mt-3">
                    <div className="col col-3 ">
                      <FormControl>
                        <h2>Tehsil</h2>


                      </FormControl>
                      <div style={{ display: "flex", placeItems: "center" }}>
                        <input type="text" className="form-control" placeholder="" {...register("tehsil")} disabled />
                        <div>
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.selectLicence,
                            }}
                            onClick={() => {
                              setOpennedModal("selectLicence");
                              setLabelValue("Select Licence"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(apiData !== null ? apiData.selectLicence : null);
                            }}
                          ></ReportProblemIcon>

                        </div>
                      </div>

                    </div>
                    <div className="col col-3 ">
                      <FormControl>
                        <h2>District</h2>

                      </FormControl>
                      <div style={{ display: "flex", placeItems: "center" }}>
                        <input type="text" className="form-control" placeholder="" {...register("district")} disabled />
                        <div>
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.tehsil,
                            }}
                            onClick={() => {
                              setOpennedModal("tehsil");
                              setLabelValue("Tehsil"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(apiData !== null ? apiData.tehsil : null);
                            }}
                          ></ReportProblemIcon>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                      {`${t("REV_LAYOUT_EXISTING_AREA")}`} <span style={{ color: "red" }}>*</span>
                    </FormLabel>
                    <OutlinedInput
                      aria-labelledby="existing_area"
                      type="text"
                      placeholder=""
                      className="Inputcontrol"
                      {...register("existingArea")}
                    // onChange={(e) => setExistingArea(e.target.value)}
                    // value={apiData?.additionalDetails?.existingAreaVal}
                    />
                  </FormControl>
                </Col>
              </div>
              <Col md={12} lg={12} mb={3} sx={{ marginY: 2 }}>
                <Paper sx={{ width: "100%", overflow: "hidden", marginY: 2 }}>
                  <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Sr No.</StyledTableCell>
                          <StyledTableCell>License No.</StyledTableCell>
                          <StyledTableCell>Area</StyledTableCell>
                          {/* <StyledTableCell>Action</StyledTableCell> */}
                        </TableRow>
                      </TableHead>
                      <TableBody>

                        {
                          apiData?.additionalDetails?.existingAreaDetails?.map((input, index) =>
                            //  return ( 
                            <StyledTableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                              <StyledTableCell component="th" scope="row">
                                {index + 1}
                              </StyledTableCell>
                              <StyledTableCell>{input?.areaModalPop}</StyledTableCell>
                              <StyledTableCell>{input?.licenseNoPop}</StyledTableCell>

                              {/* <StyledTableCell > 
                                <a href="javascript:void(0)" title="Delete record" onClick={() => deleteTableRows(-1)}>
                                  <DeleteIcon style={{ fill: "#ff1a1a" }} />
                                </a>
                              </StyledTableCell> */}
                            </StyledTableRow>


                          )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                  // rowsPerPageOptions={[10, 25, 100]}
                  // component="div"
                  // count={modalValue?.length}
                  // rowsPerPage={rowsPerPage}
                  // page={page}
                  // onPageChange={handleChangePage}
                  // onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Paper>
                <div className="row">
                  {/* <Col sx={{ marginY: 2 }}>
                <button
                  type="button"
                  style={{
                    margin: "1rem 0rem",
                    backgroundColor: "#0b3629",
                    color: "white",
                  }}
                  className="btn"
                  onClick={() => setNoOfRows(noofRows + 1)}
                  onClick={handleShowAuthuser}
                >
                  Add More
                </button>
              </Col> */}
                  <Col md={4} lg={4} mb={3}>
                    <FormControl>
                      <FormLabel id="existing_area" sx={{ fontWeight: "bold" }}>
                        Total Area <span style={{ color: "red" }}>*</span>

                        <OutlinedInput
                          aria-labelledby="existing_area"
                          type="text"
                          placeholder=""
                          className="Inputcontrol"
                          {...register("existingArea")}

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
                    <th class="fw-normal" style={{ textAlign: "center" }}>In Acres</th>
                    <th class="fw-normal" style={{ textAlign: "center" }}>In sq.m</th>

                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Area proposed in revision</td>
                    <td><input type="number" className="form-control" {...register("areaProposedRevision")} id="areaProposedRevision" /></td>
                    {/* <td style={{ textAlign: "center" }}>{(watch("areaProposedRevision") * 4046.86)?.toFixed(3)}</td> */}
                    <td></td>
                  </tr>
                  <tr>
                    <td>Commercial area</td>
                    <td><input type="number" className="form-control"  {...register("areaCommercial")} id="areaCommercial" /></td>
                    {/* <td style={{ textAlign: "center" }}>{(watch("areaCommercial") * 4046.86)?.toFixed(3)}</td> */}
                    <td></td>
                  </tr>
                  <tr>
                    <td>Residential area</td>
                    <td><input type="number" className="form-control" {...register("areaResidential")} id="areaResidential" /></td>
                    {/* <td style={{ textAlign: "center" }}>{(watch("areaResidential") * 4046.86)?.toFixed(3)}</td> */}
                    <td></td>
                  </tr>

                </tbody>
              </div>


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
                {/* {watch("anyOtherFeature") === "Y" && ( */}
                <div className="row ">
                  <Col md={4} lg={4}>
                    <FormControl>
                      {/* <FormLabel id="any_remarks">Any other remark</FormLabel> */}
                      <textarea
                        className="form-control"
                        aria-labelledby="any_remarks"
                        {...register("anyOtherRemarks")}
                      // onChange={(e) => setAnyOtherRemarkTextVal(e.target.value)}
                      // value={anyOtherRemarkTextVal}
                      ></textarea>
                    </FormControl>
                  </Col>
                </div>
                {/* )} */}
              </div>

            </div>
            <div className=" col-12 m-auto">
              <div className="card">
                <div className="table table-bordered table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th style={{ textAlign: "center" }}>Sr.No</th>
                        <th style={{ textAlign: "center" }}>Field Name</th>
                        <th style={{ textAlign: "center" }}>Upload Documents</th>
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
                        <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(apiData?.additionalDetails?.noObjectionCertificate)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(apiData?.additionalDetails?.noObjectionCertificate)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.noObjectionCertificate,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("noObjectionCertificate");
                                            setLabelValue("No objection certificate from the existing ‘Developer, filed through its authorized signatory, specifically designated for the purpose; as well as from the ‘land owner licensees’, in person (not through GPA/SPA assignees), to the proposed change/assignment."),
                                              setSmShow(true),
                                              console.log("modal open"),
                                              setFieldValue(personalinfo !== null ? personalinfo.noObjectionCertificate : null);
                                          }}
                                        ></ReportProblemIcon>
                                      </div>
                                    </div>
                          {/* <input
                          id="reasonRevisionLayoutPlanDoc"
                          type="file"
                          style={{ display: "none" }}
                          accept="application/pdf/jpeg/png"
                          className="form-control"
                          onChange={(e) => getDocumentData(e?.target?.files[0], "reasonRevisionLayoutPlanDoc")}
                        /> */}
                          {/* <span>
                          
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
                        </span> */}
                        </td>
                      </tr>
                      <tr>
                        <td scope="row">2</td>
                        <td>
                          {`${t("REV_LAYOUT_COPY_EARLIER_LAYOUT_PLAN")}`}
                          <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                        <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(apiData?.additionalDetails?.noObjectionCertificate)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(apiData?.additionalDetails?.noObjectionCertificate)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.noObjectionCertificate,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("noObjectionCertificate");
                                            setLabelValue("No objection certificate from the existing ‘Developer, filed through its authorized signatory, specifically designated for the purpose; as well as from the ‘land owner licensees’, in person (not through GPA/SPA assignees), to the proposed change/assignment."),
                                              setSmShow(true),
                                              console.log("modal open"),
                                              setFieldValue(personalinfo !== null ? personalinfo.noObjectionCertificate : null);
                                          }}
                                        ></ReportProblemIcon>
                                      </div>
                                    </div>


                          {/* <div className="col-4">
                            <ReportProblemIcon
                              style={{
                                color: fieldIconColors.tehsil,
                              }}
                              onClick={() => {
                                setOpennedModal("tehsil");
                                setLabelValue("Tehsil"),
                                  setSmShow(true),
                                  console.log("modal open"),
                                  setFieldValue(apiData !== null ? apiData.tehsil : null);
                              }}
                            ></ReportProblemIcon>

                          </div> */}
                          {/* <span>
                       
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
                        </span> */}
                        </td>
                      </tr>
                      <tr>
                        <td scope="row">3</td>
                        <td>
                          {`${t("REV_LAYOUT_COPY_PROPOSED_LAYOUT_PLAN")}`}
                          <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                        <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(apiData?.additionalDetails?.noObjectionCertificate)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(apiData?.additionalDetails?.noObjectionCertificate)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.noObjectionCertificate,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("noObjectionCertificate");
                                            setLabelValue("No objection certificate from the existing ‘Developer, filed through its authorized signatory, specifically designated for the purpose; as well as from the ‘land owner licensees’, in person (not through GPA/SPA assignees), to the proposed change/assignment."),
                                              setSmShow(true),
                                              console.log("modal open"),
                                              setFieldValue(personalinfo !== null ? personalinfo.noObjectionCertificate : null);
                                          }}
                                        ></ReportProblemIcon>
                                      </div>
                                    </div>
                          {/* <span>
                       
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
                        </span> */}
                        </td>
                      </tr>
                      <tr>
                        <td scope="row">4</td>
                        <td>
                          {`${t("REV_LAYOUT_STATUS_CREATION_THIRD_PARTY_AFFIDAVIT")}`}
                          <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                        <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(apiData?.additionalDetails?.noObjectionCertificate)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(apiData?.additionalDetails?.noObjectionCertificate)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.noObjectionCertificate,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("noObjectionCertificate");
                                            setLabelValue("No objection certificate from the existing ‘Developer, filed through its authorized signatory, specifically designated for the purpose; as well as from the ‘land owner licensees’, in person (not through GPA/SPA assignees), to the proposed change/assignment."),
                                              setSmShow(true),
                                              console.log("modal open"),
                                              setFieldValue(personalinfo !== null ? personalinfo.noObjectionCertificate : null);
                                          }}
                                        ></ReportProblemIcon>
                                      </div>
                                    </div>
                          {/* <span>
                        

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
                        </span> */}
                        </td>
                      </tr>
                      <tr>
                        <td scope="row">5</td>
                        <td>
                          {`${t("REV_LAYOUT_BOARD_RESOLUTION_AUTHORISED_SIGNATORY")}`} <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                        <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(apiData?.additionalDetails?.noObjectionCertificate)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(apiData?.additionalDetails?.noObjectionCertificate)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.noObjectionCertificate,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("noObjectionCertificate");
                                            setLabelValue("No objection certificate from the existing ‘Developer, filed through its authorized signatory, specifically designated for the purpose; as well as from the ‘land owner licensees’, in person (not through GPA/SPA assignees), to the proposed change/assignment."),
                                              setSmShow(true),
                                              console.log("modal open"),
                                              setFieldValue(personalinfo !== null ? personalinfo.noObjectionCertificate : null);
                                          }}
                                        ></ReportProblemIcon>
                                      </div>
                                    </div>
                          {/* <span>
                       
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
                        </span> */}
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
                          <FileDownloadIcon style={{ cursor: "pointer" }} color="primary" />
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

              {/* <div className="col-sm-12 text-right">
              <Button variant="contained" className="btn btn-primary btn-md center-block text-white" type="submit">
                Submit
              </Button>
            </div> */}
            </div>
          </div>
        </div>
      </Collapse>
    </form>
  );
}

export default LayoutPlanClu;
