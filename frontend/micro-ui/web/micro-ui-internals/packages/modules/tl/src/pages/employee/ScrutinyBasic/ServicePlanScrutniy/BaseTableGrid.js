import React, { useState, useRef, useEffect, useContext  } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { TextInput, Label, SubmitBar, LinkLabel, ActionBar, CloseSvg, DatePicker, MobileNumber } from "@egovernments/digit-ui-react-components";
import {Card, Form, Col, Row } from "react-bootstrap";
import axios from "axios";

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
import { useStyles } from "../Remarks/styles/modalChild.style";



function BaseTableGrid(props) {

  const {remarksData,notingRemarksData,iconStates,rolesDate,handleRoles,handleGetFiledsStatesById,handleGetRemarkssValues,handleGetNotingRemarkssValues } = useContext(ScrutinyRemarksContext);



  
  


  const userInfo = Digit.UserService.getUser()?.info || {};
  const classes = useStyles();
  const smShow = props.displaymodal;
  const docModal = props.disPlayDoc;
  const remarksDataRole = props.remarksDataExternal;
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


  // console.log("newdataPAFullScreen", remarksDataRole);

  // ///////////////////////
  const [open14, setOpen14] = useState(false);
  
  const [loader, setLoader] = useState(false);

  
  console.log("remarksinputFieldValue" , inputFieldValue3,inputFieldValue2 ,inputFieldValue);
  const [remarksDataExternal, setRemarksDataExternal] = useState();

    //  const setRoleDataModal = async () =>{
 
    // const dataToSend = {
    //       RequestInfo: {
    //           apiId: "Rainmaker",
    //           action: "_create",
    //           did: 1,
    //           key: "",
    //           msgId: "20170310130900|en_IN",
    //           ts: 0,
    //           ver: ".01",
    //           authToken: authToken,
             
    //       },
    //   };
    //   try {
    //       const Resp = await axios.post(`/land-services/egscrutiny/_search4?applicationNumber=${id}&roles=${inputFieldValue3}`, dataToSend).then((response) => {
    //           return response.data;
    //       });
    
    //       console.log("RemarksSection", Resp);
       
    //       setRemarksDataExternal(Resp?.egScrutiny);
          
    //   } catch (error) {
        
    //       console.log(error);
    //   }
    
    // };



 


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
     
      show={smShow}
      
      centered
      style={{ position: "fixed", left: "50%", top: "50%", transform: "translate(-50% , -50%)" , height:600 ,marginTop: "50px", zIndex: "10000"  }}
      onHide={props.onClose}
    >
      <Modal.Header closeButton in={open14} style={{ textAlign: "center" ,backgroundColor: "#FFD954" , maxWidth:"100%", fontSize: "x-large",paddingLeft: "16%" }}>
     
       <b>ONLINE LICENSE APPLICATION SCRUTINY PROFORMA</b> 
      
      </Modal.Header>
      
      

      <Modal.Body >

      <div style={{ position: "relative", width: "100%", display: "flex", margin: 2 }}>
     <Row style={{  marginRight:40, marginLeft:20}}>
   

                      <DataGridDemo
                      
                      remarksData={remarksData}
                      dataForIcons={rolesDate}
                      >
                    </DataGridDemo>
                      </Row>
                      <Row>

                      </Row>
        </div>
       
      </Modal.Body>
    </Modal>
    </div>
   
  );
}

export default BaseTableGrid;
