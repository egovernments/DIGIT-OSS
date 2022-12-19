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
