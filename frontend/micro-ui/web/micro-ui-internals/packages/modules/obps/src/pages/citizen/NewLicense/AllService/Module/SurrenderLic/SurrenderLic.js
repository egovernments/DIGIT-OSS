import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Card } from "react-bootstrap";
import { useForm } from "react-hook-form";

function SurrenderLic() {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");

  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };
  const handleselects = (event) => {
    const getu = event.target.value;

    setSelects(getu);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({});

  const SurrenderLic = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(SurrenderLic)}>
      <Card style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }} className="text-center">
          Surrender of License
        </h4>
        <div className="card">
          <br></br>
          <Row className="col-12">
            <Col className="col-4">
              <Form.Group as={Col} controlId="formGridLicence">
                <Form.Label>
                  Licence No . <span style={{ color: "red" }}>*</span>
                </Form.Label>

                <input type="number" placeholder="" className="form-control" {...register("licenseNo")} />
              </Form.Group>
            </Col>
            <Col className="col-4">
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  Select Type (Complete or Partial) <span style={{ color: "red" }}>*</span>
                </Form.Label>

                <select className="form-control" {...register("selectType")} onChange={(e) => handleshowhide(e)}>
                  <option value=" ">----Select value-----</option>
                  <option value="1">(a)Complete</option>
                  <option value="2">(b) Partial</option>
                </select>
              </Form.Group>
            </Col>
            <Col className="col-4">
              <Form.Group as={Row} className="mb-12">
                <Form.Label>
                  Area falling under 24m road /service road or sector dividing road (Yes/no)
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Row>
                  <Col className="col-3">
                    <Form.Check
                      type="radio"
                      value="true"
                      label="Yes"
                      name="areaFalling"
                      id="areaFalling"
                      {...register(" areaFalling")}
                      onChange={(e) => handleselects(e)}
                    />
                  </Col>
                  <Col className="col-3">
                    <Form.Check
                      type="radio"
                      value="false"
                      label="No"
                      name="areaFalling"
                      id="areaFalling"
                      {...register(" areaFalling")}
                      onChange={(e) => handleselects(e)}
                    />
                  </Col>
                </Row>
              </Form.Group>
            </Col>
            <Col className="col-4">
              <Form.Group as={Row} className="mb-12">
                <Form.Label>
                  RERA registration of project
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Row>
                  <Col className="col-3">
                    <Form.Check
                      type="radio"
                      label="Yes"
                      name="reraRegistration"
                      id="reraRegistration"
                      value="true"
                      {...register("reraRegistration")}
                      onChange={(e) => handleselects(e)}
                    />
                  </Col>
                  <Col className="col-3">
                    <Form.Check
                      type="radio"
                      label="No"
                      name="reraRegistration"
                      id="reraRegistration"
                      value="false"
                      {...register("reraRegistration")}
                      onChange={(e) => handleselects(e)}
                    />
                  </Col>
                </Row>
              </Form.Group>
            </Col>

            <Col className="col-4">
              <Form.Group as={Col} controlId="formGridArea">
                {/* <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" /> */}
                <div>
                  {showhide === "2" && (
                    <div className="col-md-12 ">
                      <Form.Label>
                        Area in Acres <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      {/* <Form.Control type="number" placeholder="Enter Area" /> */}
                      <input type="number" placeholder="" className="form-control" {...register("areainAcres")} />
                    </div>
                  )}
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <div>
              {showhide === "1" && (
                //  <div className="card">
                <div className="table table-bordered table-responsive">
                  <thead>
                    <tr>
                      <th className="fw-normal" style={{ textAlign: "center" }}>
                        Sr.No
                      </th>
                      <th className="fw-normal" style={{ textAlign: "center" }}>
                        Field Name
                      </th>
                      <th className="fw-normal" style={{ textAlign: "center" }}>
                        Upload Documents
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th className="fw-normal">1</th>
                      <td>
                        Declaration of Third-Party Rights
                        <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        {/* <input type="file" placeholder="" className="form-control" {...register("oning/LayoutPlan ")}></input> */}
                        <input type="file" placeholder="" className="form-control" {...register("thirdPartyRights")}></input>
                      </td>
                    </tr>
                    <tr>
                      <th className="fw-normal">2</th>
                      <td>
                        {" "}
                        Declaration IDW Works Approved Scanned Copy of Zoning/Layout Plan <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <input type="file" placeholder="" className="form-control" {...register("oningLayoutPlan ")}></input>
                        {/* <input type="file" placeholder="" className="form-control" {...register("oning/LayoutPlan ")}></input> */}
                      </td>
                    </tr>
                    <tr>
                      <th className="fw-normal">3</th>
                      <td>
                        {" "}
                        License Copy <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <input type="file" placeholder="" className="form-control" {...register("licenseCopy ")}></input>
                      </td>
                    </tr>
                    <tr>
                      <th className="fw-normal">4</th>
                      <td>
                        {" "}
                        EDC availed or not e.g. surrounding roads are constructed or not <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <input type="file" placeholder="" className="form-control" {...register("edcaVailed ")}></input>
                      </td>
                    </tr>
                    <tr>
                      <th className="fw-normal">5</th>
                      <td>
                        {" "}
                        Area falling under 24m road /service road or sector dividing road and green belt If yes{" "}
                        <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <fieldset>
                          <Form.Group as={Row} className="mb-12">
                            <Row>
                              <Col className="col-3">
                                <Form.Check
                                  type="radio"
                                  label="Yes"
                                  name="formHorizontalRadios"
                                  id="formHorizontalRadios1"
                                  value="4"
                                  onChange={(e) => handleselects(e)}
                                />
                              </Col>
                              <Col className="col-3">
                                <Form.Check
                                  type="radio"
                                  label="No"
                                  name="formHorizontalRadios"
                                  id="formHorizontalRadios2"
                                  value="9"
                                  onChange={(e) => handleselects(e)}
                                />
                              </Col>
                            </Row>
                          </Form.Group>
                        </fieldset>
                      </td>
                    </tr>
                  </tbody>

                  {selects === "4" && (
                    // <table class="table">
                    <tbody>
                      <tr>
                        <th className="fw-normal">6</th>
                        <td>
                          {" "}
                          Gift Deed
                          <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                          <input type="file" placeholder="" className="form-control" {...register("giftDeed")}></input>
                        </td>
                      </tr>
                      <tr>
                        <th className="fw-normal">7</th>
                        <td>
                          {" "}
                          Mutation
                          <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                          <input type="file" placeholder="" className="form-control" {...register("mutation")}></input>
                        </td>
                      </tr>
                      <tr>
                        <th className="fw-normal">8</th>
                        <td>
                          {" "}
                          Jamabandhi <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                          <input type="file" placeholder="" className="form-control" {...register("jamabandhi")}></input>
                        </td>
                      </tr>
                    </tbody>
                    // </table>
                  )}
                </div>
                // </div>
              )}
            </div>

            <div>
              {showhide === "2" && (
                // <div className="card">
                <div className="table table-bordered table-responsive">
                  {/* <caption>List of users</caption> */}
                  <thead>
                    <tr>
                      <th style={{ textAlign: "center" }}>Sr.No</th>
                      <th style={{ textAlign: "center" }}>Field Name</th>
                      <th style={{ textAlign: "center" }}>Upload Documents</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th className="fw-normal">1</th>
                      <td>
                        Declaration of Third-Party Rights
                        <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <input type="file" placeholder="" className="form-control" {...register("partyRights")}></input>
                      </td>
                    </tr>
                    <tr>
                      <th className="fw-normal">2</th>
                      <td>
                        {" "}
                        Declaration IDW Works <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <input type="file" placeholder="" className="form-control" {...register("declarationIDWWorks")}></input>
                      </td>
                    </tr>
                    <tr>
                      <th className="fw-normal">3</th>
                      <td>
                        {" "}
                        Revised Layout Plan (same format as uploaded at the time of license application)
                        <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <input type="file" placeholder="" className="form-control" {...register("revisedLayoutPlan")}></input>
                      </td>
                    </tr>
                    <tr>
                      <th className="fw-normal">4</th>
                      <td>
                        {" "}
                        EDC availed or not e.g. surrounding roads are constructed or not <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <input type="file" placeholder="" className="form-control" {...register("availedEdc")}></input>
                      </td>
                    </tr>
                    <tr>
                      <th className="fw-normal">5</th>
                      <td>
                        {" "}
                        Area falling under 24m road /service road or sector dividing road <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <input type="file" placeholder="" className="form-control" {...register("areaFallingUnder")}></input>
                      </td>
                    </tr>
                    <tr>
                      <th className="fw-normal">6</th>
                      <td>
                        {" "}
                        Area falling under 24m road /service road or sector dividing road and green belt If yes{" "}
                        <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <fieldset>
                          <Form.Group as={Row} className="mb-12">
                            <Row>
                              <Col className="col-3">
                                <Form.Check
                                  type="radio"
                                  label="Yes"
                                  name="formHorizontalRadios"
                                  id="formHorizontalRadios1"
                                  value="3"
                                  onChange={(e) => handleselects(e)}
                                />
                              </Col>
                              <Col className="col-3">
                                <Form.Check
                                  type="radio"
                                  label="No"
                                  name="formHorizontalRadios"
                                  id="formHorizontalRadios2"
                                  value="10"
                                  onChange={(e) => handleselects(e)}
                                />
                              </Col>
                            </Row>
                          </Form.Group>
                        </fieldset>
                      </td>
                    </tr>
                  </tbody>

                  {selects === "3" && (
                    <tbody>
                      <tr>
                        <th className="fw-normal">7</th>
                        <td>
                          {" "}
                          Gift Deed
                          <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                          <input type="file" placeholder="" className="form-control" {...register("deedGift")}></input>
                        </td>
                      </tr>
                      <tr>
                        <th className="fw-normal">8</th>
                        <td>
                          {" "}
                          Mutation.
                          <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                          <input type="file" placeholder="" className="form-control" {...register("mutaDoc")}></input>
                        </td>
                      </tr>
                      <tr>
                        <th className="fw-normal">9</th>
                        <td>
                          {" "}
                          Jamabandhi <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                          <input type="file" placeholder="" className="form-control" {...register("jamabandhiDoc")}></input>
                        </td>
                      </tr>
                    </tbody>
                  )}
                </div>
                //   </div>
                // </div>
              )}
            </div>
          </Row>

          <div class="row">
            <div class="col-sm-12 text-right">
              <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
                Submit
              </button>
            </div>
            <div class="col-sm-12 text-right">
              <button id="btnSearch" class="btn btn-primary btn-md center-block" style={{ marginTop: "-58px", marginRight: "97px" }}>
                Save as Draft
              </button>
            </div>
          </div>
        </div>
      </Card>
    </form>
  );
}

export default SurrenderLic;
