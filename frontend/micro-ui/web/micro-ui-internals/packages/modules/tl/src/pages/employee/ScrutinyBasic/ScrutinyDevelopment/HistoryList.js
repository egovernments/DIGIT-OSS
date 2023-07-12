
import React, { useContext, useEffect, useState } from "react";

import { Row, Col, Card, Container, Form, Button } from "react-bootstrap";
import axios from "axios";
import { ScrutinyRemarksContext } from "../../../../../context/remarks-data-context";
import { useParams } from "react-router-dom";
import { margin } from "@mui/system";
import { getDocShareholding } from "../ScrutinyDevelopment/docview.helper";
import Visibility from "@mui/icons-material/Visibility";
import FileDownload from "@mui/icons-material/FileDownload";
import { IconButton } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

// import Collapse from "react-bootstrap/Collapse";

import {  Box,
  Collapse,
  } from "@mui/material";
import AddPost from "../../Material/TextEditor";
import DemoParinted from "./DemoParint";
import BasicTable from "./UserRemarks";
import { convertDateToEpoch, convertEpochToDate, convertEpochToDateDMY } from "../../../../utils";
import FullScreenDialog from "../Remarks/RemarksUser";
import ScrollToTop from "@egovernments/digit-ui-react-components/src/atoms/ScrollToTop";

// import { Scrollbars } from 'react-custom-scrollbars';



const windowHeight = window !== undefined ? window.innerHeight : null;
const HistoryList = (props) => {

  // function createMarkup(el) {
  //   return {__html:conatn};
    
  //   console.log("dataremarkswithouthtml" , el);
    
  // }
  // console.log("dataremarkswithouthtml" , el);
  

  const {handleRoles, handleGetFiledsStatesById, handleGetRemarkssValues , handleGetNotingRemarkssValues, bussinessService} = useContext(ScrutinyRemarksContext,);
  const { id } = useParams();
  let user = Digit.UserService.getUser();
  const userRoles = user?.info?.roles?.map((e) => e.code);
  const showRemarksSection = userRoles.includes("DTCP_HR")
  const histeroyData = props.histeroyData
  const [open3, setOpen3] = useState(false);
  const [RemarksDeveloper, setDeveloperRemarks] = useState("");
  const [approval, setDisapproval] = useState(false);
  const [disapprovedList, setDisapprovedList] = useState([]);
  const dateTime = new Date();
  const remarkDataResp = props.remarkData;
  const authToken = Digit.UserService.getUser()?.access_token || null;
  const applicationStatus = props.applicationStatus
  

  const onAction = async (data, index, value) => {
    console.log("DataDev123...", data, value);
    let tempArray = disapprovedList;
    tempArray[index] = { ...tempArray[index], isLOIPart: value, }
    setDisapprovedList([...tempArray]);
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
        ...data,
        isLOIPart: value,
        ts: dateTime.toUTCString(),
      },
    };

    try {
      const Resp = await axios.post("/land-services/egscrutiny/_create?status=submit", postData, {}).then((response) => {
        // handleGetRemarkssValues(id);
        return response.data;
      });
    } catch (error) {
      console.log(error);
    }

  }


  useEffect(
    () => {
      if (remarkDataResp && remarkDataResp?.length) {
        const tempArray = remarkDataResp.filter((ele) => ele.isApproved === "disapproved")
        console.log("log123DisA", tempArray);
        setDisapprovedList(tempArray);
      }
      // const ScrollToBottom = () =>{
      //   console.log("regergergregegegreg",document.getElementById("historyList").scrollHeight)
      //   document.getElementById("historyList").scroll({
      //     top:document.getElementById("historyList").scrollHeight,
      //     behavior:'smooth',
      //   });

      // };
      // if(){
      //   ScrollToBottom();
      // }
    }, [remarkDataResp]
  )

  // const Container = () => {
  //   return (
  //     <div style={{ height: "2300px", width: "514px", margin: "16px" }}>
  //       <Paper style={{ height: "100%", width: "514px" }}>Hello</Paper>
  //     </div>
  //   );
  // };


  // const sumdataTime = props.remarksum;
