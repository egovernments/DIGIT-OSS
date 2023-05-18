import React, { useState, useContext  } from "react";
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
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { ScrutinyRemarksContext } from "../../../../context/remarks-data-context";
import { useTranslation } from "react-i18next";
// import AddPost from "../Material/TextEditor";

function RadioButtonsGroup(props) {

  const {handleRoles, handleGetFiledsStatesById, handleGetRemarkssValues , bussinessService} = useContext(ScrutinyRemarksContext,);
  const apiData = props.apiResponseData;
  const applicationStatu =props.applicationStatus;
  const data =props.dataMDMS;

  
  
  const businessService = apiData?.businessService;
  const {t} = useTranslation();
 
  console.log("loginRadioButtonsGroup" , apiData ,applicationStatu , businessService,data)


  const userRoles = Digit.UserService.getUser()?.info?.roles.map((item) => item.code) || [];
  const showActionButton = userRoles.includes("AO_HQ");
  const showActionButton1 = userRoles.includes("SO_HQ");
  const showActionButton2 = userRoles.includes("CAO_HQ");

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
          PROFORMA FOR SCRUTINY (BY OFFICE ACCOUNT BRANCH )
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
          <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "20px", marginBottom: "52px" }}>
            <h4 style={{ fontSize: "20px", marginLeft: "5px" }}>PROFORMA FOR SCRUTINY (BY OFFICE ACCOUNT BRANCH )</h4>
            <div className="card">
              <Form>
                <TableContainer>
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
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>1</TableCell>
                        <TableCell align="left">
                          <h2>
                            {/* Whether Scrutiny fee @ Rs. 10 per sq.mtr of the applied land in case of plotted colony and @ Rs. 10 per sq.mtr X FAR in
                            case of other than plotted colony deposited.  */}
                            {`${t("NWL_PROFORMA_WHETHER_SCRUTINY_FEE_APPLIED_LAND_PLOTTED_COLONY_ACCOUNT")}`}
                            &nbsp;&nbsp;
                          </h2>
                        </TableCell>
                        <TableCell align="left">
                          <FormControl>
                            <div className="row">
                              {/* <div class="col-md-4 text-right"> */}
                              <div className="d-flex flex-row align-items-center my-1">
                                <label htmlFor="whetherScrutinyFee">
                                  <input
                                    {...register("whetherScrutinyFee")}
                                    type="radio"
                                    disabled={!showActionButton && !showActionButton1 && !showActionButton2}
                                    value="Y"
                                    id="whetherScrutinyFee"
                                  />
                                  &nbsp;&nbsp; &nbsp; Yes &nbsp;&nbsp;
                                </label>
                                <label htmlFor="whetherScrutinyFee">
                                  <input
                                    {...register("whetherScrutinyFee")}
                                    type="radio"
                                    disabled={!showActionButton && !showActionButton1 && !showActionButton2}
                                    value="N"
                                    id="whetherScrutinyFee"
                                  />
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
          {...register("whetherScrutinyFeeRmarkes")}
          disabled={!showActionButton && !showActionButton1 && !showActionButton2}
          rows="3"
          // value={RemarksDeveloper.data}
        />
                        </TableCell>
                        <TableCell align="left">
                 
                 <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
                   { (watch("whetherScrutinyFeeRmarkes") || watch("whetherScrutinyFee")) &&

                     <Button style={{ textAlign: "right" }} 
                     onClick ={() => handlemodalsubmit("NWL_PROFORMA_WHETHER_LICENCE_FEE_DEPOSITED_ACCOUNT", watch("whetherScrutinyFeeRmarkes"), watch("whetherScrutinyFee") )}
                     >
                       Submit
                     </Button>
                     }

