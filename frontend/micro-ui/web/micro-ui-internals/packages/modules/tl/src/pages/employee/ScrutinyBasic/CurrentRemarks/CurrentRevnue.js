
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
import { useTranslation } from "react-i18next";
import { Label } from "@egovernments/digit-ui-react-components";
import RemoveIcon from "@mui/icons-material/Remove";
import {  Box,
  Collapse,
  } from "@mui/material";

// import { Scrollbars } from 'react-custom-scrollbars';



const windowHeight = window !== undefined ? window.innerHeight : null;
const RevnueSection = (props) => {

  // function createMarkup(el) {
  //   return {__html:conatn};
    
  //   console.log("dataremarkswithouthtml" , el);
    
  // }
  // console.log("dataremarkswithouthtml" , el);
  

  const { handleGetFiledsStatesById, handleGetRemarkssValues } = useContext(ScrutinyRemarksContext);
  const { id } = useParams();
  const { t } = useTranslation();
  let user = Digit.UserService.getUser();
  const userRoles = user?.info?.roles?.map((e) => e.code);
  const showRemarksSection = userRoles.includes("DTCP_HR")
  const histeroyData = props.histeroyData

  const [open3, setOpen3] = useState(false);

  const [approval, setDisapproval] = useState(false);
  const [disapprovedList, setDisapprovedList] = useState([]);
  const dateTime = new Date();
  const remarkDataResp = props.remarkData;
  const authToken = Digit.UserService.getUser()?.access_token || null;


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

console.log("log123Disrenu" ,id);
  return (
    <Container
      className="justify-content-center"
      style={{
        top: windowHeight * 0.3,
        minWidth: "100%",
        maxWidth: "100%",
        maxHeight: "50%",
        minHeight: "40%",
        // marginTop: 5,
      }}
    >

{/* <div
            className="collapse-header"
            onClick={() => setOpen3(!open3)}
            aria-controls="example-collapse-text"
            aria-expanded={open3}
            style={{
              background: "#f1f1f1",
              padding: "0.25rem 1.25rem",
              borderRadius: "0.25rem",
              fontWeight: "600",
              display: "flex",
              cursor: "pointer",
              color: "#817f7f",
              justifyContent: "space-between",
              alignContent: "center",
            }}
          >
            <span style={{ color: "#817f7f", fontSize: 16 }} className="">
              - Revnue Section 
            
            </span>
            {open3 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
          </div>
          <Collapse in={open3}>
            <div id="example-collapse-text" style={{ marginTop: 12, paddingLeft: 12, paddingRight: 12 }}> */}




      <Row class="remarkshelp">
        <div 
        class="currentremarks"
         >
          <div class="WhatsNewCard" style={{ backgroundColor: "#ddf2cf" }}>
            <p class="text-center" ><h4>Revnue Section</h4></p>
            <Row>

              <Col>
                <b>Application Id.</b>
                {id}
              </Col>
            </Row>
           
      
            <div>
              <Form.Group>
               <div>
               {remarkDataResp !== null ?  (
                      remarkDataResp?.map((el,  index) => {
                        return (
                          <div>
                            <p> 
                 <IconButton
                    onClick={() => toggleshown1(el.employeeName)}
                  >
                    {data.includes(index)?(
                      <KeyboardArrowUpIcon />  
                    ) : (
                     <p><KeyboardArrowUpIcon /><b>{el.role}</b></p>   
                      
                    )}
                   
                  </IconButton>
                 
                  </p>
                 
                   <div className="additional-info">
                   {data.includes(el.employeeName) && (
                    <Box >
                     
                    <p>
                    <IconButton
                           onClick={() => toggleshown(el.userID)}
                         >
                           {datailsShown.includes(index)? (
                           
                              <KeyboardArrowUpIcon /> 
                            ) : (
                           <p><KeyboardArrowDownIcon /><b style={{ color: "#ff0000" }}>{el.disApprovedfiledDetails?.[0]?.isApproved}</b></p>
                          
                           )}
                           
                         </IconButton>
                         </p>
                          
                              
                             
                             {datailsShown.includes(el.userID) && (  
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
           el?.disApprovedfiledDetails?.map((el, i) => {
                      return (
                    
                           <tr >

                                <td>
                                  {i + 1}
                                </td>
                                <td>
                                  {/* <b>{el.name}</b> */}
                                  <Label style={{  fontSize:12}}>{t(el?.name)}</Label>
                                </td>
                                <td>
                                  <b>{el.value}</b>
                                </td>

                                <td>
                                  <b>{el.isApproved}</b>
                                </td>
                                <td>
                              
                                  <i>{<div dangerouslySetInnerHTML={{__html: el.remarks}}/>}</i>
                                </td>

                              </tr>
                                 );
                                })
                              ) : (
                                <p></p>
                              )}
                           </tbody>
                          </table>
                          )}  
                   <p> 
                        <IconButton
                           onClick={() => toggleshown3(el.designation)}
                         >
                           {dataFrist.includes(index)? (
                             <KeyboardArrowUpIcon /> 
                           ) : (
                             <p><KeyboardArrowDownIcon /><b style={{ color: "#2874A6"}}>{el.condApprovedfiledDetails?.[0]?.isApproved}</b></p>
                           )}
                         
                         </IconButton>
                         </p>
                         {dataFrist.includes(el.designation) && (      
                                <table colSpan = "3" className="table table-bordered" style={{ backgroundColor: "#ddf2cf" }}>
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
                                   {el?.condApprovedfiledDetails.map((el, i) => (
                                         <tr >
              
                                              <td>
                                                {i + 1}
                                              </td>
                                              <td>
                                                <b>{el.name}</b>
                                              </td>
                                              <td>
                                                <b>{el.value}</b>
                                              </td>
              
                                              <td>
                                                <b>{el.isApproved}</b>
                                              </td>
                                              <td>
                                          
                                                <i>{<div dangerouslySetInnerHTML={{__html: el.remarks}}/>}</i>
                                              </td>
              
                                            </tr>
                                               ))
                                              }
                                         </tbody>
                                      
                                        </table>
                              )}     
           <p> 
                                     <IconButton
                           onClick={() => toggleshown2(el.role)}
                         >
                           {dataTwo.includes(index)? (
                             <KeyboardArrowUpIcon /> 
                           ) : (
                            <p><KeyboardArrowDownIcon /><b style={{ color: "#09cb3d" }}>{el.approvedfiledDetails?.[0]?.isApproved}</b></p>
                           )}
                           
                         </IconButton>
                         </p>
                              
                              
                              {dataTwo.includes(el.role) && ( 
                                <table colSpan = "4" className="table table-bordered" style={{ backgroundColor: "#ddf2cf" }}>
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
                                   {el?.approvedfiledDetails.map((el, i) => (
                                         <tr >
              
                                              <td>
                                                {i + 1}
                                              </td>
                                              <td>
                                                <b>{el.name}</b>
                                              </td>
                                              <td>
                                                <b>{el.value}</b>
                                              </td>
              
                                              <td>
                                                <b>{el.isApproved}</b>
                                              </td>
                                              <td>
                                                
                                                <i>{<div dangerouslySetInnerHTML={{__html: el.remarks}}/>}</i>
                                              </td>
              
                                            </tr>
                                              ))
                                            }
                                         </tbody>
                                        </table>
                                         )}   

                   
                                          
                                         <p>
                    <IconButton
                           onClick={() => toggleshown4(el.applicationStatus)}
                         >
                           {dataThree.includes(index)? (
                           
                              <KeyboardArrowUpIcon /> 
                            ) : (
                           <p><KeyboardArrowDownIcon /><b style={{ color: "#ff0000" }}>{el.performaFieldDetail?.[0]?.isApproved}</b></p>
                          
                           )}
                           
                         </IconButton>
                         </p>
                          
                              
                             
                             {dataThree.includes(el.applicationStatus) && (  
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
                 
                     {el?.performaFieldDetail !== null ? (
           el?.performaFieldDetail?.map((el, i) => {
                      return (
                    
                           <tr >

                                <td>
                                  {i + 1}
                                </td>
                                <td>
                                  <b>{el.name}</b>
                                </td>
                                <td>
                                  <b>{el.value}</b>
                                </td>

                                <td>
                                  <b>{el.isApproved}</b>
                                </td>
                                <td>
                               
                                  <i>{<div dangerouslySetInnerHTML={{__html: el.remarks}}/>}</i>
                                </td>

                              </tr>
                                 );
                                })
                              ) : (
                                <p></p>
                              )}
                           </tbody>
                          </table>
                          )} 
                    
                        
                      <Row style={{ margin: 4 }}>
                      <b style={{ textAlign: "right", marginRight: 2 }}>{el.designation}</b>
                     <b style={{ textAlign: "right" }}>{el.employeeName}</b>
                     </Row>
                     <Row style={{ margin: 4 }}>

                     <b style={{ textAlign: "right" }}>{el.createdOn}</b>
                     <b style={{ textAlign: "right" }}>
             
                   </b>
                    </Row>
                      </Box>
                     )}
                        
                        </div>
      
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


        </Row>
        {/* </div>
        </Collapse> */}
        {/* <Row>

        <div class="histroryremarks">
          <div class="WhatsNewCard" style={{ backgroundColor: "#ddf2cf" }}>



            <div >
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


            </div>

          </div>
        </div>
      </Row> */}


    
      <br>
      </br>


    </Container>
  );
};

export default RevnueSection;
