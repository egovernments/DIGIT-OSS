import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
const Replace = (props) => {
  const { register, handleSubmit } = useForm();
  const bankReplace = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(bankReplace)}>
      <Card style={{ width: "126%", marginLeft: "19px", paddingRight: "10px" }}>
        <Form.Group className="justify-content-center" controlId="formBasicEmail">
          <Row className="ml-auto" style={{ marginBottom: 5 }}>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Enter License No. </h2>
                </Form.Label>
              </div>
              <input type="text" className="form-control" placeholder="" {...register("EnterLicNo")} />
            </Col>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Enter Memo No. </h2>
                </Form.Label>
              </div>
              <input type="text" className="form-control" placeholder="" {...register("EnterMemNo")} />
            </Col>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Bank Name</h2>
                </Form.Label>
              </div>
              <input type="text" className="form-control" placeholder="" {...register("nameBank")} />
            </Col>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Type of B.G</h2>
                </Form.Label>
              </div>
              <select className="form-control" placeholder="" {...register("bgType")}>
                <option> IDW</option>
                <option>EDC</option>
              </select>
            </Col>
          </Row>

          <Row className="ml-auto" style={{ marginBottom: 5 }}>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Validity</h2>
                </Form.Label>
              </div>
              <input type="text" className="form-control" placeholder="" {...register("validity")} />
            </Col>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Amount </h2>
                </Form.Label>
              </div>
              <input type="text" className="form-control" disabled placeholder="" {...register("amount")} />
            </Col>
          </Row>
        </Form.Group>
        <div class="row">
          <div class="col-sm-12 text-right">
            <button type="submit" id="btnClear" class="btn btn-primary btn-md center-block" style={{ marginBottom: "-44px" }}>
              Submit
            </button>
          </div>
          <div class="row">
            <div class="col-sm-12 text-right">
              <button id="btnSearch" class="btn btn-danger btn-md center-block" style={{ marginRight: "66px", marginTop: "-6px" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Card>
    </form>
  );
};

export default Replace;
