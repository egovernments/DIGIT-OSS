import React, { useState,useContext  } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useForm } from "react-hook-form";
import { Card } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useParams } from "react-router-dom";
import axios from "axios";

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
import { useTranslation } from "react-i18next";
import { ScrutinyRemarksContext } from "../../../../context/remarks-data-context";


function ProformaPatwari(props) {
  const {handleRoles, handleGetFiledsStatesById, handleGetRemarkssValues , bussinessService} = useContext(ScrutinyRemarksContext,);
  const apiData = props.apiResponseData;
  const applicationStatu =props.applicationStatus;
  
  const businessService = apiData?.businessService;
  const {t} = useTranslation();
 
  // console.log("login12334" , apiData ,applicationStatu , businessService)

  const userRoles = Digit.UserService.getUser()?.info?.roles.map((item) => item.code)  || [];
  const showActionButton = userRoles.includes("Patwari")


  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const { register, handleSubmit , watch } = useForm();
  const layoutPlan = (data) => console.log(data);

  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };
  const [open2, setOpen2] = useState(false);
  const dateTime = new Date();
  const authToken = Digit.UserService.getUser()?.access_token || null;
  const userInfo = Digit.UserService.getUser()?.info || {};
  const userRolesArray = userInfo?.roles.filter((user) => user.code !=="EMPLOYEE" );
  const filterDataRole = userRolesArray?.[0]?.code;
  const designation = userRolesArray?.[0]?.name;
  const { id } = useParams();


  const handlemodalsubmit = async (fieldIdL , comment , functional) => {
    if (applicationStatu) {
 const postData = {
        requestInfo: {
          api_id: "1",
          ver: "1",
          ts: null,
          action: "create",
          did: "",
          key: "",
          msg_id: "",
          requester_id: "",
          authToken: authToken,
        },
        egScrutiny: {
          applicationId: id,
          comment:comment,
          fieldValue: functional,
          fieldIdL: fieldIdL,
          isApproved: "Proform",
          isLOIPart: "", 
          userid: userInfo?.id || null,
          serviceId: "123",
          documentId: null,
          ts: dateTime.toUTCString(),
          bussinessServiceName : businessService,
          designation : designation,
          name : userInfo?.name || null,
          employeeName : userInfo?.name || null,
         role : filterDataRole,
         applicationStatus : applicationStatu
        },
      };

      try {
        const Resp = await axios.post("/land-services/egscrutiny/_create?status=submit", postData, {}).then((response) => {
          return response.data;
        });
      } catch (error) {
        console.log(error);
      }
      // handleGetFiledsStatesById(id);
      // handleGetRemarkssValues(id);
      handleRoles(id)
      // console.log("response from API", Resp);
      // props?.remarksUpdate({ data: RemarksDeveloper.data });
    } else {
      // props?.passmodalData();
    }
  };






  return (
    <form onSubmit={handleSubmit(ProformaPatwari)}>
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
        PROFORMA FOR SCRUTINY (BY OFFICE PATWARI)
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
      <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "20px", marginBottom: "52px" }}>
        <h4 style={{ fontSize: "20px", marginLeft: "5px" }}>PROFORMA FOR SCRUTINY (BY OFFICE PATWARI)</h4>
        <div className="card">
          <Form> 
            <TableContainer >
			<Table aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell style={{ width: 20 }}>
							Sr.No
						</TableCell>
						<TableCell align="center" style={{ width: 350 , marginRight:5 }}>
                        Description
						</TableCell>
						<TableCell align="center" style={{ width: 200 }}>
						Conditional
						</TableCell>
						<TableCell align="center" style={{ width: 450 }}>
						Remarks
						</TableCell>
						<TableCell align="center" style={{ width: 60 }}>
						Action
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
							<TableCell  align="left"  >
                            <h2 style={{fontSize:16}}>
                            {/* Scrutiny fee deposited is in order or not.  */}
                            {`${t("NWL_PROFORMA_TOTAL_PATWARI_SCRTINY_FEE_DEPOSITED")}`}
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
							<TableCell align="left">
                           
                            <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                          
                          <label htmlFor="approachFromProposedSector">
                          <input {...register("approachFromProposedSector")} type="radio"  disabled={!showActionButton} value="Y" id="approachFromProposedSector" />
                          &nbsp;&nbsp; &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="approachFromProposedSector">
                          <input {...register("approachFromProposedSector")} type="radio"  disabled={!showActionButton} value="N" id="approachFromProposedSector" />
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
          // onChange={(e) => {
          //   setDeveloperRemarks({ data: e.target.value });
          //   setRemarksEntered(e.target.value);
          // }}
          {...register("approachFromProposedSectorRmarkes")}
        disabled={!showActionButton}
          rows="3"
          // value={RemarksDeveloper.data}
        />
                                    </TableCell>
                                    <TableCell align="left">
                 
                                    <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
                                      { (watch("approachFromProposedSectorRmarkes") || watch("approachFromProposedSector")) &&

                                        <Button style={{ textAlign: "right" }} 
                                        onClick ={() => handlemodalsubmit("NWL_PROFORMA_TOTAL_PATWARI_SCRTINY_FEE_DEPOSITED", watch("approachFromProposedSectorRmarkes"), watch("approachFromProposedSector") )}
                                        >
                                          Submit
                                        </Button>
                                        }
        
        </div>
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
                            <h2 style={{fontSize:16}}>
                            {/* Title of Land is clear or not */}
                            {`${t("NWL_PROFORMA_TITLE_OF_LAND_ISCLEAR_PATWARI_SCRTINY")}`}
                            
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
							<TableCell align="left">
                           
                            <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                         
                          <label htmlFor="licencefeedeposited">
                          <input {...register("licencefeedeposited")} type="radio" value="Y"   disabled={!showActionButton} id="licencefeedeposited" />
                          &nbsp;&nbsp;&nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="licencefeedeposited">
                          <input {...register("licencefeedeposited")} type="radio" value="N"   disabled={!showActionButton} id="licencefeedeposited" />
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
          disabled={!showActionButton}
          {...register("licencefeedepositedRemarks")}
        //   onChange={(e) => {
        //     setDeveloperRemarks({ data: e.target.value });
        //     setRemarksEntered(e.target.value);
        //   }}
          rows="3"
        //   value={RemarksDeveloper.data}
        />
                                    </TableCell>
                            
                                    <TableCell align="left">
                 
                                    <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
                                      { (watch("licencefeedepositedRemarks") || watch("licencefeedeposited")) &&

                                        <Button style={{ textAlign: "right" }} 
                                        onClick ={() => handlemodalsubmit("NWL_PROFORMA_TITLE_OF_LAND_ISCLEAR_PATWARI_SCRTINY", watch("licencefeedepositedRemarks"), watch("licencefeedeposited") )}
                                        >
                                          Submit
                                        </Button>
                                        }
        
        </div>
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
                            <h2 style={{fontSize:16}}>
                            {`${t("NWL_PROFORMA_REVENUE_DOCUMENTS_JAMABANDI_MUTATION_PATWARI_SCRTINY")}`}
                            {/* Revenue Documents (Jamabandhi, Mutation/Sale deeds) is in order or not  */}
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
                          <input {...register("applicantdeveloper")} type="radio"  disabled={!showActionButton} value="Y" id="applicantdeveloper" />
                          &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="applicantdeveloper">
                          <input {...register("applicantdeveloper")} type="radio"   disabled={!showActionButton} value="N" id="applicantdeveloper" />
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
          {...register("applicantdeveloperRmarkes")}
        //   onChange={(e) => {
        //     setDeveloperRemarks({ data: e.target.value });
        //     setRemarksEntered(e.target.value);
        //   }}
          rows="3"
        //   value={RemarksDeveloper.data}
        />
                                    </TableCell>
                                    <TableCell align="left">
                                    <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
                                      { (watch("applicantdeveloperRmarkes") || watch("applicantdeveloper")) &&

                                    <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
          <Button style={{ textAlign: "right" }} 
          onClick ={() => handlemodalsubmit("NWL_PROFORMA_REVENUE_DOCUMENTS_JAMABANDI_MUTATION_PATWARI_SCRTINY", watch("applicantdeveloperRmarkes"), watch("applicantdeveloper") )}
          >
            Submit
          </Button>
        </div>
}
</div>
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
                            {/* The Original Shajra Plan is in order or not */}
                            {`${t("NWL_PROFORMA_THE_ORIGINAL_SHAJRA_PLAN_ISORDER_PATWARI_SCRTINY")}`}
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
                          <input {...register("renewedreuisite")} type="radio"  disabled={!showActionButton} value="Y" id="renewedreuisite" />
                          &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="renewedreuisite">
                          <input {...register("renewedreuisite")} type="radio"  disabled={!showActionButton} value="N" id="renewedreuisite" />
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
          {...register("renewedreuisiteRemarks")}
        //   onChange={(e) => {
        //     setDeveloperRemarks({ data: e.target.value });
        //     setRemarksEntered(e.target.value);
        //   }}
          rows="3"
        //   value={RemarksDeveloper.data}
        />
                                    </TableCell>
                                    <TableCell align="left">
                                    <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
                                      { (watch("renewedreuisiteRemarks") || watch("renewedreuisite")) &&

                                    <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
          <Button style={{ textAlign: "right" }} 
          onClick ={() => handlemodalsubmit("NWL_PROFORMA_THE_ORIGINAL_SHAJRA_PLAN_ISORDER_PATWARI_SCRTINY", watch("renewedreuisiteRemarks"), watch("renewedreuisite") )}
          >
            Submit
          </Button>
        </div>
}
</div>
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
                            {/* Applied Khasra nos. correctly / accurately incorporated in the collaboration agreement. */}
                            {`${t("NWL_PROFORMA_APPLIED_KHASRA_NOS_CORRECTLY_ACCURATELY_PATWARI_SCRTINY")}`}
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
                          <input {...register("additionalLicense")} type="radio"  disabled={!showActionButton} value="Y" id="additionalLicense" />
                          &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="additionalLicense">
                          <input {...register("additionalLicense")} type="radio"   disabled={!showActionButton}value="N" id="additionalLicense" />
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
          {...register("additionalLicenseRemarks")}
        //   onChange={(e) => {
        //     setDeveloperRemarks({ data: e.target.value });
        //     setRemarksEntered(e.target.value);
        //   }}
          rows="3"
        //   value={RemarksDeveloper.data}
        />
                                    </TableCell>
                                    <TableCell align="left">
                                    <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
                                      { (watch("additionalLicenseRemarks") || watch("additionalLicense")) &&

                                    <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
          <Button style={{ textAlign: "right" }} 
          onClick ={() => handlemodalsubmit("NWL_PROFORMA_APPLIED_KHASRA_NOS_CORRECTLY_ACCURATELY_PATWARI_SCRTINY", watch("additionalLicenseRemarks"), watch("additionalLicense") )}
          >
            Submit
          </Button>
        </div>
}
</div>
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
                            {/* Applied Khasra nos. correctly / accurately incorporated in GPA/SPA. */}
                            {`${t("NWL_PROFORMA_APPLIED_KHASRA_NOS_CORRECTLY_ACCURATELY_GPASPA_PATWARI_SCRTINY")}`}
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
                            <TableCell>
                            <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                          &nbsp;&nbsp;
                          <label htmlFor="loigeneration">
                          <input {...register("loigeneration")} type="radio"  disabled={!showActionButton} value="Y" id="loigeneration" />
                          &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="loigeneration">
                          <input {...register("loigeneration")} type="radio" value="N"  disabled={!showActionButton} id="loigeneration" />
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
          {...register("loigenerationRemarks")}
        //   onChange={(e) => {
        //     setDeveloperRemarks({ data: e.target.value });
        //     setRemarksEntered(e.target.value);
        //   }}
          rows="3"
        //   value={RemarksDeveloper.data}
        />
                                    </TableCell>
                                    <TableCell align="left">
                                    <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
                                      { (watch("loigenerationRemarks") || watch("loigeneration")) &&

                                    <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
          <Button style={{ textAlign: "right" }} 
          onClick ={() => handlemodalsubmit("NWL_PROFORMA_APPLIED_KHASRA_NOS_CORRECTLY_ACCURATELY_GPASPA_PATWARI_SCRTINY", watch("loigenerationRemarks"), watch("loigeneration") )}
          >
            Submit
          </Button>
        </div>
}
</div>
                                    </TableCell>
							
						</TableRow>
                        <TableRow
						
							sx={{ '&:last-child td, &:last-child th':
								{ border: 0 } }}
						>
                            <TableCell >
							7
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            {/* Non-encumbrance certificate of the applied land issued from the competent authority is in order or not. */}
                            {`${t("NWL_PROFORMA_NON_ENCUMBRANCE_NOS_CERTIFICATE_APPLIED_LAND_PATWARI_SCRTINY")}`}
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
                          <input {...register("outstandingdues")} type="radio" value="Y"  disabled={!showActionButton} id="outstandingdues" />
                          &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="outstandingdues">
                          <input {...register("outstandingdues")} type="radio" value="N"  disabled={!showActionButton} id="outstandingdues" />
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
          {...register("outstandingduesRemarks")}
        //   onChange={(e) => {
        //     setDeveloperRemarks({ data: e.target.value });
        //     setRemarksEntered(e.target.value);
        //   }}
          rows="3"
        //   value={RemarksDeveloper.data}
        />
                                    </TableCell>
                            
                                    <TableCell align="left">
                                    <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
                                      { (watch("outstandingduesRemarks") || watch("outstandingdues")) &&

                                    <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
          <Button style={{ textAlign: "right" }} 
          onClick ={() => handlemodalsubmit("NWL_PROFORMA_NON_ENCUMBRANCE_NOS_CERTIFICATE_APPLIED_LAND_PATWARI_SCRTINY", watch("outstandingduesRemarks"), watch("outstandingdues") )}
          >
            Submit
          </Button>
        </div>
}
</div>
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
                            {/* If the license application is under part migration, the land schedule of balance land of parent license is submitted is in order or not. */}
                            {`${t("NWL_PROFORMA_LICENSE_APPLICATION_IS_UNDER_PART_MIGRATION_SCHEDULE_PATWARI_SCRTINY")}`}
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
							<TableCell align="left">
                            <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                          &nbsp;&nbsp;
                          <label htmlFor="licenseapplication">
                          <input {...register("licenseApplication")} type="radio" value="Y"  disabled={!showActionButton} id="licenseapplication" />
                          &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="licenseapplication">
                          <input {...register("licenseApplication")} type="radio" value="N"  disabled={!showActionButton} id="licenseapplication" />
                          &nbsp; No &nbsp;&nbsp;
                        </label>
                        </div></div>
                {/* </div> */}
    
                </FormControl>
							</TableCell><TableCell align="left">
                                    <textarea
          class="form-control"
          id="exampleFormControlTextarea8"
          placeholder="Enter your Remarks"
          autoFocus
          {...register("llicenseApplicationRemarks")}
        //   onChange={(e) => {
        //     setDeveloperRemarks({ data: e.target.value });
        //     setRemarksEntered(e.target.value);
        //   }}
          rows="3"
        //   value={RemarksDeveloper.data}
        />
                                    </TableCell>
                                    <TableCell align="left">
                                    <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
                                      { (watch("licencefeedepositedRemarks") || watch("licencefeedeposited")) &&

                                    <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
          <Button style={{ textAlign: "right" }} 
          onClick ={() => handlemodalsubmit("NWL_PROFORMA_LICENSE_APPLICATION_IS_UNDER_PART_MIGRATION_SCHEDULE_PATWARI_SCRTINY", watch("licencefeedepositedRemarks"), watch("licencefeedeposited") )}
          >
            Submit
          </Button>
        </div>
    }
    </div>
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
                            {/* Land Acquisition status (Yes/No), If Yes Details thereof */}
                             {`${t("NWL_PROFORMA_LAND_ACQUISITION_STATUS_IF_YSE_DETAILS_THEREOF_PATWARI_SCRTINY")}`}
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
							<TableCell align="left">
                            <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                          &nbsp;&nbsp;
                          <label htmlFor="landAcquisition">
                          <input {...register("landAcquisition")} type="radio" value="Y"  disabled={!showActionButton} id="landAcquisition" />
                          &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="landAcquisition">
                          <input {...register("landAcquisition")} type="radio" value="N"  disabled={!showActionButton} id="landAcquisition" />
                          &nbsp; No &nbsp;&nbsp;
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
          {...register("landAcquisitionRemarks")}
        //   onChange={(e) => {
        //     setDeveloperRemarks({ data: e.target.value });
        //     setRemarksEntered(e.target.value);
        //   }}
          rows="3"
        //   value={RemarksDeveloper.data}
        />
                                    </TableCell>
                            
                                    <TableCell align="left">
                                    <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
                                      { (watch("landAcquisitionRemarks") || watch("landAcquisition")) &&

                                    <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
          <Button style={{ textAlign: "right" }} 
          onClick ={() => handlemodalsubmit("NWL_PROFORMA_LAND_ACQUISITION_STATUS_IF_YSE_DETAILS_THEREOF_PATWARI_SCRTINY", watch("landAcquisitionRemarks"), watch("landAcquisition") )}
          >
            Submit
          </Button>
        </div>
}
</div>
                                    </TableCell>
						</TableRow>
                        <TableRow>
                            <TableCell>
                                10
                            </TableCell>
                            <TableCell>
                                <h5><b>
                                  {/* Detail of Approach  */}
                                {`${t("NWL_PROFORMA_DETAIL_OF_APPROACH_PATWARI_SCRTINY")}`}</b></h5>
                            </TableCell>
                        </TableRow>
                        <TableRow
						
							sx={{ '&:last-child td, &:last-child th':
								{ border: 0 } }}
						>
                            <TableCell >
							I
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            {`${t("NWL_PROFORMA_EXISTING_APPROACH_AS_PER_REVENUE_RECORD_PATWARI_SCRTINY")}`}
                            {/* Existing approach as per revenue record */}
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
							<TableCell align="left">
                            <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                          &nbsp;&nbsp;
                          <label htmlFor="existingapproach">
                          <input {...register("existingApproach")} type="radio" value="Y"  disabled={!showActionButton} id="existingapproach" />
                          &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="existingapproach">
                          <input {...register("existingApproach")} type="radio" value="N"  disabled={!showActionButton} id="existingapproach" />
                          &nbsp; No &nbsp;&nbsp;
                        </label>
                        </div></div>
                {/* </div> */}
    
                </FormControl>
							</TableCell>
                            <TableCell align="left">
                                    <textarea
          class="form-control"
          id="exampleFormControlTextarea10i"
          placeholder="Enter your Remarks"
          autoFocus
          {...register("existingApproachRemarks")}
        //   onChange={(e) => {
        //     setDeveloperRemarks({ data: e.target.value });
        //     setRemarksEntered(e.target.value);
        //   }}
          rows="3"
        //   value={RemarksDeveloper.data}
        />
                                    </TableCell>
                                    <TableCell align="left">
                                    <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
                                      { (watch("existingApproachRemarks") || watch("existingApproach")) &&

                                    <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
          <Button style={{ textAlign: "right" }} 
          onClick ={() => handlemodalsubmit("NWL_PROFORMA_EXISTING_APPROACH_AS_PER_REVENUE_RECORD_PATWARI_SCRTINY", watch("existingApproachRemarks"), watch("existingApproach") )}
          >
            Submit
          </Button>
        </div>
}
</div>
                                    </TableCell>
							
						</TableRow>
                        <TableRow
						
							sx={{ '&:last-child td, &:last-child th':
								{ border: 0 } }}
						>
                            <TableCell >
							II
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            {/* Existing/proposed road as per approved sectoral plan or as per field report. */}
                            {`${t("NWL_PROFORMA_EXISTING_PROPOSED_ROAD_PER_APPROVED_SECTORAL_PATWARI_SCRTINY")}`}
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
							<TableCell align="left">
                            <FormControl>
                            <div className="row">  
                            {/* <div class="col-md-4 text-right"> */}
                        <div className="d-flex flex-row align-items-center my-1">
                          &nbsp;&nbsp;
                          <label htmlFor="existingProposed">
                          <input {...register("existingProposed")} type="radio" value="Y"  disabled={!showActionButton} id="existing/proposed" />
                          &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="existingProposed">
                          <input {...register("existingProposed")} type="radio" value="N"  disabled={!showActionButton} id="existing/proposed" />
                          &nbsp; No &nbsp;&nbsp;
                        </label>
                        </div></div>
                {/* </div> */}
    
                </FormControl>
							</TableCell>
                            <TableCell align="left">
                                    <textarea
          class="form-control"
          id="exampleFormControlTextarea10ii"
          placeholder="Enter your Remarks"
          autoFocus
          {...register("existingProposedRemarks")}
        //   onChange={(e) => {
        //     setDeveloperRemarks({ data: e.target.value });
        //     setRemarksEntered(e.target.value);
        //   }}
          rows="3"
        //   value={RemarksDeveloper.data}
        />
                                    </TableCell>
                                    <TableCell align="left">
                                    <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
                                      { (watch("licencefeedepositedRemarks") || watch("licencefeedeposited")) &&

                                    <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
          <Button style={{ textAlign: "right" }} 
          onClick ={() => handlemodalsubmit("NWL_PROFORMA_EXISTING_PROPOSED_ROAD_PER_APPROVED_SECTORAL_PATWARI_SCRTINY", watch("existingProposedRemarks"), watch("existingProposed") )}
          >
            Submit
          </Button>
        </div>
}
</div>
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

export default ProformaPatwari;
