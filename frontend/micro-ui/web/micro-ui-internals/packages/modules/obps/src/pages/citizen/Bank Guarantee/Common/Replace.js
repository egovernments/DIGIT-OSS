import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Button, Form } from "react-bootstrap";
const Replace = (props) => {

    return(
        <form  autoComplete="off">
        <Card style={{width:"126%",marginLeft:"19px",paddingRight:"10px"}}>
            <Form.Group className="justify-content-center" controlId="formBasicEmail">
                <Row className="ml-auto" style={{ marginBottom: 5 }}>
                    <Col md={4} xxl lg="3">
                        <div>
                            <Form.Label><b>Enter License No. </b><span style={{ color: "red" }}>*</span></Form.Label>
                        </div>
                        <input type="text" className="form-control"  />
                    </Col>
                    <Col md={4} xxl lg="3">
                        <div>
                            <Form.Label><b>Enter Memo No. </b><span style={{ color: "red" }}>*</span></Form.Label>
                        </div>
                        <input type="text" className="form-control"  />
                    </Col>
                    <Col md={4} xxl lg="3">
                        <div>
                            <Form.Label><b>Bank Name</b><span style={{ color: "red" }}>*</span></Form.Label>
                        </div>
                        <input type="text" className="form-control"  />
                    </Col>
                    <Col md={4} xxl lg="3">
                        <div>
                            <Form.Label><b>Type of B.G</b><span style={{ color: "red" }}>*</span></Form.Label>
                        </div>
                        <select className="form-control">
                        <option> IDW</option>
                        <option>EDC</option>
                        </select>
                    </Col>

                </Row>

                <Row className="ml-auto" style={{ marginBottom: 5 }}>
                    <Col md={4} xxl lg="3">
                        <div>
                            <Form.Label><b>Validity</b><span style={{ color: "red" }}>*</span></Form.Label>
                        </div>
                        <input type="text" className="form-control"  />
                    </Col>
                    <Col md={4} xxl lg="3">
                        <div>
                            <Form.Label><b>Amount </b><span style={{ color: "red" }}>*</span></Form.Label>
                        </div>
                        <input type="text" className="form-control" disabled />
                    </Col>
                  
                </Row>

            </Form.Group>
            <div class="row">
                    <div class="col-sm-12 text-right">
                        <button id="btnClear" class="btn btn-primary btn-md center-block" style={{ marginBottom: "-44px" }} >Submit</button>
                    </div>
                    <div class="row">
                        <div class="col-sm-12 text-right">
                            <button id="btnSearch" class="btn btn-danger btn-md center-block" style={{ marginRight: "66px" ,marginTop:"-6px"}} >Cancel</button>
                        </div></div>
                </div>

        </Card>
    </form>
    )
}

export default Replace;