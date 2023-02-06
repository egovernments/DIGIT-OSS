import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Row, Col } from "react-bootstrap";

const CommercialLicense = ({ register, watch }) => {
  return (
    <div>
      <label>
        <h2>
          Approach Type (Type of Policy) <span style={{ color: "red" }}>*</span>
        </h2>
      </label>
      <div className="table table-bordered table-responsive">
        <thead>
          <tr>
            <td>Sr. No.</td>
            <td>Type of Norms</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className="px-2">
                <p className="mb-2">1.</p>
              </div>
            </td>
            <td>
              <div className="px-2">
                <p className="mb-2">Existing service road along with sector dividing road.</p>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="px-2">
                <p className="mb-2">2.</p>
              </div>
            </td>
            <td>
              <div className="px-2">
                <p className="mb-2">Existing 4 karam public rasta and proposed ser-vice road along with sector di-viding road.</p>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="px-2">
                <p className="mb-2">3.</p>
              </div>
            </td>
            <td>
              <div className="px-2">
                <p className="mb-2">Any other.</p>
              </div>
            </td>
          </tr>
        </tbody>
      </div>
    </div>
  );
};
export default CommercialLicense;
