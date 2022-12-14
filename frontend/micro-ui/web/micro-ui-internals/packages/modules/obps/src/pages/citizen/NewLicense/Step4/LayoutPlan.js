import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Row, Col } from "react-bootstrap";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getDocShareholding } from "../docView/docView.help";

const LayoutPlan = ({ register }) => {
  return (
    <Row className="ml-auto" style={{ marginBottom: 5 }}>
      <div className="col col-12">
        <h6 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
          Upload Layout Plan. <span style={{ color: "red" }}>*</span>&nbsp;&nbsp;&nbsp;&nbsp;
          <ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon> &nbsp;&nbsp;
          <VisibilityIcon color="primary" onClick={() => getDocShareholding(fileStoreId?.uploadLayoutPlan)}>
            {" "}
          </VisibilityIcon>
        </h6>
        <input type="file" className="form-control" onChange={(e) => getDocumentData(e?.target?.files[0], "uploadLayoutPlan")} />
      </div>
    </Row>
  );
};
export default LayoutPlan;
