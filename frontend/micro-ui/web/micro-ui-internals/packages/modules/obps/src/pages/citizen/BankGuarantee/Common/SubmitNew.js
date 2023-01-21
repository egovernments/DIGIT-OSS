import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { DatePicker } from "@egovernments/digit-ui-react-components";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";
// import { getDocShareholding } from "../docView/docView.help";
import FileUpload from "@mui/icons-material/FileUpload";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
function SubmitNew() {
  const [modal, setmodal] = useState(false);
  const [modal1, setmodal1] = useState(false);
  const [ServicePlanDataLabel, setServicePlanDataLabel] = useState([]);
  const [existingBgNumber, setExistingBgNumber] = useState("");
  // const [getShow, setShow] = useState({ submit: false });
  const userInfo = Digit.UserService.getUser()?.info || {};
  const [typeOfBg, setTypeOfBg] = useState("");
  const [licNo, setLicNo] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
    getValues,
  } = useForm({});
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const bankSubmitNew = async (data) => {
    const token = window?.localStorage?.getItem("token");
    console.log(data);
    try {
      const postDistrict = {
        RequestInfo: {
          apiId: "Rainmaker",
          action: "_create",
          did: 1,
          key: "",
          msgId: "20170310130900|en_IN",
          ts: 0,
          ver: ".01",
          authToken: token,
        },
        NewBankGuaranteeRequest: [
          {
            tenantId: tenantId,
            additionalDetails: null,
            additionalDocuments: null,
            action: "PRE_SUBMIT",
            comment: null,
            assignee: null,
            ...data,
          },
        ],
      };
      const Resp = await axios.post("/tl-services/bank/guarantee/_create", postDistrict);
      setServicePlanDataLabel(Resp.data);
      // setShow({ submit: true });
    } catch (error) {
      console.log(error.message);
    }
  };
  const [fileStoreId, setFileStoreId] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loader, setLoader] = useState(false);
  const getDocumentData = async (file, fieldName) => {
    if (selectedFiles.includes(file.name)) {
      setShowToastError({ key: "error" });
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
      // setDocId(Resp?.data?.files?.[0]?.fileStoreId);
      if (fieldName === "uploadBg") {
        setValue("uploadBgFileName", file.name);
      }
      if (fieldName === "tcpSubmissionReceived") {
        setValue("tcpSubmissionReceivedFileName", file.name);
      }
      setSelectedFiles([...selectedFiles, file.name]);
      setLoader(false);
      setShowToast({ key: "success" });
    } catch (error) {
      setLoader(false);
      return error.message;
    }
  };
  const [applicantId, setApplicantId] = useState("");

  const landScheduleFormSubmitHandler = async () => {
    // const payload = {
    //   typeOfBg: { ...register("typeOfBg") },
    // };
    console.log("log123", getValues());
    const token = window?.localStorage?.getItem("token");
    const payload = {
      RequestInfo: {
        apiId: "Rainmaker",
        action: "_create",
        did: 1,
        key: "",
        msgId: "20170310130900|en_IN",
        ts: 0,
        ver: ".01",
        authToken: token,
      },
    };
    try {
      const Resp = await axios.post(
        `/tl-services/bank/guarantee/_search?typeOfBg=${getValues("typeOfBg")}&loiNumber=${getValues("loiNumber")}`,
        payload
      );
      setValue("amountInFig", Resp.data.newBankGuaranteeList[0].amountInFig);
      const userData = Resp?.data?.LicenseDetails?.[0];
      setStepData(userData);
    } catch (error) {
      return error;
    }
  };

  // useEffect(() => {
  //   const search = location?.search;
  //   const params = new URLSearchParams(search);
  //   const id = params.get("id");
  //   setApplicantId(id?.toString());
  //   if (id) getApplicantUserData(id);
  // }, []);

  return (
    <form onSubmit={handleSubmit(bankSubmitNew)}>
      <Card style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}> Bank Guarantee Submission </h4>
        <div className="card">
          <Row className="col-12">
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Enter LOI Number </h2>
                </Form.Label>
              </div>
              <input
                type="text"
                className="form-control"
                placeholder=""
                {...register("loiNumber")}
                disabled={existingBgNumber?.length > 0 ? true : false}
              />
            </Col>

            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Type of B.G</h2>
                </Form.Label>
              </div>
              <select className="form-control" {...register("typeOfBg")} disabled={existingBgNumber?.length > 0 ? true : false}>
                <option> IDW</option>
                <option>EDC</option>
              </select>
            </Col>

            <Col md={4} xxl lg="3">
              <div>
                <button
                  // id="btnClear"
                  type="button"
                  class="btn btn-primary btn-md center-block"
                  style={{ marginBottom: "-44px" }}
                  onClick={landScheduleFormSubmitHandler}
                >
                  Search
                </button>
              </div>
            </Col>

            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Amount (in fig)</h2>
                </Form.Label>
              </div>
              <input
                type="text"
                className="form-control"
                placeholder=""
                readOnly
                {...register("amountInFig")}
                disabled={existingBgNumber?.length > 0 ? true : false}
              />
            </Col>
          </Row>
          <br></br>
          <Row className="col-12">
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Amount (in words)</h2>
                </Form.Label>
              </div>
              <input
                type="text"
                className="form-control"
                placeholder=""
                {...register("amountInWords")}
                disabled={existingBgNumber?.length > 0 ? true : false}
              />
            </Col>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Enter Bank Guarantee No. </h2>
                </Form.Label>
              </div>
              <input type="text" className="form-control" placeholder="" {...register("bgNumber")} />
            </Col>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Enter Bank Name </h2>
                </Form.Label>
              </div>
              <input type="text" className="form-control" placeholder="" {...register("bankName")} />
            </Col>

            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Expiry Date </h2>
                </Form.Label>
              </div>
              <input type="datepicker" className="form-control" placeholder="" {...register("validity")} format="yyyy-MM-dd" />
            </Col>
          </Row>
          <br></br>
          <Row className="col-12">
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Claim Period</h2>
                </Form.Label>
              </div>
              <select className="form-control" placeholder="" {...register("claimPeriod")}>
                <option> 0</option>
                <option>1</option>
                <option> 2</option>
                <option>3</option>
                <option> 4</option>
                <option>5</option>
                <option> 6</option>
                <option>7</option>
                <option> 8</option>
                <option>9</option>
                <option> 10</option>
                <option>11</option>
                <option> 12</option>
              </select>
            </Col>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Country of origin</h2>
                </Form.Label>
              </div>
              <select className="form-control" placeholder="" {...register("originCountry")}>
                <option>------</option>
                <option value="1"> Indian</option>
                <option value="2">Foreign</option>
              </select>
              {watch("originCountry") === "2" && (
                <div>
                  <div className="row">
                    <div className="col col-12">
                      <p>In case of B.G. from other country, you need to upload Indian Bank Advice Certificate.</p>
                    </div>
                    <div className="col col-12">
                      <label>
                        <h2>
                          Upload Bank Advice Certificate.
                          <span style={{ color: "red" }}>*</span>
                        </h2>
                      </label>
                      <div>
                        <input
                          type="file"
                          className="form-control"
                          onChange={(e) => getDocumentData(e?.target?.files[0], "indianBankAdvisedCertificate")}
                        ></input>
                      </div>

                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.indianBankAdvisedCertificate && errors?.indianBankAdvisedCertificate?.message}
                      </h3>
                    </div>
                  </div>
                </div>
              )}
            </Col>
            <Col md={4} xxl lg="3">
              <div>
                <label>
                  <h2>Upload B.G. softcopy </h2>
                  <FileUpload color="primary" />

                  <input
                    type="file"
                    accept="application/pdf/jpeg/png"
                    style={{ display: "none" }}
                    onChange={(e) => getDocumentData(e?.target?.files[0], "uploadBg")}
                  />
                </label>
                {fileStoreId?.uploadBg ? (
                  <a onClick={() => getDocShareholding(fileStoreId?.uploadBg)} className="btn btn-sm ">
                    <VisibilityIcon color="info" className="icon" />
                  </a>
                ) : (
                  <p></p>
                )}
                <h3 style={{}}>{watch("uploadBgFileName") ? watch("uploadBgFileName") : null}</h3>
              </div>
              {/* <input type="file" className="form-control" onChange={(e) => getDocumentData(e?.target?.files[0], "uploadBg")} /> */}
            </Col>
            <Col md={4} xxl lg="3">
              <div>
                <label>
                  Hardcopy Submitted at TCP office.{" "}
                  <label htmlFor="licenseApplied">
                    <input {...register("licenseApplied")} type="radio" value="Y" id="licenseApplied" />
                    &nbsp; Yes &nbsp;&nbsp;
                  </label>
                  <label htmlFor="licenseApplied">
                    <input
                      {...register("licenseApplied")}
                      type="radio"
                      value="N"
                      id="licenseApplied"
                      className="btn btn-primary"
                      onClick={() => setmodal1(true)}
                    />
                    &nbsp; No &nbsp;&nbsp;
                  </label>
                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.licenseApplied && errors?.licenseApplied?.message}
                  </h3>
                </label>
              </div>

              {watch("licenseApplied") === "Y" && (
                <div>
                  <div className="row">
                    <div className="col col-12">
                      <label>
                        <h2>
                          Upload Receipt of Submission.
                          <span style={{ color: "red" }}>*</span>
                        </h2>
                        <FileUpload color="primary" />
                        <div>
                          <input
                            type="file"
                            accept="application/pdf/jpeg/png"
                            style={{ display: "none" }}
                            onChange={(e) => getDocumentData(e?.target?.files[0], "tcpSubmissionReceived")}
                          />
                        </div>
                      </label>
                      {fileStoreId?.tcpSubmissionReceived ? (
                        <a onClick={() => getDocShareholding(fileStoreId?.tcpSubmissionReceived)} className="btn btn-sm ">
                          <VisibilityIcon color="info" className="icon" />
                        </a>
                      ) : (
                        <p></p>
                      )}
                      <h3 style={{}}>{watch("tcpSubmissionReceivedFileName") ? watch("tcpSubmissionReceivedFileName") : null}</h3>

                      {/* <div>
                        <input
                          type="file"
                          className="form-control"
                          onChange={(e) => getDocumentData(e?.target?.files[0], "tcpSubmissionReceived")}
                        ></input>
                      </div>

                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.tcpSubmissionReceived && errors?.tcpSubmissionReceived?.message}
                      </h3> */}
                    </div>
                  </div>
                </div>
              )}
              {watch("licenseApplied") === "N" && (
                <div>
                  <Modal
                    size="lg"
                    isOpen={modal1}
                    toggle={() => setmodal(!modal1)}
                    style={{ width: "500px", height: "200px" }}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <ModalHeader toggle={() => setmodal1(!modal1)}></ModalHeader>
                    <ModalBody style={{ fontSize: 20 }}>
                      <h2> Submit Hardcopy of B.G. at TCP office.</h2>
                    </ModalBody>
                    <ModalFooter toggle={() => setmodal(!modal1)}></ModalFooter>
                  </Modal>
                </div>
              )}
            </Col>
          </Row>
          <br></br>
          <Row className="col-12">
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Existing B.G. No. (In case of replacement, extension, renewal enter bank guarantee number)</h2>
                </Form.Label>
              </div>
              <input
                type="text"
                className="form-control"
                placeholder=""
                {...register("existingBgNumber")}
                onChange={(e) => setExistingBgNumber(e.target.value)}
              />
            </Col>
          </Row>
          <Row className="justify-content-end">
            <Button variant="outline-primary" className="col-md-2 my-2 mx-2" aria-label="right-end">
              Cancel
            </Button>

            <Button variant="outline-primary" className="col-md-2 my-2 mx-2" type="submit" aria-label="right-end">
              Submit
            </Button>
          </Row>

          {/* <div class="row">
            <div class="col-sm-12 text-right">
              <button type="submit" id="btnClear" class="btn btn-primary btn-md center-block" style={{ marginBottom: "-44px" }}>
                Submit
              </button>
            </div>
            <div class="row">
              <div class="col-sm-12 text-right">
                <button id="btnSearch" class="btn btn-danger btn-md center-block" style={{ marginRight: "66px", marginTop: "-6px" }}>
                  Cancel
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </Card>
    </form>
  );
}

export default SubmitNew;
