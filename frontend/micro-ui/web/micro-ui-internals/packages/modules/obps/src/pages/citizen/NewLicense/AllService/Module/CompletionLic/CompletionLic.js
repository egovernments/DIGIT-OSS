import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useForm } from "react-hook-form";
import { Card } from "react-bootstrap";
function CompletionLic() {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");

  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({});

  const completionLic = (data) => console.log(data);
  return (
  
        
          <form onSubmit={handleSubmit(completionLic)}>
        
            <Card style={{ width: "126%", border: "5px solid #1266af" }}>
            <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Completion Certificate In Licence Colony</h4>
            <div className="card">
       
            <Row>
              <Col className="col-4">
                <Form.Group controlId="formGridCase">
                  <Form.Label>
                    <h2>License No </h2>
                  </Form.Label>
                  <input type="number" className="form-control" placeholder="" {...register("licNo")} />
                </Form.Group>
              </Col>
              <Col className="col-4">
                <Form.Group controlId="formGridCase">
                  <Form.Label data-toggle="tooltip" data-placement="top" title="The license is valid at the time of completion certificate">
                    <h2>completion certificate</h2>
                  </Form.Label>
                  <input type="text" className="form-control" placeholder="" {...register("completionCertificate")} />
                </Form.Group>
              </Col>
              <Col className="col-4">
                <Form.Group controlId="formGridState">
                  <Form.Label
                    data-toggle="tooltip"
                    data-placement="top"
                    title=" EDC and IDC be fully paid and bank guarantees on account of
                    IDW are valid."
                  >
                    <h2>EDC and IDC be fully paid </h2>
                  </Form.Label>
                  <input type="text" className="form-control" placeholder="" {...register("edcFullypaid")} />
                </Form.Group>
              </Col>
              <Col className="col-4">
                <Form.Group controlId="formGridState">
                  <Form.Label>
                    <h2> Status of complaint if any. </h2>
                  </Form.Label>
                  <input type="text" className="form-control" placeholder="" {...register("statusOfComplaint")} />
                </Form.Group>
              </Col>
              <Col className="col-4">
                <Form.Group controlId="formGridState">
                  <Form.Label
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Status of total community sites/approval of zoning/building
                    plans and occupation certificate granted."
                  >
                    <h2> Occupation Certificate </h2>
                  </Form.Label>
                  <input type="text" className="form-control" placeholder="" {...register("occupationCertificate")} />
                </Form.Group>
              </Col>
              <Col className="col-4">
                <Form.Group controlId="formGridState">
                  <Form.Label
                    data-toggle="tooltip"
                    data-placement="top"
                    title=" Status of NPNL plots. (detail of NPNL plots and rates
                    approval for NPNL)"
                  >
                    <h2>Status of NPNL plots.</h2>
                  </Form.Label>
                  <input type="text" className="form-control" placeholder="" {...register("statusNpnlPlot")} />
                </Form.Group>
              </Col>
              <Col className="col-4">
                <Form.Group controlId="formGridState">
                  <Form.Label data-toggle="tooltip" data-placement="top" title="Status of handing over EWS plots to housing board/allottees">
                    <h2> Housing board/allottees </h2>
                  </Form.Label>
                  <input type="text" className="form-control" placeholder="" {...register("housingBoard")} />
                </Form.Group>
              </Col>
              <Col className="col-4">
                <Form.Group controlId="formGridState">
                  <Form.Label
                    data-toggle="tooltip"
                    data-placement="top"
                    title=" Status regarding handing over of park/internal road/public
                    utility to the concerned authority"
                  >
                    <h2> Concerned Authority </h2>
                  </Form.Label>
                  <input type="text" className="form-control" placeholder="" {...register("concernedAuthority")} />
                </Form.Group>
              </Col>
              <Col className="col-4">
                <Form.Group controlId="formGridState">
                  <Form.Label
                    data-toggle="tooltip"
                    data-placement="top"
                    title=" Handing over community sites to the Government agency and
                    constructed by the Government."
                  >
                    <h2>Handing over community sites </h2>
                  </Form.Label>
                  <input type="text" className="form-control" placeholder="" {...register("handleCommunitySites")} />
                </Form.Group>
              </Col>
            </Row>
            <br>
            </br>
           
            <div className="table table-bordered table-responsive">
                  {/* <caption>List of users</caption> */}
                  <thead>
                    <tr>
                       <th class="fw-normal">Sr.No</th>
                       <th class="fw-normal">Field Name</th>
                       <th class="fw-normal">Upload Documents</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                       <th class="fw-normal">1</th>
                      <td>
                        <h2> The service plan/estimate copy of approved </h2>
                      </td>
                      <td>
                        <input type="file" className="form-control" placeholder="" {...register("servicePlanApproved")}></input>
                      </td>
                    </tr>
                    <tr>
                       <th class="fw-normal">2</th>
                      <td>
                        {" "}
                        <h2>The electrical Service plan is approved and verification of service is laid as per the approval.</h2>{" "}
                      </td>
                      <td>
                        <input type="file" className="form-control" placeholder="" {...register("electricalServicePlan")}></input>
                      </td>
                    </tr>
                    <tr>
                       <th class="fw-normal">3</th>
                      <td>
                        {" "}
                        <h2>Transfer of licensed land to the Government agency falling under 18/24 mtr. Road/green belt/sector road.</h2>{" "}
                      </td>
                      <td>
                        <input type="file" className="form-control" placeholder="" {...register("transferLicensedLand")}></input>
                      </td>
                    </tr>
                    <tr>
                       <th class="fw-normal">4</th>
                      <td>
                        {" "}
                        <h2>Occupation certificate In case of (Group Housing, Commercial, IT Colony)</h2>{" "}
                      </td>
                      <td>
                        <input type="file" className="form-control" placeholder="" {...register("occupationCertificateCommercial")}></input>
                      </td>
                    </tr>
                    <tr>
                       <th class="fw-normal">5</th>
                      <td>
                        {" "}
                        <h2>Updated compliance with Rules 24, 26(2), 27 & 28.</h2>{" "}
                      </td>
                      <td>
                        <input type="file" className="form-control" placeholder="" {...register("updatedCompliance")}></input>
                      </td>
                    </tr>
                    <tr>
                       <th class="fw-normal">6</th>
                      <td>
                        {" "}
                        <h2>Submit a report regarding infrastructure augmentation charges.</h2>
                      </td>
                      <td>
                        <input type="file" className="form-control" placeholder="" {...register("reportInfrastructure")}></input>
                      </td>
                    </tr>
                    <tr>
                       <th class="fw-normal">7</th>
                      <td>
                        {" "}
                        <h2>Third-party audit on 15% profitability and CA certificate regarding 15% profit.</h2>
                      </td>
                      <td>
                        <input type="file" className="form-control" placeholder="" {...register("thirdPartyAudit")}></input>
                      </td>
                    </tr>
                    <tr>
                       <th class="fw-normal">8</th>
                      <td>
                        {" "}
                        <h2>
                          Status of development work along with site photographs and CD/DVD regarding completion of public health services, and
                          internal roads{" "}
                        </h2>{" "}
                      </td>
                      <td>
                        <input type="file" className="form-control" placeholder="" {...register("statusDevelopment")}></input>
                      </td>
                    </tr>
                    <tr>
                       <th class="fw-normal">9</th>
                      <td>
                        {" "}
                        <h2>Report regarding functional of internal services and connection of external services of HUDA/MC. </h2>
                      </td>
                      <td>
                        <input type="file" className="form-control" placeholder="" {...register("functionalServices")}></input>
                      </td>
                    </tr>
                    <tr>
                       <th class="fw-normal">10</th>
                      <td>
                        {" "}
                        <h2>Affidavit of no unauthorized construction/addition/ alteration after the issuance of completion certificate.</h2>
                      </td>
                      <td>
                        <input type="file" className="form-control" placeholder="" {...register("affidavitUnauthorized")}></input>
                      </td>
                    </tr>
                    <tr>
                       <th class="fw-normal">11</th>
                      <td>
                        {" "}
                        <h2>NOC from MOEF required.</h2>{" "}
                      </td>
                      <td>
                        <input type="file" className="form-control" placeholder="" {...register("nocRequired")}></input>
                      </td>
                    </tr>
                    <tr>
                       <th class="fw-normal">12</th>
                      <td>
                        {" "}
                        <h2>NOC from fire safety and certificate from structural stability.</h2>
                      </td>
                      <td>
                        <input type="file" className="form-control" placeholder="" {...register("fireSafetyCertificate")}></input>
                      </td>
                    </tr>
                    <tr>
                       <th class="fw-normal">13</th>
                      <td>
                        {" "}
                        <h2>
                          Access permission from NHAI if the site abuts with NH/Scheduled Road and status regarding construction within green belt
                          along NH/Scheduled road.
                        </h2>{" "}
                      </td>
                      <td>
                        <input type="file" className="form-control" placeholder="" {...register("accessPermission")}></input>
                      </td>
                    </tr>
                  </tbody>
              
              </div>
           

            <Row className="justify-content-end">
              <Button variant="outline-primary" className="col-md-2 my-2 mx-2" type="save" aria-label="right-end">
                Save as Draft
              </Button>
              <Button variant="outline-primary" className="col-md-2 my-2 mx-2" type="submit" aria-label="right-end">
                Submit
              </Button>
            </Row>
            </div>
            </Card>
          </form>
      
    
  );
}

export default CompletionLic;
