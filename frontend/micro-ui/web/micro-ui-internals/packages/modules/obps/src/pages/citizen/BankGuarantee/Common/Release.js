import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import Box from "@mui/material/Box";
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
      <div className="card" style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Release of Bank Guarantee</h4>
        <div className="card">
          <div className="row-12">
            <div className="col md={4} xxl lg-4">
              <FormControl>
                <h6 className="FormLable">
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
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">Enter Bank Guarantee No. </h2>
                <OutlinedInput type="text" className="Inputcontrol" placeholder="" {...register("bgNumber")} onClick={existingBgFormSubmitHandler} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">Type of B.G. </h2>
                <select className="Inputcontrol" class="form-control" placeholder="" {...register("typeOfBg")}>
                  <option value="1"> IDW</option>
                  <option value="2">EDC</option>
                </select>
              </FormControl>
            </div>
            <div className="row-12">
              <div className="col md={4} xxl lg-4">
                {watch("releaseBankGuarantee") === "Y" && (
                  <div className="row-12">
                    <div className="col md={4} xxl lg-4">
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
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="row-12">
              <div className="col-12">
                {watch("releaseBankGuarantee") === "N" && (
                  <div className="row ">
                    {/* <col md={4} xxl lg="3">
                        <div>
                          <Form.Label>
                            <h2>Enter B.G. No. </h2>
                          </Form.Label>
                        </div>
                        <input type="text" className="form-control" placeholder="" {...register("bgNo")} />
                      </col> */}
                    {/* <col md={4} xxl lg="3">
                      <div>
                        <Form.Label>
                          <h2>Type of B.G. </h2>
                        </Form.Label>
                      </div>
                      <select className="form-control" placeholder="" {...register("typesOfBg")}>
                        <option value="1"> IDW</option>
                        <option value="2">EDC</option>
                      </select>
                    </col> */}
                    {watch("typeOfBg") === "1" && (
                      <div>
                        <div className="row-12">
                          <div className="col md={4} xxl lg-3">
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
                          </div>
                        </div>
                      </div>
                    )}
                    {watch("typeOfBg") === "2" && (
                      <div>
                        <div className="row-12">
                          <div className="col md={4} xxl lg-4">
                            <FormControl>
                              <h2>
                                Amount.
                                <span style={{ color: "red" }}>*</span>
                              </h2>

                              <input type="text" className="form-control" placeholder="" {...register("tcpSubmissionReceived")} />
                            </FormControl>
                            &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
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
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
            {/* <div className="row-12">
              <button
               
                type="button"
                class="btn btn-primary btn-md center-block"
                onClick={existingBgFormSubmitHandler}
              >
                Search
              </button>
            </div>
            <br></br> */}
            <div class="row-12" className="align-right">
              <div className="col-4">
                <Button variant="contained" class="btn btn-primary btn-md center-block">
                  Cancel
                </Button>
                &nbsp;
                <Button variant="contained" type="submit" class="btn btn-primary btn-md center-block">
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default ReleaseNew;