</div>
                 </TableCell>
                      </TableRow>

                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>2</TableCell>
                        <TableCell align="left">
                          <h2>
                            {/* Whether 25% of the licence fee deposited.  */}
                          {`${t("NWL_PROFORMA_WHETHER_LICENCE_FEE_DEPOSITED_ACCOUNT")}`}
                            &nbsp;&nbsp;</h2>
                        </TableCell>
                        <TableCell align="left">
                          <FormControl>
                            <div className="row">
                              {/* <div class="col-md-4 text-right"> */}
                              <div className="d-flex flex-row align-items-center my-1">
                                <label htmlFor="licencefeedeposited">
                                  <input
                                    {...register("licencefeedeposited")}
                                    type="radio"
                                    disabled={!showActionButton && !showActionButton1 && !showActionButton2}
                                    value="Y"
                                    id="licencefeedeposited"
                                  />
                                  &nbsp;&nbsp;&nbsp; Yes &nbsp;&nbsp;
                                </label>
                                <label htmlFor="licencefeedeposited">
                                  <input
                                    {...register("licencefeedeposited")}
                                    type="radio"
                                    disabled={!showActionButton && !showActionButton1 && !showActionButton2}
                                    value="N"
                                    id="licencefeedeposited"
                                  />
                                  &nbsp;&nbsp;&nbsp; No &nbsp;&nbsp;
                                </label>
                              </div>
                            </div>
                            {/* </div> */}
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
          {...register("licencefeedepositedRmarkes")}
          disabled={!showActionButton && !showActionButton1 && !showActionButton2}
          rows="3"
          // value={RemarksDeveloper.data}
        />
                                    </TableCell>
                        <TableCell align="left">
                 
                 <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
                   { (watch("licencefeedepositedRmarkes") || watch("licencefeedeposited")) &&

                     <Button style={{ textAlign: "right" }} 
                     onClick ={() => handlemodalsubmit("NWL_PROFORMA_WHETHER_LICENCE_FEE_DEPOSITED_ACCOUNT", watch("licencefeedepositedRmarkes"), watch("licencefeedeposited") )}
                     >
                       Submit
                     </Button>
                     }

