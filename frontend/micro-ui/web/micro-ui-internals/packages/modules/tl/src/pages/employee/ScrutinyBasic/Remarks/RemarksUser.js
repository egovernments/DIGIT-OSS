import React, { useState, useRef, useEffect, useContext  } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { TextInput, Label, SubmitBar, LinkLabel, ActionBar, CloseSvg, DatePicker, MobileNumber } from "@egovernments/digit-ui-react-components";
import {Card, Form, Col, Row } from "react-bootstrap";
import axios from "axios";
import { useStyles } from "./styles/modalChild.style";
import { useParams } from "react-router-dom";
// import { ScrutinyRemarksContext } from "../../../../../context/remarks-data-context";
// import AddPost from "../../Material/TextEditor";
// import { getDocShareholding } from "../ScrutinyDevelopment/docview.helper";
// import Visibility from "@mui/icons-material/Visibility";
// import FileDownload from "@mui/icons-material/FileDownload";

import { IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import Spinner from "../../../../components/Loader";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import Collapse from "react-bootstrap/Collapse";
import DataGridDemo from "../PatwariHQ";
import { ScrutinyRemarksContext } from "../../../../../context/remarks-data-context";



function FullScreenDialog(props) {

  const {remarksData,notingRemarksData,iconStates,rolesDate,handleRoles,handleGetFiledsStatesById,handleGetRemarkssValues,handleGetNotingRemarkssValues } = useContext(ScrutinyRemarksContext);



  console.log("newdataPAFullScreen", remarksData);
  console.log("newdatahappFullScreen", rolesDate);


  const userInfo = Digit.UserService.getUser()?.info || {};
  const classes = useStyles();
  const smShow = props.displaymodal;
  const docModal = props.disPlayDoc;
  const [RemarksDeveloper, setDeveloperRemarks] = useState("");
  const [RemarksEntered, setRemarksEntered] = useState("");
  const [yesOrNoClicked, setIsYesorNoClicked] = useState();
  const [status, setStatus] = useState("");
  const inputFieldValue = props.fieldValue;
  const inputFieldValue2 = props.fieldValue2;
  const inputFieldValue3 = props.fieldValue3;
  const inputFieldLabel = props.labelValue;
  const dateTime = new Date();
  const authToken = Digit.UserService.getUser()?.access_token || null;
  const { id } = useParams();
  const userRolesArray = userInfo?.roles.filter((user) => user.code !=="EMPLOYEE" );
  const filterDataRole = userRolesArray?.[0]?.code;
  const designation = userRolesArray?.[0]?.name;
  const { t } = useTranslation();
  const { pathname: url } = useLocation();
  
  const handleClickOpen = (smShow) => {
    smShow(false);
  };




  // ///////////////////////
  const [open14, setOpen14] = useState(false);
  const [remarksDataExternal, setRemarksDataExternal] = useState({});
  const [loader, setLoader] = useState(false);

  const handleDrawingClick = async () =>{
    // setLoader(true);

    const dataToSend = {
        RequestInfo: {
            apiId: "Rainmaker",
            action: "_create",
            did: 1,
            key: "",
            msgId: "20170310130900|en_IN",
            ts: 0,
            ver: ".01",
            authToken: authToken,
           
        },
    };
    try {
        const Resp = axios.post(`/land-services/egscrutiny/_search4?applicationNumber=${id}&roles=${inputFieldValue3}`, dataToSend).then((response) => {
            return response.data;
        });
  
        console.log("RemarksSection", Resp);
        // setLoader(false);
        setRemarksDataExternal(Resp);
        smShow == false
    } catch (error) {
      // setLoader(false);
        console.log(error);
    }
  
  };




  //////////////////////////

 



  useEffect(() => {
    handleDrawingClick();
  }, [])
  
  console.log("remarksDataExternal" , remarksDataExternal);

  return (
    <div>
       {/* {loader && <Spinner></Spinner>} */}

       <Modal
       class="modal fade"
       id="exampleModalScrollable" 
       tabindex="-1"
        role="dialog" 
        aria-labelledby="exampleModalScrollableTitle" 
        aria-hidden="true"
      scrollable={true}
      //  aria-labelledby="myExtraLargeModalLabel"
        // aria-hidden="true"
  
    // className="modal-lg modal-center"
      show={smShow}
      // aria-labelledby="example-modal-sizes-title-sm"
      // aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{ position: "fixed", left: "50%", top: "50%", transform: "translate(-50% , -50%)" , height:700 ,marginTop: "50px"  }}
      onHide={props.onClose}
    >
      <Modal.Header closeButton in={open14} style={{ textAlign: "center" ,backgroundColor: "#FFD954" ,marginLeft:"3%", maxWidth:"95%" }}>
        {/* <Modal.Title id="example-modal-sizes-title-sm" > */}
        ONLINE LICENSE APPLICATION SCRUTINY PROFORMA
        {/* <Card style={{ textAlign: "center" ,backgroundColor: "#FFD954" , maxWidth:"95%" }}></Card> */}
        {/* </Modal.Title> */}
      </Modal.Header>
      
      {/* <div
            className="collapse-header"
            onClick={() => {setOpen14(!open14) , handleDrawingClick()}}
            aria-controls="example-collapse-text"
            aria-expanded={open14}
            style={{
              background: "#E9E5DE",
              padding: "0.25rem 1.25rem",
              borderRadius: "0.25rem",
              fontWeight: "600",
              display: "flex",
              cursor: "pointer",
              color: "#817f7f",
              justifyContent: "space-between",
              alignContent: "center",
              margin:"10",
            }}
          >
            <span style={{ color: "#817f7f", fontSize: 16 }} className="">
        
             {inputFieldValue}
             
            </span>
            {open14 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
          </div>
          <Collapse in={open14}>
            <div id="example-collapse-text" 
            style={{ marginTop: 12, paddingLeft: 12, paddingRight: 12 }}
            >
     */}
      <div style={{ position: "relative", width: "100%", display: "flex", margin: 2 }}>
     <Row style={{  marginRight:10, marginLeft:10}}>
      {/* {remarksDataExternal !== null ?  (
                      remarksDataExternal?.egScrutiny?.map((el, index) => {
                        return (
                          <div>
                            <table colSpan = "2" className="table table-bordered" style={{ backgroundColor: "#ddf2cf" }}>
                  <thead>

                    <tr className="border-bottom-0">
                      <th class="fw-normal pb-0 border-bottom-0 align-top">
                        Sr.No
                      </th>
                      <th class="fw-normal pb-0 border-bottom-0 align-top">
                        Filed Name
                      </th>
                      <th class="fw-normal pb-0 border-bottom-0 align-top">
                        Filed value
                      </th>
                      <th class="fw-normal pb-0 border-bottom-0 align-top">
                        Status
                      </th>

                      <th class="fw-normal pb-0 border-bottom-0 align-top">
                        Remarks
                      </th>
                    </tr>
                    <tr>

                    </tr>


                  </thead>
                   <tbody>
               
                   {el?.approvedfiledDetails !== null ? (
         el?.approvedfiledDetails?.map((data, i) => {
                    return (
                  
                         <tr >

                              <td>
                                {i + 1}
                              </td>
                              <td>
                                <b>{data.name}</b>
                              </td>
                              <td>
                                <b>{data.value}</b>
                              </td>

                              <td>
                                <b>{data.isApproved}</b>
                              </td>
                              <td>
                             
                                <i>{<div dangerouslySetInnerHTML={{__html: data.remarks}}/>}</i>
                              </td>

                            </tr>
                               );
                              })
                            ) : (
                              <p></p>
                            )}
                         </tbody>
                        </table>
                              <br></br>
                        <table colSpan = "2" className="table table-bordered" style={{ backgroundColor: "#ddf2cf" }}>
                  <thead>

                    <tr className="border-bottom-0">
                      <th class="fw-normal pb-0 border-bottom-0 align-top">
                        Sr.No
                      </th>
                      <th class="fw-normal pb-0 border-bottom-0 align-top">
                        Filed Name
                      </th>
                      <th class="fw-normal pb-0 border-bottom-0 align-top">
                        Filed value
                      </th>
                      <th class="fw-normal pb-0 border-bottom-0 align-top">
                        Status
                      </th>

                      <th class="fw-normal pb-0 border-bottom-0 align-top">
                        Remarks
                      </th>
                    </tr>
                    <tr>

                    </tr>


                  </thead>
                   <tbody>
               
                   {el?.condApprovedfiledDetails !== null ? (
         el?.condApprovedfiledDetails?.map((data1, i1) => {
                    return (
                  
                         <tr >

                              <td>
                                {i1 + 1}
                              </td>
                              <td>
                                <b>{data1.name}</b>
                              </td>
                              <td>
                                <b>{data1.value}</b>
                              </td>

                              <td>
                                <b>{data1.isApproved}</b>
                              </td>
                              <td>
                             
                                <i>{<div dangerouslySetInnerHTML={{__html: data1.remarks}}/>}</i>
                              </td>

                            </tr>
                               );
                              })
                            ) : (
                              <p></p>
                            )}
                         </tbody>
                        </table>
                              <br></br>
                              <table colSpan = "2" className="table table-bordered" style={{ backgroundColor: "#ddf2cf" }}>
                  <thead>

                    <tr className="border-bottom-0">
                      <th class="fw-normal pb-0 border-bottom-0 align-top">
                        Sr.No
                      </th>
                      <th class="fw-normal pb-0 border-bottom-0 align-top">
                        Filed Name
                      </th>
                      <th class="fw-normal pb-0 border-bottom-0 align-top">
                        Filed value
                      </th>
                      <th class="fw-normal pb-0 border-bottom-0 align-top">
                        Status
                      </th>

                      <th class="fw-normal pb-0 border-bottom-0 align-top">
                        Remarks
                      </th>
                    </tr>
                    <tr>

                    </tr>


                  </thead>
                   <tbody>
               
                   {el?.disApprovedfiledDetails !== null ? (
         el?.disApprovedfiledDetails?.map((data2, i2s) => {
                    return (
                  
                         <tr >

                              <td>
                                {i2s + 1}
                              </td>
                              <td>
                                <b>{data2.name}</b>
                              </td>
                              <td>
                                <b>{data2.value}</b>
                              </td>

                              <td>
                                <b>{data2.isApproved}</b>
                              </td>
                              <td>
                             
                                <i>{<div dangerouslySetInnerHTML={{__html: data2.remarks}}/>}</i>
                              </td>

                            </tr>
                               );
                              })
                            ) : (
                              <p></p>
                            )}
                         </tbody>
                        </table>
                            </div>
                          );
                        })
                      ) : (
                        <p></p>
                      )} */}

                      <DataGridDemo
                      
                      remarksData={remarksData}
                      dataForIcons={rolesDate}
                      >
                    </DataGridDemo>
                      </Row>
                      <Row>

                      </Row>
        </div>
      {/* </div>
            </Collapse> */}
      <Modal.Body>

        {/* <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
          <Button style={{ textAlign: "right" }} onClick={handleClickOpen}>
            Submit
          </Button>
        </div> */}
       
      </Modal.Body>
    </Modal>
    </div>
   
  );
}

export default FullScreenDialog;
