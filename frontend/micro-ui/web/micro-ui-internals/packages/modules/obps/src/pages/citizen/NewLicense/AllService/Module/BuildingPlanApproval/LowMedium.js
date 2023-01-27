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

  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };
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

                <select className="form-control" {...register("selectType")} onChange={(e) => handleshowhide(e)}>
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
                <Form.Group as={Col} controlId="formGridState">
                    <Form.Label>
                        Address
                    </Form.Label>
                    <input type="text" placeholder="" className="form-control" {...register("address")} />
                </Form.Group>
            </Col>

            <Col className="col-4">
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