</div>
                 </TableCell>
                      </TableRow>
                      {/* ))} */}

                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>3</TableCell>
                        <TableCell align="left">
                          <h2>Documents submitted regarding the Financial position of the applicant/developer is in order or not. &nbsp;&nbsp;</h2>
                        </TableCell>
                        <TableCell align="left">
                          <FormControl>
                            <div className="row">
                              {/* <div class="col-md-4 text-right"> */}
                              <div className="d-flex flex-row align-items-center my-1">
                                &nbsp;&nbsp;
                                <label htmlFor="applicantdeveloper">
                                  <input
                                    {...register("applicantdeveloper")}
                                    type="radio"
                                    disabled={!showActionButton && !showActionButton1 && !showActionButton2}
                                    value="Y"
                                    id="applicantdeveloper"
                                  />
                                  &nbsp; Yes &nbsp;&nbsp;
                                </label>
                                <label htmlFor="applicantdeveloper">
                                  <input
                                    {...register("applicantdeveloper")}
                                    type="radio"
                                    value="N"
                                    disabled={!showActionButton && !showActionButton1 && !showActionButton2}
                                    id="applicantdeveloper"
                                  />
                                  &nbsp; No &nbsp;&nbsp;
                                </label>
                              </div>
                            </div>
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
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>4</TableCell>
                        <TableCell align="left">
                          <h2>
                            If the license application is under part migration/ migration, the parent license renewed/requisite renewal fee +
                            applicable interest deposited is in order or not. &nbsp;&nbsp;
                          </h2>
                        </TableCell>
                        <TableCell align="left">
                          <FormControl>
                            <div className="row">
                              {/* <div class="col-md-4 text-right"> */}
                              <div className="d-flex flex-row align-items-center my-1">
                                &nbsp;&nbsp;
                                <label htmlFor="renewedreuisite">
                                  <input
                                    {...register("renewedreuisite")}
                                    type="radio"
                                    disabled={!showActionButton && !showActionButton1 && !showActionButton2}
                                    value="Y"
                                    id="renewedreuisite"
                                  />
                                  &nbsp; Yes &nbsp;&nbsp;
                                </label>
                                <label htmlFor="renewedreuisite">
                                  <input
                                    {...register("renewedreuisite")}
                                    type="radio"
                                    disabled={!showActionButton && !showActionButton1 && !showActionButton2}
                                    value="N"
                                    id="renewedreuisite"
                                  />
                                  &nbsp; No &nbsp;&nbsp;
                                </label>
                              </div>
                            </div>
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
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>5</TableCell>
                        <TableCell align="left">
                          <h2>If Case for Additional License, Outstanding Dues of parent license. &nbsp;&nbsp;</h2>
                        </TableCell>
                        <TableCell align="left">
                          <FormControl>
                            <div className="row">
                              {/* <div class="col-md-4 text-right"> */}
                              <div className="d-flex flex-row align-items-center my-1">
                                &nbsp;&nbsp;
                                <label htmlFor="additionalLicense">
                                  <input
                                    {...register("additionalLicense")}
                                    type="radio"
                                    disabled={!showActionButton && !showActionButton1 && !showActionButton2}
                                    value="Y"
                                    id="additionalLicense"
                                  />
                                  &nbsp; Yes &nbsp;&nbsp;
                                </label>
                                <label htmlFor="additionalLicense">
                                  <input
                                    {...register("additionalLicense")}
                                    type="radio"
                                    disabled={!showActionButton && !showActionButton1 && !showActionButton2}
                                    value="N"
                                    id="additionalLicense"
                                  />
                                  &nbsp; No &nbsp;&nbsp;
                                </label>
                              </div>
                            </div>
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
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>6</TableCell>
                        <TableCell align="left">
                          <h2>Fee & Charges for LOI generation is in order or not &nbsp;&nbsp;</h2>
                        </TableCell>
                        <TableCell align="left">
                          <FormControl>
                            <div className="row">
                              {/* <div class="col-md-4 text-right"> */}
                              <div className="d-flex flex-row align-items-center my-1">
                                &nbsp;&nbsp;
                                <label htmlFor="loigeneration">
                                  <input
                                    {...register("loigeneration")}
                                    type="radio"
                                    disabled={!showActionButton && !showActionButton1 && !showActionButton2}
                                    value="Y"
                                    id="loigeneration"
                                  />
                                  &nbsp; Yes &nbsp;&nbsp;
                                </label>
                                <label htmlFor="loigeneration">
                                  <input
                                    {...register("loigeneration")}
                                    type="radio"
                                    disabled={!showActionButton && !showActionButton1 && !showActionButton2}
                                    value="N"
                                    id="loigeneration"
                                  />
                                  &nbsp; No &nbsp;&nbsp;
                                </label>
                              </div>
                            </div>
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
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>7</TableCell>
                        <TableCell align="left">
                          <h2>Outstanding dues in other licenses of the Developer Company and its Board to Directors. &nbsp;&nbsp;</h2>
                        </TableCell>
                        <TableCell align="left">
                          <FormControl>
                            <div className="row">
                              {/* <div class="col-md-4 text-right"> */}
                              <div className="d-flex flex-row align-items-center my-1">
                                &nbsp;&nbsp;
                                <label htmlFor="loigeneration">
                                  <input
                                    {...register("outstandingdues")}
                                    type="radio"
                                    disabled={!showActionButton && !showActionButton1 && !showActionButton2}
                                    value="Y"
                                    id="outstandingdues"
                                  />
                                  &nbsp; Yes &nbsp;&nbsp;
                                </label>
                                <label htmlFor="outstandingdues">
                                  <input
                                    {...register("outstandingdues")}
                                    type="radio"
                                    disabled={!showActionButton && !showActionButton1 && !showActionButton2}
                                    value="N"
                                    id="outstandingdues"
                                  />
                                  &nbsp; No &nbsp;&nbsp;
                                </label>
                              </div>
                            </div>
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
