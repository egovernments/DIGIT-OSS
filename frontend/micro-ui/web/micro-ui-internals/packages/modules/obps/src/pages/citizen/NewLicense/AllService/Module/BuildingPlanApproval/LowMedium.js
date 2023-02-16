import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Card } from "react-bootstrap";
import { useForm } from "react-hook-form";
import FileUploadIcon from '@mui/icons-material/FileUpload';


function LowMedium() {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const [showCaseHide, setCase] = useState("")
  const [showOffice, setOffice] = useState("")

  const handleshowhide = (event) => {
    event.preventDefault()
    const getuser = event.target.value;

    setShowhide(getuser);
    console.log({getuser, showhide}, "uuuuuu");
  };
  const handleCase = (e) => {
    e.preventDefault()
    setCase(e.target.value)
  }
  const handleOffice = (e) => {
    e.preventDefault()
    setOffice(e.target.value)
  }
  const handleselects = (event) => {
    const getu = event.target.value;

    setSelects(getu);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({});

  const SurrenderLic = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(SurrenderLic)}>
      <Card style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }} className="text-center">
          Building Plan Approval for Low and Medium Risk
        </h4>
        <div className="card">
          <br></br>
          <Row className="col-12">
            <Col className="col-4">
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  Select Licence/CLU No. <span style={{ color: "red" }}>*</span>
                </Form.Label>

                <select className="form-control" {...register("selectType")} onChange={(e) => handleshowhide(e)} value={showhide}>
                  <option value=" ">----Select-----</option>
                  <option value="1">(a)Licence No.</option>
                  <option value="2">(b)LC No.</option>  
                  <option value="3">(c) CLU No.</option>
                </select>
              </Form.Group>
            </Col>
            <Col className="col-4">
              <Form.Group as={Col} controlId="formGridArea">
                <div>
                  {showhide === "1" && (
                    <div className="col-md-12 ">
                      <Form.Label>
                        Sector/Colony Name <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <input type="text" placeholder="" className="form-control" {...register("sectorName")} />
                      <Form.Label>
                        Plot No.<span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <input type="number" placeholder="" className="form-control" {...register("plotno")} />
                    </div>
                    
                  )}
                </div>
              </Form.Group>
            </Col>
            <Col className="col-4">
              <Form.Group as={Col} controlId="formGridArea">
                <div>
                  {showhide === "3" && (
                    <div className="col-md-12 ">
                      <Form.Label>
                        Applicant Name <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <input type="text" placeholder="" className="form-control" {...register("applicantName")} />
                      <Form.Label>
                        Khasra No.<span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <input type="number" placeholder="" className="form-control" {...register("khasrano")} />
                      <Form.Label>
                        Contact No. <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <input type="text" placeholder="" className="form-control" {...register("contactno")} />
                    </div>
                    
                  )}
                </div>
              </Form.Group>
            </Col>
            
          </Row>
          <br></br>
          <Row className="col-12">
            <Col className="col-4">
                <Form.Group as={Col} controlId="formGridState">
                    <Form.Label>
                        Address <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <input type="text" placeholder="" className="form-control" {...register("address")} />
                </Form.Group>
            </Col>
          </Row>
          <br></br>
          <Row className="col-12">
            <Col className="col-6">
                <Form.Group as={Col} controlId="formGridState">
                    <Form.Label>
                        Upload drawing in .dxf format
                    </Form.Label>
                    <label for='file-input-5'>
                    <FileUploadIcon 
                    color="primary"
                    />
                  </label>
                  <input 
                  type="file" 
                  className="form-control" 
                  //onChange={(e) => getDocumentData(e?.target?.files[0], "verifiedPlan")} 
                  style={{display: "none"}}
                  id="file-input-5"
                  />
                </Form.Group>
            </Col>
          </Row>
          <br></br>
          <Row className="col-12">
            <Col className="col-4">
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  Case Type <span style={{ color: "red" }}>*</span>
                </Form.Label>

                <select className="form-control" {...register("selectType")} onChange={(e) => handleCase(e)} value={showCaseHide}>
                  <option value=" ">----Select-----</option>
                  <option value="a">Fresh</option>
                  <option value="b">Revised(Without OC certificate)</option>  
                  <option value="c">Addition and Alteration (With OC certificate)</option>
                  <option value="d">Re-construction</option>
                </select>
              </Form.Group>
            </Col>
            <Col className="col-4">
              <Form.Group as={Col} controlId="formGridArea">
                    <div className="col-md-12 ">
                      <Form.Label>
                        District <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <input type="text" placeholder="" className="form-control" {...register("district")} />
                    </div>
              </Form.Group>
            </Col>
          </Row>
          <br></br>
          <Row className="col-12">
            <Col className="col-4">
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  Office <span style={{ color: "red" }}>*</span>
                </Form.Label>

                <select className="form-control" {...register("selectType")} onChange={(e) => handleOffice(e)} value={showOffice}>
                  <option value=" ">----Select-----</option>
                  <option value="e">Panchkula</option>
                  <option value="f">Gurugram</option>  
                  <option value="g">Faridabad</option>
                  <option value="h">Rohtak</option>
                  <option value="i">Hisar</option>
                </select>
              </Form.Group>
            </Col>
            <Col className="col-4">
              <Form.Group as={Col} controlId="formGridArea">
                    <div className="col-md-12 ">
                      <Form.Label>
                        Town <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <input type="text" placeholder="" className="form-control" {...register("town")} />
                    </div>
              </Form.Group>
            </Col>
            <Col className="col-4">
              <Form.Group as={Col} controlId="formGridArea">
                    <div className="col-md-12 ">
                      <Form.Label>
                        Floor-wise Coverage Area<span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <input type="text" placeholder="" className="form-control" {...register("floorWiseArea")} />
                    </div>
              </Form.Group>
            </Col>
          </Row>
          <br></br>
          <Row className="col-12">
            <Col className="col-4">
            <Form.Group as={Col} controlId="formGridArea">
                    <div className="col-md-12 ">
                      <Form.Label>
                        Total <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <input type="text" placeholder="" className="form-control" {...register("total")} />
                    </div>
              </Form.Group>
            </Col>
            <Col className="col-4">
              <Form.Group as={Col} controlId="formGridArea">
                    <div className="col-md-12 ">
                      <Form.Label>
                        Build Up Area <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <input type="text" placeholder="" className="form-control" {...register("buildupArea")} />
                    </div>
              </Form.Group>
            </Col>
            <Col className="col-4">
              <Form.Group as={Col} controlId="formGridArea">
                    <div className="col-md-12 ">
                      <Form.Label>
                        Purchaseable Area<span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <input type="text" placeholder="" className="form-control" {...register("purchaseableArea")} />
                    </div>
              </Form.Group>
            </Col>
          </Row>
          <br></br>
          <Row className="col-12">
            <Col className="col-3">
            <Form.Group as={Col} controlId="formGridArea">
                    <div className="col-md-12 ">
                      <Form.Label>
                        Setback <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <input type="text" placeholder="Front" className="form-control" {...register("front")} />
                    </div>
              </Form.Group>
            </Col>
            <Col className="col-3">
              <Form.Group as={Col} controlId="formGridArea">
                    <div className="col-md-12 ">
                    <Form.Label>
                      
                    </Form.Label>
                      <input type="text" placeholder="Rear" className="form-control" {...register("back")} />
                    </div>
              </Form.Group>
            </Col>
            <Col className="col-3">
              <Form.Group as={Col} controlId="formGridArea">
                    <div className="col-md-12 ">
                    <Form.Label>
                      
                    </Form.Label>
                      <input type="text" placeholder="Side1" className="form-control" {...register("side1")} />
                    </div>
              </Form.Group>
            </Col>
            <Col className="col-3">
              <Form.Group as={Col} controlId="formGridArea">
                    <div className="col-md-12 ">
                    <Form.Label>
                        
                    </Form.Label>
                      <input type="text" placeholder="Side2" className="form-control" {...register("side2")} />
                    </div>
              </Form.Group>
            </Col>
          </Row>
          <br></br>
          <Row className="col-12">
            <Col className="col-6">
            <Form.Group as={Col} controlId="formGridArea">
                    <div className="col-md-12 ">
                      <Form.Label>
                        Basement Position <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <input type="text" placeholder="distance from the left side" className="form-control" {...register("front")} />
                    </div>
              </Form.Group>
            </Col>
            <Col className="col-6">
              <Form.Group as={Col} controlId="formGridArea">
                    <div className="col-md-12 ">
                    <Form.Label>
                      
                    </Form.Label>
                      <input type="text" placeholder="distance from the right side" className="form-control" {...register("back")} />
                    </div>
              </Form.Group>
            </Col>
          </Row>
          <br></br>
          <Row className="col-12">
            <Col className="col-4">
            <Form.Group as={Col} controlId="formGridArea">
                    <div className="col-md-12 ">
                      <Form.Label>
                        Exsisting Area of all floors <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <input type="text" placeholder="" className="form-control" {...register("areaofallfloors")} />
                    </div>
              </Form.Group>
            </Col>
            <Col className="col-4">
              <Form.Group as={Col} controlId="formGridArea">
                    <div className="col-md-12 ">
                    <Form.Label>
                      Exsisting FAR Achieved
                    </Form.Label>
                      <input type="text" placeholder="" className="form-control" {...register("farachieved")} />
                    </div>
              </Form.Group>
            </Col>
            <Col className="col-4">
              <Form.Group as={Col} controlId="formGridArea">
                    <div className="col-md-12 ">
                    <Form.Label>
                      Exsisting Purchaseable Area
                    </Form.Label>
                      <input type="text" placeholder="" className="form-control" {...register("purchasableArea")} />
                    </div>
              </Form.Group>
            </Col>
          </Row>
          <br></br>
          <Row className="col-12">
            <Col className="col-4">
            <Form.Group as={Col} controlId="formGridArea">
                    <div className="col-md-12 ">
                      <Form.Label>
                        Approved date of building plan<span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <input type="date" placeholder="" className="form-control" {...register("approvedDate")} />
                    </div>
              </Form.Group>
            </Col>
            <Col className="col-4">
              <Form.Group as={Col} controlId="formGridArea">
                    <div className="col-md-12 ">
                    <Form.Label>
                      Proposed Floor wise Coverage Area
                    </Form.Label>
                      <input type="text" placeholder="" className="form-control" {...register("floorwise")} />
                    </div>
              </Form.Group>
            </Col>
            <Col className="col-4">
              <Form.Group as={Col} controlId="formGridArea">
                    <div className="col-md-12 ">
                    <Form.Label>
                      Proposed Total Area
                    </Form.Label>
                      <input type="text" placeholder="" className="form-control" {...register("ProposedTotal")} />
                    </div>
              </Form.Group>
            </Col>
          </Row>
          <br></br>
          <Row className="col-12">
            <Col className="col-4">
              <Form.Group as={Col} controlId="formGridArea">
                    <div className="col-md-12 ">
                    <Form.Label>
                      Proposed Built-up Area
                    </Form.Label>
                      <input type="text" placeholder="" className="form-control" {...register("buildUpArea")} />
                    </div>
              </Form.Group>
            </Col>
            <Col className="col-4">
              <Form.Group as={Col} controlId="formGridArea">
                    <div className="col-md-12 ">
                    <Form.Label>
                      Proposed Purchaseable Area
                    </Form.Label>
                      <input type="text" placeholder="" className="form-control" {...register("PurchaseableArea")} />
                    </div>
              </Form.Group>
            </Col>
          </Row>
          <br></br>
          <Row className="col-12">
            <Col className="col-4">
              <Form.Group as={Col} controlId="formGridArea">
                    <div className="col-md-12 ">
                    <Form.Label>
                    Citizen Name
                    </Form.Label>
                      <input type="text" placeholder="" className="form-control" {...register("citizenName")} />
                    </div>
              </Form.Group>
            </Col>
            <Col className="col-4">
              <Form.Group as={Col} controlId="formGridArea">
                    <div className="col-md-12 ">
                    <Form.Label>
                      Mobile Number
                    </Form.Label>
                      <input type="number" placeholder="" className="form-control" {...register("mobilenumber")} />
                    </div>
              </Form.Group>
            </Col>
            <Col className="col-4">
              <Form.Group as={Col} controlId="formGridArea">
                    <div className="col-md-12 ">
                    <Form.Label>
                      Email Id
                    </Form.Label>
                      <input type="email" placeholder="" className="form-control" {...register("email")} />
                    </div>
              </Form.Group>
            </Col>
          </Row>
          <br></br>
          <br></br>
          <div className="table table-bordered table-responsive">
            <thead>
              <tr>
                <td style={{ textAlign: "center" }}> Sr.No.</td>
                <td style={{ textAlign: "center" }}>Field Name</td>
                <td style={{ textAlign: "center" }}>File</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">1.</p>
                  </div>
                </td>
                <td component="th" scope="row">
                  <h2>Form BR-I</h2>
                </td>
                <td component="th" scope="row">
                  <label for='file-input-1'>
                    <FileUploadIcon 
                    color="primary"
                    />
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="file-input-1"
                    // onChange={(e) => getDocumentData(e?.target?.files[0], "selfCertifiedDrawingFromEmpaneledDoc")}
                    style={{display: "none"}}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">2.</p>
                  </div>
                </td>
                <td component="th" scope="row">
                  <h2>Form BR- II</h2>
                </td>
                <td component="th" scope="row">
                <label for='file-input-2'>
                    <FileUploadIcon 
                    color="primary"
                    />
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="file-input-2"
                    // {...register("environmentalClearance")}
                    // onChange={(e) => getDocumentData(e?.target?.files[0], "environmentalClearance")}
                    style={{display: "none"}}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">3.</p>
                  </div>
                </td>
                <td component="th" scope="row">
                  <h2>Form BR-V(A1) (up to 15 M Ht.)/BR-V(A2)(Above 15 M Ht.)</h2>
                </td>
                <td component="th" scope="row">
                <label for='file-input-3'>
                    <FileUploadIcon 
                    color="primary"
                    />
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    // {...register("shapeFileAsPerTemplate")}
                    id="file-input-3"
                    // onChange={(e) => getDocumentData(e?.target?.files[0], "shapeFileAsPerTemplate")}
                    style={{display: "none"}}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">4.</p>
                  </div>
                </td>
                <td component="th" scope="row">
                  <h2>An Affidavit from the Owner and
                    Architect that they have understood the
                    provisions of the zoning plan/Haryana
                    Building Code 2017 (whichever is
                    applicable) <br></br>
                    and shall not deviate from
                    the same
                  </h2>
                </td>
                <td component="th" scope="row">
                <label for='file-input-4'>
                    <FileUploadIcon 
                    color="primary"
                    />
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="file-input-4"
                    // {...register("autoCadFile")}
                    // onChange={(e) => getDocumentData(e?.target?.files[0], "autoCadFile")}
                    style={{display: "none"}}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">5.</p>
                  </div>
                </td>
                <td component="th" scope="row">
                  <h2>Certificate regarding the functionality of
                      services as obtained from colonizer by
                      owner/Architect
                  </h2>
                </td>
                <td component="th" scope="row">
                <label for='file-input-5'>
                    <FileUploadIcon 
                    color="primary"
                    />
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    // {...register("certifieadCopyOfThePlan")}
                    id="file-input-5"
                    // onChange={(e) => getDocumentData(e?.target?.files[0], "certifieadCopyOfThePlan")}
                    style={{display: "none"}}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">6.</p>
                  </div>
                </td>
                <td component="th" scope="row">
                  <h2>Copy of Zoning plan/Verification of
                      boundary duly verified by the colonizer
                  </h2>
                </td>
                <td component="th" scope="row">
                <label for='file-input-5'>
                    <FileUploadIcon 
                    color="primary"
                    />
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    // {...register("certifieadCopyOfThePlan")}
                    id="file-input-5"
                    // onChange={(e) => getDocumentData(e?.target?.files[0], "certifieadCopyOfThePlan")}
                    style={{display: "none"}}
                  />
                </td>
              </tr>
            </tbody>
          </div>
          <div class="row">
            <div class="col-sm-12 text-right">
              <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
                Submit
              </button>
            </div>
            <div class="col-sm-12 text-right">
              <button id="btnSearch" class="btn btn-primary btn-md center-block" style={{ marginTop: "-58px", marginRight: "97px" }}>
                Save as Draft
              </button>
            </div>
          </div>
        </div>
      </Card>
    </form>
  );
}

export default LowMedium;
