import React, { useState, useEffect } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getDocShareholding } from "../NewLicense/docView/docView.help";

const electricalPlanService = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm({
    mode: "onChange",

    shouldFocusError: true,
  });
  const [developerDataLabel, setDeveloperDataLabel] = useState([]);
  const electricPlan = async (data) => {
    const token = window?.localStorage?.getItem("token");
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
          authToken: token,
        },

        ElectricPlanRequest: {
          ...data,
        },
      };
      const Resp = await axios.post("/land-services/electric/plan/_create", postDistrict);
      setDeveloperDataLabel(Resp.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const [fileStoreId, setFileStoreId] = useState({});
  const getDocumentData = async (file, fieldName) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("tenantId", "hr");
    formData.append("module", "property-upload");
    formData.append("tag", "tag-property");
    // setLoader(true);
    try {
      const Resp = await axios.post("/filestore/v1/files", formData, {});
      setValue(fieldName, Resp?.data?.files?.[0]?.fileStoreId);
      setFileStoreId({ ...fileStoreId, [fieldName]: Resp?.data?.files?.[0]?.fileStoreId });
      // setDocId(Resp?.data?.files?.[0]?.fileStoreId);
      console.log("getval======", getValues());
      // setLoader(false);
    } catch (error) {
      // setLoader(false);
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
                  value="true"
                  type="radio"
                  id="default-radio"
                  label="Yes"
                  name="true"
                  {...register("electricInfra")}
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => console.log(e)}
                  value="false"
                  type="radio"
                  id="default-radio"
                  label="No"
                  name="false"
                  {...register("electricInfra")}
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
                value="true"
                type="radio"
                id="default-radio"
                label="Yes"
                name="true"
                {...register("electricDistribution")}
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="false"
                type="radio"
                id="default-radio"
                label="No"
                name="false"
                {...register("electricDistribution")}
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
                value="true"
                type="radio"
                id="default-radio"
                label="Yes"
                name="true"
                {...register("electricalCapacity")}
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="false"
                type="radio"
                id="default-radio"
                label="No"
                name="false"
                {...register("electricalCapacity")}
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
                value="true"
                type="radio"
                id="default-radio"
                label="Yes"
                name="true"
                {...register("switchingStation")}
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="false"
                type="radio"
                id="default-radio"
                label="No"
                name="false"
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
                value="true"
                type="radio"
                id="default-radio"
                label="Yes"
                name="true"
                {...register("LoadSancation")}
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="false"
                type="radio"
                id="default-radio"
                label="No"
                name="false"
                {...register("LoadSancation")}
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
                  <input type="file" className="form-control mb-4" onChange={(e) => getDocumentData(e?.target?.files[0], "selfCenteredDrawings")} />
                  <VisibilityIcon color="primary" onClick={() => getDocShareholding(fileStoreId?.selfCenteredDrawings)}>
                    {" "}
                  </VisibilityIcon>
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
                  <input type="file" className="form-control" onChange={(e) => getDocumentData(e?.target?.files[0], "environmentalClearance")} />
                  <VisibilityIcon color="primary" onClick={() => getDocShareholding(fileStoreId?.environmentalClearance)}>
                    {" "}
                  </VisibilityIcon>
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
                  <input type="file" className="form-control" onChange={(e) => getDocumentData(e?.target?.files[0], "pdfFormat")} />
                  <VisibilityIcon color="primary" onClick={() => getDocShareholding(fileStoreId?.pdfFormat)}>
                    {" "}
                  </VisibilityIcon>
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
                  <input type="file" className="form-control" onChange={(e) => getDocumentData(e?.target?.files[0], "autoCad")} />
                  <VisibilityIcon color="primary" onClick={() => getDocShareholding(fileStoreId?.autoCad)}>
                    {" "}
                  </VisibilityIcon>
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
                  <input type="file" className="form-control" onChange={(e) => getDocumentData(e?.target?.files[0], "verifiedPlan")} />
                  <VisibilityIcon color="primary" onClick={() => getDocShareholding(fileStoreId?.verifiedPlan)}>
                    {" "}
                  </VisibilityIcon>
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
