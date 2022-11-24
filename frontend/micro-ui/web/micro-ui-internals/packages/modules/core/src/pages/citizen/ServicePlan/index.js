import React, { useState, useEffect } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import axios from "axios";

const ServicePlanService = () => {
  const { register, handleSubmit } = useForm();

  const [LOCNumber, setLOCNumber] = useState("");
  const [submitDataLabel, setSubmitDataLabel] = useState([]);
  const [developerDataLabel, setDeveloperDataLabel] = useState([]);

  const servicePlan = async (data) => {
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

        servicePlanRequest: {
          loiNumber: "",
          undertaking: "false",
          selfCertifiedDrawingsFromCharetedEng: "false",
          selfCertifiedDrawingFromEmpaneledDoc: "",
          environmentalClearance: "",
          shapeFileAsPerTemplate: "",
          autoCadFile: "",
          certifieadCopyOfThePlan: "",
        },
      };
      const Resp = await axios.post("/land-services/serviceplan/_create", postDistrict);
      setDeveloperDataLabel(Resp.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  // const getSubmitDataLabel = async () => {
  //   try {
  //     const postDistrict = {
  //       requestInfo: {
  //         api_id: "1",
  //         ver: "1",
  //         ts: null,
  //         action: "create",
  //         did: "",
  //         key: "",
  //         msg_id: "",
  //         requester_id: "",
  //         auth_token: null,
  //       },
  //     };

  //     const Resp = await axios.post(`http://10.1.1.18:8443/land-services/serviceplan/_get?loiNumber=123`, postDistrict);
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };
  // useEffect(() => {
  //   getSubmitDataLabel();
  // }, []);

  return (
    <form onSubmit={handleSubmit(servicePlan)}>
      <Card style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Service Plan </h4>
        <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "40px", marginBottom: "52px" }}>
          <Row>
            <Col className="col-4">
              <div>
                <label>
                  {" "}
                  <h2>
                    LOI Number <span style={{ color: "red" }}>*</span>
                  </h2>
                </label>{" "}
              </div>
              <input
                type="number"
                className="form-control"
                {...register("loiNumber")}
                onChange={(e) => setLOCNumber(e.target.value)}
                value={LOCNumber}
              />
            </Col>
            <Col className="col-4">
              <div>
                <label>
                  <h2 data-toggle="tooltip" data-placement="top" title=" Is the uploaded Service Plan in accordance to the Standard designs?">
                    Uploaded Service Plan <span style={{ color: "red" }}>*</span>
                  </h2>
                </label>
              </div>
              <Form.Check
                value="uploadedServicePlan"
                type="radio"
                id="default-radio"
                label="Yes"
                name="uploadedServicePlan"
                {...register("uploadedServicePlan")}
                inline
              ></Form.Check>
              <Form.Check
                value="uploadedServicePlan"
                type="radio"
                id="default-radio"
                label="No"
                name="uploadedServicePlan"
                {...register("uploadedServicePlan")}
                inline
              ></Form.Check>
            </Col>
            <Col className="col-4">
              <div>
                <label>
                  <h2>Undertaking</h2>
                </label>
              </div>
              <Form.Check
                value="Undertaking"
                type="radio"
                id="default-radio"
                label="Yes"
                name="Undertaking"
                {...register("Undertaking")}
                inline
              ></Form.Check>
              <Form.Check
                value="Undertaking"
                type="radio"
                id="default-radio"
                label="No"
                name="Undertaking"
                {...register("Undertaking")}
                inline
              ></Form.Check>
            </Col>
          </Row>
          <br></br>
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
                  <input type="file" className="form-control" {...register("selfCertified")} />
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
                  <input type="file" className="form-control" {...register("environmental")} />
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
                  <input type="file" className="form-control" {...register("pDF")} />
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

export default ServicePlanService;
