// import * as React from 'react';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import Radio from '@mui/material/Radio';
// import RadioGroup from '@mui/material/RadioGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import FormControl from '@mui/material/FormControl';
// import FormLabel from '@mui/material/FormLabel';





// function createData(sno,name, color, capacity, fuel, price) {
// 	return { sno,name, color, capacity, fuel, price };
// }

// const rows = [
// 	createData(1, 'Scrutiny fee deposited is in order or not.', ),
// 	createData(2, '25% of the licence fee deposited is in order or not.',),
// 	createData(3, 'Documents submitted regarding the Financial position of the applicant/developer is in order or not.', ),
// 	createData(4, 'If the license application is under part migration/ migration, the parent license renewed/requisite renewal fee + applicable interest deposited is in order or not.', ),
// 	createData(5, 'If Case for Additional License, Outstanding Dues of parent license.', ),
// 	createData(6, 'Fee & Charges for LOI generation is in order or not', ),
// 	createData(7, 'Outstanding dues in other licenses of the Developer Company and its Board to Directors.', ),
// ];

// export default function SimpleTable() {
// 	return (
// 		<TableContainer component={Paper}>
// 			<Table sx={{ minWidth: 650 }} aria-label="simple table">
// 				<TableHead>
// 					<TableRow>
// 						<TableCell>
// 							Sr.No
// 						</TableCell>
// 						<TableCell align="center">
//                         Description
// 						</TableCell>
// 						<TableCell align="right">
// 						Action
// 						</TableCell>
// 						{/* <TableCell align="right">
// 							Remarks
// 						</TableCell> */}
// 						{/* <TableCell align="right">
// 							PRICE(Rs)
// 						</TableCell> */}
// 					</TableRow>
// 				</TableHead>
// 				<TableBody>
// 					{rows.map((row) => (
// 						<TableRow
// 							key={row.name}
// 							sx={{ '&:last-child td, &:last-child th':
// 								{ border: 0 } }}
// 						>
//                             <TableCell component="th" scope="row">
// 								{row.sno}
// 							</TableCell>
// 							<TableCell component="th" scope="row">
// 								{row.name}
// 							</TableCell>
// 							<TableCell align="center">
//                             <FormControl>
//       {/* <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel> */}
//       <RadioGroup
//         row
//         aria-labelledby="demo-row-radio-buttons-group-label"
//         name="row-radio-buttons-group"
//       >
//         <FormControlLabel value="Y" control={<Radio />} label="Yes" />
//         <FormControlLabel value="N" control={<Radio />} label="No" />
//         {/* <FormControlLabel value="other" control={<Radio />} label="Other" /> */}
//         {/* <FormControlLabel
//           value="disabled"
//           disabled
//           control={<Radio />}
//           label="other"
//         /> */}
//       </RadioGroup>
//     </FormControl>
// 							</TableCell>
                            
// 							<TableCell align="center">
                       
// 							</TableCell>
// 							{/* <TableCell align="right">
// 								{row.fuel}
// 							</TableCell>
// 							<TableCell align="right">
// 								{row.price}
// 							</TableCell> */}
// 						</TableRow>
// 					))}
// 				</TableBody>
// 			</Table>
// 		</TableContainer>
// 	);
// }




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

function ProformaForlegalBranch() {
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
    <form onSubmit={handleSubmit(ProformaForlegalBranch)}>
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
        PERFORMA FOR SCRUTINY (BY LEGAL CELL)
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
      <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "20px", marginBottom: "52px" }}>
        <h4 style={{ fontSize: "20px", marginLeft: "5px" }}>PERFORMA FOR SCRUTINY (BY LEGAL CELL)</h4>
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
						Reamrks
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
                            Registered and irrevocable collaboration agreement/joint development agreement/Memorandum of understanding by and between land owners/ land-owning company and collaborator company of all the land mentioned in the schedule of land submitted is in order or not 
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
                            GPA/SPA in favour of the developer/ applicant submitted is in order or not.
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
						
							sx={{ '&:last-child td, &:last-child th':
								{ border: 0 } }}
						>
                            <TableCell >
							3
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            LLP agreement submitted, in case of firm is in order or not. 
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
							<TableCell align="left">
                          
                            <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                          
                          <label htmlFor="applicantdeveloper">
                          <input {...register("applicantdeveloper")} type="radio" value="Y" id="applicantdeveloper" />
                          &nbsp;&nbsp;&nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="applicantdeveloper">
                          <input {...register("applicantdeveloper")} type="radio" value="N" id="applicantdeveloper" />
                          &nbsp;&nbsp;&nbsp; No &nbsp;&nbsp;
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

export default ProformaForlegalBranch;
