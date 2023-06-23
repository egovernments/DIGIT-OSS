import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { TextInput, Label, SubmitBar, LinkLabel, ActionBar, CloseSvg, DatePicker, MobileNumber } from "@egovernments/digit-ui-react-components";
import { Form, Col, Row } from "react-bootstrap";
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


import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import Collapse from "react-bootstrap/Collapse";
import { useStyles } from "./css/personalInfoChild.style";



function TableDialog(props) {

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


  const [open14, setOpen14] = useState(false);
  const [remarksDataExternal, setRemarksDataExternal] = useState({});
  const [loader, setLoader] = useState(false);

//   useEffect(() => {
//     handleDrawingClick();
//   }, [])
  
  console.log("remarksDataExternal" , remarksDataExternal);

  return (
    <div>
   

       <Modal
      //  class="modal fade"
        id="exampleModalScrollable" 
        tabindex="-1"
         role="dialog" 
         aria-labelledby="exampleModalScrollableTitle" 
         aria-hidden="true"
       scrollable={true}
       
      size="md"
      class="modal fade bd-example-modal-md"
      // tabindex="-1"
      //  role="dialog" 
 
      show={smShow}
      
    //   aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{ position: "fixed", left: "50%", top: "50%", transform: "translate(-50% , -50%)" ,  width: "revert" }}
      onHide={props.onClose}
    >
      <Modal.Header closeButton in={open14}>
        <Modal.Title id="example-modal-sizes-title-sm">
      

        </Modal.Title>
      </Modal.Header>
      
      
      <div style={{ position: "relative", width: "100%", display: "flex", margin: 2 }}>
     <Row style={{  marginRight:10, marginLeft:10}}>
     
                      </Row>
        </div>
     
      <Modal.Body>
        <div style={{fontSize: 16}}>
     {<div dangerouslySetInnerHTML={{__html: inputFieldValue}}/>}
     </div>
      </Modal.Body>
    </Modal>
    </div>
   
  );
}

export default TableDialog;
