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

const DDJAYForm = (props) => {


  const DDJAYFormSubmitHandler = (e) => {
    e.preventDefault();
    SetDdjayFormSubmitted(true);
  }

  const ddjayData = props.data;
  const dataIcons = props.dataForIcons;

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
      frozenPlotNo: Colors.info,
      frozenPlotArea: Colors.info,
      layoutPlan: Colors.info,
      areaOfPocket: Colors.info
  })

  const fieldIdList = [{ label: "Details of frozen plots (50%) No.", key: "frozenPlotNo" },{ label: "Details of frozen plots (50%) Area", key: "frozenPlotArea" },{ label: "Whether one organizes open space/pocket of min area 0.3 acre proposed in the layout plan", key: "layoutPlan" },{ label: "Area of such Pocket (in acres)", key: "areaOfPocket" }];


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
    <Form onSubmit={DDJAYFormSubmitHandler} style={{ display: props.displayDdjay }}>
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
            <h5 className="text-black"><h5>Deen Dayal Jan Awas Yojna (DDJAY):-</h5></h5>

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
                      <p className="mb-2" ><h5>Details of frozen plots (50%)
                      </h5></p>
                    </div>
                  </td>
                  <td align="right">
                  <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={ddjayData?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(ddjayData?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                    </td>
                  <td component="th" scope="row">
                    <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={ddjayData?.frozenArea}/>
                    <ReportProblemIcon
                          style={{
                            color: fieldIconColors.frozenPlotArea
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) Area"),
                              setOpennedModal("frozenPlotArea")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(ddjayData?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                    
                  </td>
                </tr>
              </tbody>
            </div>

            <br></br>
            <div className="row">
              <div className="col col-12">
                <h6><h5> Whether one organizes open space/pocket of min area 0.3 acre proposed in the layout plan (Yes/No)</h5>&nbsp;&nbsp;


                  <input type="radio" value="Yes"   checked={ddjayData?.organize==="Y"?true:false} disabled />&nbsp;&nbsp;
                  <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;

                  <input type="radio" value="No"   checked={ddjayData?.organize==="N"?true:false} disabled />&nbsp;&nbsp;
                  <label className="m-0 mx-2" for="No">No</label>
                          
                  <ReportProblemIcon
                          style={{
                            color: fieldIconColors.layoutPlan
                          }}
                          onClick={() => {
                            setLabelValue("Whether one organizes open space/pocket of min area 0.3 acre proposed in the layout plan"),
                              setOpennedModal("layoutPlan")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(ddjayData?.minArea==="Y"?"Yes":ddjayData?.organize==="N"?"No":null);
                          }}
                        ></ReportProblemIcon>


                  </h6>
                {
                  ddjayData?.organize==="Y" && (
                    <div className="row " >
                      <div className="col col-6">
                        <label for="parentLicense" className="font-weight-bold">Area of such Pocket (in acres)</label>
                        <div>
                        <input type="text" className="form-control" placeholder={data?.organizeArea}  disabled />
                        <ReportProblemIcon
                          style={{
                            color: fieldIconColors.areaOfPocket
                          }}
                          onClick={() => {
                            setLabelValue("Area of such Pocket (in acres)"),
                              setOpennedModal("areaOfPocket")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(data?.organizeArea);
                          }}
                        ></ReportProblemIcon>
                        </div>
                      </div>

                    </div>

                  )
                }
              </div>
            </div>
          </Col>
        </Row>
      </Form.Group>
    </Form>)
};
export default DDJAYForm;
