

import React from "react";
import { useForm } from "react-hook-form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button } from "react-bootstrap";


const ZoningPlan = () => {
  const { register, handleSubmit } = useForm();
  const handleRegistration = (data) => console.log(data);
 
 

  return (
    <form onSubmit={handleSubmit(handleRegistration)}>
      <div className="card">
        <h4 className="text-center">Approval of demarcation cum zoning plan in CLU</h4>
        <br></br>
        <Row>
          <Col className="col-4">
           
              <label>
                {" "}
                License No . <span style={{ color: "red" }}>*</span>
              </label>
           
            <input type="number" name="License No" className="form-control" {...register("License No")} />
          </Col>

          <Col className="col-4">
           
              <label>
                {" "}
                Case Number . <span style={{ color: "red" }}>*</span>
              </label>
           
            <input type="number" name="Case Number" className="form-control" {...register("Case Number")} />
          </Col>
          <Col className="col-4">
            <label>
              Layout Plan <span style={{ color: "red" }}>*</span>
            </label>

            <input type="text" className="form-control" {...register("Layout Plan")} />
          </Col>
          <Col className="col-4">
           
              <label>
                {" "}
                Any other Document <span style={{ color: "red" }}>*</span>
              </label>{" "}
           
            <input type="text" className="form-control" {...register("Any other Document")} />
          </Col>

          <Col className="col-4">
           
              <label>
                {" "}
                Amount <span style={{ color: "red" }}>*</span>
              </label>
            
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
