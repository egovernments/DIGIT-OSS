// import React, { useState, useEffect } from "react";
// import { Row, Col, Card, Container, Form, Button } from "react-bootstrap";

// const windowHeight = window !== undefined ? window.innerHeight : null;
// const Records = (props) => {

//   return (
//     <Container>
//       <Row>
//     <Card style={{overflow:"scroll"}}>
//       <Card.Header>
//         <Card.Title style={{ fontFamily: "Roboto", fontSize: 30, fontWeight: "bold" }}>{/* Disapproval List */}</Card.Title>
//       </Card.Header>
//       <Card.Body style={{ overflowY: "auto", height: 350, maxWidth: "100%", border: "soild" }}>
//         <Form>
//           <h2 style={{ fontFamily: "Roboto", fontSize: 18, fontWeight: "bold", marginBottom: 2 }}></h2>
//           {/* <Row>
//             <Col xxl lg="1">
//               <h5 style={{ textAlign: "center" }} className="fw-bold">
//                 Sr. No.
//               </h5>
//             </Col>
//             <Col xxl lg="3">
//               <h5 style={{ textAlign: "center" }} className="fw-bold">
//                 Field Name
//               </h5>
//             </Col>
//             <Col xxl lg="3">
//               <h5 style={{ textAlign: "center" }} className="fw-bold">
//                 Status
//               </h5>
//             </Col>
//             <Col xxl lg="5">
//               <h5 style={{ textAlign: "center" }} className="fw-bold">
//                 Remark
//               </h5>
//             </Col>
//           </Row> */}

// <div  class="dataTables_wrapper dt-bootstrap4 bg-white border rounded p-2" id="datatables-basics_wrapper">
//         <table id="datatables-basics" class="table table-striped table-bordered table-responsive" >
//             <thead>
//                 <tr>
//                     <th>Sr. No.</th>
//                     <th>Mode</th>
//                     <th>Case ID/ Application No.</th>
//                     <th>Diary No.</th>
//                     <th>Case Status Activity</th>
//                     <th>Subject</th>
//                     <th>Preview Developer Details</th>
//                     <th>Preview Application</th>
//                     <th>Application Date</th>
//                     <th>Aging</th>
//                     <th>Aging with User</th>
//                     <th>Sender</th>
//                     <th>Time Consumed(%)</th>
//                     <th>Physical FIle Recieved</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 <tr>
//                     <td>1</td>
//                     <td class="text-center"><span class="badge badge-warning">TCP</span></td>
//                     <td>LC-4108A</td>
//                     <td>TCP-OFA/2510/2020</td>
//                     <td></td>
//                     <td>New Licence Application For Area 4046.86 SqMtrs, Purpose: Commercial, Activity: Dhaba </td>
//                     <td class="text-center"><button class="btn btn-info" ><i class="fa fa-eye"></i></button></td>
//                     <td class="text-center"><button class="btn btn-info" ><i class="fa fa-eye"></i></button></td>
//                     <td>28/08/2020</td>
//                     <td>22</td>
//                     <td>22</td>
//                     <td></td>
//                     <td class="text-center"><span class="badge badge-secondary"><b>8%</b></span></td>
//                     <td class="text-center"><span class="badge badge-warning"><i class="fa fa-file"></i>&nbsp; Mark File</span></td>
//                 </tr>
//                 <tr>
//                     <td>2</td>
//                     <td class="text-center"><span class="badge badge-warning">TCP</span></td>
//                     <td>LC-4118A</td>
//                     <td>TCP-OFA/2520/2020</td>
//                     <td></td>
//                     <td>New Licence Application For Area 3234.67 SqMtrs, Purpose: Commercial, Activity: Automobile </td>
//                     <td class="text-center"><button class="btn btn-info" ><i class="fa fa-eye"></i></button></td>
//                     <td class="text-center"><button class="btn btn-info" ><i class="fa fa-eye"></i></button></td>
//                     <td>17/08/2020</td>
//                     <td>1</td>
//                     <td>1</td>
//                     <td></td>
//                     <td class="text-center"><span class="badge badge-secondary"><b>23%</b></span></td>
//                     <td class="text-center"><span class="badge badge-warning"><i class="fa fa-file"></i>&nbsp; Mark File</span></td>
//                 </tr>
                
