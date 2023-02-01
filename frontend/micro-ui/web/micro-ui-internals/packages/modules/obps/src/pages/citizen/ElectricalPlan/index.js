import React, { useState, useEffect } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Dialog } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const electricalPlanService = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm({
    mode: "onChange",

    shouldFocusError: true,
  });
  const [open, setOpen] = useState(false)
  const [applicationNumber, setApplicationNumber] = useState()

  const [developerDataLabel, setDeveloperDataLabel] = useState([]);
  const electricPlan = async (data) => {
    const token = window?.localStorage?.getItem("token");
    console.log(data);
    const tenantId = Digit.ULBService.getCurrentTenantId();

    try {
      const postDistrict = {
        requestInfo: {
          api_id: "1",
          ver: "1",
          ts: null,
          action: "create",
          did: "",
          key: "",
          msg_id: "",
          requester_id: "",
          authToken: token,
        },

        ElectricPlanRequest: [{
          ...data,
          "action": "APPLY",
          "tenantId":  tenantId,
          "businessService": "ELECTRICAL_PLAN",
          "workflowCode": "ELECTRICAL_PLAN",
          "comment": "",
          "assignee": null
        }],
      };
      const Resp = await axios.post("/tl-services/electric/plan/_create", postDistrict);
      setDeveloperDataLabel(Resp.data);
      setApplicationNumber(Resp.data.electricPlanResponse[0].applicationNumber)
      setOpen(true)
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleClose = () => {
    setOpen(false)
    window.location.href = `/digit-ui/citizen`
  }

  const viewDocument = async (documentId) => {
    try {
      const response = await axios.get(`/filestore/v1/files/url?tenantId=hr&fileStoreIds=${documentId}`, {});
      const FILDATA = response.data?.fileStoreIds[0]?.url;
      window.open(FILDATA);
    } catch (error) {
      console.log(error);
    }
  }

  const [fileStoreId, setFileStoreId] = useState({});
  const getDocumentData = async (file, fieldName) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("tenantId", "hr");
    formData.append("module", "property-upload");
    formData.append("tag", "tag-property");
    // setLoader(true);
    try {
      const Resp = await axios.post("/filestore/v1/files", formData, {});
      setValue(fieldName, Resp?.data?.files?.[0]?.fileStoreId);
      setFileStoreId({ ...fileStoreId, [fieldName]: Resp?.data?.files?.[0]?.fileStoreId });
      // setDocId(Resp?.data?.files?.[0]?.fileStoreId);
      // setLoader(false);
    } catch (error) {
      // setLoader(false);
      console.log(error.message);
    }
  };
  return (
    <React.Fragment>
    <form onSubmit={handleSubmit(electricPlan)}>
      <Card style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Electrical Plan </h4>
        <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "40px", marginBottom: "52px" }}>
          <Row className="ml-auto" style={{ marginBottom: 5 }}>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <h2>
                    LOI Number <span style={{ color: "red" }}>*</span>
                  </h2>
                </Form.Label>
              </div>
              <input type="number" className="form-control" placeholder="" {...register("loiNumber")} />
            </Col>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <h2>
                    Electrical infrastructure sufficient to cater for the electrical need of the project area <span style={{ color: "red" }}>*</span>{" "}
                    &nbsp;&nbsp;
                  </h2>
                </Form.Label>

                <Form.Check
                  onChange={(e) => console.log(e)}
                  value="Y"
                  type="radio"
                  id="default-radio"
                  label="Yes"
                  name="true"
                  {...register("electricInfra")}
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => console.log(e)}
                  value="N"
                  type="radio"
                  id="default-radio"
                  label="No"
                  name="false"
                  {...register("electricInfra")}
                  inline
                ></Form.Check>
              </div>
            </Col>
            <Col className="ms-auto" md={4} xxl lg="4">
              <div>
                <Form.Label>
                  Provision of the electricity distribution in the project area by the instructions of the DHBVN{" "}
                  <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                </Form.Label>
              </div>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="Y"
                type="radio"
                id="default-radio"
                label="Yes"
                name="true"
                {...register("electricDistribution")}
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="N"
                type="radio"
                id="default-radio"
                label="No"
                name="false"
                {...register("electricDistribution")}
                inline
              ></Form.Check>
            </Col>
            <Col className="ms-auto" md={4} xxl lg="4">
              <div>
                <Form.Label>
                  The capacity of the proposed electrical substation as per the requirement <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                </Form.Label>
              </div>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="Y"
                type="radio"
                id="default-radio"
                label="Yes"
                name="true"
                {...register("electricalCapacity")}
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="N"
                type="radio"
                id="default-radio"
                label="No"
                name="false"
                {...register("electricalCapacity")}
                inline
              ></Form.Check>
            </Col>
            <Col className="ms-auto" md={4} xxl lg="4">
              <div>
                <Form.Label>
                  Provision of 33 Kv switching station for the electrical infrastructure as per the approved layout plan
                  <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                </Form.Label>
              </div>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="Y"
                type="radio"
                id="default-radio"
                label="Yes"
                name="true"
                {...register("switchingStation")}
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="N"
                type="radio"
                id="default-radio"
                label="No"
                name="false"
                {...register("switchingStation")}
                inline
              ></Form.Check>
            </Col>
            <Col className="ms-auto" md={4} xxl lg="4">
              <div>
                <Form.Label>
                  Load sanction approval as per the requirement <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                </Form.Label>
              </div>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="Y"
                type="radio"
                id="default-radio"
                label="Yes"
                name="true"
                {...register("LoadSancation")}
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="N"
                type="radio"
                id="default-radio"
                label="No"
                name="false"
                {...register("LoadSancation")}
                inline
              ></Form.Check>
            </Col>
            <Col className="ms-auto" md={4} xxl lg="4"></Col>
          </Row>

          <div className="table table-bordered table-responsive">
            <thead>
              <tr>
                <td style={{ textAlign: "center" }}> Sr.No.</td>
                <td style={{ textAlign: "center" }}>Type Of Map/Plan</td>
                <td style={{ textAlign: "center" }}>Annexure</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">1.</p>
                  </div>
                </td>
                <td component="th" scope="row">
                  <h2>Self-certified drawings from empanelled/certified architects that conform to the standard approved template as per the TCP layout plan / Site plan.</h2>
                </td>
                <td component="th" scope="row">
                <label for='file-input-1'>
                    <FileUploadIcon 
                    color="primary"
                    />
                  </label>
                  <input 
                  type="file" 
                  className="form-control mb-4" 
                  onChange={(e) => getDocumentData(e?.target?.files[0], "selfCenteredDrawings")} 
                  id="file-input-1"
                  style={{display: "none"}}
                  />
                  {fileStoreId?.selfCenteredDrawings ? 
                  <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.selfCenteredDrawings)}>
                    {" "}
                  </VisibilityIcon>
                  : ""}
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">2.</p>
                  </div>
                </td>
                <td component="th" scope="row">
                  <h2>Environmental Clearance.</h2>
                </td>
                <td component="th" scope="row">
                <label for='file-input-2'>
                    <FileUploadIcon 
                    color="primary"
                    />
                  </label>
                  <input 
                  type="file" 
                  className="form-control" 
                  onChange={(e) => getDocumentData(e?.target?.files[0], "environmentalClearance")} 
                  style={{display: "none"}}
                  id="file-input-2"
                  />
                  {fileStoreId?.environmentalClearance ? 
                  <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.environmentalClearance)}>
                    {" "}
                  </VisibilityIcon>
                  : "" }
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">3.</p>
                  </div>
                </td>
                <td component="th" scope="row">
                  <h2>Electrical plan PDF (OCR Compatible) + GIS format.</h2>
                </td>
                <td component="th" scope="row">
                <label for='file-input-3'>
                    <FileUploadIcon 
                    color="primary"
                    />
                  </label>
                  <input 
                  type="file" 
                  className="form-control" 
                  onChange={(e) => getDocumentData(e?.target?.files[0], "pdfFormat")} 
                  style={{display: "none"}}
                  id="file-input-3"
                  />
                  {fileStoreId?.pdfFormat ? 
                  <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.pdfFormat)}>
                    {" "}
                  </VisibilityIcon>
                  : "" }
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">4.</p>
                  </div>
                </td>
                <td component="th" scope="row">
                  <h2>Electrical plan in AutoCAD (DXF) file.</h2>
                </td>
                <td component="th" scope="row">
                <label for='file-input-4'>
                    <FileUploadIcon 
                    color="primary"
                    />
                  </label>
                  <input 
                  type="file" 
                  className="form-control" 
                  onChange={(e) => getDocumentData(e?.target?.files[0], "autoCad")} 
                  style={{display: "none"}}
                  id="file-input-4"
                  />
                  {fileStoreId?.autoCad ? 
                  <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.autoCad)}>
                    {" "}
                  </VisibilityIcon>
                  : ""}
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">5.</p>
                  </div>
                </td>
                <td component="th" scope="row">
                  <h2>Certified copy of the Electrical plan verified by a third party.</h2>
                </td>
                <td component="th" scope="row">
                <label for='file-input-5'>
                    <FileUploadIcon 
                    color="primary"
                    />
                  </label>
                  <input 
                  type="file" 
                  className="form-control" 
                  onChange={(e) => getDocumentData(e?.target?.files[0], "verifiedPlan")} 
                  style={{display: "none"}}
                  id="file-input-5"
                  />
                  {fileStoreId?.verifiedPlan ? 
                  <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.verifiedPlan)}>
                    {" "}
                  </VisibilityIcon>
                  : ""}
                </td>
              </tr>
            </tbody>
          </div>

          <div class="row">
            <div class="col-sm-12 text-right">
              <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
                Submit
              </button>
            </div>
          </div>
        </Card>
      </Card>
    </form>
    <Dialog
    open={open}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    >
    <DialogTitle id="alert-dialog-title">
        Electric Plan Submission
    </DialogTitle>
    <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p>Your Electric Plan is submitted successfully <span><CheckCircleOutlineIcon style={{color: 'blue', variant: 'filled'}}/></span></p>
            <p>Please Note down your Application Number <span style={{padding: '5px', color: 'blue'}}>{applicationNumber}</span> for further assistance</p>
          </DialogContentText>
    </DialogContent>
    <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Ok
          </Button>
    </DialogActions>

    </Dialog>
    </React.Fragment>
  );
};

export default electricalPlanService;