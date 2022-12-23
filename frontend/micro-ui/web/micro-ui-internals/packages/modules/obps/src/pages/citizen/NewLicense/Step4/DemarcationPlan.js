import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.css";
import { Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
// import { getDocShareholding } from "../docView/docView.help";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { VALIDATION_SCHEMA } from "../../../../utils/schema/step4";

const DemarcationPlan = (props) => {
  const [fileStoreId, setFileStoreId] = useState({});
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm({
    mode: "onChange",
    // reValidateMode: "onChange",
    // resolver: yupResolver(VALIDATION_SCHEMA),
    shouldFocusError: true,
  });
  const [loader, setLoader] = useState(false);
  const getDocumentData = async (file, fieldName) => {
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
      setLoader(false);
    } catch (error) {
      setLoader(false);
      return error.message;
    }
  };

  return (
    <Row className="ml-auto" style={{ marginBottom: 5 }}>
      <div className="col col-12">
        <h6 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
          Demarcation plan.<span style={{ color: "red" }}>*</span>
        </h6>
        <div>
          <input type="file" className="form-control" onChange={(e) => getDocumentData(e?.target?.files[0], "demarcationPlan")} />
        </div>
        {/* {fileStoreId?.demarcationPlan ? (
            <a onClick={() => getDocShareholding(fileStoreId?.demarcationPlan)} className="btn btn-sm col-md-6">
              <VisibilityIcon color="info" className="icon" />
            </a>
          ) : (
            <p></p>
          )}
        </h6>
        <div>
          <input type="file" className="form-control" onChange={(e) => getDocumentData(e?.target?.files[0], "demarcationPlan")} />
        </div>

        <h3 className="error-message" style={{ color: "red" }}>
          {errors?.demarcationPlan && errors?.demarcationPlan?.message}
        </h3> */}
      </div>
    </Row>
  );
};
export default DemarcationPlan;
