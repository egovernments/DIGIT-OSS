import React from "react";
import { useForm } from "react-hook-form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button } from "react-bootstrap";
import { Card } from "react-bootstrap";

const ZoningPlan = () => {
  const { register, handleSubmit } = useForm();
  const handleRegistration = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(handleRegistration)}>
      <Card style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Approval of demarcation cum zoning plan in CLU</h4>
        <div className="card">
          <br></br>
          <Row>
            <Col className="col-4">
              <label>
                {" "}
                License No . <span style={{ color: "red" }}>*</span>
              </label>

              <input type="number" className="form-control" {...register("licenseNo")} />
            </Col>

            <Col className="col-4">
              <label>
                {" "}
                Case Number . <span style={{ color: "red" }}>*</span>
              </label>

              <input type="number" name="Case Number" className="form-control" {...register("caseNumber")} />
            </Col>
            <Col className="col-4">
              <label>
                Layout Plan <span style={{ color: "red" }}>*</span>
              </label>

              <input type="text" className="form-control" {...register("layoutPlan")} />
            </Col>
            <br></br>

            <Col className="col-4">
              <label>
                {" "}
                Any other Document <span style={{ color: "red" }}>*</span>
              </label>{" "}
              <input type="file" className="form-control" {...register("anyOtherDocument")} />
            </Col>

            <Col className="col-4">
              <label>
                {" "}
                Amount <span style={{ color: "red" }}>*</span>
              </label>

              <input type="number" name="Amount" className="form-control" {...register("amount")} />
            </Col>
            <Col className="col-4">
              <div className="col-4">
                <Button variant="success" className="col my-5" type="submit" aria-label="right-end">
                  Pay{" "}
                </Button>
              </div>
            </Col>
          </Row>
          <div class="col-sm-12 text-right">
            <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
              Submit
            </button>
          </div>
        </div>
      </Card>
    </form>
  );
};
export default ZoningPlan;
