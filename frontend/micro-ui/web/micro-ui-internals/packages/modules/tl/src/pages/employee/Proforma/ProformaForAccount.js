// import React, { useState } from "react";
// import { Button } from "@material-ui/core";
// import FormControl from "@mui/material/FormControl";
// import { useForm } from "react-hook-form";
// import OutlinedInput from "@mui/material/OutlinedInput";

// function RadioButtonsGroup() {
//   const [selects, setSelects] = useState();
//   const [showhide, setShowhide] = useState("");
//   const { register, handleSubmit } = useForm();
//   const RadioButtonsGroup = (data) => console.log(data);

//   const handleshowhide = (event) => {
//     const getuser = event.target.value;

//     setShowhide(getuser);
//   };
//   return (
//     <form onSubmit={handleSubmit(RadioButtonsGroup)}>
//       <div className="card" style={{ width: "126%", border: "5px solid #1266af" }}>
//         <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>APPROVAL OF REVISED LAYOUT PLAN OF LICENSE</h4>


//         <div className="row">
//     <FormControl>

//   <div class="col-sm-8 text-left">
// <h2 className="FormLable">
//   Any other feature
//   <span style={{ color: "red" }}>*</span>
// </h2>
// </div>
// {/* <div class="col-md-4 text-right"> */}
//     <input
//       type="radio"
//       value="true"
//       label="Yes"
//       name="anyOtherFeature"
//       id="anyOtherFeature"
//       {...register(" anyOtherFeature")}
//       onChange={(e) => handleselects(e)}
//     />

//     <input
//       type="radio"
//       value="false"
//       label="No"
//       name="c"
//       id="anyOtherFeature"
//       {...register("anyOtherFeature")}
//       onChange={(e) => handleselects(e)}
//     />
//   </div>

// </FormControl>
// </div>
// </div>
//     </form>
//   );
// }

// export default RadioButtonsGroup;

import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useForm } from "react-hook-form";
import { Card } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import Collapse from "react-bootstrap/Collapse";
//////////////////////////////////////////////////////////
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

