// import * as React from 'react';
// import Box from '@mui/material/Box';
// import { Card } from '@mui/material';
// import Checkbox from '@mui/material/Checkbox';
// import FormControlLabel from '@mui/material/FormControlLabel';

// export default function IndeterminateCheckbox() {
//   const [checked, setChecked] = React.useState([true, false]);

//   const handleChange1 = (event) => {
//     setChecked([event.target.checked, event.target.checked]);
//   };

//   const handleChange2 = (event) => {
//     setChecked([event.target.checked, checked[1]]);
//   };

//   const handleChange3 = (event) => {
//     setChecked([checked[0], event.target.checked[2]]);
//   };
//   const handleChange4 = (event) => {
//     setChecked([checked[1], event.target.checked[3]]);
//   };
//   const handleChange5 = (event) => {
//     setChecked([checked[2], event.target.checked[4]]);
//   };
//   const handleChange6 = (event) => {
//     setChecked([checked[3], event.target.checked[5]]);
//   };
//   const handleChange7 = (event) => {
//     setChecked([checked[4], event.target.checked]);
//   };
  

//   const children = (
//     <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
//       <FormControlLabel
//         label="Scrutiny fee deposited is in order or not."
//         control={<Checkbox checked={checked[0]} onChange={handleChange2} />}
//       />
//       <FormControlLabel
//         label="25% of the licence fee deposited is in order or not."
//         control={<Checkbox checked={checked[1]} onChange={handleChange3} />}
//       />
//       <FormControlLabel
//         label="Documents submitted regarding the Financial position of the applicant/developer is in order or not."
//         control={<Checkbox checked={checked[2]} onChange={handleChange4} />}
//       />
//       <FormControlLabel
//         label="If the license application is under part migration/ migration, the parent license renewed/requisite renewal fee + applicable interest deposited is in order or not."
//         control={<Checkbox checked={checked[3]} onChange={handleChange5} />}
//       />
//       <FormControlLabel
//         label="25% of the licence fee deposited is in order or not."
//         control={<Checkbox checked={checked[4]} onChange={handleChange6} />}
//       />
//       <FormControlLabel
//         label="25% of the licence fee deposited is in order or not."
//         control={<Checkbox checked={checked[5]} onChange={handleChange7} />}
//       />
//     </Box>
//   );

//   return (
//     <Card>
//     <div>
//       <FormControlLabel
//         label="Parent"
//         control={
//           <Checkbox
//             checked={checked[0] && checked[1] && checked[2] && checked[3] && checked[4] && checked[5]}
//             indeterminate={checked[0] !== checked[1] !== checked[2] !== checked[3] !== checked[4]  !== checked[5]}
//             onChange={handleChange1}
//           />
//         }
//       />
//       {children}
//     </div>
//     </Card>
//   );
// }

// import * as React from 'react';
// import Box from '@mui/material/Box';
// import FormLabel from '@mui/material/FormLabel';
// import FormControl from '@mui/material/FormControl';
// import FormGroup from '@mui/material/FormGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import FormHelperText from '@mui/material/FormHelperText';
// import Checkbox from '@mui/material/Checkbox';

// export default function IndeterminateCheckbox() {
//   const [state, setState] = React.useState({
//     gilad: true,
//     jason: false,
//     antoine: false,
//   });

//   const handleChange = (event) => {
//     setState({
//       ...state,
//       [event.target.name]: event.target.checked,
//     });
//   };

//   const { gilad, jason, antoine } = state;
//   const error = [gilad, jason, antoine].filter((v) => v).length !== 2;

