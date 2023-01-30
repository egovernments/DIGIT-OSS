import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { useForm } from "react-hook-form";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileUpload from "@mui/icons-material/FileUpload";

function ReleaseNew(props) {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const [modal, setmodal] = useState(false);
  const [modal1, setmodal1] = useState(false);
  const [ServicePlanDataLabel, setServicePlanDataLabel] = useState([]);
  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues,
    watch,
  } = useForm({});
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [searchExistingBg, setSearchExistingBg] = useState({});

  const bankRelease = async (data) => {
    const token = window?.localStorage?.getItem("token");
    const userInfo = Digit.UserService.getUser()?.info || {};

    try {
      const postDistrict = {
        NewBankGuaranteeRequest: [
          {
            action: "APPLY_FOR_RELEASE",
            comment: "test comment",
            assignee: null,

            // validity: data?.validity,
            ...searchExistingBg,
            ...data,
            status: "APPROVED",
          },
        ],
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
      };
      const Resp = await axios.post("/tl-services/bank/guarantee/_update", postDistrict);
      console.log("Release", Resp);
      setSubmissionSearch(UserData);
    } catch (error) {
      console.log(error.message);
    }
  };
  const existingBgFormSubmitHandler = async () => {
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
      const Resp = await axios.post(`/tl-services/bank/guarantee/_search?bgNumber=${getValues("bgNumber")}`, payload);

      console.log("service", Resp.data.newBankGuaranteeList[0]);
      setSearchExistingBg(Resp.data.newBankGuaranteeList[1]);
    } catch (error) {
      return error;
    }
  };
  useEffect(() => {
    existingBgFormSubmitHandler();
  }, []);
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
      if (fieldName === "uploadBg") {
        setValue("uploadBgFileName", file.name);
      }
      if (fieldName === "fullCertificate") {
        setValue("fullCertificateFileName", file.name);
      }
      if (fieldName === "partialCertificate") {
        setValue("partialCertificateFileName", file.name);
      }
    } catch (error) {
      setLoader(false);
      return error;
    }
  };

  return (
    <form onSubmit={handleSubmit(bankRelease)}>
      <Card style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Release of Bank Guarantee</h4>
        <div className="card">
          <Row className="col-12">
            <Col md={4} xxl lg="4">
              <div>
                <h6>
                  Do you want to Replace B.G.?
                  <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                  <label htmlFor="releaseBankGuarantee">
                    <input {...register("releaseBankGuarantee")} type="radio" value="Y" id="releaseBankGuarantee" />
                    &nbsp; Yes &nbsp;&nbsp;
                  </label>
                  <label htmlFor="releaseBankGuarantee">
                    <input {...register("releaseBankGuarantee")} type="radio" value="N" id="releaseBankGuarantee" />
                    &nbsp; No &nbsp;&nbsp;
                  </label>
                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.releaseBankGuarantee && errors?.releaseBankGuarantee?.message}
                  </h3>
                </h6>
              </div>
            </Col>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <h2>Enter Bank Guarantee No. </h2>
                </Form.Label>
              </div>
              <input type="text" className="form-control" placeholder="" {...register("bgNumber")} />
            </Col>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <h2>Type of B.G. </h2>
                </Form.Label>
              </div>
              <select className="form-control" placeholder="" {...register("typeOfBg")}>
                <option value="1"> IDW</option>
                <option value="2">EDC</option>
              </select>
            </Col>
            <div className="row">
              <div className="col col-12 ">
                {watch("releaseBankGuarantee") === "Y" && (
                  <div className="row ">
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
                          {fileStoreId?.uploadBg ? (
                            <a onClick={() => getDocShareholding(fileStoreId?.uploadBg)} className="btn btn-sm ">
                              <VisibilityIcon color="info" className="icon" />
                            </a>
                          ) : (
                            <p></p>
                          )}
                          <h3 style={{}}>{watch("uploadBgFileName") ? watch("uploadBgFileName") : null}</h3>{" "}
                        </label>
                      </div>
                      {/* <input type="file" className="form-control" onChange={(e) => getDocumentData(e?.target?.files[0], "uploadBg")} /> */}
                    </Col>
                  </div>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col col-12 ">
                {watch("releaseBankGuarantee") === "N" && (
                  <div className="row ">
                    {/* <Col md={4} xxl lg="3">
                        <div>
                          <Form.Label>
                            <h2>Enter B.G. No. </h2>
                          </Form.Label>
                        </div>
                        <input type="text" className="form-control" placeholder="" {...register("bgNo")} />
                      </Col> */}
                    {/* <Col md={4} xxl lg="3">
                      <div>
                        <Form.Label>
                          <h2>Type of B.G. </h2>
                        </Form.Label>
                      </div>
                      <select className="form-control" placeholder="" {...register("typesOfBg")}>
                        <option value="1"> IDW</option>
                        <option value="2">EDC</option>
                      </select>
                    </Col> */}
                    {watch("typeOfBg") === "1" && (
                      <div>
                        <div className="row">
                          <Col md={4} xxl lg="3">
                            <div>
                              <label>
                                <h2>Full Completion Certificate. </h2>
                                <FileUpload color="primary" />
                                <input
                                  type="file"
                                  accept="application/pdf/jpeg/png"
                                  style={{ display: "none" }}
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "fullCertificate")}
                                />
                                {fileStoreId?.fullCertificate ? (
                                  <a onClick={() => getDocShareholding(fileStoreId?.fullCertificate)} className="btn btn-sm ">
                                    <VisibilityIcon color="info" className="icon" />
                                  </a>
                                ) : (
                                  <p></p>
                                )}
                                <h3 style={{}}>{watch("fullCertificateFileName") ? watch("fullCertificateFileName") : null}</h3>{" "}
                              </label>
                            </div>
                            {/* <input type="file" className="form-control" onChange={(e) => getDocumentData(e?.target?.files[0], "uploadBg")} /> */}
                          </Col>
                        </div>
                      </div>
                    )}
                    {watch("typeOfBg") === "2" && (
                      <div>
                        <div className="row">
                          <div className="col col-4">
                            <label>
                              <h2>
                                Amount.
                                <span style={{ color: "red" }}>*</span>
                              </h2>
                            </label>
                            <div>
                              <input type="text" className="form-control" placeholder="" {...register("tcpSubmissionReceived")} />
                            </div>

                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.tcpSubmissionReceived && errors?.tcpSubmissionReceived?.message}
                            </h3>
                          </div>
                          <Col md={4} xxl lg="3">
                            <div>
                              <label>
                                <h2> Partial Completion Certificate. </h2>
                                <FileUpload color="primary" />
                                <input
                                  type="file"
                                  accept="application/pdf/jpeg/png"
                                  style={{ display: "none" }}
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "partialCertificate")}
                                />
                                {fileStoreId?.partialCertificate ? (
                                  <a onClick={() => getDocShareholding(fileStoreId?.partialCertificate)} className="btn btn-sm ">
                                    <VisibilityIcon color="info" className="icon" />
                                  </a>
                                ) : (
                                  <p></p>
                                )}
                                <h3 style={{}}>{watch("partialCertificateFileName") ? watch("partialCertificateFileName") : null}</h3>{" "}
                              </label>
                            </div>
                            {/* <input type="file" className="form-control" onChange={(e) => getDocumentData(e?.target?.files[0], "uploadBg")} /> */}
                          </Col>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <Col md={4} xxl lg="3">
              <div>
                <button
                  // id="btnClear"
                  type="button"
                  class="btn btn-primary btn-md center-block"
                  style={{ marginBottom: "-44px" }}
                  onClick={existingBgFormSubmitHandler}
                >
                  Search
                </button>
              </div>
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
        </div>
      </Card>
    </form>
  );
}

export default ReleaseNew;
