import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Button, Form } from "react-bootstrap";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useForm } from "react-hook-form";
import Collapse from "react-bootstrap/Collapse";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Modal, ModalHeader, ModalBody, ModalFooter, Label } from "reactstrap";
import { Input } from "antd";
function RenewNew() {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const [modal, setmodal] = useState(false);
  const [modal1, setmodal1] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [open3, setOpen3] = useState(false);
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
    watch,
  } = useForm({});

  const bankRenew = (data) => console.log(data);
  return (
    <form onSubmit={handleSubmit(bankRenew)}>
         <div className="card" style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Extension of Bank Guarantee</h4>
        <br></br>
         <div
        className="collapse-header"
        onClick={() => setOpen4(!open4)}
        aria-controls="example-collapse-text"
        aria-expanded={open4}
        style={{
          background: "#f1f1f1",
          padding: "0.25rem 1.25rem",
          borderRadius: "0.25rem",
          fontWeight: "600",
          display: "flex",
          cursor: "pointer",
          color: "#817f7f",
          justifyContent: "space-between",
          alignContent: "center",
        }}
      >
        <span style={{ color: "#817f7f", fontSize: 14 }} className="">
          - BG Detail
        </span>
        {open4 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
       <Collapse in={open4}>
        <div className="card">
          <div className="row-12">
            <div className="col md={4} xxl lg-3">
              <FormControl>
                <h2 className="FormLable">Bank Guarantee No. </h2>
                <OutlinedInput type="text" className="Inputcontrol" placeholder="" {...register("bgNumber")}  disabled/>
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">Bank Guarantee Issue date </h2>
                <OutlinedInput type="date" className="Inputcontrol" placeholder="" {...register("bgNumber")}  disabled/>
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">Expiry date </h2>
                <OutlinedInput type="date" className="Inputcontrol" placeholder="" {...register("bgNumber")}  disabled/>
              </FormControl>
               &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">Claim expiry date </h2>
                <OutlinedInput type="date" className="Inputcontrol" placeholder="" {...register("bgNumber")}  disabled/>
              </FormControl>
               &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">Amount </h2>
                <OutlinedInput type="text" className="Inputcontrol" placeholder="" {...register("bgNumber")}  disabled/>
              </FormControl>
            </div>
            <br></br>
             <div className="row-12">
 <div className="col md={4} xxl lg-3">
              <FormControl>
                <h2 className="FormLable">Issuing Bank </h2>
                <OutlinedInput type="text" className="Inputcontrol" placeholder="" {...register("bgNumber")} disabled />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">Country of origin</h2>
                <OutlinedInput type="date" className="Inputcontrol" placeholder="" {...register("bgNumber")} disabled />
              </FormControl>
            
            </div>
            </div>

             <br></br>
           <div className="row gy-3">
                        <div className="col col-12">
                           <h2 className="FormLable">
                               Amount in words<span style={{ color: "red" }}>*</span>
                              </h2>
                              <input type="text" className="form-control" disabled></input>
                        </div>
            </div>
            </div>
            </div>
          </Collapse>
            <br></br>
             <div
        className="collapse-header"
        onClick={() => setOpen3(!open3)}
        aria-controls="example-collapse-text"
        aria-expanded={open3}
        style={{
          background: "#f1f1f1",
          padding: "0.25rem 1.25rem",
          borderRadius: "0.25rem",
          fontWeight: "600",
          display: "flex",
          cursor: "pointer",
          color: "#817f7f",
          justifyContent: "space-between",
          alignContent: "center",
        }}
      >
        <span style={{ color: "#817f7f", fontSize: 14 }} className="">
          - BG Detail
        </span>
        {open4 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
       <Collapse in={open3}>
             <div className="card">
              <div className="row-12">
             <div className="col md={4} xxl lg-3">
              <FormControl>
                <h2 className="FormLable">Bank Guarantee No. </h2>
                <OutlinedInput type="text" className="Inputcontrol" placeholder="" {...register("bgNumber")}  />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">Date of amendment</h2>
                <OutlinedInput type="date" className="Inputcontrol" placeholder="" {...register("bgNumber")}  />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">Amendment expiry date </h2>
                <OutlinedInput type="date" className="Inputcontrol" placeholder="" {...register("bgNumber")}  />
              </FormControl>
               &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">Amendment claim expiry date  </h2>
                <OutlinedInput type="date" className="Inputcontrol" placeholder="" {...register("bgNumber")} />
              </FormControl>
              </div>
              </div>
              <br></br>
                    <div className="row-12">
 <div className="col md={4} xxl lg-3">
    <FormControl>
                <h2 className="FormLable">Amount </h2>
                <OutlinedInput type="text" className="Inputcontrol" placeholder="" {...register("bgNumber")}  disabled/>
              </FormControl>
              <FormControl>
                <h2 className="FormLable">Issuing Bank </h2>
                <OutlinedInput type="text" className="Inputcontrol" placeholder="" {...register("bgNumber")} disabled />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">Country of origin</h2>
                <OutlinedInput type="date" className="Inputcontrol" placeholder="" {...register("bgNumber")} disabled />
              </FormControl>
            
            </div>
            </div>
            <br></br>
                <div className="row gy-3">
                        <div className="col col-12">
                           <h2 className="FormLable">
                               Amount in words<span style={{ color: "red" }}>*</span>
                              </h2>
                              <input type="text" className="form-control" disabled></input>
                        </div>
            </div>
            </div>
           </Collapse>
            <br></br>
          <div className="col-12">
                  <label>
                    <h2>Hardcopy Submitted at TCP office. </h2>
                    <label htmlFor="licenseApplied">
                      <input {...register("licenseApplied")} type="radio" value="Y" id="licenseApplied" />
                      &nbsp; Yes &nbsp;&nbsp;
                    </label>
                    <label htmlFor="licenseApplied">
                      <input
                        {...register("licenseApplied")}
                        type="radio"
                        value="N"
                        id="licenseApplied"
                        className="btn btn-primary"
                        // onClick={handleClickOpen}
                      />
                      &nbsp; No &nbsp;&nbsp;
                    </label>
                   
                  </label>
                </div>
            &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
 <div className="table table-bordered table-responsive">
                        {/* <caption>List of users</caption> */}
                        <thead>
                          <tr>
                            <th class="fw-normal">Sr. No.</th>
                            <th class="fw-normal">Type</th>
                            <th class="fw-normal">Attachment description</th>
                             <th class="fw-normal"></th>
                              <th class="fw-normal">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                           <tr>
                            <td>1</td>
                             <td>Bank Guarantee(pdf)</td>
                              <td><input type="text" className="form-control"></input></td>
                               <td><input type="file" className="form-control"></input></td>
                               <td></td>
                          </tr>
                           <tr>
                            <td>2</td>
                             <td>Any other document (pdf)</td>
                              <td><input type="text" className="form-control"></input></td>
                               <td><input type="file" className="form-control"></input></td>
                               <td></td>
                          </tr>
                        </tbody>
                        </div>
           
            <div class="row-12" className="align-right">
              <div className="col-4">
                <Button variant="contained" class="btn btn-primary btn-md center-block">
                  Cancel
                </Button>
                &nbsp;
                <Button variant="contained" type="submit" class="btn btn-primary btn-md center-block">
                  Submit
                </Button>
              </div>
            </div>
          </div>
       
    </form>
  );
}

export default RenewNew;