//   // const [applicationId, setApplicationId] = useState("");
//   const [open, setOpen] = useState<Number[]>([]);
// const handleClick = (clickedIndex: Number) => {
//   if(open.includes(clickedIndex)){
//     const openCopy = open.filter((element) => {return element !== clickedIndex});
//     setOpen(openCopy);
//   } else {
//     const openCopy = [...open];
//     openCopy.push(clickedIndex);
//     setOpen(openCopy);
//   }
// }

// const [open, setOpen] = useState <Number[]>([]);
// const handleClick = (clickedIndex: Number) => {
//   if(open.includes(clickIndex)){
//     const openCopy = open.filter((element) => {return element !== clickedIndex});
//     setOpen(openCopy);
//   } else {
//     const openCopy = [...open];
//     openCopy.push(clickedIndex);
//     setOpen(openCopy);
//   }
// }
// const [data,setData] = useState([]);
const [datailsShown , setDatailsShown] = useState([]);
const toggleshown = userID => {
  const  showState = datailsShown.slice();
  const index = showState.indexOf(userID);
  if(index >= 0 ){
    showState.splice(index, 1);
    setDatailsShown(showState);
  }
  else{
    showState.push(userID);
    setDatailsShown(showState);
  }
}
const [data,setData] = useState([]);
const toggleshown1 = employeeName => {
  const  showState = data.slice();
  const index = showState.indexOf(employeeName);
  if(index >= 0 ){
    showState.splice(index, 1);
    setData(showState);
  }
  else{
    showState.push(employeeName);
    setData(showState);
  }
}
const [dataTwo,setDataTwo] = useState([]);
const toggleshown2 = role => {
  const  showState = dataTwo.slice();
  const index = showState.indexOf(role);
  if(index >= 0 ){
    showState.splice(index, 1);
    setDataTwo(showState);
  }
  else{
    showState.push(role);
    setDataTwo(showState);
  }
}
const [dataFrist,setDataFrist] = useState([]);
const toggleshown3 = designation => {
  const  showState = dataFrist.slice();
  const index = showState.indexOf(designation);
  if(index >= 0 ){
    showState.splice(index, 1);
    setDataFrist(showState);
  }
  else{
    showState.push(designation);
    setDataFrist(showState);
  }
}

const [dataThree,setDataThree] = useState([]);
const toggleshown4 = applicationStatus => {
  const  showState = dataThree.slice();
  const index = showState.indexOf(applicationStatus);
  if(index >= 0 ){
    showState.splice(index, 1);
    setDataThree(showState);
  }
  else{
    showState.push(applicationStatus);
    setDataThree(showState);
  }
}
const [open, setOpen] = useState(false);
const [smShow, setSmShow] = useState(false);
// const [roleDataModal, setRoleDataModal] = useState([]);
  const [docModal, setDocModal] = useState(false);
  const handlemodaldData = () => {
    setSmShow(false);
  };
  const [fieldValue, setFieldValue] = useState("");
  const [fieldValue2, setFieldValue2] = useState("");
  const [fieldValue3, setFieldValue3] = useState("");
const  datamap = remarkDataResp?.[0]?.performaFieldDetail.reverse()
console.log("datamap", datamap);
// const navigate = useNavigate();

const handleClick = async (e) => {

//   setTimeout(() => {
//  window.location.href = `/digit-ui/employee/tl/BasicTable`
//   }, 3000);
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

const Resp = await axios.post(`/tl-services/new/license/pdf?applicationNumber=${id}`, payload, { responseType: "arraybuffer" })

  const pdfBlob = new Blob([Resp.data], { type: 'application/pdf' });
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl);

  console.log("logger123456...", pdfBlob, pdfUrl);
  setLoader(false);
  

