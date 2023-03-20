
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

import {  Box,
  Collapse,
  } from "@mui/material";

// import { Scrollbars } from 'react-custom-scrollbars';



const windowHeight = window !== undefined ? window.innerHeight : null;
const ScrutinyDevelopment = (props) => {


  const { handleGetFiledsStatesById, handleGetRemarkssValues } = useContext(ScrutinyRemarksContext);
  const { id } = useParams();
  let user = Digit.UserService.getUser();
  const userRoles = user?.info?.roles?.map((e) => e.code);
  const showRemarksSection = userRoles.includes("DTCP_HR")
  const histeroyData = props.histeroyData

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
console.log("log123Disrenu" ,id);
  return (
    <Container
      className="justify-content-center"
      style={{
        top: windowHeight * 0.3,
        minWidth: "90%",
        maxWidth: "98%",
        maxHeight: "50%",
        minHeight: "40%",
        marginTop: 5,
      }}
    >
      <Row class="remarkshelp">
        <div 
        // class="currentremarks"
         >
          <div class="WhatsNewCard" style={{ backgroundColor: "#ddf2cf" }}>
            <p class="text-center" ><h4>Current Remarks</h4></p>
            <Row>

              <Col>
                <b>Application Id.</b>
                {id}
              </Col>
            </Row>
            {/* <Row>

              <Col>
                <b>Field Name</b>

              </Col>
              <Col>
                <b>Field value</b>

              </Col>
              <Col>
                <b> Status</b>

              </Col>

            </Row> */}


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
                                  <b>{el.name}</b>
                                </td>
                                <td>
                                  <b>{el.value}</b>
                                </td>

                                <td>
                                  <b>{el.isApproved}</b>
                                </td>
                                <td>
                                  <i>{el.remarks}</i>
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
                                                <i>{el.remarks}</i>
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
                                                <i>{el.remarks}</i>
                                              </td>
              
                                            </tr>
                                              ))
                                            }
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
                     {/* {new Date(el.createdOn).toLocaleDateString("en-GB")} {new Date(el.ts).toLocaleTimeString("en-US")} */}
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

        {/* <div class="histroryremarks">
          <div class="WhatsNewCard" style={{ backgroundColor: "#ddf2cf" }}>



            <div >
              <p class="text-center" ><h4>History Remarks</h4></p>
              {histeroyData?.data?.processInstances?.map((item, index) => (
                <div key={index}>
                  <hr style={{ marginTop: 5, marginBottom: 5 }}></hr>
                  
                  {item.comment}
                  <div className="text-right">
                   
                    <div class="font-weight-bold">
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
        </div> */}
      </Row>


      {/* {JSON.stringify(userRoles)}
      {JSON.stringify(showRemarksSection)} */}

      {/* {
        showRemarksSection &&
        <TableContainer component={Paper} style={{ marginTop: 20 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Field</TableCell>
                <TableCell align="right">Remark</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {disapprovedList.map((row, i) => (
                <TableRow
                  key={row?.fieldIdL}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.fieldIdL}
                  </TableCell>
                  <TableCell align="right">{row.comment}</TableCell>
                  <TableCell align="right">
                    <Checkbox
                      checked={row?.isLOIPart}
                      onChange={(e) => onAction(row, i, e.target.checked)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      } */}
      <br>
      </br>


    </Container>
  );
};

export default ScrutinyDevelopment;