//             </tbody>
//         </table>
//     </div>
          
//         </Form>
//       </Card.Body>
//       <Card.Footer></Card.Footer>
//     </Card>
//     </Row>
//     </Container>
  
//   );
// }


// export default Records;

import React from "react";
import { Row, Col, Card, Container, Form, Button } from "react-bootstrap";
import VisibilityIcon from "@mui/icons-material/Visibility";


const windowHeight = window !== undefined ? window.innerHeight : null;
const Records = (props) => {
  return (
    <Container
      className="justify-content-center"
      style={{
        // top: windowHeight * 0.3,
        // minWidth: "90%",
        maxWidth: "100%",
        height: 340 ,
        // maxHeight: "100%",
        padding:0 ,
      }}
    >
      {/* <Row> */}
        <Card>
          
          <Card.Body style={{ overflowY: "auto", height: 320 , maxWidth: "60%", backgroundColor: "#C6C6C6" ,   padding:0 }}>
            <Form>
            <div >
        <table id="datatables-basics" class="table table-striped table-bordered table-responsive" >
            <thead>
                <tr>
                    <th>Sr. No.</th>
                    <th>Mode</th>
                    <th>Case ID/ Application No.</th>
                    <th>Diary No.</th>
                    <th>Case Status Activity</th>
                    <th>Subject</th>
                    <th>Preview Developer Details</th>
                    <th>Preview Application</th>
                    <th>Application Date</th>
                    <th>Aging</th>
                    <th>Aging with User</th>
                    <th>Sender</th>
                    <th>Time Consumed(%)</th>
                    <th>Physical FIle Recieved</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td class="text-center"><span class="badge badge-warning">TCP</span></td>
                    <td>LC-4108A</td>
                    <td>TCP-OFA/2510/2020</td>
                    <td></td>
                    <td>New Licence Application For Area 4046.86 SqMtrs, Purpose: Commercial, Activity: Dhaba </td>
                    <td class="text-center"><button class="btn btn-info" >
                                
                            <i class="fa fa-eye"><VisibilityIcon color="info" className="icon" /></i></button></td>
                    <td class="text-center"><button class="btn btn-info" ><i class="fa fa-eye"><VisibilityIcon color="info" className="icon" /></i></button></td>
                    <td>28/08/2020</td>
                    <td>22</td>
                    <td>22</td>
                    <td></td>
                    <td class="text-center"><span class="badge badge-secondary"><b>8%</b></span></td>
                    <td class="text-center"><span class="badge badge-warning"><i class="fa fa-file"></i>&nbsp; Mark File</span></td>
                </tr>
                <tr>
                    <td>2</td>
                    <td class="text-center"><span class="badge badge-warning">TCP</span></td>
                    <td>LC-4118A</td>
                    <td>TCP-OFA/2520/2020</td>
                    <td></td>
                    <td>New Licence Application For Area 3234.67 SqMtrs, Purpose: Commercial, Activity: Automobile </td>
                    <td class="text-center"><button class="btn btn-info" ><VisibilityIcon color="info" className="icon" /><i class="fa fa-eye"></i></button></td>
                    <td class="text-center"><button class="btn btn-info" ><VisibilityIcon color="info" className="icon" /><i class="fa fa-eye"></i></button></td>
                    <td>17/08/2020</td>
                    <td>1</td>
                    <td>1</td>
                    <td></td>
                    <td class="text-center"><span class="badge badge-secondary"><b>23%</b></span></td>
                    <td class="text-center"><span class="badge badge-warning"><i class="fa fa-file"></i>&nbsp; Mark File</span></td>
                </tr>
                
            </tbody>
        </table>
    </div>
            </Form>
          </Card.Body>
       
        </Card>
      {/* </Row> */}
    </Container>
  );
};

export default Records;
