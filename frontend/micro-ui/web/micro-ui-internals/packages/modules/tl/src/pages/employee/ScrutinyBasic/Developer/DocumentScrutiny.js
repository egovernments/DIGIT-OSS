import React, { useEffect, useState } from "react";
import { Row, Col, Card, Container, Form, Button } from "react-bootstrap";
import Collapse from "react-bootstrap/Collapse";
import AddIcon from "@mui/icons-material/Add";
// import CancelIcon from "@mui/icons-material/Cancel";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import AddIcon from "@mui/icons-material/Add";
// import ModalChild from "../Remarks/ModalChild";
// import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import RemoveIcon from "@mui/icons-material/Remove";
// import { useStyles } from "../css/personalInfoChild.style";
// import Visibility from "@mui/icons-material/Visibility";
// import FileDownload from "@mui/icons-material/FileDownload";

const windowHeight = window !== undefined ? window.innerHeight : null;
const [open, setOpen] = useState(false);
const DocumentScrutiny = (props) => {
  return (
    <div>
     
      <div
        className="collapse-header"
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
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
        <span style={{ color: "#817f7f", fontSize: 14 }} className="">
          - Documents
        </span>
        {open ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>

     
      
      <Collapse in={open}>
        <div id="example-collapse-text">
          {/* <Container className="justify-content-center"  style={{

                            top:windowHeight*0.3,
                            minWidth:"40%",
                            maxWidth:"45%"}}> */}
          <Row>
            <Card>
              <Card.Header>
                <Card.Title style={{ fontFamily: "Roboto", fontSize: 30, fontWeight: "bold" }}>Licensee Document Details</Card.Title>
              </Card.Header>
              <Card.Body style={{ overflowY: "auto", height: 250, backgroundColor: "#C6C6C6" }}>
                <Form>
                  <div>
                    <table class="table table-bordered">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">First</th>
                          <th scope="col">Last</th>
                          <th scope="col">Handle</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">1</th>
                          <td>Mark</td>
                          <td>Otto</td>
                          <td>@mdo</td>
                        </tr>
                        <tr>
                          <th scope="row">2</th>
                          <td>Jacob</td>
                          <td>Thornton</td>
                          <td>@fat</td>
                        </tr>
                        <tr>
                          <th scope="row">3</th>
                          <td colspan="2">Larry the Bird</td>
                          <td>@twitter</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Form>
              </Card.Body>
              <Card.Footer>
                <div style={{ position: "relative", float: "right" }}>
                  <Button>Submit</Button>
                </div>
              </Card.Footer>
            </Card>
          </Row>

          {/* </Container> */}
        </div>
      </Collapse>
    </div>
  );
};

export default DocumentScrutiny;
