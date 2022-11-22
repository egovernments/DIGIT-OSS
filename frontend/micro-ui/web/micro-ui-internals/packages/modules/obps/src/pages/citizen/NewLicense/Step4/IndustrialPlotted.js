import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useForm } from "react-hook-form";
// import { tr, thead, TableContainer, td, tbody, Table, Paper } from '@material-ui/core';
// import AddIcon from "@material-ui/icons/Add";
// import DeleteIcon from "@material-ui/icons/Delete";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
// import CalculateIcon from '@mui/icons-material/Calculate';

const IndustrialPlottedForm = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm([{ XLongitude: "", YLatitude: "" }]);
  const formSubmit = (data) => {
    console.log("data", data);
  };
  const [IndustrialPlottedFormSubmitted, SetIndustrialPlottedFormSubmitted] = useState(false);
  const IndustrialPlottedFormSubmitHandler = (e) => {
    e.preventDefault();
    SetIndustrialPlottedFormSubmitted(true);
  };

  const handleChange = (e) => {
    this.setState({ isRadioSelected: true });
  };
  useEffect(() => {
    if (IndustrialPlottedFormSubmitted) {
      props.IndustrialPlottedFormSubmit(true);
    }
  }, [IndustrialPlottedFormSubmitted]);

  return (
    <Form onSubmit={IndustrialPlottedFormSubmitHandler} style={{ display: props.displayIndustrial }}>
      <Form.Group className="justify-content-center" controlId="formBasicEmail">
        <Row className="ml-auto" style={{ marginBottom: 5 }}>
          <Col col-12>
            <h5 className="text-black">Industrial Plotted:-</h5>

            <div className="table table-bordered table-responsive">
              <thead>
                <tr>
                  <td>Detail of plots</td>
                  <td>No.</td>
                  <td>Area in Acres</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="px-2">
                      <p className="mb-2">Area of the colony, Up to 50 acres</p>
                    </div>
                  </td>
                  <td align="right">
                    {" "}
                    <input type="number" className="form-control" />
                  </td>
                  <td component="th" scope="row">
                    <input type="number" className="form-control" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="px-2">
                      <p className="mb-2">More than 50 to 200 acres </p>
                    </div>
                  </td>
                  <td align="right">
                    {" "}
                    <input type="number" className="form-control" />
                  </td>
                  <td component="th" scope="row">
                    <input type="number" className="form-control" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="px-2">
                      <p className="mb-2">More than 200 acres </p>
                    </div>
                  </td>
                  <td align="right">
                    {" "}
                    <input type="number" className="form-control" />
                  </td>
                  <td component="th" scope="row">
                    <input type="number" className="form-control" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="px-2">
                      <p className="mb-2">Proposed plots under residential component DDJAY </p>
                    </div>
                  </td>
                  <td align="right">
                    {" "}
                    <input type="number" className="form-control" />
                  </td>
                  <td component="th" scope="row">
                    <input type="number" className="form-control" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="px-2">
                      <p className="mb-2">Proposed plots under community facilities in DDJAY Area </p>
                    </div>
                  </td>
                  <td align="right">
                    {" "}
                    <input type="number" className="form-control" />
                  </td>
                  <td component="th" scope="row">
                    <input type="number" className="form-control" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="px-2">
                      <p className="mb-2">Details of plots for Labour dormitories from affordable Industries Housing component </p>
                    </div>
                  </td>
                  <td align="right">
                    {" "}
                    <input type="number" className="form-control" />
                  </td>
                  <td component="th" scope="row">
                    <input type="number" className="form-control" />
                  </td>
                </tr>
              </tbody>
            </div>
          </Col>
        </Row>
      </Form.Group>
    </Form>
  );
};
export default IndustrialPlottedForm;