function RadioButtonsGroup() {
    const [selects, setSelects] = useState();
    const [showhide, setShowhide] = useState("");
    const { register, handleSubmit } = useForm();
    const layoutPlan = (data) => console.log(data);

    const handleshowhide = (event) => {
        const getuser = event.target.value;

        setShowhide(getuser);
    };
    const [open2, setOpen2] = useState(false);

    return (
        <form onSubmit={handleSubmit(layoutPlan)}>
            <div
        className="collapse-header"
        onClick={() => setOpen2(!open2)}
        aria-controls="example-collapse-text"
        aria-expanded={open2}
        style={{
          background: "#f1f1f1",
          padding: "0.25rem 1.25rem",
          borderRadius: "0.25rem",
          fontWeight: "600",
          display: "flex",
          cursor: "pointer",
          color: "#817f7f",
          justifyContent: "space-between",
          alignContent: "left",
        }}
      >
        <span style={{ color: "#817f7f" }} className="">
        PERFORMA FOR SCRUTINY (BY OFFICE ACCOUNT BRANCH )
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
            <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "20px", marginBottom: "52px" }}>
                <h4 style={{ fontSize: "20px", marginLeft: "5px" }}>PERFORMA FOR SCRUTINY (BY OFFICE ACCOUNT BRANCH )</h4>
                <div className="card">
                    <Form>
                        <TableContainer >
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            Sr.No
                                        </TableCell>
                                        <TableCell align="left">
                                            Description
                                        </TableCell>
                                        <TableCell align="right">
                                            Action
                                        </TableCell>
                                        <TableCell align="right">
                                            Remarks
                                        </TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow

                                        sx={{
                                            '&:last-child td, &:last-child th':
                                                { border: 0 }
                                        }}
                                    >
                                        <TableCell >
                                            1
                                        </TableCell>
                                        <TableCell align="left">
                                            <h2>
                                                Scrutiny fee deposited is in order or not.
                                                &nbsp;&nbsp;
                                            </h2>
                                        </TableCell>
                                        <TableCell align="left">

                                            <FormControl>
                                                <div className="row">
                                                    {/* <div class="col-md-4 text-right"> */}
                                                    <div className="d-flex flex-row align-items-center my-1">

                                                        <label htmlFor="approachFromProposedSector">
                                                            <input {...register("approachFromProposedSector")} type="radio" value="Y" id="approachFromProposedSector" />
                                                            &nbsp;&nbsp; &nbsp; Yes &nbsp;&nbsp;
                                                        </label>
                                                        <label htmlFor="approachFromProposedSector">
                                                            <input {...register("approachFromProposedSector")} type="radio" value="N" id="approachFromProposedSector" />
                                                            &nbsp;&nbsp; &nbsp; No &nbsp;&nbsp;
                                                        </label>
                                                    </div>
                                                    {/* </div> */}
                                                </div>
                                            </FormControl>

                                        </TableCell>
                                        <TableCell align="left">
                                        {/* <Form.Group className="mb-3" controlId="exampleForm.ControlInput1"> */}
          {/* <Col xs={12} md={12}> */}
            {/* <Form.Label style={{ margin: 5 }}>Remarks</Form.Label> */}
            <textarea
              class="form-control"
              id="exampleFormControlTextarea1"
              placeholder="Enter your Remarks"
              autoFocus
            //   onChange={(e) => {
            //     setDeveloperRemarks({ data: e.target.value });
            //     setRemarksEntered(e.target.value);
            //   }}
              rows="3"
            //   value={RemarksDeveloper.data}
            />
            {/* <Form.Control type="text" /> */}
          {/* </Col> */}
        {/* </Form.Group> */}
                                        </TableCell>

                                    </TableRow>

                                    <TableRow

                                        sx={{
                                            '&:last-child td, &:last-child th':
                                                { border: 0 }
                                        }}
                                    >
                                        <TableCell >
                                            2
                                        </TableCell>
                                        <TableCell align="left">
                                            <h2>
                                                25% of the licence fee deposited is in order or not.
                                                &nbsp;&nbsp;
                                            </h2>
                                        </TableCell>
                                        <TableCell align="left">

                                            <FormControl>
                                                <div className="row">
                                                    {/* <div class="col-md-4 text-right"> */}
                                                    <div className="d-flex flex-row align-items-center my-1">

                                                        <label htmlFor="licencefeedeposited">
                                                            <input {...register("licencefeedeposited")} type="radio" value="Y" id="licencefeedeposited" />
                                                            &nbsp;&nbsp;&nbsp; Yes &nbsp;&nbsp;
                                                        </label>
                                                        <label htmlFor="licencefeedeposited">
                                                            <input {...register("licencefeedeposited")} type="radio" value="N" id="licencefeedeposited" />
                                                            &nbsp;&nbsp;&nbsp; No &nbsp;&nbsp;
                                                        </label>
                                                    </div></div>
                                                {/* </div> */}

                                            </FormControl>

                                        </TableCell>
                                        <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea2"
              placeholder="Enter your Remarks"
              autoFocus
            //   onChange={(e) => {
            //     setDeveloperRemarks({ data: e.target.value });
            //     setRemarksEntered(e.target.value);
            //   }}
              rows="3"
            //   value={RemarksDeveloper.data}
            />
                                        </TableCell>


                                    </TableRow>
                                    {/* ))} */}

                                    <TableRow

                                        sx={{
                                            '&:last-child td, &:last-child th':
                                                { border: 0 }
                                        }}
                                    >
                                        <TableCell >
                                            3
                                        </TableCell>
                                        <TableCell align="left">
                                            <h2>
                                                Documents submitted regarding the Financial position of the applicant/developer is in order or not.
                                                &nbsp;&nbsp;
                                            </h2>
                                        </TableCell>
                                        <TableCell align="left">

                                            <FormControl>
                                                <div className="row">
                                                    {/* <div class="col-md-4 text-right"> */}
                                                    <div className="d-flex flex-row align-items-center my-1">
                                                        &nbsp;&nbsp;
                                                        <label htmlFor="applicantdeveloper">
                                                            <input {...register("applicantdeveloper")} type="radio" value="Y" id="applicantdeveloper" />
                                                            &nbsp; Yes &nbsp;&nbsp;
                                                        </label>
                                                        <label htmlFor="applicantdeveloper">
                                                            <input {...register("applicantdeveloper")} type="radio" value="N" id="applicantdeveloper" />
                                                            &nbsp; No &nbsp;&nbsp;
                                                        </label>
                                                    </div></div>
                                                {/* </div> */}

                                            </FormControl>

                                        </TableCell>
                                        <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea3"
              placeholder="Enter your Remarks"
              autoFocus
            //   onChange={(e) => {
            //     setDeveloperRemarks({ data: e.target.value });
            //     setRemarksEntered(e.target.value);
            //   }}
              rows="3"
            //   value={RemarksDeveloper.data}
            />
                                        </TableCell>

                                    </TableRow>
                                    <TableRow

                                        sx={{
                                            '&:last-child td, &:last-child th':
                                                { border: 0 }
                                        }}
                                    >
                                        <TableCell >
                                            4
                                        </TableCell>
                                        <TableCell align="left">
                                            <h2>
                                                If the license application is under part migration/ migration, the parent license renewed/requisite renewal fee + applicable interest deposited is in order or not.
                                                &nbsp;&nbsp;
                                            </h2>
                                        </TableCell>
                                        <TableCell align="left">
                                            <FormControl>
                                                <div className="row">
                                                    {/* <div class="col-md-4 text-right"> */}
                                                    <div className="d-flex flex-row align-items-center my-1">
                                                        &nbsp;&nbsp;
                                                        <label htmlFor="renewedreuisite">
                                                            <input {...register("renewedreuisite")} type="radio" value="Y" id="renewedreuisite" />
                                                            &nbsp; Yes &nbsp;&nbsp;
                                                        </label>
                                                        <label htmlFor="renewedreuisite">
                                                            <input {...register("renewedreuisite")} type="radio" value="N" id="renewedreuisite" />
                                                            &nbsp; No &nbsp;&nbsp;
                                                        </label>
                                                    </div></div>
                                                {/* </div> */}

                                            </FormControl>
                                        </TableCell>
                                        <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea4"
              placeholder="Enter your Remarks"
              autoFocus
            //   onChange={(e) => {
            //     setDeveloperRemarks({ data: e.target.value });
            //     setRemarksEntered(e.target.value);
            //   }}
              rows="3"
            //   value={RemarksDeveloper.data}
            />
                                        </TableCell>

                                    </TableRow>
                                    <TableRow

                                        sx={{
                                            '&:last-child td, &:last-child th':
                                                { border: 0 }
                                        }}
                                    >
                                        <TableCell >
                                            5
                                        </TableCell>
                                        <TableCell align="left">
                                            <h2>
                                                If Case for Additional License, Outstanding Dues of parent license.
                                                &nbsp;&nbsp;
                                            </h2>
                                        </TableCell>
                                        <TableCell align="left">
                                            <FormControl>
                                                <div className="row">
                                                    {/* <div class="col-md-4 text-right"> */}
                                                    <div className="d-flex flex-row align-items-center my-1">
                                                        &nbsp;&nbsp;
                                                        <label htmlFor="additionalLicense">
                                                            <input {...register("additionalLicense")} type="radio" value="Y" id="additionalLicense" />
                                                            &nbsp; Yes &nbsp;&nbsp;
                                                        </label>
                                                        <label htmlFor="additionalLicense">
                                                            <input {...register("additionalLicense")} type="radio" value="N" id="additionalLicense" />
                                                            &nbsp; No &nbsp;&nbsp;
                                                        </label>
                                                    </div></div>
                                                {/* </div> */}

                                            </FormControl>
                                        </TableCell>
                                        <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea5"
              placeholder="Enter your Remarks"
              autoFocus
            //   onChange={(e) => {
            //     setDeveloperRemarks({ data: e.target.value });
            //     setRemarksEntered(e.target.value);
            //   }}
              rows="3"
            //   value={RemarksDeveloper.data}
            />
                                        </TableCell>


                                    </TableRow>
                                    <TableRow

                                        sx={{
                                            '&:last-child td, &:last-child th':
                                                { border: 0 }
                                        }}
                                    >
                                        <TableCell >
                                            6
                                        </TableCell>
                                        <TableCell align="left">
                                            <h2>
                                                Fee & Charges for LOI generation is in order or not
                                                &nbsp;&nbsp;
                                            </h2>
                                        </TableCell>
                                        <TableCell align="left">
                                        <FormControl>
                                            <div className="row">
                                                {/* <div class="col-md-4 text-right"> */}
                                                <div className="d-flex flex-row align-items-center my-1">
                                                    &nbsp;&nbsp;
                                                    <label htmlFor="loigeneration">
                                                        <input {...register("loigeneration")} type="radio" value="Y" id="loigeneration" />
                                                        &nbsp; Yes &nbsp;&nbsp;
                                                    </label>
                                                    <label htmlFor="loigeneration">
                                                        <input {...register("loigeneration")} type="radio" value="N" id="loigeneration" />
                                                        &nbsp; No &nbsp;&nbsp;
                                                    </label>
                                                </div></div>
                                            {/* </div> */}

                                        </FormControl>
                                        </TableCell>
                                        

                                        <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea6"
              placeholder="Enter your Remarks"
              autoFocus
            //   onChange={(e) => {
            //     setDeveloperRemarks({ data: e.target.value });
            //     setRemarksEntered(e.target.value);
            //   }}
              rows="3"
            //   value={RemarksDeveloper.data}
            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow

                                        sx={{
                                            '&:last-child td, &:last-child th':
                                                { border: 0 }
                                        }}
                                    >
                                        <TableCell >
                                            7
                                        </TableCell>
                                        <TableCell align="left">
                                            <h2>
                                                Outstanding dues in other licenses of the Developer Company and its Board to Directors.
                                                &nbsp;&nbsp;
                                            </h2>
                                        </TableCell>
                                        <TableCell align="left">
                                            <FormControl>
                                                <div className="row">
                                                    {/* <div class="col-md-4 text-right"> */}
                                                    <div className="d-flex flex-row align-items-center my-1">
                                                        &nbsp;&nbsp;
                                                        <label htmlFor="loigeneration">
                                                            <input {...register("outstandingdues")} type="radio" value="Y" id="outstandingdues" />
                                                            &nbsp; Yes &nbsp;&nbsp;
                                                        </label>
                                                        <label htmlFor="outstandingdues">
                                                            <input {...register("outstandingdues")} type="radio" value="N" id="outstandingdues" />
                                                            &nbsp; No &nbsp;&nbsp;
                                                        </label>
                                                    </div></div>
                                                {/* </div> */}

                                            </FormControl>
                                        </TableCell>
                                        <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea7"
              placeholder="Enter your Remarks"
              autoFocus
            //   onChange={(e) => {
            //     setDeveloperRemarks({ data: e.target.value });
            //     setRemarksEntered(e.target.value);
            //   }}
              rows="3"
            //   value={RemarksDeveloper.data}
            />
                                        </TableCell>


                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </Form>

                </div>

            </Card>
            </div>
      </Collapse>
        </form>
    );
}

export default RadioButtonsGroup;
