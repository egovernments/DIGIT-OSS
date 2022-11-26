import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
const RenewNew = (props) => {
  const { register, handleSubmit } = useForm();
  const bankRenew = (data) => console.log(data);
  return (
    <form onSubmit={handleSubmit(bankRenew)}>
      <Card style={{ width: "126%", marginLeft: "19px", paddingRight: "10px" }}>
        <Form.Group className="justify-content-center" controlId="formBasicEmail">
          <Row className="ml-auto" style={{ marginBottom: 5 }}>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Enter License No. </h2>
                </Form.Label>
              </div>
              <input type="number" className="form-control" placeholder="" {...register("enterLicense")} />
            </Col>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Date Extended From </h2>
                </Form.Label>
              </div>
              <input type="date" className="form-control" placeholder="" {...register("dateExtededFrom")} />
            </Col>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Date Extended To</h2>
                </Form.Label>
              </div>
              <input type="date" className="form-control" placeholder="" {...register("dateExtendedTo")} />
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

export default RenewNew;
