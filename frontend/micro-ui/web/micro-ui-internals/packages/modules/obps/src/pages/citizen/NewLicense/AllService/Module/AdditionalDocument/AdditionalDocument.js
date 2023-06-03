import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { Button } from "react-bootstrap";
import { Dialog } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ReactMultiSelect from "../../../../../../../../../react-components/src/atoms/ReactMultiSelect";
import Spinner from "../../../../../../components/Loader";
import FileUpload from "@mui/icons-material/FileUpload";
import CusToaster from "../../../../../../components/Toaster";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useTranslation } from "react-i18next";
import { getDocShareholding } from "../../../docView/docView.help";
import { useHistory } from "react-router-dom";

const selectTypeData = [
  { label: "Application Number", value: "applicationNumber" },
  { label: "LOI Number", value: "loiNumber" },
  { label: "Licence Number", value: "licenceNumber" },
];

const AdditionalDocument = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const userInfo = Digit.UserService.getUser()?.info || {};
  const [loader, setLoader] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showToastError, setShowToastError] = useState({ label: "", error: false, success: false });
  const [services, setServices] = useState([]);
  const [getData, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [DataSection, setDataSection] = useState([]);
  const [show, setShow] = useState(false);

  const {
    watch,
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    resetField,
    reset,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: "",
    shouldFocusError: true,
    defaultValues: {
      DocumentsDetails: [
        {
          documentName: "",
          document: "",
          applicationSection: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "DocumentsDetails",
  });

  const additionalDoc = async (data) => {
    const token = window?.localStorage?.getItem("token");
    setLoader(true);

    const updatedDocuments = data?.DocumentsDetails?.map((document) => {
      const { applicationSection, ...rest } = document;
      const { value } = applicationSection;
      return { ...rest, applicationSection: value };
    });

    data["DocumentsDetails"] = updatedDocuments;
    data["businessService"] = data?.allservices?.value;
    data["licenceNumber"] = data?.licenceNumber?.value;

    data["username"] = userInfo?.userName;
    data["developerName"] = userInfo?.name;
    delete data?.numberType;
    delete data?.allservices;
    delete data?.applicationSections;
    delete data?.number;

    const payload = {
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
      AddtionalDocuments: {
        ...data,
      },
    };
    try {
      const Resp = await axios.post("/tl-services/_additionalDocuments/_create", payload);
      setLoader(false);
      setOpen(true);
      // setApplicationNumber(Resp.data.changeBeneficial.applicationNumber);
    } catch (error) {
      setLoader(false);
      return error;
    }
  };

  const getAllservices = async (val) => {
    const payload = {
      RequestInfo: {
        apiId: "Rainmaker",
        ver: "v1",
        ts: 0,
        action: "_search",
        did: "",
        key: "",
        msgId: "090909",
        authToken: "",
        correlationId: null,
      },
      MdmsCriteria: {
        tenantId: "hr",
        moduleDetails: [
          {
            tenantId: "hr",
            moduleName: "common-masters",
            masterDetails: [
              {
                name: "services",
              },
            ],
          },
        ],
      },
    };
    try {
      const Resp = await axios.post("/egov-mdms-service/v1/_search", payload);
      const devPlan = Resp?.data?.MdmsRes?.["common-masters"]?.services?.[0]?.businessService?.map(function (data) {
        return { value: data?.name, label: data?.name };
      });
      setServices(devPlan);
    } catch (error) {
      return error;
    }
  };

  const getApplicationSection = async () => {
    const payload = {
      RequestInfo: {
        apiId: "Rainmaker",
        ver: "v1",
        ts: 0,
        action: "_search",
        did: "",
        key: "",
        msgId: "090909",
        requesterId: "",
        authToken: "",
        correlationId: null,
      },
      MdmsCriteria: {
        tenantId: "hr",
        moduleDetails: [
          {
            moduleName: "common-masters",

            tenantId: "hr",

            masterDetails: [
              {
                name: "ApplicationSection",
              },
            ],
          },
        ],
      },
    };
    try {
      const Resp = await axios.post(`/egov-mdms-service/v1/_search`, payload);
      const section = Resp?.data?.MdmsRes?.["common-masters"]?.ApplicationSection?.map(function (data) {
        return { value: data?.type, label: data?.type };
      });
      setDataSection(section);
    } catch (error) {
      return error;
    }
  };

  const getAlllicences = async (serviceName) => {
    const token = window?.localStorage?.getItem("token");
    const payload = {
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
    };
    try {
      const Resp = await axios.post(`/tl-services/_getServices/_search?businessService=${serviceName}`, payload);
      const appNumbers = Resp?.data?.applicationNumbers?.map(function (data) {
        return { value: data, label: data };
      });
      setShow(true);
      setData(appNumbers);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    getAllservices();
    getApplicationSection();
  }, []);

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
      <form onSubmit={handleSubmit(additionalDoc)}>
        <div className="card" style={{ width: "126%", border: "5px solid #1266af" }}>
          <h4 style={{ fontSize: "25px", marginLeft: "21px" }} className="text-center">
            {`${t("AD_ADDITIONAL_DOCUMENTS")}`}
            {/* Additional Documents */}
          </h4>
          <div className="card">
            <div className="row gy-3">
              <div className="col col-4">
                <h2 className="FormLable">
                  {`${t("AD_LIST_ALL_SERVICES")}`}
                  {/* List all services  */}
                  <span style={{ color: "red" }}>*</span>
                </h2>
                <ReactMultiSelect
                  control={control}
                  name="allservices"
                  placeholder="Select Service"
                  data={services}
                  labels=""
                  onChange={(e) => {
                    resetField("licenceNumber");
                    setShow(false);
                    getAlllicences(e?.value);
                  }}
                />
              </div>
              {show && (
                <div className="col col-5">
                  <h2 className="FormLable">
                    {/* {`${t("AD_SELECT_APPLICATION_NO_LOI_NO_LICENCE_NO ")}`} */}
                    Select Application Number
                    {/* getData */}
                    {/* Select Application No, LOI No, Licence No  */}
                    <span style={{ color: "red" }}>*</span>
                  </h2>
                  <ReactMultiSelect control={control} name="licenceNumber" placeholder="Select Number" data={getData} labels="" />
                </div>
              )}
            </div>

            <div style={{ textAlignLast: "right", marginTop: "10px" }}>
              <button
                type="button"
                style={{ width: "100px", marginRight: 15 }}
                className="btn btn-primary"
                onClick={() => append({ documentName: "", document: "", applicationSection: "" })}
              >
                {`${t("AD_ADD_ROW")}`}
                {/* Add Row */}
              </button>
            </div>
            <div className="card-body">
              <div className="table-bd">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>
                        {`${t("AD_SR_NO")}`}
                        {/* Sr. No */}
                      </th>
                      <th>
                        {`${t("AD_APPLICATION_SECETION")}`}
                        {/* Select section */}
                      </th>
                      <th>
                        {`${t("AD_DOCUMENT_DESCRIPTION")}`}
                        {/* Document Description */}
                      </th>
                      <th>
                        {`${t("AD_UPLOAD_DOCUMENT")}`}
                        {/* Upload Document */}
                      </th>

                      <th>
                        {`${t("AD_ACTION")}`}
                        {/* Action */}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields?.map((item, index) => (
                      <tr key={item?.id}>
                        <td>{index + 1}</td>
                        <td>
                          <ReactMultiSelect
                            control={control}
                            name={`DocumentsDetails.${index}.applicationSection`}
                            placeholder="Select Section"
                            data={DataSection}
                            labels=""
                          />
                        </td>
                        <td>
                          <div>
                            <input type="text" className="form-control" {...register(`DocumentsDetails.${index}.documentName`)} />
                          </div>
                        </td>
                        <td style={{ textAlignLast: "center" }}>
                          <label>
                            <FileUpload style={{ cursor: "pointer" }} color="primary" />
                            <input
                              type="file"
                              style={{ display: "none" }}
                              onChange={(e) => getDocumentData(e?.target?.files[0], `DocumentsDetails.${index}.document`)}
                              accept="application/pdf"
                            />
                          </label>
                          {watch(`DocumentsDetails.${index}.document`) && (
                            <a onClick={() => getDocShareholding(watch(`DocumentsDetails.${index}.document`), setLoader)} className="btn btn-sm ">
                              <VisibilityIcon color="info" className="icon" />
                            </a>
                          )}
                        </td>
                        <td>
                          <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center" }}>
                            {index > 0 && (
                              <button type="button" style={{ float: "right" }} className="btn btn-primary" onClick={() => remove(index)}>
                                {`${t("AD_REMOVE")}`}
                                {/* Remove */}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "right", marginTop: "20px" }}>
              <button
                style={{
                  background: "#024f9d",
                  color: "white",
                  borderRadius: "5px",
                  padding: " 5px 15px",
                  marginLeft: "10px",
                  cursor: "pointer",
                  width: "200px",
                }}
                type="submit"
                id="btnSearch"
                class=""
              >
                {`${t("AD_SUBMIT")}`}
                {/* Submit */}
              </button>
            </div>
          </div>
        </div>
      </form>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Service Plan Submission</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p>
              {/* {`${t("TL_YOUR_TRANSFER_OF_LICENSE_IS_SUBMITTED_SUCCESSFULLY")}`} */}
              Your Documents has been added successfully
              <span>
                <CheckCircleOutlineIcon style={{ color: "blue", variant: "filled" }} />
              </span>
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            {`${t("TL_OK")}`}
            {/* Ok */}
          </Button>
        </DialogActions>
      </Dialog>
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
export default AdditionalDocument;
