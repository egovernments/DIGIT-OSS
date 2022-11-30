import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Row, Col } from "react-bootstrap";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";

const LayoutPlan = ({ register }) => {
  return (
    <Row className="ml-auto" style={{ marginBottom: 5 }}>
      <div className="col col-12">
        <h6 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
          Upload Layout Plan. &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
        </h6>
        <input type="file" className="form-control" onChange={(e) => getDocumentData(e?.target?.files[0], "uploadLayoutPlan")} />
      </div>
    </Row>
  );
};
export default LayoutPlan;
