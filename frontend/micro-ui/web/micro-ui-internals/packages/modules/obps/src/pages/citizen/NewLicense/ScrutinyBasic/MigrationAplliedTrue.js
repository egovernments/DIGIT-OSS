import React,{useState} from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col} from "react-bootstrap";
import {AiFillCheckCircle, AiFillCloseCircle} from "react-icons/ai";


const MigrationAppliedTrue=()=>{
    return(
        <div>
            <Row className="ms-auto" style={{marginBottom:20}}>
                <Col md={4} xxl lg="6">
                    <div>
                        <Form.Label>(i) Area applied under Migration</Form.Label><span style={{color:"red"}}>*</span>
                    </div>
                
                    <Form.Control style={{marginTop:10}} readOnly></Form.Control>
                </Col>
                <Col md={4} xxl lg="6">
                    <div>
                        <Form.Label>(ii) Purpose of Parent License</Form.Label><span style={{color:"red"}}>*</span>
                    </div>
                    <Form.Control style={{marginTop:10}} readOnly></Form.Control>
                </Col>
            </Row>
            <Row>
            <Col md={4} xxl lg="3">
                    <div>
                        <Form.Label>(ii) (a) Licence No.'s</Form.Label><span style={{color:"red"}}>*</span>
                    </div>
                    <Form.Control style={{maxWidth:200, marginTop:10}} readOnly></Form.Control>
                </Col>
                <Col md={4} xxl lg="3">
                    <div>
                        <Form.Label>(ii) (b) Area's of parent licence's from which migration is proposed</Form.Label><span style={{color:"red"}}>*</span>
                    </div>
                    <Form.Control style={{maxWidth:200, marginTop:10}} readOnly></Form.Control>
                </Col>
                <Col md={4} xxl lg="3">
                    <div>
                        <Form.Label>(ii) (c) Validity of such parent licence from which migration is proposed</Form.Label><span style={{color:"red"}}>*</span>
                    </div>
                    <Form.Control style={{maxWidth:200, marginTop:10}} readOnly></Form.Control>
                </Col>
                <Col md={4} xxl lg="3">
                    <div>
                        <Form.Label>(ii) (d) If not validated, amount of renewal fees deposited</Form.Label><span style={{color:"red"}}>*</span>
                    </div>
                    <Form.Control style={{maxWidth:200, marginTop:10}} readOnly></Form.Control>
                </Col>
                <Col md={4} xxl lg="3">
                    <div>
                        <Form.Label>(ii) (e) Fresh applied area, other than migration</Form.Label><span style={{color:"red"}}>*</span>
                    </div>
                    <Form.Control style={{maxWidth:200, marginTop:10}} readOnly></Form.Control>
                </Col>
            </Row>
            <hr></hr>
        </div>
    )
}

export default MigrationAppliedTrue;