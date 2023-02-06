import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Row, Col } from "react-bootstrap";

const CommercialColonyInResidential = ({ register, watch }) => {
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
                <p className="mb-2">
                  Min. 4 Karam existing public rasta further linking to a higher order ex-isting road/ pub-lic rasta along with proposed any internal
                  cir-culation road.
                </p>
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
                <p className="mb-2">
                  Min. 11 ft. wide existing road and also abuts acquired align-ment of the sector road without any stay on the construc-tion.
                </p>
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
                <p className="mb-2">
                  Constructed sector road or internal circula-tion road of min. 18m/24m (licenced) part of the approved sectoral plan and further
                  leadup up to at least 4 karam wide public ras-ta.
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="px-2">
                <p className="mb-2">4.</p>
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
export default CommercialColonyInResidential;
