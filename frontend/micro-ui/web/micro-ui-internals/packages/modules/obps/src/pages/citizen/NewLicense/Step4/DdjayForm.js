import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useForm } from "react-hook-form";
// import { tr, thead, TableContainer, td, tbody, Table, Paper } from '@material-ui/core';
// import AddIcon from "@material-ui/icons/Add";
// import DeleteIcon from "@material-ui/icons/Delete";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
// import CalculateIcon from '@mui/icons-material/Calculate';

const DDJAYForm = (props) => {
  const formSubmit = (data) => {
    console.log("data", data);
  };
  const [DdjayFormSubmitted, SetDdjayFormSubmitted] = useState(false);
  const DDJAYFormSubmitHandler = async (data) => {
    SetDdjayFormSubmitted(true);
  };
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
    setValue,
    reset,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onBlur",
    // resolver: yupResolver(VALIDATION_SCHEMA),
    shouldFocusError: true,
  });
  const handleChange = (e) => {
    this.setState({ isRadioSelected: true });
  };
  useEffect(() => {
    if (DdjayFormSubmitted) {
      props.DdjayFormSubmit(true);
    }
  }, [DdjayFormSubmitted]);

  return (
    <form onSubmit={handleSubmit(DDJAYFormSubmitHandler)} style={{ display: props.displayDdjay }}>
      <Form.Group className="justify-content-center" controlId="formBasicEmail">
        <Row className="ml-auto" style={{ marginBottom: 5 }}>
          <Col col-12>
            <h5 className="text-black">Deen Dayal Jan Awas Yojna (DDJAY):-</h5>

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
                      <p className="mb-2">Details of frozen plots (50%)</p>
                    </div>
                  </td>
                  <td align="right">
                    {" "}
                    <input type="number" className="form-control" {...register("frozenNo")} />
                  </td>
                  <td component="th" scope="row">
                    <input type="number" className="form-control" {...register("frozenArea")} />
                  </td>
                </tr>
              </tbody>
            </div>

            <br></br>
            <div className="row">
              <div className="col col-12">
                <h6>
                  {" "}
                  Whether one organizes open space/pocket of min area 0.3 acre proposed in the layout plan (Yes/No)&nbsp;&nbsp;
                  <input type="radio" value="Yes" id="Yes" {...register("organizeSpace")} name="Yes" />
                  &nbsp;&nbsp;
                  <label className="m-0  mx-2" for="Yes">
                    Yes
                  </label>
                  &nbsp;&nbsp;
                  <input type="radio" value="No" id="No" {...register("organizeSpace")} name="Yes" />
                  &nbsp;&nbsp;
                  <label className="m-0 mx-2" for="No">
                    No
                  </label>
                </h6>
                {watch("organizeSpace") === "yes" && (
                  <div className="row ">
                    <div className="col col-6">
                      <label>Area of such Pocket (in acres)</label>
                      <input type="text" className="form-control" {...register("organizeArea")} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Form.Group>
    </form>
  );
};
export default DDJAYForm;
