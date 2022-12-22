import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.css";
import { Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import VisibilityIcon from "@mui/icons-material/Visibility";

const LayoutPlan = (props) => {
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
          Upload Layout Plan. <span style={{ color: "red" }}>*</span>
        </h6>
        <div>
          <input type="file" className="form-control" onChange={(e) => getDocumentData(e?.target?.files[0], "uploadLayoutPlan")} />
        </div>
      </div>
      {/* {fileStoreId?.uploadLayoutPlan ? (
            <a onClick={() => getDocShareholding(fileStoreId?.uploadLayoutPlan)} className="btn btn-sm col-md-6">
              <VisibilityIcon color="info" className="icon" />
            </a>
          ) : (
            <p></p>
          )}
        </h6>
        <div>
          <input type="file" className="form-control" onChange={(e) => getDocumentData(e?.target?.files[0], "uploadLayoutPlan")} />
        </div>

        <h3 className="error-message" style={{ color: "red" }}>
          {errors?.uploadLayoutPlan && errors?.uploadLayoutPlan?.message}
        </h3>
      </div> */}
    </Row>
  );
};
export default LayoutPlan;
