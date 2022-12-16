import React from "react";
import { useForm } from "react-hook-form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button } from "react-bootstrap";
import { Card } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import Collapse from "react-bootstrap/Collapse";

const ZoningPlan = () => {
  const { register, handleSubmit } = useForm();
  const handleRegistration = (data) => console.log(data);
  const [open2, setOpen2] = useState(false);

  return (
    <form onSubmit={handleSubmit(handleRegistration)}>
      <div
        className="collapse-header"
        onClick={() => setOpen2(!open2)}
        aria-controls="example-collapse-text"
        aria-expanded={open2}
        style={{
          background: "#f1f1f1",
          padding: "0.25rem 1.25rem",
          borderRadius: "0.25rem",
          fontWeight: "600",
          display: "flex",
          cursor: "pointer",
          color: "#817f7f",
          justifyContent: "space-between",
          alignContent: "center",
        }}
      >
        <span style={{ color: "#817f7f" }} className="">
        Approval of Standard Design
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
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

              <input type="number" className="form-control" {...register("LicenseNo")} />
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
            <br></br>

            <Col className="col-4">
              <label>
                {" "}
                Any other Document <span style={{ color: "red" }}>*</span>
              </label>{" "}
              <input type="file" className="form-control" {...register("Any other Document")} />
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
          <div class="col-sm-12 text-right">
            <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
              Submit
            </button>
          </div>
        </div>
      </Card>
      </div>
      </Collapse>
    </form>
  );
};
export default ZoningPlan;
