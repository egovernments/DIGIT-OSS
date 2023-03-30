import React, { useState } from "react";
import { Button } from "@material-ui/core";
import FormControl from "@mui/material/FormControl";
import { useForm } from "react-hook-form";
import OutlinedInput from "@mui/material/OutlinedInput";

function CompositionClu() {
  const {
    register,
    handleSubmit,
    formState: { error },
  } = useForm([{ Sr: "", Name: "", Mobile: "", Email: "", PAN: "", Aadhar: "" }]);
  const formSubmit = (data) => {
    console.log("data", data);
  };
  const [showhide, setShowhide] = useState("No");
  const handleshow = (e) => {
    const getshow = e.target.value;
    setShowhide(getshow);
  };

  const compositionClu = (data) => console.log(data);
  const [noofRows, setNoOfRows] = useState(1);

  return (
    <form onSubmit={handleSubmit(compositionClu)}>
      <div className="card" style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Composition of urban Area Violation in CLU</h4>
        <div className="card">
          <div className="row-12">
            <div className="col md={4} xxl lg-4">
              <FormControl>
                <h2 className="FormLable">Name of original land owner </h2>{" "}
                <OutlinedInput type="number" placeholder="" className="Inputcontrol" {...register("originalLand")} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable"> Land holding of above </h2>{" "}
                <OutlinedInput type="text" placeholder="" className="Inputcontrol" {...register("landHolding")} />
              </FormControl>
            </div>
          </div>
          <br></br>
          <div className="row-12">
            <div class="bordere">
              <p>
                <h2>
                  <b> Total land sold in parts</b>{" "}
                </h2>{" "}
              </p>
              <div className="table table-bordered table-responsive">
                <thead>
                  <tr>
                    <th colSpan="3" className="fw-normal" style={{ textAlign: "center" }}>
                      {" "}
                      Area of parts in sq. meters
                    </th>
                  </tr>
                  <tr>
                    <th className="fw-normal">Sr.No</th>
                    <th className="fw-normal">Khasra No</th>
                    <th className="fw-normal">Area </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="fw-normal">1</th>
                    <td>
                      <input type="text" placeholder="" className="form-control" {...register("areaParts")} />
                    </td>
                    <td>
                      <input type="text" placeholder="" className="form-control" {...register("srNo")} />
                    </td>
                  </tr>
                  <tr>
                    <th className="fw-normal">2</th>
                    <td>
                      <input type="text" placeholder="" className="form-control" {...register("khasraNo")} />
                    </td>
                    <td>
                      <input type="text" placeholder="" className="form-control" {...register("area")} />
                    </td>
                  </tr>
                  {[...Array(noofRows)].map((elementInArray, input) => {
                    return (
                      <tr>
                        <td>
                          <input type="text" placeholder="" />
                        </td>
                        <td>
                          <input type="text" placeholder="" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </div>
            </div>
            <div>
              <button type="button" style={{ float: "left" }} className="btn btn-primary" onClick={() => setNoOfRows(noofRows + 1)}>
                Add more
              </button>
              <button type="button" style={{ float: "right" }} className="btn btn-danger" onClick={() => setNoOfRows(noofRows - 1)}>
                Delete
              </button>
            </div>
          </div>
          <br></br>
          <div className="row-12">
            <div className="col md={4} xxl lg-4">
              <FormControl>
                <h2 className="FormLable"> Total Area in Sq. meter</h2>{" "}
                <OutlinedInput type="number" className="Inputcontrol" placeholder="" {...register("totalArea")} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable"> Explain the reason for the violation</h2>{" "}
                <OutlinedInput type="number" className="Inputcontrol" placeholder="" rows="3" {...register("violationReason")} />
              </FormControl>
            </div>
          </div>
          <br></br>
          <div className="table table-bordered table-responsive">
            <thead>
              <tr>
                <th className="fw-normal">Sr.No</th>
                <th className="fw-normal">Field Name</th>
                <th className="fw-normal">Upload Documents</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="fw-normal">1</th>
                <td>Date of sale deeds.</td>
                <td>
                  <input type="file" className="form-control" placeholder="" {...register("dateOfSaleDeed")} />
                </td>
              </tr>

              <tr>
                <th className="fw-normal">2</th>
                <td>
                  Any other.<span style={{ color: "red" }}>*</span>
                </td>
                <td>
                  <input type="file" className="form-control" placeholder="" {...register("anyOther")} />
                </td>
              </tr>
            </tbody>
          </div>

          <div class="col-sm-12 text-right">
            <Button variant="contained" class="btn btn-primary btn-md center-block" aria-label="right-end">
              Save as Draft{" "}
            </Button>
            &nbsp;
            <Button variant="contained" class="btn btn-primary btn-md center-block" type="submit">
              Submit
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default CompositionClu;
