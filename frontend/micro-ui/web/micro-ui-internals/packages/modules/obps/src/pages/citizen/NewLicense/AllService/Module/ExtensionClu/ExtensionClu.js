import React, { useState } from "react";
import { Button } from "@material-ui/core";
import FormControl from "@mui/material/FormControl";
import { useForm } from "react-hook-form";
import OutlinedInput from "@mui/material/OutlinedInput";

function ExtensionClu() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({});

  const extensionClu = (data) => console.log(data);
  return (
    <form onSubmit={handleSubmit(extensionClu)}>
      <div className="card" style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Extension of CLU permission</h4>
        <div className="card">
          <div className="row-12">
            <div className="col md={4} xxl lg-4">
              <FormControl>
                <h2 className="FormLable">
                  Case No.<span style={{ color: "red" }}>*</span>
                </h2>

                <OutlinedInput type="number" className="Inputcontrol" placeholder="" {...register("caseNo")} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">
                  {" "}
                  Application Number <span style={{ color: "red" }}>*</span>
                </h2>

                <OutlinedInput type="number" className="Inputcontrol" placeholder="" {...register("applicationNo")} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">
                  {" "}
                  Nature (land Use) Purpose <span style={{ color: "red" }}>*</span>
                </h2>

                <OutlinedInput type="number" className="Inputcontrol" placeholder="" {...register("naturePurpose")} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">
                  {" "}
                  Total Area in Sq. meter. <span style={{ color: "red" }}>*</span>
                </h2>
                <OutlinedInput type="number" className="Inputcontrol" placeholder="" {...register("totalAreaSq")} />
              </FormControl>
            </div>
          </div>
          <br></br>
          <div className="row-12">
            <div className="col md={4} xxl lg-4">
              <FormControl>
                <h2 className="FormLable">
                  {" "}
                  Date Of CLU
                  <span style={{ color: "red" }}>*</span>
                </h2>

                <OutlinedInput type="number" className="Inputcontrol" placeholder="" {...register("cluDate")} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">
                  {" "}
                  Date of Expiry of CLU
                  <span style={{ color: "red" }}>*</span>
                </h2>
                <OutlinedInput type="number" className="Inputcontrol" placeholder="" {...register("expiryClu")} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">
                  {" "}
                  Stage of construction <span style={{ color: "red" }}>*</span>
                </h2>

                <OutlinedInput type="number" className="Inputcontrol" placeholder="" {...register("stageConstruction")} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">
                  {" "}
                  Name of applicantName <span style={{ color: "red" }}>*</span>
                </h2>

                <OutlinedInput type="number" className="Inputcontrol" placeholder="" {...register("applicantName")} />
              </FormControl>
            </div>
          </div>
          <br></br>
          <div className="row-12">
            <div className="col md={4} xxl lg-4">
              <FormControl>
                <h2 className="FormLable">
                  {" "}
                  Mobile
                  <span style={{ color: "red" }}>*</span>
                </h2>
                <OutlinedInput type="number" className="Inputcontrol" placeholder="" {...register("mobile")} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">
                  {" "}
                  Email-Address <span style={{ color: "red" }}>*</span>{" "}
                </h2>

                <OutlinedInput type="number" className="Inputcontrol" placeholder="" {...register("emailAddress")} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">
                  {" "}
                  Address
                  <span style={{ color: "red" }}>*</span>
                </h2>
                <OutlinedInput type="number" className="Inputcontrol" placeholder="" {...register("address")} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">
                  {" "}
                  Village <span style={{ color: "red" }}>*</span>
                </h2>
                <OutlinedInput type="number" className="Inputcontrol" placeholder="" {...register("village")} />
              </FormControl>
            </div>
          </div>
          <br></br>
          <div className="row-12">
            <div className="col md={4} xxl lg-4">
              <FormControl>
                <h2 className="FormLable">
                  {" "}
                  Tehsil
                  <span style={{ color: "red" }}>*</span>
                </h2>

                <OutlinedInput type="number" className="Inputcontrol" placeholder="" {...register("tehsil")} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">
                  {" "}
                  Pin code
                  <span style={{ color: "red" }}>*</span>
                </h2>
                <OutlinedInput type="number" className="Inputcontrol" placeholder="" {...register("pinCode")} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">
                  {" "}
                  Reason for Delay
                  <span style={{ color: "red" }}>*</span>
                </h2>

                <OutlinedInput type="number" className="Inputcontrol" placeholder="" {...register("reasonDelay")} />
              </FormControl>
            </div>
          </div>
          <br></br>
          <div className="table table-bordered table-responsive">
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>Sr.No</th>
                <th style={{ textAlign: "center" }}>Field Name</th>
                <th style={{ textAlign: "center" }}>Upload Documents</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>
                  Upload BR-III<span style={{ color: "red" }}>*</span>
                </td>
                <td>
                  <input type="file" className="form-control" placeholder="" {...register("uploadbrIII")}></input>
                </td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>
                  {" "}
                  Upload photographs of building under construction showing the status of construction at the site{" "}
                  <span style={{ color: "red" }}>*</span>
                </td>
                <td>
                  <input type="file" className="form-control" placeholder="" {...register("uploadPhotographs")}></input>
                </td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>
                  {" "}
                  Receipt of application if any submitted for taking occupation certificate <span style={{ color: "red" }}>*</span>
                </td>
                <td>
                  <input type="file" className="form-control" placeholder="" {...register("receiptApplication")}></input>
                </td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>
                  {" "}
                  Upload approved Building Plan <span style={{ color: "red" }}>*</span>
                </td>
                <td>
                  <input type="file" className="form-control" placeholder="" {...register("uploadBuildingPlan")}></input>
                </td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td>
                  {" "}
                  Indemnity Bond <span style={{ color: "red" }}>*</span>
                </td>
                <td>
                  <input type="file" className="form-control" placeholder="" {...register("indemnityBond")}></input>
                </td>
              </tr>
            </tbody>
          </div>
          <div class="row">
            <div class="col-sm-12 text-right">
              <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
                Submit
              </button>
            </div>
            <div class="col-sm-12 text-right">
              <button id="btnSearch" class="btn btn-primary btn-md center-block" style={{ marginTop: "-58px", marginRight: "97px" }}>
                Save as Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default ExtensionClu;
