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

function DrawingBranch() {
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
        PERFORMA FOR SCRUTINY (BY OFFICE DRAWING)
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
      <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "20px", marginBottom: "52px" }}>
        <h4 style={{ fontSize: "20px", marginLeft: "5px" }}>PERFORMA FOR SCRUTINY (BY OFFICE DRAWING)</h4>
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
                            The Layout plan of the colony (in the case of the plotted colony) submitted showing the existing and proposed means of access to the colon	y, the width of streets, sizes and types of plots, sites reserved for open spaces, community buildings, schools etc. with the area under each is in order or not 
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
							<TableCell align="left">
                           
                            <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                          
                          <label htmlFor="communitybuildings">
                          <input {...register("communitybuildings")} type="radio" value="Y" id="communitybuildings" />
                          &nbsp;&nbsp; &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="communitybuildings">
                          <input {...register("communitybuildings")} type="radio" value="N" id="communitybuildings" />
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
                            If the license application is under part migration, the layout plan of the balance of the land of parent license is submitted is in order or not.
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
							<TableCell align="left">
                           
                            <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                         
                          <label htmlFor="licenseapplication">
                          <input {...register("licenseapplication")} type="radio" value="Y" id="licenseapplication" />
                          &nbsp;&nbsp;&nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="licenseapplication">
                          <input {...register("licenseapplication")} type="radio" value="N" id="licenseapplication" />
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
                            The site situation is as per the submitted aks-shajra map. 
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
							<TableCell align="left">
                          
                            <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                          &nbsp;&nbsp;
                          <label htmlFor="sitesituation">
                          <input {...register("sitesituation")} type="radio" value="Y" id="sitesituation" />
                          &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="sitesituation">
                          <input {...register("sitesituation")} type="radio" value="N" id="sitesituation" />
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
                            Whether in a compact block. 
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
                            Approach Norms as per policy.(Details thereof remarks in case of yes and no)
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
                            Site Details(Vacant, HT Line, Gas pipe line, Nallah/ drain),(Details thereof remarks in case of yes and no) 
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
                            <TableCell align="left">
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
                        <TableRow>
                        <TableCell >
							7
							</TableCell>
                            <TableCell  align="left">
                            <h5>
                                <b>Conformity to Development Plan and Sectoral Plan: -</b>
                            </h5>
                            </TableCell>
                        </TableRow>
                        
                        <TableRow
						
							sx={{ '&:last-child td, &:last-child th':
								{ border: 0 } }}
						>
                            <TableCell >
							a
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            Applicable Final Development Plan- 
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
              id="exampleFormControlTextarea7a"
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
							b
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            Zone as per Development Plan – Residential/Commercial/Industrial, Institutional/Agricultural etc.
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
              id="exampleFormControlTextarea7b"
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
							c
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            Applied colony in confirming use -.
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
              id="exampleFormControlTextarea7c"
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
							d
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            Total Area of the sector in acres–
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
              id="exampleFormControlTextarea7d"
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
							e
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            Net Planned Area of Sector in acres –
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
              id="exampleFormControlTextarea7e"
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
							g
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            i. Area under Sector road - 
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
              id="exampleFormControlTextarea7gi"
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
							
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            ii. Area under Service road -
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
              id="exampleFormControlTextarea7gii"
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
							
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            iii. Area under Green belt -
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
              id="exampleFormControlTextarea7giii"
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
							
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            iv. Internal Circulation road -
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
              id="exampleFormControlTextarea7giv"
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
							
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            vi. Any other -
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
              id="exampleFormControlTextarea7vi"
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
                            In the case of the colony where there is a cap on NPA, the application is received within the prescribed NPA as per the seniority list of the sector. (Details thereof remarks in case of yes and no)
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

export default DrawingBranch;
