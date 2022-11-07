//  import React, { useState } from "react";
//  import Button from "react-bootstrap/Button";
//  import col from "react-bootstrap/col";
//  import Form from "react-bootstrap/Form";
//  import row from "react-bootstrap/row";
//  import Card from "react-bootstrap/Card";

//  function ZoningPlan() {
//    const [selects, setSelects] = useState();
//    const [showhide, setShowhide] = useState("");

//    const handleshowhide = (event) => {
//      const getuser = event.target.value;

//      setShowhide(getuser);
//    };

//    return (
//      <div className="container my-5">
//        <div className=" col-12 m-auto">
//          {/* <div className="card"> */}
//          <Card>
//            <Form>
//              <h4 className="text-center">Approval of demarcation cum zoning plan in CLU</h4>
//              <row>
//                <col className="col-4">
//                  <Form.Group controlId="formGridCase">
//                    <Form.Label>
//                      License No . <span style={{ color: "red" }}>*</span>
//                    </Form.Label>

//                    <Form.Control type="number" placeholder="Enter License No" />
//                  </Form.Group>
//                </col>
//                <col className="col-4">
//                  <Form.Group controlId="formGridCase">
//                    <Form.Label>
//                      Case Number . <span style={{ color: "red" }}>*</span>
//                    </Form.Label>
//                    <Form.Control type="number" placeholder="Enter Case Number" />
//                  </Form.Group>
//                </col>
//                <col className="col-4">
//                  <Form.Group controlId="formGridState">
//                    <Form.Label>
//                      Layout Plan <span style={{ color: "red" }}>*</span>
//                    </Form.Label>
//                    <Form.Control type="file" />
//                  </Form.Group>
//                </col>
//                <col className="col-4">
//                  <Form.Group controlId="formGridState">
//                    <Form.Label>
//                      Any other Document <span style={{ color: "red" }}>*</span>
//                    </Form.Label>
//                    <Form.Control type="file" />
//                  </Form.Group>
//                </col>
//                <col className="col-4">
//                  <Form.Group controlId="formGridState">
//                    <Form.Label>
//                      Amount <span style={{ color: "red" }}>*</span>
//                    </Form.Label>
//                    <Form.Control type="text" required={true} disabled={true} />
//                  </Form.Group>
//                </col>
//                <col className="col-4">
//                  <Button variant="success" className="col my-4" type="submit" aria-label="right-end">
//                    Pay
//                  </Button>
//                </col>
//              </row>

//              <row className="justify-content-end">
//                <Button variant="outline-primary" className="col-md-2 my-2 mx-2" type="submit" aria-label="right-end">
//                  Save as Draft
//                </Button>
//                <Button variant="outline-primary" className="col-md-2 my-2 mx-2" type="submit" aria-label="right-end">
//                  Submit
//                </Button>
//              </row>
//            </Form>
//          </Card>
//        </div>
//      </div>
//       </div>
//    );
//  }

//  export default ZoningPlan;

import React from "react";
import { useForm } from "react-hook-form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button } from "react-bootstrap";
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as Yup from 'yup';

const ZoningPlan = () => {
  const { register, handleSubmit } = useForm();
  const handleRegistration = (data) => console.log(data);
  // const validationSchema = Yup.object().shape({
  //   fullname: Yup.string().required('Fullname is required'),
  //   username: Yup.string()
  //     .required('Username is required')
  //     .min(6, 'Username must be at least 6 characters')
  //     .max(20, 'Username must not exceed 20 characters'),
  // });

  return (
    <form onSubmit={handleSubmit(handleRegistration)}>
      <div className="card">
        <h4 className="text-center">Approval of demarcation cum zoning plan in CLU</h4>
        <br></br>
        <Row>
          <Col className="col-4">
            <div class="input-group mb-3">
              <label>
                {" "}
                License No . <span style={{ color: "red" }}>*</span>
              </label>
            </div>
            <input type="number" name="License No" className="form-control" {...register("License No")} />
          </Col>

          <Col className="col-4">
            <div class="input-group mb-3">
              <label>
                {" "}
                Case Number . <span style={{ color: "red" }}>*</span>
              </label>
            </div>
            <input type="number" name="Case Number" className="form-control" {...register("Case Number")} />
          </Col>
          <Col className="col-4">
            <label>
              Layout Plan <span style={{ color: "red" }}>*</span>
            </label>

            <input type="text" className="form-control" {...register("Layout Plan")} />
          </Col>
          <Col className="col-4">
            <div class="input-group mb-3">
              <label>
                {" "}
                Any other Document <span style={{ color: "red" }}>*</span>
              </label>{" "}
            </div>
            <input type="text" className="form-control" {...register("Any other Document")} />
          </Col>

          <Col className="col-4">
            <div class="input-group mb-3">
              <label>
                {" "}
                Amount <span style={{ color: "red" }}>*</span>
              </label>
            </div>
            <input type="number" name="Amount" className="form-control" {...register("Amount")} />
          </Col>
          <Col className="col-4">
            <div className="col-4">
              <Button variant="success" className="col my-5" type="submit" aria-label="right-end">
                Pay{" "}
              </Button>
            </div>
          </Col>
        </Row>
        <button>Submit</button>
      </div>
    </form>
  );
};
export default ZoningPlan;
