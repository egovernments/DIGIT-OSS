import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import Box from "@mui/material/Box";
import axios from "axios";
import { useForm } from "react-hook-form";
import Collapse from "react-bootstrap/Collapse";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileUpload from "@mui/icons-material/FileUpload";
import ReactMultiSelect from "../../../../../../../react-components/src/atoms/ReactMultiSelect";
import { getDocShareholding } from "../../../../../../tl/src/pages/employee/ScrutinyBasic/ScrutinyDevelopment/docview.helper";
import CusToaster from "../../../../components/Toaster";
import {
  FormStep,
  TextInput,
  MobileNumber,
  CardLabel,
  CardLabelError,
  Dropdown,
  Toast,
  DeleteIcon,
  MuiTables,
} from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

function ReleaseNew(props) {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const [modal, setmodal] = useState(false);
  const [modal1, setmodal1] = useState(false);
   const [open4, setOpen4] = useState(false);
  const [applicantId, setApplicantId] = useState("");
 const [showToastError, setShowToastError] = useState({ label: "", error: false, success: false });
  const [ServicePlanDataLabel, setServicePlanDataLabel] = useState([]);
  const{t}=useTranslation();
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
  const selectTypeData = [{ label: "Complete", value: "complete" },
{
  label: "Partial", value: "partial"
},
{
  label: "Replace", value: "replace"
}];
  const selectBankGuarantee = [{ label: "BG-1", value: "bg1" },
{
  label: "BG-2", value: "bg2"
},
{
  label: "BG-N", value: "bgn"
}];
  const bankRelease = async (data) => {
    console.log("data",data)
    const token = window?.localStorage?.getItem("token");
    const userInfo = Digit.UserService.getUser()?.info || {};
    const applicationNo = data?.newBankGuaranteeList?.[0]?.applicationNumber
    try {
      const postDistrict = {
        NewBankGuaranteeRequest: [
          {
            applicationNumber:"HR_BG_NEW_20230227000483",
            ...data,
            updateType:"RELEASE",
             bankGuaranteeReplacedWith:data?.bankGuaranteeReplacedWith?.value,
            releaseCertificate:data?.releaseCertificate?.value
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
  const [loader, setLoader] = useState(false);
   const [fileStoreId, setFileStoreId] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
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

  return (
    <div>
    <form onSubmit={handleSubmit(bankRelease)}>
      <div className="card" style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>{`${t("RELEASE_BG_HEADING")}`}
        {/* Release of Bank Guarantee */}
        </h4>
        <br></br>
           <div
        className="collapse-header"
        onClick={() => setOpen4(!open4)}
        aria-controls="example-collapse-text"
        aria-expanded={open4}
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
        <span style={{ color: "#817f7f", fontSize: 14 }} className="">
          - BG Detail
        </span>
        {open4 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
       <Collapse in={open4}>
        <div className="card">
          <div className="row-12">
            <div className="col md={4} xxl lg-3">
              <FormControl>
                <h2 className="FormLable">{`${t("MY_APPLICATION_BG_GUARANTEE_NO")}`} </h2>
                <OutlinedInput type="text" className="Inputcontrol" placeholder="" {...register("bgNumber")}  disabled/>
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">{`${t("MY_APPLICATION_BG_GUARANTEE_ISSUE_DATE")}`} </h2>
                <OutlinedInput type="date" className="Inputcontrol" placeholder="" {...register("issuingBank")}  disabled/>
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">{`${t("BG_SUBMIT_EXPIRY_DATE")}`}</h2>
                <OutlinedInput type="date" className="Inputcontrol" placeholder="" {...register("validity")}  disabled/>
              </FormControl>
               &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">{`${t("MY_APPLICATION_BG_GUARANTEE_CLAIM_EXPIRY_DATE")}`} </h2>
                <OutlinedInput type="date" className="Inputcontrol" placeholder="" {...register("claimPeriod")}  disabled/>
              </FormControl>
               &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">{`${t("MY_APPLICATION_BG_GUARANTEE_AMOUNT")}`} </h2>
                <OutlinedInput type="text" className="Inputcontrol" placeholder="" {...register("amountInFig")}  disabled/>
              </FormControl>
            </div>
            <br></br>
             <div className="row gy-3">
                        <div className="col col-12">
                           <h2 className="FormLable">
                              {`${t("BG_SUBMIT_AMOUNT_IN_WORDS")}`}<span style={{ color: "red" }}>*</span>
                              </h2>
                              <input type="text" className="form-control" disabled {...register("amountInWords")}></input>
                        </div>
            </div>
            <br></br>
              <div className="row-12">
             <div className="col md={4} xxl lg-4">
              <FormControl>
                <h2 className="FormLable"> {`${t("RELEASE_BG")}`} </h2>
                  <ReactMultiSelect control={control} name="releaseCertificate" placeholder="Select Type" data={selectTypeData} labels="" />
                {/* <select
                    className="Inputcontrol"
                    class="form-control"
                    placeholder=""
                    {...register("typeOfBg")}
                  >
                    <option value="Complete"> Complete</option>
                    <option value="Partial">Partial</option>
                    <option value="Replace">Replace</option>
                  </select> */}
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">{`${t("RELEASE_BG_REPLACED_WITH")}`}
                {/* Bank Guarantee to be replaced with */}
                 </h2>
                <ReactMultiSelect control={control} name="bankGuaranteeReplacedWith" placeholder="Select Type" data={selectBankGuarantee} labels="" />
               {/* <select
                    className="Inputcontrol"
                    class="form-control"
                    placeholder=""
                    {...register("typeOfBg")}
                  >
                    <option value="BG-1"> BG-1</option>
                    <option value="BG-2">BG-2</option>
                    <option value="BG-N">BG-N</option>
                  </select> */}
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable"> {`${t("RELEASE_BG_REASON_FOR_REPLACEMENT")}`}
                  {/* Reason for replacement  */}
                  </h2>
               <textarea rows="2" cols="2" className="Inputcontrol" class="form-control" placeholder="" {...register("reasonForReplacement")} />
              </FormControl>
            </div>
            </div>
            </div>
            </div>
          </Collapse>
            &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
 <div className="table table-bordered table-responsive">
                        {/* <caption>List of users</caption> */}
                        <thead>
                          <tr>
                            <th class="fw-normal">{`${t("EXTENSION_SR_NO")}`}</th>
                            <th class="fw-normal">{`${t("EXTENSION_TYPE")}`}</th>
                            <th class="fw-normal">{`${t("EXTENSION_ATTACHMENT_DESCRIPTION")}`}</th>
                             <th class="fw-normal">{`${t("EXTENSION_UPLOAD_DOC")}`}</th>
                              <th class="fw-normal">{`${t("EXTENSION_ACTION")}`}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                             <td>{`${t("RELEASE_APPLICATION_PDF")}`}
                             {/* Application (pdf) */}
                             </td>
                              <td><input type="text" className="form-control"></input></td>
                               <td> <div>
                                    <label>
                                      <FileUpload style={{ cursor: "pointer" }} color="primary" />
                                      <input
                                        type="file"
                                        style={{ display: "none" }}
                                        accept="application/pdf/jpeg/png"
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "applicationCerficifate")}
                                      />
                                    </label>
                                    {watch("applicationCerficifate") && (
                                      <a onClick={() => getDocShareholding(watch("applicationCerficifate"), setLoader)} className="btn btn-sm ">
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    )}
                                  </div></td>
                              <td><DeleteIcon style={{ fill: "#ff1a1a" }} /></td>
                          </tr>
                           <tr>
                            <td>2</td>
                             <td>{`${t("RELEASE_COMPLETION_CERTIFICATE_PDF")}`}
                             {/* Completion Certificate (pdf) */}
                             </td>
                              <td><input type="text" className="form-control"></input></td>
                               <td> <div>
                                    <label>
                                      <FileUpload style={{ cursor: "pointer" }} color="primary" />
                                      <input
                                        type="file"
                                        style={{ display: "none" }}
                                        accept="application/pdf/jpeg/png"
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "applicationCerficifateDescription")}
                                      />
                                    </label>
                                    {watch("applicationCerficifateDescription") && (
                                      <a onClick={() => getDocShareholding(watch("applicationCerficifateDescription"), setLoader)} className="btn btn-sm ">
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    )}
                                  </div></td>
                               <td><DeleteIcon style={{ fill: "#ff1a1a" }} /></td>
                          </tr>
                           <tr>
                            <td>3</td>
                             <td>{`${t("EXTENSION_ANY_OTHER_DOC_PDF")}`}</td>
                              <td><input type="text" className="form-control"></input></td>
                               <td> <div>
                                    <label>
                                      <FileUpload style={{ cursor: "pointer" }} color="primary" />
                                      <input
                                        type="file"
                                        style={{ display: "none" }}
                                        accept="application/pdf/jpeg/png"
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "anyOtherDocumentDescription")}
                                      />
                                    </label>
                                    {watch("anyOtherDocumentDescription") && (
                                      <a onClick={() => getDocShareholding(watch("anyOtherDocumentDescription"), setLoader)} className="btn btn-sm ">
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    )}
                                  </div></td>
                              <td><DeleteIcon style={{ fill: "#ff1a1a" }} /></td>
                          </tr>
                        </tbody>
                        </div>
           
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
    
    </form>
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
  );
}

export default ReleaseNew;
