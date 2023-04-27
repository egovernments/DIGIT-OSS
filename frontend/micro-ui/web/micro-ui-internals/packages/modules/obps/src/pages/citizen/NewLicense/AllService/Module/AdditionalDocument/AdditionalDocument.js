import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import ReactMultiSelect from "../../../../../../../../../react-components/src/atoms/ReactMultiSelect";
import Spinner from "../../../../../../components/Loader";
import SearchLicenceComp from "../../../../../../components/SearchLicence";
import FileUpload from "@mui/icons-material/FileUpload";
import CusToaster from "../../../../../../components/Toaster";
import VisibilityIcon from "@mui/icons-material/Visibility";

const selectTypeData = [
  { label: "Application Number", value: "APPLICATIONNUMBER" },
  { label: "LOI Number", value: "LOINUMBER" },
  { label: "Licence Number", value: "LICENCENUMBER" },
];

const AdditionalDocument = () => {
  const userInfo = Digit.UserService.getUser()?.info || {};
  const [loader, setLoader] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showToastError, setShowToastError] = useState({ label: "", error: false, success: false });
  const [services, setServices] = useState([]);
  const [getData, setData] = useState([]);

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
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "DocumentsDetails",
  });

  const additionalDoc = (data) => {
    console.log("data", data);
    data["selectLicence"] = data?.selectLicence?.label;
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
      // console.log("asdasdasd", Resp?.data?.MdmsRes?.["common-masters"]?.services?.[0]?.businessService?.);
      const devPlan = Resp?.data?.MdmsRes?.["common-masters"]?.services?.[0]?.businessService?.map(function (data) {
        return { value: data?.name, label: data?.name };
      });
      setServices(devPlan);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    getAllservices();
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

  const getNumbers = async () => {
    const token = window?.localStorage?.getItem("token");
    const type = watch("numberType")?.value;
    const businessService = watch("allservices")?.value;
    setLoader(true);
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
      const Resp = await axios.post(`/tl-services/_getServices/_search?type=${type}&businessService=${businessService}`, payload);
      // console.log("setData", Resp);
      setLoader(false);
      const selectData = Resp?.data?.map((it) => {
        return { value: it, label: it };
      });
      if (Resp?.data?.length) setValue("licenceNo", { label: "", value: "" });
      else setValue("licenceNo", "");
      setData(selectData);
    } catch (error) {
      setLoader(false);
      return error;
    }
  };

  return (
    <div>
      {loader && <Spinner />}
      <form onSubmit={handleSubmit(additionalDoc)}>
        <div className="card" style={{ width: "126%", border: "5px solid #1266af" }}>
          <h4 style={{ fontSize: "25px", marginLeft: "21px" }} className="text-center">
            Additional Documents
          </h4>
          <div className="card">
            <div className="row gy-3">
              <div className="col col-4">
                <h2 className="FormLable">
                  List all services <span style={{ color: "red" }}>*</span>
                </h2>
                <ReactMultiSelect
                  control={control}
                  name="allservices"
                  placeholder="Select Service"
                  data={services}
                  labels=""
                  onChange={() => setValue("numberType", { label: "", value: "" })}
                />
              </div>
              {watch("allservices") && (
                <div className="col col-5">
                  <h2 className="FormLable">
                    Select Application No, LOI No, Licence No <span style={{ color: "red" }}>*</span>
                  </h2>
                  <ReactMultiSelect
                    control={control}
                    name="numberType"
                    placeholder="Select Type"
                    data={selectTypeData}
                    labels=""
                    onChange={getNumbers}
                  />
                </div>
              )}
              {watch("numberType")?.value && (
                <SearchLicenceComp
                  apiData={getData}
                  watch={watch}
                  register={register}
                  control={control}
                  setLoader={setLoader}
                  errors={errors}
                  setValue={setValue}
                  resetField={resetField}
                />
              )}
            </div>

            <div style={{ textAlignLast: "right", marginTop: "10px" }}>
              <button
                type="button"
                style={{ width: "100px", marginRight: 15 }}
                className="btn btn-primary"
                onClick={() => append({ documentName: "", document: "" })}
              >
                Add Row
              </button>
            </div>
            <div className="card-body">
              <div className="table-bd">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Sr. No</th>
                      <th>Document Description</th>
                      <th>Upload Document</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields?.map((item, index) => (
                      <tr key={item?.id}>
                        <td>{index + 1}</td>
                        <td>
                          <div>
                            {/* <label>Document Description</label> */}
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
                                Remove
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

            {/* <div className="card-body">
              <div className="table-bd">
                {fields?.map((item, index) => (
                  <div key={item?.id}>
                    <span> &nbsp;</span>
                    <div className="row" style={{ placeItems: "center" }}>
                      <div className="col col-1">
                        <span>{index + 1}.</span>
                      </div>
                      <div className="col col-4">
                        <label>Document Description</label>
                        <input type="text" className="form-control" {...register(`services.${index}.description`)} />
                      </div>
                      <div className="col col-3">
                        <h6 style={{ display: "flex" }}>
                          Upload Document<span style={{ color: "red" }}>*</span>
                        </h6>
                        <label>
                          <FileUpload style={{ cursor: "pointer" }} color="primary" />
                          <input
                            type="file"
                            style={{ display: "none" }}
                            onChange={(e) => getDocumentData(e?.target?.files[0], `services.${index}.document`)}
                            accept="application/pdf"
                          />
                        </label>
                      </div>
                      <div className="col col-3">
                        {index > 0 && (
                          <button type="button" style={{ float: "right" }} className="btn btn-primary" onClick={() => remove(index)}>
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}

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
};
export default AdditionalDocument;
