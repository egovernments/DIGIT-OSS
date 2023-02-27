import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
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
        const tempArray = remarkDataResp.filter((ele) => ele.isApproved === false)
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
  // const [applicationId, setApplicationId] = useState("");
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
        <div class="currentremarks">
          <div class="WhatsNewCard" style={{ backgroundColor: "#ddf2cf" }}>
            <p class="text-center" ><h4>Current Remarks</h4></p>
            <Row>

              <Col>
                <b>Application Id.</b>
                {remarkDataResp?.[0]?.applicationId}
              </Col>
              {/* <Col>
              <b>Service Id.</b>
              {remarkDataResp?.[0]?.bussinessServiceName}
            </Col>
            <Col>
              <b> Diary No.</b>
              {remarkDataResp?.[0]?.bussinessServiceName}
            </Col> */}
            </Row>
            <Row>

              <Col>
                <b>Field Name</b>

              </Col>
              <Col>
                <b>Field value</b>

              </Col>
              <Col>
                <b> Status</b>

              </Col>

            </Row>

            {remarkDataResp !== null ? (
              remarkDataResp.map((el, i) => {
                return (

                  <div>
                    <hr style={{ marginTop: 5, marginBottom: 5 }}></hr>
                    {/* <Row>
                  <Col>
                      <b>{el.applicationId}</b>
                    </Col>
                    <Col>
                      {" "}
                      <b>{el.bussinessServiceName}</b>
                    </Col>
                    <Col>
                     
                      
                   
                    </Col>
                  </Row> */}

                    <Row>
                      <Col>
                        <b>{el.fieldIdL}</b>
                      </Col>
                      <Col>
                        {" "}
                        <b>{el.fieldValue}</b>
                      </Col>
                      <Col>

                        <b>{el.isApproved}</b>

                      </Col>
                    </Row>


                    <Row>
                      <p style={{margin: 5 }}><b>Remarks:</b></p>
                      <p>
                      <i>{el.comment}</i>
                      </p>
                    </Row>

                    <Row style={{ margin: 4 }}>
                    <b style={{ textAlign: "right" }}>{el.employeeName}</b>
                    <b style={{ textAlign: "right" ,marginRight:2}}>{el.designation}</b>
                      {/* <b style={{ textAlign: "right" }}>{el.userid}</b>
                       */}
                    </Row>

                    <Row style={{ margin: 4 }}>
                      <b style={{ textAlign: "right" }}>
                        {new Date(el.ts).toLocaleDateString("en-GB")} {new Date(el.ts).toLocaleTimeString("en-US")}
                      </b>
                    </Row>
                  </div>
                );
              })
            ) : (
              <p></p>
            )}
          </div>
        </div>
        <div class="histroryremarks">
          <div class="WhatsNewCard" style={{ backgroundColor: "#ddf2cf" }}>



            <div >
              <p class="text-center" ><h4>History Remarks</h4></p>
              {histeroyData?.data?.processInstances?.map((item, index) => (
                <div key={index}>
                  <hr style={{ marginTop: 5, marginBottom: 5 }}></hr>
                  {/* {index} */}
                  {item.comment}
                  <div className="text-right">
                    {/* {item?.assigner?.map((item, index) => ( */}
                    <div class="font-weight-bold">
                      {item?.assigner?.name}
                    </div>
                    {/* ))
              } */}
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
                        {/* {item?.fileStoreId} */}
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
      </Row>

      {/* {JSON.stringify(userRoles)}
      {JSON.stringify(showRemarksSection)} */}

      {
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
      }


    </Container>
  );
};

export default ScrutinyDevelopment;
