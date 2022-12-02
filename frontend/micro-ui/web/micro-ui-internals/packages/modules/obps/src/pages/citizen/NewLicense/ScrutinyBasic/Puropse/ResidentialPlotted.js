import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { useForm } from "react-hook-form";
// import { tr, thead, TableContainer, td, tbody, Table, Paper } from '@material-ui/core';
// import AddIcon from "@material-ui/icons/Add";
// import DeleteIcon from "@material-ui/icons/Delete";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { useStyles } from "../css/personalInfoChild.style";
import ModalChild from "../Remarks/ModalChild";

const ResidentialPlottedForm = (props) => {

  const residentialData = props.residentialData;
  const dataIcons = props.dataForIcons;

  const { register, handleSubmit, formState: { errors } } = useForm([{ XLongitude: '', YLatitude: '' }]);
  const formSubmit = (data) => {
    console.log("data", data);
  };
  const [ResidentialPlottedFormSubmitted, SetResidentialPlottedFormSubmitted] = useState(false);
  const ResidentialPlottedFormSubmitHandler = (e) => {
    e.preventDefault();
    SetResidentialPlottedFormSubmitted(true);
  }

  const classes = useStyles();

  const [smShow, setSmShow] = useState(false);
  const [labelValue, setLabelValue] = useState("");
  const Colors = {
    approved: "#09cb3d",
    disapproved: "#ff0000",
    info: "#FFB602"
  }
  const [selectedFieldData, setSelectedFieldData] = useState();
  const [fieldValue, setFieldValue] = useState("");
  const [openedModal, setOpennedModal] = useState("")
  const [fieldIconColors, setFieldIconColors] = useState({
    npnlNo: Colors.info,
    npnlArea: Colors.info,
    ewsNo: Colors.info,
    ewsArea: Colors.info
  })

  const fieldIdList = [{ label: "NPNL No", key: "npnlNo" },{ label: "NPNL Area", key: "npnlArea" },{ label: "EWS No", key: "ewsNo" },{ label: "EWS Area", key: "ewsArea" },];


  const getColorofFieldIcon = () => {
    let tempFieldColorState = fieldIconColors;
    fieldIdList.forEach((item) => {
      if (dataIcons !== null && dataIcons !== undefined) {
        console.log("color method called");
        const fieldPresent = dataIcons.egScrutiny.filter(ele => (ele.fieldIdL === item.label));
        console.log("filteration value111", fieldPresent, fieldPresent[0]?.isApproved);
        if (fieldPresent && fieldPresent.length) {
          console.log("filteration value111", fieldPresent, fieldPresent[0]?.isApproved);
          tempFieldColorState = { ...tempFieldColorState, [item.key]: fieldPresent[0].isApproved ? Colors.approved : Colors.disapproved }

        }
      }
    })

    setFieldIconColors(tempFieldColorState);

  };


  useEffect(() => {
    getColorofFieldIcon();
    console.log("repeating1...",)
  }, [dataIcons])

  useEffect(() => {
    if (labelValue) {
      const fieldPresent = dataIcons.egScrutiny.filter(ele => (ele.fieldIdL === labelValue));
      setSelectedFieldData(fieldPresent[0]);
    } else {
      setSelectedFieldData(null);
    }
  }, [labelValue])



  const currentRemarks = (data) => {
    props.showTable({ data: data.data });
  };

  const handlemodaldData = (data) => {
    // setmodaldData(data.data);
    setSmShow(false);
    console.log("here", openedModal, data);
    if (openedModal && data) {
      setFieldIconColors({ ...fieldIconColors, [openedModal]: data.data.isApproved ? Colors.approved : Colors.disapproved })
    }
    setOpennedModal("");
    setLabelValue("");
  };

  return (
    <Form onSubmit={ResidentialPlottedFormSubmitHandler} style={{ display: props.displayResidential }}>
      <ModalChild
        labelmodal={labelValue}
        passmodalData={handlemodaldData}
        displaymodal={smShow}
        onClose={() => setSmShow(false)}
        selectedFieldData={selectedFieldData}
        fieldValue={fieldValue}
        remarksUpdate={currentRemarks}
      ></ModalChild>
      <Form.Group className="justify-content-center" controlId="formBasicEmail">
        <Row className="ml-auto" style={{ marginBottom: 5 }}>
          <Col col-12>
            <h6 className="text-black"><h5>Residential Plotted</h5></h6>

            <div className="table table-bordered table-responsive">
              <thead>
                <tr>
                  <td><h5>Detail of plots</h5></td>
                  <td ><h5>No.</h5></td>
                  <td ><h5>Area</h5></td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td >
                    <div className="px-2">
                      <p className="mb-2"><h5>NPNL
                      </h5></p>
                    </div>
                  </td>
                  <td align="right"> 
                  <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={residentialData?.npnl?.plotNo} />
                  <ReportProblemIcon
                          style={{
                            color: fieldIconColors.npnlNo
                          }}
                          onClick={() => {
                            setLabelValue("NPNL No"),
                              setOpennedModal("npnlNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(residentialData?.npnl?.plotNo);
                          }}
                        ></ReportProblemIcon>
                    </div> 
                  </td>
                  <td component="th" scope="row">
                    <div  className="d-flex flex-row align-items-center">
                    <input type="text" className="form-control" disabled placeholder={residentialData?.npnl?.area}/>
                    <ReportProblemIcon
                          style={{
                            color: fieldIconColors.npnlArea
                          }}
                          onClick={() => {
                            setLabelValue("NPNL Area"),
                              setOpennedModal("npnlArea")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(residentialData?.npnl?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td >
                    <div className="px-2">
                      <p className="mb-2"><h5>EWS

                      </h5></p>
                    </div>
                  </td>
                  <td align="right"> 
                  <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={residentialData?.ews?.plotNo}/>
                  <ReportProblemIcon
                          style={{
                            color: fieldIconColors.ewsNo
                          }}
                          onClick={() => {
                            setLabelValue("EWS No"),
                              setOpennedModal("ewsNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(residentialData?.ews?.plotNo);
                          }}
                        ></ReportProblemIcon>
                    </div> 
                  </td>
                  <td component="th" scope="row">
                  <div  className="d-flex flex-row align-items-center">
                    <input type="text" className="form-control" disabled placeholder={residentialData?.ews?.area}/>
                    <ReportProblemIcon
                          style={{
                            color: fieldIconColors.ewsArea
                          }}
                          onClick={() => {
                            setLabelValue("EWS Area"),
                              setOpennedModal("ewsArea")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(rresidentialData?.ews?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                  </td>
                </tr>
              </tbody>
            </div>
          </Col>
        </Row>
      </Form.Group>
    </Form>)
};
export default ResidentialPlottedForm;
