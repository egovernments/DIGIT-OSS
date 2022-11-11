// import React from "react";
// import Form from "react-bootstrap/Form";
// import Table from "react-bootstrap/Table";
// import { Link } from "react-router-dom";

// function TransferLicense() {
//   return (
//     <>
//       <div className="container my-5">
//         <div className=" col-12 m-auto">
//           <div className="card">
//             <h5 className="card-h">Transfer of License</h5>
//             <div className="row">
//               <div className="col col-4">
//                 <div className="card-body">
//                   <div className="card-button">
//                     <h5 className="card-hd">
//                       Technical Capacity
//                     </h5>
//                   </div>
//                 </div>
//               </div>
//               <div className="col col-4">
//                 <div className="card-body">
//                   <div className="card-button">
//                     <h5 className="card-hd">
//                       Financial Capacity
//                     </h5>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//     </>
//   );
// }
// export default TransferLicense;

import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

function TransferLicense() {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");

  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };
  const handleselects = (event) => {
    const getu = event.target.value;
    

    setSelects(getu);
  };

  //   const handleselects = (event) => {
  //     const getus = event.target.value;

  //     setSelects(getus);
  // };

  return (
    <div className="container my-5">
      <div className=" col-12 m-auto">
        <div className="card">
          <Form>
            <h4 className="text-center">Transfer of License</h4>
            <Row className="col-12">
              <Form.Group as={Col} controlId="formGridLicence">
                <Form.Label>
                  Licence No . <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control type="number" placeholder="Enter Licence" />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  Select Type (Complete or Partial){" "}
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Select onChange={(e) => handleshowhide(e)}>
                  <option value=" 6">----Select value-----</option>
                  <option value="1">Complete</option>
                  <option value="2">Partia</option>
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridArea">
               
                <div>
                  {showhide === "5" || showhide === "2" && (
                    <div className="col-md-12 form-group">
                      <Form.Label>
                        Area in Acres <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control type="number" placeholder="Enter Area" />
                    </div>
                  )}
                </div>
              </Form.Group>
            </Row>

           
            <fieldset>
              <Form.Group as={Row} className="mb-4">
                <Form.Label>
                  Do you want to apply for Change of Developer
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>

                
                  <Row >
                  <Col className="col-1">
                    <Form.Check
                      type="radio"
                      label="Yes"
                      name="formHorizontalRadios"
                      id="formHorizontalRadios1"
                      value="4"
                      onChange={(e) => handleshowhide(e)}
                    />
                    </Col>
                    <Col className="col-1">
                    <Form.Check
                      type="radio"
                      label="No"
                      name="formHorizontalRadios"
                      id="formHorizontalRadios2"
                      value="5"
                      onChange={(e) => handleshowhide(e)}
                    />
                    </Col>
                  </Row>
                
              </Form.Group>
            </fieldset>
            <Row>
          <div>
            {showhide === "1" || showhide === "4" && (
              <div className="card">
                <div class="bordere">
                  <div class="table-responsive">
                    <table class="table">
                       <thead>
                        <tr>
                          <th scope="col">Sr.No</th>
                          <th scope="col">Field Name</th>
                          <th scope="col">Upload Documents</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">1</th>
                          <td>
                          Undertaking regarding the creation of 3rd party right on the licensed area
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">2</th>
                          <td>
                            {" "}
                            The colonizer seeking transfer of whole license/part license shall submit self-certification along with a certificate of the Chartered Accountant that a 15% profit margin is not exceeded from the project cost at the time of submission of application for transfer of license{" "}
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">3</th>
                          <td>
                            {" "}
                            A consent letter from the ‘new entity for the proposed change along with justification<span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">4</th>
                          <td>
                            {" "}
                            Board resolution of authorized signatory{" "}
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">5</th>
                          <td>
                          No objection certificate from the existing ‘Developer, filed through its authorized signatory, specifically designated for the purpose; as well as from the ‘land owner licensees’, in person (not through GPA/SPA assignees), to the proposed change/assignment.
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">6</th>
                          <td>
                          Documents about the Technical and Financial Capacity of the ‘new entity’ proposed to be inducted as a ‘Developer’ or ‘shareholder(s)’ as per prescribed policy parameters for grant of a license l
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">7</th>
                          <td>
                          An undertaking to pay the balance administrative charges before final approval <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">8</th>
                          <td>
                          Justification for request
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">9</th>
                          <td>
                          An undertaking to the effect that in case the administrative charges for such cases are fixed in act and rules at a rate higher than that been recovered, the applicant shall be liable to pay the difference as and when demanded by TCP 
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                          <input type="file"></input>
                          </td>
                        </tr>
                          <tr>
                            <th scope="row">10</th>
                            <td>
                            The status regarding the creation of third-party rights in the colony. In case no third-party rights are claimed to have been created in the colony, an affidavit to the said effect be also submitted by the existing developer
                              <span style={{ color: "red" }}>*</span>
                            </td>
                            <td>
                              <input type="file"></input>
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">11</th>
                            <td>
                              {" "}
                              Status regarding registration of project in RERA
                              <span style={{ color: "red" }}>*</span>
                            </td>
                            <td>
                              <input type="file"></input>
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">12</th>
                            <td>
                              {" "}
                              Any Other Document <span style={{ color: "red" }}>*</span>
                            </td>
                            <td>
                              <input type="file"></input>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            {showhide === "1" || showhide === "5" && (
              <div className="card">
                <div class="bordere">
                  <div class="table-responsive">
                    <table class="table">
                    
                      <thead>
                        <tr>
                          <th scope="col">Sr.No</th>
                          <th scope="col">Field Name</th>
                          <th scope="col">Upload Documents</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">1</th>
                          <td>
                          Undertaking regarding the creation of 3rd party right on the licensed area 
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">2</th>
                          <td>
                            {" "}
                            The colonizer seeking transfer of whole license/part license shall submit self-certification along with a certificate of the Chartered Accountant that a 15% profit margin is not exceeded from the project cost at the time of submission of application for transfer of license{" "}
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">3</th>
                          <td>
                          A consent letter from the ‘new entity for the proposed change along with justification 
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">4</th>
                          <td>
                          Board resolution of authorized signatory 
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">5</th>
                          <td>
                           
                            Status regarding registration of project in RERA 
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">6</th>
                          <td>
                            Any Other Document 
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                          <input type="file"></input>
                          </td>
                        </tr>
                        </tbody>
                    </table>
  
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            {showhide === "2" || showhide === "4" && (
              <div className="card">
                <div class="bordere">
                  <div class="table-responsive">
                    <table class="table">
                       <thead>
                        <tr>
                          <th scope="col">Sr.No</th>
                          <th scope="col">Field Name</th>
                          <th scope="col">Upload Documents</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">1</th>
                          <td>
                          Undertaking regarding the creation of 3rd party right on the licensed area
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">2</th>
                          <td>
                          A consent letter from the ‘new entity for the proposed change along with justification
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">3</th>
                          <td>
                            {" "}
                            Board resolution of authorized signatory<span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">4</th>
                          <td>
                          No objection certificate from the existing ‘Developer, filed through its authorized signatory, specifically designated for the purpose; as well as from the ‘land owner licensees’, in person (not through GPA/SPA assignees), to the proposed change/assignment. 
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">5</th>
                          <td>
                          Documents about the Technical and Financial Capacity of the ‘new entity’ proposed to be inducted as a ‘Developer’ or ‘shareholder(s)’ as per prescribed policy parameters for grant of a license 
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">6</th>
                          <td>
                          An undertaking to pay the balance administrative charges before final approval
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">7</th>
                          <td>
                          A consent letter from the ‘new entity for the proposed change along with justification<span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">8</th>
                          <td>
                          Justification for request
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">9</th>
                          <td>
                          An undertaking to the effect that in case the administrative charges for such cases are fixed in act and rules at a rate higher than that been recovered, the applicant shall be liable to pay the difference as and when demanded by TCP 
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                          <input type="file"></input>
                          </td>
                        </tr>
                          <tr>
                            <th scope="row">10</th>
                            <td>
                              {" "}
                              Status regarding registration of project in RERA
                              <span style={{ color: "red" }}>*</span>
                            </td>
                            <td>
                              <input type="file"></input>
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">11</th>
                            <td>
                              {" "}
                              Any Other Document <span style={{ color: "red" }}>*</span>
                            </td>
                            <td>
                              <input type="file"></input>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                
                  </div>
                </div>
              </div>
            )}
          </div>
          <div>
            {showhide === "2" || showhide === "5" && (
              <div className="card">
                <div class="bordere">
                  <div class="table-responsive">
                    <table class="table">
                    
                      <thead>
                        <tr>
                          <th scope="col">Sr.No</th>
                          <th scope="col">Field Name</th>
                          <th scope="col">Upload Documents</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">1</th>
                          <td>
                          Undertaking regarding the creation of 3rd party right on the licensed area 
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">2</th>
                          <td>
                          A consent letter from the ‘new entity for the proposed change along with justification
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">3</th>
                          <td>
                          Board resolution of authorized signatory
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">4</th>
                          <td>
                          Status regarding registration of project in RERA 
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">5</th>
                          <td>
                           
                          Any Other Document 
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                       
                        </tbody>
                    </table>
  
                  </div>
                </div>
              </div>
            )}
          </div>
         
        </Row>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default TransferLicense;
