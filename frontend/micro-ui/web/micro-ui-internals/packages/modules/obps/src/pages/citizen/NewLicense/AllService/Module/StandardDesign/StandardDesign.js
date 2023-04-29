import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";
import FileUpload from "@mui/icons-material/FileUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Dialog } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Spinner from "../../../../../../components/Loader";
import { getDocShareholding } from "../../../docView/docView.help";
import SearchLicenceComp from "../../../../../../components/SearchLicence";
import CusToaster from "../../../../../../components/Toaster";
import { useTranslation } from "react-i18next";

const Standard = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const userInfo = Digit.UserService.getUser()?.info || {};
  const [showToastError, setShowToastError] = useState({ label: "", error: false, success: false });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [applicationNumber, setApplicationNumber] = useState("");
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);

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
    const token = window?.localStorage?.getItem("token");
    console.log("data", data);
    data["selectLicence"] = data?.selectLicence?.label;
    const numberLic = data?.licenceNo;
    delete data?.licenceNo;
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
        ApprovalStandardEntity: {
          licenseNo: numberLic,
          standardDrawingDesigns: data?.standardDrawingDesigns,
          anyOtherDoc: data?.anyOtherDoc,
          tenantId: "hr",
          action: "APPLY",
          newAdditionalDetails: {
            selectLicence: data?.selectLicence?.label,
            validUpto: data?.validUpto,
            colonizerName: data?.colonizerName,
            // periodOfRenewal: "",
            colonyType: data?.colonyType,
            areaAcres: data?.areaAcres,
            sectorNo: data?.sectorNo,
            revenueEstate: data?.revenueEstate,
            developmentPlan: data?.developmentPlan,
            tehsil: data?.tehsil,
            district: data?.district,
          },
        },
      };
      const Resp = await axios.post("/tl-services/_ApprovalStandard/_create", postDistrict);
      setApplicationNumber(Resp?.data?.ApprovalStandardEntity?.[0]?.applicationNumber);
      setOpen(true);
      // setApplicationNumber(Resp.data.changeBeneficial.applicationNumber);
    } catch (error) {
      return error;
    }
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

  const handleClose = () => {
    setOpen(false);
    history.push("/digit-ui/citizen");
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
                  {`${t("SD_STANDARD_DRAWING_DESIGNS")}`}
                  {/* Standard drawing designs */}
                  <span style={{ color: "red" }}>*</span>
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
                  {`${t("SD_ANY_OTHER_DOCUMENT")}`}
                  {/* Any other Document */}
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
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Service Plan Submission</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p>
              Your Approval Of Standard Design is submitted successfully
              <span>
                <CheckCircleOutlineIcon style={{ color: "blue", variant: "filled" }} />
              </span>
            </p>
            <p>
              Please Note down your Application Number <span style={{ padding: "5px", color: "blue" }}>{applicationNumber}</span> for further
              assistance
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Standard;
