import React, { useState } from "react";
import { Button } from "@material-ui/core";
import FormControl from "@mui/material/FormControl";
import { useForm } from "react-hook-form";
import OutlinedInput from "@mui/material/OutlinedInput";
import axios from "axios";
import { getDocShareholding } from "../../../docView/docView.help";
function Standard() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm({});
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");

  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };
  // const { register, handleSubmit } = useForm();
  const [beneficialInterestLabel, setBeneficialInterestLabel] = useState([]);
  // const standardDesign = (data) => console.log(data);
  const standardDesign = async (data) => {
    console.log("data", data);
    const token = window?.localStorage?.getItem("token");
    const userInfo = Digit.UserService.getUser()?.info || {};
    try {
      const postDistrict = {
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
        ApprovalStandardEntity: [
          {
            ...data,
          },
        ],
      };
      const Resp = await axios.post("/tl-services/_ApprovalStandard/_create", postDistrict);
      setBeneficialInterestLabel(Resp.data);
      // setApplicationNumber(Resp.data.changeBeneficial.applicationNumber);
    } catch (error) {}
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
      // if (fieldName === "uploadBg") {
      //   setValue("uploadBgFileName", file.name);
      // }
      // if (fieldName === "tcpSubmissionReceived") {
      //   setValue("tcpSubmissionReceivedFileName", file.name);
      // }
      setSelectedFiles([...selectedFiles, file.name]);
      setLoader(false);
      setShowToast({ key: "success" });
    } catch (error) {
      setLoader(false);
      return error.message;
    }
  };
  return (
    <form onSubmit={handleSubmit(standardDesign)}>
      <div className="card" style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Approval of Standard Design</h4>
        <div className="card">
          <div className="row-12">
            <div className="col md={4} xxl lg-4">
              <FormControl>
                <h2 className="FormLable">
                  License No . <span style={{ color: "red" }}>*</span>
                </h2>
                <OutlinedInput type="number" className="Inputcontrol" {...register("licenseNo")} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">
                  Plan <span style={{ color: "red" }}>*</span>
                </h2>
                <div>
                  <input
                    type="file"
                    className="form-control"
                    accept="application/pdf/jpeg/png"
                    onChange={(e) => getDocumentData(e?.target?.files[0], "plan")}
                  />

                  {watch("plan") && <a onClick={() => getDocShareholding(watch("plan"), setLoader)} className="btn btn-sm "></a>}
                </div>
                {/* <input type="file" placeholder="" className="form-control" {...register("plan")} /> */}
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">
                  {" "}
                  Any other Document <span style={{ color: "red" }}>*</span>
                </h2>
                <div>
                  <input
                    type="file"
                    className="form-control"
                    accept="application/pdf/jpeg/png"
                    onChange={(e) => getDocumentData(e?.target?.files[0], "otherDocument")}
                  />

                  {watch("otherDocument") && <a onClick={() => getDocShareholding(watch("otherDocument"), setLoader)} className="btn btn-sm "></a>}
                </div>
                {/* <input type="file" placeholder="" className="form-control" {...register("otherDocument")} /> */}
              </FormControl>
            </div>
          </div>
          <br></br>
          <div className="row-12">
            <div className="col md={4} xxl lg-4">
              <FormControl>
                <h2 className="FormLable">
                  {" "}
                  Amount <span style={{ color: "red" }}>*</span>
                </h2>

                <OutlinedInput type="text" required={true} disabled={true} placeholder="" className="Inputcontrol" {...register("amount")} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <Button variant="contained" class="btn btn-primary btn-md center-block" type="submit">
                  Pay
                </Button>
              </FormControl>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12 text-right">
              <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
                Submit
              </button>
            </div>
            <div class="col-sm-12 text-right">
              <button id="btnSearch" class="btn btn-primary btn-md center-block" style={{ marginTop: "-58px", marginRight: "97px" }}>
                Save as Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Standard;
