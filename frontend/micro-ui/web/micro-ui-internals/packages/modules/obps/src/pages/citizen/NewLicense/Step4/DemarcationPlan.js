import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Row, Col } from "react-bootstrap";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getDocShareholding } from "../docView/docView.help";

const DemarcationPlan = ({ register }) => {
  return (
    <Row className="ml-auto" style={{ marginBottom: 5 }}>
      <div className="col col-12">
        <h6 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
          Demarcation plan. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon> &nbsp;&nbsp;
          <VisibilityIcon color="primary" onClick={() => getDocShareholding(fileStoreId?.demarcationPlan)}>
            {" "}
          </VisibilityIcon>
        </h6>
        <input type="file" className="form-control" onChange={(e) => getDocumentData(e?.target?.files[0], "demarcationPlan")} />
      </div>
    </Row>
  );
};
export default DemarcationPlan;
