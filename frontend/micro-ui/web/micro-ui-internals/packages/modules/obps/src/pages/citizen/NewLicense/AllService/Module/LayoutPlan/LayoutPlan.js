import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useForm } from "react-hook-form";

function LayoutPlanClu() {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const { register, handleSubmit } = useForm();
  const layoutPlan = (data) => console.log(data);

  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };

  return (
    <form onSubmit={handleSubmit(layoutPlan)}>
      <Card style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>APPROVAL OF REVISED LAYOUT PLAN OF LICENSE</h4>
        <div className="card">
          <Form>
            <Row>
              <Col className="col-4">
                <Form.Group controlId="formGridCase">
                  <Form.Label>
                    License No . <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <input type="number" placeholder="" className="form-control" {...register("licenseNo")} />
                </Form.Group>
              </Col>
              <Col className="col-4">
                <Form.Group controlId="formGridState">
                  <Form.Label>
                    Existing Area <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <input type="text" placeholder="" className="form-control" {...register("existingArea")} />
                </Form.Group>
              </Col>
              <Col className="col-4">
                <Form.Group controlId="formGridState">
                  <Form.Label>
                    Area of which planning is being changed <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <input type="text" placeholder="" className="form-control" {...register("areaPlanning")} />
                </Form.Group>
              </Col>
              <Col className="col-4">
                <fieldset>
                  <Form.Group as={Row} className="mb-4">
                    <Form.Label>
                      Any other feature
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col className="col-2">
                      <Form.Check
                        type="radio"
                        label="Yes"
                        name="formHorizontalRadios"
                        id="formHorizontalRadios1"
                        value="4"
                        placeholder=""
                        className="form-control"
                        {...register("anyFeature")}
                      />
                    </Col>
                    <Col className="col-2">
                      <Form.Check
                        type="radio"
                        label="No"
                        name="formHorizontalRadios"
                        id="formHorizontalRadios2"
                        placeholder=""
                        className="form-control"
                        {...register("anyFeature")}
                      />
                    </Col>
                  </Form.Group>
                </fieldset>
              </Col>
              <Col className="col-4">
                <Form.Group controlId="formGridState">
                  <Form.Label>
                    Amount <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <input type="text" required={true} disabled={true} placeholder="" className="form-control" {...register("amount")} />
                </Form.Group>
              </Col>
              <Col className="col-4">
                <Button variant="success" className="col my-4" type="submit" aria-label="right-end">
                  Pay
                </Button>
              </Col>
            </Row>
          </Form>
          <div className=" col-12 m-auto">
            <div className="card">
              <div class="bordere">
                <div class="table-responsive">
                  <table class="table">
                    <thead>
                      <tr>
                        <th scope="col">Sr.No</th>
                        <th scope="col">Field Name</th>
                        <th scope="col">Upload Documents</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>
                          Reasons for revision in the layout plan <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                          <input type="file" placeholder="" className="form-control" {...register("reasonRevision")}></input>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">2</th>
                        <td>
                          {" "}
                          Copy of earlier approved layout plan <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                          <input type="file" placeholder="" className="form-control" {...register("earlierApprovedlayoutPlan")}></input>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">3</th>
                        <td>
                          {" "}
                          Any Other <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                          <input type="file" placeholder="" className="form-control" {...register("anyOther")}></input>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <Row className="justify-content-end">
                <Button variant="outline-primary" className="col-md-2 my-2 mx-2" type="submit" aria-label="right-end">
                  Save as Draft
                </Button>
                <Button variant="outline-primary" className="col-md-2 my-2 mx-2" type="submit" aria-label="right-end">
                  Submit
                </Button>
              </Row>
            </div>
          </div>
        </div>
      </Card>
    </form>
  );
}

export default LayoutPlanClu;