// }
// else{
//   console.log(error);
// }
};





  return (
   
    <Container
      className="justify-content-center"
      style={{
        top: windowHeight * 0.3,
        minWidth: "100%",
        maxWidth: "100%",
        maxHeight: "50%",
        minHeight: "40%",
        marginTop: 5,
      }}
    >
       {/* <ScrollToTop /> */}
      <Row class="remarkshelp">
        <div 
        class="concludingremarks"
         >
          {/* <AddPost

          applicationStatus={applicationStatus}
          setState={(e) => {
            setDeveloperRemarks({ data: e });
         
          }}
          state={RemarksDeveloper.data}
          
          >
            
          </AddPost> */}
           <DemoParinted 
         applicationStatus={applicationStatus}
         setState={(e) => {
           setDeveloperRemarks({ data: e });
        
         }}
         state={RemarksDeveloper.data}></DemoParinted>

        </div>
       

{/* 
        <div 
        class="currentremarks"
         >
          <div class="WhatsNewCard" style={{ backgroundColor: "#ddf2cf" }}>

          Drawing

            </div></div>
            <div 
        class="currentremarks"
         >
          <div class="WhatsNewCard" style={{ backgroundColor: "#ddf2cf" }}>
          Legal 
            </div></div>
            <div 
        class="currentremarks"
         >
          <div class="WhatsNewCard" style={{ backgroundColor: "#ddf2cf" }}>
          Revnue
            </div></div>
            <div 
        class="currentremarks"
         >
          <div class="WhatsNewCard" style={{ backgroundColor: "#ddf2cf" }}>
          Techinical 
            </div></div>
            <div 
        class="currentremarks"
         >
          <div class="WhatsNewCard" style={{ backgroundColor: "#ddf2cf" }}>
          Main

            </div></div>
            <div 
        class="currentremarks"
         >
          <div class="WhatsNewCard" style={{ backgroundColor: "#ddf2cf" }}>
          DTP Field Section
            </div></div>
            
            
            <div 
        class="currentremarks"
         >
          <div class="WhatsNewCard" style={{ backgroundColor: "#ddf2cf" }}>
          STP Field Section 

            </div></div>
            <div 
        class="currentremarks"
         >
          <div class="WhatsNewCard" style={{ backgroundColor: "#ddf2cf" }}>
          Main

            </div></div> */}


        {/* </Row> */}
    

        <div class="histrorynotingremarks" id="historyList">
          <Card style={{backgroundColor: "rgb(255, 217, 84)"}}>
          <p class="text-center"><h3><b>Noting</b></h3></p>
          </Card>
          <div 
          // class="WhatsNewCard"
        
           style={{ backgroundColor: "#ddf2cf" , fontSize: 16 }}>



            {/* <div >
              <p class="text-center" ><h4>History Remarks</h4></p>
              {histeroyData?.data?.processInstances?.map((item, index) => (
                <div key={index}>
                  <hr style={{ marginTop: 5, marginBottom: 5 }}></hr>
                  
     
                  {<div dangerouslySetInnerHTML={{__html: item.comment}}/>}
                  <div>{item.action}</div>

                  <div className="text-right">
                   
                    <div class="font-weight-bold">
                      {item.assigner.name}
                    </div>
               
                  </div>
                  <div className="text-right">
                    {item?.documents?.map((item, index) => (
                      <div class="font-weight-bold">
                        <div className="btn btn-sm col-md-2">
                          <IconButton onClick={() => getDocShareholding(item?.fileStoreId)}>
                            <Visibility color="info" className="icon" />
                          </IconButton>
                        </div>

                        <div className="btn btn-sm col-md-2">
                          <IconButton onClick={() => getDocShareholding(item?.fileStoreId)}>
                            <FileDownload color="primary" className="mx-1" />
                          </IconButton>
                        </div>
                   
                      </div>
                    ))
                    }
                  </div>
                </div>
              ))
              }


            </div> */}

{/* <div class="WhatsNewCard" style={{ backgroundColor: "#ddf2cf" }}> */}
          
            {/* <Row>

              <Col>
                <b>Application Id.</b>
                {id}
              </Col>
            </Row> */}
           
      
            <div>
              <Form.Group>
              <FullScreenDialog
             
             passmodalData={handlemodaldData}
             displaymodal={smShow}
           
             onClose={() => { setSmShow(false); setDocModal(false) }}
             fieldValue={id}
             fieldValue2={fieldValue2}
             fieldValue3={fieldValue3}
></FullScreenDialog>


               <div>
               {remarkDataResp !== null ?  (
                      remarkDataResp?.map((el, index) => {
                        return (
                          <div>
                         {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open full-screen dialog
      </Button> */}
                                          
                                          <div style={{width:20}}>
                         <TextSnippetIcon
                  
                  onClick={() => {
                 
                    setSmShow(true);
                   
                   
                    setFieldValue(el.employeeName !== null ? el.employeeName : null);
                    setFieldValue2(el.designation !== null ? el.designation : null);
                    setFieldValue3(el.role !== null ? el.role : null);
                  }}
                ></TextSnippetIcon>
                         </div>
                  
<div >
<Box>
<Row>
{/* <p>
                  <IconButton
                         onClick={() => toggleshown4(el.applicationStatus)}
                       >
                         {dataThree.includes(index)? (
                         
                            <KeyboardArrowUpIcon /> 
                          ) : (
                         <p><KeyboardArrowDownIcon /><b style={{ color: "#ff0000" , fontSize: 16}}>{el.performaFieldDetail?.[0]?.isApproved}</b></p>
                        
                         )}
                         
                       </IconButton>
                       </p> */}
                        
                        <b>Noting # {index + 1}</b>
                           
                           {/* {dataThree.includes(el.applicationStatus) && (   */}
                           {el?.performaFieldDetail?.[0]?.isApproved == "Proforma"  &&     
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
                      {/* <th class="fw-normal pb-0 border-bottom-0 align-top">
                        Status
                      </th> */}

                      <th class="fw-normal pb-0 border-bottom-0 align-top">
                        Remarks
                      </th>
                    </tr>
                    <tr>

                    </tr>


                  </thead>
                   <tbody>
               
                   {el?.performaFieldDetail !== null ? (
         el?.performaFieldDetail?.map((data, i) => {
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

                              {/* <td>
                                <b>{el.isApproved}</b>
                              </td> */}
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
                      }
                        {/* )}  */}
                  </Row>
                    </Box>
             
                      
                      </div>


                      
                         

                        


                         {el?.notingDetail !== null ?  (
                      el?.notingDetail?.map((item , i) => {
                        return (
                          <div>
                            
                         
                         

                            {/* <b>{item?.isApproved}# {index + 1}</b> */}


                            <br></br>
                         <i>{<div dangerouslySetInnerHTML={{__html: item.remarks}}/>}</i>

                    
                             
                          </div>
                        );
                      })
                    ) : (
                      <p></p>
                    )}

{/* {data.includes(el.employeeName) && (
                    <Box > */}
        {/* {el?.performaFieldDetail?.[0]?.isApproved === "Proforma" && */}


          {/* }             */}


<Row style={{ margin: 4 }}>   

                  <b style={{ textAlign: "right" }}>{el.employeeName}</b>
                      <b style={{ textAlign: "right", marginRight: 2 }}>{el.designation}</b>
                     {/* <b style={{ textAlign: "right" }}>{el.role}</b> */}
                  
                     </Row>
                     <Row style={{ margin: 4 }}>

                     
                     <b style={{ textAlign: "right" }}>
                     <p style={{ textAlign: "right" }}>
                      
                      {convertEpochToDateDMY(el?.createdOn)} {el?.ts}</p> 
                    
                   </b>
                    </Row>
                    <hr></hr>
                          </div>
                        );
                      })
                    ) : (
                      <p></p>
                    )}

                  
            
                  
                </div>
                    
              </Form.Group>

            </div>
            

          </div>




          </div>
  
      </Row>
      <Row>
       
      </Row>



    </Container>
 
    
    
  );
};

export default HistoryList;