//   return (
//     <Box sx={{ display: 'flex' }}>
//       <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
//         <FormLabel component="legend">Assign responsibility</FormLabel>
//         <FormGroup>
//           <FormControlLabel
//             control={
//               <Checkbox checked={gilad} onChange={handleChange} name="gilad" />
//             }
//             label="Scrutiny fee deposited is in order or not."
//           />
//           <FormControlLabel
//             control={
//               <Checkbox checked={jason} onChange={handleChange} name="jason" />
//             }
//             label="25% of the licence fee deposited is in order or not."
//           />
//           <FormControlLabel
//             control={
//               <Checkbox checked={antoine} onChange={handleChange} name="antoine" />
//             }
//             label="Documents submitted regarding the Financial position of the applicant/developer is in order or not."
//           />
//         </FormGroup>
//         <FormHelperText>Be careful</FormHelperText>
//       </FormControl>
//       {/* <FormControl
//         required
//         error={error}
//         component="fieldset"
//         sx={{ m: 3 }}
//         variant="standard"
//       >
//         <FormLabel component="legend">Pick two</FormLabel>
//         <FormGroup>
//           <FormControlLabel
//             control={
//               <Checkbox checked={gilad} onChange={handleChange} name="gilad" />
//             }
//             label="Gilad Gray"
//           />
//           <FormControlLabel
//             control={
//               <Checkbox checked={jason} onChange={handleChange} name="jason" />
//             }
//             label="Jason Killian"
//           />
//           <FormControlLabel
//             control={
//               <Checkbox checked={antoine} onChange={handleChange} name="antoine" />
//             }
//             label="Antoine Llorca"
//           />
//         </FormGroup>
//         <FormHelperText>You can display an error</FormHelperText>
//       </FormControl> */}
//     </Box>
//   );
// }

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

