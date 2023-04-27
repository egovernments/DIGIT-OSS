import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import FileUpload from "@mui/icons-material/FileUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Spinner from "../../../../../../components/Loader";
import { getDocShareholding } from "../../../docView/docView.help";
import SearchLicenceComp from "../../../../../../components/SearchLicence";
import CusToaster from "../../../../../../components/Toaster";

const Standard = () => {
  const [showToastError, setShowToastError] = useState({ label: "", error: false, success: false });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loader, setLoader] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
    resetField,
  } = useForm({});

  const standardDesign = async (data) => {
    console.log("data", data);
    data["selectLicence"] = data?.selectLicence?.label;
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
      // setApplicationNumber(Resp.data.changeBeneficial.applicationNumber);
    } catch (error) {}
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
      setSelectedFiles([...selectedFiles, file.name]);
      setLoader(false);
      setShowToastError({ label: "File Uploaded Successfully", error: false, success: true });
    } catch (error) {
      setLoader(false);
      return error;
    }
  };

  return (
    <div>
      {loader && <Spinner />}
      <form onSubmit={handleSubmit(standardDesign)}>
        <div className="card" style={{ width: "126%", border: "5px solid #1266af" }}>
          <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Approval of Standard Design</h4>
          <div className="card">
            <div className="row-12">
              <div className="col md={4} xxl lg-4">
                <SearchLicenceComp
                  watch={watch}
                  register={register}
                  control={control}
                  setLoader={setLoader}
                  errors={errors}
                  setValue={setValue}
                  resetField={resetField}
                />
              </div>
            </div>
            <div className="row gy-3 mt-5">
              <div className="col col-4">
                <h6 style={{ display: "flex" }}>
                  Standard drawing designs<span style={{ color: "red" }}>*</span>
                </h6>
                <label>
                  <FileUpload style={{ cursor: "pointer" }} color="primary" />
                  <input
                    type="file"
                    style={{ display: "none" }}
                    onChange={(e) => getDocumentData(e?.target?.files[0], "standardDrawingDesigns")}
                    accept="application/pdf"
                  />
                </label>
                {watch("standardDrawingDesigns") && (
                  <a onClick={() => getDocShareholding(watch("standardDrawingDesigns"), setLoader)} className="btn btn-sm ">
                    <VisibilityIcon color="info" className="icon" />
                  </a>
                )}
              </div>
              <div className="col col-4">
                <h6 style={{ display: "flex" }}>
                  Any other Document<span style={{ color: "red" }}>*</span>
                </h6>
                <label>
                  <FileUpload style={{ cursor: "pointer" }} color="primary" />
                  <input
                    type="file"
                    style={{ display: "none" }}
                    onChange={(e) => getDocumentData(e?.target?.files[0], "anyOtherDoc")}
                    accept="application/pdf"
                  />
                </label>
                {watch("anyOtherDoc") && (
                  <a onClick={() => getDocShareholding(watch("anyOtherDoc"), setLoader)} className="btn btn-sm ">
                    <VisibilityIcon color="info" className="icon" />
                  </a>
                )}
              </div>
            </div>

            <div class="row">
              <div class="col-sm-12 text-right">
                <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
                  Submit
                </button>
              </div>
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
};

export default Standard;
