import React, { useState, useEffect } from "react";
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
import { Card, Row, Col } from "react-bootstrap";
import { Button, Form } from "react-bootstrap";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useForm } from "react-hook-form";
import Collapse from "react-bootstrap/Collapse";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FileUpload from "@mui/icons-material/FileUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import { getDocShareholding } from "../../../../../../tl/src/pages/employee/ScrutinyBasic/ScrutinyDevelopment/docview.helper";
import CusToaster from "../../../../components/Toaster";
import { Modal, ModalHeader, ModalBody, ModalFooter, Label } from "reactstrap";
import { Input } from "antd";
import ReactMultiSelect from "../../../../../../../react-components/src/atoms/ReactMultiSelect";
import SubmitNew from "./SubmitNew";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
function RenewNew() {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const [modal, setmodal] = useState(false);
  const [modal1, setmodal1] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [open3, setOpen3] = useState(false);
  const {t}=useTranslation();
  const {id} = useParams();
  const [applicationNumber, setApplicationNumber] = useState('');
   const [showToastError, setShowToastError] = useState({ label: "", error: false, success: false });
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
    watch,
  } = useForm({});
  const selectTypeData = [{ label: "Indian", value: "indian" },
{
  label: "Foreign", value: "foreign"
}];
  const [fileStoreId, setFileStoreId] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loader, setLoader] = useState(false);
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
   
    const bankRenew = async (data) => {
    console.log("data",data)
    const token = window?.localStorage?.getItem("token");
    const userInfo = Digit.UserService.getUser()?.info || {};
    const applicationNo = data?.newBankGuaranteeList?.[0]?.applicationNumber
     console.log("applicationNo",applicationNo)
    try {
      const postDistrict = {
        NewBankGuaranteeRequest: [
          {
            applicationNumber:id,
            
            ...data,
            updateType:"EXTEND",
           originCountry:data?.originCountry?.label
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
  return (
    <div>
    <form onSubmit={handleSubmit(bankRenew)}>
         <div className="card" style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>{`${t("EXTENSION_BG_HEADING")}`}
        {/* Extension of Bank Guarantee */}
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
        <span style={{ color: "#817f7f", fontSize: 14 }} className="" >
          - BG Detail
        </span>
        {open4 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
       <Collapse in={open4}>
        <div className="card">
          <div className="row-12">
            <div className="col md={4} xxl lg-3">
              <FormControl>
                <h2 className="FormLable">{`${t("MY_APPLICATION_BG_GUARANTEE_NO")}`}</h2>
                <OutlinedInput type="text" className="Inputcontrol" placeholder="" {...register("bgNumber")}  disabled/>
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">{`${t("MY_APPLICATION_BG_GUARANTEE_ISSUE_DATE")}`} </h2>
                <OutlinedInput type="date" className="Inputcontrol" placeholder="" {...register("issuingBank")}  disabled/>
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">{`${t("BG_SUBMIT_EXPIRY_DATE")}`} </h2>
                <OutlinedInput type="date" className="Inputcontrol" placeholder="" {...register("validity")}  disabled/>
              </FormControl>
               &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">{`${t("MY_APPLICATION_BG_GUARANTEE_CLAIM_EXPIRY_DATE")}`}</h2>
                <OutlinedInput type="date" className="Inputcontrol" placeholder="" {...register("claimPeriod")}  disabled/>
              </FormControl>
               &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">{`${t("MY_APPLICATION_BG_GUARANTEE_AMOUNT")}`} </h2>
                <OutlinedInput type="text" className="Inputcontrol" placeholder="" {...register("amountInFig")}  disabled/>
              </FormControl>
            </div>
            <br></br>
             <div className="row-12">
 <div className="col md={4} xxl lg-3">
              <FormControl>
                <h2 className="FormLable">{`${t("EXTENSION_ISSUING_BANK")}`}
                {/* Issuing Bank */}
                 </h2>
                <OutlinedInput type="text" className="Inputcontrol" placeholder="" {...register("issuingBank")} disabled />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">{`${t("BG_SUBMIT_COUNTRY_ORIGIN")}`}</h2>
                <OutlinedInput type="text" className="Inputcontrol" placeholder="" {...register("originCountry")} disabled />
              </FormControl>
            
            </div>
            </div>

             <br></br>
           <div className="row gy-3">
                        <div className="col col-12">
                           <h2 className="FormLable">
                              {`${t("BG_SUBMIT_AMOUNT_IN_WORDS")}`}<span style={{ color: "red" }}>*</span>
                              </h2>
                              <input type="text" className="form-control" {...register("amountInWords")} disabled></input>
                        </div>
            </div>
            </div>
            </div>
          </Collapse>
            <br></br>
             <div
        className="collapse-header"
        onClick={() => setOpen3(!open3)}
        aria-controls="example-collapse-text"
        aria-expanded={open3}
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
       <Collapse in={open3}>
             <div className="card">
              <div className="row-12">
             <div className="col md={4} xxl lg-3">
              <FormControl>
                <h2 className="FormLable">{`${t("MY_APPLICATION_BG_GUARANTEE_NO")}`} </h2>
                <OutlinedInput type="text" className="Inputcontrol" placeholder="" {...register("bgNumber")}  />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">{`${t("EXTENSION_DATE_OF_AMENDMENT")}`}
                {/* Date of amendment */}
                </h2>
                <OutlinedInput type="date" className="Inputcontrol" placeholder="" {...register("dateOfAmendment")}  />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">{`${t("EXTENSION_AMENDMENT_EXPIRY_DATE")}`}
                {/* Amendment expiry date  */}
                </h2>
                <OutlinedInput type="date" className="Inputcontrol" placeholder="" {...register("amendmentExpiryDate")}  />
              </FormControl>
               &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">{`${t("EXTENSION_AMENDMENT_CLAIM_EXPIRY_DATE")}`}
                {/* Amendment claim expiry date  */}
                 </h2>
                <OutlinedInput type="date" className="Inputcontrol" placeholder="" {...register("amendmentClaimExpiryDate")} />
              </FormControl>
              </div>
              </div>
              <br></br>
                    <div className="row-12">
 <div className="col md={4} xxl lg-3">
    <FormControl>
                <h2 className="FormLable">{`${t("MY_APPLICATION_BG_GUARANTEE_AMOUNT")}`} </h2>
                <OutlinedInput type="text" className="Inputcontrol" placeholder="" {...register("amountInFig")}  />
              </FormControl>
               &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">{`${t("EXTENSION_ISSUING_BANK")}`} </h2>
                <OutlinedInput type="text" className="Inputcontrol" placeholder="" {...register("issuingBank")}  />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">{`${t("BG_SUBMIT_COUNTRY_ORIGIN")}`}</h2>
                 <ReactMultiSelect control={control} name="originCountry" placeholder="Select Type" data={selectTypeData} labels="" />

                
              </FormControl>
            
            </div>
            </div>
            <br></br>
                <div className="row gy-3">
                        <div className="col col-12">
                           <h2 className="FormLable">
                               {`${t("BG_SUBMIT_AMOUNT_IN_WORDS")}`}<span style={{ color: "red" }}>*</span>
                              </h2>
                              <input type="text" className="form-control" {...register("amountInWords")}></input>
                        </div>
            </div>
            </div>
           </Collapse>
            <br></br>
          <div className="col-12">
                  <label>
                    <h2> {`${t("BG_SUBMIT_HARDCOPY_SUBMITTED_TCP")}`} </h2>
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
                        // onClick={handleClickOpen}
                      />
                      &nbsp; No &nbsp;&nbsp;
                    </label>
                   
                  </label>
                </div>
            &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
 <div className="table table-bordered table-responsive">
                        {/* <caption>List of users</caption> */}
                        <thead>
                          <tr>
                            <th class="fw-normal">{`${t("EXTENSION_SR_NO")}`}
                            {/* Sr. No. */}
                            </th>
                            <th class="fw-normal">{`${t("EXTENSION_TYPE")}`}</th>
                            <th class="fw-normal">{`${t("EXTENSION_ATTACHMENT_DESCRIPTION")}`}
                            {/* Attachment description */}
                            </th>
                             <th class="fw-normal">{`${t("EXTENSION_UPLOAD_DOC")}`}
                             {/* Upload document */}
                             </th>
                              {/* <th class="fw-normal">{`${t("EXTENSION_ACTION")}`}</th> */}
                          </tr>
                        </thead>
                        <tbody>
                           <tr>
                            <td>1</td>
                             <td>{`${t("EXTENSION_BANK_GUARANTEE_PDF")}`}
                             {/* Bank Guarantee(pdf) */}
                             </td>
                              <td><input type="text" className="form-control" {...register("bankGurenteeCertificateDescription")}></input></td>
                               <td>  <div>
                                    <label>
                                      <FileUpload style={{ cursor: "pointer" }} color="primary" />
                                      <input
                                        type="file"
                                        style={{ display: "none" }}
                                        accept="application/pdf/jpeg/png"
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "bankGurenteeCertificate")}
                                      />
                                    </label>
                                    {watch("bankGurenteeCertificate") && (
                                      <a onClick={() => getDocShareholding(watch("bankGurenteeCertificate"), setLoader)} className="btn btn-sm ">
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    )}
                                  </div></td>
                               {/* <td><DeleteIcon style={{ fill: "#ff1a1a" }} /></td> */}
                          </tr>
                           <tr>
                            <td>2</td>
                             <td>{`${t("EXTENSION_ANY_OTHER_DOC_PDF")}`}
                             {/* Any other document (pdf) */}
                             </td>
                              <td><input type="text" className="form-control" {...register("anyOtherDocumentDescription")}></input></td>
                               <td> <div>
                                    <label>
                                      <FileUpload style={{ cursor: "pointer" }} color="primary" />
                                      <input
                                        type="file"
                                        style={{ display: "none" }}
                                        accept="application/pdf/jpeg/png"
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "anyOtherDocument")}
                                      />
                                    </label>
                                    {watch("anyOtherDocument") && (
                                      <a onClick={() => getDocShareholding(watch("anyOtherDocument"), setLoader)} className="btn btn-sm ">
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    )}
                                  </div></td>
                               {/* <td><DeleteIcon style={{ fill: "#ff1a1a" }} /></td> */}
                          </tr>
                        </tbody>
                        </div>
           
           <div class="row-12" className="align-right">
              <div className="col-4">
               <button type="submit"  class="btn btn-primary btn-md center-block">
                  Cancel
               </button>
                &nbsp;
                 <button type="submit"  class="btn btn-primary btn-md center-block">
                  Submit
               </button>
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

export default RenewNew;
