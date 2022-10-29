import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Button, Form } from "react-bootstrap";
import SubmitNew from "./SubmitNew";
import ReleaseNew from "./Release";
import RenewNew from "./Renew";
import Replace from "./Replace";
import { Link } from "react-router-dom";
const CommonBank = (props) => {

    return (
        <Card style={{ width: "126%", marginLeft: "19px", paddingRight: "10px" }}>
            <Form.Group className="justify-content-center" controlId="formBasicEmail">
                <Row className="ml-auto" style={{ marginBottom:"33px",marginRight:"-370px" }}>

                    <Col md={4} xxl lg="3">
                        <Card  style={{ width: "50%", marginLeft: "19px", paddingRight: "10px" }}>
                            <h2 style={{ textAlign:"center",color:"blue"}}>
                            <Link to="./SubmitNew"><b>Submit New</b> </Link></h2>
                          </Card>

                    </Col>

                    <Col md={4} xxl lg="3">
                        <Card style={{ width: "50%", marginLeft: "19px", paddingRight: "10px" }}>
                        <h2 style={{ textAlign:"center",color:"blue"}}><Link to="./renew"><b>Renew</b></Link></h2>
                           
                        </Card>

                    </Col>

                    <Col md={4} xxl lg="3">
                        <Card style={{ width: "50%", marginLeft: "19px", paddingRight: "10px" }}>
                        <h2 style={{ textAlign:"center",color:"blue"}}><Link to="./replace"><b>Replace</b></Link></h2>
                        </Card>

                    </Col>
                    </Row>

                    <Row className="ml-auto" style={{ marginRight:"-367px",marginBottom:"5px" }}>
                    <Col md={4} xxl lg="3">
                        <Card style={{ width: "50%", marginLeft: "19px", paddingRight: "10px" }}>
                        <h2 style={{ textAlign:"center",color:"blue"}}><Link to="./release"><b>Release</b></Link></h2>
                        </Card>

                    </Col>
                </Row>
            </Form.Group>
        </Card>

    )
}

export default CommonBank;