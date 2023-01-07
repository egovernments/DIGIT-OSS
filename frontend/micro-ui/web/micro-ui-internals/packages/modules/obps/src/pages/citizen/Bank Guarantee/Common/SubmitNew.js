import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { DatePicker } from "@egovernments/digit-ui-react-components";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";
function SubmitNew() {
  const [modal, setmodal] = useState(false);
  const [modal1, setmodal1] = useState(false);
  const [ServicePlanDataLabel, setServicePlanDataLabel] = useState([]);
  const userInfo = Digit.UserService.getUser()?.info || {};
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm({});

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
          userInfo: userInfo,
        },
        NewBankGuaranteeRequest: {
          status: null,
          tenantId: "hr",
          additionalDetails: null,
          workflowAction: "INITIATE",
          workflowComment: null,
          workflowAssignee: null,
          ...data,
        },
      };
      const Resp = await axios.post("/tl-services/bank/guarantee/_create", postDistrict);
      setServicePlanDataLabel(Resp.data);
    } catch (error) {
      console.log(error.message);
    }
  };
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
      setLoader(false);
      return error;
    }
  };
  const [applicantId, setApplicantId] = useState("");
  const getApplicantUserData = async (id) => {
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
      const Resp = await axios.post(`http://103.166.62.118:80/tl-services/bank/guarantee/_search?applicationNumber=${id}`, payload);
      const userData = Resp?.data?.LicenseDetails?.[0];
      setStepData(userData);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    const search = location?.search;
    const params = new URLSearchParams(search);
    const id = params.get("id");
    setApplicantId(id?.toString());
    if (id) getApplicantUserData(id);
  }, []);

  return (
    <form onSubmit={handleSubmit(bankSubmitNew)}>
      <Card style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}> Bank Guarantee Submission</h4>
        <div className="card">
          <Row className="col-12">
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Enter LOI No. </h2>
                </Form.Label>
              </div>
              <input type="text" className="form-control" placeholder="" {...register("loiNumber")} />
            </Col>

            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Type of B.G</h2>
                </Form.Label>
              </div>
              <select className="form-control" {...register("typeOfBg")}>
                <option> IDW</option>
                <option>EDC</option>
              </select>
            </Col>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Amount (in fig)</h2>
                </Form.Label>
              </div>
              <input type="text" className="form-control" placeholder="" {...register("amountInFig")} />
            </Col>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Amount (in words)</h2>
                </Form.Label>
              </div>
              <input type="text" className="form-control" placeholder="" {...register("amountInWords")} />
            </Col>
          </Row>
          <br></br>
          <Row className="col-12">
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Bank Name </h2>
                </Form.Label>
              </div>
              <input type="text" className="form-control" placeholder="" {...register("bankName")} />
            </Col>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Enter Memo No. </h2>
                </Form.Label>
              </div>
              <input type="text" className="form-control" placeholder="" {...register("memoNumber")} />
            </Col>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Valid Upto </h2>
                </Form.Label>
              </div>
              <input type="datepicker" className="form-control" placeholder="" {...register("validity")} format="yyyy-MM-dd" />
            </Col>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Upload B.G. </h2>
                </Form.Label>
              </div>
              <input type="file" className="form-control" onChange={(e) => getDocumentData(e?.target?.files[0], "uploadBg")} />
            </Col>
          </Row>
          <br></br>
          <Row className="col-12">
            <div className="col col-12 ">
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
                    <div className="col col-4">
                      <label>
                        <h2>
                          Upload Receipt of Submission.
                          <span style={{ color: "red" }}>*</span>
                        </h2>
                      </label>
                      <div>
                        <input type="file" className="form-control" onChange={(e) => getDocumentData(e?.target?.files[0], "consentLetter")}></input>
                      </div>

                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.consentLetter && errors?.consentLetter?.message}
                      </h3>
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
            </div>
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
