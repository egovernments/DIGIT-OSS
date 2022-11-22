import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useForm } from "react-hook-form";
// import { tr, thead, TableContainer, td, tbody, Table, Paper } from '@material-ui/core';
// import AddIcon from "@material-ui/icons/Add";
// import DeleteIcon from "@material-ui/icons/Delete";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
// import CalculateIcon from '@mui/icons-material/Calculate';

const ResidentialPlottedForm = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm([{ XLongitude: "", YLatitude: "" }]);
  const formSubmit = (data) => {
    console.log("data", data);
  };
  const [ResidentialPlottedFormSubmitted, SetResidentialPlottedFormSubmitted] = useState(false);
  const ResidentialPlottedFormSubmitHandler = (e) => {
    e.preventDefault();
    SetResidentialPlottedFormSubmitted(true);
  };

  const handleChange = (e) => {
    this.setState({ isRadioSelected: true });
  };
  useEffect(() => {
    if (ResidentialPlottedFormSubmitted) {
      props.ResidentialPlottedFormSubmit(true);
    }
  }, [ResidentialPlottedFormSubmitted]);

  return (
    <Form onSubmit={ResidentialPlottedFormSubmitHandler} style={{ display: props.displayResidential }}>
      <Form.Group className="justify-content-center" controlId="formBasicEmail">
        <Row className="ml-auto" style={{ marginBottom: 5 }}>
          <Col col-12>
            <h6 className="text-black">Residential Plotted</h6>

            <div className="table table-bordered table-responsive">
              <thead>
                <tr>
                  <td>Detail of plots</td>
                  <td>No.</td>
                  <td>Area</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="px-2">
                      <p className="mb-2">NPNL</p>
                    </div>
                  </td>
                  <td align="right">
                    {" "}
                    <input type="number" className="form-control" />
                  </td>
                  <td component="th" scope="row">
                    <input type="text" className="form-control" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="px-2">
                      <p className="mb-2">EWS</p>
                    </div>
                  </td>
                  <td align="right">
                    {" "}
                    <input type="number" className="form-control" />
                  </td>
                  <td component="th" scope="row">
                    <input type="text" className="form-control" />
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
export default ResidentialPlottedForm;
