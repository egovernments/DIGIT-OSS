import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useForm } from "react-hook-form";
import { Card } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import Collapse from "react-bootstrap/Collapse";

function Standard() {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");

  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };
  const { register, handleSubmit } = useForm();
  const standardDesign = (data) => console.log(data);
  const [open2, setOpen2] = useState(false);

  return (
    <form onSubmit={handleSubmit(standardDesign)}>
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
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Approval of Standard Design</h4>
        <div className="card">
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
                  Plan <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <input type="file" placeholder="" className="form-control" {...register("plan")} />
              </Form.Group>
            </Col>
            <Col className="col-4">
              <Form.Group controlId="formGridState">
                <Form.Label>
                  Any other Document <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <input type="file" placeholder="" className="form-control" {...register("otherDocument")} />
              </Form.Group>
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

          <Row className="justify-content-end">
            <Button variant="outline-primary" className="col-md-2 my-2 mx-2" type="submit" aria-label="right-end">
              Save as Draft
            </Button>
            <Button type="submit" variant="outline-primary" className="col-md-2 my-2 mx-2" aria-label="right-end">
              Submit
            </Button>
          </Row>
        </div>
      </Card>
      </div>
      </Collapse>
    </form>
  );
}

export default Standard;