function IndeterminateCheckbox() {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const { register, handleSubmit } = useForm();
  const IndeterminateCheckbox = (data) => console.log(data);

  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };
  const [open2, setOpen2] = useState(false);

  return (
    <form onSubmit={handleSubmit(IndeterminateCheckbox)}>
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
        PERFORMA FOR SCRUTINY (BY OFFICE JE)
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
      <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "20px", marginBottom: "52px" }}>
        <h4 style={{ fontSize: "20px", marginLeft: "5px" }}>PERFORMA FOR SCRUTINY (BY OFFICE JE)</h4>
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
						
							sx={{ '&:last-child td, &:last-child th':
								{ border: 0 } }}
						>
                            <TableCell >
							1
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            LC-1 Form submitted is in order or not(If Not Details thereof).
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
							<TableCell align="left">
                           
                            <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                          
                          <label htmlFor="submittedIsInOrder ">
                          <input {...register("submittedIsInOrder")} type="radio" value="Y" id="submittedIsInOrder" />
                          &nbsp;&nbsp; &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="submittedIsInOrder">
                          <input {...register("submittedIsInOrder")} type="radio" value="N" id="submittedIsInOrder" />
                          &nbsp;&nbsp; &nbsp; No &nbsp;&nbsp;
                        </label>
                        </div>
                        {/* </div> */}
                </div>
                </FormControl>
                
							</TableCell>
                            <TableCell align="left">
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
                                        </TableCell>
                            
							
						</TableRow>
                        <TableRow
						
							sx={{ '&:last-child td, &:last-child th':
								{ border: 0 } }}
						>
                            <TableCell >
							2
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            Scrutiny fee is in order or not.
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
							<TableCell align="left">
                           
                            <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                         
                          <label htmlFor="scrutinyFeeOrder">
                          <input {...register("scrutinyFeeOrder")} type="radio" value="Y" id="scrutinyFeeOrder" />
                          &nbsp;&nbsp;&nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="scrutinyFeeOrder">
                          <input {...register("scrutinyFeeOrder")} type="radio" value="N" id="scrutinyFeeOrder" />
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
						
							sx={{ '&:last-child td, &:last-child th':
								{ border: 0 } }}
						>
                            <TableCell >
							3
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            25% of the licence fee is deposited is in order or not. 
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
							<TableCell align="left">
                          
                            <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                          &nbsp;&nbsp;
                          <label htmlFor="depositedOrderNot.">
                          <input {...register("depositedOrderNot")} type="radio" value="Y" id="depositedOrderNot" />
                          &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="depositedOrderNot">
                          <input {...register("depositedOrderNot")} type="radio" value="N" id="depositedOrderNot" />
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
						
							sx={{ '&:last-child td, &:last-child th':
								{ border: 0 } }}
						>
                            <TableCell >
							4
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            The Board resolution submitted is in order or not(If Not Details thereof).
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
							<TableCell align="left">
                            <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                          &nbsp;&nbsp;
                          <label htmlFor="compactblock.">
                          <input {...register("compactblock")} type="radio" value="Y" id="compactblock" />
                          &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="compactblock">
                          <input {...register("compactblock")} type="radio" value="N" id="compactblock" />
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
						
							sx={{ '&:last-child td, &:last-child th':
								{ border: 0 } }}
						>
                            <TableCell >
							5
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            Guide Map submitted is in order or no(If Not Details thereof)t
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
							<TableCell align="left">
                            <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                          &nbsp;&nbsp;
                          <label htmlFor="ApproachNormsAsPerPolicy">
                          <input {...register("ApproachNormsAsPerPolicy")} type="radio" value="Y" id="ApproachNormsAsPerPolicy" />
                          &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="ApproachNormsAsPerPolicy">
                          <input {...register("ApproachNormsAsPerPolicy")} type="radio" value="N" id="ApproachNormsAsPerPolicy" />
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
						
							sx={{ '&:last-child td, &:last-child th':
								{ border: 0 } }}
						>
                            <TableCell >
							6
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            Survey Map of the proposed colony submitted is in order or not(If Not Details thereof). 
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
                            <TableCell>
                                <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                          &nbsp;&nbsp;
                          <label htmlFor="SiteDetails">
                          <input {...register("SiteDetails")} type="radio" value="Y" id="SiteDetails" />
                          &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="SiteDetails">
                          <input {...register("SiteDetails")} type="radio" value="N" id="SiteDetails" />
                          &nbsp; No &nbsp;&nbsp;
                        </label>
                        </div></div>
                {/* </div> */}
    
                </FormControl></TableCell>
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
                        sx={{ '&:last-child td, &:last-child th':
                        { border: 0 } }}>
                        <TableCell >
							7
							</TableCell>
                            <TableCell  align="left">
                            <h5>
                            Documents submitted regarding experience/technical capacity  to develop the colony by the applicant/developer is in order or not(If Not Details thereof).
                            </h5>
                            </TableCell>
                            <TableCell align="left">
                            <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                         
                          <label htmlFor=" applicableFinalDevelopment">
                          <input {...register("applicableFinalDevelopment")} type="radio" value="Y" id="applicableFinalDevelopment" />
                          &nbsp; &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="applicableFinalDevelopment">
                          <input {...register("applicableFinalDevelopment")} type="radio" value="N" id="applicableFinalDevelopment" />
                          &nbsp;&nbsp;  No &nbsp;&nbsp;
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
                        
                        <TableRow
						
							sx={{ '&:last-child td, &:last-child th':
								{ border: 0 } }}
						>
                            <TableCell >
							8
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            Explanatory note submitted explaining the salient features of the proposed colony is in order or not(If Not Details thereof).
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
							<TableCell align="left">
                            <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                         
                          <label htmlFor=" applicableFinalDevelopment">
                          <input {...register("applicableFinalDevelopment")} type="radio" value="Y" id="applicableFinalDevelopment" />
                          &nbsp; &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="applicableFinalDevelopment">
                          <input {...register("applicableFinalDevelopment")} type="radio" value="N" id="applicableFinalDevelopment" />
                          &nbsp;&nbsp;  No &nbsp;&nbsp;
                        </label>
                        </div></div>
                {/* </div> */}
    
                </FormControl>
							</TableCell>
                            <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea8"
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
						
							sx={{ '&:last-child td, &:last-child th':
								{ border: 0 } }}
						>
                            <TableCell >
							9
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            Memorandum of Association of the developer company and land-owning companies have a clause regarding real estate development work submitted is in order or not(If Not Details thereof).
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
							<TableCell align="left">
                            <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                         
                          <label htmlFor="zoneAsPerDevelopmentPlan">
                          <input {...register("zoneAsPerDevelopmentPlan")} type="radio" value="Y" id="zoneAsPerDevelopmentPlan" />
                          &nbsp; &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="zoneAsPerDevelopmentPlan">
                          <input {...register("zoneAsPerDevelopmentPlan")} type="radio" value="N" id="zoneAsPerDevelopmentPlan" />
                          &nbsp;&nbsp;  No &nbsp;&nbsp;
                        </label>
                        </div></div>
                {/* </div> */}
    
                </FormControl>
							</TableCell>
                            <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea9"
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
						
							sx={{ '&:last-child td, &:last-child th':
								{ border: 0 } }}
						>
                            <TableCell >
							10
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            Articles of Association of the developer company and land-owning companies have a clause regarding real estate development work submitted is in order or not(If Not Details thereof).
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
							<TableCell align="left">
                            <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                         
                          <label htmlFor="AppliedColony">
                          <input {...register("AppliedColony")} type="radio" value="Y" id="AppliedColony" />
                          &nbsp; &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="AppliedColony">
                          <input {...register("AppliedColony")} type="radio" value="N" id="AppliedColony" />
                          &nbsp;&nbsp;  No &nbsp;&nbsp;
                        </label>
                        </div></div>
                {/* </div> */}
    
                </FormControl>
							</TableCell>
                            <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea10"
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
						
							sx={{ '&:last-child td, &:last-child th':
								{ border: 0 } }}
						>
                            <TableCell >
							11
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            Self-attested/ notarised degree/ certificate of membership of Architect/ Civil engineer signing the application submitted is in order or not(If Not Details thereof).
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
							<TableCell align="left">
                            <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                         
                          <label htmlFor=" totalAreasector">
                          <input {...register("totalAreasector")} type="radio" value="Y" id="totalAreasector" />
                          &nbsp; &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="totalAreasector">
                          <input {...register("totalAreasector")} type="radio" value="N" id="totalAreasector" />
                          &nbsp;&nbsp;  No &nbsp;&nbsp;
                        </label>
                        </div></div>
                {/* </div> */}
    
                </FormControl>
							</TableCell>
                            <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea11"
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
						
							sx={{ '&:last-child td, &:last-child th':
								{ border: 0 } }}
						>
                            <TableCell >
							12
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            The Indemnity bond indemnifies DTCP from any loss if occurs due to any dispute on the applied land submitted is in order or not(If Not Details thereof).
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
							<TableCell align="left">
                            <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                         
                          <label htmlFor="netPlannedArea">
                          <input {...register("netPlannedArea")} type="radio" value="Y" id="netPlannedArea" />
                          &nbsp; &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="netPlannedArea">
                          <input {...register("netPlannedArea")} type="radio" value="N" id="netPlannedArea" />
                          &nbsp;&nbsp;  No &nbsp;&nbsp;
                        </label>
                        </div></div>
                {/* </div> */}
    
                </FormControl>
							</TableCell>
                            <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea12"
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
						
							sx={{ '&:last-child td, &:last-child th':
								{ border: 0 } }}
						>
                            <TableCell >
							13
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            In the case of the colony where there is a cap on NPA, an application is received within the stipulated period of the online window invites applicationsor not(If Not Details thereof). 
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
							<TableCell align="left">
                            <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                         
                          <label htmlFor="areaUnderSectorRoad">
                          <input {...register("areaUnderSectorRoad")} type="radio" value="Y" id="areaUnderSectorRoad" />
                          &nbsp; &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="areaUnderSectorRoad">
                          <input {...register("areaUnderSectorRoad")} type="radio" value="N" id="areaUnderSectorRoad" />
                          &nbsp;&nbsp;  No &nbsp;&nbsp;
                        </label>
                        </div></div>
                {/* </div> */}
    
                </FormControl>
							</TableCell>
                            <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea13"
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
						
							sx={{ '&:last-child td, &:last-child th':
								{ border: 0 } }}
						>
                            <TableCell >
							14
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            In the case of the colony where there is a cap on NPA, the application is received within the prescribed NPA as per the seniority list of the sector(If Not Details thereof).
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
							<TableCell align="left">
                            <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                         
                          <label htmlFor="areaUnderServiceRoad">
                          <input {...register("areaUnderServiceRoad")} type="radio" value="Y" id="areaUnderServiceRoad" />
                          &nbsp; &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="areaUnderServiceRoad">
                          <input {...register("areaUnderServiceRoad")} type="radio" value="N" id="areaUnderServiceRoad" />
                          &nbsp;&nbsp;  No &nbsp;&nbsp;
                        </label>
                        </div></div>
                {/* </div> */}
    
                </FormControl>
							</TableCell>
                            <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea14"
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
						
							sx={{ '&:last-child td, &:last-child th':
								{ border: 0 } }}
						>
                            <TableCell >
							15
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            If the license application is under part migration/ migration, whether the parent license renewed/requisite renewal fee + applicable interest deposited(If Not Details thereof).
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
							<TableCell align="left">
                            <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                         
                          <label htmlFor="areaUnderGreenBelt">
                          <input {...register("areaUnderGreenBelt")} type="radio" value="Y" id="areaUnderGreenBelt" />
                          &nbsp; &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="areaUnderGreenBelt">
                          <input {...register("areaUnderGreenBelt")} type="radio" value="N" id="areaUnderGreenBelt" />
                          &nbsp;&nbsp;  No &nbsp;&nbsp;
                        </label>
                        </div></div>
                {/* </div> */}
    
                </FormControl>
							</TableCell>
                            <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea15"
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
						
							sx={{ '&:last-child td, &:last-child th':
								{ border: 0 } }}
						>
                            <TableCell >
							16
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            Area norms getting fulfilled as per applicable policy or not(If Not Details thereof).
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
							<TableCell align="left">
                            <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                         
                          <label htmlFor="internalCirculationRoad">
                          <input {...register("internalCirculationRoad")} type="radio" value="Y" id="internalCirculationRoad" />
                          &nbsp; &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="internalCirculationRoad">
                          <input {...register("internalCirculationRoad")} type="radio" value="N" id="internalCirculationRoad" />
                          &nbsp;&nbsp;  No &nbsp;&nbsp;
                        </label>
                        </div></div>
                {/* </div> */}
    
                </FormControl>
							</TableCell>
                            <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea16"
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
						
							sx={{ '&:last-child td, &:last-child th':
								{ border: 0 } }}
						>
                            <TableCell >
							17
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            Approach Norms as per policy(Yes/No), Details thereof
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
							<TableCell align="left">
                            <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                         
                          <label htmlFor="anyOther">
                          <input {...register("anyOther")} type="radio" value="Y" id="anyOther" />
                          &nbsp; &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="anyOther">
                          <input {...register("anyOther")} type="radio" value="N" id="anyOther" />
                          &nbsp;&nbsp;  No &nbsp;&nbsp;
                        </label>
                        </div></div>
                {/* </div> */}
    
                </FormControl>
							</TableCell>
                            <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea17"
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
						
							sx={{ '&:last-child td, &:last-child th':
								{ border: 0 } }}
						>
                            <TableCell >
							17A
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            Access permission from competent authority required or not(if required details thereof).
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
							<TableCell align="left">
                            <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                         
                          <label htmlFor="receivedWithinThePrescribed">
                          <input {...register("receivedWithinThePrescribed")} type="radio" value="Y" id="receivedWithinThePrescribed" />
                          &nbsp; &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="receivedWithinThePrescribed">
                          <input {...register("receivedWithinThePrescribed")} type="radio" value="N" id="receivedWithinThePrescribed" />
                          &nbsp;&nbsp;  No &nbsp;&nbsp;
                        </label>
                        </div></div>
                {/* </div> */}
    
                </FormControl>
							</TableCell>
                            <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea17a"
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
						
							sx={{ '&:last-child td, &:last-child th':
								{ border: 0 } }}
						>
                            <TableCell >
							18
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            Site Details(Vacant, HT Line, Gas pipe line, Nallah/ drain), Details thereof.
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
							<TableCell align="left">
                            <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                         
                          <label htmlFor="receivedWithinThePrescribed">
                          <input {...register("receivedWithinThePrescribed")} type="radio" value="Y" id="receivedWithinThePrescribed" />
                          &nbsp; &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="receivedWithinThePrescribed">
                          <input {...register("receivedWithinThePrescribed")} type="radio" value="N" id="receivedWithinThePrescribed" />
                          &nbsp;&nbsp;  No &nbsp;&nbsp;
                        </label>
                        </div></div>
                {/* </div> */}
    
                </FormControl>
							</TableCell>
                            <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea18"
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
						
							sx={{ '&:last-child td, &:last-child th':
								{ border: 0 } }}
						>
                            <TableCell >
							19
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            Conformity to Development Plan and Sectoral Plan(Yes/No).
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
							<TableCell align="left">
                            <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                         
                          <label htmlFor="receivedWithinThePrescribed">
                          <input {...register("receivedWithinThePrescribed")} type="radio" value="Y" id="receivedWithinThePrescribed" />
                          &nbsp; &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="receivedWithinThePrescribed">
                          <input {...register("receivedWithinThePrescribed")} type="radio" value="N" id="receivedWithinThePrescribed" />
                          &nbsp;&nbsp;  No &nbsp;&nbsp;
                        </label>
                        </div></div>
                {/* </div> */}
    
                </FormControl>
							</TableCell>
                            <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea19"
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
						
							sx={{ '&:last-child td, &:last-child th':
								{ border: 0 } }}
						>
                            <TableCell >
							20
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            Conformity to the net planned area of sector (Yes/No):
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
							<TableCell align="left">
                            <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                         
                          <label htmlFor="receivedWithinThePrescribed">
                          <input {...register("receivedWithinThePrescribed")} type="radio" value="Y" id="receivedWithinThePrescribed" />
                          &nbsp; &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="receivedWithinThePrescribed">
                          <input {...register("receivedWithinThePrescribed")} type="radio" value="N" id="receivedWithinThePrescribed" />
                          &nbsp;&nbsp;  No &nbsp;&nbsp;
                        </label>
                        </div></div>
                {/* </div> */}
    
                </FormControl>
							</TableCell>
                            <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea20"
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
						
							sx={{ '&:last-child td, &:last-child th':
								{ border: 0 } }}
						>
                            <TableCell >
							21
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            Conformity to the applied site vis-a-vis Natural Conservation Zone.
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
							<TableCell align="left">
                            <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                         
                          <label htmlFor="receivedWithinThePrescribed">
                          <input {...register("receivedWithinThePrescribed")} type="radio" value="Y" id="receivedWithinThePrescribed" />
                          &nbsp; &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="receivedWithinThePrescribed">
                          <input {...register("receivedWithinThePrescribed")} type="radio" value="N" id="receivedWithinThePrescribed" />
                          &nbsp;&nbsp;  No &nbsp;&nbsp;
                        </label>
                        </div></div>
                {/* </div> */}
    
                </FormControl>
							</TableCell>
                            <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea21"
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
						
							sx={{ '&:last-child td, &:last-child th':
								{ border: 0 } }}
						>
                            <TableCell >
							22
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            Conformity to the applied site vis-à-vis the PLPA Act-Yes/No.
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
							<TableCell align="left">
                            <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                         
                          <label htmlFor="receivedWithinThePrescribed">
                          <input {...register("receivedWithinThePrescribed")} type="radio" value="Y" id="receivedWithinThePrescribed" />
                          &nbsp; &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="receivedWithinThePrescribed">
                          <input {...register("receivedWithinThePrescribed")} type="radio" value="N" id="receivedWithinThePrescribed" />
                          &nbsp;&nbsp;  No &nbsp;&nbsp;
                        </label>
                        </div></div>
                {/* </div> */}
    
                </FormControl>
							</TableCell>
                            <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea22"
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
						
                        sx={{ '&:last-child td, &:last-child th':
                            { border: 0 } }}
                    >
                        <TableCell >
                        23
                        </TableCell>
                        <TableCell  align="left">
                        <h2>
                        Fee & Charges for LOI generation is in order or not(if not details thereof).
                &nbsp;&nbsp;
              </h2>
                        </TableCell>
                        <TableCell align="left">
                        <FormControl>
                        <div className="row">  
                        {/* <div class="col-md-4 text-right"> */}
                    <div className="d-flex flex-row align-items-center my-1">
                     
                      <label htmlFor="receivedWithinThePrescribed">
                      <input {...register("receivedWithinThePrescribed")} type="radio" value="Y" id="receivedWithinThePrescribed" />
                      &nbsp; &nbsp; Yes &nbsp;&nbsp;
                    </label>
                    <label htmlFor="receivedWithinThePrescribed">
                      <input {...register("receivedWithinThePrescribed")} type="radio" value="N" id="receivedWithinThePrescribed" />
                      &nbsp;&nbsp;  No &nbsp;&nbsp;
                    </label>
                    </div></div>
            {/* </div> */}

            </FormControl>
                        </TableCell>
                        <TableCell align="left">
                                    <textarea
          class="form-control"
          id="exampleFormControlTextarea23"
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

export default IndeterminateCheckbox;
