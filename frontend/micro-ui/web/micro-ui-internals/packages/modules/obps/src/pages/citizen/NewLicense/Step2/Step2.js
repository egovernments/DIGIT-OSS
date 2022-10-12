import React, { useState, useEffect } from "react";
import { Button, Form, Collapse } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";

import { useForm } from "react-hook-form";
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

const ApllicantPuropseForm = () => {
    const PurposeFormSubmitHandler = (e) => {
        e.preventDefault();
        SetPurposeformSubmitted(true);}
                return (
                    <Form onSubmit={PurposeFormSubmitHandler}>
                        <Card style={{width:"126%",marginLeft:"-88px",paddingRight:"10px"}}>
                        <Form.Group  >
                        <Row className="ml-auto" style={{ marginBottom: 5 }}>
                        <Col md={4} xxl lg="3">
                        <div>
                            <Form.Label><b>Puropse Of License</b> <span style={{ color: "red" }}>*</span></Form.Label>
                        </div>
                        <Form.Select type="text"  >

                            <option value="01">Plotted Commercial</option>
                            <option value="02">Group Housing Commercial</option>
                            <option value="03">AGH </option>
                            <option value="04">Commercial Integrated </option>
                            <option value="05">Commercial Plotted</option>
                            <option value="06">Industrial Colony Commercial</option>
                            <option value="07" >IT Colony Commercial</option>
                            <option value="08" >DDJAY</option>
                            <option value="12">TOD Group housing</option>
                        </Form.Select>
                    </Col>
                    <div className="col col-3">
                            <label htmlFor="potential"><h6><b>Potential Zone:</b></h6></label>
                            <select className="form-control" id="potential"
                                name="potential" 
                            >
                                <option value="" >--Potential Zone--
                                </option>
                                <option value="K.Mishra">Hyper</option>
                                <option value="potential 1">High I</option>
                                <option value="potential 2">High II</option>
                                <option value="potential 2">Medium</option>
                                <option value="potential 2">Low I</option>
                                <option value="potential 2">Low II</option>
                            </select>
                        
                        </div>
                    <Col md={4} xxl lg="3">
                        <div>
                            <Form.Label><b>District</b> <span style={{ color: "red" }}>*</span></Form.Label>
                        </div>
                        <Form.Select type="text" defaultValue="Select" placeholder="District" >
                            {/* {(districtData !== undefined && districtData.length > 0) ?
                                (districtData.map((el, i) =>
                                    <option value={el.districtCode}>{el.districtName}</option>)) : */}
                                <option value="1">no district</option>


                        </Form.Select>
                    </Col>
                    <Col md={4} xxl lg="3">
                        <div>
                            <Form.Label><b>State </b><span style={{ color: "red" }}>*</span></Form.Label>
                        </div>
                        <Form.Control type="text" defaultValue="Haryana" disabled  >
                        </Form.Control>
                    </Col>
                </Row>
                
                <div className="ml-auto" style={{ marginTop: 20 }}>
                    <h2 style={{ fontSize: 24 }}>2. Details of applied land:</h2>
                    <p>Note: The term “Collaboration agreement" shall include all Development agreements/ Joint Venture agreements/ Joint Development agreements/ Memorandum of Understanding etc. and similar agreements registered with competent authority.</p>
                    <p><b>(i) Khasra-wise information to be provided in the following format:</b></p>
                </div>
                <div className="ml-auto">
                    <Button variant="primary" >
                        Enter Details
                    </Button>
                    </div>
                    <br></br>
                
                <div className="applt" style={{ overflow: "auto" }}>
                    <table className="table table-bordered" style={{ backgroundColor: "rgb(251 251 253))", overflow: "auto" }}>
                        <thead>
                            <tr>
                                <th>Tehsil</th>
                                <th>Revenue estate</th>
                                <th>Rectangle No.</th>
                                <th>Killa</th>
                                <th>Land owner</th>
                                <th>Consolidation Type</th>
                                <th>Kanal</th>
                                <th>Marla</th>
                                <th>Sarsai</th>
                                <th>Bigha</th>
                                <th>Biswa</th>
                                <th>Biswansi</th>
                                {/* <th>Area &nbsp;&nbsp;<CalculateIcon color="primary" /></th> */}
                                {/* <th>  <h6 data-toggle="tooltip" data-placement="top" title="Whether collaboration agreement entered for the Khasra?(yes/no)"><b>Collaboration agreement&nbsp;&nbsp;<InfoIcon style={{color:"blue"}}/> </b>&nbsp;&nbsp;</h6> */}
                                
                            </tr>
                        </thead>
                        {/* <tbody>
                        {
                          (modalApplicantValuesArray.length>0)?
                          modalApplicantValuesArray.map((elementInArray, input) => {
                            return (
                            <tr >
                                <td ><input type="text"   value={elementInArray.tehsil}
                                    placeholder={elementInArray.tehsil} className="form-control" disabled/></td>
                                <td ><input type="text"  value={elementInArray.revenueEstate}
                                    placeholder={elementInArray.revenueEstate} className="form-control"disabled /></td>
                                <td ><input type="text"  value={elementInArray.rectangleNo}
                                    placeholder={elementInArray.rectangleNo} className="form-control"disabled /></td>
                                <td class="text-center"><input type="text" value={elementInArray.killa}
                                    placeholder={elementInArray.killa}  className="form-control"disabled /></td>
                                <td class="text-center"><input type="text"value={elementInArray.land}
                                    placeholder={elementInArray.land} className="form-control" disabled/></td>
                                <td class="text-center"> <input type="text" value={elementInArray.consolidation}
                                    placeholder={elementInArray.consolidation} className="form-control"disabled /> </td>
                                <td class="text-center"><input type="text" value={elementInArray.kanal}
                                    placeholder={elementInArray.kanal} className="form-control" disabled/></td>
                                <td class="text-center"><input type="text"value={elementInArray.marla}
                                    placeholder={elementInArray.marla} className="form-control" disabled/></td>
                                <td class="text-center"><input type="text" value={elementInArray.sarsai}
                                    placeholder={elementInArray.sarsai} className="form-control" disabled/></td>
                                <td class="text-center"><input type="text" value={elementInArray.bigha}
                                    placeholder={elementInArray.bigha} className="form-control" disabled/></td>
                                <td class="text-center"><input type="text" value={elementInArray.biswa}
                                    placeholder={elementInArray.biswa} className="form-control" disabled/></td>
                                <td class="text-center"><input type="text"value={elementInArray.biswansi}
                                    placeholder={elementInArray.biswansi} className="form-control" disabled/></td>
                                <td class="text-center"><input type="text" value={elementInArray.area}
                                    placeholder={elementInArray.area}className="form-control"disabled /></td>
                                <td class="text-center"> <input type="text"value={elementInArray.collaboration}
                                    placeholder={elementInArray.collaboration} className="form-control"disabled /></td>
                               
                            </tr>
                             );
                            })
                            :
                            <p>Click on the Add More Button</p>
                          }
                        </tbody> */}
                    </table>
                </div>  </Form.Group>
                     
                        <Button style={{ alignSelf: "center", marginTop: "25px",marginLeft:"-694px" }} variant="primary" type="submit">
                Save as Draft
            </Button>
            <Button style={{ alignSelf: "center", marginTop: "-35px", marginLeft: "715px" }} variant="primary" type="submit">
                Continue
            </Button>
                        </Card>
                    </Form>
            
                )
            } 
            
            export default ApllicantPuropseForm;