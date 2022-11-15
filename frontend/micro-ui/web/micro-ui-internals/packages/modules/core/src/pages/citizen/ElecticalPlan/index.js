import React, { useState, useEffect } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import axios from "axios";

const electricalPlanService = () => {
  const { register, handleSubmit } = useForm();
  const [developerDataLabel, setDeveloperDataLabel] = useState([]);
  const electricPlan = async (data) => {
    console.log(data);
    try {
      const postDistrict = {
        requestInfo: {
          api_id: "1",
          ver: "1",
          ts: null,
          action: "create",
          did: "",
          key: "",
          msg_id: "",
          requester_id: "",
          auth_token: null,
        },

        electricPlanRequest: {
          electricInfra: "true",
          electricDistribution: "false",
          electricalCapacity: "false",
          switchingStation: "true",
          landSanction: "false",
          environmentClearance: "",
          autoCad: "",
          verifiedPlan: "",
        },
      };
      const Resp = await axios.post("/land-services/electric/plan/_create", postDistrict);
      setDeveloperDataLabel(Resp.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <form onSubmit={handleSubmit(electricPlan)}>
      <Card style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Electrical Plan </h4>
        <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "40px", marginBottom: "52px" }}>
          <Row className="ml-auto" style={{ marginBottom: 5 }}>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <h2>
                    LOI Number <span style={{ color: "red" }}>*</span>
                  </h2>
                </Form.Label>
              </div>
              <input type="number" className="form-control" placeholder="" {...register("loiNumber")} />
            </Col>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <h2>
                    Electrical infrastructure sufficient to cater for the electrical need of the project area <span style={{ color: "red" }}>*</span>{" "}
                    &nbsp;&nbsp;
                  </h2>
                </Form.Label>

                <Form.Check
                  onChange={(e) => console.log(e)}
                  value="electricalInfrastructure"
                  type="radio"
                  id="default-radio"
                  label="Yes"
                  name="electricalInfrastructure"
                  {...register("electricalInfrastructure")}
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => console.log(e)}
                  value="electricalInfrastructure"
                  type="radio"
                  id="default-radio"
                  label="No"
                  name="electricalInfrastructure"
                  {...register("electricalInfrastructure")}
                  inline
                ></Form.Check>
              </div>
            </Col>
            <Col className="ms-auto" md={4} xxl lg="4">
              <div>
                <Form.Label>
                  Provision of the electricity distribution in the project area by the instructions of the DHBVN{" "}
                  <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                </Form.Label>
              </div>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="electricityDistribution"
                type="radio"
                id="default-radio"
                label="Yes"
                name="electricityDistribution"
                {...register("electricityDistribution")}
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="electricityDistribution"
                type="radio"
                id="default-radio"
                label="No"
                name="electricityDistribution"
                {...register("electricityDistribution")}
                inline
              ></Form.Check>
            </Col>
            <Col className="ms-auto" md={4} xxl lg="4">
              <div>
                <Form.Label>
                  The capacity of the proposed electrical substation as per the requirement <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                </Form.Label>
              </div>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="proposedElectricalSubstation"
                type="radio"
                id="default-radio"
                label="Yes"
                name="proposedElectricalSubstation"
                {...register("proposedElectricalSubstation")}
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="proposedElectricalSubstation"
                type="radio"
                id="default-radio"
                label="No"
                name="proposedElectricalSubstation"
                {...register("proposedElectricalSubstation")}
                inline
              ></Form.Check>
            </Col>
            <Col className="ms-auto" md={4} xxl lg="4">
              <div>
                <Form.Label>
                  Provision of 33 Kv switching station for the electrical infrastructure as per the approved layout plan
                  <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                </Form.Label>
              </div>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="switchingStation"
                type="radio"
                id="default-radio"
                label="Yes"
                name="switchingStation"
                {...register("switchingStation")}
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="switchingStation"
                type="radio"
                id="default-radio"
                label="No"
                name="switchingStation"
                {...register("switchingStation")}
                inline
              ></Form.Check>
            </Col>
            <Col className="ms-auto" md={4} xxl lg="4">
              <div>
                <Form.Label>
                  Load sanction approval as per the requirement <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                </Form.Label>
              </div>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="LoadSanctionApproval"
                type="radio"
                id="default-radio"
                label="Yes"
                name="LoadSanctionApproval"
                {...register("LoadSanctionApproval")}
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="LoadSanctionApproval"
                type="radio"
                id="default-radio"
                label="No"
                name="LoadSanctionApproval"
                {...register("LoadSanctionApproval")}
                inline
              ></Form.Check>
            </Col>
            <Col className="ms-auto" md={4} xxl lg="4"></Col>
          </Row>

          <div className="table table-bordered table-responsive">
            <thead>
              <tr>
                <td style={{ textAlign: "center" }}> Sr.No.</td>
                <td style={{ textAlign: "center" }}>Type Of Map/Plan</td>
                <td style={{ textAlign: "center" }}>Annexure</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">1.</p>
                  </div>
                </td>
                <td component="th" scope="row">
                  <h2>Self-certified drawings from empanelled/certified architects that conform to the standard approved template.</h2>
                </td>
                <td component="th" scope="row">
                  <input type="file" className="form-control" {...register("selfCenteredDrawings")} />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">2.</p>
                  </div>
                </td>
                <td component="th" scope="row">
                  <h2>Environmental Clearance.</h2>
                </td>
                <td component="th" scope="row">
                  <input type="file" className="form-control" {...register("environmentClearance")} />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">3.</p>
                  </div>
                </td>
                <td component="th" scope="row">
                  <h2>PDF (OCR Compatible) + GIS format (shapefile as per the template uploaded on the department website).</h2>
                </td>
                <td component="th" scope="row">
                  <input type="file" className="form-control" {...register("pdfFormat")} />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">4.</p>
                  </div>
                </td>
                <td component="th" scope="row">
                  <h2>AutoCAD (DXF) file.</h2>
                </td>
                <td component="th" scope="row">
                  <input type="file" className="form-control" {...register("autoCad")} />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">5.</p>
                  </div>
                </td>
                <td component="th" scope="row">
                  <h2>Certified copy of the plan verified by a third party.</h2>
                </td>
                <td component="th" scope="row">
                  <input type="file" className="form-control" {...register("certifiedCopy")} />
                </td>
              </tr>
            </tbody>
          </div>

          <div class="row">
            <div class="col-sm-12 text-right">
              <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
                Submit
              </button>
            </div>
          </div>
        </Card>
      </Card>
    </form>
  );
};

export default electricalPlanService;
